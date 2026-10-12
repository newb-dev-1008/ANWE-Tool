import json
from datetime import date
from .common import ROOT, ServiceError

FOUNDATION=json.loads((ROOT/'data/design-values.json').read_text(encoding='utf-8'))
VALUE_NAMES=[v['value'] for v in FOUNDATION['values']]

def review_status(review, version):
    if not isinstance(review,dict):review={}
    requested=review.get('reviewStatus','draft')
    if requested not in ['draft','deferred','reviewed']:
        raise ServiceError('Unknown review status.',400)
    complete=all(isinstance(review.get(k),str) and review[k].strip() for k in ['reviewer','date','rationale','preferredOption']) and review.get('preferredOption')!='(not yet decided)'
    if requested=='reviewed':
        try:date.fromisoformat(review.get('date',''))
        except (ValueError,TypeError):complete=False
    if requested=='reviewed' and (not complete or review.get('approvalConfirmed') is not True):
        raise ServiceError('A reviewed decision requires reviewer, date, option, justification and explicit human confirmation.',400)
    stale=bool(review.get('evidenceVersion') and review['evidenceVersion']!=version)
    return {'status':requested,'identityVerified':False,'evidenceCurrent':not stale,
            'actionAuthorised':False,'furtherApprovalRequired':True,
            'label':('Locally recorded human review; credentials unverified' if requested=='reviewed' else 'Decision deferred' if requested=='deferred' else 'Unreviewed draft')+(' — evidence changed; re-review required' if stale else '')}

def pathway_assessment(option, review=None, version=None):
    status=review_status(review or {},version)
    passive=option['id']=='opt-A'
    welfare={
      'Shelter':'May retain surviving cover and refuges; current refuge use unknown.' if passive else 'Work may alter cover or disturb occupied refuges; survey first.',
      'Food':'Food resources and affected animal diets are unknown; survey before changes.',
      'Movement':'Connectivity and use of movement routes are unknown; identify routes before work.',
      'Breeding habitat':'Breeding sites and timing are unknown; verify seasonal restrictions in the field.'}
    recovery={
      'Vegetation recovery':'Monitor existing vegetation response; spectral indices alone do not establish recovery.',
      'Habitat structure':'Compare open habitat and cover requirements; site-specific needs unknown.',
      'Regeneration':'Natural regeneration may be adequate; intervene only after verified need.',
      'Soil and erosion concerns':'Survey erosion and soil disturbance risk; no calibrated soil-moisture data.'}
    evidence=option.get('evidence',{})
    return {'Animal welfare':welfare,'Ecological recovery':recovery,
      'Transparency':{'Supporting data':', '.join(evidence.get('sources',[])) or 'No linked evidence',
                      'Assumptions':'Potential impacts are authored hypotheses; current occupancy is unknown.',
                      'Methodology':'Conditional comparison; no predictive habitat or mortality model.',
                      'Evidence provenance':'CEMS/CDSE/GBIF source dates and licences are separately recorded.'},
      'Uncertainty':{'Evidence availability':evidence.get('strength','Unknown'),
                     'Data limitations':'Historical occurrences and spectral change cannot establish animal wellbeing.',
                     'Unknown impacts':'Site-specific benefits and harms have not been field-validated.',
                     'Required field validation':'; '.join(option.get('fieldChecksNeeded',[]))},
      'Accountability':{'Expert review status':status['label'],'Reviewer justification':(review or {}).get('rationale') or 'Not recorded',
                        'Pending decisions':(review or {}).get('preferredOption') or 'No strategy selected',
                        'Further approval necessary':'Yes. Qualified review, landowner consent and applicable permissions; no action authorised.'}}
