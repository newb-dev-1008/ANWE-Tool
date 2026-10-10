# Data sources and integration status

The only connected external layer is the OpenStreetMap reference basemap. All ecological layers are hand-drawn demonstrations created 2026-10-10 for a fictional 2022–2023 case. Reference tiles have no capture date supplied and no ecological measurement role. No satellite-derived data, protected boundaries or species observations have been downloaded.

| Provider | Intended use | Status | Access and limitations to resolve |
|---|---|---|---|
| [Copernicus Data Space](https://dataspace.copernicus.eu/) | Sentinel-2 imagery and established NDVI/NBR/dNBR calculations | Planned | Verify product access/authentication, cloud masking, acquisition dates and compatible pre/post imagery; never equate vegetation indices with animal welfare |
| [EFFIS](https://forest-fire.emergency.copernicus.eu/) | Fire events and burned areas | Planned | Verify available download/service routes, licence, event date, detection limits and resolution |
| [MITECO Banco de Datos de la Naturaleza](https://www.miteco.gob.es/) | Habitats and protected areas | Planned | Select official current datasets; verify designation, licence, CRS and publication dates |
| [MITECO EIDOS](https://www.miteco.gob.es/gl/biodiversidad/servicios/banco-datos-naturaleza/eidos_acceso.html) | Species reference information | Planned | Verify taxonomy, access method, currency and geographic scope; legal status requires separate verification |
| [GBIF Spain](https://datos.gbif.es/) | Dated biodiversity records | Planned | Retain dataset licence, occurrence date, coordinate uncertainty and verification status; historical observations do not prove current occupancy |
| [AEMET OpenData](https://opendata.aemet.es/) | Climate/weather context | Planned | Confirm registration/API-key requirements and documented access; keep keys on a future backend |
| [IGN / CNIG](https://centrodedescargas.cnig.es/) | Terrain and geographical reference | Planned | Select suitable products, CRS, resolution and licence; do not assume a universal API |
| [European Soil Data Centre](https://esdac.jrc.ec.europa.eu/) | Soil and erosion context | Planned | Verify dataset-specific access conditions, scale and suitability for local assessment |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) | Reference navigation only | Connected raster tiles | Internet required; preserve attribution and respect [tile policy](https://operations.osmfoundation.org/policies/tiles/); no bulk/offline download |

`data/providers.js` defines ANWE's internal adapter contract, not upstream response formats. An adapter receives an area and cancellation signal and returns `evidenceKind` (`demonstration`, `observation` or `derived`), `source`, `date`, `limitations` and its payload. Unregistered sources return unavailable; invalid provenance and service errors fail gracefully. Registration alone is not proof of connection; catalogue statuses remain planned until separately verified and updated. There are no credentials, guessed environmental endpoints or fake live responses.

Species geography was checked against MITECO's [amphibian inventory](https://www.miteco.gob.es/es/biodiversidad/temas/inventarios-nacionales/inventario-especies-terrestres/inventario-nacional-de-biodiversidad/ieet_anfib_reptl_lr_cap_iii_anf.html) and [amphibian habitat material](https://www.miteco.gob.es/content/dam/miteco/es/biodiversidad/planes-y-estrategias/charcas_y_anfibios_tcm30-480219.pdf), plus the CSIC-hosted [ocellated lizard distribution account](https://www.vertebradosibericos.org/reptiles/distribucion/timlepdi.html). These support regional plausibility, not the scenario's invented observations or welfare concerns.
