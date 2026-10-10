/* WGS84 longitude/latitude. Hand-drawn teaching shapes, not a real fire. */
const DEMO_GEO = {
  id: 'sierra-morena-fictional-2024',
  source: 'ANWE hand-drawn demonstration geometry',
  date: '2026-10-10',
  eventDate: '2022–2023 (fictional)',
  evidenceKind: 'demonstration',
  limitations: 'Shapes near Sierra Morena, north of Córdoba, are illustrative. No measured area, satellite imagery, real protected designation or species coordinates.',
  boundary: {type: 'Feature', properties: {name: 'Sierra Morena demonstration area'}, geometry: {type: 'Polygon', coordinates: [[[-4.98,38.08],[-4.88,38.22],[-4.68,38.24],[-4.56,38.15],[-4.62,38.03],[-4.81,38.00],[-4.98,38.08]]]}},
  layers: [
    {id: 'severity', label: 'Severity • illustrative', color: '#c75c36', explanation: 'Orange = illustrative higher-severity patch. No NBR or dNBR calculated.', coordinates: [[-4.88,38.12],[-4.82,38.21],[-4.69,38.19],[-4.70,38.10],[-4.88,38.12]]},
    {id: 'vegetation', label: 'Vegetation • illustrative', color: '#25846c', explanation: 'Green = hypothetical retained vegetation. No NDVI or vegetation survey.', coordinates: [[-4.80,38.03],[-4.70,38.04],[-4.63,38.12],[-4.69,38.14],[-4.80,38.03]]},
    {id: 'habitat', label: 'Habitat refuge • illustrative', color: '#467baa', explanation: 'Blue = hypothetical refuge to investigate. Not a protected-area boundary or animal observation.', coordinates: [[-4.94,38.09],[-4.90,38.15],[-4.85,38.13],[-4.87,38.06],[-4.94,38.09]]},
  ],
};
if (typeof module !== 'undefined') module.exports = DEMO_GEO;
