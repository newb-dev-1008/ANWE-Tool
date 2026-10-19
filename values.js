/* Design for Values: transparent requirements, never an aggregate ethical score. */
let valuesControlsReady=false;
// Build the matrix on startup as well as navigation, so an older navigation
// script cannot leave this screen blank after an application update.
document.addEventListener('DOMContentLoaded',()=>{
  try {renderValuesMatrix();}
  catch {document.getElementById('values-matrix').textContent='Values data did not load. Reload the app with Ctrl+F5; if it persists, restart python server.py.';}
});
function exportConsent() {
  const review=document.getElementById('pdf-include-review')?.checked===true;
  return {review,notes:review && document.getElementById('pdf-include-notes')?.checked===true};
}
function exportReview() {
  const consent=exportConsent();
  if(!consent.review)return {reviewStatus:reviewState().label,privateDetails:'Withheld by export privacy settings',signedOff:false,savedAt:STATE.expertRecord.savedAt};
  return {...STATE.expertRecord,additionalNotes:consent.notes?STATE.expertRecord.additionalNotes:'Withheld by export privacy settings'};
}
function reviewState() {
  const r=STATE.expertRecord;
  const complete=['reviewer','date','rationale','preferredOption'].every(k=>String(r[k] || '').trim()) && r.preferredOption!=='(not yet decided)';
  const reviewed=r.reviewStatus==='reviewed' && complete && r.approvalConfirmed===true;
  const stale=!!r.evidenceVersion && !!LIVE.snapshot && r.evidenceVersion!==LIVE.snapshot.version;
  return {reviewed,stale,label:stale?'Evidence changed; re-review required':reviewed?'Locally reviewed; identity unverified':r.reviewStatus==='deferred'?'Decision deferred':'Unreviewed draft',actionAuthorised:false};
}

document.addEventListener('input',event=>{
  if(event.target.id==='approval-confirmation' || !event.target.closest?.('#expert-review-form'))return;
  STATE.expertRecord.approvalConfirmed=false;
  const confirmation=document.getElementById('approval-confirmation');if(confirmation)confirmation.checked=false;
});

function renderReviewControls() {
  const r=STATE.expertRecord;
  return `<div class="card"><h3>Accountability · human decision status</h3><label for="human-review-status">Review status</label><select id="human-review-status" onchange="STATE.expertRecord.reviewStatus=this.value;STATE.expertRecord.approvalConfirmed=false;renderExpertReview()">${[['draft','Unreviewed draft'],['deferred','Decision deferred'],['reviewed','Human review recorded']].map(([id,label])=>`<option value="${id}" ${r.reviewStatus===id?'selected':''}>${label}</option>`).join('')}</select><label><input id="approval-confirmation" type="checkbox" ${r.approvalConfirmed?'checked':''} onchange="STATE.expertRecord.approvalConfirmed=this.checked"> I have reviewed the evidence and recorded a reasoned decision. This local confirmation does not verify my qualifications or grant permission to act.</label><p>Saving a reviewed decision requires reviewer, date, preferred option, justification and this confirmation. External permissions and qualified expert review remain required.</p></div>`;
}

function renderPathwayValues(option) {
  const assessment=option.designForValues || {};
  const tradeoff=DFV.tradeoffProfiles?.[option.id];
  const conflict=tradeoff?`<section><h4>Human–animal trade-off</h4><p>${escapeHtml(DFV.ethicalPosition.evidenceStatus)}</p><dl>${Object.entries(tradeoff).map(([key,text])=>`<dt>${escapeHtml(({humanObjective:'Human objective',animalInterests:'Animal interests',conflict:'Potential conflict',alternatives:'Less harmful alternatives',missingEvidence:'Missing evidence',safeguards:'Safeguards and monitoring'})[key])}</dt><dd>${escapeHtml(text)}</dd>`).join('')}</dl><p><strong>Decision principle:</strong> ${escapeHtml(DFV.ethicalPosition.decisionRule)}</p><p>${escapeHtml(DFV.ethicalPosition.limits)}</p><p><strong>Human justification:</strong> ${escapeHtml(STATE.expertRecord.rationale || 'Not recorded. Complete the decision rationale in Expert Review, or defer the decision.')}</p></section>`:'';
  return `<details class="dfv-pathway"><summary>Design for Values assessment · ${escapeHtml(option.shortLabel || option.name)}</summary><p>Conditional investigation guide. Ecological impacts remain unvalidated.</p>${conflict}${DFV.values.map(value=>{
    const fields={...(assessment[value.value] || {})};
    if(value.id==='accountability') {fields['Expert review status']=reviewState().label;fields['Reviewer justification']=STATE.expertRecord.rationale || 'Not recorded';fields['Pending decisions']=STATE.expertRecord.preferredOption || 'No option selected';}
    if(value.id==='transparency')fields['Supporting data']=(option.evidence?.sources || []).join(', ') || 'None linked';
    return `<section><h4>${escapeHtml(value.value)}</h4><dl>${value.dimensions.map(d=>`<dt>${escapeHtml(d)}</dt><dd>${escapeHtml(fields[d] || 'Unknown; field verification needed')}</dd>`).join('')}</dl></section>`;
  }).join('')}</details>`;
}

function renderValuesMatrix() {
  const valueFilter=document.getElementById('value-filter'), stakeholderFilter=document.getElementById('stakeholder-filter');
  if(!valuesControlsReady) {
    valueFilter.innerHTML='<option value="All">All five values</option>'+DFV.values.map(v=>`<option value="${v.id}">${escapeHtml(v.value)}</option>`).join('');
    stakeholderFilter.innerHTML='<option value="All">All stakeholders</option>'+DFV.stakeholders.map(s=>`<option value="${escapeHtml(s.group)}">${escapeHtml(s.tier+' · '+s.group)}</option>`).join('');valuesControlsReady=true;
  }
  const selected=valueFilter.value || 'All';
  document.getElementById('values-matrix').innerHTML=`<div class="table-wrapper"><table><caption>Values-to-Design Matrix · field evaluation remains pending</caption><thead><tr><th>Ethical value</th><th>Stakeholder concern</th><th>Ethical norm</th><th>System requirement</th><th>Application feature</th><th>Verification / evaluation</th></tr></thead><tbody>${DFV.values.filter(v=>selected==='All'||v.id===selected).map(v=>`<tr><td><strong>${escapeHtml(v.value)}</strong><details><summary>Meaning and purpose</summary><p>${escapeHtml(v.meaning)}</p><p>${escapeHtml(v.why)}</p></details></td><td>${escapeHtml(v.concern)}</td><td>${escapeHtml(v.norm)}</td><td>${escapeHtml(v.requirement)}</td><td>${escapeHtml(v.feature)}</td><td>${escapeHtml(v.evaluation)}<p class="badge badge-unknown">Feature present · outcome verification pending</p></td></tr>`).join('')}</tbody></table></div>`;
  document.getElementById('values-stakeholders').innerHTML='<h2>Stakeholders and different priorities</h2>'+DFV.stakeholders.filter(s=>!stakeholderFilter.value||stakeholderFilter.value==='All'||s.group===stakeholderFilter.value).map(s=>`<article class="card"><h3>${escapeHtml(s.group)} <small>${escapeHtml(s.tier)}</small></h3><p>${escapeHtml(s.needs)}</p></article>`).join('');
  const ethic=DFV.ethicalPosition;
  document.getElementById('values-tensions').innerHTML=(ethic?`<section class="card"><h2>${escapeHtml(ethic.title)}</h2>${['foundation','justification','decisionRule','limits','uncertainty','reviewPrompt','evidenceStatus'].map(key=>`<p>${escapeHtml(ethic[key])}</p>`).join('')}<p>Ethical background: ${ethic.references.map(r=>`<a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title)}</a>`).join('; ')}</p></section>`:'')+'<h2>Value tensions to discuss</h2><ul>'+DFV.tensions.map(t=>`<li>${escapeHtml(t)}</li>`).join('')+'</ul><button class="btn btn-primary" onclick="showScreen(\'compare-pathways\')">Evaluate restoration options</button>';
}

async function runBiodiversityComparison(event) {
  if(event)event.preventDefault();
  const status=document.getElementById('comparison-status'),button=document.getElementById('run-comparison');
  const parameters={beforeStart:document.getElementById('before-start').value,beforeEnd:document.getElementById('before-end').value,
    afterStart:document.getElementById('after-start').value,afterEnd:document.getElementById('after-end').value,
    bufferKm:Number(document.getElementById('comparison-buffer').value),group:document.getElementById('comparison-group').value};
  button.disabled=true;status.textContent='Retrieving dated records and checking the same perimeter/buffer for both periods…';
  try {
    const next=await api('/api/biodiversity/comparison',parameters,300000);
    LIVE.comparison=next;renderComparison();await refreshEvidence();
  } catch(error) {status.textContent='Comparison failed: '+error.message+(LIVE.comparison?' Previously loaded results remain below with their original windows.':'');}
  finally {button.disabled=false;}
}

function renderComparison() {
  const data=LIVE.comparison,p=data.parameters;
  const incomplete=data.before.truncated || data.after.truncated;
  document.getElementById('comparison-status').textContent=`Loaded ${data.retrievedAt}. Before ${p.beforeStart}–${p.beforeEnd}; after-start ${p.afterStart}–${p.afterEnd}; buffer ${p.bufferKm} km; group ${p.group}. ${incomplete?'INCOMPLETE retrieval: capped subsets. ':'Complete API pagination for these bounded queries; still not a census. '}${data.warning}`;
  const zones=[['burned','Inside the mapped fire footprint'],['buffer','Nearby comparison area (buffer)'],['uncertain','Records with uncertain location']];
  const zoneHelp=`<div class="card"><h2>What do these categories represent?</h2><p><strong>Inside the mapped fire footprint:</strong> records assigned inside the land mapped as burned on 25 June 2022. The same outline is used for both time windows. A before-fire record here means an observation in a place later mapped as burned—not an animal known to have been caught in the fire.</p><p><strong>Nearby comparison area (buffer):</strong> records outside that outline but within ${p.bufferKm} km of it. The distance is measured outward from the boundary, not from the centre. This nearby land is not necessarily unaffected by fire, and it is not a validated experimental control.</p><p><strong>Records with uncertain location:</strong> reported positions fall within the selected study footprint, but precision is unknown or the uncertainty may cross a boundary. These records cannot be confidently assigned to the inside or nearby category. This is a data-quality category, not a third physical area or a damage class.</p><p><strong>Counts:</strong> eligible retrieved observation records, not unique animals or population sizes. Species counts refer only to species identified in those records. Before and after describe observation dates, not when records were uploaded.</p></div>`;
  const max=Math.max(1,...zones.flatMap(([z])=>[data.before.zones[z].records,data.after.zones[z].records]));
  const chart=zones.map(([zone,label])=>`<div class="comparison-chart-row"><h4>${escapeHtml(label)}</h4>${['before','after'].map(phase=>`<div class="bar-line"><span>${phase==='after'?'After-start':'Before'}</span><div class="bar-track"><div class="bar ${phase}" style="width:${data[phase].zones[zone].records/max*100}%"></div></div><strong>${data[phase].zones[zone].records}</strong></div>`).join('')}</div>`).join('');
  const table=zones.map(([zone,label])=>{const a=data.before.zones[zone],b=data.after.zones[zone],c=data.comparison[zone];return `<tr><th>${escapeHtml(label)}</th><td>${a.records}</td><td>${b.records}</td><td>${a.distinctSpecies}</td><td>${b.distinctSpecies}</td><td>${c.both.length}</td><td>${c.onlyBefore.length}</td><td>${c.onlyAfter.length}</td></tr>`;}).join('');
  const speciesLists=zones.map(([zone,label])=>`<details><summary>Species lists · ${escapeHtml(label)}</summary>${[['both','Recorded in both'],['onlyBefore','Recorded only before'],['onlyAfter','Recorded only after']].map(([key,label])=>`<h4>${label}</h4><p>${escapeHtml(data.comparison[zone][key].map(s=>s.name).join('; ') || 'No resolved species in retrieved subset; not proof of absence')}</p>`).join('')}</details>`).join('');
  const groups=[...new Set(zones.flatMap(([z])=>Object.keys(data.before.zones[z].groups).concat(Object.keys(data.after.zones[z].groups))))].sort();
  const taxonRows=groups.flatMap(group=>zones.map(([zone,label])=>`<tr><td>${escapeHtml(group)}</td><td>${escapeHtml(label)}</td><td>${data.before.zones[zone].groups[group] || 0}</td><td>${data.after.zones[zone].groups[group] || 0}</td></tr>`)).join('');
  const quality=['missingDates','impreciseDates','outsideWindow','spatiallyUncertain','geospatialIssues','unlocated','outsideArea','excludedAbsentOrNonanimal','duplicateIds'];
  const qualityRows=quality.map(k=>`<tr><td>${escapeHtml(k.replace(/([A-Z])/g,' $1'))}</td><td>${data.before.quality[k]}</td><td>${data.after.quality[k]}</td></tr>`).join('');
  document.getElementById('comparison-results').innerHTML=zoneHelp+`<div class="callout callout-warning">${escapeHtml(data.limitations)}</div><div class="card"><h2>Indexed records by location</h2><p>Counts of eligible retrieved records. No percentage or population-change interpretation.</p>${chart}</div><div class="table-wrapper"><table><caption>Retrieved observation comparison</caption><thead><tr><th>Location category</th><th>Before records</th><th>After records</th><th>Before species</th><th>After species</th><th>Both</th><th>Only before</th><th>Only after</th></tr></thead><tbody>${table}</tbody></table></div><div class="card">${speciesLists}</div><div class="card"><h2>Taxonomic groups</h2><div class="table-wrapper"><table><thead><tr><th>Group</th><th>Location category</th><th>Before</th><th>After</th></tr></thead><tbody>${taxonRows}</tbody></table></div></div><div class="card"><h2>Date and spatial quality</h2><p>${escapeHtml(data.geography.method)} ${escapeHtml(data.geography.geometryAccuracy)}</p><p>Independent all-date audit: ${data.dateAudit.retrieved} retrieved records, ${data.dateAudit.missingDates} missing dates, ${data.dateAudit.impreciseDates} insufficiently precise dates. ${escapeHtml(data.dateAudit.scope)}</p><div class="table-wrapper"><table><thead><tr><th>Quality indicator</th><th>Before query</th><th>After query</th></tr></thead><tbody>${qualityRows}</tbody></table></div><p>API bounding-box totals: ${data.before.apiBoundingBoxCount} before and ${data.after.apiBoundingBoxCount} after; these are not perimeter totals. Retrieved ${data.before.retrieved} / ${data.after.retrieved} for classification.</p></div>`;
}

async function downloadPDFReport() {
  const button=document.getElementById('download-pdf'),status=document.getElementById('pdf-status');
  const include=document.getElementById('pdf-include-review').checked;
  const notes=document.getElementById('pdf-include-notes').checked && include;
  button.disabled=true;status.textContent='Preparing a readable assessment from the current server evidence…';
  try {
    // A server restart rotates the token while an open browser tab retains the old one.
    const connection=await api('/api/status');
    LIVE.csrf=connection.csrfToken;
    LIVE.status=connection;
    await refreshEvidence();
    const response=await fetch('/api/report/pdf',{method:'POST',headers:{'Content-Type':'application/json','X-ANWE-Token':LIVE.csrf || ''},
      body:JSON.stringify({evidenceVersion:LIVE.snapshot.version,responseIds:LIVE.aiTurns.map(a=>a.responseId),includeReview:include,includeNotes:notes,
        review:include?STATE.expertRecord:null,publicReviewStatus:reviewState().label})});
    if(!response.ok) {const data=await response.json();throw new Error(data.error || 'Report unavailable');}
    const url=URL.createObjectURL(await response.blob()),link=document.createElement('a');link.href=url;link.download='ANWE-Culebra-DfV-Assessment.pdf';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    status.textContent='PDF downloaded. Human review remains separate from AI; no action is authorised.';
  } catch(error) {status.textContent=error.message;}
  finally {button.disabled=false;}
}
