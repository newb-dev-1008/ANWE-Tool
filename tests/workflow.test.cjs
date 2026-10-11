const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const providers = require('../data/providers.js');
const geo = require('../data/geography.js');
const scenario = require('../data/scenario.js');

function harness() {
  const elements = new Map();
  const storage = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, {innerHTML:'', textContent:'', value:'', style:{}, hidden:true,
      classList:{add(){},remove(){},contains(){return false},toggle(){}},
      setAttribute(){}, removeAttribute(){}, focus(){}, querySelector(){return element('modal-close')}, querySelectorAll(){return []},
      handlers:{}, addEventListener(name, handler){this.handlers[name]=handler}, click(){}, getContext(){return null}});
    return elements.get(id);
  };
  const context = vm.createContext({document:{getElementById:element,querySelectorAll(){return []},addEventListener(){},
    createElement(){return element('download')},body:{appendChild(){},removeChild(){}}},
    window:{innerWidth:1200}, localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
    console, Blob, URL, AbortController, clearTimeout, setTimeout, requestAnimationFrame: fn=>fn(), confirm:()=>true});
  for (const file of ['data/scenario.js','data/geography.js','data/providers.js','app.js','integrations.js','workspace.js']) vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
  vm.runInContext('loadLiveData=async()=>{}',context);
  return {context,element,storage,run:code=>vm.runInContext(code,context)};
}

test('planned providers do not fabricate responses; invalid provenance and errors fail closed', async()=>{
  assert.equal((await providers.load('effis',geo)).status,'unavailable');
  providers.register('effis',async()=>({payload:42}));
  assert.equal((await providers.load('effis',geo)).status,'unavailable');
  providers.register('effis',async()=>{throw new Error('offline')});
  assert.equal((await providers.load('effis',geo)).data,null);
  providers.register('effis',async()=>({evidenceKind:'demonstration',source:'test fixture',date:'2026-10-10',limitations:'not measured',payload:[]}));
  assert.equal((await providers.load('effis',geo)).status,'available');
});

test('real case window and hypothetical welfare guilds remain distinct',()=>{
  const perimeter=JSON.parse(fs.readFileSync('data/culebra-perimeter.json','utf8'));
  assert.equal(geo.id,'culebra-june-2022');
  assert.match(geo.coverageLabel,/not the burned/);
  assert.equal(perimeter.geojson.features.length,505);
  assert.equal(scenario.focalSpecies.length,6);
  for(const species of scenario.focalSpecies){
    assert.equal(species.evidenceKind,'hypothetical');
    for(const domain of Object.values(species.welfareContext)) assert.equal(domain.evidenceType,'Hypothetical');
  }
  for(const option of scenario.recoveryPathways){assert.ok(option.inappropriate);assert.ok(option.reviewRequired)}
});

test('existing screens render with revised data and escape review content',()=>{
  const h=harness();
  h.run('renderWelfareContext(); renderExpertReview(); renderSideBySide(document.getElementById("compare")); renderStacked(document.getElementById("stack")); renderBySpecies(document.getElementById("species")); renderJusticeTable(); renderEvaluationChecklist();');
  assert.match(h.element('compare').innerHTML,/When inappropriate/);
  assert.match(h.element('species').innerHTML,/Mammals/);
  h.run('STATE.expertRecord.supportingEvidence="<script>bad</script>"; renderExpertReview();');
  assert.match(h.element('expert-review-form').innerHTML,/&lt;script&gt;/);
});

test('save validation, local restore, summary, storage failure and clearing',()=>{
  const h=harness();
  h.run('saveExpertRecord()');
  assert.equal(h.storage.size,0);
  h.run('STATE.expertRecord.reviewer="Reviewer"; STATE.expertRecord.rationale="Defer until surveyed"; STATE.expertRecord.supportingEvidence="Survey requested"; saveExpertRecord();');
  assert.equal(h.storage.size,1);
  h.run('STATE.expertRecord.reviewer=""; restoreLocalRecord();');
  assert.equal(h.run('STATE.expertRecord.reviewer'),'Reviewer');
  assert.match(h.run('restorationSummary()'),/Defer until surveyed/);
  assert.match(h.run('restorationSummary()'),/No verified current occupancy/);
  h.run('selectDemoArea(); viewSummary();');
  assert.equal(h.element('selected-area').hidden,false);
  assert.match(h.element('summary-text').textContent,/Case selected this session: Yes/);
  h.run('localStorage.setItem=()=>{throw Error("quota")}; saveExpertRecord();');
  assert.match(h.element('save-status').textContent,/storage unavailable/);
  h.run('clearRecord();');
  assert.equal(h.storage.size,0);
  assert.equal(h.run('STATE.expertRecord.savedAt'),null);
});

test('malformed local storage and unavailable map leave review accessible',()=>{
  const h=harness();
  h.storage.set('anwe-culebra-review-v3','invalid JSON');
  h.run('init(); initWorkspace(); selectDemoArea(); renderExpertReview();');
  assert.match(h.element('record-notice').textContent,/invalid/);
  assert.match(h.element('geographic-map').textContent,/unavailable/);
  assert.equal(h.element('selected-area').hidden,false);
});

test('map selection uses actual perimeter and survives reference tile failure',()=>{
  const h=harness(),calls=[],handlers={};
  const map={setView(){calls.push('view');return this},fitBounds(){calls.push('bounds')},removeLayer(){},on(){},attributionControl:{addAttribution(){}}};
  const layer=()=>({addTo(){return this},bindTooltip(){return this},on(event,fn){handlers[event]=fn;return this},getBounds(){return []}});
  h.context.L={map:()=>map,tileLayer:layer,geoJSON:layer,marker:layer,divIcon:x=>x};
  h.context.fixture=JSON.parse(fs.readFileSync('data/culebra-perimeter.json','utf8'));
  h.run('initWorkspace();renderPerimeter(fixture);selectDemoArea()');
  assert.ok(calls.includes('bounds'));
  assert.equal(h.element('selected-area').hidden,false);
  handlers.tileerror();
  assert.match(h.element('map-status').textContent,/unavailable/);
  h.run('showSpain()');assert.equal(calls.at(-1),'view');
});

test('JSON export includes current draft, evidence and explicit authority limitation',async()=>{
  const h=harness();
  let blob;
  h.context.URL={createObjectURL(value){blob=value;return 'blob:test'},revokeObjectURL(){}};
  h.run('STATE.expertRecord.rationale="Current unsaved draft"; exportRecord()');
  const record=JSON.parse(await blob.text());
  assert.equal(record.expertReview.rationale,'Current unsaved draft');
  assert.equal(record.expertReview.savedAt,null);
  assert.equal(record.geography.id,'culebra-june-2022');
  assert.ok(record.liveEvidenceAndAI);
  assert.match(record.recordStatus,/no verified sign-off/);
  assert.equal(record.restorationAlternatives.length,3);
});

test('all local script and stylesheet references exist and element IDs are unique',()=>{
  const html=fs.readFileSync('index.html','utf8');
  for(const [,file] of html.matchAll(/(?:src|href)="([^" ]+\.(?:js|css))"/g)) assert.ok(fs.existsSync(file),file);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length);
});
