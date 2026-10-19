import copy
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch
from shapely.geometry import Polygon
from backend.common import ServiceError
from backend.case import FIRE_EVIDENCE
from backend.comparison import parameters, observation_date, spatial_class, compare_records, FORWARD, fetch_records
from backend.values import FOUNDATION, VALUE_NAMES, pathway_assessment, review_status
from backend.evidence import EvidenceStore
from backend.ai import validate_output, assess
from backend.report import make_report
from test_backend import valid_answer

def geometry():
    return Polygon([FORWARD(*p) for p in [(-6.23,41.91),(-6.21,41.91),(-6.21,41.93),(-6.23,41.93)]])

def record(key=1,observed='2021-06-12',lng=-6.22,lat=41.92,species=10):
    return {'key':key,'eventDate':observed,'modified':'2023-06-12','kingdom':'Animalia','class':'Mammalia',
      'decimalLongitude':lng,'decimalLatitude':lat,'coordinateUncertaintyInMeters':5,
      'speciesKey':species,'species':'Test animal '+str(species),'scientificName':'Test animal',
      'datasetKey':'fixture-provider','license':'CC-BY','occurrenceStatus':'PRESENT'}

class ComparisonTests(unittest.TestCase):
    def test_event_date_only_and_precision(self):
        self.assertEqual(observation_date({'modified':'2023-06-12'})[1],'missing')
        for value in ['2021','2021-06','2021-06-01/2021-06-30','2021-02-30']:
            self.assertIsNone(observation_date({'eventDate':value})[0])
        self.assertEqual(str(observation_date({'eventDate':'2021-06-12T12:00:00Z'})[0]),'2021-06-12')
    def test_windows_and_buffer_constraints(self):
        self.assertEqual(parameters()['bufferKm'],5)
        for change in [{'beforeEnd':'2022-06-15'},{'afterStart':'2022-06-20'},{'bufferKm':0},{'bufferKm':float('nan')},{'bufferKm':True},{'group':'invented'},{'afterEnd':'2020-01-01'}]:
            with self.assertRaises(ServiceError):parameters(change)
    def test_same_geography_and_uncertainty(self):
        burned=geometry();outer=burned.buffer(5000)
        self.assertEqual(spatial_class(record(),burned,outer),'burned')
        self.assertEqual(spatial_class(record(lng=-6.20),burned,outer),'buffer')
        unknown=record();unknown.pop('coordinateUncertaintyInMeters');self.assertEqual(spatial_class(unknown,burned,outer),'uncertain')
        uncertain=record();uncertain['coordinateUncertaintyInMeters']=3000;self.assertEqual(spatial_class(uncertain,burned,outer),'uncertain')
        self.assertEqual(spatial_class(record(lng=-6.5),burned,outer),'outside')
    def test_temporal_species_sets_missing_dates_and_privacy(self):
        before=[record(),record(2,species=11),record(3,observed='2021-06'),record(4,observed=None),record(5,observed='2023-06-12')]
        after=[record(6,'2023-06-12'),record(7,'2023-06-12',species=12)]
        result=compare_records(before,after,parameters(),geometry(),audit=[record(8,observed=None)])
        self.assertEqual(result['before']['zones']['burned']['records'],2)
        self.assertEqual(len(result['comparison']['burned']['both']),1)
        self.assertEqual(len(result['comparison']['burned']['onlyBefore']),1)
        self.assertEqual(len(result['comparison']['burned']['onlyAfter']),1)
        self.assertEqual(result['before']['quality']['missingDates'],1)
        self.assertEqual(result['before']['quality']['impreciseDates'],1)
        self.assertEqual(result['before']['quality']['outsideWindow'],1)
        self.assertEqual(result['dateAudit']['missingDates'],1)
        self.assertNotIn('decimalLongitude',json.dumps(result));self.assertIsNone(result['fireEnd'])
        self.assertIn('does not mean disappearance',result['limitations'])
    def test_taxonomic_filter_and_deduplication(self):
        bird=record(2);bird['class']='Aves'
        result=compare_records([record(),record(),bird],[],parameters({'group':'Mammalia'}),geometry())
        self.assertEqual(result['before']['zones']['burned']['records'],1)
        self.assertEqual(result['before']['quality']['duplicateIds'],1)
    def test_pagination_and_honest_truncation(self):
        response=Mock();response.json.side_effect=[{'results':[record(i) for i in range(300)],'count':700,'endOfRecords':False},
                                                {'results':[record(i) for i in range(300,400)],'count':700,'endOfRecords':False}]
        with patch('backend.comparison.request',return_value=response) as remote:
            rows,total=fetch_records({},400)
            self.assertEqual(len(rows),400);self.assertEqual(total,700)
            self.assertEqual(remote.call_args.kwargs['params']['offset'],300)
    def test_comparison_is_available_in_grounded_context(self):
        data=compare_records([record()],[record(2,'2023-06-12')],parameters(),geometry())
        data['method']='Fixture deterministic method'
        store=EvidenceStore();store.put('comparison',data);_,context=store.relevant('before and after')
        comparison=next(r for r in context if r['id'].startswith('comparison-'))
        self.assertEqual(comparison['measurements']['before']['burned']['records'],1)
        self.assertNotIn('decimalLatitude',json.dumps(context))

class ValueTests(unittest.TestCase):
    def test_foundation_dimensions_and_no_action_authorisation(self):
        self.assertEqual(len(VALUE_NAMES),5)
        option={'id':'opt-A','evidence':{'sources':[]},'fieldChecksNeeded':['Survey']}
        assessment=pathway_assessment(option)
        for value in FOUNDATION['values']:self.assertEqual(set(assessment[value['value']]),set(value['dimensions']))
        self.assertFalse(review_status({},'version')['actionAuthorised'])
    def test_review_confirmation_justification_and_stale_evidence(self):
        review={'reviewStatus':'reviewed','reviewer':'Fixture reviewer','date':'2026-10-12','rationale':'Investigate only','preferredOption':'Natural regeneration','approvalConfirmed':True,'evidenceVersion':'older'}
        status=review_status(review,'current');self.assertFalse(status['evidenceCurrent']);self.assertFalse(status['identityVerified']);self.assertTrue(status['furtherApprovalRequired'])
        for key in ['reviewer','rationale','preferredOption','approvalConfirmed']:
            incomplete={**review};incomplete.pop(key)
            with self.assertRaises(ServiceError):review_status(incomplete,'version')
    def test_generated_js_foundation_matches_json(self):
        text=Path('data/design-values.js').read_text(encoding='utf-8')
        obj=json.loads(text[text.index('{'):text.rindex('\n};')+2])
        self.assertEqual(obj,FOUNDATION)

class GroundedAITests(unittest.TestCase):
    def test_denial_of_approval_is_allowed_but_approval_assertions_are_not(self):
        answer=valid_answer();answer['unknowns']=['Restoration is not officially approved; expert review is required.']
        validate_output(answer,[FIRE_EVIDENCE])
        answer['unknowns']=['Restoration is officially approved.']
        with self.assertRaises(ServiceError):validate_output(answer,[FIRE_EVIDENCE])
    def test_sourced_dates_counts_indices_and_areas(self):
        evidence=[FIRE_EVIDENCE,{'id':'analysis-fixture','kind':'Derived','url':'https://example.org/fixture','measurements':{'meanNDVI':.42,'dNBR':.31,'areaHa':123.5,'records':17}}]
        answer=valid_answer();answer['factualClaims']=[{'evidenceId':FIRE_EVIDENCE['id'],'field':'eventStart'}]+[{'evidenceId':'analysis-fixture','field':field} for field in ['meanNDVI','dNBR','areaHa','records']]
        valid=validate_output(answer,evidence)
        self.assertEqual([m['value'] for m in valid['sourceMeasurements']],['2022-06-15',.42,.31,123.5,17])
        for change in [{'evidenceId':'analysis-fixture','field':'mortality'},{'evidenceId':'made-up','field':'records'},{'evidenceId':'analysis-fixture','field':'records','value':999}]:
            answer['factualClaims']=[change]
            with self.assertRaises(ServiceError):validate_output(answer,evidence)
    def test_values_required_and_malformed_output(self):
        for value in [None,[],{'invented':'payload'}]:
            with self.assertRaises(ServiceError):validate_output(value,[FIRE_EVIDENCE])
        for key,change in [('humanReviewRequired',False),('valuesAssessment',valid_answer()['valuesAssessment'][:4]),('pathways',[None,None,None])]:
            answer=valid_answer();answer[key]=change
            with self.assertRaises(ServiceError):validate_output(answer,[FIRE_EVIDENCE])
    def test_one_controlled_repair_logged_without_response_or_secrets(self):
        invalid=valid_answer();invalid['factualClaims']=[{'evidenceId':FIRE_EVIDENCE['id'],'field':'made-up'}]
        responses=[{'status':'completed','id':'fixture-failed','output':[{'type':'message','content':[{'type':'output_text','text':json.dumps(invalid)}]}]},
                   {'status':'completed','id':'fixture-repaired','output':[{'type':'message','content':[{'type':'output_text','text':json.dumps(valid_answer())}]}]}]
        remote=Mock();remote.json.side_effect=responses
        with tempfile.TemporaryDirectory() as directory,patch('backend.ai.RUNTIME',Path(directory)),patch('backend.ai.configured',return_value=True),patch.dict('os.environ',{'OPENAI_API_KEY':'fixture-key','OPENAI_MODEL':'fixture-model'}),patch('backend.ai.STORE.relevant',return_value=('version',[FIRE_EVIDENCE])),patch('backend.ai.reserve_call') as budget,patch('backend.ai.request',return_value=remote) as call:
            answer=assess('Fixture question','version');self.assertEqual(answer['attempts'],2);self.assertEqual(call.call_count,2);self.assertEqual(budget.call_count,2)
            log=(Path(directory)/'ai-validation.jsonl').read_text();self.assertNotIn('fixture-key',log);self.assertNotIn('Fixture question',log);self.assertNotIn('made-up',log)
    def test_demo_questions_validate_with_explicit_mock(self):
        questions=['What evidence is available about the Sierra de la Culebra wildfire?','Which species were recorded before and after the fire?','What does the change in GBIF observations tell us?','What remains uncertain?','What are the possible animal welfare impacts of replanting?','What restoration pathway appears appropriate to investigate?','How do the five ANWE values affect this decision?']
        remote=Mock();remote.json.return_value={'status':'completed','id':'fixture-seven','output':[{'type':'message','content':[{'type':'output_text','text':json.dumps(valid_answer())}]}]}
        with patch('backend.ai.configured',return_value=True),patch.dict('os.environ',{'OPENAI_API_KEY':'fixture-key','OPENAI_MODEL':'fixture-model'}),patch('backend.ai.STORE.relevant',return_value=('version',[FIRE_EVIDENCE])),patch('backend.ai.reserve_call'),patch('backend.ai.request',return_value=remote):
            for question in questions:self.assertEqual(assess(question,'version')['question'],question)

class PDFTests(unittest.TestCase):
    def test_ethical_policy_and_tradeoff_survive_report_privacy_defaults(self):
        import pymupdf as fitz
        from backend.values import pathway_tradeoff
        policy=FOUNDATION['ethicalPosition']
        self.assertIn('closely balanced',policy['decisionRule'])
        self.assertIn('Human safety',policy['limits'])
        self.assertIn('not a conclusion measured',policy['justification'])
        profile=pathway_tradeoff({'id':'opt-A'});profile['conflict']='MUTATED'
        self.assertNotEqual(FOUNDATION['tradeoffProfiles']['opt-A']['conflict'],'MUTATED')
        for option_id in ['opt-A','opt-B','opt-C']:
            self.assertEqual(set(pathway_tradeoff({'id':option_id})),{'humanObjective','animalInterests','conflict','alternatives','missingEvidence','safeguards'})
        with fitz.open(stream=make_report(EvidenceStore().snapshot(),review={'rationale':'PRIVATE OVERRIDE'}),filetype='pdf') as doc:
            text=' '.join(' '.join(p.get_text().split()) for p in doc)
            self.assertIn('modest welfare priority',text)
            self.assertIn('Human safety',text)
            self.assertIn('Less harmful alternatives',text)
            self.assertNotIn('PRIVATE OVERRIDE',text)
            self.assertEqual([e[2] for e in doc.get_toc()[:7]],list(range(1,8)))

    def test_editorial_clarifications_preserve_original_model_response(self):
        import pymupdf as fitz
        from backend.report_data import clarified_ai_text, ai_editorial_corrections
        snapshot=EvidenceStore().snapshot()
        summary='Historical records show varied species presence before and after the fire.'
        claim='Vegetation indices show decline consistent with fire impact, likely slowing habitat regeneration.'
        answer={**valid_answer(),'summary':summary,'model':'explicit-test-fixture','createdAt':'2026-10-12','question':'Fixture','evidenceVersion':snapshot['version']}
        answer['valuesAssessment'][0]['assessment']=claim
        original=copy.deepcopy(answer)
        self.assertEqual(len(ai_editorial_corrections(answer)),2)
        with fitz.open(stream=make_report(snapshot,[answer]),filetype='pdf') as doc:
            text=' '.join(' '.join(p.get_text().split()) for p in doc)
            self.assertIn('historical recorded observations',text)
            self.assertIn('do not establish the cause of change or the rate of habitat regeneration',text)
            self.assertIn('Original model wording (superseded)',text)
        self.assertEqual(answer,original)
        self.assertEqual(clarified_ai_text('Current animal use remains unknown.'),'Current animal use remains unknown.')

    def test_readable_report_missing_data_privacy_and_source_sections(self):
        import pymupdf as fitz
        snapshot=EvidenceStore().snapshot()
        review={'reviewer':'PRIVATE PERSON','rationale':'PRIVATE JUSTIFICATION','additionalNotes':'PRIVATE NOTES'}
        pdf=make_report(snapshot,review=review)
        with fitz.open(stream=pdf,filetype='pdf') as document:
            text='\n'.join(p.get_text() for p in document)
            self.assertGreaterEqual(len(document),10)
            normalized=' '.join(text.split())
            for heading in ['Executive Summary','Wildfire Context','Environmental Evidence','Biodiversity Before and After','Design for Values Assessment','Restoration Strategy Comparison','AI-Assisted Assessment','Expert Review','Data Sources, Licences and Methodology']:self.assertIn(heading,normalized)
            self.assertIn('How to Read This Report',text)
            self.assertIn('Normalized Difference Vegetation Index',text)
            self.assertIn('Global Biodiversity Information Facility',text)
            self.assertNotIn('PRIVATE',text);self.assertNotIn('decimalLatitude',text);self.assertNotIn('"measurements"',text)
            self.assertIn('No AI-generated ecological assessment was completed for this report.',text);self.assertIn('not available',text)
            self.assertEqual([entry[2] for entry in document.get_toc()[:7]],list(range(1,8)))
    def test_review_details_and_notes_separate_consent(self):
        import pymupdf as fitz
        snapshot=EvidenceStore().snapshot();review={'reviewer':'CONSENTED PERSON','rationale':'CONSENTED JUSTIFICATION','additionalNotes':'PRIVATE NOTES'}
        for consent in [False,True]:
            with fitz.open(stream=make_report(snapshot,review=review,include_review=True,include_notes=consent),filetype='pdf') as document:
                text='\n'.join(p.get_text() for p in document)
                self.assertIn('CONSENTED PERSON',text);self.assertEqual('PRIVATE NOTES' in text,consent)

    def test_dynamic_counts_complete_species_and_unchanged_measurements(self):
        import pymupdf as fitz
        from backend.report_data import biodiversity_rows, species_rows, display_number
        before=[record(key=i,species=1000+i) for i in range(48)]
        after=[record(key=100+i,observed='2023-06-12',species=1000+i) for i in range(7)]
        comparison=compare_records(before,after,parameters({'afterEnd':'2023-07-30','bufferKm':9}),geometry())
        comparison.update(method='Explicit fixture comparison method',retrievedAt='2026-10-12',warning='Fixture only')
        store=EvidenceStore();store.put('comparison',comparison);snapshot=store.snapshot();original=copy.deepcopy(snapshot)
        self.assertEqual(biodiversity_rows(comparison)[0][1:],[48,48,7,7])
        self.assertEqual(len(species_rows(comparison)),48)
        self.assertEqual(display_number(0.11353146284818649),'0.114')
        with fitz.open(stream=make_report(snapshot),filetype='pdf') as doc:
            text='\n'.join(p.get_text() for p in doc)
            for i in range(48):self.assertIn('Test animal '+str(1000+i),text)
            self.assertIn('48 before-window records and 7 after-window records',' '.join(text.split()))
            self.assertIn('2023-07-30',text);self.assertIn('outside buffer: 9 km',text)
            self.assertIn('not a third geographical area',text)
            self.assertGreater(sum(len(p.get_links()) for p in doc),48)
        self.assertEqual(snapshot,original)

    def test_satellite_rounding_preserves_exact_appendix_values(self):
        import pymupdf as fitz
        mean=0.11353146284818649
        analysis={'id':'fixture-analysis','pre':{'id':'fixture-before','date':'2022-06-01','license':'Fixture'},'post':{'id':'fixture-later','date':'2022-08-01','license':'Fixture'},'createdAt':'2026-10-12','grid':'Fixture grid','coverage':'Regional including unburned land','method':'Explicit fixture method','limitations':'Fixture only','statistics':{key:{'mean':mean,'min':-0.456789123456,'max':0.987654321987,'validPixels':123,'totalPixels':456} for key in ['preNDVI','postNDVI','dNBR']}}
        store=EvidenceStore();store.put('analysis',analysis);snapshot=store.snapshot();original=copy.deepcopy(snapshot)
        with fitz.open(stream=make_report(snapshot),filetype='pdf') as doc:
            self.assertIn('0.114',doc[1].get_text())
            text='\n'.join(p.get_text() for p in doc)
            self.assertIn(repr(mean),text);self.assertIn('2022-08-01',text)
            self.assertNotIn('\ufffd',text)
            self.assertEqual([e[2] for e in doc.get_toc()[:7]],list(range(1,8)))
        self.assertEqual(snapshot,original)

    def test_actual_ai_is_optional_and_review_never_implies_endorsement(self):
        import pymupdf as fitz
        snapshot=EvidenceStore().snapshot()
        answer={**valid_answer(),'model':'explicit-test-fixture','createdAt':'2026-10-12','question':'Fixture question', 'evidenceVersion':snapshot['version']}
        review={'reviewStatus':'reviewed','reviewer':'Consented reviewer','date':'2026-10-12','rationale':'Documented reasoning','preferredOption':'opt-A','approvalConfirmed':True}
        with fitz.open(stream=make_report(snapshot,[answer],review,True),filetype='pdf') as doc:
            text='\n'.join(p.get_text() for p in doc)
            self.assertIn('7. AI-Assisted Assessment',text);self.assertIn('explicit-test-fixture',text)
            self.assertIn('credentials unverified',text);self.assertIn('No action is authorised',text)
            self.assertNotIn('No AI-generated ecological assessment was completed',text)

if __name__=='__main__':unittest.main()
