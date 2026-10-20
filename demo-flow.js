/* A short, optional-detail workflow over the existing evidence and review tools. */
let DEMO_CONTEXT=null,DEMO_AI_BUSY=false,DEMO_AI_MESSAGE='',DEMO_QUESTION='';
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
  document.getElementById('screen-demo-start').innerHTML=`<div class="case-selection"><div><label for="start-fire-case">Select a forest-fire case</label><p>Choose the area you want to explore.</p></div><div><select id="start-fire-case" aria-describedby="start-case-note"><option value="culebra-june-2022" selected>Sierra de la Culebra - June 2022</option></select><small id="start-case-note">One case available in this demo.</small></div></div>`+demoHeading(1,'A better path to recovery.','Sierra de la Culebra, Spain. Explore the evidence, ask AI, then record a human decision.')+`
  <div class="demo-principle case-hero"><div><span class="hero-tag">SIERRA DE LA CULEBRA &middot; JUNE 2022</span><h2>Restore habitat.<br>Keep animals in mind.</h2><p>Animal welfare leads our focus. Human safety and essential needs remain part of every decision.</p><div class="hero-meta"><span>Real case evidence</span><span>Human-led decisions</span></div></div><div class="hero-landscape" aria-hidden="true"><svg viewBox="0 0 320 220" fill="none"><path d="M0 176Q80 70 170 130T320 100V220H0Z" fill="#744634"/><path d="M0 203Q80 130 190 178T320 150V220H0Z" fill="#a65e3b"/><circle cx="247" cy="51" r="26" fill="#f4ad68"/><g stroke="#ffdbb3" stroke-width="3" stroke-linecap="round"><path d="M81 167V92m-22 35 22-35 22 35m-35 15 13-22 13 22M154 178V67m-29 46 29-46 29 46m-48 24 19-30 19 30M222 192v-66m-19 29 19-29 19 29"/></g><path d="M18 212q80-31 140-9t146-5" stroke="#eaa66b" stroke-width="2" stroke-dasharray="4 8"/></svg></div></div>
  <div class="demo-section-head"><h2>Start with the evidence</h2><button class="btn btn-secondary" id="demo-load" onclick="loadDemoEvidence()">Load case evidence</button></div>
  <div id="demo-evidence" aria-live="polite"></div><p id="demo-load-status" class="demo-muted" role="status"></p>
  <details class="demo-disclosure"><summary>Explore the map and source details</summary><p>Satellite change and historical animal records help frame questions. They do not establish which animals live here now.</p><div class="demo-links"><button class="btn btn-secondary" onclick="showScreen('case-overview')">Map</button><button class="btn btn-secondary" onclick="showScreen('ecological-evidence')">Satellite & sources</button><button class="btn btn-secondary" onclick="showScreen('biodiversity-comparison')">Observation dates & counts</button></div></details>
  <div class="demo-next"><p>You can compare options even when evidence is incomplete.</p><button class="btn btn-primary" onclick="openDemoStep('demo-options')">Compare options <span aria-hidden="true">→</span></button></div>`;
  refreshDemoEvidence();
  document.getElementById('demo-evidence').insertAdjacentHTML('afterend',contextPanel());
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
  document.getElementById('screen-demo-options').innerHTML=demoHeading(2,'Explore the possibilities.','Describe your concern. AI offers a starting point; experts decide what happens next.')+`
  ${demoAIPanel()}
  <details id="demo-authored-options" class="demo-disclosure"><summary>Prefer to compare the options yourself?</summary><p class="demo-inline-note">No automatic winner. Allowing recovery and intervening can both have consequences.</p>
  <div class="demo-option-grid">${SIMPLE_OPTIONS.map(o=>`<article class="demo-option"><h2>${o.title}</h2><p class="demo-muted">${o.intro}</p><dl><dt>For animals</dt><dd>${o.animal}</dd><dt>For people</dt><dd>${o.human}</dd><dt>Before choosing</dt><dd>${o.check}</dd></dl><button class="btn btn-primary" onclick="considerDemoOption('${o.id}')">Consider this option</button></article>`).join('')}</div></details>
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
  document.getElementById('screen-demo-decision').innerHTML=demoHeading(3,'Make your reasoning clear.','Choose an approach together, explain your reasons and take the discussion with you.')+`
  <details class="demo-disclosure decision-ai-review"><summary>Review or update the AI suggestion</summary>${demoAIPanel()}</details>
  <form id="demo-decision-form" onsubmit="saveDemoDecision(event)" class="demo-decision-form">
  <div class="demo-form-grid"><div><label for="demo-option">Option to investigate</label><select id="demo-option" onchange="updateDemoField('preferredOption',this.value)"><option value="">Not decided yet</option>${SCENARIO.recoveryPathways.map(o=>`<option ${r.preferredOption===o.name?'selected':''} value="${escapeHtml(o.name)}">${escapeHtml(o.name)}</option>`).join('')}</select></div>
  <div><label for="demo-human-category">What kind of human need is involved?</label><select id="demo-human-category" onchange="updateDemoField('humanNeedCategory',this.value)">${Object.entries(HUMAN_NEEDS).map(([k,v])=>`<option value="${k}" ${r.humanNeedCategory===k?'selected':''}>${v}</option>`).join('')}</select></div></div>
  <p class="demo-muted">Safety and basic needs carry strong reasons for action. Livelihoods depend on context. Convenience alone is a weaker reason for avoidable animal harm.</p>
  <label for="demo-human-need">What do people need?</label><textarea id="demo-human-need" rows="2" maxlength="2000" placeholder="For example: residents need safe road access. An inspection is needed to confirm any hazardous trees." oninput="updateDemoField('humanNeed',this.value)">${escapeHtml(r.humanNeed || '')}</textarea>
  <label for="demo-safeguards">How will you reduce harm to animals?</label><textarea id="demo-safeguards" rows="2" maxlength="2000" placeholder="Consider timing, smaller work areas, refuges, field checks and monitoring." oninput="updateDemoField('animalSafeguards',this.value)">${escapeHtml(r.animalSafeguards || '')}</textarea>
  <label for="demo-rationale">Why this option, or why wait?</label><textarea id="demo-rationale" rows="3" maxlength="4000" required placeholder="Explain the trade-off and missing evidence. If animal interests are outweighed, explain why action is necessary and proportionate." oninput="updateDemoField('rationale',this.value)">${escapeHtml(r.rationale || '')}</textarea>
  <label for="demo-status">Decision status</label><select id="demo-status" onchange="updateDemoField('reviewStatus',this.value)"><option value="deferred" ${r.reviewStatus==='deferred'||!r.preferredOption?'selected':''}>Need more evidence</option><option value="draft" ${r.reviewStatus!=='deferred'&&r.preferredOption?'selected':''}>Option to investigate — unreviewed draft</option></select>
  <div class="demo-links"><button class="btn btn-primary" type="submit">Save draft in this browser</button><button class="btn btn-secondary" type="button" onclick="openDemoStep('demo-options')">Compare again</button></div><p id="demo-save-status" role="status" aria-live="polite"></p></form>
  <div class="demo-download"><h2>Your report, ready to share</h2><p>Download the available evidence and your draft. A download does not approve restoration work.</p><label><input type="checkbox" id="demo-include-decision" onchange="document.getElementById('pdf-include-review').checked=this.checked"> Include my decision details in the PDF</label><p class="demo-muted">Includes human-needs notes and any saved reviewer details. Additional private notes are excluded.</p><button class="btn btn-primary" id="demo-download" onclick="downloadDemoReport()">Download PDF</button><p id="demo-pdf-status" role="status" aria-live="polite"></p></div>
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
function contextPanel(){
  const c=DEMO_CONTEXT,s=c?.settlements,k=c?.conservation;
  return `<section class="demo-context" id="demo-context"><div class="context-heading"><div><span class="demo-small-label">THE WIDER PICTURE</span><h2>People & wildlife nearby</h2></div><span class="context-chip">${c?'Context loaded':'Optional evidence'}</span></div><p>Settlement locations and species conservation status help frame the trade-offs.</p><button class="btn btn-secondary" id="demo-context-load" onclick="loadDemoContext()">Load regional context</button><p id="demo-context-status" role="status"></p><details class="context-details" ${c?'open':''}><summary>View records & limitations</summary>${s?.status==='available'?`<p>${escapeHtml(s.retrievalSource||'Settlement source')}. ${s.mappedSettlementCount} settlement points retrieved. ${s.truncated?'Result limit reached; incomplete sample.':''}</p><ul>${s.settlements.slice(0,5).map(p=>`<li>${escapeHtml(p.name)}: ${p.distanceKm} km from the mapped footprint. ${sourceLink(p.url,'Map record')}</li>`).join('')}</ul><p>Mapped land-use features: ${escapeHtml(Object.entries(s.landUseFeatureCounts).map(([a,n])=>a+': '+n).join(', ')||s.landUseStatus||'None returned; coverage unknown')}.</p>`:`<p>Settlement distances and land-use context ${s?'unavailable: '+escapeHtml(s.reason):'not loaded'}.</p>`}${k?.status==='available'?`<p>Conservation-status lookup: ${k.sampledTaxa} sampled taxa. ${k.records.filter(r=>r.status==='unavailable').length} lookups unavailable.</p><details><summary>Species conservation assessments</summary>${k.records.map(r=>`<p>${escapeHtml(r.taxon)}: ${escapeHtml(conservationLabel(r))}. ${r.url?sourceLink(r.url,'Taxon source'):''}</p>`).join('')}</details>`:`<p>Conservation assessments ${k?'unavailable: '+escapeHtml(k.reason):'not loaded'}.</p>`}<p class="demo-muted">Current mapping, not a reconstruction of the fire. Distances are from representative settlement points to the generalised fire footprint, not to every forest or home. Land use does not measure jobs or income. Population, evacuation routes and actual danger remain unknown. Conservation status concerns species extinction risk, not individual welfare.</p></details></section>`;
}
function conservationLabel(r){
  if(r.status!=='retrieved')return 'Unavailable';
  const a=r.assessment;
  return typeof a==='string'?a:(a?.category || a?.iucnRedListCategory || a?.code || 'No category supplied; unknown');
}
async function loadDemoContext(){
  const b=document.getElementById('demo-context-load'),s=document.getElementById('demo-context-status');b.disabled=true;s.textContent='Retrieving public mapping and conservation assessments…';
  try{DEMO_CONTEXT=await api('/api/context',undefined,300000);await refreshEvidence();document.getElementById('demo-context').outerHTML=contextPanel();}
  catch(e){s.textContent=e.message;b.disabled=false;}
}
function demoAIResult(t){
  const rec=t.recommendation;
  if(!rec)return `<article class="demo-ai-answer"><p>${escapeHtml(t.summary)}</p><p class="demo-muted">Generate a new suggestion to see the primary option and species cards.</p></article>`;
  const names=['Natural regeneration and monitoring','Assisted ecological restoration','Targeted habitat restoration'];
  const titles=['Let nature recover','Make targeted repairs','Restore habitat actively'];
  const index=names.indexOf(rec.pathway),alternatives=(t.pathways||[]).filter(p=>p.name!==rec.pathway);
  return `<article class="demo-ai-answer"><div class="ai-primary"><span class="ai-badge">PRIMARY SUGGESTION</span><h3>${escapeHtml(titles[index]||'Check the site before choosing')}</h3><p>${escapeHtml(rec.reason)}</p><p class="ai-condition"><strong>Reconsider if</strong> ${escapeHtml(rec.changeCondition)}</p>${index>=0?`<button class="btn btn-primary" onclick="considerDemoOption('opt-${['A','B','C'][index]}')">Discuss this option</button>`:''}<small>AI suggests. Human experts discuss and decide.</small></div>
  <div class="demo-section-head"><h3>Other options</h3><span class="demo-muted">When circumstances differ</span></div><div class="ai-alternatives">${alternatives.map(p=>`<details class="ai-alternative"><summary>${escapeHtml(titles[names.indexOf(p.name)]||p.name)}</summary><p><strong>Possible benefit</strong> ${escapeHtml((p.benefits||[]).join(' '))}</p><p><strong>Trade-off</strong> ${escapeHtml((p.harms||[]).join(' '))}</p><p><strong>Check first</strong> ${escapeHtml((p.fieldChecks||[]).join(' '))}</p></details>`).join('')}</div>
  <h3 class="ai-species-title">Which animals could we support?</h3><p class="demo-muted">Recorded species to assess; current needs are unverified.</p><div class="ai-species-grid">${(t.speciesPlans||[]).map(p=>`<article class="ai-species-card"><span class="ai-badge">HABITAT SUPPORT IDEA</span><h4>${escapeHtml(p.speciesName)}</h4><p>${escapeHtml(p.habitatAction)}</p><details><summary>Check before acting</summary><p>${escapeHtml(p.fieldCheck)}</p>${sourceLink(p.url,'Historical observation')}</details></article>`).join('')||'<p>No species-specific suggestion available. Load animal observations and ask again.</p>'}</div>
  <p class="ai-rescue-note">Habitat restoration supports wild animals. Injured individuals need assessment by qualified wildlife rescue professionals.</p>
  <details class="demo-disclosure"><summary>Evidence, uncertainty & sources</summary>${(t.unknowns||[]).map(x=>`<p>${escapeHtml(x)}</p>`).join('')}<div class="ai-source-links">${[...new Map((t.supportingSources||[]).map(s=>[s.url,s])).values()].map(s=>sourceLink(s.url,s.source)).join(' ? ')}</div><p class="demo-muted">${escapeHtml(t.model||'Unknown model')} ? Evidence ${escapeHtml(t.evidenceVersion)}. Ask again after evidence or notes change.</p></details></article>`;
}
function demoAIPanel(){
  const t=LIVE.aiTurns.at(-1);
  return `<section class="demo-ai-panel"><div class="ai-panel-heading"><span class="ai-spark" aria-hidden="true">&#10022;</span><div><p class="demo-small-label">AI RESTORATION ADVISOR</p><h2>Your restoration question</h2></div></div><p class="demo-muted">Tell us what matters. Get one suggestion, alternatives and animal-support ideas.</p><div class="ai-question-box"><label><strong>What should we consider?</strong><textarea class="demo-ai-question" rows="3" maxlength="500" oninput="DEMO_QUESTION=this.value" placeholder="Tell us about animals, human needs or planned work. No technical terms needed.">${escapeHtml(DEMO_QUESTION)}</textarea></label><button type="button" class="ai-example" onclick="useWolfExample()">Try a wolf example</button><p class="demo-muted">Your question is sent to AI and included in reports. Describe the source and uncertainty; omit exact wildlife locations and private information.</p></div><div class="ai-request-controls"><button class="btn btn-primary demo-ai-ask" onclick="askDemoGuide()" ${DEMO_AI_BUSY?'disabled':''}>${DEMO_AI_BUSY?'Reviewing evidence...':t?'Refresh suggestion':'Suggest an approach'}</button><label><input type="checkbox" class="demo-ai-share"> Use my needs & safeguard notes</label></div><details class="ai-privacy"><summary>What is shared?</summary><p>Your question and loaded public evidence go to the configured provider. Ticking the box adds your notes and selected option. Avoid confidential information: AI questions and drafts are included in reports, even if separate decision details are excluded. Provider quotas apply.</p></details><p class="demo-ai-status" role="status">${escapeHtml(DEMO_AI_MESSAGE)}</p>${t?demoAIResult(t):'<div class="ai-empty">Load evidence, then ask AI to compare the restoration options.</div>'}</section>`;
}
function useWolfExample(){
  DEMO_QUESTION='Hypothetical example, not a local finding: wolves may use this woodland and machinery work is proposed nearby. How could we restore habitat while limiting disturbance and addressing any verified human safety needs?';
  const input=document.querySelector('.demo-screen.active .demo-ai-question');if(input){input.value=DEMO_QUESTION;input.focus();}
}
async function askDemoGuide(){
  if(DEMO_AI_BUSY)return;
  const panel=document.querySelector('.demo-screen.active .demo-ai-panel');
  if(!panel)return;
  const share=panel.querySelector('.demo-ai-share').checked,r=STATE.expertRecord;
  DEMO_QUESTION=panel.querySelector('.demo-ai-question').value.trim();
  let question='Guide our restoration decision for Sierra de la Culebra. Choose one primary provisional recommendation and explain the alternatives. Include conditional habitat-support ideas for recorded animal species and checks to establish their needs. Defer if no pathway is defensible. Explain animal welfare, nearby human settlement exposure, livelihoods, conservation status, less harmful alternatives, missing data and what would change the recommendation. Do not infer actual danger from proximity.';
  if(DEMO_QUESTION)question+=' User question or scenario (unverified; not source evidence): '+DEMO_QUESTION;
  if(share)question+=' Unverified user context: '+JSON.stringify({option:r.preferredOption,needCategory:r.humanNeedCategory,need:(r.humanNeed||'').slice(0,200),safeguards:(r.animalSafeguards||'').slice(0,200)});
  DEMO_AI_BUSY=true;DEMO_AI_MESSAGE='Analysing the loaded evidence…';panel.outerHTML=demoAIPanel();
  try{
    LIVE.status=await api('/api/status');LIVE.csrf=LIVE.status.csrfToken;
    if(!LIVE.status.ai.enabled)throw new Error(LIVE.status.ai.reason||'AI is not configured.');
    await refreshEvidence();const answer=await api('/api/ai',{question,evidenceVersion:LIVE.snapshot.version},240000);
    LIVE.aiTurns.push(answer);renderAIAnswers();const manual=document.getElementById('demo-authored-options');if(manual)manual.open=false;DEMO_AI_MESSAGE='AI guidance received. Discuss it with human experts before recording your own choice.';
  }catch(e){DEMO_AI_MESSAGE=e.message;}
  finally{DEMO_AI_BUSY=false;for(const p of document.querySelectorAll('.demo-ai-panel'))p.outerHTML=demoAIPanel();}
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('main').appendChild(document.getElementById('global-banner'));
  for(const id of DEMO_STEPS){const section=document.createElement('section');section.id='screen-'+id;section.className='screen demo-screen';section.setAttribute('aria-label',({'demo-start':'Understand the case','demo-options':'Compare options','demo-decision':'Explain and export'})[id]);document.getElementById('page-content').appendChild(section);}
  selectDemoArea();openDemoStep('demo-start');document.title='Tierra del Fuego — Animal welfare and restoration';
});
