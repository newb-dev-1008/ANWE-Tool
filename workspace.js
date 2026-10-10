/* Map, provenance and local records extend the existing screens. No AI model. */
let areaMap;
let selectedArea = false;
const RECORD_KEY = 'anwe-review-v2';

function initWorkspace() {
  const layers = document.getElementById('layer-controls');
  layers.innerHTML = DEMO_GEO.layers.map(l => `<label><input type="checkbox" value="${l.id}"> ${l.label}</label>`).join('');
  document.getElementById('map-provenance').textContent = `${DEMO_GEO.source} · Created ${DEMO_GEO.date} · Event ${DEMO_GEO.eventDate}. ${DEMO_GEO.limitations}`;
  if (typeof L === 'undefined') {
    document.getElementById('geographic-map').textContent = 'Map library unavailable. Use Select demonstration area below; all assessment and review screens remain available.';
    layers.querySelectorAll('input').forEach(input => input.disabled = true);
    return;
  }
  areaMap = L.map('geographic-map', {minZoom: 4, maxZoom: 16, zoomAnimation: false}).setView([39.5, -3.8], 6);
  const base = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(areaMap);
  base.on('tileerror', () => { document.getElementById('map-status').textContent = 'Reference tiles unavailable. Demonstration shapes and selection still work; try again when online.'; });
  const boundary = L.geoJSON(DEMO_GEO.boundary, {style: {color: '#c75c36', weight: 3, fillOpacity: 0.12}}).addTo(areaMap);
  boundary.bindTooltip('Fictional wildfire area • select to investigate');
  boundary.on('click', selectDemoArea);
  // Marker offers a keyboard-accessible equivalent to clicking the polygon.
  L.marker([38.12, -4.77], {icon: L.divIcon({className: 'demo-map-marker', html: 'D', iconSize: [32,32]}), title: 'Select fictional Sierra Morena area', keyboard: true}).addTo(areaMap).on('click', selectDemoArea);
  const overlays = new Map(DEMO_GEO.layers.map(layer => [layer.id,
    L.polygon(layer.coordinates.map(([lng,lat]) => [lat,lng]), {color: layer.color, fillOpacity: 0.4}).bindTooltip(layer.explanation)]));
  layers.addEventListener('change', event => {
    const layer = overlays.get(event.target.value);
    if (!layer) return;
    if (event.target.checked) layer.addTo(areaMap); else areaMap.removeLayer(layer);
    document.getElementById('map-legend').textContent = DEMO_GEO.layers.filter(l => layers.querySelector(`input[value="${l.id}"]`).checked).map(l => l.explanation).join(' ') || 'Outline = fictional wildfire extent. Enable a layer to see its legend.';
  });
}

function selectDemoArea() {
  selectedArea = true;
  if (areaMap) areaMap.fitBounds(L.geoJSON(DEMO_GEO.boundary).getBounds(), {padding: [35,35], maxZoom: 11, animate: false});
  document.getElementById('selected-area').hidden = false;
  document.getElementById('selection-status').textContent = 'Selected: fictional Sierra Morena area, north of Córdoba. No verified observations or measured environmental indices.';
}

function showSpain() {
  if (areaMap) areaMap.setView([39.5,-3.8],6);
}

function restoreLocalRecord() {
  try {
    const raw = localStorage.getItem(RECORD_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.scenarioId !== SCENARIO.meta.id || !saved.expertRecord) throw new Error('Incompatible record');
    // Only recognised fields and primitive values may enter rendering state.
    for (const key of Object.keys(STATE.expertRecord)) {
      if (typeof saved.expertRecord[key] === 'string') STATE.expertRecord[key] = saved.expertRecord[key];
    }
    document.getElementById('record-notice').textContent = 'Restored a local demonstration record from this browser. Reviewer identity and qualifications are unverified.';
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
  STATE.expertRecord.savedAt = new Date().toISOString();
  STATE.expertRecord.signedOff = false;
  try {
    localStorage.setItem(RECORD_KEY, JSON.stringify({scenarioId: SCENARIO.meta.id, expertRecord: STATE.expertRecord}));
    status.textContent = 'Saved locally in this browser only. This is a demonstration assessment, not official approval.';
  } catch {
    STATE.expertRecord.savedAt = null;
    status.textContent = 'Browser storage unavailable. Your draft remains in memory; export it before leaving.';
  }
}

function restorationSummary() {
  const r = STATE.expertRecord;
  return ['ANWE — restoration review summary', SCENARIO.meta.label,
    'DEMONSTRATION ONLY. No verified occupancy, satellite measurements, AI analysis or official approval.',
    `Area: ${selectedArea ? 'Demonstration area selected' : 'Demonstration scenario; map area not selected this session'}`,
    `Geometry: ${DEMO_GEO.source}; created ${DEMO_GEO.date}; fictional event ${DEMO_GEO.eventDate}`,
    `Reviewer (unverified): ${r.reviewer || 'Not entered'}`, `Review date: ${r.date}`,
    `Preferred strategy: ${r.preferredOption || 'Undecided'}`, `Rationale / reasons for rejecting alternatives: ${r.rationale || 'Not recorded'}`,
    `Challenged assumptions: ${r.challengedItems || 'Not recorded'}`, `Overrides: ${r.overriddenAssessments || 'None recorded'}`,
    `Unresolved risks: ${r.unresolvedRisks || 'Not recorded; this does not mean no risks'}`,
    `Supporting evidence: ${r.supportingEvidence || 'No evidence supplied'}`, `Notes: ${r.additionalNotes || 'None'}`,
    `Local save: ${r.savedAt || 'Unsaved draft'}; no verified identity or authority authorisation`,
    'Required before action: site survey, ecological review, animal welfare assessment and applicable permissions.',
    'Evidence used: ' + SCENARIO.caseOverview.evidenceSources.map(s => `${s.label} (${s.date}; unverified)`).join('; '),
  ].join('\n\n');
}

function viewSummary() {
  document.getElementById('summary-text').textContent = restorationSummary();
  showScreen('restoration-summary');
}

function exportSummary() {
  const url = URL.createObjectURL(new Blob([restorationSummary()], {type: 'text/plain;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url; link.download = 'ANWE-demonstration-summary.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.addEventListener('DOMContentLoaded', initWorkspace);
