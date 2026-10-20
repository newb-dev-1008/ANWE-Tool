"""Bounded public regional context; exposure proxies are never a risk assessment."""
from concurrent.futures import ThreadPoolExecutor
import io
import zipfile
from shapely.geometry import Point
from .common import CACHE, request, now, ServiceError
from .case import CASE
from .comparison import perimeter, FORWARD
from .biodiversity import load_biodiversity, API

LIMITS = ('Contemporary settlement and land-use records are incomplete and do not reconstruct conditions during the June 2022 fire. '
          'Distances use mapped representative points, not building edges or evacuation routes. Proximity is potential exposure, not proof of danger, casualties or safe conditions. '
          'Land-use tags are activity proxies, not employment, income, dependence or economic loss. Population, fire behaviour, smoke, evacuation capacity and essential needs remain unverified.')

def normalise_places(raw):
    if raw.get('remark'):raise ServiceError('Mapping source returned an incomplete query; try again later.')
    geom=perimeter()
    places=[]; activities={}
    for item in raw.get('elements',[])[:1500]:
        tags=item.get('tags',{}); center=item.get('center',item)
        if tags.get('landuse'):activities[tags['landuse']]=activities.get(tags['landuse'],0)+1
        if tags.get('place') not in ('city','town','village','hamlet','isolated_dwelling','populated_place'):continue
        if not isinstance(center.get('lon'),(int,float)) or not isinstance(center.get('lat'),(int,float)):continue
        point=Point(*FORWARD(center['lon'],center['lat']))
        places.append({'name':str(tags.get('name','Unnamed mapped settlement'))[:160], 'type':tags['place'],
                       'distanceKm':round(point.distance(geom)/1000,2),
                       'url':item.get('sourceUrl') or f"https://www.openstreetmap.org/{item['type']}/{item['id']}"})
    places.sort(key=lambda p:p['distanceKm'])
    return {'settlements':places[:30], 'mappedSettlementCount':len(places), 'landUseFeatureCounts':activities,
            'truncated':len(raw.get('elements',[]))>=1500}

def settlements():
    def load():
        w,s,e,n=CASE['bbox']; bbox=f'{s},{w},{n},{e}'
        query=f'[out:json][timeout:25];(nwr[place~"^(city|town|village|hamlet|isolated_dwelling)$"]({bbox});way[landuse~"^(farmland|farmyard|vineyard|orchard|industrial|commercial|forest)$"]({bbox}););out center 1500;'
        headers={'User-Agent':'TierraDelFuego-ANWE/1.0 (university restoration decision-support demo)'}
        try:
            raw=request('https://overpass-api.de/api/interpreter',params={'data':query},headers=headers,timeout=15).json()
            data=normalise_places(raw);source='OpenStreetMap via Overpass'
        except ServiceError:
            data=normalise_places(geonames_places());source='GeoNames Spain gazetteer (fallback; land use unavailable)'
            data['landUseStatus']='unavailable: OpenStreetMap request failed; GeoNames supplies settlement points only'
        return {**data,'retrievedAt':now(),'retrievalSource':source}
    return CACHE.get('culebra-human-context-v3',load,86400)

def parse_geonames(text):
    w,s,e,n=CASE['bbox'];features=[]
    for line in text.splitlines():
        row=line.split('\t')
        if len(row)<19 or row[6]!='P' or row[8]!='ES':continue
        if row[7] not in ('PPL','PPLA','PPLA2','PPLA3','PPLA4','PPLC','PPLL','PPLF'):continue
        try:lat,lon=float(row[4]),float(row[5]);key=int(row[0])
        except ValueError:continue
        if not w<=lon<=e or not s<=lat<=n:continue
        features.append({'type':'geonames','id':key,'tags':{'place':'populated_place','name':row[1]},
                         'center':{'lon':lon,'lat':lat},'sourceUrl':f'https://www.geonames.org/{key}/'})
    return {'elements':features}

def geonames_places():
    response=request('https://download.geonames.org/export/dump/ES.zip',stream=True,timeout=35)
    chunks=[];size=0
    try:
        for chunk in response.iter_content(65536):
            size+=len(chunk)
            if size>15_000_000:raise ServiceError('Settlement download exceeds the bounded limit.')
            chunks.append(chunk)
    finally:response.close()
    try:
        with zipfile.ZipFile(io.BytesIO(b''.join(chunks))) as archive:
            if archive.getinfo('ES.txt').file_size>80_000_000:raise ServiceError('Settlement archive exceeds the bounded limit.')
            return parse_geonames(archive.read('ES.txt').decode('utf-8'))
    except (zipfile.BadZipFile,KeyError,UnicodeDecodeError):raise ServiceError('Settlement source returned an invalid archive.') from None

def conservation():
    records=load_biodiversity()['records']
    taxa={r['taxonKey']:r['scientificName'] for r in records if isinstance(r.get('taxonKey'),int)}
    def lookup(pair):
        key,name=pair
        try:
            raw=CACHE.get('iucn-gbif-'+str(key),lambda:request(API+f'/species/{key}/iucnRedListCategory',timeout=12).json(),86400*7)
            return {'taxon':name,'taxonKey':key,'assessment':raw,'url':f'https://www.gbif.org/species/{key}', 'status':'retrieved'}
        except ServiceError:return {'taxon':name,'taxonKey':key,'status':'unavailable'}
    with ThreadPoolExecutor(max_workers=4) as pool:rows=list(pool.map(lookup,list(taxa.items())[:12]))
    return {'records':rows,'sampledTaxa':len(rows),'retrievedAt':now(),
            'limitations':'Up to twelve taxa from the bounded regional GBIF sample. IUCN categories relayed by GBIF are global conservation assessments, not local abundance or individual welfare; no category means unknown, not safe.'}

def load_context():
    result={'retrievedAt':now(),'coverage':CASE['coverageLabel'],'limitations':LIMITS,'records':[]}
    for key,loader,url in [('settlements',settlements,'https://www.openstreetmap.org/copyright'),('conservation',conservation,'https://techdocs.gbif.org/en/openapi/v1/species')]:
        try:
            data=loader();result[key]={'status':'available',**data}
            if key=='settlements' and 'GeoNames' in data.get('retrievalSource',''):url='https://download.geonames.org/export/dump/readme.txt'
            result['records'].append({'id':'context-'+key,'kind':'Derived','source':data.get('retrievalSource','OpenStreetMap') if key=='settlements' else 'GBIF species API / IUCN Red List',
              'datasetId':'culebra-context-'+key,'date':data['retrievedAt'],'coverage':CASE['coverageLabel'],
              'measurements':data,'method':'Bounded public lookup; settlement-point distance to generalised CEMS mapped footprint' if key=='settlements' else 'Taxon-key lookup; assessment retained as returned by GBIF',
              'limitations':LIMITS if key=='settlements' else data['limitations'],'url':url,'license':('CC BY 4.0 / GeoNames' if 'GeoNames' in data.get('retrievalSource','') else 'ODbL / OpenStreetMap contributors') if key=='settlements' else 'Check linked GBIF and IUCN source terms'})
        except ServiceError as exc:result[key]={'status':'unavailable','reason':str(exc)}
    return result
