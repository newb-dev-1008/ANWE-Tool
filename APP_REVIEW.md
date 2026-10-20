# Final demo review - 20 October 2026

The app meets the central presentation goal: a single-case restoration discussion tool that gives animal welfare modest priority while considering human safety and essential needs. It is ready to demonstrate that workflow. It does not establish an ecologically optimal or authorised restoration plan.

| Goal | Current result |
| --- | --- |
| Easy three-step demo | Implemented: understand, explore AI advice, record human reasoning and export. |
| Clear case selection | Forest fire dropdown, Sierra de la Culebra June 2022 only. No unsupported cases offered. |
| Visible AI | Gemini provides one primary suggestion, alternatives, reasons and conditions that could change it. Field verification can be the primary next step when evidence is insufficient. |
| Human decision-making | AI never sets the chosen option automatically. Users explicitly choose, explain, save or defer; expert review and authorisation are distinct. |
| Animal welfare and human needs | Authored ethical foundation, modest welfare priority, need categories and less harmful alternatives are integrated into prompts and review. This is a normative policy, not a scientifically calibrated welfare score. |
| Species and rehabilitation | Conditional habitat-support cards reference retrieved GBIF records. User-mentioned wolves are discussed as unverified scenarios. Current presence, injuries and rehabilitation needs require field evidence. No clinical treatment assessment is provided. |
| Real ecological data | CEMS mapped footprint, available Sentinel analysis, bounded GBIF samples and global IUCN categories relayed by GBIF. Sampling, dates and coverage limits remain visible. |
| Nearby people | GeoNames settlement-point fallback works when Overpass fails. Distance is to the mapped footprint, not every forest or dwelling. It is not a live hazard model or proof of risk to lives. |
| Economic activity | Partial: OpenStreetMap land-use proxies when available. Overpass has been unavailable in live checks. No municipal employment, income or dependence data are integrated. |
| Reports and privacy | PDF export and local draft saving work. Separate decision details require export consent. Questions and AI drafts are included in reports and may repeat any notes explicitly shared with the model; the UI discloses this. |
| Free AI access | Gemini free-tier option configured. Quotas and provider terms apply; no automatic paid fallback. Independent installations need their own backend configuration; this review does not claim public hosting. |

## Verification

48 Python tests and 15 JavaScript tests passed. Desktop/mobile browser checks passed for the three-step flow, single available case, manual selection, save/restore, PDF consent, user questions and AI rendering. Current review browser tests mocked the provider and did not consume AI quota. Earlier live Gemini checks validated a real primary recommendation, alternatives and a species card with regional context loaded. These checks establish software behaviour, not ecological correctness or expert qualification.

## Recommended demo

1. Show the selected Culebra fire and load case evidence and regional context.
2. Describe a concern (or insert the explicitly hypothetical wolf example).
3. Generate AI advice. Explain its primary suggestion, alternatives and field checks.
4. Discuss the trade-offs as humans; accept, adapt, reject or defer.
5. Record the reasons and safeguards, save the draft and download the PDF.

Describe the product as AI-supported expert discussion using available evidence. Do not claim it has measured welfare, verified local danger, quantified livelihood loss or found the objectively best restoration pathway.
