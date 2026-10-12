/* AI supplements every guild/domain; it never changes unverified welfare status. */
const WELFARE_GROUP_TERMS={
  'guild-mammals':['mammal','mammals'], 'guild-birds':['bird','birds'],
  'guild-reptiles':['reptile','reptiles'], 'guild-amphibians':['amphibian','amphibians'],
  'guild-invertebrates':['invertebrate','invertebrates','insect','insects','arthropod','arthropods'],
  'guild-soil':['soil','soil biota','soil organisms']
};
const WELFARE_TOPIC_TERMS={food:['food','nutrition','forage','prey','feeding'],water:['water','hydration','runoff'],
  shelter:['shelter','cover','refuge','refugia'],movement:['movement','connectivity','corridor','fragmentation'],
  breeding:['breeding','juvenile','nest','reproduction']};
let activeWelfareModal=null;
let welfareAIWorking=false;

function welfareAIContext(group,domain) {
  const answer=LIVE.aiTurns.at(-1);
  if(!answer)return null;
  const terms=WELFARE_GROUP_TERMS[group.id] || [group.commonName.toLowerCase()];
  const topics=WELFARE_TOPIC_TERMS[domain] || [domain];
  const mentions=(text,words)=>words.some(word=>new RegExp('\\b'+word+'\\b','i').test(text));
  const texts=[...(answer.hypotheses || []),...(answer.valuesAssessment || []).filter(v=>v.value==='Animal welfare').map(v=>v.assessment)];
  const specific=texts.filter(text=>mentions(text,terms) && mentions(text,topics));
  const allGroupTerms=Object.values(WELFARE_GROUP_TERMS).flat();
  const general=texts.filter(text=>mentions(text,topics) && !mentions(text,allGroupTerms));
  const targeted=mentions(answer.question || '',terms) && mentions(answer.question || '',topics);
  const checks=[...(answer.valuesAssessment || []).filter(v=>v.value==='Animal welfare').flatMap(v=>v.fieldChecks || []),
    ...(answer.pathways || []).flatMap(p=>p.fieldChecks || [])].filter(text=>mentions(text,topics) && (mentions(text,terms) || !mentions(text,allGroupTerms)));
  return {answer,texts:specific.length?specific:targeted?general:general.slice(0,2),
    scope:specific.length?'The latest AI draft discusses this animal group and concern.':targeted?'AI interpretation requested for this group; local conditions remain unverified.':'General habitat reasoning from the latest AI draft; not specific evidence for this animal group.',
    checks:[...new Set(checks)].slice(0,4),stale:!!LIVE.snapshot && answer.evidenceVersion!==LIVE.snapshot.version};
}

function renderWelfareDetails(group,domain,guide) {
  const context=welfareAIContext(group,domain);
  const sourceLinks=context?(context.answer.supportingSources || []).map(s=>sourceLink(s.url,s.source)).filter((v,i,a)=>a.indexOf(v)===i).slice(0,6).join(' · '):'';
  const content=context?.texts.length?context.texts.map(text=>`<p>${escapeHtml(text)}</p>`).join(''):'<p>No relevant AI interpretation is available for this concern yet.</p>';
  return `<p class="badge badge-unknown">Not field-verified</p>
    <h4>Welfare concern</h4><p>${escapeHtml(guide.detail)}</p>
    <h4>AI interpretation</h4>${content}
    ${context?.texts.length?`<p class="provenance">${escapeHtml(context.scope)}${context.stale?' Evidence has changed; request a new assessment before relying on this draft.':''}</p>`:''}
    <button id="welfare-ai-request" class="btn btn-primary" onclick="requestWelfareAI('${group.id}','${domain}')" ${welfareAIWorking || !LIVE.status?.ai.enabled?'disabled':''}>${welfareAIWorking?'Asking AI…':'Ask AI about '+escapeHtml(group.commonName.toLowerCase())+' '+escapeHtml(domainLabel(domain).toLowerCase())}</button>
    <p id="welfare-ai-status" role="status">${!LIVE.status?.ai.enabled?'AI is unavailable until the backend and model credentials are configured.':'This makes a real model request using the available case evidence and shared API limits.'}</p>
    <h4>Still unknown</h4><p>${escapeHtml(guide.knowledgeGap)}. An AI interpretation does not establish animal presence, movement, injury or welfare.</p>
    <h4>Field checks</h4>${context?.checks.length?context.checks.map(text=>`<p>${escapeHtml(text)}</p>`).join(''):'<p>Survey current animal use and the relevant habitat resources before planning work. Ask for a focused assessment to identify additional checks.</p>'}
    ${sourceLinks?`<p class="provenance">Sources used by the overall AI assessment (not proof of this group's local welfare): ${sourceLinks}</p>`:''}`;
}

async function requestWelfareAI(groupId,domain) {
  if(welfareAIWorking)return;
  const group=SCENARIO.focalSpecies.find(g=>g.id===groupId);
  if(!group || !group.welfareContext[domain] || !LIVE.status?.ai.enabled)return;
  if(!selectedArea)selectDemoArea();
  const question=`For ${group.commonName.toLowerCase()}, discuss ${domainLabel(domain).toLowerCase()} during restoration of the Culebra wildfire area. Use the available evidence, distinguish group-specific evidence from general habitat reasoning, identify unknown conditions and relevant field checks, and consider all five ANWE values. Do not infer current occupancy or measured welfare. ${groupId.includes('soil')?'Soil biota are diverse; do not assume all organisms are animals or share sentience.':''}`;
  const before=LIVE.aiTurns.length;welfareAIWorking=true;
  document.getElementById('welfare-ai-request').disabled=true;
  document.getElementById('welfare-ai-status').textContent='Asking the configured model…';
  try {
    document.getElementById('ai-question').value=question;
    await askAssistant({preventDefault(){}});
    if(activeWelfareModal?.groupId===groupId && activeWelfareModal.domain===domain) {
      welfareAIWorking=false;
      document.getElementById('modal-body').innerHTML=renderWelfareDetails(group,domain,group.welfareContext[domain]);
      document.getElementById('welfare-ai-status').textContent=LIVE.aiTurns.length>before?'AI draft added here and in the assistant/report. Field verification is still required.':document.getElementById('ai-status').textContent;
    }
  } finally {welfareAIWorking=false;}
}
