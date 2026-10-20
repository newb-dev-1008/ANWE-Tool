"""Prepare report views without recomputing or modifying ecological measurements."""
import json
from datetime import datetime
from zoneinfo import ZoneInfo
from .common import ROOT, ServiceError
from .values import review_status

ZONES={'burned':'Inside mapped fire footprint','buffer':'Nearby comparison area','uncertain':'Uncertain location'}

# Specific editorial corrections identified in the completed demo review.
# Preserve the model response; these are labelled presentation changes, not AI facts.
AI_EDITORIAL_CORRECTIONS={
    'varied species presence':'historical recorded observations',
    'Vegetation indices show decline consistent with fire impact, likely slowing habitat regeneration.':
        'The regional indices differ between the selected images. They do not establish the cause of change or the rate of habitat regeneration.'}

def clarified_ai_text(text):
    for original,clarification in AI_EDITORIAL_CORRECTIONS.items():
        text=text.replace(original,clarification)
    return text

def ai_editorial_corrections(answer):
    texts=[answer.get('summary','')]+[v.get('assessment','') for v in answer.get('valuesAssessment',[])]
    return [(original,replacement) for original,replacement in AI_EDITORIAL_CORRECTIONS.items() if any(original in text for text in texts)]

def prepare_report(snapshot,answers=None,review=None,include_review=False,include_notes=False,public_status='Unreviewed draft',generated_at=None):
    if not isinstance(snapshot,dict) or 'version' not in snapshot:raise ServiceError('Report evidence unavailable.',400)
    private=review if include_review and isinstance(review,dict) else {}
    status=review_status(private,snapshot['version']) if private else {'label':public_status,'actionAuthorised':False,'furtherApprovalRequired':True,'identityVerified':False}
    text=(ROOT/'data/scenario.js').read_text(encoding='utf-8')
    scenario=json.loads(text[text.index('{'):text.rindex('\n};')+2])
    sources=snapshot.get('sources',{})
    answer=(answers or [])[-1] if answers else None
    used={r['id']:r for r in snapshot.get('records',[]) if r['id'].startswith(('cems-','analysis-','comparison-','context-'))}
    for response in answers or []:
        for source in response.get('supportingSources',[]):used[source['id']]=source
    return {'snapshot':snapshot,'analysis':sources.get('analysis'),'comparison':sources.get('comparison'),
            'catalogue':sources.get('satellite',{}),'strategies':scenario['recoveryPathways'],
            'answer':answer,'answerCount':len(answers or []),'review':private,'includeNotes':include_review and include_notes,
            'status':status,'sources':list(used.values()),
            'generated':generated_at or datetime.now(ZoneInfo('Europe/Madrid')).strftime('%d %B %Y · %H:%M %Z')}

def display_number(value,precision=3):
    if value is None:return 'Not available'
    if isinstance(value,(float,int)) and not isinstance(value,bool):return f'{value:.{precision}f}'
    return str(value)

def biodiversity_rows(comparison):
    if not comparison:return []
    return [[label,*[comparison[p]['zones'][zone][field] for p in ['before','after'] for field in ['records','distinctSpecies']]]
            for zone,label in ZONES.items()]

def species_rows(comparison):
    """Complete retrieved species sets with representative source-record references."""
    if not comparison:return []
    rows=[]
    for zone,label in ZONES.items():
        for key,category in [('both','Both windows'),('onlyBefore','Only before'),('onlyAfter','Only after')]:
            for species in comparison['comparison'][zone][key]:
                records=[r for r in comparison['records'] if r['zone']==zone and str(r.get('speciesKey'))==str(species['key'])]
                by_period={}
                for record in records:by_period.setdefault(record['phase'],record)
                rows.append({'zone':label,'category':category,'name':species['name'],'key':species['key'],
                             'records':list(by_period.values()),'recordCount':len(records)})
    return rows
