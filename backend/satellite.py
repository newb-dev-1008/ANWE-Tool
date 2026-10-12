"""CDSE catalogue and reproducible surface-reflectance processing; no secret in client."""
import hashlib
import io
import json
import math
import os
import threading
import time
from pathlib import Path
from datetime import datetime, timedelta
import numpy as np
import rasterio
from rasterio.io import MemoryFile
from PIL import Image
from .common import CACHE, RUNTIME, ServiceError, atomic_json, request, now
from .case import CASE

STAC = 'https://stac.dataspace.copernicus.eu/v1'
PROCESS = 'https://sh.dataspace.copernicus.eu/process/v1'
TOKEN = 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token'
PROCESS_LOCK = threading.Lock()
TOKEN_CACHE={'value':None,'expires':0}
MASK_CLASSES = [0, 1, 2, 3, 6, 7, 8, 9, 10, 11]
LIMITATIONS = ('SCL masking may miss cloud or smoke. Water, uncertain/dark pixels, clouds, shadows and snow are excluded; this can omit dark burned surfaces. '
               'Nearest-neighbour resampling to a common 60 m Web Mercator grid is a prototype compromise (ground spacing differs with latitude), not a native-resolution analysis. '
               'Season, drought, atmospheric correction and phenology can affect NDVI/NBR changes. Indices are not measured ecological damage, animal mortality or quantitative soil moisture. Regional statistics include unburned land unless a reviewed perimeter is applied.')

def catalogue():
    def load():
        images = []
        for phase, interval in [('pre','2022-05-20T00:00:00Z/2022-06-14T23:59:59Z'),
                                ('post','2022-06-20T00:00:00Z/2022-07-05T23:59:59Z'),
                                ('recovery','2023-06-01T00:00:00Z/2023-06-30T23:59:59Z')]:
            data = request(STAC+'/search',params={'collections':'sentinel-2-l2a','bbox':','.join(map(str,CASE['bbox'])),
                                                 'datetime':interval,'limit':100}).json()
            for f in data.get('features',[]):
                props = f.get('properties',{})
                date = props.get('datetime')
                if not date: continue
                item = {'id':f['id'],'phase':phase,'date':date,'cloudCover':props.get('eo:cloud_cover'),
                        'bbox':f.get('bbox'),'geometry':f.get('geometry'),
                        'url':STAC+'/collections/sentinel-2-l2a/items/'+f['id'],
                        'thumbnail':f.get('assets',{}).get('thumbnail',{}).get('href'),
                        'license':'Copernicus Sentinel legal notice (collection licence: other)',
                        'bandsAvailable':[b for b in ['B04_10m','B08_10m','B12_20m','SCL_20m'] if b in f.get('assets',{})]}
                images.append(item)
        return {'status':'available','retrievedAt':now(),'images':images,
                'limitations':'Catalogue metadata and full-tile quicklooks are real; thumbnails are not georeferenced analysis rasters. Cloud cover is tile-wide. Search capped at 100 products per period. The recovery period may include effects of the separate July 2022 fire.'}
    return CACHE.get('culebra-stac-v4',load,86400)

def mercator(lng, lat):
    return (6378137*math.radians(lng), 6378137*math.log(math.tan(math.pi/4+math.radians(lat)/2)))

def grid():
    b = CASE['bbox']
    west, south = mercator(b[0],b[1]); east, north = mercator(b[2],b[3])
    bounds = [math.floor(west/60)*60, math.floor(south/60)*60, math.ceil(east/60)*60, math.ceil(north/60)*60]
    return bounds, round((bounds[2]-bounds[0])/60), round((bounds[3]-bounds[1])/60)

EVALSCRIPT = '''//VERSION=3
function setup() {
  return {input:[{bands:["B04","B08","B12","B02","B03","SCL","dataMask"],
    units:["REFLECTANCE","REFLECTANCE","REFLECTANCE","REFLECTANCE","REFLECTANCE","DN","DN"]}],
    output:{id:"default",bands:7,sampleType:"FLOAT32"}};
}
function evaluatePixel(s) { return [s.B04,s.B08,s.B12,s.B02,s.B03,s.SCL,s.dataMask]; }
'''

def process_body(acquisition):
    date = datetime.fromisoformat(acquisition.replace('Z','+00:00'))
    bounds,width,height = grid()
    if max(width,height) > 1200: raise ServiceError('Processing window too large.',400)
    return {'input':{'bounds':{'bbox':bounds,'properties':{'crs':'http://www.opengis.net/def/crs/EPSG/0/3857'}},
                     'data':[{'type':'sentinel-2-l2a','dataFilter':{'timeRange':{'from':(date-timedelta(minutes=15)).isoformat(),
                              'to':(date+timedelta(minutes=15)).isoformat()},'mosaickingOrder':'mostRecent'},
                              'processing':{'upsampling':'NEAREST','downsampling':'NEAREST','harmonizeValues':False}}]},
            'output':{'width':width,'height':height,'responses':[{'identifier':'default','format':{'type':'image/tiff'}}]},
            'evalscript':EVALSCRIPT}

def scene_indices(bands):
    if bands.ndim != 3 or bands.shape[0] != 7: raise ServiceError('Expected seven reflectance/mask bands.')
    red,nir,swir,blue,green,scl,mask = bands
    invalid = (~np.isfinite(bands).all(axis=0)) | (mask < .5) | np.isin(scl,MASK_CLASSES)
    # Conservative one-pixel buffer around cloud/shadow/unclassified pixels.
    cloud = np.isin(scl,[3,7,8,9,10])
    padded = np.pad(cloud,1,mode='constant',constant_values=False)
    for y in range(3):
        for x in range(3): invalid |= padded[y:y+cloud.shape[0],x:x+cloud.shape[1]]
    invalid |= (red < 0) | (nir < 0) | (swir < 0)
    def ratio(a,b):
        denom = a+b
        valid = ~invalid & (np.abs(denom)>1e-8)
        result = np.full(denom.shape,np.nan,dtype=np.float32)
        np.divide(a-b,denom,out=result,where=valid)
        return result
    return {'ndvi':ratio(nir,red),'nbr':ratio(nir,swir),'rgb':np.stack([red,green,blue]),'valid':~invalid}

def difference(pre,post):
    if pre.shape != post.shape: raise ServiceError('Pre/post grids differ.')
    valid=np.isfinite(pre)&np.isfinite(post)
    return np.where(valid,pre-post,np.nan).astype(np.float32)

def statistics(array):
    valid = array[np.isfinite(array)]
    return {'validPixels':int(valid.size),'totalPixels':int(array.size),
            'mean':float(valid.mean()) if valid.size else None,
            'min':float(valid.min()) if valid.size else None,'max':float(valid.max()) if valid.size else None}

def colour_image(values, kind):
    valid=np.isfinite(values)
    norm=np.clip((np.nan_to_num(values)+1)/2,0,1) if kind=='ndvi' else np.clip((np.nan_to_num(values)+.5)/2,0,1)
    if kind=='ndvi': rgb=np.stack([190*(1-norm)+20*norm,80*(1-norm)+170*norm,55*(1-norm)+95*norm],axis=-1)
    else: rgb=np.stack([70*(1-norm)+215*norm,150*(1-norm)+70*norm,170*(1-norm)+35*norm],axis=-1)
    return np.concatenate([rgb.astype('uint8'),(valid*255).astype('uint8')[...,None]],axis=-1)

def configured():
    return bool(os.environ.get('CDSE_CLIENT_ID') and os.environ.get('CDSE_CLIENT_SECRET'))

def access_token():
    if TOKEN_CACHE['value'] and time.time()<TOKEN_CACHE['expires']:return TOKEN_CACHE['value']
    data=request(TOKEN,method='POST',data={'grant_type':'client_credentials','client_id':os.environ['CDSE_CLIENT_ID'],
                                         'client_secret':os.environ['CDSE_CLIENT_SECRET']}).json()
    token=data.get('access_token')
    if not token:raise ServiceError('Copernicus token response incomplete.')
    TOKEN_CACHE.update(value=token,expires=time.time()+int(data.get('expires_in',300))-60)
    return token

def cached_analyses():
    directory=RUNTIME/'satellite'
    if not directory.exists():return []
    paths=sorted(directory.glob('*/manifest.json'),key=lambda p:p.stat().st_mtime,reverse=True)[:10]
    return [json.loads(path.read_text(encoding='utf-8')) for path in paths]

def reserve_analysis():
    path=RUNTIME/'satellite-budget.json';today=now()[:10]
    try:data=json.loads(path.read_text(encoding='utf-8'))
    except (OSError,ValueError):data={'day':today,'analyses':0}
    if data.get('day')!=today:data={'day':today,'analyses':0}
    limit=max(1,min(int(os.environ.get('CDSE_MAX_ANALYSES_PER_DAY','3')),10))
    if data.get('analyses',0)>=limit:raise ServiceError('Daily Copernicus analysis cap reached; cached analyses remain available.',429)
    data['analyses']+=1;atomic_json(path,data)

def run_analysis(pre_id, post_id):
    if not configured(): raise ServiceError('Satellite processing disabled: configure CDSE_CLIENT_ID and CDSE_CLIENT_SECRET.',503)
    cat=catalogue()['images']
    pre=next((i for i in cat if i['id']==pre_id and i['phase']=='pre'),None)
    post=next((i for i in cat if i['id']==post_id and i['phase'] in ['post','recovery']),None)
    if not pre or not post: raise ServiceError('Select retrieved pre-fire and post-fire/recovery catalogue items.',400)
    identifier=hashlib.sha256((pre_id+post_id+'v3-mask60').encode()).hexdigest()[:24]
    out=RUNTIME/'satellite'/identifier
    if (out/'manifest.json').exists(): return json.loads((out/'manifest.json').read_text(encoding='utf-8'))
    if not PROCESS_LOCK.acquire(blocking=False): raise ServiceError('A satellite analysis is already running.',409)
    try:
        reserve_analysis()
        token=access_token()
        indices={}
        out.mkdir(parents=True,exist_ok=True)
        for phase,item in [('pre',pre),('post',post)]:
            response=request(PROCESS,method='POST',headers={'Authorization':'Bearer '+token},json=process_body(item['date']),timeout=150)
            with MemoryFile(response.content) as mem:
                with mem.open() as ds:
                    bounds,width,height=grid()
                    if ds.crs != rasterio.crs.CRS.from_epsg(3857) or ds.width!=width or ds.height!=height or not np.allclose(ds.bounds,bounds,atol=.01):
                        raise ServiceError('Satellite raster spatial alignment does not match the requested common grid.')
                    indices[phase]=scene_indices(ds.read())
                    (out/(phase+'.tif')).write_bytes(response.content)
            rgb=indices[phase]['rgb']
            rgba=np.concatenate([(np.clip(np.moveaxis(rgb,0,-1)*2.5,0,1)*255).astype('uint8'),
                                 (indices[phase]['valid']*255).astype('uint8')[...,None]],axis=-1)
            Image.fromarray(rgba).save(out/(phase+'-rgb.png'))
            Image.fromarray(colour_image(indices[phase]['ndvi'],'ndvi')).save(out/(phase+'-ndvi.png'))
        dnbr=difference(indices['pre']['nbr'],indices['post']['nbr'])
        Image.fromarray(colour_image(dnbr,'dnbr')).save(out/'dnbr.png')
        np.savez_compressed(out/'values.npz',pre_ndvi=indices['pre']['ndvi'],post_ndvi=indices['post']['ndvi'],
                            pre_nbr=indices['pre']['nbr'],post_nbr=indices['post']['nbr'],dnbr=dnbr)
        bounds,width,height=grid()
        west=math.degrees(bounds[0]/6378137);east=math.degrees(bounds[2]/6378137)
        south=math.degrees(2*math.atan(math.exp(bounds[1]/6378137))-math.pi/2)
        north=math.degrees(2*math.atan(math.exp(bounds[3]/6378137))-math.pi/2)
        manifest={'status':'available','id':identifier,'createdAt':now(),'pre':pre,'post':post,'bbox':[west,south,east,north],
                  'projectedBounds':bounds,'width':width,'height':height,'grid':'EPSG:3857; 60 m projected pixels; NEAREST',
                  'method':'NDVI=(B08-B04)/(B08+B04); NBR=(B08-B12)/(B08+B12); dNBR=pre NBR-post NBR; REFLECTANCE units, harmonizeValues=false; SCL/dataMask plus one-pixel cloud buffer; valid paired pixels only',
                  'statistics':{'preNDVI':statistics(indices['pre']['ndvi']),'postNDVI':statistics(indices['post']['ndvi']),'dNBR':statistics(dnbr)},
                  'limitations':LIMITATIONS,'coverage':CASE['coverageLabel'],
                  'layers':{name:f'/api/satellite/assets/{identifier}/{name}.png' for name in ['pre-rgb','post-rgb','pre-ndvi','post-ndvi','dnbr']}}
        atomic_json(out/'manifest.json',manifest)
        return manifest
    finally: PROCESS_LOCK.release()

def sample(identifier,lng,lat):
    if not isinstance(identifier,str) or len(identifier)!=24 or any(c not in '0123456789abcdef' for c in identifier): raise ServiceError('Invalid analysis identifier.',400)
    path=RUNTIME/'satellite'/identifier
    if not (path/'manifest.json').exists(): raise ServiceError('Analysis not found.',404)
    info=json.loads((path/'manifest.json').read_text(encoding='utf-8'))
    x,y=mercator(lng,lat);b=info['projectedBounds']
    col=int(math.floor((x-b[0])/60));row=int(math.floor((b[3]-y)/60))
    if not 0<=col<info['width'] or not 0<=row<info['height']: return {'status':'outside-grid','values':{}}
    with np.load(path/'values.npz') as arrays:
        return {'status':'sampled','method':'Nearest common-grid pixel; null means masked or no data',
                'values':{key:float(arrays[key][row,col]) if np.isfinite(arrays[key][row,col]) else None for key in arrays.files}}
