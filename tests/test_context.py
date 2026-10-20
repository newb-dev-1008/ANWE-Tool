import unittest
from unittest.mock import patch
from backend.context import normalise_places, load_context, parse_geonames
from backend.common import ServiceError
from backend.evidence import EvidenceStore
class ContextTests(unittest.TestCase):
 def test_distances_and_no_risk_inference(self):
  x=normalise_places({'elements':[{'type':'node','id':1,'lat':41.93,'lon':-6.22,'tags':{'place':'village','name':'TEST village'}},{'type':'way','id':2,'tags':{'landuse':'farmland'}}]})
  self.assertEqual(x['mappedSettlementCount'],1)
  self.assertGreaterEqual(x['settlements'][0]['distanceKm'],0)
  self.assertEqual(x['landUseFeatureCounts'],{'farmland':1})
  self.assertNotIn('risk',x)
 def test_partial_queries_rejected(self):
  with self.assertRaises(ServiceError):normalise_places({'remark':'timeout','elements':[]})
 def test_unavailable_and_replaced_evidence(self):
  with patch('backend.context.settlements',side_effect=ServiceError('offline')),patch('backend.context.conservation',return_value={'retrievedAt':'test','limitations':'test','records':[]}):
   x=load_context()
  self.assertEqual(x['settlements']['status'],'unavailable')
  self.assertEqual(len(x['records']),1)
  store=EvidenceStore();store.put('context',x)
  self.assertIn('context-conservation',store.records)
  store.put('context',{'records':[]})
  self.assertNotIn('context-conservation',store.records)
 def test_geonames_filters_historical_and_outside_records(self):
  def row(key,code,lat=41.93,country='ES'):
   return '\t'.join([str(key),'TEST village','','',str(lat),'-6.22','P',code,country,'','','','','','0','','','','2026-01-01'])
  data=parse_geonames('\n'.join([row(1,'PPL'),row(2,'PPLQ'),row(3,'PPL',lat=40),row(4,'PPL',country='PT')]))
  self.assertEqual(len(data['elements']),1)
  x=normalise_places(data)
  self.assertEqual(x['mappedSettlementCount'],1)
  self.assertEqual(x['settlements'][0]['url'],'https://www.geonames.org/1/')
  self.assertEqual(x['landUseFeatureCounts'],{})
if __name__=='__main__':unittest.main()
