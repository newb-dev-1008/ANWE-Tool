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
      "18 000 ha of Mediterranean shrubland, montane woodland and riparian corridor across a " +
      "fictional protected area in southern Spain. The back-to-back fires prevented full " +
      "post-fire recovery between seasons, disrupting succession dynamics and fragmenting " +
      "habitat patches critical to several threatened species.",
    fireScenario: {
      type: "Multi-season compounding fires",
      seasons: ["Summer 2022", "Summer 2023"],
      estimatedExtent_ha: 18000,
      severity: "Mixed — high-severity crown fire patches interspersed with moderate surface fire",
      returnInterval: "Historic 30-year return interval broken; second fire occurred 11 months after first",
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
        label: "Illustrative literature summary (fictional references)",
        date: "2024-01",
        confidence: "Moderate for general ecological principles, None for site-specific claims",
        limitations: "References are invented. Do not cite in real work.",
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
      protectionStatus: "FICTIONAL — Critically Endangered (illustrative)",
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
      commonName: "Bonelli's Eagle / Eagle Owl",
      scientificName: "Aquila fasciata / Bubo bubo",
      protectionStatus: "FICTIONAL — Strictly Protected (illustrative EU Birds Directive)",
      guild: "Raptors",
      sensitivityToFire: "Moderate (adults resilient; nest sites vulnerable)",
      mobilityPotential: "High — can relocate foraging areas",
      emoji: "🦅",
      welfareContext: {
        food: { status: "MODERATE CONCERN", evidenceType: "Inference", detail: "Open burned areas may temporarily increase prey visibility but medium-term prey collapse likely.", uncertainty: "Moderate", knowledgeGap: "Prey availability not measured" },
        water: { status: "LOW CONCERN", evidenceType: "Inference", detail: "Raptors derive most water from prey; direct water access less critical.", uncertainty: "Low", knowledgeGap: "None identified" },
        shelter: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Eagle Owl nest trees (large mature pines) may have been burned. Cliff-face nests for Bonelli's Eagle likely intact.", uncertainty: "Moderate", knowledgeGap: "Nest-site surveys not conducted" },
        breeding: { status: "HIGH CONCERN", evidenceType: "Unknown", detail: "Spring 2023 breeding season coincided with second fire season. Nest abandonment or chick mortality not assessed.", uncertainty: "Very high", knowledgeGap: "No breeding-success monitoring" },
        movement: { status: "LOW CONCERN", evidenceType: "Observation (illustrative camera trap)", detail: "Eagle Owl detected at 2 camera trap sites in unburned patches post-fire (illustrative record).", uncertainty: "High — 2 detections insufficient", knowledgeGap: "Foraging-range shifts not tracked" },
      },
      note: "⚠️ ILLUSTRATIVE",
    },
    {
      id: "sp-tortoise",
      commonName: "Hermann's Tortoise",
      scientificName: "Testudo hermanni",
      protectionStatus: "FICTIONAL — Vulnerable (illustrative)",
      guild: "Reptile — slow-moving ground-dweller",
      sensitivityToFire: "Very High — extremely limited escape capacity",
      mobilityPotential: "Very Low — cannot outrun fire fronts",
      emoji: "🐢",
      welfareContext: {
        food: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Herbaceous and low shrub vegetation (primary forage) eliminated across large areas. Recovery of suitable vegetation expected to take 3–7 years.", uncertainty: "Moderate", knowledgeGap: "Vegetation recovery rates not measured at this site" },
        water: { status: "MODERATE CONCERN", evidenceType: "Inference", detail: "Tortoises obtain water from food plants and dew; loss of vegetation cover reduces dew formation and may increase dehydration risk in summer heat.", uncertainty: "Moderate", knowledgeGap: "Microclimate data not available" },
        shelter: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Scrub cover used for thermoregulation and predator avoidance lost. Exposed tortoises face increased predation and thermal stress.", uncertainty: "Moderate", knowledgeGap: "Thermal refugia mapping not done" },
        breeding: { status: "HIGH CONCERN", evidenceType: "Unknown", detail: "Nest sites (buried eggs) may have been destroyed by fire heat. Hatchling survival in denuded landscape unknown.", uncertainty: "Very high", knowledgeGap: "No nest-site surveys" },
        movement: { status: "HIGH CONCERN", evidenceType: "Inference", detail: "Very limited movement capacity means many individuals are likely dead or stranded in burned areas. Survivors in refugia may be isolated.", uncertainty: "Moderate", knowledgeGap: "Mortality estimates not available" },
      },
      note: "⚠️ ILLUSTRATIVE",
    },
    {
      id: "sp-toad",
      commonName: "Mallorcan Midwife Toad",
      scientificName: "Alytes muletensis",
      protectionStatus: "FICTIONAL — Endangered (illustrative)",
      guild: "Amphibian",
      sensitivityToFire: "High (aquatic larval stage; adults vulnerable to desiccation)",
      mobilityPotential: "Very Low",
      emoji: "🐸",
      welfareContext: {
        food: { status: "MODERATE CONCERN", evidenceType: "Inference", detail: "Invertebrate prey reduced post-fire. Recovery expected in 1–3 years.", uncertainty: "Moderate", knowledgeGap: "Invertebrate surveys not available" },
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
      protectionStatus: "Not threatened (illustrative — hunted species)",
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
      protectionStatus: "Variable — some species protected (illustrative)",
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
      id: "opt-A",
      name: "Option A — Assisted Natural Regeneration (ANR)",
      shortLabel: "ANR",
      color: "#2563eb",
      description: "Allow natural post-fire regeneration with targeted human support: remove invasive pioneer species where they threaten native recovery, install temporary water points for wildlife, and protect regenerating areas from livestock grazing. No replanting of trees.",
      timeframe: "5–15 years to substantial habitat recovery",
      cost: "Low–Moderate (illustrative)",
      managementIntensity: "Low",
      potentialBenefits: ["Maintains native plant community composition and genetic diversity", "Reduces soil disturbance compared to active replanting", "Post-fire shrub regrowth provides shelter for tortoises within 3–5 years", "Nectar-rich pioneer plants support pollinator recolonisation within 1–3 years", "Lowest risk of introducing non-native species"],
      potentialHarms: ["Slow recovery means Iberian Lynx faces prolonged food and shelter deficit (5–10 years)", "Mallorcan Midwife Toad breeding pools remain at risk from post-fire runoff without intervention", "Invasive species (e.g. Eucalyptus, Ailanthus) may outcompete native shrubs if not controlled", "Compounding-fire risk: recovered shrubland may be highly flammable within 10–15 years"],
      affectedStakeholders: [
        { group: "Iberian Lynx", welfare: "NEGATIVE short-term", notes: "Prolonged prey and shelter deficit" },
        { group: "Hermann's Tortoise", welfare: "POSITIVE medium-term", notes: "Early shrub regrowth aids thermoregulation" },
        { group: "Pollinators", welfare: "POSITIVE short-term", notes: "Pioneer flowers provide early forage" },
        { group: "Mallorcan Midwife Toad", welfare: "UNCERTAIN", notes: "No targeted water-quality intervention" },
        { group: "Local graziers", welfare: "NEGATIVE short-term", notes: "Grazing exclusion may reduce forage access" },
        { group: "Hunting associations", welfare: "NEGATIVE medium-term", notes: "Reduced rabbit and deer populations" },
        { group: "Conservation NGOs", welfare: "POSITIVE", notes: "Aligns with passive restoration values" },
      ],
      missingStakeholders: ["Indigenous / traditional land users (data gap)", "Invertebrate species not yet identified in this area (biodiversity gap)"],
      evidence: { strength: "Moderate (general principles) / Very Low (site-specific)", sources: ["src-1", "src-3"], keyUncertainties: ["Rate of native shrub regeneration after back-to-back fires is poorly documented", "Invasive species pressure unknown without survey", "Climate-change projections may slow recovery further"] },
      fieldChecksNeeded: ["Annual vegetation transect surveys", "Rabbit population monitoring", "Tortoise thermal-refuge mapping", "Water-point utilisation monitoring", "Invasive species mapping"],
      ethicsFlags: ["Does not actively address acute starvation risk for Iberian Lynx in short term", "Pollinator welfare improved but monitoring often overlooked in practice"],
    },
    {
      id: "opt-B",
      name: "Option B — Active Replanting with Prey Supplementation",
      shortLabel: "Active Replanting",
      color: "#16a34a",
      description: "Replant native oak and pine seedlings across 40% of burned area within 12 months. Simultaneously implement emergency rabbit restocking from captive-bred populations to support Iberian Lynx, and install mesh enclosures to protect tortoise thermal refugia during the establishment phase.",
      timeframe: "3–8 years to functional habitat recovery (with intervention)",
      cost: "High (illustrative)",
      managementIntensity: "High",
      potentialBenefits: ["Reduces Iberian Lynx food deficit timeline by potentially 3–5 years", "Accelerated canopy closure provides thermal refuge for tortoises within 3–5 years", "Mesh enclosures directly reduce tortoise predation and thermal stress", "Faster structural habitat return for raptors (nest tree establishment)"],
      potentialHarms: ["Replanting risks introducing non-local genotypes reducing genetic diversity", "Soil disturbance during planting may harm surviving soil invertebrates and ground-nesting bee colonies", "Rabbit restocking may introduce pathogens (RHD, myxomatosis) — biosecurity risk", "High management intensity may disturb breeding raptors during nesting season", "Enclosures may inadvertently trap predators or restrict other species movement"],
      affectedStakeholders: [
        { group: "Iberian Lynx", welfare: "POSITIVE short-term (if restock succeeds)", notes: "Prey supplementation reduces starvation risk" },
        { group: "Hermann's Tortoise", welfare: "POSITIVE short-term", notes: "Enclosures reduce thermal stress and predation" },
        { group: "Pollinators", welfare: "NEGATIVE short-term", notes: "Soil disturbance destroys ground-nesting sites" },
        { group: "Raptors", welfare: "MIXED", notes: "Faster habitat recovery vs. disturbance during planting" },
        { group: "Mallorcan Midwife Toad", welfare: "UNCERTAIN — NOT ADDRESSED", notes: "No specific intervention for breeding pools" },
        { group: "Hunting associations", welfare: "POSITIVE medium-term", notes: "Rabbit restock may benefit quarry stocks" },
        { group: "Veterinary / biosecurity interests", welfare: "NEGATIVE potential", notes: "Rabbit restocking introduces disease risk" },
      ],
      missingStakeholders: ["Soil biota and decomposer communities (not assessed)", "Non-target reptile species affected by mesh enclosures", "Midwife toad is NOT directly addressed — significant gap"],
      evidence: { strength: "Low (active replanting in compounding-fire contexts is under-studied)", sources: ["src-2", "src-3"], keyUncertainties: ["Rabbit restock success rates in post-fire landscapes unknown", "Pathogen introduction risk from captive rabbits not quantified", "Planting survival rates under climate-change drought scenarios unknown"] },
      fieldChecksNeeded: ["Seedling survival monitoring (monthly in first year)", "Rabbit population health surveillance (disease screening)", "Predator monitoring around mesh enclosures", "Soil invertebrate surveys before and after planting", "Midwife toad breeding pool water quality — urgent gap"],
      ethicsFlags: ["Pollinators and soil invertebrates harmed — welfare often not considered in replanting programmes", "Mallorcan Midwife Toad NOT addressed — species representation gap", "Rabbit restock introduces welfare risk to wild rabbits (disease) requiring explicit approval"],
    },
    {
      id: "opt-C",
      name: "Option C — Mosaic Management with Firebreak Integration",
      shortLabel: "Mosaic + Firebreak",
      color: "#9333ea",
      description: "Create a planned mosaic of recovery zones: 30% active replanting (priority species areas), 50% assisted natural regeneration, and 20% managed firebreak corridors with low-growing fire-resistant vegetation. Integrate emergency water supplementation for all threatened species.",
      timeframe: "5–10 years to functional mosaic",
      cost: "Moderate–High (illustrative)",
      managementIntensity: "Moderate",
      potentialBenefits: ["Balances rapid intervention for acute welfare risks with long-term biodiversity outcomes", "Firebreak corridors reduce risk of third consecutive fire", "Mosaic structure benefits multiple species across different guilds simultaneously", "Monitoring network generates verified data to replace synthetic data in future iterations", "Water supplementation directly addresses acute dehydration risk for all focal species"],
      potentialHarms: ["Firebreak maintenance may require herbicide use — impacts invertebrates and amphibians", "Complex coordination between multiple interventions increases implementation risk", "Camera-trap network requires ongoing resourcing", "Partial replanting still carries some genotype and soil disturbance risks", "Firebreak corridors may facilitate spread of invasive plant species"],
      affectedStakeholders: [
        { group: "Iberian Lynx", welfare: "POSITIVE medium-term", notes: "Prey supplementation + faster partial habitat recovery" },
        { group: "Hermann's Tortoise", welfare: "POSITIVE", notes: "Mosaic provides refugia patches throughout recovery" },
        { group: "Pollinators", welfare: "POSITIVE", notes: "ANR zones and mosaic structure provide diverse forage patches" },
        { group: "Mallorcan Midwife Toad", welfare: "POSITIVE — DIRECTLY ADDRESSED", notes: "Water supplementation targets breeding pools" },
        { group: "Raptors", welfare: "POSITIVE", notes: "Mosaic edge habitat beneficial for foraging" },
        { group: "Red Deer", welfare: "NEUTRAL", notes: "Mosaic provides mixed forage" },
        { group: "Local graziers", welfare: "MIXED", notes: "Some grazing access retained in firebreak corridors" },
        { group: "Hunting associations", welfare: "POSITIVE medium-term", notes: "Mosaic supports diverse prey communities" },
      ],
      missingStakeholders: ["Soil biota affected by partial replanting (gap)", "Invertebrate species in firebreak corridors affected by management (gap)", "Traditional ecological knowledge holders not consulted (gap)"],
      evidence: { strength: "Moderate (mosaic management has ecological support; site-specific evidence absent)", sources: ["src-1", "src-2", "src-3"], keyUncertainties: ["Optimal mosaic proportions for this specific landscape unknown", "Herbicide effects on amphibians in firebreak corridors not assessed", "Coordination costs and implementation risks not quantified"] },
      fieldChecksNeeded: ["Pre-intervention baseline surveys for all focal species", "Water quality monitoring at supplemented sites", "Vegetation recovery monitoring in all three zone types", "Camera-trap network deployment and data review", "Annual stakeholder review meetings with documented outcomes"],
      ethicsFlags: ["Herbicide use in firebreaks requires explicit welfare impact assessment for amphibians", "Most balanced across species groups, but coordination complexity may lead to implementation gaps"],
    },
  ],

  multispieciesJustice: {
    description: "Multispecies Justice analysis asks: who benefits, who is harmed, and whose interests are absent or underweighted?",
    analysis: [
      { group: "Iberian Lynx", representation: "High (charismatic flagship)", riskOfHarm: "High", riskOfOmission: "Low" },
      { group: "Hermann's Tortoise", representation: "Moderate", riskOfHarm: "Very High (very limited escape capacity)", riskOfOmission: "Moderate" },
      { group: "Mallorcan Midwife Toad", representation: "Low — aquatic stage invisible in standard surveys", riskOfHarm: "High", riskOfOmission: "HIGH — amphibians systematically underrepresented" },
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
