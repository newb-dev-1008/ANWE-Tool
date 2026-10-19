/* Generated from design-values.json; keep both versions consistent. */
const DFV = {
  "framework": "Design for Values",
  "informedBy": "Value Sensitive Design",
  "values": [
    {
      "id": "animal-welfare",
      "value": "Animal welfare",
      "meaning": "Consider individual animals and their habitat needs, including less visible groups.",
      "why": "Restoration affects animals using the burned habitat",
      "concern": "Restoration organisations and field staff may unintentionally disturb shelter, feeding, movement or breeding.",
      "norm": "Avoid unnecessary welfare harms",
      "requirement": "Show likely effects on shelter, food, movement and breeding habitat",
      "feature": "Four explicit welfare dimensions in each pathway and AI assessment",
      "evaluation": "Check all four dimensions are assessed as conditional hypotheses or explicitly unknown; verify with field surveys.",
      "dimensions": [
        "Shelter",
        "Food",
        "Movement",
        "Breeding habitat"
      ]
    },
    {
      "id": "ecological-recovery",
      "value": "Ecological recovery",
      "meaning": "Restore locally appropriate habitat functions without assuming more intervention is better.",
      "why": "Interventions should restore habitat function",
      "concern": "Land managers need locally suitable regeneration, habitat structure and erosion responses.",
      "norm": "Support locally appropriate recovery",
      "requirement": "Compare effects on habitat structure and regeneration",
      "feature": "Three restoration options, spectral evidence and field checks",
      "evaluation": "Check vegetation, structure, regeneration and soil/erosion needs; do not interpret NDVI as ecosystem recovery by itself.",
      "dimensions": [
        "Vegetation recovery",
        "Habitat structure",
        "Regeneration",
        "Soil and erosion concerns"
      ]
    },
    {
      "id": "transparency",
      "value": "Transparency",
      "meaning": "Make evidence, methods and assumptions inspectable.",
      "why": "Experts must justify AI recommendations",
      "concern": "Ecologists, agencies and funders cannot independently evaluate unsupported explanations.",
      "norm": "Recommendations must be explainable",
      "requirement": "Show supporting evidence and assumptions",
      "feature": "Source-linked factual panels, structured evidence fields and report methodology",
      "evaluation": "Trace each factual AI item to a server-owned source field; inspect methods, assumptions and licences.",
      "dimensions": [
        "Supporting data",
        "Assumptions",
        "Methodology",
        "Evidence provenance"
      ]
    },
    {
      "id": "uncertainty",
      "value": "Uncertainty",
      "meaning": "Keep missing data and the limits of inference visible.",
      "why": "Ecological data vary in quality",
      "concern": "Landowners need usable guidance while researchers need sampling biases and unknown impacts disclosed.",
      "norm": "Weak evidence must remain visible",
      "requirement": "Display evidence quality and flag the need for field validation",
      "feature": "Unknown labels, GBIF coverage warnings, uncertainty and survey requirements",
      "evaluation": "Check incomplete sampling, dates, spatial uncertainty and absent evidence are flagged; no absence or recovery claims from occurrence counts.",
      "dimensions": [
        "Evidence availability",
        "Data limitations",
        "Unknown impacts",
        "Required field validation"
      ]
    },
    {
      "id": "accountability",
      "value": "Accountability",
      "meaning": "Humans must review and justify decisions; an AI draft cannot grant authority.",
      "why": "Interventions have real ecological consequences",
      "concern": "Organisations, managers and public agencies need a clear responsibility and approval trail.",
      "norm": "Humans remain responsible",
      "requirement": "Require expert approval before action",
      "feature": "Explicit review status, decision justification and approval checklist; no execution capability",
      "evaluation": "Block a locally recorded reviewed decision unless reviewer, rationale, preferred option and confirmation exist; always retain external approval requirements.",
      "dimensions": [
        "Expert review status",
        "Reviewer justification",
        "Pending decisions",
        "Further approval necessary"
      ]
    }
  ],
  "stakeholders": [
    {
      "group": "Restoration organisations and ecologists",
      "tier": "Primary",
      "needs": "Traceable evidence, animal welfare checks and defensible recovery options."
    },
    {
      "group": "Landowners and land managers",
      "tier": "Primary",
      "needs": "Feasible decisions, timing, habitat function and explicit responsibilities."
    },
    {
      "group": "Field staff and volunteers",
      "tier": "Primary",
      "needs": "Understandable survey requirements, disturbance precautions and escalation."
    },
    {
      "group": "Funders and donors",
      "tier": "Secondary",
      "needs": "Transparent progress and justified spending without oversimplified outcome scores."
    },
    {
      "group": "Public environmental agencies",
      "tier": "Secondary",
      "needs": "Methodology, approval requirements and accountable human decisions."
    },
    {
      "group": "Researchers and ecological data providers",
      "tier": "Secondary",
      "needs": "Attribution, data quality, privacy and reproducible comparisons."
    }
  ],
  "tensions": [
    "Forestry income versus animal habitat resources: investigate selective timber removal and deadwood retention; do not assume local occupancy.",
    "Human access and livelihoods versus breeding disturbance: justify any spatial or temporary restrictions using evidence and alternatives.",
    "Urgent human protection versus animal disturbance: document credible risk, necessity, mitigation and proportionality.",
    "Rapid restoration versus avoiding wildlife disturbance: investigate breeding and refuge use before scheduling work.",
    "Detailed biodiversity evidence versus protecting sensitive locations: retain aggregate evidence while withholding coordinates.",
    "Simple recommendations versus communicating uncertainty: provide concise options and expandable limitations, not a single ethical score.",
    "AI convenience versus expert accountability: retain human justification and approval requirements even when a model suggests an option."
  ],
  "ethicalPosition": {
    "title": "Animal-focused ethics with a modest welfare priority",
    "foundation": "Sentient animals have welfare interests that matter independently of their usefulness to humans. Human restoration decisions create responsibilities to consider those interests. Ecological recovery matters, but vegetation or biodiversity gains do not by themselves establish better individual welfare.",
    "justification": "This animal-welfare project gives animal interests modest additional consideration because animals bear consequences without representing themselves in land-use decisions. This is a stated normative commitment, not a conclusion measured by the ecological data.",
    "decisionRule": "When feasible options remain closely balanced after considering evidence, severity, likelihood, duration, reversibility and affected interests, favour the option with lower credible risk of animal harm. Do not assign a numerical ethical score or automatically select a pathway.",
    "limits": "Human safety, essential livelihoods and other serious human needs require explicit consideration. A credible urgent threat can justify proportionate intervention with mitigation and monitoring. Commercial convenience alone is not sufficient to dismiss credible severe avoidable animal harm. Neither animals nor humans always win.",
    "uncertainty": "Missing observations do not establish absence or harm. Consider plausible animal risks cautiously without inventing occupancy, sentience or suffering. Prefer reversible measures, proportionate surveys or deferral when safe; uncertainty must not prevent necessary urgent protective action.",
    "reviewPrompt": "Record the human objective, affected animal interests, possible conflict, less harmful alternatives, missing evidence, safeguards, monitoring and reasons for the decision. If animal interests are outweighed, explain necessity and proportionality.",
    "evidenceStatus": "Authored ethical position and investigation prompts; local effects and outcomes remain unverified.",
    "references": [
      {
        "title": "Palmer (2010), Animal Ethics in Context",
        "url": "https://cup.columbia.edu/book/animal-ethics-in-context/9780231503020/"
      },
      {
        "title": "Jamieson (1998), Animal Liberation is an Environmental Ethic",
        "url": "https://doi.org/10.3197/096327198129341465"
      },
      {
        "title": "Capozzelli, Hecht and Halsey (2020), What is the value of wild animal welfare for restoration ecology?",
        "url": "https://doi.org/10.1111/rec.13114"
      }
    ]
  },
  "tradeoffProfiles": {
    "opt-A": {
      "humanObjective": "Limit expenditure and disturbance while meeting access, livelihood and safety needs.",
      "animalInterests": "Retain occupied cover, deadwood resources and movement routes where field evidence supports their use.",
      "conflict": "Delaying work may retain habitat but can conflict with verified erosion, access or safety needs.",
      "alternatives": "Compare monitoring and restricted work areas with selective, low-disturbance action where necessary.",
      "missingEvidence": "Current animal use, regeneration capacity, erosion and the location and urgency of human risks are unknown.",
      "safeguards": "Define survey triggers, proportionate monitoring and conditions that would justify targeted action."
    },
    "opt-B": {
      "humanObjective": "Address a verified local problem while managing costs, access and forestry needs.",
      "animalInterests": "Protect refuges, food resources, movement and breeding during targeted work.",
      "conflict": "Deadwood removal or temporary access restrictions may affect habitat resources or impose costs on land users.",
      "alternatives": "Investigate selective deadwood retention, smaller work areas and timing around verified animal use.",
      "missingEvidence": "Local habitat use, breeding timing, severity of the management problem and livelihood costs need checking.",
      "safeguards": "Record retained refuges, disturbance limits, access arrangements and stop-work triggers."
    },
    "opt-C": {
      "humanObjective": "Restore a verified missing habitat function while considering budgets, deadlines and essential human needs.",
      "animalInterests": "Avoid unnecessary displacement, injury and loss of open habitat, cover or breeding resources.",
      "conflict": "Rapid planting, timber recovery or machinery may satisfy management objectives while disturbing animals using the site.",
      "alternatives": "Compare natural regeneration, phased work, smaller machinery footprints and retention of habitat mosaics.",
      "missingEvidence": "Intervention necessity, current animal use, less harmful options and costs of delay remain unverified.",
      "safeguards": "Require justified scope and timing, refuge protection, monitoring and proportionate stopping criteria."
    }
  }
};
if (typeof module !== "undefined") module.exports = DFV;
