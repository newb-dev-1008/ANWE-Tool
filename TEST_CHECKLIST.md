# Test Checklist — Animal-Centred Wildfire Recovery Decision Support Prototype v0.1

> **Scope**: This checklist covers evidence traceability, uncertainty handling, species representation, human oversight and misleading recommendations, as required by the tool brief.
> **Status**: Self-assessment of prototype v0.1 (2026-10-10). NOT independently validated.

---

## How to Use This Checklist

A reviewer should:
1. Open the running prototype in a browser.
2. Work through each item below, marking **PASS / FAIL / PARTIAL** based on direct observation.
3. Record notes and any disagreements.
4. Use the **Expert Review & Record** screen in the app to formally document overrides.

Marking an item PASS does **not** mean the tool is validated for real-world use.

---

## Category 1: Evidence Traceability

| ID | Criterion | Expected | How to Verify | Result | Notes |
|----|-----------|----------|---------------|--------|-------|
| ET-1 | Every data point displayed has a labelled source | Source label, date, confidence and limitations shown for each evidence source | Case Overview → Evidence Sources table | PASS (prototype) | 3 synthetic sources listed with full metadata |
| ET-2 | No real-world citations have been invented or misrepresented | All references explicitly labelled as fictional | Case Overview → Evidence Sources → "Verified" column shows ⚠ Unverified | PASS (prototype) | All sources marked Unverified/Fictional |
| ET-3 | Data provenance for every welfare assessment is traceable | Evidence type (Observation/Inference/Unknown) shown on each welfare cell | Animal Welfare screen → any species → welfare domain badges | PASS (prototype) | All domains show evidence-type badge |
| ET-4 | Satellite imagery limitation is explicitly stated | Tool must NOT claim imagery directly measures animal welfare | Case Overview → Evidence Sources → src-1 limitations text | PASS (prototype) | Explicit disclaimer in source metadata and canvas map caption |
| ET-5 | All synthetic data is clearly labelled as such | Persistent global banner; per-screen callouts; species card notes | Persistent red banner at bottom of all pages; callout on Case Overview | PASS (prototype) | ⚠️ banner appears on all screens; "ILLUSTRATIVE" tags throughout |
| ET-6 | Source dates are provided | All evidence sources include a date field | Evidence Sources table — Date column | PASS (prototype) | Dates shown for all 3 fictional sources |

---

## Category 2: Uncertainty

| ID | Criterion | Expected | How to Verify | Result | Notes |
|----|-----------|----------|---------------|--------|-------|
| U-1 | Confidence and uncertainty levels are displayed for all welfare assessments | Uncertainty level shown with visual indicator (dots) and text | Welfare Context → click any welfare cell → modal shows uncertainty dots | PASS (prototype) | 4-dot uncertainty meter shown in modal |
| U-2 | Missing records are NOT interpreted as species absence | Explicit disclaimer present and prominent | Case Overview → Key Limitations; Welfare Context → info callout | PASS (prototype) | Disclaimer in multiple locations |
| U-3 | Knowledge gaps are identified and named, not hidden | Per-domain knowledge gap field populated and shown | Welfare modal → "Knowledge gap" section | PASS (prototype) | Each domain has a named knowledge gap |
| U-4 | High-uncertainty assessments are visually distinguished from low-uncertainty ones | "Very high" uncertainty is distinguishable from "Low" | Compare uncertainty dots across species/domains | PASS (prototype) | 4-dot scale from Low (1 dot green) to Very High (4 dots red) |
| U-5 | Recovery pathway uncertainties are explicitly listed | Key uncertainties listed per option | Compare Pathways → each option → "Key Uncertainties" dropdown | PASS (prototype) | 3 uncertainties listed per option |
| U-6 | No deterministic outcome predictions are made | Phrasing uses "likely", "may", "potential" rather than certainties | Read welfare assessments and pathway benefits/harms | PASS (prototype) | All language uses hedged/probabilistic phrasing |

---

## Category 3: Species Representation

| ID | Criterion | Expected | How to Verify | Result | Notes |
|----|-----------|----------|---------------|--------|-------|
| SR-1 | Invertebrate / pollinator welfare is assessed and included | Pollinators appear as a focal species with full welfare assessment | Welfare Context → Pollinators tab | PASS (prototype) | Full 5-domain welfare assessment for pollinators |
| SR-2 | No single overall welfare score conceals harm to smaller groups | Tool must NOT show a single aggregate score | All screens — check for any composite score | PASS (prototype) | No aggregate score exists anywhere in the UI |
| SR-3 | Multispecies Justice analysis identifies whose interests are absent | Soil biota, undetected species and traditional knowledge holders flagged | Multispecies Justice screen | PASS (prototype) | 8 groups analysed; soil biota and undetected species flagged VERY HIGH / CRITICAL |
| SR-4 | Species with limited mobility / escape capacity are given heightened attention | Hermann's Tortoise and Mallorcan Midwife Toad (very low mobility) receive explicit attention | Welfare Context → Tortoise, Toad cards; Compare Pathways missing stakeholders | PASS (prototype) | Tortoise and toad sensitivity explicitly noted; toad omission flagged in Option B |
| SR-5 | Invertebrates' systematic omission risk is made visible | UI flags that pollinators and soil biota are almost never included in real plans | Multispecies Justice screen → Pollinators row | PASS (prototype) | "VERY HIGH — almost never included in fire-recovery plans" |
| SR-6 | Per-species welfare impacts are shown disaggregated for each recovery option | Compare Pathways "By Species Impact" view shows per-species welfare per option | Compare Pathways → "By Species Impact" view | PASS (prototype) | Table shows all 6 species × 3 options |
| SR-7 | Species not explicitly addressed in an option are flagged, not silently omitted | Missing stakeholder lists exist per option | Compare Pathways → each option → "Missing / Underrepresented" section | PASS (prototype) | Option B explicitly flags midwife toad omission as "significant gap" |

---

## Category 4: Human Oversight

| ID | Criterion | Expected | How to Verify | Result | Notes |
|----|-----------|----------|---------------|--------|-------|
| HO-1 | The tool does NOT automatically issue or execute management instructions | No automated recommendation, no "implement now" button | All screens — check for automated instruction outputs | PASS (prototype) | No such buttons exist; explicit disclaimer on Expert Review screen |
| HO-2 | Experts can challenge tool assessments | Challenge field present and editable | Expert Review & Record → "Challenge / Override Tool Assessments" section | PASS (prototype) | Free-text challenge field with guiding placeholder |
| HO-3 | Expert override of welfare assessments is supported | Override field present; overrides are included in export | Expert Review → "Overridden assessments" field; Export JSON | PASS (prototype) | Override field with example prompt; included in JSON export |
| HO-4 | Unresolved risks can be recorded | Unresolved risks field present | Expert Review → "Unresolved Risks" section | PASS (prototype) | Dedicated free-text field with multi-item placeholder |
| HO-5 | Decision rationale is recorded and exported | Rationale field; shows in JSON export | Expert Review → "Decision Rationale" → Export JSON | PASS (prototype) | Rationale field present; exported in JSON record |
| HO-6 | Evaluation checklist items can be challenged by reviewer | Reviewer can toggle pass/fail status on checklist | Evaluation screen → "Mark ❌ / Mark ✅" buttons | PASS (prototype) | Each item has a toggle; reviewer notes field below checklist |
| HO-7 | Sensitive species location data is protected | No precise GPS coordinates; only coarse schematic | Case Overview → schematic map; no lat/lon shown anywhere | PASS (prototype) | Canvas map shows only illustrative zones with no coordinates |
| HO-8 | Sign-off includes explicit acknowledgement of prototype status | Sign-off warning mentions synthetic data and lack of validation | Expert Review → sign-off callout | PASS (prototype) | Explicit 4-point sign-off warning |

---

## Category 5: Misleading Recommendations

| ID | Criterion | Expected | How to Verify | Result | Notes |
|----|-----------|----------|---------------|--------|-------|
| MR-1 | The tool does NOT claim to have been validated | No validation claim anywhere in UI or documentation | All screens; README | PASS (prototype) | Multiple disclaimers; README explicitly states "NOT validated" |
| MR-2 | The tool does NOT claim to improve animal welfare | No such claim in UI, README or data | All screens; README; scenario.js header | PASS (prototype) | Claims consistently limited to "decision support" and "illustrative" |
| MR-3 | A composite score that could mislead is NOT present | Verify absence of any overall score or ranking | All Compare Pathway views | PASS (prototype) | Explicit callout explains why no score is shown |
| MR-4 | Ethics flags per option surface hidden harms | Per-option ethics flags visible | Compare Pathways → each option → "Ethics Flags" section | PASS (prototype) | 2 ethics flags per option; Option B flags pollinator harm and toad omission |
| MR-5 | The tool is clearly labelled as a prototype throughout | Version label, prototype language, persistent banner | Header badge, sidebar footer, global banner | PASS (prototype) | "Prototype v0.1" in sidebar; "🧪 Illustrative Data" badge in header |
| MR-6 | No real locations, real species records, or real citations are claimed | All such claims are fictional and labelled | Case Overview, scenario.js header | PASS (prototype) | Scenario labelled FICTIONAL throughout; scenario.js has prominent disclaimer comment |

---

## Summary

| Category | Total Items | Prototype PASS | PARTIAL | FAIL |
|----------|-------------|----------------|---------|------|
| Evidence Traceability | 6 | 6 | 0 | 0 |
| Uncertainty | 6 | 6 | 0 | 0 |
| Species Representation | 7 | 7 | 0 | 0 |
| Human Oversight | 8 | 8 | 0 | 0 |
| Misleading Recommendations | 6 | 6 | 0 | 0 |
| **Total** | **33** | **33** | **0** | **0** |

> ⚠️ All items pass in **self-assessment** of the prototype. An independent reviewer would need to re-run this checklist against the live tool. Known limitations not captured in these 33 items are documented in `README.md`.

---

## Known Gaps NOT Covered by This Checklist

The following issues are acknowledged but not fully mitigated in v0.1:

1. **Traditional Ecological Knowledge (TEK)**: The tool mentions TEK as a missing stakeholder category but does not structurally integrate TEK into the data model.
2. **Real-time data integration**: No mechanism exists to connect to live satellite, weather or camera-trap feeds.
3. **Quantitative welfare measurement**: All welfare assessments are qualitative inferences — no validated quantitative animal welfare metric is applied.
4. **Multi-expert review**: The tool supports one expert record at a time; collaborative multi-expert review requires a server-side component not present in v0.1.
5. **Accessibility (a11y) audit**: Semantic HTML and ARIA labels are implemented but a full accessibility audit with assistive technology testing has not been conducted.
6. **Soil biota welfare**: Flagged as a critical gap in the Multispecies Justice screen but no welfare assessment is provided for soil biota (data does not exist even in illustrative form).

---

*Checklist prepared for Ethics of AI assignment, TU/e, Quarter 1, 2026. Not for operational use.*
# ANWE v0.2 workflow validation

The detailed checklist below describes the original v0.1 prototype and is retained as historical material. Its old species names, intervention percentages and in-memory-only review behaviour have been superseded.

For the updated application, run `node --test tests/*.test.cjs`, then manually check:

1. Open the app at desktop and mobile widths; verify readable text, navigation and no horizontal page overflow.
2. Pan/zoom Spain by mouse and keyboard. Select the demonstration case by polygon, marker and button. Confirm the area is north of Córdoba.
3. Toggle each layer, check its explanatory legend and verify creation date, fictional event date and limitations remain visible.
4. Disconnect the network and reload. Local Leaflet and demonstration shapes should remain available; unavailable reference tiles should display a status message.
5. Inspect all six welfare tabs and five domains. No real observation or current occupancy should be claimed. Open a detail modal, check Tab stays inside, then Escape returns focus.
6. Compare all three strategies in all three views. Find risks, uncertainties, evidence gaps and inappropriate situations; no option should be preselected or recommended.
7. Try saving an empty review. Fill reviewer, date and rationale, add evidence, challenges and unresolved risks, then save locally and reload.
8. Verify the local record is restored, view a summary and download text and JSON. Confirm current draft fields, evidence caveats and no official approval claim.
9. Clear the record and reload; verify it is removed. Check storage-disabled mode reports the limitation and still permits export.
10. Edit the ethics checklist and export; verify session-only overrides are included. Review with a screen reader before any claim of accessibility compliance.

Browser visual QA was unavailable in the implementation session. Automated checks use a DOM harness and do not prove layout, tile rendering or screen-reader behaviour.
