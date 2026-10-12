CASE = {
    'id': 'culebra-june-2022',
    'name': 'Sierra de la Culebra · June 2022',
    'region': 'Zamora, Castilla y León, Spain',
    'eventStart': '2022-06-15',
    'eventEnd': None,
    'activation': 'EMSR580',
    'activationDate': '2022-06-17T10:55:00Z',
    # A search window is not a wildfire perimeter. It includes nearby unburned land.
    'bbox': [-6.5, 41.75, -5.95, 42.1],
    'center': [41.93, -6.22],
    'coverageLabel': 'Regional search window; not the burned-area boundary',
    'sourceUrl': 'https://mapping.emergency.copernicus.eu/activations/EMSR580/',
    'limitations': 'Activation documents fires starting 15 June. No extinguishment date inferred. June and July 2022 fires must not be conflated. Search-window records are not necessarily in burned habitat.',
}

FIRE_EVIDENCE = {
    'id': 'cems-EMSR580-event', 'kind': 'Observed', 'source': 'Copernicus EMS Rapid Mapping',
    'datasetId': 'EMSR580', 'date': '2022-06-15', 'coverage': CASE['region'],
    'measurements': {'eventStart': '2022-06-15', 'activationDate': CASE['activationDate']},
    'method': 'Documented activation narrative; not a field measurement or final perimeter',
    'limitations': CASE['limitations'], 'url': CASE['sourceUrl'],
    'license': 'Copernicus EMS Terms and Conditions',
}
