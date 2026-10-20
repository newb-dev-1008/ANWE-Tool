from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
 page=b.new_page(viewport={'width':1440,'height':1100});errors=[];sent=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 def answer(route):
  sent.append(route.request.post_data_json)
  route.fulfill(json={'summary':'TEST FIXTURE: Defer a final choice pending field checks.','recommendation':{'pathway':'Natural regeneration and monitoring','reason':'Conditional test suggestion.','changeCondition':'Verified hazards could justify intervention.'},'speciesPlans':[{'speciesName':'TEST species','habitatAction':'Conditional habitat support.','fieldCheck':'Verify animal use.','url':'https://www.gbif.org/occurrence/1'}],'hypotheses':['Human and animal interests may require targeted measures.'],'unknowns':['Current occupancy is unknown.'],'pathways':[],'valuesAssessment':[],'supportingSources':[],'model':'test fixture','evidenceVersion':'test fixture','question':route.request.post_data_json['question']})
 def status(route):
  response=route.fetch();data=response.json();data['ai']={'enabled':True,'provider':'gemini','model':'test fixture','reason':None};route.fulfill(response=response,json=data)
 page.route('**/api/status',status)
 page.route('**/api/ai',answer)
 page.goto('http://localhost:8081');page.wait_for_selector('#screen-demo-start.active')
 page.locator('#nav-demo-options').click()
 assert page.locator('#screen-demo-options .demo-ai-panel').is_visible()
 page.locator('#screen-demo-options .ai-example').click()
 assert 'Hypothetical' in page.locator('#screen-demo-options .demo-ai-question').input_value()
 page.locator('#screen-demo-options .demo-ai-ask').click()
 page.wait_for_selector('#screen-demo-options .demo-ai-answer')
 assert 'Unverified user context' not in sent[-1]['question']
 assert 'wolves may use' in sent[-1]['question']
 assert len(sent[-1]['question'])<=2000
 assert page.locator('#screen-demo-options .ai-primary').count()==1
 assert page.locator('#screen-demo-options .ai-species-card').count()==1
 page.locator('#demo-authored-options > summary').click()
 page.locator('.demo-option .btn').first.click()
 chosen=page.evaluate('STATE.expertRecord.preferredOption')
 page.locator('.decision-ai-review > summary').click()
 page.fill('#demo-human-need','PRIVATE_TEST_NEED')
 page.locator('#screen-demo-decision .demo-ai-share').check()
 page.locator('#screen-demo-decision .demo-ai-ask').click()
 page.wait_for_function('!DEMO_AI_BUSY')
 assert 'PRIVATE_TEST_NEED' in sent[-1]['question']
 assert page.evaluate('STATE.expertRecord.preferredOption')==chosen
 assert page.evaluate('STATE.expertRecord.approvalConfirmed') is False
 page.screenshot(path='.runtime/demo-flow-check/ai-guidance-fixture.png',full_page=True,animations='disabled')
 assert not errors,errors
 print('AI main-flow rendering, opt-in notes, manual choice and no approval passed (mock model response; no paid call).')
 b.close()
