"""Bounded GBIF observation comparison; no population or absence inference."""
import hashlib
import json
import math
import re
import threading
from datetime import date
from functools import lru_cache
from pyproj import Transformer
from shapely.geometry import Point, shape
from shapely.ops import transform, unary_union
from .common import CACHE, ROOT, ServiceError, request, now
from .case import CASE
from .biodiversity import API

DEFAULTS={'beforeStart':'2021-06-01','beforeEnd':'2021-06-30','afterStart':'2023-06-01','afterEnd':'2023-06-30','bufferKm':5,'group':'All'}
GROUPS=['All','Mammalia','Aves','Amphibia','Reptilia','Insecta','Arachnida']
MAX_RECORDS=2100
LOCK=threading.Lock()
FORWARD=Transformer.from_crs(4326,32629,always_xy=True).transform
REVERSE=Transformer.from_crs(32629,4326,always_xy=True).transform
LIMITATIONS=('GBIF records are not a census. Counts and species lists refer to retrieved, date-eligible records, not populations. '
 'Unequal sampling effort, observer activity, reporting, seasonal variation, coverage and spatial uncertainty affect differences. '
 'Only-before does not mean disappearance; only-after does not mean recovery. No percentage-change interpretation. '
 'The June fire end date is unverified. After windows are post-start observations, not proof the incident was extinguished. '
 'The separate July 2022 wildfire may affect later records. The perimeter is a generalised CEMS observation from 25 June, not an exact final boundary.')

def parameters(values=None):
    supplied=values or {}
    p={**DEFAULTS,**{k:v for k,v in supplied.items() if k in DEFAULTS}}
    try:
        for key in ['beforeStart','beforeEnd','afterStart','afterEnd']:
            if not isinstance(p[key],str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}',p[key]):raise ValueError()
            p[key]=date.fromisoformat(p[key]).isoformat()
        if isinstance(p['bufferKm'],bool):raise ValueError()
        p['bufferKm']=float(p['bufferKm'])
        if not math.isfinite(p['bufferKm']) or not .5<=p['bufferKm']<=20:raise ValueError()
        if p['group'] not in GROUPS:raise ValueError()
        for phase in ['before','after']:
            a,b=[date.fromisoformat(p[phase+k]) for k in ['Start','End']]
            if b<a or (b-a).days>366:raise ValueError()
        if p['beforeEnd']>=CASE['eventStart'] or p['afterStart']<='2022-06-25':raise ValueError()
    except (ValueError,TypeError):
        raise ServiceError('Choose valid non-overlapping dates: before 15 June 2022 and after the 25 June mapped observation; each window at most one year. Buffer must be 0.5–20 km.',400) from None
    return p

def observation_date(raw):
    """Do not fall back to modified, indexed or uploaded timestamps."""
    value=raw.get('eventDate')
    if not isinstance(value,str) or not value.strip():return None,'missing'
    if '/' in value:return None,'interval-or-imprecise'
    if not re.match(r'^\d{4}-\d{2}-\d{2}(?:T.*)?$',value):return None,'interval-or-imprecise'
    try:return date.fromisoformat(value[:10]),'day'
    except ValueError:return None,'invalid'

@lru_cache(maxsize=1)
def perimeter():
    obj=json.loads((ROOT/'data/culebra-perimeter.json').read_text(encoding='utf-8'))
    return transform(FORWARD,unary_union([shape(f['geometry']) for f in obj['geojson']['features']]))

def spatial_class(raw, burned, outer):
    xy=[raw.get('decimalLongitude'),raw.get('decimalLatitude')]
    if any(isinstance(v,bool) or not isinstance(v,(float,int)) or not math.isfinite(v) for v in xy):return 'unlocated'
    if not -180<=xy[0]<=180 or not -85<=xy[1]<=85:return 'unlocated'
    point=Point(*FORWARD(*xy))
    if not outer.covers(point):return 'outside'
    nominal='burned' if burned.covers(point) else 'buffer'
    uncertainty=raw.get('coordinateUncertaintyInMeters')
    if not isinstance(uncertainty,(float,int)) or isinstance(uncertainty,bool) or not math.isfinite(uncertainty) or uncertainty<0:
        return 'uncertain' # No precision evidence means nominal membership is not defensible.
    if uncertainty and (point.distance(burned.boundary)<=uncertainty or point.distance(outer.boundary)<=uncertainty):return 'uncertain'
    return nominal

def fetch_records(query,cap=MAX_RECORDS):
    results=[];total=0
    while len(results)<cap:
        data=request(API+'/occurrence/search',params={**query,'limit':min(300,cap-len(results)),'offset':len(results)}).json()
        if not isinstance(data.get('results'),list) or not isinstance(data.get('count'),int):raise ServiceError('GBIF returned an invalid occurrence response.')
        batch=data['results'];total=data['count'];results.extend(batch)
        if data.get('endOfRecords') or not batch:break
    return results,total

def summary(records):
    species={str(r['speciesKey']):r['species'] for r in records if r.get('speciesKey') and r.get('species')}
    groups={}
    for r in records:
        g=r['class'];groups[g]=groups.get(g,0)+1
    return {'records':len(records),'distinctSpecies':len(species),'species':species,'groups':groups,
            'unresolvedSpecies':sum(not r.get('speciesKey') or not r.get('species') for r in records)}

def compare_records(before,after,params,burned=None,audit=None,totals=None):
    burned=perimeter() if burned is None else burned
    outer=burned.buffer(params['bufferKm']*1000)
    output={};all_records=[]
    for phase,raws in [('before',before),('after',after)]:
        quality={'missingDates':0,'impreciseDates':0,'outsideWindow':0,'spatiallyUncertain':0,'unlocated':0,'outsideArea':0,'geospatialIssues':0,'excludedAbsentOrNonanimal':0,'duplicateIds':0}
        buckets={'burned':[],'buffer':[],'uncertain':[]};seen=set()
        for raw in raws:
            key=raw.get('key')
            if not isinstance(key,int) or isinstance(key,bool):continue
            if key in seen:quality['duplicateIds']+=1;continue
            seen.add(key)
            if raw.get('kingdom')!='Animalia' or raw.get('occurrenceStatus')=='ABSENT':quality['excludedAbsentOrNonanimal']+=1;continue
            if params['group']!='All' and raw.get('class')!=params['group']:continue
            observed,precision=observation_date(raw)
            if observed is None:
                quality['missingDates' if precision=='missing' else 'impreciseDates']+=1;continue
            if not date.fromisoformat(params[phase+'Start'])<=observed<=date.fromisoformat(params[phase+'End']):quality['outsideWindow']+=1;continue
            if raw.get('hasGeospatialIssues') or any('COORDINATE_INVALID' in x or 'COUNTRY_COORDINATE_MISMATCH' in x for x in raw.get('issues',[])):
                quality['geospatialIssues']+=1;continue
            location=spatial_class(raw,burned,outer)
            if location in ['unlocated','outside']:
                quality['unlocated' if location=='unlocated' else 'outsideArea']+=1;continue
            if location=='uncertain':quality['spatiallyUncertain']+=1
            record={'id':'gbif-'+str(key),'date':observed.isoformat(),'phase':phase,'zone':location,
                    'speciesKey':raw.get('speciesKey'),'species':raw.get('species'),
                    'scientificName':raw.get('scientificName','Unresolved taxon'),'class':raw.get('class','Unclassified'),
                    'provider':raw.get('datasetName') or 'Dataset '+str(raw.get('datasetKey','Unknown')),
                    'datasetId':raw.get('datasetKey','Unknown'),'license':raw.get('license','Check source licence'),
                    'url':'https://www.gbif.org/occurrence/'+str(key),
                    'coordinateUncertaintyInMeters':raw.get('coordinateUncertaintyInMeters'),
                    'basisOfRecord':raw.get('basisOfRecord','Unknown'),'issues':raw.get('issues',[])[:12],
                    'location':'Coordinates withheld; uncertainty-aware zone classification only'}
            buckets[location].append(record);all_records.append(record)
        output[phase]={'zones':{zone:summary(recs) for zone,recs in buckets.items()},'quality':quality,
                       'retrieved':len(raws),'apiBoundingBoxCount':(totals or {}).get(phase,len(raws)),
                       'truncated':(totals or {}).get(phase,len(raws))>len(raws)}
    contrasts={}
    for zone in ['burned','buffer','uncertain']:
        a=output['before']['zones'][zone]['species'];b=output['after']['zones'][zone]['species']
        contrasts[zone]={'both':[{'key':k,'name':a[k]} for k in sorted(a.keys() & b.keys())],
                        'onlyBefore':[{'key':k,'name':a[k]} for k in sorted(a.keys()-b.keys())],
                        'onlyAfter':[{'key':k,'name':b[k]} for k in sorted(b.keys()-a.keys())]}
    audit=audit or []
    audit_quality={'retrieved':len(audit),'missingDates':sum(observation_date(r)[1]=='missing' for r in audit),
                   'impreciseDates':sum(observation_date(r)[1] in ['interval-or-imprecise','invalid'] for r in audit),
                   'scope':'Independent bounded all-date quality sample of the same bounding box; not a count of all undated records.'}
    identifier=hashlib.sha256(json.dumps(params,sort_keys=True).encode()).hexdigest()[:16]
    return {'status':'available','id':identifier,'parameters':params,'before':output['before'],'after':output['after'],
            'comparison':contrasts,'records':all_records,'dateAudit':audit_quality,'retrievedAt':now(),
            'fireStart':CASE['eventStart'],'fireEnd':None,'perimeterDate':'2022-06-25',
            'geography':{'method':'CEMS generalised polygons reprojected to UTM 29N (EPSG:32629); metric buffer outside burned polygon, identical geography for both windows.',
                         'bufferKm':params['bufferKm'],'geometryAccuracy':'Generalised display boundary; location precision unknown or uncertainty crossing a boundary is separate.',
                         'bbox':list(transform(REVERSE,outer).bounds)},
            'limitations':LIMITATIONS,'warning':'Retrieved subsets are insufficient for population trends or causal fire effects. Missing coordinate precision is reported separately.'}

def load_comparison(values=None):
    p=parameters(values)
    def load():
        if not LOCK.acquire(blocking=False):raise ServiceError('A biodiversity comparison is already loading.',409)
        try:
            burned=perimeter();outer=burned.buffer(p['bufferKm']*1000)
            b=transform(REVERSE,outer).bounds
            name='Animalia' if p['group']=='All' else p['group']
            match=CACHE.get('gbif-comparison-taxon-'+name,lambda:request(API+'/species/match',params={'name':name,'rank':'KINGDOM' if name=='Animalia' else 'CLASS'}).json(),86400*30)
            if not match.get('usageKey'):raise ServiceError('GBIF taxonomy unavailable for this group.')
            query={'taxonKey':match['usageKey'],'decimalLatitude':f'{b[1]},{b[3]}','decimalLongitude':f'{b[0]},{b[2]}',
                   'hasCoordinate':'true','occurrenceStatus':'PRESENT'}
            records={};totals={}
            for phase in ['before','after']:
                records[phase],totals[phase]=fetch_records({**query,'eventDate':p[phase+'Start']+','+p[phase+'End']})
            audit,_=fetch_records(query,300)
            result=compare_records(records['before'],records['after'],p,burned,audit,totals)
            result['method']='GBIF eventDate range search, paginated up to 2100 records per period; day-precision observation dates only. Species sets use GBIF speciesKey, not arbitrary name strings.'
            return result
        finally:LOCK.release()
    return CACHE.get('gbif-temporal-v1-'+json.dumps(p,sort_keys=True),load,86400)
