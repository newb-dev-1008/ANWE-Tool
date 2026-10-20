import math
from .common import CACHE, request, now
from .case import CASE

API = 'https://api.gbif.org/v1'

def normalise_occurrence(record, dataset):
    """Withhold coordinates for every record: no unverified sensitivity whitelist."""
    name = record.get('scientificName')
    date = record.get('eventDate')
    key = record.get('key')
    if not name or not date or not isinstance(key, int) or record.get('occurrenceStatus') == 'ABSENT':
        return None
    if record.get('kingdom') != 'Animalia':
        return None
    lng, lat = record.get('decimalLongitude'), record.get('decimalLatitude')
    if any(isinstance(v, bool) or not isinstance(v,(int,float)) or not math.isfinite(v) for v in [lng,lat]):
        return None
    b = CASE['bbox']
    if not b[0] <= lng <= b[2] or not b[1] <= lat <= b[3]:
        return None
    precision = record.get('coordinateUncertaintyInMeters')
    if not isinstance(precision,(int,float)) or not math.isfinite(precision) or precision < 0:
        precision = None
    return {
        'id': f'gbif-{key}', 'kind': 'Observed', 'source': 'GBIF occurrence index',
        'datasetId': record.get('datasetKey', 'Unknown'), 'date': date,
        'coverage': CASE['coverageLabel'],
        'scientificName': str(name)[:200], 'commonName': None, 'taxonKey':record.get('speciesKey') or record.get('taxonKey'),
        'class': record.get('class', 'Unclassified'),
        'provider': dataset.get('title') or record.get('datasetName') or 'Provider not supplied',
        'license': record.get('license') or dataset.get('license') or 'Check source record terms',
        'url': f'https://www.gbif.org/occurrence/{key}',
        'measurements': {'recordedTaxon': str(name)[:200], 'coordinateUncertaintyInMeters': precision},
        'method': 'GBIF georeferenced Animalia search; indexed observation, not independently verified occupancy',
        'location': 'Coordinates withheld for all taxa; regional search-window membership only',
        'quality': {'basisOfRecord':record.get('basisOfRecord','Unknown'), 'issues':record.get('issues',[])[:12],
                    'informationWithheld': bool(record.get('informationWithheld')), 'generalised':bool(record.get('dataGeneralizations'))},
        'limitations': 'Historical or recent record does not prove current occupancy or fire exposure. Sampling is incomplete and biased; missing records do not imply absence. Exact coordinates intentionally withheld. Native status and conservation status not verified.',
    }

def load_biodiversity():
    def load():
        b = CASE['bbox']
        records, seen, totals = [], set(), {}
        for group in ['Mammalia', 'Aves', 'Amphibia', 'Reptilia', 'Insecta', 'Arachnida']:
            match = CACHE.get('gbif-class-'+group, lambda: request(API+'/species/match',params={'name':group,'rank':'CLASS','kingdom':'Animalia'}).json(), 86400*30)
            taxon = match.get('usageKey')
            if not taxon or match.get('matchType') == 'NONE':
                continue
            query = {'taxonKey':taxon,'decimalLatitude':f'{b[1]},{b[3]}','decimalLongitude':f'{b[0]},{b[2]}',
                     'hasCoordinate':'true','hasGeospatialIssue':'false','occurrenceStatus':'PRESENT','limit':15}
            response = request(API+'/occurrence/search',params=query).json()
            totals[group] = response.get('count', 0)
            for raw in response.get('results',[]):
                if raw.get('key') in seen: continue
                # Dataset metadata is a source identifier, not an ecological judgement.
                dataset_key = raw.get('datasetKey')
                dataset = CACHE.get('gbif-dataset-'+str(dataset_key), lambda: request(API+'/dataset/'+dataset_key).json(),86400) if dataset_key else {}
                rec = normalise_occurrence(raw,dataset)
                if rec:
                    records.append(rec)
                    seen.add(raw['key'])
        return {'status':'available','retrievedAt':now(),'records':records,'countsByClass':totals,
                'scope':CASE['coverageLabel'], 'sampling':'Up to 15 indexed records per class; not a census or native-species inventory.',
                'limitations':'No precise coordinates disclosed. All records cover the regional search window, not a verified burned perimeter.'}
    return CACHE.get('culebra-gbif-v5',load,86400)
