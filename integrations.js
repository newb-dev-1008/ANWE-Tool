/* Live evidence, satellite previews, processing and model drafts extend existing screens. */
const LIVE = {status:null, snapshot:null, catalogue:null, biodiversity:null, comparison:null, analysis:null, aiTurns:[], csrf:null, boundary:null};

async function api(path, body, timeout=180000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(path, {method:body ? 'POST':'GET',
      headers:body ? {'Content-Type':'application/json','X-ANWE-Token':LIVE.csrf || ''} : {},
      body:body ? JSON.stringify(body) : undefined, signal:controller.signal});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Source unavailable');
    return data;
  } catch(error) {
    throw new Error(error.name === 'AbortError' ? 'Request timed out. No substitute data generated.' : error.message);
  } finally { clearTimeout(timer); }
}

function sourceLink(url,label) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return escapeHtml(label);
    return `<a href="${escapeHtml(parsed.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
  } catch { return escapeHtml(label); }
}

async function refreshEvidence() {
  LIVE.snapshot = await api('/api/evidence');
  if(typeof refreshDemoEvidence==='function')refreshDemoEvidence();
  if(LIVE.snapshot.sources?.comparison) {LIVE.comparison=LIVE.snapshot.sources.comparison;renderComparison();}
  document.getElementById('live-evidence-count').textContent = `${LIVE.snapshot.records.length} evidence records · snapshot ${LIVE.snapshot.version}. Record availability is not proof of present animals or site welfare.`;
  const body = LIVE.snapshot.records.map(record => `<tr><td><span class="badge">${escapeHtml(record.kind)}</span></td><td>${sourceLink(record.url,record.source)}<br><small>${escapeHtml(record.datasetId)}</small></td><td>${escapeHtml(record.date)}</td><td>${escapeHtml(record.coverage)}</td><td>${escapeHtml(record.method)}<br>${escapeHtml(record.limitations)}</td></tr>`).join('');
  document.getElementById('live-evidence-table').innerHTML = `<div class="table-wrapper"><table><caption>Evidence provenance; imported reviewer files are excluded from official facts</caption><thead><tr><th>Kind</th><th>Source / ID</th><th>Date</th><th>Coverage</th><th>Method / limitations</th></tr></thead><tbody>${body}</tbody></table></div>`;
  // Display source identifiers next to authored pathway hypotheses without turning them into validated impacts.
  const references = LIVE.snapshot.records.filter(r => r.source !== 'GBIF occurrence index').map(r => r.id);
  SCENARIO.recoveryPathways.forEach(path => {
    path.evidence.sources = references.slice(0,5);
    path.evidence.strength = 'Site impacts unvalidated; retrieved evidence available in Ecological evidence';
  });
}

async function loadLiveData() {
  const status = document.getElementById('connection-status');
  try {
    LIVE.status = await api('/api/status'); LIVE.csrf = LIVE.status.csrfToken;
    status.textContent = 'Local backend connected. Loading public observations and satellite catalogue…';
    document.getElementById('ai-status').textContent = LIVE.status.ai.enabled ? `Configured model: ${LIVE.status.ai.model}. Answers are drafts requiring human review.` : LIVE.status.ai.reason;
    document.getElementById('ask-ai').disabled = !LIVE.status.ai.enabled;
    document.getElementById('processing-status').textContent = LIVE.status.satellite.reason || 'Satellite processing configured. Select dates and explicitly start analysis; it may consume Copernicus processing quota.';
    document.getElementById('process-imagery').disabled = !LIVE.status.satellite.processingEnabled;
    renderPerimeter(LIVE.status.fire.perimeter);
    if (LIVE.status.fire.importedPerimeter) renderImportedPerimeter(LIVE.status.fire.importedPerimeter);
    document.getElementById('fire-source-status').textContent = LIVE.status.fire.effis.reason;
    await refreshEvidence();
    const saved=await api('/api/satellite/analyses');
    if(saved.analyses.length) {LIVE.analysis=saved.analyses[0];renderAnalysisLayers();}
    await Promise.allSettled([
      (async()=>{
        try { LIVE.biodiversity=await api('/api/biodiversity'); renderBiodiversity(); }
        catch(error) { document.getElementById('biodiversity-status').textContent=error.message; }
      })(),
      (async()=>{
        try { LIVE.catalogue=await api('/api/satellite/catalogue'); renderCatalogue(); }
        catch(error) { document.getElementById('catalogue-status').textContent=error.message; }
      })(),
    ]);
    await refreshEvidence();
    status.textContent = 'Public source requests completed. Inspect each source status and acquisition date; unavailable sources remain explicit.';
  } catch(error) {
    status.textContent = 'Backend unavailable. Start python server.py; the static welfare and review tools remain usable. '+error.message;
    document.getElementById('ai-status').textContent = 'AI unavailable: local backend not connected. No simulated response.';
  }
}

function renderBiodiversity() {
  const data = LIVE.biodiversity;
  document.getElementById('biodiversity-status').textContent = `GBIF retrieved ${data.retrievedAt} · ${data.records.length} records displayed. ${data.sampling} ${data.limitations}`;
  document.getElementById('biodiversity-records').innerHTML = data.records.length ? `<div class="table-wrapper"><table><thead><tr><th>Recorded taxon</th><th>Group / date</th><th>Provider / reuse terms</th><th>Quality & uncertainty</th></tr></thead><tbody>${data.records.map(r=>`<tr><td>${sourceLink(r.url,r.scientificName)}<br><small>Historical indexed observation; not current occupancy</small></td><td>${escapeHtml(r.class)}<br>${escapeHtml(r.date)}</td><td>${escapeHtml(r.provider)}<br>${escapeHtml(r.license)}</td><td>${escapeHtml(r.quality.basisOfRecord)}<br>Coordinate uncertainty: ${r.measurements.coordinateUncertaintyInMeters === null ? 'not supplied' : escapeHtml(r.measurements.coordinateUncertaintyInMeters)+' m'}<br>${escapeHtml(r.quality.issues.join(', ') || 'No indexed issues reported; not independently verified')}<br>${escapeHtml(r.location)}</td></tr>`).join('')}</tbody></table></div>` : '<p>No indexed records returned in this bounded sample. This does not prove absence.</p>';
}

function renderCatalogue() {
  const data=LIVE.catalogue;
  document.getElementById('catalogue-status').textContent = `CDSE catalogue retrieved ${data.retrievedAt}. ${data.limitations}`;
  for (const [id, phases] of [['pre-image',['pre']],['post-image',['post','recovery']]]) {
    const images=data.images.filter(i=>phases.includes(i.phase));
    images.sort((a,b)=>(a.cloudCover ?? 100)-(b.cloudCover ?? 100));
    document.getElementById(id).innerHTML = images.map(i=>`<option value="${escapeHtml(i.id)}">${escapeHtml(i.date.slice(0,10))} · ${escapeHtml(i.phase)} · ${escapeHtml(i.id.split('_').find(v=>/^T\d/.test(v)) || 'tile')} · tile clouds ${escapeHtml(i.cloudCover ?? 'unknown')}%</option>`).join('');
  }
  updatePreviews();
}

function selectedImages() {
  return ['pre-image','post-image'].map(id => LIVE.catalogue?.images.find(i=>i.id===document.getElementById(id).value));
}

function updatePreviews() {
  selectedImages().forEach((item,index)=>{
    if (!item) return;
    const phase=index===0?'pre':'post';
    const image=document.getElementById(phase+'-preview');
    image.src='/api/satellite/thumbnail?id='+encodeURIComponent(item.id);
    image.alt=`Actual Sentinel-2 full-tile quicklook acquired ${item.date}. Not a georeferenced quantitative raster.`;
    image.onerror=()=>{ document.getElementById(phase+'-caption').textContent='Quicklook unavailable. Catalogue metadata remains available.'; image.removeAttribute('src'); };
    document.getElementById(phase+'-caption').innerHTML=`${sourceLink(item.url,item.id)}<br>Acquired ${escapeHtml(item.date)} · Whole-tile overview; its footprint only intersects the search area. No values calculated from this preview.`;
  });
}

async function processImagery() {
  const button=document.getElementById('process-imagery');
  const status=document.getElementById('processing-status');
  const [pre,post]=selectedImages();
  if (!pre || !post) {status.textContent='Select available pre and post/recovery dates first.';return;}
  button.disabled=true; status.textContent='Processing surface reflectance on a common grid… This may take several minutes.';
  try {
    LIVE.analysis=await api('/api/satellite/process',{preId:pre.id,postId:post.id},360000);
    renderAnalysisLayers();await refreshEvidence();
    status.textContent=`Processed ${LIVE.analysis.createdAt}. ${LIVE.analysis.grid}. ${LIVE.analysis.limitations}`;
  } catch(error) { status.textContent=error.message; }
  finally { button.disabled=!LIVE.status?.satellite.processingEnabled; }
}

const rasterLayers = new Map();
function renderAnalysisLayers() {
  if (!areaMap || !LIVE.analysis) return;
  rasterLayers.forEach(layer=>areaMap.removeLayer(layer));rasterLayers.clear();
  const a=LIVE.analysis,b=a.bbox;
  for (const [id,url] of Object.entries(a.layers)) rasterLayers.set(id,L.imageOverlay(url,[[b[1],b[0]],[b[3],b[2]]],{opacity:.8}));
  document.getElementById('layer-controls').innerHTML=`<legend>Calculated imagery layers</legend>${[ ['pre-rgb','Pre-fire RGB'],['post-rgb','Post-date RGB'],['pre-ndvi','Pre-fire NDVI'],['post-ndvi','Post-date NDVI'],['dnbr','dNBR'] ].map(([id,label])=>`<label><input type="radio" name="raster-layer" value="${id}"> ${label}</label>`).join('')}<label><input type="radio" name="raster-layer" value="none" checked> Basemap</label>`;
  document.getElementById('layer-controls').onchange=event=>{
    rasterLayers.forEach(layer=>areaMap.removeLayer(layer));
    const layer=rasterLayers.get(event.target.value);if(layer)layer.addTo(areaMap);
    document.getElementById('map-legend').textContent=event.target.value==='dnbr' ? 'dNBR continuous scale: blue −0.5 → rust 1.5. No calibrated severity classes. Transparent pixels = masked/no data.' : event.target.value.includes('ndvi') ? 'NDVI continuous scale: brown −1 → green 1. Transparent pixels = masked/no data.' : 'RGB: fixed reflectance display stretch; not a quantitative damage map.';
  };
  document.getElementById('index-results').textContent=JSON.stringify(a.statistics,null,2)+'\nRegional search-window statistics; not fire-only statistics. No mortality inference.';
}

async function sampleMap(event) {
  if (!LIVE.analysis) return;
  try {
    const data=await api(`/api/satellite/sample?id=${LIVE.analysis.id}&lng=${event.latlng.lng}&lat=${event.latlng.lat}`);
    document.getElementById('pixel-values').textContent=JSON.stringify(data.values,null,2)+'\n'+(data.method || data.status);
  } catch(error) {document.getElementById('pixel-values').textContent=error.message;}
}

async function askAssistant(event) {
  event.preventDefault();
  const input=document.getElementById('ai-question'),question=input.value.trim();
  const button=document.getElementById('ask-ai');
  if (!selectedArea) {document.getElementById('ai-status').textContent='Select the Culebra case on Explore wildfire before asking.';return;}
  if (!question || !LIVE.status?.ai.enabled) return;
  button.disabled=true;document.getElementById('ai-status').textContent='Asking configured model using the current server-owned evidence snapshot…';
  try {
    await refreshEvidence();
    const answer=await api('/api/ai',{question,evidenceVersion:LIVE.snapshot.version},240000);
    LIVE.aiTurns.push(answer);input.value='';renderAIAnswers();
    document.getElementById('ai-status').textContent='Response received. Read the interpretation below; expand sources to inspect the supporting evidence.';
  } catch(error) {document.getElementById('ai-status').textContent=error.message;}
  finally {button.disabled=!LIVE.status?.ai.enabled;}
}

function evidenceLabel(field) {
  const labels={before:'Before the fire',after:'After-start window',burned:'mapped burned area',buffer:'surrounding buffer',uncertain:'uncertain locations',records:'retrieved observations',distinctSpecies:'distinct recorded species',groups:'taxonomic groups',Aves:'birds',Mammalia:'mammals',Amphibia:'amphibians',Reptilia:'reptiles',Insecta:'insects',Arachnida:'arachnids',eventStart:'Fire start',activationDate:'Mapping activation date',acquisitionDate:'Satellite acquisition date',recordedTaxon:'Recorded animal',coordinateUncertaintyInMeters:'Location uncertainty (metres)',mean:'mean',min:'minimum',max:'maximum',validPixels:'valid pixels',totalPixels:'total pixels',preNDVI:'Pre-fire NDVI',postNDVI:'Post-image NDVI',dNBR:'dNBR',tileCloudCover:'Tile-wide cloud cover (%)'};
  return String(field).split('.').map(part=>labels[part] || part.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' ')).join(' — ');
}

function readableEvidence(value,path='') {
  if(value && typeof value==='object' && !Array.isArray(value))return Object.entries(value).map(([key,item])=>readableEvidence(item,path?path+'.'+key:key)).join('');
  const display=value===null || value===undefined?'Not available':Array.isArray(value)?value.join('; '):typeof value==='boolean'?(value?'Yes':'No'):String(value);
  return `<p><strong>${escapeHtml(evidenceLabel(path))}:</strong> ${escapeHtml(display)}</p>`;
}

function renderAIAnswers() {
  const paragraphs=items=>(items || []).map(text=>`<p>${escapeHtml(text)}</p>`).join('');
  document.getElementById('ai-conversation').innerHTML=LIVE.aiTurns.map(turn=>{
    const sources=turn.supportingSources || turn.facts || [];
    const facts=(turn.sourceMeasurements || []).map(m=>{
      const match=m.field.match(/^(before|after)\.(burned|buffer|uncertain)\.(records|distinctSpecies)$/);
      let sentence;
      if(match) {
        const period=match[1]==='before'?'Before the fire':'In the after-start window';
        const zone={burned:'mapped burned area',buffer:'surrounding comparison buffer',uncertain:'records with uncertain locations'}[match[2]];
        sentence=`${period}, the retrieved sample for the ${zone} contains ${m.value} ${match[3]==='records'?'observations':'distinct recorded species'}.`;
      } else if(m.field==='eventStart')sentence=`The documented fire start date is ${m.value}.`;
      else sentence=`The source reports ${evidenceLabel(m.field).toLowerCase()} as ${m.value}.`;
      const source=sources.find(s=>s.id===m.evidenceId);
      return escapeHtml(sentence)+(source?' '+sourceLink(source.url,'Source'):'');
    }).join(' ');
    const links=[...new Map(sources.map(s=>[s.source,s])).values()].map(s=>sourceLink(s.url,s.source)).join(' · ');
    return `<article class="ai-turn plain-answer"><p class="user-question">${escapeHtml(turn.question)}</p>
      <p>${escapeHtml(turn.summary || 'The available evidence supports investigation, with the limitations below.')}</p>
      ${facts?`<p>${facts}</p>`:''}
      ${paragraphs(turn.hypotheses)}${paragraphs(turn.unknowns)}
      ${(turn.pathways || []).map(p=>`<p>For ${escapeHtml(p.name.toLowerCase())}, ${escapeHtml((p.benefits || []).join(' '))} ${escapeHtml((p.harms || []).join(' '))} ${escapeHtml(p.inappropriate)} ${escapeHtml((p.fieldChecks || []).join(' '))}</p>`).join('')}
      ${(turn.valuesAssessment || []).map(v=>`<p>Regarding ${escapeHtml(v.value.toLowerCase())}, ${escapeHtml(v.assessment)} ${escapeHtml((v.fieldChecks || []).join(' '))}</p>`).join('')}
      <p class="provenance">AI draft; human review required.${links?' Sources: '+links:''}</p></article>`;
  }).join('');
  document.getElementById('pathway-ai-note').textContent=`${LIVE.aiTurns.length} AI draft(s) available in AI Ecological Assistant. These supplement the authored comparison; neither is a verified intervention finding.`;
}

async function importPerimeter(event) {
  event.preventDefault();const status=document.getElementById('import-status');
  const file=document.getElementById('perimeter-file').files[0];
  if (!file || file.size>3500000) {status.textContent='Choose a GeoJSON file under 3.5 MB.';return;}
  try {
    const metadata={}; for(const key of ['source','datasetId','date','url','license','limitations','reviewer']) metadata[key]=document.getElementById('import-'+key).value;
    const result=await api('/api/fire/import',{metadata,geojson:JSON.parse(await file.text())});
    renderImportedPerimeter(result);status.textContent=result.verification;LIVE.importedPerimeter=result;
  } catch(error) {status.textContent=error.message;}
}

function liveReport(includePrivate=true) {
  const redact=data=>!data || includePrivate ? data : {...data,metadata:{...data.metadata,reviewer:'Withheld by export privacy settings'}};
  const fire=LIVE.status?.fire ? {...LIVE.status.fire,importedPerimeter:redact(LIVE.status.fire.importedPerimeter)} : null;
  return {case:STUDY_AREA,evidence:LIVE.snapshot,fire,
    importedPerimeter:redact(LIVE.importedPerimeter || LIVE.status?.fire?.importedPerimeter || null),
    designForValues:DFV,biodiversity:LIVE.biodiversity,biodiversityComparison:LIVE.comparison,satelliteCatalogue:LIVE.catalogue,satelliteAnalysis:LIVE.analysis,
    aiDrafts:LIVE.aiTurns,limitations:'No verified current occupancy, field welfare measurements, reviewer qualification or legal authorisation. User-provided perimeters are not official evidence.'};
}
