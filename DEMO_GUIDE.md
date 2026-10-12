# ANWE 4.1 — how to run and demonstrate the app

This guide follows the current interface. You will inspect one wildfire, compare evidence, ask the AI, consider five ethical values, record a human assessment and download a PDF.

**Recommended order:** Explore wildfire → Ecological evidence → Biodiversity comparison → Design for Values → AI Ecological Assistant → Animal Welfare Context → Compare Pathways → Expert Review & Record → Report.

The app helps investigate a decision. It does not establish current animal presence or approve restoration work.

## Quick demo: the tested end-to-end sequence

1. **Start and reload:** start `python server.py` with your configured Python environment, open `http://localhost:8080`, and press Ctrl+F5. Keep the same server and browser tab open until you export.
2. **Choose the case:** on Explore wildfire, click **Select Culebra case**. Read the mapped fire outline and its observation date.
3. **Load environmental evidence:** open **Ecological evidence**. For this completed run, the real cached pair was **10 June 2022 / 5 July 2022**, tile **T29TQG**. The already loaded analysis can be used directly. Selecting that same pair and clicking **Calculate NDVI / NBR / dNBR** retrieves the existing analysis; another pair can require new processing. Regional means include unburned land. The later image is not proof of the fire's extinguishment or ecological recovery.
4. **Retrieve biodiversity:** open **Biodiversity comparison**, retain **1–30 June 2021 / 1–30 June 2023**, **5 km**, **All**, and click **Retrieve comparison**. Read records and distinct species separately; explain the inside, nearby and uncertain-location categories.
5. **Show the values:** open **Design for Values**. Explain the five rows and try one filter, then restore **All five values**.
6. **Ask the AI after loading evidence:** open **AI Ecological Assistant** and use the question below. Wait for the response. This makes a real model request; check its claims against the source records and treat ecological interpretations as drafts.

> Which species were recorded before and after the fire, what do the observation counts and satellite indices mean, and how do the five ANWE values affect restoration? Discuss possible shelter, food, water, movement and breeding concerns for mammals, birds, reptiles, amphibians, invertebrates and soil biota; distinguish evidence from hypotheses and specify field checks. Do not infer current occupancy or measured welfare.

7. **Inspect animal concerns:** open **Animal Welfare Context** and try a concern for each animal group. Available AI reasoning is shown alongside the authored guide; a popup may say no relevant interpretation is available. A general response does not guarantee a detailed assessment of every group and concern. The status remains **Not field-verified**. Focused popup requests are optional additional model calls.
8. **Compare alternatives:** open **Compare Pathways**. Compare natural regeneration, assisted restoration and active restoration, including possible benefits, harms and field checks. There is no automatically approved winner.
9. **Export the draft:** expert review is optional for downloading. Open **Report**, leave both privacy checkboxes off, and click **Download PDF Report**. The PDF includes the actual session AI draft, available evidence, methods and source references. Save it before restarting the server.
10. **Present the PDF:** read the six core pages in order, then the actual AI assessment page. Use bookmarks for the technical appendices and glossary. Explain that the report supports investigation and still requires field verification before action.

The completed run is saved as [ANWE_Complete_Demo_Report.pdf](reports/ANWE_Complete_Demo_Report.pdf). It includes an actual AI response and is an **unreviewed draft**, with no invented reviewer or approval. Existing real satellite processing was reused; the demo did not perform a fresh satellite acquisition or processing job. Public retrieval can use the application's cache and its original retrieval dates.

The reviewed example contains two labelled editorial clarifications: historical records do not establish present-day presence, and regional satellite change does not establish regeneration speed. Appendix F preserves the superseded original wording for traceability. These corrections do not constitute expert review of the remaining AI draft.

## A. Start the updated version

### If you already have ANWE on this computer

1. Open a terminal in the **ANWE-Tool** folder, where `server.py` is located.
2. Stop any old ANWE server with **Ctrl+C** in its terminal.
3. Update dependencies and start the server:

```powershell
python -m pip install -r requirements.txt
python server.py
```

Use the same Python environment for both commands. If you previously created `.venv`, use these instead:

On this computer, the complete demo was tested with `C:/Users/alvar/anaconda3/python.exe server.py`. Use that executable if your default `python` does not have the installed dependencies.

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe server.py
```

4. Open **http://localhost:8080** and reload with **Ctrl+F5**.
5. Keep the server terminal open throughout the demo.

Your existing `.env` can stay beside `server.py`. Do not replace it with the empty example. Restart the server after changing configuration.

### For a teammate installing it for the first time

They need Python 3.11 or later and Git:

```powershell
git clone https://github.com/newb-dev-1008/ANWE-Tool.git
cd ANWE-Tool
git checkout updates-alvaro
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Get the shared `.env` privately from Alvaro and place it beside `server.py`, then run:

```powershell
.\.venv\Scripts\python.exe server.py
```

Open http://localhost:8080. The ANWE 4.0 changes must be committed and pushed before teammates can obtain them through Git. Public evidence works without keys; AI and raster processing require configured credentials. Keep `.env` out of GitHub and screenshots.

## B. Follow the demo, screen by screen

### 1. Explore wildfire — choose the case

Click **Select Culebra case**.

**You should see:** the selected-case message and the mapped June 2022 Sierra de la Culebra burned extent in Zamora, Spain.

Read the map provenance. The documented fire start is **15 June 2022**; the fire end is unverified. CEMS geometry represents the mapped observation from **25 June**, generalised for display. It is not an exact final incident perimeter.

Selecting the case is necessary before asking the AI. There is only one case; you do not need to upload a perimeter for this demo.

### 2. Ecological evidence — inspect imagery and sources

Click **Ecological evidence** in the sidebar.

1. Inspect the pre-fire and post-fire image selectors and acquisition dates.
2. For the first comparison, choose a **2022 post-fire** image rather than a 2023 recovery image.
3. Look at the real satellite previews and source metadata.
4. Scroll to the GBIF records and evidence provenance tables.

**Optional raster calculation:** click **Calculate NDVI / NBR / dNBR** if processing is configured and you want a new analysis. It may take several minutes and consume Copernicus quota. Existing successful cached analysis may already be available; you do not need to rerun it for every demo.

After successful processing, return to **Explore wildfire**, select a calculated map layer and click the map for pixel values. Masked pixels remain unavailable.

**Remember:** previews are images, not calculated indices. NDVI describes spectral vegetation characteristics; dNBR is a spectral before/after difference. Neither measures animal welfare, mortality or validated ecological recovery. Regional statistics include unburned land. Recovery images may include effects of the separate July fire.

### 3. Biodiversity comparison — load before/after observations

Click **Biodiversity comparison**.

For your first run, leave the defaults:

| Control | Default |
|---|---|
| Before window | 1–30 June 2021 |
| After-start window | 1–30 June 2023 |
| Surrounding buffer | 5 km outside the mapped extent |
| Taxonomic group | All |

Click **Retrieve comparison** and wait for the loaded status.

**Inspect these results:**

- The record-count chart and before/after table.
- Distinct recorded species and species recorded in both/only-before/only-after periods.
- Expandable species lists and taxonomic group tables.
- Date-quality, retrieval-limit and location-uncertainty warnings.

There are three location categories: **inside the mapped burned extent**, **surrounding buffer outside it**, and **uncertain location**. Records lacking sufficient location precision are kept separate from confidently classified zones.

- **Inside the mapped fire footprint:** an observation assigned to land mapped as burned on 25 June 2022. The same outline is used for both periods. A before-fire record means the place was later mapped as burned; it does not show that the animal remained there or experienced the fire.
- **Nearby comparison area (buffer):** observations outside the outline but within the selected distance measured from its boundary. A 5 km buffer is not a 5 km radius from the centre. Nearby land may have other fire effects and is not a validated experimental control.
- **Uncertain location:** records whose positions cannot be confidently assigned because precision is unknown or may cross a boundary. It is not another geographical zone or a damage level.
- **Before/after records:** eligible observations dated within your selected windows, not numbers of individual animals or upload dates.

You can change dates, group and buffer, then click **Retrieve comparison** again. Before dates must precede 15 June 2022; after dates must start after the 25 June mapped observation. Each window is at most one year; buffer range is 0.5–20 km. Prefer matching seasons and durations.

**Important:** a record is an indexed observation, not an animal count. Zero later records does not mean disappearance; more records does not mean recovery. Effort, reporting and uncertainty affect results. The separate July fire can affect later observations.

Load this comparison **before asking biodiversity questions**: it becomes part of the AI's evidence and the PDF. If retrieval fails, any previously loaded results retain their original windows.

### 4. Design for Values — understand the ethical framework

Click **Design for Values** under Tools.

1. Read the five matrix rows: **Animal welfare, Ecological recovery, Transparency, Uncertainty and Accountability**.
2. Follow a row from stakeholder concern to norm, requirement, feature and evaluation.
3. Use **Ethical value** to focus on one row.
4. Use **Stakeholder priority** to focus the stakeholder discussion below the matrix.
5. Read the value tensions, such as rapid restoration versus wildlife disturbance.

**What this means:** ethics is translated into design behaviour you can inspect. A feature being present does not prove that its ecological or ethical outcome has been achieved. There is no overall ethical score.

### 5. AI Ecological Assistant — ask about the loaded evidence

Click **AI Ecological Assistant**. Enter this first question:

> Which species were recorded before and after the fire, what do the observation counts mean, and how do the five ANWE values affect restoration?

Click **Ask configured model** and wait. Do not click repeatedly.

The answer is displayed as **plain paragraphs**, covering the evidence, ecological interpretation, uncertainties, restoration options and five values. Source-grounded numbers are written as sentences. Source links appear alongside facts and at the end; there are no JSON blocks, technical evidence panels or model metadata in the answer. Full provenance remains available in Ecological evidence and the PDF.

Additional questions for the demonstration:

> What remains uncertain, and which field surveys would be most useful before choosing an intervention?

> What are the possible animal welfare impacts of replanting, considering shelter, food, movement and breeding habitat?

> Which restoration pathway is appropriate to investigate, and what evidence would justify it?

The assistant uses real model calls. Requests use the shared account billing and caps; one controlled repair can consume a second attempt. Outputs are unvalidated drafts, not expert-approved decisions. If a request fails, the question stays in the box.

### 6. Animal Welfare Context — examine potential animal needs

Click **Animal Welfare Context**. Explore the animal groups and the five concern categories displayed in the app: **food, water, shelter, movement and breeding**. These prompts support investigation; they do not constitute a complete measured Five Domains welfare assessment.

These are authored investigation guides, not proof that those animals currently occupy the site or that their welfare has been measured. Identify which concerns need field evidence.

Click a welfare concern for any group (mammals, birds, reptiles, amphibians, invertebrates or soil biota). The popup now shows the concern, relevant reasoning from the latest AI draft, what remains unknown and field checks. General habitat reasoning is explicitly distinguished from group-specific evidence. Click **Ask AI about…** for a focused, real model assessment of that group and concern; it consumes API quota and also appears in the assistant/report. AI output never automatically changes the **Not field-verified** status.

### 7. Compare Pathways — compare options without selecting an automatic winner

Click **Compare Pathways**. Try **Side by Side**, **Stacked** and **By Species Impact**.

Compare natural regeneration, assisted ecological restoration and targeted restoration. Read conditional benefits, possible harms, inappropriate conditions and field checks.

Expand **Design for Values assessment** for each option. Check shelter, food, movement and breeding habitat, then the ecological recovery, transparency, uncertainty and accountability dimensions.

The comparison is a hypothesis-based discussion aid. It does not rank a winning option. The **Evaluation Checklist** is optional for recording further concerns; it does not certify compliance.

### 8. Expert Review & Record — record your human assessment

**Optional for downloading a demo report.** You can skip this step and go directly to Report; the PDF will be marked as an unreviewed draft. Human review remains necessary before acting on suggestions.

Click **Expert Review & Record**.

For a cautious demonstration, choose **Decision deferred** as the review status and enter your name/role, date and this rationale:

> Defer implementation until field surveys establish current habitat conditions, animal use, breeding activity and erosion risks. Compare intervention disturbance with the risks of insufficient natural regeneration.

Add challenged assumptions, unresolved risks and supporting evidence. Click **Save locally**.

To demonstrate **Human review recorded**, also select a preferred option and tick the explicit human-confirmation checkbox. Saving that status requires reviewer, date, option, justification and confirmation. Editing the review clears confirmation, so it must be checked again after reviewing the changes.

This is a local, unverified review record. It does not authenticate your qualifications or grant legal permission to act. Changing evidence may require a new review.

### 9. Report — download the professional PDF

Click **Report**.

No expert name, sign-off or completed review is required to download. Leave both privacy checkboxes off if you only want the evidence and AI-assisted draft.

1. Read the summary.
2. Leave the privacy checkboxes off for a report without reviewer identity, justification or private comments.
3. If you want those details included, select the review-details checkbox. Additional private notes require the separate notes checkbox too.
4. Click **Download PDF Report**.
5. Open the downloaded PDF. Read the six main pages in order: executive summary; wildfire/environment; biodiversity; restoration options; the five-value matrix; next steps. An additional AI assessment page appears only when an actual session draft is included.
6. Use the PDF bookmarks to jump to appendices: A satellite methods and exact values; B GBIF methods and complete retrieved species lists; C full value traceability; D sources/licences; E glossary. Full AI text and consented review details appear in F/G when available.

**Reading the numbers:** the main pages round satellite indices to three decimals; Appendix A retains their original precision. Biodiversity tables separate occurrence records from distinct species. “Inside the fire footprint” uses the same mapped June outline for both windows; before-fire records refer to places later mapped as burned. “Nearby comparison area” is the outside buffer, not a validated unaffected control. “Uncertain location” is a data-quality category, not another physical area. The report explains these meanings beside the comparison.

**No AI or review is required to download.** Without a real AI draft, the PDF explicitly states that no AI-generated ecological assessment was completed. Downloading never starts a model request. An unreviewed or deferred report remains a draft; an entered reviewer name does not verify qualifications or authorise restoration.

The inclusion choices also apply to JSON and text exports. AI questions and drafts are included, so avoid confidential questions. Unavailable analysis or incomplete review is marked explicitly; nothing is invented to fill a section.

**Export before closing/restarting.** Reviews are saved in this browser. AI turns are session-only, and restarting the server clears its validated AI-response store. After a restart, ask again before exporting an old AI draft to PDF.

## C. Quick demonstration route

For a presentation, follow this shorter sequence:

Allow roughly **7–10 minutes**, plus any API waiting time. Before presenting, start the server, reload the page and retrieve the comparison. Use existing satellite analysis if available rather than running new processing live. You may prepare one AI response in advance; keep that browser tab and server open so it remains available to the PDF.

1. **Explore wildfire:** select Culebra. Explain the documented case and acquisition-specific mapped extent.
2. **Ecological evidence:** show before/after satellite previews and an existing calculated layer if available. Explain that spectral change does not measure animal welfare.
3. **Biodiversity comparison:** retrieve the default June 2021 / June 2023 windows with 5 km buffer. Show burned/buffer/uncertain categories; explain that records are not a population census.
4. **Design for Values:** show the Animal welfare row, the requirement-to-feature chain and one conflict, such as rapid restoration versus disturbance.
5. **AI Ecological Assistant:** ask the first question in section B.5, or show the prepared answer. Explain how the evidence supports the plain-language interpretation and what remains unknown.
6. **Animal Welfare Context:** open one group's Movement concern. Show relevant AI reasoning if present; otherwise use the focused Ask AI button or explain the remaining evidence gap. This button makes another model request. Repeat for another group only if time permits.
7. **Compare Pathways:** compare natural regeneration, assisted restoration and targeted restoration. Expand one option's five-value assessment. No option is automatically approved.
8. **Report:** download the PDF with privacy checkboxes off. Expert review is optional for this demo export; show that the report is an unreviewed draft. If you want to demonstrate accountability, optionally save a deferred review before export.

A useful closing statement: **ANWE makes evidence, assumptions, value conflicts and responsibility visible; field experts still have to justify the restoration decision.**

## D. If something goes wrong

| Problem | What to do |
|---|---|
| Old interface or old AI error | Stop the old server, install updated dependencies, restart and reload with Ctrl+F5. |
| Python reports a missing module | Install requirements with the same Python executable used to start the server. |
| Port 8080 already in use | Stop your previous ANWE server. If you deliberately changed PORT in `.env`, use that port in the browser. |
| Background map tiles blocked | Restart the latest server and reload. The fire outline and review tools are independent of background tiles. |
| AI asks you to select a case | Return to Explore wildfire and click Select Culebra case. |
| AI/processing disabled | Check `.env` is beside `server.py`, then restart. Do not share its contents in screenshots. |
| Invalid biodiversity dates | Keep the before period earlier than 15 June 2022 and the after period later than 25 June; use valid windows/buffer. |
| Comparison has zero or few records | Read quality/uncertainty warnings. Try another comparable window or group; never infer absence from missing observations. |
| Model draft cannot be validated | Your question remains. Try a narrower question; do not repeatedly retry past the usage cap. |
| Authentication, billing, quota or daily-cap error | Check the provider account or wait as instructed. Share only the displayed error, without credentials. |
| Reviewed decision will not save | Fill reviewer/date/option/justification and explicitly confirm after your last edit, or choose draft/deferred. |
| PDF says the AI draft is unavailable | The server may have restarted. Reload and ask again, then export. |
| Review does not restore | Use the same browser and localhost address. Browser storage may have been cleared. |

For methods and limitations, see README.md, DATA_SOURCES.md, DESIGN_FOR_VALUES.md and TESTING.md.

## E. What the technical terms mean

| Term | Meaning and limits |
|---|---|
| GBIF | Global Biodiversity Information Facility. A network and online index of biodiversity records contributed by many organisations. ANWE uses it to find historical animal records, not to count all animals currently living in the area. |
| Occurrence record | A record that a taxon was reported at a place and time. It may come from an observation or collected specimen. Many records do not necessarily mean many animals; none does not prove absence. |
| Distinct species | Different species identified in the eligible records, counting each species once. For example, ten records of the same species still count as one distinct species. This is not the total number of species living there. |
| Taxon / taxonomic group | A biological classification, such as a species or class. In the tables, Aves means birds, Mammalia mammals, Amphibia amphibians, Insecta insects, Arachnida spiders and relatives, Squamata lizards and snakes, and Malacostraca a group of crustaceans. |
| NDVI | Normalized Difference Vegetation Index. A satellite measure of vegetation greenness using red and near-infrared light. Values usually range from -1 to 1; higher values often indicate more green vegetation. It is not a direct measure of habitat quality, recovery or animal wellbeing. |
| NBR | Normalized Burn Ratio. A satellite index using near-infrared and short-wave infrared light to investigate burned land and vegetation change. ANWE calculates it for the selected before/after images; interpretation requires context. |
| dNBR | Differenced Normalized Burn Ratio: before-image NBR minus after-image NBR. A positive value means NBR was lower in the later image, which can be associated with fire-related change. ANWE does not turn this into validated damage classes or animal deaths. |
| Index versus percentage | An index is a calculated indicator, not a percentage. A dNBR value of 0.1 does not mean ten percent damage. Differences can also reflect drought, season, clouds and other influences. |
| Sentinel-2 / Copernicus | Sentinel-2 is a satellite mission in Europe's Copernicus Earth-observation programme. Its images provide the light measurements used for ANWE's vegetation indices. A full-tile preview is an overview image, not a calculated index map. |
| Level-2A / surface reflectance | Satellite imagery processed to estimate light reflected by the ground after atmospheric correction. This supports index calculations but does not remove every cloud, smoke or measurement problem. |
| CEMS / EMSR580 | Copernicus Emergency Management Service supplies disaster mapping. EMSR580 identifies the mapping activation used for this wildfire. ANWE displays its mapped burned extent observed on 25 June 2022, generalised for display. |
| EFFIS | European Forest Fire Information System. A source of European wildfire information. Historical June perimeter and severity data were not retrieved for this demo; the CEMS outline is a separate source. |
| Burned perimeter / extent | The mapped fire footprint: land mapped as burned on 25 June 2022. The same outline classifies records in both periods. Before-fire records refer to places later mapped as burned, not animals known to have experienced the fire. The outline is generalised, not an exact final boundary. |
| Buffer | Nearby comparison land outside the mapped fire footprint, extending the selected distance outward from its boundary. A five-kilometre buffer is not a radius from the centre. This land is not necessarily unaffected by fire or a validated experimental control. |
| Spatial uncertainty | The reported point is within the selected study footprint, but location precision is unknown or could cross a boundary. Such records are not confidently assigned to the inside/nearby categories. Uncertain is a data-quality category, not a third physical area or a damage class. |
| Pixel / raster / masked pixel | A raster is a grid of image cells called pixels. Each cell represents ground area. Masked pixels are excluded because of cloud, shadow, water, missing data or quality checks; a blank pixel is not evidence of no damage or no animals. |
| Mean / valid pixels | The mean is the arithmetic average of usable values. Valid pixels are the cells that passed the analysis checks. ANWE's regional mean includes unburned land and does not describe every location or only the fire perimeter. |
| Observed / Derived / Hypothetical / Unknown | Observed: retrieved source records. Derived: results calculated using a stated method. Hypothetical: a plausible possibility requiring verification. Unknown: no adequate supporting information. These labels describe evidence status, not certainty that a conclusion is correct. |
| Design for Values / DfV | The ethical framework connecting stakeholder concerns to values, norms, design requirements, features and evaluation. ANWE considers Animal welfare, Ecological recovery, Transparency, Uncertainty and Accountability separately, without one overall ethical score. |
| Field verification / expert review | Field verification means checking conditions on the ground, such as animal use, refuges, breeding activity and erosion. Expert review means a qualified person evaluates the evidence and decision. A downloadable draft or AI answer is not permission to implement restoration. |

Sources: [GBIF dataset documentation](https://techdocs.gbif.org/en/data-publishing/dataset-classes), [USGS NDVI](https://www.usgs.gov/landsat-missions/landsat-normalized-difference-vegetation-index), [USGS NBR](https://www.usgs.gov/landsat-missions/landsat-normalized-burn-ratio). ANWE-specific definitions describe the implemented workflow.
