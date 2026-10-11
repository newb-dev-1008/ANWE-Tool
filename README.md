# ANWE 3.0 ? Animal Welfare & Ecosystem Restoration

A local, human-supervised environmental decision-support prototype for the June 2022 Sierra de la Culebra wildfire in Zamora, Spain. Official observations, derived geometry, biodiversity records, authored welfare hypotheses and model drafts have separate provenance. No intervention is authorised by this application.

## Installation

Python 3.11 or later is recommended. From the repository directory:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
.\.venv\Scripts\python.exe server.py
```

Open http://localhost:8080. The Python backend is required; a generic static server cannot run integrations. No Node build is needed. Leaflet is bundled. Public source retrieval and reference tiles require internet access. Caches and local raster assets are stored in ignored `.runtime/`. The server binds only to the local computer.

## Obtain credentials

Public CEMS geometry, GBIF observations, CDSE catalogue metadata and satellite quicklooks work without keys. Neither credentials nor live paid services were available during implementation; authenticated processing and real model responses still require validation with your account.

1. **OpenAI:** sign in or register at [OpenAI Platform](https://platform.openai.com/). Create a project and an [API key](https://platform.openai.com/api-keys), configure API billing and project spending limits, and copy the key into `OPENAI_API_KEY` in your local `.env`. Set `OPENAI_MODEL` to a model your project can access that supports Responses structured outputs; `.env.example` suggests `gpt-4.1-mini`. Consult the [official quickstart](https://developers.openai.com/api/docs/quickstart). API usage requires its own billing; a ChatGPT subscription does not supply an API key.
2. **Copernicus:** create a free account at [Copernicus Data Space Ecosystem](https://dataspace.copernicus.eu/). Open the [Sentinel Hub dashboard](https://shapps.dataspace.copernicus.eu/dashboard/), then User Settings ? OAuth clients ? Create. Create a backend OAuth client, keep the SPA option off, and save its client ID and secret into `CDSE_CLIENT_ID` and `CDSE_CLIENT_SECRET`. Consult the [authentication guide](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Overview/Authentication.html). Account quotas and eligibility apply.
3. Restart `server.py`. The application reports configuration status without exposing secrets. Never paste keys into chat, JavaScript, screenshots or commits. `.env` is ignored by Git. Rotate a key if accidentally disclosed.

Missing keys leave the associated service disabled, with no simulated answer or generated substitute raster. Default limits are 20 attempted model requests and 3 attempted analyses per UTC day; configure lower limits in `.env`. Limits are request counts, not currency guarantees. Set spending limits in the provider account too.

## Workflow

1. Select the Culebra case in Case overview. Inspect the CEMS extent and its acquisition/publication dates. It is a generalised mapped observation, not an inferred final incident boundary. EFFIS historical geometry has not been obtained.
2. In Ecological evidence, compare genuine pre/post Sentinel-2 tile quicklooks and source metadata. With CDSE credentials, explicitly run the paired raster analysis, inspect continuous NDVI/dNBR overlays and click the map to sample valid pixels. Catalogue thumbnails are not analysis rasters.
3. Examine regional GBIF records and their dates, providers, licences and uncertainty. Coordinates are withheld. These records do not establish current occupancy or presence inside the burned area.
4. With an OpenAI key, select the case and ask the AI Ecological Assistant. Inspect source-backed facts separately from model hypotheses, unknowns and three conditional alternatives.
5. Use the preserved welfare, restoration comparison, justice and evaluation tools. Their guild assessments are authored hypotheses, not measured welfare or model output.
6. Record a human review, challenged assumptions and unresolved risks. Save in this browser and export JSON or a text report. The report includes provenance, available analysis and AI drafts separately from human conclusions. AI conversation is session-only; export before closing. Local reviewer identity is unverified.

Optional source-backed GeoJSON imports are labelled reviewer-supplied and never promoted to independently verified model facts. See [DATA_SOURCES.md](DATA_SOURCES.md), [AI_ARCHITECTURE.md](AI_ARCHITECTURE.md), [ETHICS_AND_LIMITATIONS.md](ETHICS_AND_LIMITATIONS.md), [TESTING.md](TESTING.md) and [FUTURE_ROADMAP.md](FUTURE_ROADMAP.md).
