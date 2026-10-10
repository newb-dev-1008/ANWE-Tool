# Animal-Centred Wildfire Recovery Decision Support — Prototype v0.1

> **⚠️ IMPORTANT: This is an academic prototype for an Ethics of AI assignment (TU/e, 2026).  
> ALL data is synthetic and illustrative. This tool has NOT been validated.  
> Do NOT use for real land-management decisions.**

---

## 1. How to Run

This is a **pure HTML/CSS/JavaScript** application — no build step, no dependencies, no server required.

```bash
# Option A: simply open in browser
# Navigate to the Webapp/ folder and double-click index.html

# Option B: serve locally (recommended to avoid any CORS edge cases)
# If you have Python installed:
python -m http.server 8080
# Then open: http://localhost:8080

# Or with Node.js:
npx serve .
# Then open the URL shown in the terminal
```

### File structure

```
Webapp/
├── index.html          ← Main HTML entry point (all screens)
├── style.css           ← Full CSS design system (dark-mode, responsive)
├── app.js              ← Application logic (rendering, navigation, export)
├── data/
│   └── scenario.js     ← ⚠️ ALL ILLUSTRATIVE DATA lives here
├── README.md           ← This file
└── TEST_CHECKLIST.md   ← Evaluation checklist (separate document)
```

---

## 2. Assumptions

- **No authentication or data persistence**: The tool runs entirely in-browser. The expert review record is held in memory and can be exported as JSON. Refreshing the page resets it.
- **No real API calls**: All data is embedded in `data/scenario.js`. No external databases, satellite APIs or species registries are queried.
- **Single-case prototype**: The tool is designed around one illustrative scenario. Multiple cases would require a case-selection screen and per-case data files.
- **Coarse species location data only**: No precise GPS coordinates are shown for any species — only schematic habitat zone diagrams — to protect sensitive species location information.
- **EU legal context assumed**: References to "Strictly Protected" / "Natura 2000" etc. are fictional and illustrative of an EU regulatory context. They carry no legal weight.

---

## 3. Scenario Data — Provenance and Limitations

### Scenario identity
- **Name**: Sierra Morena Compounding Fires 2022–2023 — FICTIONAL ILLUSTRATIVE SCENARIO
- **Inspired by**: Mediterranean Europe (southern Spain / Andalusia) — geography only, no real events
- **Created**: 2026-10-10 for Ethics of AI assignment, TU/e

### Data provenance

| Element | Status | Source |
|---|---|---|
| Fire extent (18 000 ha) | **Synthetic** — invented for demonstration | Not based on any real fire record |
| Species selection | **Illustrative** — realistic Mediterranean fauna | Selected for guild diversity, not survey data |
| Welfare assessments | **Inferred** — from general ecological principles | No site-specific surveys conducted |
| Camera-trap records | **Fictional** — 2 eagle owl, multiple deer detections | Invented to demonstrate evidence-type distinctions |
| Burn-severity map | **Schematic** — canvas illustration only | Not real satellite or GIS data |
| Literature references | **Fictional** — do not cite | Invented references |
| Recovery pathways | **Illustrative** — ecologically plausible | Not evaluated in any real trial at this site |
| Legal designations | **Fictional** | Not real Natura 2000 or Spanish law designations |

### Key limitations (see also Case Overview screen)

1. **All data are synthetic** — no real field surveys have been conducted.
2. **No validated species distribution models** — presence/absence is assumed.
3. **Welfare assessments are expert inferences, not observations** — except where marked "Observation (illustrative)" (also invented).
4. **Back-to-back fire cumulative stress** is poorly understood even in real literature — uncertainty is systematically high.
5. **Missing records must NOT be interpreted as species absence** — this is stated explicitly in multiple places in the UI.
6. **Satellite imagery does NOT directly measure animal welfare or suffering** — this limitation is stated wherever remote sensing is mentioned.
7. **The tool has not been independently validated** and does not claim to improve animal welfare outcomes.

---

## 4. Ethical Design Principles Applied

### Multispecies Justice
- Welfare assessed across 6 focal species/groups including invertebrates (pollinators), which are typically excluded from fire-recovery planning.
- A dedicated Multispecies Justice screen shows who benefits, who is harmed, and whose interests are missing or underweighted.
- Soil biota and undetected species are flagged as critical omission risks.

### Value Sensitive Design
- Each recovery option explicitly shows affected stakeholders (ecological AND human), including groups with conflicting interests (conservation NGOs vs. hunting associations vs. graziers).
- Missing stakeholder groups are surfaced, not hidden.
- The expert review screen enables iterative revision and challenges to tool outputs.

### No single aggregate score
- No overall welfare score is computed or displayed. Per-species welfare is always shown disaggregated.
- This prevents a high average score concealing severe harm to a smaller, less-represented group.

### Human oversight
- The tool explicitly does not issue or execute management instructions.
- All outputs require expert review, challenge and rationale recording.
- The decision record is human-authored and must be explicitly saved/exported.

### Transparency about data quality
- Every data element shows: source label, date, confidence level, key limitations.
- Evidence type (Observation / Inference / Unknown) is distinguished and colour-coded throughout.
- A persistent red banner on every screen reinforces prototype/synthetic status.

---

## 5. Architecture Notes (for future extension)

The tool is intentionally modular:

- **Data layer**: `data/scenario.js` exports a `SCENARIO` object. Replace or augment with verified real-world data without touching UI logic.
- **Rendering layer**: `app.js` contains pure functions that consume `SCENARIO` and produce HTML. Each screen has its own render function.
- **Style layer**: `style.css` uses CSS custom properties (tokens) so the colour system can be updated globally.

To add a new verified data source:
1. Add a new entry to `SCENARIO.caseOverview.evidenceSources` with `verified: true`.
2. Update relevant species welfare assessments with `evidenceType: "Observation"` and real field-survey data.
3. Update `SCENARIO.meta.dataVersion` and `disclaimer`.

---

## 6. Limitations of This Prototype

- No map integration (no real GIS / Leaflet / Google Maps) — only a schematic canvas illustration.
- No database or authentication — expert records are lost on page refresh unless exported.
- No multi-user collaboration features.
- No version history for decision records.
- Welfare assessment framework is informal and not based on a validated animal-welfare measurement protocol.
- Recovery pathway options are illustrative only and have not been evaluated in controlled trials.
- The tool does not incorporate real-time data feeds (satellite, weather, camera trap APIs).
- Traditional ecological knowledge and Indigenous data sovereignty are mentioned as gaps but not structurally integrated.

---

*Prototype built for Ethics of AI assignment, TU/e, Quarter 1, 2026. Not for operational use.*
