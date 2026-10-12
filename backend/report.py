"""ANWE 4.1: six-page decision brief with reproducible technical appendices."""
import io
import json
from .common import ROOT
from .values import FOUNDATION
from .report_data import prepare_report, display_number, biodiversity_rows, species_rows, ZONES, clarified_ai_text, ai_editorial_corrections
from .report_layout import Layout, WIDTH, study_map, occurrence_chart

def excerpt(text,limit=420):
    text=str(text)
    if len(text)<=limit:return text
    cut=text.rfind('. ',0,limit)
    return text[:cut+1] if cut>limit//2 else text[:limit].rsplit(' ',1)[0]+'…'

def make_report(snapshot,answers=None,review=None,include_review=False,include_notes=False,public_status='Unreviewed draft',generated_at=None):
    data=prepare_report(snapshot,answers,review,include_review,include_notes,public_status,generated_at)
    a=data['analysis'];b=data['comparison'];ai=data['answer'];status=data['status'];l=Layout()
    # Main report: the six questions, in reading order.
    l.heading('ANWE — Design for Values Assessment',False)
    l.add('Animal Welfare and Ecosystem Restoration','h2')
    l.add('Sierra de la Culebra, Zamora, Spain · June 2022 wildfire','h2')
    l.add('Generated '+data['generated']+' | Evidence snapshot '+snapshot['version'],'small')
    l.add('Review status: '+status['label']+'. Qualified expert identity and endorsement are not verified.','small')
    l.sub('1. Executive Summary')
    if a:
        mean=a['statistics'].get('dNBR',{}).get('mean')
        environment='The calculated regional mean dNBR (satellite change indicator) is '+display_number(mean)+'. It describes spectral change across the analysed region, including unburned land; it is not a direct damage measure.'
    else:environment='No calculated satellite indices are available in this snapshot. Catalogue imagery, if retrieved, provides an overview rather than measured vegetation change.'
    l.note('Environmental evidence',environment)
    if b:
        pre=b['before']['zones']['burned'];post=b['after']['zones']['burned']
        biodiversity=f"Inside the mapped fire footprint, the eligible retrieved sample contains {pre['records']} before-window records and {post['records']} after-window records. Many records may have uncertain locations. These are observation counts, not animal populations."
    else:biodiversity='No dated GBIF (Global Biodiversity Information Facility) comparison is available. Species differences cannot be reported from the current snapshot.'
    l.note('Biodiversity evidence',biodiversity)
    l.note('Options evaluated','Natural regeneration, assisted ecological restoration and active habitat restoration. These are conditional options for investigation, not an automatically selected recommendation.')
    l.note('Main uncertainty','Current animal use, habitat function and intervention effects have not been field-verified. Observation effort and location precision limit biodiversity comparisons.')
    l.note('Decision status','No option is authorised or implementation-ready. Human ecological review, landowner consent and applicable permissions remain necessary.')
    l.add('AI participation: '+('An actual model draft is included; it is not an expert-approved finding.' if ai else 'No AI-generated ecological assessment was completed for this report.'),'small')
    l.add('Reading path: 2. Wildfire/environment → 3. Biodiversity → 4. Options → 5. Values → 6. Next steps. Methods, species lists, licences and glossary follow in appendices.','small')

    l.heading('2. Wildfire Context and Environmental Evidence')
    l.add('Fires were reported from '+snapshot['case']['eventStart']+'. The extinguishment date is unverified. The mapped observation dates from 25 June 2022; it is not an exact final incident perimeter.')
    l.story.append(study_map())
    l.add('Rust outlines: Copernicus Emergency Management Service (CEMS), activation EMSR580. © European Union. Generalised source geometry, with an additional 120 m simplification for this overview. UTM 29N grid; no animal locations or basemap.','small')
    if a:
        l.add('Actual image acquisitions: before '+a['pre']['date']+'; later '+a['post']['date']+'. The later image describes that date, not automatically an immediate post-fire condition.','small')
        stats=a['statistics']
        rows=[['Pre-fire NDVI',display_number(stats.get('preNDVI',{}).get('mean')),'Average vegetation greenness in the earlier image.'],
              ['Later-image NDVI',display_number(stats.get('postNDVI',{}).get('mean')),'Average greenness in the selected later image.'],
              ['dNBR',display_number(stats.get('dNBR',{}).get('mean')),'Difference in the burn-sensitive spectral index between images.']]
    else:rows=[['Pre-fire NDVI','Not available','Vegetation greenness before the fire.'],['Later-image NDVI','Not available','Greenness in a selected later image.'],['dNBR','Not available','Spectral change between images.']]
    l.table(['Indicator','Regional mean','What it means'],rows,[WIDTH*.24,WIDTH*.18,WIDTH*.58])
    l.note('What does this tell us?','NDVI means Normalized Difference Vegetation Index; NBR means Normalized Burn Ratio; dNBR is before NBR minus later NBR. They support investigation of vegetation/spectral change, not percentages of damage, animal deaths, soil moisture or proven habitat recovery. Regional means include unburned land. Methods and full precision: Appendix A.')
    l.add('European Forest Fire Information System (EFFIS) historical severity data are unavailable here. Later observations may also reflect the separate July 2022 fire.','small')

    l.heading('3. Biodiversity Before and After the Fire')
    if b:
        p=b['parameters'];l.add(f"Before: {p['beforeStart']} to {p['beforeEnd']}. After-start: {p['afterStart']} to {p['afterEnd']}. Group: {p['group']}; outside buffer: {p['bufferKm']:g} km.")
        same_season=p['beforeStart'][5:]==p['afterStart'][5:] and p['beforeEnd'][5:]==p['afterEnd'][5:]
        l.add('These windows match calendar-season boundaries to reduce seasonal differences; sampling effort may still differ.' if same_season else 'These selected windows do not have matching seasonal boundaries; seasonal differences are an additional limitation.','small')
        l.add('The same June 2022 outline is used for both periods. Before records describe places later mapped as burned. The nearby buffer extends outward from the boundary and is not a validated unaffected control. Uncertain location is a data-quality category, not a third geographical area.','small')
        l.table(['Location category','Before records','Before species','After records','After species'],biodiversity_rows(b),[WIDTH*.34]+[WIDTH*.165]*4)
        l.story.append(occurrence_chart(b))
        l.note('What the data shows','The table counts date-eligible retrieved occurrences and distinct identified species. Spatially uncertain records are separate from confident inside/nearby assignments. Complete species sets and quality details are in Appendix B.')
        l.note('What the data does not prove','Fewer records do not establish disappearance, population decline or reduced biodiversity. More records do not establish recovery. GBIF is an index of reported observations, not a census.')
        l.note('What additional evidence is needed','Use comparable field surveys and information on observer effort, reporting, date precision and habitat use. Interpret later records with the July-fire confounder in mind.')
        if b['before']['truncated'] or b['after']['truncated']:l.add('Incomplete retrieval: one or both queries reached the record cap. Counts and species sets describe retrieved subsets only.','small')
    else:
        l.add('Not available: no before/after comparison was retrieved. No counts, species changes or population conclusions can be reported.')
        l.note('Next evidence step','Retrieve matched seasonal windows and inspect location/date quality. Then plan comparable field surveys; missing records never establish animal absence.')

    l.heading('4. Restoration Strategy Comparison')
    l.add('These authored options identify possibilities to investigate. Benefits and harms are conditional, not measured local effects or model-generated findings. No option is labelled recommended.')
    options=data['strategies']
    focuses={
      'opt-A':'Verify whether natural regeneration is sufficient and erosion can be managed without intrusive work.',
      'opt-B':'Verify a specific regeneration or erosion problem and protect occupied refuges during targeted work.',
      'opt-C':'Verify the habitat function needing restoration; compare lighter measures and define stopping criteria.'}
    rows=[]
    for field,label in [('description','What it involves'),('potentialBenefits','Potential benefits'),('potentialHarms','Possible harms / ecological limitations'),('inappropriate','When inappropriate')]:
        rows.append([label,*[' '.join(o[field]) if isinstance(o[field],list) else o[field] for o in options]])
    rows.append(['Critical field focus',*[focuses.get(o['id'],'Verify site need and disturbance risk.') for o in options]])
    l.table(['Compare','Natural regeneration','Assisted restoration','Active habitat restoration'],rows,[WIDTH*.19]+[WIDTH*.27]*3)
    l.sub('Shared field requirements — check once for all options')
    l.bullets(['Vegetation regeneration and soil erosion.','Habitat connectivity, shelter, food and breeding sites.','Sensitive/vulnerable taxa and effects of machinery or human disturbance.'])
    l.add('A qualified ecologist must judge whether intervention is needed and proportionate. ANWE does not replace consent or environmental permissions.','small')

    l.heading('5. Design for Values Assessment')
    l.add('Five values guide the choice; none is reduced to an overall ethical score. This matrix describes design support and remaining evaluation, not verified ethical outcomes.')
    rows=[['Animal Welfare','Shelter, food, movement and breeding habitat.','Considers potential animal harms in each option.','Current occupancy and site-specific impacts unknown.'],
          ['Ecological Recovery','Habitat function and regeneration.','Compares lighter and more intrusive options.','Field validation of need and recovery required.'],
          ['Transparency','Explainable reasoning and assumptions.','Links facts to source records and methods.','Source-backed numbers do not prove causal interpretations.'],
          ['Uncertainty','Visible weak or missing evidence.','Separates uncertain locations and missing analysis.','Sampling bias, dates, masks and July-fire effects remain.'],
          ['Accountability','Human responsibility and approvals.','Records review status and justification.','Status: '+status['label']+'. Expert credentials unverified.']]
    l.table(['Value','What to protect','How ANWE addresses it','Current limitation'],rows,[WIDTH*.18,WIDTH*.25,WIDTH*.28,WIDTH*.29])
    l.sub('Value conflicts to discuss')
    l.bullets(['Rapid habitat restoration versus avoiding disturbance to wildlife.','Useful biodiversity evidence versus protecting sensitive locations.','Clear guidance versus honest uncertainty.','AI convenience versus human responsibility.'])
    l.add('Discuss these tensions with restoration organisations, land managers and field staff. Full stakeholder → value → norm → requirement → feature → evaluation traceability is in Appendix C.','small')

    l.heading('6. What Happens Next?')
    l.note('Current decision status',status['label']+'. No action is authorised. Expert endorsement for further planning cannot be established because qualifications and permissions are not verified by ANWE.')
    l.sub('Required field checks')
    l.bullets(['Survey current animal use, surviving refuges, movement routes and breeding activity.','Check regeneration, habitat structure and erosion; determine whether lighter measures suffice.','Record survey methods, effort and baseline monitoring indicators before comparing outcomes.'])
    l.sub('Missing environmental evidence')
    l.add('Validated burn-severity and current habitat/welfare evidence are unavailable. '+('Satellite indices are available but do not fill these field gaps.' if a else 'Calculated satellite indices are also unavailable in this snapshot.'))
    l.sub('Expert Review and responsibility')
    l.add('A qualified expert must check evidence relevance, uncertain impacts, timing and the decision rationale. Confirm landowner consent and applicable environmental authorisations. A PDF download is not approval.')
    if data['review']:
        l.add('Preferred option recorded by reviewer: '+excerpt(data['review'].get('preferredOption') or 'Not selected',160))
        l.add('Reviewer justification (excerpt): '+excerpt(data['review'].get('rationale') or 'Not recorded',300))
        l.add('Full consented review information is in Appendix G.','small')
    else:l.add('Reviewer identity and private comments are omitted by privacy settings. Public status is locally declared, not authenticated.','small')
    l.sub('AI-Assisted Assessment status')
    l.add('An actual AI draft follows; it needs human review.' if ai else 'No AI-generated ecological assessment was completed for this report.')
    l.add('Appendix navigation: A satellite methods · B GBIF methods/species · C value traceability · D sources/licences · E glossary'+(' · F full AI draft' if ai else '')+(' · G consented review' if data['review'] else ''),'small')

    if ai:
        l.heading('7. AI-Assisted Assessment')
        l.add('Actual model draft, not an expert-approved conclusion. '+('Its evidence snapshot differs from this report; reassess before relying on it.' if ai['evidenceVersion']!=snapshot['version'] else 'Its evidence snapshot matches this report.'))
        corrections=ai_editorial_corrections(ai)
        if corrections:l.add('Editorial clarifications distinguish historical observations from current presence and remove an unsupported regeneration-rate inference. Original affected wording is retained, explicitly superseded, in Appendix F. This is not expert ecological approval.','small')
        l.note('Interpretation — excerpt',excerpt(clarified_ai_text(ai.get('summary','No summary supplied.')),850))
        l.sub('Selected uncertainties')
        l.bullets([excerpt(t,250) for t in ai.get('unknowns',[])[:3]])
        l.sub('Supporting evidence and assumptions')
        l.add('The draft selects source-owned evidence; conditional ecological implications remain hypotheses. A source reference does not prove the interpretation. Model identity, full text, all references and exact selected values are retained in Appendix F.')
        l.add('Human review status: '+status['label']+'. No permissions or endorsements are inferred.')

    # Appendices keep source precision and complete retrieved species sets.
    l.heading('Appendix A — Satellite Methodology')
    l.add('NDVI=(B08−B04)/(B08+B04); NBR=(B08−B12)/(B08+B12); dNBR=before NBR−later NBR. Values in the main report are rounded for readability only.')
    if a:
        l.table(['Input','Exact metadata'],[['Analysis ID',a['id']],['Pre-image ID/date',a['pre']['id']+'\n'+a['pre']['date']],['Later-image ID/date',a['post']['id']+'\n'+a['post']['date']],['Processing grid',a.get('grid','Not supplied')],['Spatial coverage',a['coverage']],['Created',a['createdAt']]],[WIDTH*.25,WIDTH*.75])
        l.table(['Index','Valid\npixels','Total\npixels','Mean (full precision)','Range (full precision)'],[[key,stats.get('validPixels'),stats.get('totalPixels'),repr(stats.get('mean')),'Min: '+repr(stats.get('min'))+'\nMax: '+repr(stats.get('max'))] for key,stats in a['statistics'].items()],[WIDTH*.17,WIDTH*.1,WIDTH*.1,WIDTH*.3,WIDTH*.33],small=True)
        l.add(a['method']);l.add(a['limitations'])
        l.add('Masking: SCL classes 0,1,2,3,6,7,8,9,10,11 excluded; one-pixel cloud/shadow buffer; negative/nonfinite reflectance and invalid denominators excluded; dNBR uses paired valid pixels. Dark burned surfaces can be omitted. No calibrated damage classes or wildlife mortality inference.')
    else:l.add('Calculated analysis not available. No values, dates or raster findings are fabricated.')
    l.add('Public catalogue retrieval is separate from processing. A product thumbnail or tile-wide cloud percentage cannot establish valid site pixels.')
    catalogue=data['catalogue'].get('images',[])
    used_ids={a[phase]['id'] for phase in ['pre','post']} if a else set()
    used_ids.update(s['datasetId'] for s in data['sources'] if s['id'].startswith('sentinel-'))
    processing_ids={a[phase]['id'] for phase in ['pre','post']} if a else set()
    images=[i for i in catalogue if i['id'] in used_ids-processing_ids]
    l.add(f'Catalogue inventory: {len(catalogue)} retrieved products. The processing pair is documented above. Additional products referenced by an AI draft are listed below when present; unused catalogue entries are not analytical evidence.','small')
    if images:
        l.table(['Catalogue product ID','Acquisition','Phase'],[[i['id'],i['date'],i['phase']] for i in images],[WIDTH*.57,WIDTH*.28,WIDTH*.15],small=True)

    l.heading('Appendix B — GBIF Methodology and Species Lists')
    if b:
        l.add(b['method']);l.add(b['geography']['method']);l.add(b['geography']['geometryAccuracy']);l.add(b['limitations'])
        l.table(['Window','Start','End'],[['Before',b['parameters']['beforeStart'],b['parameters']['beforeEnd']],['After-start',b['parameters']['afterStart'],b['parameters']['afterEnd']]])
        l.table(['Retrieval / quality','Before','After'],[[field,b['before'][field],b['after'][field]] for field in ['apiBoundingBoxCount','retrieved','truncated']]+[[key,b['before']['quality'][key],b['after']['quality'][key]] for key in b['before']['quality']])
        audit=b['dateAudit'];l.add(f"All-date quality audit: {audit['retrieved']} retrieved, {audit['missingDates']} missing dates, {audit['impreciseDates']} imprecise dates. {audit['scope']}")
        groups=sorted({g for phase in ['before','after'] for zone in ZONES for g in b[phase]['zones'][zone]['groups']})
        l.sub('Taxonomic record counts')
        l.table(['Group','Location category','Before','After'],[[g,ZONES[z],b['before']['zones'][z]['groups'].get(g,0),b['after']['zones'][z]['groups'].get(g,0)] for g in groups for z in ZONES],[WIDTH*.2,WIDTH*.4,WIDTH*.2,WIDTH*.2])
        l.sub('Complete species sets from eligible retrieved records')
        l.add('All species in the retrieved sets are included. Categories describe reporting only, not disappearance or recovery. Each entry links a representative record per available window; record counts show how many eligible records support that species/category. Original dataset IDs and licences follow in Appendix D. Exact locations are withheld.','small')
        entries=species_rows(b)
        for zone,label in ZONES.items():
            rows=[]
            for entry in entries:
                if entry['zone']!=label:continue
                refs='<br/>'.join(f'{r["phase"]}: <link href="{r["url"]}" color="#17554D">{r["id"]}</link> ({r["date"]})' for r in entry['records'])
                rows.append([entry['name']+'\nGBIF species key '+str(entry['key']),entry['category'],str(entry['recordCount']),l.p(refs,'small',raw=True)])
            if rows:l.table(['Recorded species','Window category','Records','Representative provenance'],rows,[WIDTH*.34,WIDTH*.2,WIDTH*.12,WIDTH*.34],small=True,caption=label)
            else:l.note(label,'No resolved species in this retrieved set. This does not establish absence.')
    else:l.add('No comparison retrieved; no species lists or observation differences generated.')

    l.heading('Appendix C — Design for Values Traceability')
    l.add('Stakeholder concern → Value → Norm → Requirement → Feature → Evaluation. The chain describes how the application was designed, not verified ecological outcomes.')
    for value in FOUNDATION['values']:
        l.sub(value['value']);l.table(['Chain element','Project specification'],[[key,value[field]] for key,field in [('Stakeholder concern','concern'),('Norm','norm'),('Requirement','requirement'),('Feature','feature'),('Evaluation','evaluation')]],[WIDTH*.24,WIDTH*.76])
    l.sub('Stakeholder priorities')
    l.bullets([s['tier']+' — '+s['group']+': '+s['needs'] for s in FOUNDATION['stakeholders']])
    l.add('Stakeholder needs are authored project assumptions. Empirical stakeholder and ecological outcome evaluation remain pending.')

    l.heading('Appendix D — Data Sources, Licences and Methodology')
    l.add('CEMS provides the mapped extent; Copernicus Data Space supplies Sentinel imagery/metadata; GBIF indexes records from contributing datasets. No historical EFFIS severity raster or perimeter was retrieved.')
    l.story.append(l.link('https://mapping.emergency.copernicus.eu/activations/EMSR580/','CEMS activation EMSR580'))
    l.story.append(l.link('https://forest-fire.emergency.copernicus.eu/applications/data-and-services','EFFIS — access limitation, not a dataset used'))
    for source in data['sources']:
        l.sub(source['source']);l.add('Dataset/source ID: '+source['datasetId']+' | Observation/retrieval date: '+source['date'],'small')
        l.story.append(l.link(source['url']));l.add('Method: '+source['method'],'small');l.add('Limitations: '+source['limitations'],'small');l.add('Reuse: '+str(source.get('license','Check source terms')),'small')
    if b:
        datasets={r['datasetId']:(r['provider'],r['license']) for r in b['records']}
        l.sub('GBIF contributing datasets')
        l.table(['Dataset ID','Provider / reuse information'],[[l.link('https://www.gbif.org/dataset/'+key,key),title+'\n'+licence] for key,(title,licence) in datasets.items()],[WIDTH*.35,WIDTH*.65],small=True)

    l.heading('Appendix E — How to Read This Report: Glossary')
    glossary=json.loads((ROOT/'data/glossary.json').read_text(encoding='utf-8'))
    l.table(['Term','Plain-language meaning'],[[e['term'],e['meaning']] for e in glossary],[WIDTH*.25,WIDTH*.75])
    for url in ['https://techdocs.gbif.org/en/data-publishing/dataset-classes','https://www.usgs.gov/landsat-missions/landsat-normalized-difference-vegetation-index','https://www.usgs.gov/landsat-missions/landsat-normalized-burn-ratio']:l.story.append(l.link(url))

    if ai:
        # Keep the detailed draft readable without an almost-empty overflow page.
        l.styles['body']=l.styles['body'].clone('AppendixBody',spaceAfter=4)
        l.styles['h2']=l.styles['h2'].clone('AppendixSub',spaceBefore=6)
        l.heading('Appendix F — Full AI Draft and Evidence References')
        l.add('Actual model: '+ai['model']+'; generated '+ai['createdAt']);l.add('Question: '+ai['question']);l.add('Evidence snapshot: '+ai['evidenceVersion']);l.add('Unvalidated AI draft. Earlier selected drafts are superseded by this latest assessment; no AI is generated during export.')
        corrections=ai_editorial_corrections(ai)
        if corrections:
            l.sub('Editorial corrections — superseded original wording')
            l.add('The following original model passages are retained for traceability and must not be treated as supported findings. The displayed draft incorporates the clarifications. Other AI interpretations remain unreviewed.','small')
            l.table(['Original model wording (superseded)','Editorial clarification'],corrections,[WIDTH*.45,WIDTH*.55])
        l.add(clarified_ai_text(ai.get('summary','')))
        if ai.get('sourceMeasurements'):l.table(['Evidence ID','Source field','Exact selected value'],[[m['evidenceId'],m['field'],m['value']] for m in ai['sourceMeasurements']],[WIDTH*.3,WIDTH*.35,WIDTH*.35],small=True)
        l.sub('Hypotheses');l.bullets(ai.get('hypotheses',[]));l.sub('Unknowns');l.bullets(ai.get('unknowns',[]))
        for value in ai.get('valuesAssessment',[]):l.sub(value['value']);l.add(clarified_ai_text(value['assessment']));l.bullets(value['fieldChecks']);l.add('Evidence IDs: '+', '.join(value['evidenceIds']),'small')
        for option in ai.get('pathways',[]):
            l.sub(option['name']);l.add('Potential benefits: '+' '.join(option['benefits']));l.add('Possible harms: '+' '.join(option['harms']));l.add('When inappropriate: '+option['inappropriate']);l.add('Field checks: '+' '.join(option['fieldChecks']));l.add('Evidence IDs: '+', '.join(option['evidenceIds']),'small')
    if data['review']:
        l.heading('Appendix G — Consented Human Review')
        l.add(status['label']+'. Identity and qualifications are unverified; no action authorised.')
        for key,label in [('reviewer','Reviewer'),('date','Review date'),('preferredOption','Preferred option'),('rationale','Justification'),('challengedItems','Challenges'),('overriddenAssessments','Overrides'),('unresolvedRisks','Unresolved risks'),('supportingEvidence','Supporting evidence')]:l.sub(label);l.add(data['review'].get(key) or 'Not recorded')
        if data['includeNotes']:l.sub('Additional notes — included with consent');l.add(data['review'].get('additionalNotes') or 'None')
    buffer=io.BytesIO();l.build(buffer);return buffer.getvalue()
