import hashlib
import json
import os
import threading
import time
from pathlib import Path
from datetime import datetime, timezone
import requests

ROOT = Path(__file__).resolve().parent.parent
RUNTIME = ROOT / '.runtime'
RUNTIME.mkdir(exist_ok=True)

def now():
    return datetime.now(timezone.utc).isoformat()

def load_env():
    path = ROOT / '.env'
    if path.exists():
        for line in path.read_text(encoding='utf-8-sig').splitlines():
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key.strip(), value.strip().strip('\"\''))

class ServiceError(Exception):
    def __init__(self, message, status=503):
        self.status = status
        super().__init__(message)

def request(url, *, method='GET', timeout=30, **kwargs):
    try:
        response = requests.request(method, url, timeout=timeout, **kwargs)
        if response.status_code == 429:
            raise ServiceError('Source rate limit reached. Try again later.', 429)
        if response.status_code in (401, 403):
            raise ServiceError('Source authentication or access denied.', 503)
        response.raise_for_status()
        return response
    except requests.RequestException:
        # Remote error bodies can contain sensitive headers/credentials; never forward them.
        raise ServiceError('External source unavailable or request timed out.') from None

def atomic_json(path, data):
    temp = path.with_suffix('.tmp')
    temp.write_text(json.dumps(data, ensure_ascii=False, allow_nan=False), encoding='utf-8')
    temp.replace(path)

class Cache:
    def __init__(self):
        self.lock = threading.RLock()

    def get(self, key, loader, ttl=3600):
        path = RUNTIME / (hashlib.sha256(key.encode()).hexdigest() + '.json')
        with self.lock:
            if path.exists() and time.time() - path.stat().st_mtime < ttl:
                try:
                    return json.loads(path.read_text(encoding='utf-8'))
                except (ValueError, OSError):
                    pass
            value = loader()
            atomic_json(path, value)
            return value

CACHE = Cache()
