"""Run with python server.py. Local-only server; never serves secrets or runtime files."""
import json
import mimetypes
import os
import re
import secrets
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, unquote
from backend.common import ROOT, RUNTIME, ServiceError, load_env, atomic_json, request
from backend.case import CASE
from backend.fire import fire_status, validate_import
from backend.biodiversity import load_biodiversity
from backend.satellite import catalogue, run_analysis, sample, cached_analyses, configured as satellite_configured
from backend.evidence import STORE
from backend.ai import assess, configured as ai_configured

load_env()
CSRF=secrets.token_urlsafe(32)
STATIC={'index.html','style.css','app.js','workspace.js','integrations.js','data/scenario.js','data/geography.js','data/providers.js',
        'vendor/leaflet.js','vendor/leaflet.css'}
IMPORT_LOCK=threading.Lock()

class Handler(BaseHTTPRequestHandler):
    def log_message(self,*args):pass

    def allowed_host(self):
        return self.headers.get('Host') in {f'localhost:{self.server.server_port}',f'127.0.0.1:{self.server.server_port}'}

    def send(self,status,data,content_type='application/json; charset=utf-8'):
        body=json.dumps(data,ensure_ascii=False,allow_nan=False).encode() if content_type.startswith('application/json') else data
        try:
            self.send_response(status)
            self.send_header('Content-Type',content_type)
            self.send_header('Content-Length',str(len(body)))
            self.send_header('Cache-Control','no-store')
            self.send_header('X-Content-Type-Options','nosniff')
            self.send_header('Referrer-Policy','strict-origin-when-cross-origin')
            self.send_header('X-Frame-Options','DENY')
            self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass  # Navigation or cancellation may close the browser connection.

    def do_GET(self):
        if not self.allowed_host():return self.send(403,{'error':'Local host only.'})
        path=urlparse(self.path).path
        params=parse_qs(urlparse(self.path).query)
        try:
            if path=='/api/status':
                return self.send(200,{'case':CASE,'csrfToken':CSRF,
                    'ai':{'enabled':ai_configured(),'model':os.environ.get('OPENAI_MODEL') if ai_configured() else None,
                          'reason':None if ai_configured() else 'Configure OPENAI_API_KEY and OPENAI_MODEL in .env; no fake AI fallback.'},
                    'satellite':{'processingEnabled':satellite_configured(),'reason':None if satellite_configured() else 'Configure CDSE_CLIENT_ID and CDSE_CLIENT_SECRET for reflectance processing. Public catalogue and quicklooks remain available.'},
                    'fire':fire_status()})
            if path=='/api/evidence':return self.send(200,STORE.snapshot())
            if path=='/api/satellite/analyses':
                analyses=cached_analyses()
                if analyses:STORE.put('analysis',analyses[0])
                return self.send(200,{'analyses':analyses})
            if path=='/api/biodiversity':
                data=load_biodiversity();STORE.put('gbif',data);return self.send(200,data)
            if path=='/api/satellite/catalogue':
                data=catalogue();STORE.put('satellite',data);return self.send(200,data)
            if path=='/api/satellite/thumbnail':
                item=next((i for i in catalogue()['images'] if i['id']==params.get('id',[''])[0]),None)
                if not item or not item['thumbnail']:raise ServiceError('Thumbnail unavailable.',404)
                url=item['thumbnail']; host=urlparse(url).hostname
                if host not in ['datahub.creodias.eu','zipper.dataspace.copernicus.eu']:raise ServiceError('Untrusted thumbnail host.',400)
                image=request(url,stream=True)
                chunks=[];length=0
                for chunk in image.iter_content(65536):
                    length+=len(chunk)
                    if length>2_000_000:raise ServiceError('Thumbnail exceeds size limit.')
                    chunks.append(chunk)
                image.close()
                raw=b''.join(chunks)
                if not raw.startswith(b'\xff\xd8'):raise ServiceError('Source did not return a JPEG quicklook.')
                return self.send(200,raw,'image/jpeg')
            if path=='/api/satellite/sample':
                lng=float(params.get('lng',['nan'])[0]);lat=float(params.get('lat',['nan'])[0])
                import math
                if not math.isfinite(lng) or not math.isfinite(lat) or not -180<=lng<=180 or not -85<=lat<=85:raise ServiceError('Invalid sample coordinates.',400)
                return self.send(200,sample(params.get('id',[''])[0],lng,lat))
            match=re.fullmatch(r'/api/satellite/assets/([0-9a-f]{24})/(pre-rgb|post-rgb|pre-ndvi|post-ndvi|dnbr)\.png',path)
            if match:
                file=RUNTIME/'satellite'/match[1]/(match[2]+'.png')
                if not file.exists():raise ServiceError('Analysis layer unavailable.',404)
                return self.send(200,file.read_bytes(),'image/png')
            name='index.html' if path=='/' else unquote(path.lstrip('/'))
            if name not in STATIC:raise ServiceError('Not found.',404)
            file=ROOT/name
            return self.send(200,file.read_bytes(),mimetypes.guess_type(name)[0] or 'application/octet-stream')
        except ServiceError as e:self.send(e.status,{'error':str(e)})
        except (ValueError,KeyError):self.send(400,{'error':'Invalid request or source format.'})
        except Exception:self.send(503,{'error':'Service unavailable; no substitute data generated.'})

    def do_POST(self):
        port=self.server.server_port
        origin=self.headers.get('Origin')
        if (not self.allowed_host() or self.headers.get('X-ANWE-Token')!=CSRF or
            origin not in [None,f'http://localhost:{port}',f'http://127.0.0.1:{port}']):
            return self.send(403,{'error':'Request must originate from the local ANWE application.'})
        if self.headers.get('Content-Type','').split(';')[0]!='application/json':return self.send(415,{'error':'JSON required.'})
        try:
            length=int(self.headers.get('Content-Length','0'))
            if not 0<length<=4_000_000:raise ServiceError('Request size must be below 4 MB.',413)
            body=json.loads(self.rfile.read(length))
            if not isinstance(body,dict):raise ServiceError('JSON object required.',400)
            path=urlparse(self.path).path
            if path=='/api/ai':
                result=assess(body.get('question'),body.get('evidenceVersion'))
                return self.send(200,result)
            if path=='/api/satellite/process':
                data=run_analysis(body.get('preId'),body.get('postId'));STORE.put('analysis',data)
                return self.send(200,data)
            if path=='/api/fire/import':
                data=validate_import(body)
                with IMPORT_LOCK:atomic_json(RUNTIME/'reviewer-perimeter.json',data)
                # User declarations never become official observational evidence automatically.
                return self.send(200,data)
            raise ServiceError('Not found.',404)
        except ServiceError as e:self.send(e.status,{'error':str(e)})
        except (ValueError,KeyError,TypeError):self.send(400,{'error':'Invalid input; no change applied.'})
        except Exception:self.send(503,{'error':'Service unavailable; no substitute response generated.'})

def create_server(port=8080):return ThreadingHTTPServer(('127.0.0.1',port),Handler)

if __name__=='__main__':
    server=create_server(int(os.environ.get('PORT','8080')))
    print(f'ANWE 3.0: http://localhost:{server.server_port}',flush=True)
    try:server.serve_forever()
    except KeyboardInterrupt:pass
    finally:server.server_close()
