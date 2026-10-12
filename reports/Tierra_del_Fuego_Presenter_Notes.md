# Tierra del Fuego — demo presentation

**Six slides. Target duration: 4 minutes 40 seconds.**

**Presenting team: Group N ANWE.** The cover includes the product image supplied by the group, reproduced without cropping or alteration.

Present `Tierra_del_Fuego_Demo.pdf` full-screen. Rehearse with a timer. Use the prepared screenshots and results to avoid waiting for API requests during the presentation. Product name: **Tierra del Fuego**. The actual case is **Sierra de la Culebra, Zamora, Spain**.

## 1. Product and case — 0:00–0:30

“We are Group N ANWE. Our product, Tierra del Fuego, supports discussion of restoration after wildfire while considering animal welfare. Our demo focuses on Sierra de la Culebra in Spain and the June 2022 wildfire. It combines satellite information, historical biodiversity records and an AI draft with explicit ethical values. We make the evidence and remaining decisions visible before choosing an action.”

Source: completed demo report, pages 1–2. Visual structure adapted from the supplied AquaSentinel example. The ocean project's claims do not apply to this product.

## 2. Relevance — 0:30–1:15

“Restoration creates decisions about cover, open habitat, breeding sites and disturbance from machinery. Historical records cannot tell us which animals currently use the area. Satellite change cannot establish recovery speed. Tierra del Fuego makes those limits explicit. It brings source evidence together, asks about food, water, shelter, movement and breeding, and compares conditional restoration options. We still need field verification rather than treating the tool as an automatic restoration plan.”

Source: completed report, pages 3–4 and 6. Possible intervention effects are authored hypotheses, not measured local findings.

## 3. Approach and actual results — 1:15–2:15

“The workflow starts with the mapped fire footprint and the actual satellite pair from 10 June and 5 July 2022. NDVI measures vegetation greenness. Its regional averages are 0.482 and 0.385. dNBR measures spectral change between the images, here 0.114. These regional values include unburned land. We then compare GBIF records from June 2021 and June 2023. GBIF is a network indexing contributed biodiversity records. The retrieved sample has thirteen earlier records and no confidently assigned later records inside the footprint. Nearby counts are thirty-five and five. Most eligible records have uncertain locations. None of these counts establishes animal disappearance or population change.”

Source: completed report, pages 2–3 and Appendix A/B. [CEMS EMSR580](https://mapping.emergency.copernicus.eu/activations/EMSR580/), [Copernicus Sentinel-2 documentation](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/S2L2A.html), [GBIF occurrence documentation](https://techdocs.gbif.org/en/openapi/v1/occurrence). CEMS observation: 25 June 2022. GBIF windows: 1–30 June 2021 and 1–30 June 2023; all groups; 5 km outside buffer. Values on the slide are earlier/later or before/after respectively. NDVI: Normalized Difference Vegetation Index. dNBR: differenced Normalized Burn Ratio. Fire end remains unverified; later data may reflect the separate July fire.

## 4. Ethical architecture — 2:15–3:05

“Five values guide the design: animal welfare, ecological recovery, transparency, uncertainty and accountability. The first two ask how restoration affects animals and habitat functions. Transparency and uncertainty keep assumptions and missing measurements visible. Accountability means that people justify decisions and obtain the required review. We consider less visible groups as well as mammals and birds. We protect sensitive locations and avoid treating missing records as absence. The app supports these questions without combining them into one ethical score.”

Source: completed report, page 5 and Appendix C; project Design for Values foundation. Groups: mammals, birds, reptiles, amphibians, invertebrates and soil biota. Soil biota contain diverse organisms; do not assume every organism is an animal or sentient. Stakeholder priorities are authored project assumptions.

## 5. Interface — 3:05–3:55

“This is an actual screenshot of the mammals movement popup. It combines an authored concern about connectivity with relevant reasoning from the real configured AI response. Below that, the app keeps unknown conditions and field checks visible. The AI considers the five values and three restoration options, but its interpretations remain drafts. The popup stays marked as not field-verified. A general answer may leave some concerns unanswered, and the optional focused button makes another model request.”

Source: actual application screenshot using the completed session's `gpt-4.1-mini-2025-04-14` response; completed report, pages 7 and 26–28. No additional model request was made for the presentation. The report labels two editorial clarifications and preserves superseded original wording.

## 6. Stakeholder impact and next steps — 3:55–4:40

“Restoration teams can compare natural regeneration, assisted restoration and active restoration. Land managers receive a report that documents evidence, methods and remaining questions. Ecologists and field staff can identify checks of refuges, movement routes, breeding activity, regeneration and erosion. The completed demo produced a twenty-eight-page report with the actual AI draft, full retrieved species lists and a glossary. Its status remains an unreviewed draft. Field verification, qualified review and applicable permissions come before restoration action.”

Source: completed report, pages 4 and 6, full technical appendices. Benefits to stakeholders describe intended decision support, not verified ecological outcomes. Report export omits private review details by default.

## Short definitions for questions

- **Fire footprint:** generalised land mapped as burned on 25 June 2022. Before-fire records refer to places later mapped as burned.
- **Buffer:** nearby land extending up to 5 km outside the outline, not a radius from its centre or a validated unaffected control.
- **Uncertain location:** insufficient precision for confident inside/nearby assignment, not a third geographical area.
- **Occurrence record:** an indexed observation or specimen record, not the number of animals living there.
- **Distinct species:** different identified species in eligible retrieved records.
- **Unreviewed draft:** no verified expert endorsement or authorisation to act.
