"""Retrieve selected files by HTTP Range from the official CEMS vector package.
Never invent an EFFIS perimeter. Metadata/provenance are stored beside the geometry.
"""
import io, json, zipfile, hashlib, sys
from pathlib import Path
import requests

URL = 'https://cems-mapping-website.s3.eu-west-1.amazonaws.com/static/activations/EMSR580/EMSR580_AOI01_GRA_PRODUCT_r1_RTP01_v1_vector.zip'

class RangeFile(io.RawIOBase):
    def __init__(self):
        r=requests.head(URL,timeout=30);r.raise_for_status()
        self.size=int(r.headers['Content-Length']);self.pos=0
    def seekable(self):return True
    def readable(self):return True
    def tell(self):return self.pos
    def seek(self,offset,whence=0):
        self.pos=offset if whence==0 else self.pos+offset if whence==1 else self.size+offset
        return self.pos
    def read(self,n=-1):
        if n<0:n=self.size-self.pos
        n=min(n,self.size-self.pos)
        if n<=0:return b''
        if n>8_000_000:raise ValueError('Selected range too large; download manually instead')
        r=requests.get(URL,headers={'Range':f'bytes={self.pos}-{self.pos+n-1}'},timeout=45)
        if r.status_code!=206:raise ValueError('Server did not honour Range request')
        content=r.content
        if len(content)!=n:raise ValueError('Incomplete byte range')
        self.pos+=len(content);return content

if __name__=='__main__':
    z=zipfile.ZipFile(RangeFile())
    name='EMSR580_AOI01_GRA_PRODUCT_observedEventA_r1_v1.json'
    raw=z.read(name)
    data=json.loads(raw)
    print('CRS',data.get('crs'),'FEATURES',len(data.get('features',[])))
    print('PROPERTIES',data['features'][0]['properties'])
    print('GEOMETRY',data['features'][0]['geometry']['type'])
    directory=Path(__file__).resolve().parent.parent/'.runtime'
    directory.mkdir(exist_ok=True)
    (directory/'cems-observed-original.json').write_bytes(raw)
    xml=z.read('EMSR580_AOI01_GRA_PRODUCT_observedEventA_r1_v1.xml').decode()
    (directory/'cems-metadata.xml').write_text(xml,encoding='utf-8')
    print('Saved source; SHA256',hashlib.sha256(raw).hexdigest())
    import shapefile
    dbf=z.read('EMSR580_AOI01_GRA_PRODUCT_source_r1_v1.dbf')
    table=shapefile.Reader(dbf=io.BytesIO(dbf))
    print('SOURCE FIELDS',table.fields)
    print('SOURCE RECORDS',table.records())
    from shapely.geometry import shape, mapping
    features=[]
    for feature in data['features']:
        if feature['properties'].get('notation')!='Burnt area':continue
        geom=shape(feature['geometry'])
        if not geom.is_valid:raise ValueError('Invalid source geometry; review required')
        generalised=geom.simplify(.00015,preserve_topology=True)
        features.append({'type':'Feature','properties':{'notation':'Burnt area','sourceId':3},'geometry':mapping(generalised)})
    output={'status':'official-source-derived-display','verification':'Downloaded directly from official CEMS vector package; not an EFFIS perimeter',
            'geojson':{'type':'FeatureCollection','features':features},
            'metadata':{'source':'Copernicus EMS Rapid Mapping','datasetId':'EMSR580_AOI01_GRA_PRODUCT_r1_RTP01_v1',
                        'date':'2022-06-25T10:44:58Z','published':'2022-06-26',
                        'url':'https://mapping.emergency.copernicus.eu/activations/EMSR580/',
                        'downloadUrl':URL,'member':name,'sourceSha256':hashlib.sha256(raw).hexdigest(),
                        'sensor':'SPOT-6-7; source record 3; photo-interpretation',
                        'license':'Copernicus EMS Terms and Conditions; see source metadata for third-party rights',
                        'licenseUrl':'https://mapping.emergency.copernicus.eu/terms-and-conditions/',
                        'method':'505 original mapped burnt-area polygons; topology-preserving simplification at 0.00015 degrees for display. Original source retained locally; no invented outline or area estimate.',
                        'limitations':'Mapped burnt area observed on 25 June, not necessarily final incident extent. Display generalisation is not suitable for cadastral or pixel-level decisions. No EFFIS attribution or severity class inferred.'}}
    target=directory.parent/'data'/'culebra-perimeter.json'
    target.write_text(json.dumps(output,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    print('Stored official-source display layer',target.name,target.stat().st_size)
