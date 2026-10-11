# Validation performed

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
