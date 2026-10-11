/* Mixed real evidence is loaded by the backend; these pathways and guild questions are authored hypotheses. */
const SCENARIO = {
  "meta": {
    "id": "culebra-june-2022",
    "label": "Sierra de la Culebra · June 2022 — documented event; mixed evidence",
    "status": "Real event · observations / derived data / hypotheses distinguished",
    "jurisdiction": "Zamora, Castilla y León, Spain",
    "createdDate": "2026-10-11",
    "dataVersion": "3.0-prototype",
    "disclaimer": "Documented fire and retrieved records do not establish current wildlife occupancy or welfare. Model interpretations and restoration choices require expert review; no legal authorisation is issued."
  },
  "caseOverview": {
    "title": "Sierra de la Culebra · June 2022",
    "description": "Activation documents fires starting 15 June. No extinguishment date inferred. June and July 2022 fires must not be conflated. Search-window records are not necessarily in burned habitat.",
    "fireScenario": {
      "type": "Documented June 2022 wildfire",
      "seasons": [
        "June 2022"
      ],
      "estimatedExtent_ha": null,
      "severity": "No EFFIS severity raster retrieved",
      "note": "CEMS mapped extent is available; final incident extent not inferred"
    },
    "habitat": {
      "primary": "Habitat condition requires current local assessment",
      "secondary": [],
      "note": "No site-specific habitat classification model has been run"
    },
    "evidenceSources": [
      {
        "id": "cems-EMSR580-event",
        "type": "Official activation",
        "label": "Copernicus EMS Rapid Mapping EMSR580",
        "date": "2022-06-15",
        "confidence": "Source-backed event narrative; ecological impact unknown",
        "limitations": "Activation documents fires starting 15 June. No extinguishment date inferred. June and July 2022 fires must not be conflated. Search-window records are not necessarily in burned habitat.",
        "verified": true
      }
    ],
    "keyLimitations": [
      "June and July 2022 fires are separate events; recovery imagery may reflect both.",
      "CEMS mapped extent is photo-interpreted and generalised for display; it is not EFFIS or a final incident boundary.",
      "GBIF indexed records do not prove current occupancy or measured suffering; exact locations are withheld.",
      "Catalogue thumbnails are not analysis rasters. NDVI and dNBR appear only after actual reflectance processing.",
      "Welfare-domain content is an authored hypothesis checklist, not an AI answer or verified site assessment.",
      "AI and satellite processing require locally configured credentials; no predefined fallback is passed off as AI."
    ]
  },
  "focalSpecies": [
    {
      "id": "guild-mammals",
      "commonName": "Mammals",
      "scientificName": "Ecological guild — illustrative questions, not a local species observation",
      "protectionStatus": "No conservation or legal status inferred",
      "guild": "Mammals",
      "sensitivityToFire": "Unknown at this site",
      "mobilityPotential": "Varies within group; field assessment required",
      "emoji": "🐾",
      "evidenceKind": "hypothetical",
      "welfareContext": {
        "food": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss or change of forage and prey could affect individuals; food availability has not been measured.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "water": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Runoff, ash and loss of shade could affect water access and quality. Test locally before considering provisioning.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "shelter": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss of cover and disturbance from machinery could reduce refuge quality. Locate surviving shelter before works.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "breeding": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Fire effects and restoration disturbance may affect eggs, juveniles and breeding sites; timing must be checked.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "movement": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Habitat gaps, roads, barriers and restoration works could affect connectivity. Map routes and refugia in the field.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        }
      },
      "note": "Authored hypothetical investigation guide. Retrieved species records are listed separately in Ecological evidence; no habitat suitability model is claimed."
    },
    {
      "id": "guild-birds",
      "commonName": "Birds",
      "scientificName": "Ecological guild — illustrative questions, not a local species observation",
      "protectionStatus": "No conservation or legal status inferred",
      "guild": "Birds",
      "sensitivityToFire": "Unknown at this site",
      "mobilityPotential": "Varies within group; field assessment required",
      "emoji": "🦅",
      "evidenceKind": "hypothetical",
      "welfareContext": {
        "food": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss or change of forage and prey could affect individuals; food availability has not been measured.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "water": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Runoff, ash and loss of shade could affect water access and quality. Test locally before considering provisioning.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "shelter": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss of cover and disturbance from machinery could reduce refuge quality. Locate surviving shelter before works.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "breeding": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Fire effects and restoration disturbance may affect eggs, juveniles and breeding sites; timing must be checked.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "movement": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Habitat gaps, roads, barriers and restoration works could affect connectivity. Map routes and refugia in the field.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        }
      },
      "note": "Authored hypothetical investigation guide. Retrieved species records are listed separately in Ecological evidence; no habitat suitability model is claimed."
    },
    {
      "id": "guild-reptiles",
      "commonName": "Reptiles",
      "scientificName": "Ecological guild — illustrative questions, not a local species observation",
      "protectionStatus": "No conservation or legal status inferred",
      "guild": "Reptiles",
      "sensitivityToFire": "Unknown at this site",
      "mobilityPotential": "Varies within group; field assessment required",
      "emoji": "🦎",
      "evidenceKind": "hypothetical",
      "welfareContext": {
        "food": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss or change of forage and prey could affect individuals; food availability has not been measured.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "water": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Runoff, ash and loss of shade could affect water access and quality. Test locally before considering provisioning.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "shelter": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss of cover and disturbance from machinery could reduce refuge quality. Locate surviving shelter before works.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "breeding": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Fire effects and restoration disturbance may affect eggs, juveniles and breeding sites; timing must be checked.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "movement": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Habitat gaps, roads, barriers and restoration works could affect connectivity. Map routes and refugia in the field.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        }
      },
      "note": "Authored hypothetical investigation guide. Retrieved species records are listed separately in Ecological evidence; no habitat suitability model is claimed."
    },
    {
      "id": "guild-amphibians",
      "commonName": "Amphibians",
      "scientificName": "Ecological guild — illustrative questions, not a local species observation",
      "protectionStatus": "No conservation or legal status inferred",
      "guild": "Amphibians",
      "sensitivityToFire": "Unknown at this site",
      "mobilityPotential": "Varies within group; field assessment required",
      "emoji": "🐸",
      "evidenceKind": "hypothetical",
      "welfareContext": {
        "food": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss or change of forage and prey could affect individuals; food availability has not been measured.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "water": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Runoff, ash and loss of shade could affect water access and quality. Test locally before considering provisioning.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "shelter": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss of cover and disturbance from machinery could reduce refuge quality. Locate surviving shelter before works.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "breeding": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Fire effects and restoration disturbance may affect eggs, juveniles and breeding sites; timing must be checked.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "movement": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Habitat gaps, roads, barriers and restoration works could affect connectivity. Map routes and refugia in the field.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        }
      },
      "note": "Authored hypothetical investigation guide. Retrieved species records are listed separately in Ecological evidence; no habitat suitability model is claimed."
    },
    {
      "id": "guild-invertebrates",
      "commonName": "Invertebrates",
      "scientificName": "Ecological guild — illustrative questions, not a local species observation",
      "protectionStatus": "No conservation or legal status inferred",
      "guild": "Invertebrates",
      "sensitivityToFire": "Unknown at this site",
      "mobilityPotential": "Varies within group; field assessment required",
      "emoji": "🐝",
      "evidenceKind": "hypothetical",
      "welfareContext": {
        "food": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss or change of forage and prey could affect individuals; food availability has not been measured.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "water": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Runoff, ash and loss of shade could affect water access and quality. Test locally before considering provisioning.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "shelter": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss of cover and disturbance from machinery could reduce refuge quality. Locate surviving shelter before works.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "breeding": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Fire effects and restoration disturbance may affect eggs, juveniles and breeding sites; timing must be checked.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "movement": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Habitat gaps, roads, barriers and restoration works could affect connectivity. Map routes and refugia in the field.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        }
      },
      "note": "Authored hypothetical investigation guide. Retrieved species records are listed separately in Ecological evidence; no habitat suitability model is claimed."
    },
    {
      "id": "guild-soil",
      "commonName": "Soil biota",
      "scientificName": "Ecological guild — illustrative questions, not a local species observation",
      "protectionStatus": "No conservation or legal status inferred",
      "guild": "Soil biota",
      "sensitivityToFire": "Unknown at this site",
      "mobilityPotential": "Varies within group; field assessment required",
      "emoji": "🌱",
      "evidenceKind": "hypothetical",
      "welfareContext": {
        "food": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss or change of forage and prey could affect individuals; food availability has not been measured.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "water": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Runoff, ash and loss of shade could affect water access and quality. Test locally before considering provisioning.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "shelter": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Loss of cover and disturbance from machinery could reduce refuge quality. Locate surviving shelter before works.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "breeding": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Fire effects and restoration disturbance may affect eggs, juveniles and breeding sites; timing must be checked.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        },
        "movement": {
          "status": "UNKNOWN",
          "evidenceType": "Hypothetical",
          "detail": "Habitat gaps, roads, barriers and restoration works could affect connectivity. Map routes and refugia in the field.",
          "uncertainty": "High — no field welfare assessment",
          "knowledgeGap": "Current occupancy and individual welfare have not been established"
        }
      },
      "note": "Authored hypothetical investigation guide. Retrieved species records are listed separately in Ecological evidence; no habitat suitability model is claimed."
    }
  ],
  "recoveryPathways": [
    {
      "timeframe": "Unknown — requires baseline surveys and repeated monitoring",
      "cost": "Not estimated",
      "evidence": {
        "strength": "Authored conditional pathway; site impacts unvalidated",
        "sources": [
          "cems-EMSR580-event"
        ],
        "keyUncertainties": [
          "Current occupancy and welfare are not established",
          "Remote-sensing indices do not measure mortality",
          "Effects depend on habitat, drought, soil and intervention timing"
        ]
      },
      "fieldChecksNeeded": [
        "Survey vegetation recovery and erosion",
        "Investigate shelter, food, water and habitat connectivity",
        "Include juveniles, invertebrates, soil organisms and undetected species"
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
          "group": "Mammals",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Birds",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Reptiles",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Amphibians",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Invertebrates",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Soil biota",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        }
      ]
    },
    {
      "timeframe": "Unknown — requires baseline surveys and repeated monitoring",
      "cost": "Not estimated",
      "evidence": {
        "strength": "Authored conditional pathway; site impacts unvalidated",
        "sources": [
          "cems-EMSR580-event"
        ],
        "keyUncertainties": [
          "Current occupancy and welfare are not established",
          "Remote-sensing indices do not measure mortality",
          "Effects depend on habitat, drought, soil and intervention timing"
        ]
      },
      "fieldChecksNeeded": [
        "Survey vegetation recovery and erosion",
        "Investigate shelter, food, water and habitat connectivity",
        "Include juveniles, invertebrates, soil organisms and undetected species"
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
          "group": "Mammals",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Birds",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Reptiles",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Amphibians",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Invertebrates",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Soil biota",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        }
      ]
    },
    {
      "timeframe": "Unknown — requires baseline surveys and repeated monitoring",
      "cost": "Not estimated",
      "evidence": {
        "strength": "Authored conditional pathway; site impacts unvalidated",
        "sources": [
          "cems-EMSR580-event"
        ],
        "keyUncertainties": [
          "Current occupancy and welfare are not established",
          "Remote-sensing indices do not measure mortality",
          "Effects depend on habitat, drought, soil and intervention timing"
        ]
      },
      "fieldChecksNeeded": [
        "Survey vegetation recovery and erosion",
        "Investigate shelter, food, water and habitat connectivity",
        "Include juveniles, invertebrates, soil organisms and undetected species"
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
          "group": "Mammals",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Birds",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Reptiles",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Amphibians",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Invertebrates",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        },
        {
          "group": "Soil biota",
          "welfare": "UNCERTAIN — field evidence required",
          "notes": "Consider individuals and less visible life stages; possible disturbance and habitat effects require review."
        }
      ]
    }
  ],
  "multispieciesJustice": {
    "description": "Multispecies Justice analysis asks: who benefits, who is harmed, and whose interests are absent or underweighted?",
    "analysis": [
      {
        "group": "Mammals",
        "representation": "Representation requires consultation and field review",
        "riskOfHarm": "Unknown at this site",
        "riskOfOmission": "Potential ethical concern; not a measured site finding"
      },
      {
        "group": "Birds",
        "representation": "Representation requires consultation and field review",
        "riskOfHarm": "Unknown at this site",
        "riskOfOmission": "Potential ethical concern; not a measured site finding"
      },
      {
        "group": "Reptiles",
        "representation": "Representation requires consultation and field review",
        "riskOfHarm": "Unknown at this site",
        "riskOfOmission": "Potential ethical concern; not a measured site finding"
      },
      {
        "group": "Amphibians",
        "representation": "Representation requires consultation and field review",
        "riskOfHarm": "Unknown at this site",
        "riskOfOmission": "Potential ethical concern; not a measured site finding"
      },
      {
        "group": "Invertebrates",
        "representation": "Representation requires consultation and field review",
        "riskOfHarm": "Unknown at this site",
        "riskOfOmission": "Potential ethical concern; not a measured site finding"
      },
      {
        "group": "Soil biota",
        "representation": "Representation requires consultation and field review",
        "riskOfHarm": "Unknown at this site",
        "riskOfOmission": "Potential ethical concern; not a measured site finding"
      },
      {
        "group": "Undetected species and local land users",
        "representation": "Not established",
        "riskOfHarm": "Unknown",
        "riskOfOmission": "Missing records and missing consultation require investigation"
      }
    ]
  },
  "evaluationChecklist": [
    {
      "id": "chk-1",
      "category": "Evidence Traceability",
      "item": "Every data point displayed has a labelled source, date, confidence level and limitations statement",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    },
    {
      "id": "chk-2",
      "category": "Evidence Traceability",
      "item": "No real-world citations have been invented or misrepresented",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    },
    {
      "id": "chk-3",
      "category": "Uncertainty",
      "item": "Confidence and uncertainty levels are displayed for all welfare assessments",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    },
    {
      "id": "chk-4",
      "category": "Uncertainty",
      "item": "Missing records are not interpreted as species absence",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    },
    {
      "id": "chk-5",
      "category": "Uncertainty",
      "item": "Satellite imagery is not claimed to directly measure animal welfare",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    },
    {
      "id": "chk-6",
      "category": "Species Representation",
      "item": "Invertebrate / pollinator welfare is assessed and included",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    },
    {
      "id": "chk-7",
      "category": "Species Representation",
      "item": "Multispecies Justice analysis identifies whose interests are missing",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    },
    {
      "id": "chk-8",
      "category": "Species Representation",
      "item": "No single overall score conceals severe harm to a smaller group",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    },
    {
      "id": "chk-9",
      "category": "Human Oversight",
      "item": "The tool does not automatically issue or execute management instructions",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    },
    {
      "id": "chk-10",
      "category": "Human Oversight",
      "item": "Experts can challenge, override and record disagreements with tool outputs",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    },
    {
      "id": "chk-11",
      "category": "Misleading Recommendations",
      "item": "The tool does not claim to have been validated or to improve animal welfare",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    },
    {
      "id": "chk-12",
      "category": "Misleading Recommendations",
      "item": "Sensitive species location data is protected (coarse resolution only)",
      "passed": false,
      "notes": "Requires reviewer verification against the current live evidence and application behaviour; not auto-certified."
    }
  ]
};
if (typeof module !== "undefined") module.exports = SCENARIO;
