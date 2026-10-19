"""Local Chrome check for the simplified demo. No model or processing requests."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
import pymupdf as fitz

url=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8080'
if not url.startswith(('http://localhost:','http://127.0.0.1:')):raise SystemExit('Local ANWE URL required.')
out=Path('.runtime/demo-flow-check');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
    page=browser.new_page(viewport={'width':1440,'height':1100});errors=[];paid=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('request',lambda r:paid.append(r.url) if '/api/ai' in r.url or '/api/satellite/process' in r.url else None)
    page.goto(url);page.wait_for_selector('#screen-demo-start.active')
    assert not page.locator('.advanced-nav').get_attribute('open')
    assert page.locator('.sidebar-nav > button').count()==3
    page.screenshot(path=str(out/'01-case.png'),full_page=True,animations='disabled')
    page.locator('#nav-demo-options').click()
    assert page.locator('.demo-option').count()==3
    assert page.evaluate('STATE.expertRecord.preferredOption')==''
    page.screenshot(path=str(out/'02-options.png'),full_page=True,animations='disabled')
    page.locator('.demo-option .btn').nth(1).click()
    assert page.locator('#demo-option').input_value()=='Assisted ecological restoration'
    page.select_option('#demo-human-category','safety')
    page.fill('#demo-human-need','GUIDED_PRIVATE_NEED: residents require safe road access; inspect unstable trees.')
    page.fill('#demo-safeguards','GUIDED_PRIVATE_SAFEGUARD: inspect refuges and use selective work.')
    page.fill('#demo-rationale','GUIDED_PRIVATE_REASON: defer work until road and wildlife checks.')
    page.select_option('#demo-status','deferred')
    page.locator('#demo-decision-form button[type=submit]').click()
    assert 'Draft saved' in page.locator('#demo-save-status').inner_text()
    assert page.evaluate('STATE.expertRecord.approvalConfirmed') is False
    page.screenshot(path=str(out/'03-decision.png'),full_page=True,animations='disabled')
    with page.expect_download(timeout=120000) as download:page.locator('#demo-download').click()
    download.value.save_as(str(out/'private-default.pdf'))
    page.check('#demo-include-decision')
    with page.expect_download(timeout=120000) as download:page.locator('#demo-download').click()
    download.value.save_as(str(out/'consented.pdf'))
    page.reload();page.wait_for_selector('#screen-demo-start.active');page.locator('#nav-demo-decision').click()
    assert 'GUIDED_PRIVATE_NEED' in page.locator('#demo-human-need').input_value()
    for n,nav in [(1,'demo-start'),(2,'demo-options'),(3,'demo-decision')]:
        page.set_viewport_size({'width':390,'height':844});page.locator('#hamburger').click();page.locator('#nav-'+nav).click()
        assert not page.locator('#sidebar').evaluate('(node)=>node.classList.contains("open")')
        assert page.evaluate('document.documentElement.scrollWidth')==390
        page.screenshot(path=str(out/f'mobile-{n}.png'),full_page=True,animations='disabled')
    assert not errors,errors
    assert not paid,paid
    browser.close()
for filename,consent in [('private-default.pdf',False),('consented.pdf',True)]:
    with fitz.open(out/filename) as d:
        text=' '.join(p.get_text() for p in d)
        assert ('GUIDED_PRIVATE_NEED' in text)==consent
        assert ('GUIDED_PRIVATE_SAFEGUARD' in text)==consent
        assert ('GUIDED_PRIVATE_REASON' in text)==consent
        if consent:assert 'User-stated category: Safety and basic needs' in text
print('Three steps, selection, saving/restoration, PDF consent and mobile checks passed. No paid requests.')
