/* A short, optional-detail workflow over the existing evidence and review tools. */
const DEMO_STEPS=['demo-start','demo-options','demo-decision'];
const HUMAN_NEEDS={unknown:'Not established yet',safety:'Safety and basic needs',livelihood:'Livelihoods and essential services',preference:'Preferences and convenience'};
const SIMPLE_OPTIONS=[
 {id:'opt-A',title:'Allow natural regeneration',intro:'Monitor recovery and limit new work.',animal:'May retain cover and avoid immediate disturbance.',human:'Lower immediate work costs, but access or safety problems may remain.',check:'Check regeneration, erosion and urgent risks.'},
 {id:'opt-B',title:'Make targeted repairs',intro:'Address a specific, verified problem.',animal:'May protect habitat, but work can disturb occupied refuges.',human:'Can address local needs with a smaller work area.',check:'Check animal use, timing and less disruptive methods.'},
 {id:'opt-C',title:'Restore habitat actively',intro:'Rebuild a verified missing habitat function.',animal:'May improve habitat later; machinery can cause immediate harm.',human:'May meet restoration goals, but needs resources and justification.',check:'Establish necessity and compare lighter alternatives.'}
];

function demoHeading(step,title,description){return `<p class="demo-eyebrow">STEP ${step} OF 3</p><h1>${title}</h1><p class="demo-intro">${description}</p>`;}
function openDemoStep(id){showScreen(id);window.scrollTo?.({top:0,behavior:'instant'});}
function renderDemoScreen(id){
  if(!DEMO_STEPS.includes(id))return;
  if(id==='demo-start')renderDemoStart();
  if(id==='demo-options')renderDemoOptions();
  if(id==='demo-decision')renderDemoDecision();
}
function renderDemoStart(){
  document.getElementById('screen-demo-start').innerHTML=demoHeading(1,'Restoration after the Culebra fire','Compare restoration choices for Sierra de la Culebra, Spain, after the June 2022 wildfire.')+`
  <div class="demo-principle"><span class="demo-small-label">OUR STARTING POINT</span><h2>Animals’ welfare interests deserve consideration.</h2><p>We give animal welfare a little more weight in closely balanced choices. Human safety, essential needs and unavoidable harms still need a reasoned decision.</p></div>
  <div class="demo-section-head"><h2>What do we know?</h2><button class="btn btn-secondary" id="demo-load" onclick="loadDemoEvidence()">Load case evidence</button></div>
  <div id="demo-evidence" aria-live="polite"></div><p id="demo-load-status" class="demo-muted" role="status"></p>
  <details class="demo-disclosure"><summary>Explore the map and source details</summary><p>Satellite change and historical animal records help frame questions. They do not establish which animals live here now.</p><div class="demo-links"><button class="btn btn-secondary" onclick="showScreen('case-overview')">Map</button><button class="btn btn-secondary" onclick="showScreen('ecological-evidence')">Satellite & sources</button><button class="btn btn-secondary" onclick="showScreen('biodiversity-comparison')">Observation dates & counts</button></div></details>
  <div class="demo-next"><p>You can compare options even when evidence is incomplete.</p><button class="btn btn-primary" onclick="openDemoStep('demo-options')">Compare options <span aria-hidden="true">→</span></button></div>`;
  refreshDemoEvidence();
}
function refreshDemoEvidence(){
  const node=document.getElementById('demo-evidence');if(!node)return;
  const a=LIVE.analysis,b=LIVE.comparison;
  const date=a?`${a.pre.date.slice(0,10)} and ${a.post.date.slice(0,10)}`:'';
  node.innerHTML=`<div class="demo-facts"><article><h3>Fire footprint</h3><p>${LIVE.boundary?'Official mapped extent available.':'Mapped fire extent not loaded.'}</p><small>Mapped observation: 25 June 2022. Final fire end unverified.</small></article><article><h3>Vegetation evidence</h3><p>${a?'Calculated satellite indicators available.':'No calculated satellite analysis loaded.'}</p><small>${a?'Images: '+escapeHtml(date)+'. Regional averages include unburned land.':'You can add an analysis in Satellite & sources.'}</small></article><article><h3>Animal use today</h3><p>Still needs field checks.</p><small>${b?'Historical comparison loaded. Records are observations, not animal populations.':'Historical observations can help plan surveys; missing records do not mean absence.'}</small></article></div>`;
}
async function loadDemoEvidence(){
  const button=document.getElementById('demo-load'),status=document.getElementById('demo-load-status');
  button.disabled=true;status.textContent='Loading historical observations. This may take a little while…';
  try{
    const connection=await api('/api/status');LIVE.status=connection;LIVE.csrf=connection.csrfToken;
    const next=await api('/api/biodiversity/comparison',{beforeStart:'2021-06-01',beforeEnd:'2021-06-30',afterStart:'2023-06-01',afterEnd:'2023-06-30',bufferKm:5,group:'All'},300000);
    LIVE.comparison=next;renderComparison();await refreshEvidence();refreshDemoEvidence();
    status.textContent='Loaded June 2021 and June 2023 observations, using a 5 km outside buffer. Current animal use remains unknown.';
  }catch(error){status.textContent='Evidence could not be loaded: '+error.message+' You can still explore the options with these gaps visible.';}
  finally{button.disabled=false;}
}
function renderDemoOptions(){
  document.getElementById('screen-demo-options').innerHTML=demoHeading(2,'Which approach is worth investigating?','Compare potential animal effects and human needs. These are possibilities to check, not site-specific predictions.')+`
  <p class="demo-inline-note">No automatic winner. Allowing recovery and intervening can both have consequences.</p>
  <div class="demo-option-grid">${SIMPLE_OPTIONS.map(o=>`<article class="demo-option"><h2>${o.title}</h2><p class="demo-muted">${o.intro}</p><dl><dt>For animals</dt><dd>${o.animal}</dd><dt>For people</dt><dd>${o.human}</dd><dt>Before choosing</dt><dd>${o.check}</dd></dl><button class="btn btn-primary" onclick="considerDemoOption('${o.id}')">Consider this option</button></article>`).join('')}</div>
  <details class="demo-disclosure"><summary>What about different animals?</summary><p>Food, water, shelter, movement and breeding needs can differ. Current occupancy and welfare remain unknown.</p><div class="demo-links">${SCENARIO.focalSpecies.map(g=>`<button class="btn btn-secondary" onclick="openWelfareModal('${g.id}','shelter')">${escapeHtml(g.commonName)}</button>`).join('')}</div></details>
  <details class="demo-disclosure"><summary>Need more help comparing?</summary><p>Optional tools offer more detail. AI requests use your configured account and return drafts for review.</p><div class="demo-links"><button class="btn btn-secondary" onclick="showScreen('ai-assistant')">Ask the AI</button><button class="btn btn-secondary" onclick="showScreen('compare-pathways')">Detailed trade-offs</button><button class="btn btn-secondary" onclick="showScreen('design-for-values')">Our ethical reasoning</button></div></details>
  <div class="demo-next"><button class="btn btn-secondary" onclick="openDemoStep('demo-start')">Back to the case</button><button class="btn btn-primary" onclick="openDemoStep('demo-decision')">I need more evidence</button></div>`;
}
function considerDemoOption(id){
  const option=SCENARIO.recoveryPathways.find(o=>o.id===id);if(!option)return;
  STATE.expertRecord.preferredOption=option.name;invalidateDemoReview();openDemoStep('demo-decision');
}
function invalidateDemoReview(){STATE.expertRecord.approvalConfirmed=false;STATE.expertRecord.signedOff=false;if(STATE.expertRecord.reviewStatus==='reviewed')STATE.expertRecord.reviewStatus='draft';}
function updateDemoField(key,value){STATE.expertRecord[key]=value;invalidateDemoReview();}
function renderDemoDecision(){
  const r=STATE.expertRecord;
  document.getElementById('screen-demo-decision').innerHTML=demoHeading(3,'Explain the decision.','A short draft is enough for the demo. Record the need, the possible harm and your reasons.')+`
  <form id="demo-decision-form" onsubmit="saveDemoDecision(event)" class="demo-decision-form">
  <div class="demo-form-grid"><div><label for="demo-option">Option to investigate</label><select id="demo-option" onchange="updateDemoField('preferredOption',this.value)"><option value="">Not decided yet</option>${SCENARIO.recoveryPathways.map(o=>`<option ${r.preferredOption===o.name?'selected':''} value="${escapeHtml(o.name)}">${escapeHtml(o.name)}</option>`).join('')}</select></div>
  <div><label for="demo-human-category">What kind of human need is involved?</label><select id="demo-human-category" onchange="updateDemoField('humanNeedCategory',this.value)">${Object.entries(HUMAN_NEEDS).map(([k,v])=>`<option value="${k}" ${r.humanNeedCategory===k?'selected':''}>${v}</option>`).join('')}</select></div></div>
  <p class="demo-muted">Safety and basic needs carry strong reasons for action. Livelihoods depend on context. Convenience alone is a weaker reason for avoidable animal harm.</p>
  <label for="demo-human-need">Who needs what, and what happens if we wait?</label><textarea id="demo-human-need" rows="2" maxlength="2000" placeholder="For example: residents need safe road access. An inspection is needed to confirm any hazardous trees." oninput="updateDemoField('humanNeed',this.value)">${escapeHtml(r.humanNeed || '')}</textarea>
  <label for="demo-safeguards">How could we meet the need with less animal harm?</label><textarea id="demo-safeguards" rows="2" maxlength="2000" placeholder="Consider timing, smaller work areas, refuges, field checks and monitoring." oninput="updateDemoField('animalSafeguards',this.value)">${escapeHtml(r.animalSafeguards || '')}</textarea>
  <label for="demo-rationale">Why this option, or why wait?</label><textarea id="demo-rationale" rows="3" maxlength="4000" required placeholder="Explain the trade-off and missing evidence. If animal interests are outweighed, explain why action is necessary and proportionate." oninput="updateDemoField('rationale',this.value)">${escapeHtml(r.rationale || '')}</textarea>
  <label for="demo-status">Decision status</label><select id="demo-status" onchange="updateDemoField('reviewStatus',this.value)"><option value="deferred" ${r.reviewStatus==='deferred'||!r.preferredOption?'selected':''}>Need more evidence</option><option value="draft" ${r.reviewStatus!=='deferred'&&r.preferredOption?'selected':''}>Option to investigate — unreviewed draft</option></select>
  <div class="demo-links"><button class="btn btn-primary" type="submit">Save draft in this browser</button><button class="btn btn-secondary" type="button" onclick="openDemoStep('demo-options')">Compare again</button></div><p id="demo-save-status" role="status" aria-live="polite"></p></form>
  <div class="demo-download"><h2>Take the discussion with you</h2><p>Download the available evidence and your draft. A download does not approve restoration work.</p><label><input type="checkbox" id="demo-include-decision" onchange="document.getElementById('pdf-include-review').checked=this.checked"> Include my decision details in the PDF</label><p class="demo-muted">Includes human-needs notes and any saved reviewer details. Additional private notes are excluded.</p><button class="btn btn-primary" id="demo-download" onclick="downloadDemoReport()">Download PDF</button><p id="demo-pdf-status" role="status" aria-live="polite"></p></div>
  <details class="demo-disclosure"><summary>Qualified review and other exports</summary><p>Before action, qualified review, field verification and applicable permissions are still needed.</p><div class="demo-links"><button type="button" class="btn btn-secondary" onclick="renderExpertReview();showScreen('expert-review')">Record a human review</button><button type="button" class="btn btn-secondary" onclick="viewSummary()">More export options</button></div></details>`;
}
function saveDemoDecision(event){
  event?.preventDefault();const r=STATE.expertRecord,status=document.getElementById('demo-save-status');
  if(!r.rationale.trim()){status.textContent='Add a short reason, including why you need more evidence.';return;}
  const chosen=document.getElementById('demo-status').value;
  if(chosen==='draft'&&!r.preferredOption){status.textContent='Choose an option, or select Need more evidence.';return;}
  r.reviewStatus=chosen;r.approvalConfirmed=false;r.signedOff=false;r.evidenceVersion=LIVE.snapshot?.version || '';r.savedAt=new Date().toISOString();
  try{localStorage.setItem(RECORD_KEY,JSON.stringify({scenarioId:SCENARIO.meta.id,expertRecord:r}));status.textContent='Draft saved in this browser. No expert approval is implied.';}
  catch{r.savedAt=null;status.textContent='Browser storage is unavailable. Your draft remains open; export it before leaving.';}
}
async function downloadDemoReport(){
  const button=document.getElementById('demo-download');button.disabled=true;
  document.getElementById('demo-pdf-status').textContent='Preparing your report…';
  document.getElementById('pdf-include-review').checked=document.getElementById('demo-include-decision').checked;
  document.getElementById('pdf-include-notes').checked=false;
  try{await downloadPDFReport();document.getElementById('demo-pdf-status').textContent=document.getElementById('pdf-status').textContent;}
  finally{button.disabled=false;}
}
document.addEventListener('DOMContentLoaded',()=>{
  for(const id of DEMO_STEPS){const section=document.createElement('section');section.id='screen-'+id;section.className='screen demo-screen';section.setAttribute('aria-label',({'demo-start':'Understand the case','demo-options':'Compare options','demo-decision':'Explain and export'})[id]);document.getElementById('page-content').appendChild(section);}
  selectDemoArea();openDemoStep('demo-start');document.title='Tierra del Fuego — Animal welfare and restoration';
});
