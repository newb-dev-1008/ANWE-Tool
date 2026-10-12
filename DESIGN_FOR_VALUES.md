# Design for Values in ANWE 4.0

## Why this framework

ANWE uses **Design for Values (DfV)**, informed by Value Sensitive Design. It makes ethical commitments inspectable as requirements and application behaviour. See the [TU Delft introduction to the DfV matrix](https://ocw.tudelft.nl/course-lectures/5-4-1-the-design-for-values-approach/) and the [Delft Design for Values Institute](https://delftdesignforvalues.nl/what-is-design-for-values/): values shape design throughout development, and stakeholder priorities require critical assessment.

The product follows **Stakeholder concern → Ethical value → Norm → Design requirement → Feature → Evaluation**. Animal welfare and biodiversity remain central subjects. Multispecies Justice is no longer the organising framework. The previous `reports/ANWE_Multispecies_Justice_Report.pdf` is a historical artifact, not the new application report.

## Official five-value foundation

| Value | Why it matters | Norm | Design requirement |
|---|---|---|---|
| Animal welfare | Restoration affects animals using the burned habitat | Avoid unnecessary welfare harms | Show likely effects on shelter, food, movement and breeding habitat |
| Ecological recovery | Interventions should restore habitat function | Support locally appropriate recovery | Compare effects on habitat structure and regeneration |
| Transparency | Experts must justify AI recommendations | Recommendations must be explainable | Show supporting evidence and assumptions |
| Uncertainty | Ecological data vary in quality | Weak evidence must remain visible | Display evidence quality and flag the need for field validation |
| Accountability | Interventions have real ecological consequences | Humans remain responsible | Require expert approval before action |

`data/design-values.json` is the canonical foundation. The browser uses matching `data/design-values.js`; a test verifies consistency. Change both when revising the foundation. These are project requirements, not a claim that ecological outcomes have been verified.

## Stakeholders and different priorities

The main workflow prioritises restoration organisations/ecologists and landowners/managers. They need interpretable evidence, feasible choices, timing and clear responsibility. Field staff and volunteers need understandable survey requirements and disturbance precautions. These are the three primary user groups.

Secondary users have different needs: funders/donors need justified progress and spending; agencies need methods and approval requirements; researchers/data providers need attribution, reproducibility, quality and privacy. Their interests need not align. Animal interests remain explicit even though animals cannot operate the interface or participate in conventional user interviews.

The matrix lets users filter by value, inspect its purpose and focus the stakeholder discussion. Stakeholder profiles are authored project assumptions, not findings from interviews.

## Requirements, implementation and verification

| Value | Implemented behaviour | Verification | Remaining evaluation |
|---|---|---|---|
| Animal welfare | Every authored pathway covers shelter, food, movement and breeding habitat with conditional/unknown labels. AI instructions cover these dimensions. | Inspect all four dimensions per pathway, model value assessments and field checks. | Field surveys and expert evaluation of welfare reasoning. |
| Ecological recovery | Pathways address vegetation, structure, regeneration and soil/erosion. Planting is conditional. | Compare all three options; distinguish spectral measurements from recovery outcomes. | Validate habitat functions, erosion and intervention needs. |
| Transparency | Facts trace to server sources; AI selects measurement fields without supplying values. Reports include methods, dates and provenance. | Inspect IDs/field paths; tests reject invented references, measurements and missing value assessments. | Ecologist review of qualitative explanations and source relevance. |
| Uncertainty | Temporal comparison separates uncertain locations and imprecise dates; retrieval caps and sampling bias remain visible. | Check quality warnings and absent analysis; verify no disappearance/recovery inference from counts. | Observation effort, field occupancy and uncertainty calibration. |
| Accountability | Draft/deferred/reviewed states, justification and explicit confirmation for a locally reviewed decision. Editing invalidates confirmation. | Attempt reviewed saves without required information; verify rejection and retained external approval requirements. | Verified expert identity and actual permissions in a future deployment. |

Feature coverage can be assessed; it does not establish satisfaction of the ethical value in the real world. Outcome verification remains pending. No aggregate ethical score is calculated.

## Integration throughout ANWE

Each pathway includes its five-value assessment in all comparison views. Structured AI output, environmental provenance, temporal comparison, review controls and the PDF follow the same values. Privacy choices apply to PDF, JSON and text exports.

## Value conflicts

- Rapid restoration versus wildlife disturbance: check breeding and refuge use before scheduling work; justify urgent trade-offs.
- Detailed biodiversity evidence versus location privacy: retain useful aggregates while withholding species coordinates.
- Simple guidance versus uncertainty: use readable options and expandable limitations instead of an unexplained score.
- AI convenience versus accountability: retain human reasoning and approval requirements even when AI suggests an option.

Document affected interests, evidence and the decision rationale. DfV does not remove disagreement or establish a universal priority order.

## Limitations and future evaluation

This local university demonstration is not a validated restoration planner. Current occupancy, welfare effects and intervention outcomes need field evidence. The extinguishment date is unverified; later records can reflect the separate July fire. GBIF observation differences are not population change. Reference validation does not prove qualitative ecological truth.

Evaluate with ecologists, animal-welfare experts, managers and field staff: can they trace requirements, recognise conflicts, challenge assumptions and record defensible decisions? Add field baselines, expert/permission verification and long-term monitoring before operational use.
