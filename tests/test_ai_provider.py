import os
import json
import unittest
from unittest.mock import Mock, patch
from backend.ai_provider import generate, configured, gemini_schema
from backend.common import ServiceError

class GeminiTests(unittest.TestCase):
    def setUp(self):
        self.env=patch.dict(os.environ,{'AI_PROVIDER':'gemini','GEMINI_API_KEY':'test-key','GEMINI_MODEL':'gemini-3.5-flash-lite'})
        self.env.start();self.addCleanup(self.env.stop)
        self.body={'instructions':'Expert discussion only','input':[{'content':'Evidence fixture'}], 'max_output_tokens':1800,
                   'text':{'format':{'schema':{'type':'object','properties':{'summary':{'type':'string','pattern':'test'}}}}}}

    def test_primary_and_species_suggestions_require_recorded_evidence(self):
        from backend.ai import validate_output
        from backend.case import FIRE_EVIDENCE
        from test_backend import valid_answer
        record={**FIRE_EVIDENCE,'id':'gbif-fixture','scientificName':'Vulpes vulpes','url':'https://www.gbif.org/occurrence/1'}
        answer=valid_answer();answer['speciesSupport']=[{'evidenceId':'gbif-fixture','habitatAction':'Retain suitable cover if field surveys establish a need.','fieldCheck':'Survey current use and disturbance before work.'}]
        result=validate_output(answer,[FIRE_EVIDENCE,record])
        self.assertEqual(result['speciesPlans'][0]['speciesName'],'Vulpes vulpes')
        self.assertIn('Unverified',result['speciesPlans'][0]['needStatus'])
        self.assertTrue(any(s['id']=='gbif-fixture' for s in result['supportingSources']))
        answer['speciesSupport'][0]['evidenceId']=FIRE_EVIDENCE['id']
        with self.assertRaises(ServiceError):validate_output(answer,[FIRE_EVIDENCE,record])
        answer=valid_answer();answer['recommendation']['pathway']='Invented automatic winner'
        with self.assertRaises(ServiceError):validate_output(answer,[FIRE_EVIDENCE])

    def test_transport_and_provenance(self):
        remote=Mock();remote.return_value.json.return_value={'modelVersion':'gemini-fixture','responseId':'actual-provider-id',
            'candidates':[{'finishReason':'STOP','content':{'parts':[{'text':'{"summary":"Conditional suggestion"}'},{'text':'private thinking','thought':True}]}}], 'usageMetadata':{'totalTokenCount':12}}
        answer=generate(self.body,remote)
        self.assertEqual(answer['id'],'actual-provider-id');self.assertEqual(answer['status'],'completed')
        args,kwargs=remote.call_args
        self.assertTrue(args[0].startswith('https://generativelanguage.googleapis.com/'))
        self.assertNotIn('test-key',args[0]);self.assertEqual(kwargs['headers'],{'x-goog-api-key':'test-key'})
        self.assertEqual(kwargs['json']['generationConfig']['responseMimeType'],'application/json')
        self.assertNotIn('pattern',str(kwargs['json']['generationConfig']['responseJsonSchema']))
        self.assertNotIn('private thinking',str(answer['output']))

    def test_assessment_uses_existing_evidence_validation(self):
        from backend.ai import assess
        from backend.case import FIRE_EVIDENCE
        from test_backend import valid_answer
        remote=Mock();remote.return_value.json.return_value={'responseId':'gemini-assessment-fixture','candidates':[{'finishReason':'STOP','content':{'parts':[{'text':json.dumps(valid_answer())}]}}]}
        with patch('backend.ai.request',remote),patch('backend.ai.reserve_call'),patch('backend.ai.STORE.relevant',return_value=('test-version',[FIRE_EVIDENCE])):
            result=assess('Suggest an approach for expert discussion','test-version')
        self.assertEqual(result['provider'],'gemini')
        self.assertTrue(result['humanReviewRequired'])
        self.assertEqual(len(result['pathways']),3)
        self.assertIn('generativelanguage.googleapis.com',remote.call_args.args[0])

    def test_quota_never_falls_back_to_paid_provider(self):
        remote=Mock(side_effect=ServiceError('limited',429))
        with self.assertRaisesRegex(ServiceError,'no paid provider fallback'):generate(self.body,remote)
        self.assertEqual(remote.call_count,1)

    def test_disabled_and_invalid_configuration(self):
        with patch.dict(os.environ,{'GEMINI_API_KEY':''}):self.assertFalse(configured())
        remote=Mock()
        with patch.dict(os.environ,{'GEMINI_MODEL':'../untrusted'}):
            with self.assertRaises(ServiceError):generate(self.body,remote)
        remote.assert_not_called()

    def test_blocked_and_truncated_responses(self):
        remote=Mock()
        remote.return_value.json.return_value={'promptFeedback':{'blockReason':'SAFETY'}}
        with self.assertRaises(ServiceError):generate(self.body,remote)
        remote.return_value.json.return_value={'candidates':[{'finishReason':'MAX_TOKENS','content':{'parts':[{'text':'{'}]}}]}
        self.assertEqual(generate(self.body,remote)['status'],'incomplete')

if __name__=='__main__':unittest.main()
