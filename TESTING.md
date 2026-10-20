# Validation performed

## Simplified three-step demo

The guided interface uses three primary screens, with existing evidence and review tools behind optional navigation. All 38 Python and 15 Node tests pass. `tests/demo_flow_browser.py` exercises initial navigation, all three options, draft saving and restoration, human-need categories, default/consented PDF privacy and mobile navigation at 390 px. It verifies no model or satellite-processing requests are made. New decision fields appear in reports only with consent and are cleared with the rest of the review. `tests/browser_smoke.py` opens advanced navigation explicitly to retain coverage of the detailed workflow. Screenshots were checked at desktop and mobile sizes.

## Animal-focused ethics and human–animal trade-offs

The integration adds the shared normative position and structured prompts for all three pathways. Python checks verify report coverage, consent defaults, policy/profile consistency and no automatic authority. Node checks exercise the ethical-policy screen, all pathway fields, no automatic selection and escaped human rationale. The complete suite contains 38 Python and 14 Node tests. Browser checks verified the policy text, expanded pathway comparison, revised rationale prompt and mobile width without making an AI request. A real-evidence report was generated privately, with all six main sections retained on their original pages and full ethical reasoning in Appendix C. Existing published reports and presentation edits were not overwritten.

## ANWE 4.1 PDF redesign validation

### Completed live demo

The final PDF includes labelled editorial corrections to historical-presence wording and an unsupported regeneration-rate inference. Original affected model wording is retained as superseded text in Appendix F. A regression test verifies the clarifications and confirms the stored model response is unchanged. Future AI instructions explicitly prohibit these inferences.

The complete browser workflow generated `reports/ANWE_Complete_Demo_Report.pdf` with a real configured `gpt-4.1-mini-2025-04-14` assessment, the existing processed 10 June / 5 July 2022 Sentinel pair, and the dated June 2021 / June 2023 GBIF comparison. All 30 welfare concern popups were checked, matrix filtering worked, and the report downloaded with privacy defaults and no invented expert review. There were no application JavaScript errors. All 28 PDF pages were rendered and visually inspected; text stayed within margins. The output contains seven main pages and 21 appendix pages. Model content remains an unreviewed draft and can contain incorrect interpretations; successful export does not establish ecological accuracy.

All **37 Python and 13 Node tests passed**. The PDF-specific checks cover missing services, optional actual AI drafts, unverified review status, separate privacy consent, changing periods/buffer/counts, species lists longer than 35 entries, source links, unchanged snapshots and rounded main-page values with original precision in the appendix. Tests use explicit fixtures and make no paid AI requests.

The Sierra de la Culebra example was regenerated from existing real cached CEMS, Sentinel and GBIF evidence. It has **six main pages and 18 appendix pages**, with PDF bookmarks. Every page was rendered with Poppler and visually inspected; text bounds, source-owned means, complete species sets and missing-AI status were also checked. The Chrome smoke test verifies downloading the report through the application with privacy defaults. The redesign changes presentation only; ecological calculations and retrieved data remain unchanged.

## ANWE 4.0 workflow review — 12 October 2026

All **33 Python and 13 Node tests passed** on the final review. The current browser smoke test passed with a 16-page PDF. Follow-up browser checks verified all 30 welfare group/domain popups, plain-paragraph AI rendering with no JSON panels, and PDF export without a reviewer even when the initial browser token was stale. These UI checks used explicit rendering fixtures where appropriate; no additional paid model call was made during the final review. Earlier actual model tests remain documented below. The demo guide now follows evidence → values → interpretation → welfare/pathway comparison → optional review → draft report.

## ANWE 4.0 validation — 12 October 2026

**33 Python tests and 10 Node tests passed.** Install `requirements-dev.txt` before running both suites as shown in README.md. Python tests cover source-field measurement/date selection, fabricated values/IDs/fields, malformed responses, all five values, explicit denial versus assertion of approval, one controlled repair and redacted failure logs, missing credentials, period filtering, date precision, same-area/buffer classification, spatial uncertainty, species sets, taxonomic filtering, deduplication, pagination caps, review confirmation/justification, PDF readability/privacy and HTTP report/comparison routes. Node tests preserve existing functionality and cover DfV dimensions, reviewed-save constraints and privacy across exports.

The seven requested example AI questions were exercised against an explicitly mocked provider to verify the request/validation path. This is not evidence of model quality. A separate **real end-to-end browser/model request** asked about recorded species, observation counts and the five values. The actual `gpt-4.1-mini-2025-04-14` response passed validation, selected six source fields (GBIF species/group counts, fire date and an available cached dNBR mean), included five value assessments and three pathways, and appeared in the downloaded PDF. No secrets, internal prompts or raw invalid responses were logged.

Live public GBIF queries returned 395 before and 227 after bounding-box records for the default June windows. Classification and exclusions were displayed separately; see DATA_SOURCES.md. Chrome checks covered matrix filtering (five rows to one), live comparison, mobile width (390 pixels without page overflow), actual AI response and PDF download. No JavaScript exceptions were reported. Generated PDFs opened through PyMuPDF, text/sections/privacy were checked, and rendered map/table pages were visually inspected. Existing cached satellite analysis was available to the app; a new authenticated raster request was not run during this upgrade.

The reusable `tests/browser_smoke.py` also passed against the local server. It checks invalid window rejection without replacing prior results, local reviewed-save requirements, edit invalidation and reload, question preservation using an explicitly simulated UI error, privacy-default PDF download and mobile overflow. That smoke test makes no paid model request. PDF text bounding boxes remained within checked margins and embedded-font output had no Unicode replacement characters. Run `python tests/browser_smoke.py http://localhost:8080` with installed Chrome and `requirements-dev.txt`.

Tests establish implementation behaviour, not ecological correctness, qualified expert identity, legal permission, sampling representativeness or full accessibility compliance. Fire end remains unverified. Previous validation notes below retain their original scope.

## Follow-up: 12 October 2026

Fixed a narrative validation mismatch: digits in source labels such as Sentinel-2 and EMSR580 are identifiers, not numeric ecological claims. The structured-output schema now constrains narrative text at generation time, with explicit exceptions for those source labels. Backend checks still reject unsupported numeric text, inline citations, links and unknown evidence references. A regression test covers allowed labels and rejected numeric claims, dates and fabricated labels. All 14 Python and 8 Node tests passed.

Two actual Responses requests using locally configured credentials completed successfully for the demo question. The request after the fix used the real CEMS, GBIF and CDSE catalogue context and passed validation with 24 source-backed facts, five hypotheses, ten unknowns and three pathways. Model returned: `gpt-4.1-mini-2025-04-14`. This verifies that live request and validation flow, not ecological correctness or every possible response. Authenticated satellite raster processing remains unverified. The original pre-credential checks below retain their original scope.

Validation date: 11 October 2026. Tests ran locally; no provider credentials were available.

## Automated checks

```powershell
python -m unittest discover -s tests -p "test_*.py" -v
node --test tests/workflow.test.cjs
```

13 Python tests passed. They cover actual bundled CEMS source metadata, reflectance formula fixtures, aligned processing requests, SCL/cloud/negative/zero masks, paired dNBR differences, GBIF privacy and quality, import provenance validation, stable evidence versions, missing credentials, structured response validation, invented references/numbers/URLs and missing alternatives, a mocked Responses request/incomplete response, and local HTTP static-route/CSRF/origin protections.

8 Node tests passed. They cover unavailable provider adapters, real case versus hypothetical welfare data, existing comparison/review rendering and escaping, local save/restore/clear/storage errors, actual mapped extent selection/reference tile failure, JSON draft export and asset/element integrity.

The provider fixture is explicitly a mock. These tests do not demonstrate real model answer quality or successful authenticated Sentinel Hub processing. No fabricated raster was exposed as a real analysis.

## Live public-source and browser checks

The local HTTP server successfully returned the 505-feature official-source CEMS extent, 75 GBIF records, 87 Sentinel-2 products and 164 evidence records. Source counts may change with cache expiry. Real pre/post satellite quicklooks loaded successfully. Missing OpenAI credentials returned 503 with no fake answer. Secret/static internal paths returned 404.

A local installed Chrome browser was exercised through Python Playwright because the in-app browser tool was unavailable. Checked case selection, evidence rendering, missing-key status, human-review save, summary content and review restoration after reload. Browser reported no JavaScript exceptions. A discovered mobile overflow was fixed and rechecked at 390 pixels: document width equals viewport width. Desktop/mobile screenshots were inspected. Tests did not assess full accessibility compliance.

## Required credential-dependent validation

After configuring local keys, restart the server and explicitly run one pre/post analysis. Check returned TIFF alignment, valid mask coverage, map overlays, sampled nulls/values and manifest dates against source metadata. Inspect seasonal/cloud limitations. Ask the configured model a source-backed question, then a missing-data question; verify factual IDs, draft separation, three alternatives and report export. Test provider authentication, quotas, refusal and timeout using a controlled account. Observe provider usage and local attempt caps. Do not call this completed live validation until those requests actually succeed.

## Visible AI and regional context (20 October 2026)

- Python unit suite: 41 passing; JavaScript workflow suite: 15 passing.
- `python tests/ai_guidance_browser.py`: mock provider response verifies visible main-flow advice, explicit note-sharing consent and unchanged manual decision; no paid request. Requires local test server on port 8081.
- `python tests/demo_flow_browser.py http://localhost:8081`: existing desktop/mobile, save/restore and PDF consent checks passed.
- Live public check: twelve sampled taxon lookups returned through the GBIF/IUCN context loader. OpenStreetMap provider requests failed; unavailable state retained. No live OpenAI response tested in this change.
- Human settlement distances are point-to-generalised-fire-footprint screening, not forest-distance or fire-risk modelling. Economic land use is not municipal employment/income data.

## Gemini provider integration

46 Python tests and 15 JavaScript tests pass. Provider tests cover Gemini request/schema mapping, actual model/response provenance, blocked and truncated output, missing keys, quota failure without paid fallback, and an assessment through the existing evidence validator. Tests use mock provider responses; live Gemini generation requires a locally configured key and has not been verified. Local `.env` selects Gemini; no credentials are served or committed.

## Live failure fixes

Google generation returned HTTP 404 for the old model despite metadata access succeeding. Switched to `gemini-3.5-flash-lite`; a real assessment passed server validation on its first attempt. Overpass failed; GeoNames fallback retrieved 104 regional populated-place records with distances to the mapped footprint, retaining source attribution and marking economic land use unavailable. Added filtering coverage for historical, foreign and out-of-window records. Provider HTTP errors now distinguish unavailable models, request rejection and service outages without forwarding remote bodies or credentials.

Final live browser check passed with regional context loaded: real Gemini guidance displayed, human selection unchanged, no JavaScript errors. Increased the bounded output allowance from 1800 to 4000 tokens after a richer-context response was truncated. Final unit results: 47 Python and 15 JavaScript tests passed.

## Primary recommendation and species-support cards

48 Python and 15 JavaScript tests passed. Live Gemini browser check displayed exactly one primary next step, alternatives and a recorded-species habitat-support card. Human selection remained empty until an explicit choice. Desktop and 390px mobile rendering checked; no horizontal overflow or JavaScript errors. Validation rejects invented pathways, non-animal-record species references and duplicate taxa. Species names and observation links come from server-held records; current rehabilitation needs remain unverified.
