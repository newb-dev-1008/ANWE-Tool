import hashlib
import json
import threading
from .case import CASE, FIRE_EVIDENCE
from .common import now

class EvidenceStore:
    def __init__(self):
        self.lock=threading.RLock()
        self.records={FIRE_EVIDENCE['id']:FIRE_EVIDENCE}
        self.sources={}
        from .fire import fire_status
        perimeter=fire_status().get('perimeter')
        if perimeter:
            m=perimeter['metadata']
            self.records['cems-EMSR580-mapped-extent']={'id':'cems-EMSR580-mapped-extent','kind':'Derived','source':m['source'],
                'datasetId':m['datasetId'],'date':m['date'],'coverage':'CEMS mapped burnt-area polygons in Culebra',
                'measurements':{'sourceSensor':m['sensor'],'observationDate':m['date'],'mappedPolygons':len(perimeter['geojson']['features'])},
                'method':m['method'],'limitations':m['limitations'],'url':m['url'],'license':m['license']}

    def put(self,source,data):
        with self.lock:
            self.sources[source]=data
            prefix={'gbif':'gbif-','satellite':'sentinel-','analysis':'analysis-','comparison':'comparison-','context':'context-'}.get(source)
            if prefix: self.records={k:v for k,v in self.records.items() if not k.startswith(prefix)}
            if source=='gbif':
                for r in data.get('records',[]): self.records[r['id']]=r
            if source=='context':
                for r in data.get('records',[]): self.records[r['id']]=r
            if source=='satellite':
                for image in data.get('images',[]):
                    rec={'id':'sentinel-'+image['id'],'kind':'Observed','source':'Copernicus Data Space STAC',
                         'datasetId':image['id'],'date':image['date'],'coverage':'Sentinel tile footprint intersects regional search window',
                         'measurements':{'acquisitionDate':image['date'],'tileCloudCover':image.get('cloudCover')},
                         'method':'Retrieved Sentinel-2 L2A catalogue metadata only; not pixel analysis',
                         'limitations':'Tile-wide cloud cover is not site-wide cloud cover. Thumbnail is not a quantitative raster.',
                         'url':image['url'],'license':image['license']}
                    self.records[rec['id']]=rec
            if source=='analysis':
                rec={'id':'analysis-'+data['id'],'kind':'Derived','source':'ANWE processing of CDSE Sentinel-2 L2A reflectance',
                     'datasetId':data['id'],'date':data['post']['date'],'coverage':data['coverage'],
                     'measurements':data['statistics'],'method':data['method'],'limitations':data['limitations'],
                     'url':'https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/S2L2A.html',
                     'license':data['post']['license']}
                self.records[rec['id']]=rec
            if source=='comparison':
                measures={'fireStart':CASE['eventStart'],'beforeStart':data['parameters']['beforeStart'],
                          'beforeEnd':data['parameters']['beforeEnd'],'afterStart':data['parameters']['afterStart'],
                          'afterEnd':data['parameters']['afterEnd'],'bufferKm':data['parameters']['bufferKm'],
                          'observationDateAudit':data['dateAudit']}
                for phase in ['before','after']:
                    measures[phase]={zone:{k:v for k,v in stats.items() if k in ['records','distinctSpecies','groups','unresolvedSpecies']} for zone,stats in data[phase]['zones'].items()}
                    measures[phase+'Truncated']=str(data[phase]['truncated'])
                    for zone in ['burned','buffer','uncertain']:
                        names=list(data[phase]['zones'][zone]['species'].values())
                        measures[phase+zone+'SpeciesSample']='; '.join(names[:30]) or 'No species resolved in retrieved records; not proof of absence'
                rec={'id':'comparison-'+data['id'],'kind':'Derived','source':'ANWE temporal comparison of GBIF indexed observations',
                     'datasetId':data['id'],'date':data['retrievedAt'],'coverage':data['geography']['method'],
                     'measurements':measures,'method':data['method'],'limitations':data['limitations']+' '+data['warning']+' Species names in model context capped at thirty per zone/period.',
                     'url':'https://techdocs.gbif.org/en/openapi/v1/occurrence','license':'GBIF constituent dataset licences retained in comparison records'}
                self.records[rec['id']]=rec

    def snapshot(self):
        with self.lock:
            records=[self.records[id] for id in sorted(self.records)]
            version=hashlib.sha256(json.dumps(records,sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:16]
            return {'version':version,'case':CASE,'records':records,'sources':dict(self.sources),'createdAt':now()}

    def relevant(self,question):
        snapshot=self.snapshot()
        tokens=set(question.lower().split())
        official=[r for r in snapshot['records'] if not r['id'].startswith(('gbif-','sentinel-'))]
        species=[r for r in snapshot['records'] if r['id'].startswith('gbif-')]
        species.sort(key=lambda r:len(tokens & set((r.get('scientificName','')+' '+r.get('class','')).lower().split())),reverse=True)
        images=[r for r in snapshot['records'] if r['id'].startswith('sentinel-')]
        # Small context; source limits are disclosed, not presented as absence.
        selected=official+species[:18]+images[:4]
        return snapshot['version'],selected

STORE=EvidenceStore()
