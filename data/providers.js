/* ANWE's internal contract, not a claimed upstream API format. */
const DATA_PROVIDERS = (() => {
  const catalog = [
    ['copernicus', 'Copernicus Data Space', 'https://dataspace.copernicus.eu/', 'Sentinel-2 imagery; quality-controlled vegetation and burn indices'],
    ['effis', 'EFFIS', 'https://forest-fire.emergency.copernicus.eu/', 'Burned-area context and fire events'],
    ['miteco', 'MITECO Banco de Datos de la Naturaleza', 'https://www.miteco.gob.es/', 'Habitats and protected-area boundaries'],
    ['eidos', 'MITECO EIDOS', 'https://www.miteco.gob.es/', 'Species reference information'],
    ['gbif', 'GBIF Spain', 'https://datos.gbif.es/', 'Dated biodiversity records, not current occupancy'],
    ['aemet', 'AEMET OpenData', 'https://opendata.aemet.es/', 'Weather and climate context'],
    ['ign', 'IGN / CNIG', 'https://centrodedescargas.cnig.es/', 'Terrain and geographic reference data'],
    ['esdac', 'European Soil Data Centre', 'https://esdac.jrc.ec.europa.eu/', 'Soil and erosion context'],
  ].map(([id, name, url, intendedUse]) => ({id, name, url, intendedUse, status: 'planned'}));
  const adapters = new Map();
  return {
    catalog,
    register(id, adapter) {
      if (!catalog.some(p => p.id === id) || typeof adapter !== 'function') throw new Error('Invalid provider adapter');
      adapters.set(id, adapter);
    },
    async load(id, area, signal) {
      if (!adapters.has(id)) return {status: 'unavailable', data: null, reason: 'Integration planned; no service connected.'};
      try {
        const result = await adapters.get(id)({area, signal});
        if (!result || !['demonstration', 'observation', 'derived'].includes(result.evidenceKind) || !result.source || !result.date || !result.limitations) {
          throw new Error('Provider result requires evidence kind, source, date and limitations');
        }
        return {status: 'available', data: result};
      } catch (error) {
        return {status: 'unavailable', data: null, reason: error.name === 'AbortError' ? 'Request cancelled.' : 'Source unavailable or provenance incomplete.'};
      }
    },
  };
})();
if (typeof module !== 'undefined') module.exports = DATA_PROVIDERS;
