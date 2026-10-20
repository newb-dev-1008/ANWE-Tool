# ANWE 4.1 — Animal Welfare & Ecosystem Restoration

A local, human-supervised environmental decision-support prototype for the June 2022 Sierra de la Culebra wildfire in Zamora, Spain. Official observations, derived geometry, biodiversity records, authored welfare hypotheses and model drafts have separate provenance. No intervention is authorised by this application.

The central framework is **Design for Values**: Animal welfare, Ecological recovery, Transparency, Uncertainty and Accountability. The interactive matrix traces stakeholder concerns to norms, requirements, features and evaluation. Each pathway, AI assessment and PDF addresses the five values separately. See [DESIGN_FOR_VALUES.md](DESIGN_FOR_VALUES.md).

The [ethical basis](ETHICAL_BASIS.md) gives animal welfare a modest, defeasible priority in closely balanced choices, with explicit consideration of human safety and essential needs. Pathways expose human objectives, animal interests, conflicts, alternatives, evidence gaps and safeguards. Human reviewers explain their decision; the app does not calculate an ethical score or automatically choose a winner.

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

1. **Gemini (free-tier option):** create a key at [Google AI Studio](https://aistudio.google.com/apikey), set `AI_PROVIDER=gemini`, `GEMINI_API_KEY` and `GEMINI_MODEL=gemini-3.5-flash-lite` in your private `.env`, and restart the server. Use an eligible free-tier project without billing to avoid provider charges; quotas and data-use terms apply. See [DEMO_GUIDE.md](DEMO_GUIDE.md#activate-gemini-free-tier-option). No automatic paid fallback is used.

   **OpenAI (optional, set `AI_PROVIDER=openai`):** sign in or register at [OpenAI Platform](https://platform.openai.com/). Create a project and an [API key](https://platform.openai.com/api-keys), configure API billing and project spending limits, and copy the key into `OPENAI_API_KEY` in your local `.env`. Set `OPENAI_MODEL` to a model your project can access that supports Responses structured outputs; `.env.example` suggests `gpt-4.1-mini`. Consult the [official quickstart](https://developers.openai.com/api/docs/quickstart). API usage requires its own billing; a ChatGPT subscription does not supply an API key.
2. **Copernicus:** create an account at [Copernicus Data Space Ecosystem](https://dataspace.copernicus.eu/). Open the [Sentinel Hub dashboard](https://shapps.dataspace.copernicus.eu/dashboard/), then User Settings → OAuth clients → Create. Create a backend OAuth client, keep the SPA option off, and save its client ID and secret into `CDSE_CLIENT_ID` and `CDSE_CLIENT_SECRET`. Consult the [authentication guide](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Overview/Authentication.html). Account quotas and eligibility apply.
3. Restart `server.py`. The application reports configuration status without exposing secrets. Never paste keys into chat, JavaScript, screenshots or commits. `.env` is ignored by Git. Rotate a key if accidentally disclosed.

Missing keys leave the associated service disabled, with no simulated answer or substitute raster. Default limits are 20 attempted model requests and 3 attempted analyses per UTC day; configure lower limits in `.env`. One controlled repair may consume a second model attempt. Limits are request counts, not currency guarantees; use provider spending limits too.

## Workflow

The default interface is Tierra del Fuego's three-step demo:

1. **Understand the case:** read the animal-welfare principle and concise evidence summaries. The Culebra case is already selected. Historical comparison retrieval is optional.
2. **Compare options:** compare possible effects on animals, human needs and required checks. Consider an option or continue undecided. No option wins automatically.
3. **Explain and export:** state the human need, consequences of delay, animal safeguards and reasons. Save a local draft or defer, then download a PDF with explicit consent for private decision details.

Maps, satellite processing, biodiversity dates/counts, AI, full ethical reasoning and qualified review remain under **Evidence & advanced tools**. Model calls and new processing are optional and explicit. The simple workflow requires neither. No current occupancy, welfare improvement, expert credentials or permission to act is inferred.

Read [DEMO_GUIDE.md](DEMO_GUIDE.md) for the short demo, or [ADVANCED_GUIDE.md](ADVANCED_GUIDE.md) for detailed evidence and review workflows.

## Tests

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m unittest discover -s tests -p "test_*.py"
node --test tests/workflow.test.cjs
```

Node is needed only for the frontend test suite. See [TESTING.md](TESTING.md) and [DEMO_GUIDE.md](DEMO_GUIDE.md). The PDF engine is ReportLab, without a browser runtime requirement. On Windows it embeds installed Arial; on Linux it uses DejaVu Sans if available, with a standard-font fallback.

A generated [DfV sample assessment](reports/ANWE_Design_for_Values_Assessment.pdf) contains six main pages: summary, wildfire/environment, biodiversity, strategies, values and next steps. Appendices retain exact measurements, complete retrieved species sets, methods, source licences and a glossary. Main-page satellite values are rounded to three decimals; calculations and source data are unchanged. PDF bookmarks support navigation. The sample uses real available evidence and explicitly has no completed AI assessment or expert review; app exports include the latest actual session assessment when selected, without starting a model request. The older Multispecies Justice PDF is retained only as a historical report.

Optional source-backed GeoJSON imports are labelled reviewer-supplied and never promoted to independently verified model facts. See [DATA_SOURCES.md](DATA_SOURCES.md), [AI_ARCHITECTURE.md](AI_ARCHITECTURE.md), [ETHICS_AND_LIMITATIONS.md](ETHICS_AND_LIMITATIONS.md), [TESTING.md](TESTING.md) and [FUTURE_ROADMAP.md](FUTURE_ROADMAP.md).
