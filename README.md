# ANWE — Animal Welfare & Ecosystem Restoration

An academic decision-support prototype for post-wildfire restoration in Spain. Environmental assessments, wildfire shapes and species examples are demonstrations, not verified evidence. Human reviewers compare choices; the application never selects or authorises an intervention.

## Install and run

No installation or build step is required. From this directory:

```sh
python -m http.server 8080
```

Open http://localhost:8080. Opening `index.html` directly also works, but browser storage behaviour can differ. Leaflet 1.9.4 is bundled under `vendor/` with its licence. Internet access is needed only for OpenStreetMap reference tiles; assessments and demonstration geometry work without them. Use the selection button if the map library is unavailable.

## Demonstration workflow

1. Explore Spain using the map; select the fictional Sierra Morena area north of Córdoba with the marker, polygon or selection button.
2. Toggle the severity, vegetation and refuge demonstration overlays. Read the legend, creation date and limitations. No imagery-derived indices are calculated.
3. Open animal welfare to explore six hypothetical species/groups and their food, water, shelter, breeding and movement concerns.
4. Compare natural regeneration, assisted ecological restoration and active habitat restoration using the existing side-by-side, stacked and species views. Review risks, inappropriate situations and evidence gaps.
5. Open expert review. Record reviewer, date, preferred option or an undecided assessment, rationale, challenged assumptions, overrides, unresolved risks and supporting evidence. Include reasons for rejecting alternatives.
6. Save locally. Reloading restores the last saved expert record in the same browser/origin. Clear Record removes it after confirmation.
7. View the restoration summary and download plain text, or export JSON containing the human assessment, demonstration geography, sources and alternatives. Export includes current unsaved edits; these are identified as a draft/local record, never approval.

The original schematic, multispecies justice analysis and editable ethics checklist remain available. Checklist edits are session-only and included in JSON export.

## Architecture and checks

- `index.html`, `style.css`, `app.js`: existing screens, rendering and interactions.
- `workspace.js`: geographic selection, local review storage and summary.
- `data/scenario.js`: authored demonstration case and qualitative assessments.
- `data/geography.js`: hand-drawn WGS84 teaching polygons with provenance.
- `data/providers.js`: planned-provider catalogue and adapter registration/loading contract. No environmental service is connected.
- `vendor/`: pinned Leaflet assets; attribution remains visible.

Run `node --test tests/*.test.cjs` for provider, geometry, rendering, local save/restore and report checks. `TEST_CHECKLIST.md` provides historical manual review checks; see the updated workflow section there.

## Current limitations

One fictional case; no actual imagery, spatial habitat inference, verified observations, authentication, qualified-user verification, backend storage or AI model. Reference map tiles are not scientific evidence. A regional species example does not establish occupancy. Local storage can be unavailable or cleared and is not an audit database. Use export to retain a copy; avoid entering sensitive personal information. Public tile requests expose usual network metadata to the tile provider. No real land management should rely on this teaching prototype.

See `DATA_SOURCES.md`, `ETHICS_AND_LIMITATIONS.md` and `FUTURE_ROADMAP.md`.
