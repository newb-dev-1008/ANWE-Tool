# ANWE 4.1 — Animal Welfare & Ecosystem Restoration

A local, human-supervised environmental decision-support prototype for the June 2022 Sierra de la Culebra wildfire in Zamora, Spain. Official observations, derived geometry, biodiversity records, authored welfare hypotheses and model drafts have separate provenance. No intervention is authorised by this application.

The central framework is **Design for Values**: Animal welfare, Ecological recovery, Transparency, Uncertainty and Accountability. The interactive matrix traces stakeholder concerns to norms, requirements, features and evaluation. Each pathway, AI assessment and PDF addresses the five values separately. See [DESIGN_FOR_VALUES.md](DESIGN_FOR_VALUES.md).

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

Public CEMS geometry, GBIF observations/comparisons, CDSE catalogue metadata and satellite quicklooks work without keys. Live model requests have been tested using local credentials. Cached raster analysis is shown only when genuinely available; ecological interpretation still needs validation. See TESTING.md for the scope of checks.

1. **OpenAI:** sign in or register at [OpenAI Platform](https://platform.openai.com/). Create a project and an [API key](https://platform.openai.com/api-keys), configure API billing and project spending limits, and copy the key into `OPENAI_API_KEY` in your local `.env`. Set `OPENAI_MODEL` to a model your project can access that supports Responses structured outputs; `.env.example` suggests `gpt-4.1-mini`. Consult the [official quickstart](https://developers.openai.com/api/docs/quickstart). API usage requires its own billing; a ChatGPT subscription does not supply an API key.
2. **Copernicus:** create an account at [Copernicus Data Space Ecosystem](https://dataspace.copernicus.eu/). Open the [Sentinel Hub dashboard](https://shapps.dataspace.copernicus.eu/dashboard/), then User Settings → OAuth clients → Create. Create a backend OAuth client, keep the SPA option off, and save its client ID and secret into `CDSE_CLIENT_ID` and `CDSE_CLIENT_SECRET`. Consult the [authentication guide](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Overview/Authentication.html). Account quotas and eligibility apply.
3. Restart `server.py`. The application reports configuration status without exposing secrets. Never paste keys into chat, JavaScript, screenshots or commits. `.env` is ignored by Git. Rotate a key if accidentally disclosed.

Missing keys leave the associated service disabled, with no simulated answer or substitute raster. Default limits are 20 attempted model requests and 3 attempted analyses per UTC day; configure lower limits in `.env`. One controlled repair may consume a second model attempt. Limits are request counts, not currency guarantees; use provider spending limits too.

## Workflow

1. Select the Culebra case in Case overview. Inspect the CEMS extent and its acquisition/publication dates. It is a generalised mapped observation, not an inferred final incident boundary. EFFIS historical geometry has not been obtained.
2. In Ecological evidence, compare genuine pre/post Sentinel-2 tile quicklooks and source metadata. With CDSE credentials, explicitly run the paired raster analysis, inspect continuous NDVI/dNBR overlays and click the map to sample valid pixels. Catalogue thumbnails are not analysis rasters.
3. In Biodiversity comparison, retrieve matched seasonal windows (default June 2021 / June 2023), choose a taxonomic group and set the outside buffer (0.5–20 km). Inspect burned-area, buffer and uncertain-location counts, species sets and date quality. Records are not a census or evidence of disappearance/recovery. Fire end is unverified; later observations may reflect the July fire.
4. With an OpenAI key, select the case and ask the AI Ecological Assistant. Inspect source-backed facts separately from model hypotheses, unknowns and three conditional alternatives.
5. Use the welfare, restoration comparison, Design for Values and evaluation tools. Guild/pathway assessments are authored hypotheses. Inspect four welfare dimensions and the five-value assessment inside each option; no overall ethical score is produced.
6. Record a draft, deferred decision or locally reviewed decision. Reviewed status requires reviewer, date, preferred option, justification and explicit human confirmation; editing invalidates confirmation. Qualifications are unverified and external approvals remain necessary. Save in this browser.
7. Open Report and choose Download PDF Report for an A4 assessment with map, evidence, temporal comparison, values, options, actual session AI draft, review and sources. Personal review details and private notes are omitted by default from PDF/JSON/text; select explicit inclusion options when appropriate. AI questions/drafts are included. Restarting the server clears validated AI sessions; ask again before including an old draft in a PDF.

## Tests

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m unittest discover -s tests -p "test_*.py"
node --test tests/workflow.test.cjs
```

Node is needed only for the frontend test suite. See [TESTING.md](TESTING.md) and [DEMO_GUIDE.md](DEMO_GUIDE.md). The PDF engine is ReportLab, without a browser runtime requirement. On Windows it embeds installed Arial; on Linux it uses DejaVu Sans if available, with a standard-font fallback.

A generated [DfV sample assessment](reports/ANWE_Design_for_Values_Assessment.pdf) contains six main pages: summary, wildfire/environment, biodiversity, strategies, values and next steps. Appendices retain exact measurements, complete retrieved species sets, methods, source licences and a glossary. Main-page satellite values are rounded to three decimals; calculations and source data are unchanged. PDF bookmarks support navigation. The sample uses real available evidence and explicitly has no completed AI assessment or expert review; app exports include the latest actual session assessment when selected, without starting a model request. The older Multispecies Justice PDF is retained only as a historical report.

Optional source-backed GeoJSON imports are labelled reviewer-supplied and never promoted to independently verified model facts. See [DATA_SOURCES.md](DATA_SOURCES.md), [AI_ARCHITECTURE.md](AI_ARCHITECTURE.md), [ETHICS_AND_LIMITATIONS.md](ETHICS_AND_LIMITATIONS.md), [TESTING.md](TESTING.md) and [FUTURE_ROADMAP.md](FUTURE_ROADMAP.md).
