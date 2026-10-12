"""Optional Chrome smoke checks. Run against your local server; no paid model call.

python tests/browser_smoke.py http://localhost:8080
Requires requirements-dev.txt and an installed Chrome executable on Windows.
Public biodiversity comparison requests may use the 24-hour cache.
"""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

url=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8080'
if not url.startswith(('http://localhost:','http://127.0.0.1:')):raise SystemExit('Use a local ANWE URL.')
out=Path('.runtime/browser-check');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
    page=browser.new_page(viewport={'width':1440,'height':1000})
    errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(url);page.wait_for_function('LIVE.catalogue && LIVE.biodiversity',timeout=180000)
    page.locator('button',has_text='Select Culebra case').click()
    page.locator('#nav-design-for-values').click()
    assert page.locator('#values-matrix tbody tr').count()==5
    page.select_option('#value-filter','animal-welfare');assert page.locator('#values-matrix tbody tr').count()==1
    page.select_option('#value-filter','All');page.wait_for_timeout(350)
    page.screenshot(path=str(out/'values.png'))
    page.locator('#nav-biodiversity-comparison').click();page.locator('#run-comparison').click()
    page.wait_for_function('LIVE.comparison!==null',timeout=300000)
    before=page.evaluate('LIVE.comparison.before.retrieved')
    page.fill('#after-start','2022-06-20');page.locator('#run-comparison').click()
    page.wait_for_function('!document.getElementById("run-comparison").disabled')
    assert 'Comparison failed' in page.locator('#comparison-status').text_content()
    assert page.evaluate('LIVE.comparison.before.retrieved')==before
    page.fill('#after-start','2023-06-01')
    page.set_viewport_size({'width':390,'height':844})
    assert page.evaluate('document.documentElement.scrollWidth')==390
    page.screenshot(path=str(out/'comparison-mobile.png'))
    page.set_viewport_size({'width':1440,'height':1000})
    page.locator('#nav-expert-review').click()
    page.select_option('#human-review-status','reviewed')
    page.fill('#reviewer-name','PRIVATE BROWSER REVIEWER');page.fill('#decision-rationale','PRIVATE BROWSER JUSTIFICATION')
    page.select_option('#preferred-option',index=1)
    page.locator('button[onclick="saveExpertRecord()"]').click()
    assert 'confirmation' in page.locator('#save-status').text_content()
    page.check('#approval-confirmation');page.locator('button[onclick="saveExpertRecord()"]').click()
    assert 'Saved locally' in page.locator('#save-status').text_content()
    assert page.evaluate('reviewState().reviewed') is True
    page.fill('#decision-rationale','PRIVATE EDITED JUSTIFICATION')
    assert page.evaluate('STATE.expertRecord.approvalConfirmed') is False
    page.check('#approval-confirmation');page.locator('button[onclick="saveExpertRecord()"]').click()
    page.reload();page.wait_for_function('LIVE.catalogue && LIVE.biodiversity',timeout=180000)
    assert page.evaluate('STATE.expertRecord.reviewer')=='PRIVATE BROWSER REVIEWER'
    # A controlled UI failure fixture exercises question preservation without billing.
    page.evaluate('selectDemoArea()');page.locator('#nav-ai-assistant').click()
    page.route('**/api/ai',lambda route:route.fulfill(status=502,content_type='application/json',body=json.dumps({'error':'Fixture validation failure; question preserved'})))
    page.fill('#ai-question','What remains uncertain?');page.locator('#ask-ai').click()
    page.wait_for_function('!document.getElementById("ask-ai").disabled')
    assert page.locator('#ai-question').input_value()=='What remains uncertain?'
    assert 'Fixture validation failure' in page.locator('#ai-status').text_content()
    page.locator('#nav-restoration-summary').click()
    with page.expect_download(timeout=120000) as download:page.locator('#download-pdf').click()
    download.value.save_as(str(out/'assessment.pdf'))
    page.evaluate('localStorage.removeItem(RECORD_KEY)')
    assert not errors,errors
    browser.close()

import pymupdf
with pymupdf.open(out/'assessment.pdf') as document:
    text='\n'.join(page.get_text() for page in document)
    assert 'PRIVATE BROWSER' not in text
    assert 'Design for Values' in text
    assert 'Biodiversity Before and After' in text
    assert 'No AI-generated ecological assessment was completed for this report.' in text
    for i in [0,2,4,7,len(document)-1]:
        document[i].get_pixmap(matrix=pymupdf.Matrix(1,1)).save(str(out/f'pdf-page-{i+1}.png'))
    print('Browser smoke passed; PDF pages:',len(document))
