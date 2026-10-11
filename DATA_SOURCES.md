# Sources, methods and availability

## Working public integrations

| Component | Source and status | Coverage and limits |
|---|---|---|
| Fire case | [CEMS EMSR580](https://mapping.emergency.copernicus.eu/activations/EMSR580/), documented activation | June fire starts 15 June 2022; activation 17 June. Extinguishment date is unknown. Separate July fire is not conflated. |
| Mapped burned extent | Official EMSR580 AOI01 observedEventA vector; 505 polygon features | SPOT-6/7 acquisition 25 June 2022 10:44:58 UTC; published 26 June. Generalised display, not original full-resolution geometry or final incident extent. |
| Sentinel-2 catalogue | [CDSE STAC](https://documentation.dataspace.copernicus.eu/APIs/STAC.html), public queried products and genuine quicklooks | Pre 20 May?14 June 2022; post 20 June?5 July; contextual June 2023 recovery. Regional window, full-tile cloud estimates, max 100 products per period. Recovery can include July fire effects. |
| Animal occurrence index | [GBIF API](https://techdocs.gbif.org/en/openapi/v1/occurrence), live queried and cached | Mammals, birds, reptiles, amphibians, insects and arachnids; up to 15 indexed observations per class. Presence records with coordinates and no geospatial issues; dates and quality remain explicit. |
| Basemap | [OpenStreetMap](https://www.openstreetmap.org/copyright) | Reference geography only; network tiles may fail independently. |

The implementation retrieval returned 87 Sentinel-2 products and 75 GBIF records. Counts can change when the 24-hour caches expire. The search box is [-6.5, 41.75, -5.95, 42.1]; it encloses the mapped extent but is not itself a fire polygon. Regional records may lie outside burned habitat. GBIF is an index of contributing datasets: every displayed record retains its contributing provider, dataset ID, licence, source link, observation date and uncertainty. All coordinates are suppressed from the frontend and exports; no unverified sensitive-species list is used. Indexed animals are not proof of living animals today, abundance, native status or conservation status.

## Reproducible official-source geometry

`data/culebra-perimeter.json` is derived from the official [EMSR580 vector ZIP](https://cems-mapping-website.s3.eu-west-1.amazonaws.com/static/activations/EMSR580/EMSR580_AOI01_GRA_PRODUCT_r1_RTP01_v1_vector.zip), member `EMSR580_AOI01_GRA_PRODUCT_observedEventA_r1_v1.json`. Original SHA-256: `001eabbcd858efe004a0d5c851c8f247bb4f8509d35babbac80bcbd4aa5d09b2`. The importer uses HTTP ranges to extract this member and metadata, then applies topology-preserving Shapely simplification with tolerance 0.00015 degrees. It retains 505 features; properties include source identifiers, not invented ecological findings. Run `python scripts/import_cems.py` to reproduce. Original downloaded files stay in `.runtime/`. No burned-area estimate is calculated from generalised display geometry.

Attribution: Copernicus Emergency Management Service, ? European Union, EMSR580. See the activation product metadata and [Copernicus EMS terms](https://www.copernicus.eu/en/access-data/copyright-and-licences). This redistribution contains derived vector geometry, not SPOT imagery. Sentinel data use the [Copernicus Sentinel legal notice](https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice). GBIF licences are per dataset/record and must be retained when reusing observations. Leaflet's bundled licence is in `vendor/`.

## EFFIS access limitation and import fallback

No historical EFFIS June 2022 perimeter or severity raster was retrieved. The [EFFIS data services page](https://forest-fire.emergency.copernicus.eu/applications/data-and-services) directs unavailable historical/raw perimeter requests to its data request form. CEMS is labelled CEMS, never presented as EFFIS. See [EFFIS licence](https://forest-fire.emergency.copernicus.eu/about-effis/data-license).

The map accepts WGS84 Polygon/MultiPolygon FeatureCollections with mandatory source, dataset ID, June 2022 date, HTTPS source URL, licence, reviewer and limitations. Regional bounds, vertex count and geometry validity are checked. Imports are stored locally and visibly marked reviewer-supplied: metadata is not independent authentication and is excluded from official AI facts.

## Implemented derived raster analysis; credential validation pending

The backend requests Sentinel-2 Level-2A surface reflectance using the [CDSE Sentinel Hub Process API](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/S2L2A.html). It requests B04, B08, B12, B02, B03, SCL and dataMask at the chosen catalogue acquisition ?15 minutes. Selected before/after scenes are processed onto the same snapped EPSG:3857 grid at 60 projected metres; CRS, bounds and dimensions are validated. Nearest-neighbour resampling is explicit. This is a prototype compromise; ground pixel spacing differs with latitude and it is not native-resolution analysis.

Reflectance units and `harmonizeValues=false` preserve processing-baseline offsets; negative/nonfinite reflectance and zero denominators are excluded. SCL classes 0,1,2,3,6,7,8,9,10,11 are masked, retaining 4/5 only, with a one-pixel buffer around clouds/shadows/unclassified pixels. This conservative mask may omit dark burned surfaces. NDVI=(B08?B04)/(B08+B04); NBR=(B08?B12)/(B08+B12); dNBR=NBRbefore?NBRafter. Differences use paired valid pixels. Missing values remain null/transparent. Returned TIFFs, computed arrays, overlays and a method manifest are cached locally.

No categorical burn-severity thresholds, soil-moisture retrieval, animal deaths or habitat suitability are inferred. Statistics cover the regional grid, including unburned land. Phenology, drought, smoke and residual atmospheric errors affect change. No authenticated live processing run was possible without CDSE credentials; formulas, masks and request alignment were tested with fixtures. Indices appear only after actual successful processing.

Authored guild welfare questions and the three restoration pathways are hypothetical guides. Current site condition, fire mortality and expert approval remain unknown. Native/protected species classification, current field occupancy, EFFIS severity and validated soil moisture are not implemented.
