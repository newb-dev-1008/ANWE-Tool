/* A regional search window, not a fire perimeter. Official geometry is loaded from the backend. */
const STUDY_AREA = {
  "id": "culebra-june-2022",
  "name": "Sierra de la Culebra · June 2022",
  "region": "Zamora, Castilla y León, Spain",
  "eventStart": "2022-06-15",
  "eventEnd": null,
  "activation": "EMSR580",
  "activationDate": "2022-06-17T10:55:00Z",
  "bbox": [
    -6.5,
    41.75,
    -5.95,
    42.1
  ],
  "center": [
    41.93,
    -6.22
  ],
  "coverageLabel": "Regional search window; not the burned-area boundary",
  "sourceUrl": "https://mapping.emergency.copernicus.eu/activations/EMSR580/",
  "limitations": "Activation documents fires starting 15 June. No extinguishment date inferred. June and July 2022 fires must not be conflated. Search-window records are not necessarily in burned habitat."
};
if (typeof module !== "undefined") module.exports = STUDY_AREA;
