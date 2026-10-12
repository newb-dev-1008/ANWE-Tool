/* Existing local review tools retained; map now uses the documented Culebra case. */
let areaMap;
let selectedArea = false;
const RECORD_KEY = 'anwe-culebra-review-v3';
let perimeterLayer;
let importedLayer;

function initWorkspace() {
  document.getElementById('map-provenance').textContent = 'Study region: Zamora, Castilla y León. Search window is not a wildfire boundary. Official-source extent loads from the local backend.';
  if (typeof L === 'undefined') {
    document.getElementById('geographic-map').textContent = 'Map library unavailable. Use Select Culebra case; evidence and review remain accessible.';
  } else {
    areaMap = L.map('geographic-map', {minZoom:4,maxZoom:17,zoomAnimation:false}).setView(STUDY_AREA.center,10);
    const base=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(areaMap);
    base.on('tileerror',()=>document.getElementById('map-status').textContent='Reference tiles unavailable. Retrieved official-source vector extent and case selection remain available.');
    L.marker(STUDY_AREA.center,{icon:L.divIcon({className:'demo-map-marker',html:'C',iconSize:[32,32]}),title:'Select Sierra de la Culebra June 2022 case',keyboard:true}).addTo(areaMap).on('click',selectDemoArea);
    areaMap.on('click',sampleMap);
  }
  loadLiveData();
}

function renderPerimeter(data) {
  if (!data) {document.getElementById('map-provenance').textContent='Official wildfire perimeter unavailable; no invented outline is shown. You may import a source-backed GeoJSON for local review.';return;}
  LIVE.boundary=data;
  if (areaMap) {
    if (perimeterLayer) areaMap.removeLayer(perimeterLayer);
    perimeterLayer=L.geoJSON(data.geojson,{style:{color:'#e69264',weight:2,fillOpacity:.12}}).addTo(areaMap);
    perimeterLayer.bindTooltip('CEMS mapped burnt extent · observed 25 June 2022 · generalised display');
    perimeterLayer.on('click',selectDemoArea);
    areaMap.attributionControl.addAttribution('Copernicus EMS © European Union · EMSR580');
  }
  const m=data.metadata;
  document.getElementById('map-provenance').textContent=`${m.source} · ${m.datasetId} · Acquired ${m.date} · Published ${m.published}. ${m.method} ${m.limitations}`;
}

function renderImportedPerimeter(data) {
  if (areaMap) {
    if (importedLayer) areaMap.removeLayer(importedLayer);
    importedLayer=L.geoJSON(data.geojson,{style:{color:'#e1c45b',dashArray:'5 5',weight:2,fillOpacity:0}}).addTo(areaMap);
    importedLayer.bindTooltip('Reviewer-supplied geometry; provenance not independently authenticated');
  }
}

function selectDemoArea() {
  selectedArea=true;
  if (areaMap) {
    if (perimeterLayer) areaMap.fitBounds(perimeterLayer.getBounds(),{padding:[25,25],maxZoom:12,animate:false});
    else areaMap.setView(STUDY_AREA.center,10);
  }
  document.getElementById('selected-area').hidden=false;
  document.getElementById('selection-status').textContent='Selected: Sierra de la Culebra, June 2022. Extent, imagery metadata, GBIF observations and welfare hypotheses have separate provenance.';
  document.getElementById('ai-selection-notice').textContent='Culebra case selected. Ask about available evidence; missing measurements remain unknown.';
}

function showSpain() { if(areaMap) areaMap.setView([40,-3.8],6); }

function restoreLocalRecord() {
  try {
    const raw = localStorage.getItem(RECORD_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.scenarioId !== SCENARIO.meta.id || !saved.expertRecord) throw new Error('Incompatible record');
    // Only recognised fields and primitive values may enter rendering state.
    for (const key of Object.keys(STATE.expertRecord)) {
      if (typeof saved.expertRecord[key] === 'string' || (key==='approvalConfirmed' && typeof saved.expertRecord[key]==='boolean')) STATE.expertRecord[key] = saved.expertRecord[key];
    }
    document.getElementById('record-notice').textContent = 'Restored a local prototype review from this browser. Reviewer identity and qualifications are unverified.';
  } catch {
    document.getElementById('record-notice').textContent = 'Local record unavailable or invalid. You can create a new review and export it.';
  }
}

function persistLocalRecord() {
  const status = document.getElementById('save-status');
  if (!STATE.expertRecord.reviewer.trim() || !STATE.expertRecord.rationale.trim() || !STATE.expertRecord.date) {
    status.textContent = 'Enter reviewer, review date and rationale before saving. A decision may remain undecided.';
    return;
  }
  STATE.expertRecord.evidenceVersion = LIVE.snapshot?.version || "Not available";
  if(STATE.expertRecord.reviewStatus==='reviewed' && (!STATE.expertRecord.preferredOption.trim() || STATE.expertRecord.preferredOption==='(not yet decided)' || !STATE.expertRecord.approvalConfirmed)) {
    status.textContent='A reviewed decision requires a preferred option and explicit human review confirmation. You may save a draft or defer.';return;
  }
  STATE.expertRecord.savedAt = new Date().toISOString();
  STATE.expertRecord.signedOff = false;
  try {
    localStorage.setItem(RECORD_KEY, JSON.stringify({scenarioId: SCENARIO.meta.id, expertRecord: STATE.expertRecord}));
    status.textContent = 'Saved locally in this browser only. This is a prototype assessment, not official approval.';
  } catch {
    STATE.expertRecord.savedAt = null;
    status.textContent = 'Browser storage unavailable. Your draft remains in memory; export it before leaving.';
  }
}

function restorationSummary(includePrivate=true,includeNotes=true) {
  const r=includePrivate ? {...STATE.expertRecord} : {...STATE.expertRecord,...Object.fromEntries(['reviewer','date','preferredOption','rationale','challengedItems','overriddenAssessments','unresolvedRisks','supportingEvidence','additionalNotes'].map(k=>[k,'Withheld by export privacy settings']))};
  if(!includeNotes)r.additionalNotes='Withheld by export privacy settings';
  const report=liveReport(includePrivate);
  const sources=(LIVE.snapshot?.records || []).map(s=>`${s.kind}: ${s.id} · ${s.source} · ${s.date} · ${s.url} · ${s.limitations}`).join('\n');
  const drafts=LIVE.aiTurns.map(turn=>`${turn.question}\nModel ${turn.model}; ${turn.createdAt}; evidence ${turn.evidenceVersion}\n${JSON.stringify(turn,null,2)}`).join('\n\n');
  return ['ANWE 4.0 — Design for Values restoration review summary',SCENARIO.meta.label,
    'Human decision support. No verified current occupancy, field welfare finding, reviewer qualification or official approval.',
    `Case selected this session: ${selectedArea ? 'Yes':'No'}`,
    `Fire geometry: ${LIVE.boundary ? LIVE.boundary.verification : 'Unavailable; no invented perimeter'}`,
    `Satellite analysis: ${LIVE.analysis ? LIVE.analysis.method+' '+LIVE.analysis.limitations:'No calculated indices available in this session'}`,
    `Reviewer (unverified): ${r.reviewer || 'Not entered'} · Date: ${r.date}`,
    `Preferred strategy: ${r.preferredOption || 'Undecided'}`,
    `Rationale / rejection of alternatives: ${r.rationale || 'Not recorded'}`,
    `Challenged assumptions: ${r.challengedItems || 'None recorded'}`,
    `Overrides: ${r.overriddenAssessments || 'None recorded'}`,
    `Unresolved risks: ${r.unresolvedRisks || 'Not recorded; does not imply no risks'}`,
    `Supporting evidence: ${r.supportingEvidence || 'Not supplied'}`,
    `Accountability: ${reviewState().label}. No action authorised; external approval remains necessary.`,
    'Design for Values: '+DFV.values.map(v=>v.value+' — '+v.norm+' — '+v.requirement).join('\n'),
    'GBIF comparison: '+(LIVE.comparison ? JSON.stringify({windows:LIVE.comparison.parameters,before:LIVE.comparison.before,after:LIVE.comparison.after,limitations:LIVE.comparison.limitations}) : 'Not retrieved'),
    `Additional notes: ${r.additionalNotes || 'None'}`,
    `Last local save: ${r.savedAt || 'Unsaved draft'}. Reviewed evidence version: ${r.evidenceVersion || 'Not captured'}; current: ${LIVE.snapshot?.version || 'Unavailable'}`,
    'Restoration alternatives (authored hypotheses): '+JSON.stringify(SCENARIO.recoveryPathways,null,2),
    'Source records and limitations:\n'+(sources || 'Backend evidence not loaded'),
    'AI-generated drafts (separate from expert conclusions):\n'+(drafts || 'None. No simulated AI answer.'),
    'Reviewer-supplied import: '+JSON.stringify(report.importedPerimeter),
    'Required before action: site verification, ecological and individual animal welfare review, consultation and applicable permissions.'].join('\n\n');
}

function viewSummary() {
  document.getElementById('summary-text').textContent = restorationSummary();
  showScreen('restoration-summary');
}

function exportSummary() {
  const consent=exportConsent();
  const url = URL.createObjectURL(new Blob([restorationSummary(consent.review,consent.notes)], {type: 'text/plain;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url; link.download = 'ANWE-Culebra-review-summary.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.addEventListener('DOMContentLoaded', initWorkspace);
