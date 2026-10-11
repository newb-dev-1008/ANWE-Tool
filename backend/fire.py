"""No undocumented EFFIS endpoint or fabricated historical polygon."""
import hashlib
import math
from .common import ROOT, ServiceError, now
from .case import CASE

EFFIS_URL = 'https://forest-fire.emergency.copernicus.eu/applications/data-and-services'

def validate_import(payload):
    metadata = payload.get('metadata', {})
    for key in ['source', 'datasetId', 'date', 'url', 'license', 'limitations', 'reviewer']:
        if not isinstance(metadata.get(key), str) or not metadata[key].strip() or len(metadata[key]) > 2000:
            raise ServiceError('Perimeter requires source, dataset ID, date, URL, licence, limitations and reviewer.', 400)
    if not metadata['url'].startswith('https://') or not metadata['date'].startswith('2022-06'):
        raise ServiceError('Use an HTTPS source and a June 2022 observation date for this case.', 400)
    geo = payload.get('geojson', {})
    features = geo.get('features') if geo.get('type') == 'FeatureCollection' else [geo]
    if not isinstance(features, list) or not 1 <= len(features) <= 200:
        raise ServiceError('Import a Feature or FeatureCollection with 1–200 polygon features.', 400)
    count = 0
    cleaned = []
    for feature in features:
        geometry = feature.get('geometry', {})
        if geometry.get('type') not in ['Polygon', 'MultiPolygon']:
            raise ServiceError('Only WGS84 Polygon/MultiPolygon geometry is accepted.', 400)
        polys = [geometry.get('coordinates')] if geometry['type'] == 'Polygon' else geometry.get('coordinates')
        if not isinstance(polys, list) or not polys:
            raise ServiceError('Invalid polygon coordinates.', 400)
        for polygon in polys:
            if not isinstance(polygon, list) or not polygon:
                raise ServiceError('Invalid polygon rings.', 400)
            for ring in polygon:
                if not isinstance(ring, list) or len(ring) < 4 or ring[0] != ring[-1]:
                    raise ServiceError('Polygon rings must be closed with at least four positions.', 400)
                for position in ring:
                    count += 1
                    if count > 100000 or not isinstance(position, list) or len(position) != 2:
                        raise ServiceError('Use at most 100000 two-dimensional WGS84 positions.', 400)
                    x, y = position
                    if any(isinstance(v, bool) or not isinstance(v, (float, int)) or not math.isfinite(v) for v in position) or not (-6.9 <= x <= -5.8 and 41.4 <= y <= 42.3):
                        raise ServiceError('Coordinates must lie in the Culebra region; convert to WGS84 first.', 400)
        # Do not trust imported properties, legal claims or hidden text.
        from shapely.geometry import shape
        if not shape(geometry).is_valid:
            raise ServiceError('Self-intersecting or invalid polygon; repair and review before import.',400)
        cleaned.append({'type': 'Feature', 'properties': {}, 'geometry': geometry})
    return {'status': 'reviewer-supplied', 'verification': 'Provenance declared by local reviewer; not independently authenticated',
            'geojson': {'type': 'FeatureCollection', 'features': cleaned}, 'metadata': metadata, 'importedAt': now()}

def fire_status():
    path = ROOT / 'data' / 'culebra-perimeter.json'
    perimeter = None
    if path.exists():
        import json
        perimeter = json.loads(path.read_text(encoding='utf-8'))
    from .common import RUNTIME
    imported=None
    if (RUNTIME/'reviewer-perimeter.json').exists():
        import json
        imported=json.loads((RUNTIME/'reviewer-perimeter.json').read_text(encoding='utf-8'))
    return {'importedPerimeter':imported,'effis': {'status': 'historical-access-limited', 'url': EFFIS_URL,
            'reason': 'EFFIS directs unavailable historical/raw perimeter requests to its data-request form. No June perimeter has been retrieved from EFFIS.'},
            'perimeter': perimeter,
            'severity': {'status': 'unavailable', 'reason': 'No EFFIS severity raster loaded. CEMS grading, if present, is a separate product.'}}
