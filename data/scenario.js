/**
 * ⚠️ SYNTHETIC / ILLUSTRATIVE DATA — NOT VERIFIED
 * All locations, species records, fire statistics, ecological assessments and citations
 * in this file are FICTIONAL and produced for prototype demonstration only.
 * They do NOT represent real field surveys, government data or peer-reviewed findings.
 * Do NOT use for real land-management decisions.
 *
 * Data provenance: Generated for the "Animal-Centred Wildfire Recovery Decision Support"
 * prototype (Ethics of AI assignment, TU/e, 2026). See README.md for full limitations.
 */

const SCENARIO = {
  meta: {
    id: "sierra-morena-fictional-2024",
    label: "Sierra Morena Compounding Fires — FICTIONAL ILLUSTRATIVE SCENARIO",
    status: "ILLUSTRATIVE — NOT VERIFIED",
    jurisdiction: "Fictional region inspired by Andalusia, southern Spain (EU jurisdiction assumed)",
    createdDate: "2026-10-10",
    dataVersion: "0.1-prototype",
    disclaimer:
      "All data in this scenario is synthetic and illustrative. Species records, fire extents, " +
      "welfare assessments and recovery options are invented for demonstration. They do not " +
      "represent real survey data, official government records or validated ecological findings. " +
      "Missing records must NOT be interpreted as proof of species absence.",
  },

  caseOverview: {
    title: "Sierra Morena Compounding Fires 2022–2023",
    description:
      "Two consecutive wildfire seasons (summer 2022 and summer 2023) have burned approximately " +
      "an unmeasured demonstration area of Mediterranean shrubland, montane woodland and riparian corridor across a " +
      "fictional protected area in southern Spain. The back-to-back fires prevented full " +
      "post-fire recovery between seasons, disrupting succession dynamics and fragmenting " +
      "habitat patches critical to several threatened species.",
    fireScenario: {
      type: "Multi-season compounding fires",
      seasons: ["Summer 2022", "Summer 2023"],
      estimatedExtent_ha: null,
      severity: "Mixed — high-severity crown fire patches interspersed with moderate surface fire",
      returnInterval: "Fictional consecutive summer fire seasons; historic return interval not assessed",
      note: "⚠️ ILLUSTRATIVE — extent and severity are fictional estimates",
    },
    habitat: {
      primary: "Mediterranean shrubland (maquis/garrigue)",
      secondary: ["Montane mixed woodland (oak, pine)", "Riparian gallery forest", "Rocky outcrops"],
      note: "⚠️ ILLUSTRATIVE — habitat classification not based on real GIS data",
    },
    evidenceSources: [
      {
        id: "src-1",
        type: "Remote sensing",
        label: "Fictional satellite burn-severity map",
        date: "2023-09-01",
        confidence: "Low",
        limitations:
          "Synthetic mosaic. Satellite imagery shows vegetation loss, NOT animal presence or welfare. " +
          "Do NOT interpret vegetation indices as direct measures of animal suffering.",
        verified: false,
      },
      {
        id: "src-2",
        type: "Field survey",
        label: "Fictional camera-trap survey (12 sites, Oct–Nov 2023)",
        date: "2023-11-30",
        confidence: "Very low — prototype only",
        limitations: "12 camera-trap sites are insufficient for robust population estimates. Absence of records does NOT confirm species absence.",
        verified: false,
      },
      {
        id: "src-3",
        type: "Literature",
        label: "Unvalidated teaching narrative — no literature citation",
        date: "2024-01",
        confidence: "Not assessed — demonstration only",
        limitations: "No supporting published evidence is attached. Do not cite this narrative as research.",
        verified: false,
      },
    ],
    keyLimitations: [
      "All data are synthetic — no real field surveys have been conducted for this prototype.",
      "Species distribution models have NOT been run; presence/absence is assumed for demonstration.",
      "Legal designations (e.g., Natura 2000 status) are fictional.",
      "Cumulative stress from back-to-back fires is poorly understood in this region; uncertainty is high.",
      "Sensitive species location data is displayed only at coarse resolution to protect populations.",
    ],
  },

  focalSpecies: [
    {
      id: "sp-lynx",
      commonName: "Iberian Lynx",
      scientificName: "Lynx pardinus",
      protectionStatus: "Legal and conservation status not assessed for this site",
      guild: "Large carnivore",
      sensitivityToFire: "High",
      mobilityPotential: "Moderate — territorial, requires large home ranges",
      emoji: "🐆",
      welfareContext: {
        food: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Primary prey (European rabbit) populations likely collapsed after back-to-back fires destroyed warren habitat and herbaceous cover. Lynx may face acute starvation risk, particularly juveniles dispersing from natal territories.", uncertainty: "High — no direct prey-count data available", knowledgeGap: "No post-fire rabbit surveys conducted" },
        water: { status: "MODERATE CONCERN", evidenceType: "Inference", detail: "Riparian corridors partially burned. Temporary streams may have increased sedimentation limiting access.", uncertainty: "Moderate", knowledgeGap: "Water-quality and flow data not available" },
        shelter: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Dense scrub used for denning and stalking cover severely reduced. Breeding females with cubs particularly at risk.", uncertainty: "Moderate", knowledgeGap: "Den-site locations not mapped" },
        breeding: { status: "HIGH CONCERN", evidenceType: "Unknown", detail: "Breeding season overlap with second fire unknown. Cub mortality during 2023 fire not assessed.", uncertainty: "Very high", knowledgeGap: "No reproductive monitoring data" },
        movement: { status: "MODERATE CONCERN", evidenceType: "Inference", detail: "Fire refugia may act as movement corridors but road crossings in unburned areas may increase mortality risk as animals shift range.", uncertainty: "Moderate", knowledgeGap: "GPS collar data not available" },
      },
      note: "⚠️ ILLUSTRATIVE",
    },
    {
      id: "sp-eagle",
      commonName: "Bonelli's Eagle",
      scientificName: "Aquila fasciata",
      protectionStatus: "Legal and conservation status not assessed for this site",
      guild: "Raptors",
      sensitivityToFire: "Moderate (adults resilient; nest sites vulnerable)",
      mobilityPotential: "High — can relocate foraging areas",
      emoji: "🦅",
      welfareContext: {
        food: { status: "MODERATE CONCERN", evidenceType: "Inference", detail: "Open burned areas may temporarily increase prey visibility but medium-term prey collapse likely.", uncertainty: "Moderate", knowledgeGap: "Prey availability not measured" },
        water: { status: "LOW CONCERN", evidenceType: "Inference", detail: "Raptors derive most water from prey; direct water access less critical.", uncertainty: "Low", knowledgeGap: "None identified" },
        shelter: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Nest disturbance and loss of nearby cover require field assessment; cliff nesting does not establish that nests survived.", uncertainty: "Moderate", knowledgeGap: "Nest-site surveys not conducted" },
        breeding: { status: "HIGH CONCERN", evidenceType: "Unknown", detail: "Overlap between nesting and fictional summer fires is not established. Nest abandonment or chick mortality not assessed.", uncertainty: "Very high", knowledgeGap: "No breeding-success monitoring" },
        movement: { status: "LOW CONCERN", evidenceType: "Observation (illustrative camera trap)", detail: "Hypothetical raptor movement through unburned patches; no camera-trap detection is claimed.", uncertainty: "High — 2 detections insufficient", knowledgeGap: "Foraging-range shifts not tracked" },
      },
      note: "⚠️ ILLUSTRATIVE",
    },
    {
      id: "sp-lizard",
      commonName: "Ocellated Lizard",
      scientificName: "Timon lepidus",
      protectionStatus: "Legal and conservation status not assessed for this site",
      guild: "Reptile — ground-dweller",
      sensitivityToFire: "Unknown at this site; juveniles and sheltered individuals may be vulnerable",
      mobilityPotential: "Site-specific escape capacity not assessed",
      emoji: "🦎",
      welfareContext: {
        food: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Loss of invertebrate prey and foraging cover could affect lizards; no prey abundance or recovery rate is measured.", uncertainty: "Moderate", knowledgeGap: "Vegetation recovery rates not measured at this site" },
        water: { status: "MODERATE CONCERN", evidenceType: "Inference", detail: "Loss of shade and changes in prey availability may increase dehydration risk; local microclimate and water access are unknown.", uncertainty: "Moderate", knowledgeGap: "Microclimate data not available" },
        shelter: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Scrub cover used for thermoregulation and predator avoidance lost. Exposed lizards face increased predation and thermal stress.", uncertainty: "Moderate", knowledgeGap: "Thermal refugia mapping not done" },
        breeding: { status: "HIGH CONCERN", evidenceType: "Unknown", detail: "Nest sites (buried eggs) may have been destroyed by fire heat. Hatchling survival in denuded landscape unknown.", uncertainty: "Very high", knowledgeGap: "No nest-site surveys" },
        movement: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Habitat fragmentation may constrain movement between refugia. No mortality or dispersal measurements are available.", uncertainty: "Moderate", knowledgeGap: "Mortality estimates not available" },
      },
      note: "⚠️ ILLUSTRATIVE",
    },
    {
      id: "sp-toad",
      commonName: "Iberian Midwife Toad",
      scientificName: "Alytes cisternasii",
      protectionStatus: "Legal and conservation status not assessed for this site",
      guild: "Amphibian",
      sensitivityToFire: "High (aquatic larval stage; adults vulnerable to desiccation)",
      mobilityPotential: "Very Low",
      emoji: "🐸",
      welfareContext: {
        food: { status: "MODERATE CONCERN", evidenceType: "Inference", detail: "Invertebrate prey reduced post-fire. Recovery rate is unknown without monitoring.", uncertainty: "Moderate", knowledgeGap: "Invertebrate surveys not available" },
        water: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Increased post-fire runoff and ash loading may cause eutrophication or toxicity in breeding pools. Loss of riparian shade increases water temperature.", uncertainty: "High", knowledgeGap: "Water quality data not collected" },
        shelter: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Damp microhabitats under rocks and leaf litter destroyed. Adults require moist refugia.", uncertainty: "Moderate", knowledgeGap: "Microhabitat surveys not done" },
        breeding: { status: "HIGH CONCERN", evidenceType: "Unknown", detail: "Breeding pools may have been altered by fire debris and elevated water temperatures. Larval survival unknown.", uncertainty: "Very high", knowledgeGap: "No post-fire breeding surveys" },
        movement: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Extremely limited dispersal ability — populations effectively isolated if habitat connectivity broken.", uncertainty: "Moderate", knowledgeGap: "Population connectivity not assessed" },
      },
      note: "⚠️ ILLUSTRATIVE",
    },
    {
      id: "sp-deer",
      commonName: "Red Deer",
      scientificName: "Cervus elaphus",
      protectionStatus: "Legal and conservation status not assessed for this site",
      guild: "Large herbivore",
      sensitivityToFire: "Low–Moderate (mobile, can escape fire)",
      mobilityPotential: "High",
      emoji: "🦌",
      welfareContext: {
        food: { status: "MODERATE CONCERN", evidenceType: "Inference", detail: "Post-fire green flush may temporarily concentrate deer in burned areas, but nutritional quality and quantity over winter unclear.", uncertainty: "Moderate", knowledgeGap: "Nutritional surveys not available" },
        water: { status: "LOW CONCERN", evidenceType: "Inference", detail: "Large home ranges allow access to unburned water sources.", uncertainty: "Low", knowledgeGap: "None identified" },
        shelter: { status: "LOW CONCERN", evidenceType: "Inference", detail: "Mature forest patches remain as refugia in unburned areas.", uncertainty: "Low", knowledgeGap: "None identified" },
        breeding: { status: "LOW CONCERN", evidenceType: "Inference", detail: "Rutting season occurs in unburned areas; calving in spring may benefit from vegetation flush.", uncertainty: "Moderate", knowledgeGap: "No reproductive monitoring" },
        movement: { status: "LOW CONCERN", evidenceType: "Observation (illustrative)", detail: "Multiple camera-trap detections in burned and adjacent unburned areas (illustrative records).", uncertainty: "Moderate", knowledgeGap: "Movement corridors not GPS-tracked" },
      },
      note: "⚠️ ILLUSTRATIVE",
    },
    {
      id: "sp-pollinators",
      commonName: "Pollinators (Bees & Butterflies)",
      scientificName: "Various — Apis mellifera, Anthophora spp., Papilio machaon (illustrative)",
      protectionStatus: "Legal and conservation status not assessed for this site",
      guild: "Invertebrates",
      sensitivityToFire: "High (hive/colony destruction; larval stage immobile)",
      mobilityPotential: "Moderate (adults mobile; colonies immobile)",
      emoji: "🐝",
      welfareContext: {
        food: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Flowering plant communities destroyed. Forage availability near zero in burned areas; nectar and pollen sources may remain in refugia.", uncertainty: "Moderate", knowledgeGap: "Pollinator community surveys not conducted" },
        water: { status: "MODERATE CONCERN", evidenceType: "Inference", detail: "Water sources used by bees may have elevated ash content post-fire.", uncertainty: "High", knowledgeGap: "No data" },
        shelter: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Ground-nesting bee colonies and butterfly pupae sites likely destroyed across burned areas.", uncertainty: "Moderate", knowledgeGap: "Colony surveys not done" },
        breeding: { status: "HIGH CONCERN", evidenceType: "Unknown", detail: "Colony survival and recolonisation rates from refugia unknown. Some butterfly species require specific host plants now absent.", uncertainty: "Very high", knowledgeGap: "No monitoring data" },
        movement: { status: "MODERATE CONCERN", evidenceType: "Inference", detail: "Flight-capable adults can access refugia but foraging distances are limited. Large burned patches may exceed effective foraging range.", uncertainty: "Moderate", knowledgeGap: "Foraging-range surveys not done" },
      },
      note: "⚠️ ILLUSTRATIVE — invertebrate welfare is often omitted from conservation planning; including them here reflects Multispecies Justice principles",
    },
  ],

  recoveryPathways: [
  {
    "timeframe": "Unknown — requires baseline surveys and repeated monitoring",
    "cost": "Not estimated",
    "evidence": {
      "strength": "Unvalidated demonstration; no site-specific supporting evidence",
      "sources": [
        "src-1"
      ],
      "keyUncertainties": [
        "Current occupancy, welfare and habitat condition are unknown",
        "Effects depend on drought, soil, timing and local recovery"
      ]
    },
    "fieldChecksNeeded": [
      "Survey vegetation recovery and erosion",
      "Investigate food, shelter, water and habitat connectivity",
      "Include invertebrates, juvenile animals and undetected species"
    ],
    "missingStakeholders": [
      "Soil biota and undetected species",
      "Local land users whose views have not been collected"
    ],
    "id": "opt-A",
    "name": "Natural regeneration",
    "shortLabel": "Natural regeneration",
    "color": "#58a6ff",
    "managementIntensity": "Low",
    "description": "Protect existing recovery processes and monitor vegetation and wildlife. Avoid soil disturbance; no routine planting, feeding or water provisioning.",
    "potentialBenefits": [
      "May retain locally adapted vegetation and surviving refugia",
      "May avoid machinery disturbance to animals and soil organisms"
    ],
    "potentialHarms": [
      "May leave erosion or habitat loss unresolved where recovery is insufficient",
      "Acute welfare concerns may require a separate qualified assessment"
    ],
    "inappropriate": "May be inappropriate where field evidence shows severe erosion, failed regeneration or invasive dominance.",
    "reviewRequired": "Qualified ecological and animal welfare review before intervention. Check landowner consent and applicable authority permissions; no approval is issued here.",
    "ethicsFlags": [
      "Benefits are conditional hypotheses, not measured impacts",
      "No aggregate welfare score or automatic strategy selection"
    ],
    "affectedStakeholders": [
      {
        "group": "Iberian Lynx",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Bonelli's Eagle",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Ocellated Lizard",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Iberian Midwife Toad",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Red Deer",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Pollinators",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      }
    ]
  },
  {
    "timeframe": "Unknown — requires baseline surveys and repeated monitoring",
    "cost": "Not estimated",
    "evidence": {
      "strength": "Unvalidated demonstration; no site-specific supporting evidence",
      "sources": [
        "src-1"
      ],
      "keyUncertainties": [
        "Current occupancy, welfare and habitat condition are unknown",
        "Effects depend on drought, soil, timing and local recovery"
      ]
    },
    "fieldChecksNeeded": [
      "Survey vegetation recovery and erosion",
      "Investigate food, shelter, water and habitat connectivity",
      "Include invertebrates, juvenile animals and undetected species"
    ],
    "missingStakeholders": [
      "Soil biota and undetected species",
      "Local land users whose views have not been collected"
    ],
    "id": "opt-B",
    "name": "Assisted ecological restoration",
    "shortLabel": "Assisted ecological restoration",
    "color": "#4ade80",
    "managementIntensity": "Targeted",
    "description": "Consider targeted erosion control and habitat protection only where field evidence supports them. Native planting is one possible measure if regeneration is inadequate; it is not a default.",
    "potentialBenefits": [
      "Targeted erosion control may protect aquatic habitat",
      "Protecting refuge patches may preserve shelter and movement routes"
    ],
    "potentialHarms": [
      "Ground works can harm soil biota and nesting animals",
      "Planting may fail under drought; barriers may obstruct wildlife"
    ],
    "inappropriate": "May be inappropriate where recovery is already adequate or disturbance costs exceed expected benefits.",
    "reviewRequired": "Qualified ecological and animal welfare review before intervention. Check landowner consent and applicable authority permissions; no approval is issued here.",
    "ethicsFlags": [
      "Benefits are conditional hypotheses, not measured impacts",
      "No aggregate welfare score or automatic strategy selection"
    ],
    "affectedStakeholders": [
      {
        "group": "Iberian Lynx",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Bonelli's Eagle",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Ocellated Lizard",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Iberian Midwife Toad",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Red Deer",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Pollinators",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      }
    ]
  },
  {
    "timeframe": "Unknown — requires baseline surveys and repeated monitoring",
    "cost": "Not estimated",
    "evidence": {
      "strength": "Unvalidated demonstration; no site-specific supporting evidence",
      "sources": [
        "src-1"
      ],
      "keyUncertainties": [
        "Current occupancy, welfare and habitat condition are unknown",
        "Effects depend on drought, soil, timing and local recovery"
      ]
    },
    "fieldChecksNeeded": [
      "Survey vegetation recovery and erosion",
      "Investigate food, shelter, water and habitat connectivity",
      "Include invertebrates, juvenile animals and undetected species"
    ],
    "missingStakeholders": [
      "Soil biota and undetected species",
      "Local land users whose views have not been collected"
    ],
    "id": "opt-C",
    "name": "Active habitat restoration",
    "shortLabel": "Active habitat restoration",
    "color": "#c084fc",
    "managementIntensity": "Higher",
    "description": "Evaluate more extensive habitat work only if surveys demonstrate a need. Compare measures against natural recovery; agree timing, monitoring and stopping criteria with qualified ecologists.",
    "potentialBenefits": [
      "May restore connectivity where severe fragmentation is demonstrated",
      "Could address persistent habitat loss when lighter measures are insufficient"
    ],
    "potentialHarms": [
      "Machinery and clearing may damage refugia and less visible animals",
      "Species introductions, feeding or water provisioning create separate disease and welfare risks and are not prescribed here"
    ],
    "inappropriate": "May be inappropriate without evidence that lighter interventions are insufficient or where sensitive breeding habitat would be disturbed.",
    "reviewRequired": "Qualified ecological and animal welfare review before intervention. Check landowner consent and applicable authority permissions; no approval is issued here.",
    "ethicsFlags": [
      "Benefits are conditional hypotheses, not measured impacts",
      "No aggregate welfare score or automatic strategy selection"
    ],
    "affectedStakeholders": [
      {
        "group": "Iberian Lynx",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Bonelli's Eagle",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Ocellated Lizard",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Iberian Midwife Toad",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Red Deer",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      },
      {
        "group": "Pollinators",
        "welfare": "UNCERTAIN — site evidence required",
        "notes": "Assess food, water, shelter, breeding and movement before selecting measures."
      }
    ]
  }
],

  multispieciesJustice: {
    description: "Multispecies Justice analysis asks: who benefits, who is harmed, and whose interests are absent or underweighted?",
    analysis: [
      { group: "Iberian Lynx", representation: "High (charismatic flagship)", riskOfHarm: "High", riskOfOmission: "Low" },
      { group: "Ocellated Lizard", representation: "Moderate", riskOfHarm: "Very High (very limited escape capacity)", riskOfOmission: "Moderate" },
      { group: "Iberian Midwife Toad", representation: "Low — aquatic stage invisible in standard surveys", riskOfHarm: "High", riskOfOmission: "HIGH — amphibians systematically underrepresented" },
      { group: "Pollinators", representation: "Very Low — often entirely omitted", riskOfHarm: "High", riskOfOmission: "VERY HIGH — almost never included in fire-recovery plans" },
      { group: "Raptors", representation: "High", riskOfHarm: "Moderate", riskOfOmission: "Low" },
      { group: "Red Deer", representation: "Moderate–High (economic advocates)", riskOfHarm: "Low–Moderate", riskOfOmission: "Low" },
      { group: "Soil biota / decomposers", representation: "Very Low — absent from all options", riskOfHarm: "High (fire + soil disturbance)", riskOfOmission: "VERY HIGH — systematically invisible" },
      { group: "Future / undetected species", representation: "None — absence of records ≠ absence of species", riskOfHarm: "Unknown", riskOfOmission: "CRITICAL — biodiversity gap" },
    ],
  },

  evaluationChecklist: [
    { id: "chk-1", category: "Evidence Traceability", item: "Every data point displayed has a labelled source, date, confidence level and limitations statement", passed: true, notes: "All data in prototype labelled as ILLUSTRATIVE with source metadata" },
    { id: "chk-2", category: "Evidence Traceability", item: "No real-world citations have been invented or misrepresented", passed: true, notes: "All references explicitly labelled as fictional" },
    { id: "chk-3", category: "Uncertainty", item: "Confidence and uncertainty levels are displayed for all welfare assessments", passed: true, notes: "Each welfare domain shows uncertainty rating and knowledge gap" },
    { id: "chk-4", category: "Uncertainty", item: "Missing records are not interpreted as species absence", passed: true, notes: "Explicit disclaimer shown in case overview and species cards" },
    { id: "chk-5", category: "Uncertainty", item: "Satellite imagery is not claimed to directly measure animal welfare", passed: true, notes: "Remote sensing source explicitly states this limitation" },
    { id: "chk-6", category: "Species Representation", item: "Invertebrate / pollinator welfare is assessed and included", passed: true, notes: "Pollinators included as focal group; flagged as systemically underrepresented" },
    { id: "chk-7", category: "Species Representation", item: "Multispecies Justice analysis identifies whose interests are missing", passed: true, notes: "Soil biota, undetected species and traditional knowledge holders flagged as gaps" },
    { id: "chk-8", category: "Species Representation", item: "No single overall score conceals severe harm to a smaller group", passed: true, notes: "Per-species welfare shown disaggregated; no aggregate score used" },
    { id: "chk-9", category: "Human Oversight", item: "The tool does not automatically issue or execute management instructions", passed: true, notes: "All outputs labelled as decision support; expert review screen required" },
    { id: "chk-10", category: "Human Oversight", item: "Experts can challenge, override and record disagreements with tool outputs", passed: true, notes: "Expert review screen includes challenge fields and rationale recording" },
    { id: "chk-11", category: "Misleading Recommendations", item: "The tool does not claim to have been validated or to improve animal welfare", passed: true, notes: "Disclaimer shown on all screens; tool described as prototype only" },
    { id: "chk-12", category: "Misleading Recommendations", item: "Sensitive species location data is protected (coarse resolution only)", passed: true, notes: "No precise GPS coordinates shown; illustrative map only at catchment scale" },
  ],
};

if (typeof module !== "undefined") module.exports = SCENARIO;

SCENARIO.meta.dataVersion = "0.2-prototype";
SCENARIO.focalSpecies.forEach(species => {
  species.evidenceKind = "demonstration";
  species.note = "Hypothetical demonstration example; regional plausibility is not verified site occupancy. No real observation supplied.";
  Object.values(species.welfareContext).forEach(domain => {
    domain.evidenceType = "Demonstration hypothesis";
    domain.uncertainty = "High — no site-specific evidence";
    domain.detail = "Hypothetical concern, not an observed impact: " + domain.detail;
  });
});
