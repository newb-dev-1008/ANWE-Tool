## Easiest way to use the tool

1. **Understand the case:** click **Load case evidence**, then **Load regional context**.
2. **Compare options:** in **What should we consider?**, describe your concern in ordinary language. For example: "Wolves may use this woodland; machinery work is proposed. What should we check before restoration?" State whether this is a hypothetical concern, a reported sighting or a field survey, and give a non-sensitive source/date if available. Do not enter exact den locations.
3. Click **Suggest an approach**. **Try a wolf example** fills in a clearly hypothetical example; it does not add a local wolf observation.
4. Read the primary suggestion. Open alternatives and animal-support checks if needed. AI should explain how your concern affects the choice, what is unknown and what evidence could change the advice.
5. Click **Discuss this option** when available, or continue to **Explain and export**. Human experts decide whether to accept, adapt, reject or defer the suggestion, then record why.

Your question is sent to the configured AI provider and included in reports. It is held for the current page session; save important source information separately. User notes are not independently verified dataset evidence. A wolf mentioned in your question may be discussed conditionally; a species card requires an actual retrieved animal record. Habitat support is not treatment of an injured animal.

---

# Tierra del Fuego — the simple demo

**One case. Three steps. About 3–5 minutes.**

Animals' welfare interests deserve consideration. This project gives them modest priority in closely balanced choices, while human safety, essential needs and unavoidable harms still require a reasoned decision.

## Start

Start the server from the ANWE-Tool folder, using your configured Python environment:

```powershell
C:/Users/alvar/anaconda3/python.exe server.py
```

Open **http://localhost:8080** and press **Ctrl+F5**. Stop an older server with Ctrl+C and restart first. On another computer, follow README.md to install dependencies.

## 1. Understand the case

Use **Select a forest-fire case** at the beginning of the first screen. **Sierra de la Culebra - June 2022** is selected and is the only available demo case. The sidebar scrolls on smaller screens; use the menu button on mobile.

- Read the starting principle and the three evidence summaries.
- **Load case evidence** optionally retrieves historical observations for June 2021 / June 2023, all groups, with a 5 km outside buffer. Retrieval may use cached results and can take time.
- Current animal use still needs field checks. Satellite indicators and observation counts do not measure welfare.
- Click **Compare options**. You can continue when evidence is incomplete.

For a short live demo, use available evidence rather than waiting for a new retrieval.

## 2. Compare options

Read the three short comparisons:

1. **Allow natural regeneration:** monitor recovery and limit new work.
2. **Make targeted repairs:** address a specific verified problem.
3. **Restore habitat actively:** rebuild a verified missing habitat function.

Each shows **For animals**, **For people**, and **Before choosing**. These are conditional possibilities, not measured local outcomes. There is no automatic winner.

Click **Consider this option**, or **I need more evidence** if you cannot choose. Animal concerns, AI help and detailed trade-offs are optional expandable sections.

## 3. Explain and export

Select an option to investigate, or leave it undecided. Answer:

- **What kind of human need is involved?** Safety/basic needs; livelihoods/essential services; preferences/convenience; or not established yet.
- **Who needs what, and what happens if we wait?** Describe affected people, urgency and evidence. This is your input, not an AI finding.
- **How could we meet the need with less animal harm?** Consider timing, smaller work areas, refuges and monitoring.
- **Why this option, or why wait?** Explain the trade-off and missing evidence. If animal interests are outweighed, explain necessity and proportionality.

Choose **Need more evidence** or **Option to investigate — unreviewed draft**, then **Save draft in this browser**. A name is not required for a demo draft. Saving is local to this browser, not shared with your team.

Click **Download PDF**. Decision notes and reviewer details are excluded by default. Tick **Include my decision details** only if you want those details in the PDF. Additional private notes remain excluded.

The PDF is a discussion draft, not permission to begin restoration. If it includes an AI draft, export before restarting the server because AI sessions are temporary.

## An example for presenting

**Illustrative only, not a verified Culebra finding:** residents need safe road access. An inspection must establish which trees are hazardous. Consider selective roadside work rather than clearing the whole area, survey refuges first, and defer the final choice until safety and wildlife checks are complete.

This demonstrates a serious human need alongside animal interests without inventing local evidence.

## Optional details

Open **Evidence & advanced tools** for the map, satellite processing, biodiversity counts, AI assistant, animal concerns, detailed comparisons, ethical framework, qualified review and other exports.

AI requests and new satellite processing are optional, explicit actions that can use provider quotas. The three-step demo requires neither. Qualified review and applicable permissions remain necessary before action.

- [Ethical argument and limits](ETHICAL_BASIS.md)
- [Detailed evidence and review instructions](ADVANCED_GUIDE.md)
- [Technical definitions](GLOSSARY.md)

If a source fails, it stays unavailable; the app does not invent replacement measurements. Your draft remains in memory if local saving fails, so export it before leaving.

## Visible AI decision guide

1. In **Understand the case**, load case evidence, then **Load regional context**. The latter retrieves mapped settlements and economic land-use proxies from OpenStreetMap and checks up to twelve sampled animal taxa against the conservation categories provided by GBIF from IUCN. A source can be unavailable; do not replace missing facts with assumptions.
2. In **Compare options**, press **Get AI guidance**. The assistant uses the server's loaded evidence to suggest a provisional pathway, explain alternatives, or recommend deferring. Expand its reasoning to see missing evidence and source links. The static cards remain authored comparisons; the labelled AI recommendation is generated on request.
3. In **Explain and export**, enter the human need and animal safeguards. To have AI consider these notes, explicitly tick **Include my human-needs and animal-safeguard notes** and ask again. These notes go to the configured model; leave confidential details out. AI questions and drafts are included in reports and may repeat shared notes even when the separate decision-details checkbox is off. The assistant does not change your choice or approve work.
4. Save your own reasoned decision and download the report. Current-session AI responses are included using the existing report pipeline. Re-run guidance after changing evidence or notes.

Settlement distances refer to representative mapped points and the generalised June fire footprint, within the regional search window. They do not measure distance from every house to forest. These are contemporary mapping data, not a reconstruction of the historical fire. Land-use counts are mapped features, not area, employment or economic loss. Population, evacuation capability and actual fire danger are unknown. IUCN concerns extinction risk of species, not the welfare of individual animals or confirmed current local presence.

The app is a restoration decision aid, not a live fire warning service. Geographic proximity alone cannot establish whether lives are at risk. That requires hazard, vulnerability, occupancy and emergency-service information. Municipal census and livelihood statistics are not yet integrated.

## AI supports; human experts decide

AI suggests a possible restoration approach and explains the evidence, trade-offs and uncertainties. Human experts discuss that suggestion and decide whether to accept, adapt or reject it, or collect more evidence. The recorded decision and its justification belong to the human reviewers. AI does not select an option automatically or authorise restoration work.

## Activate Gemini (free-tier option)

The local configuration now selects Gemini. It remains disabled until you supply a valid key.

1. Open [Google AI Studio API keys](https://aistudio.google.com/apikey), sign in and create a key for your project. For zero provider charges, use an eligible free-tier project without billing enabled. Check Google's current availability, limits and pricing for your account.
2. Open your private `.env` and fill in these settings (preserve the other settings):

```dotenv
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
```

3. Restart `python server.py` (or your usual Anaconda Python command), then refresh the app.
4. Load evidence, open **Compare options**, and click **Get AI guidance**. The model name appears with the returned suggestion. Human experts discuss and decide.

The provider key stays on the backend and is never bundled into browser assets or committed. On a shared deployment, users do not need their own keys; independent local installations need their own backend configuration.

Free quota is limited and subject to change. The app cannot verify whether Google has enabled billing on your project. It keeps its daily request cap, stops on quota errors and never switches automatically to the paid OpenAI provider. One validation repair can consume an additional request. Google lists free-tier content as potentially used to improve its products; do not submit confidential notes. See [pricing and data-use information](https://ai.google.dev/gemini-api/docs/pricing) and [structured-output documentation](https://ai.google.dev/gemini-api/docs/structured-output).

Optional: set `AI_PROVIDER=openai` explicitly to use your existing OpenAI configuration instead. Gemini and OpenAI responses use the same evidence validation, prose display and report pipeline.

### Settlement source fallback and current Gemini model

The settlement loader first tries OpenStreetMap/Overpass. If that service is unavailable, it uses the GeoNames Spain gazetteer and clearly identifies the fallback. It selects populated-place records within the regional search window and calculates their representative-point distances to the mapped CEMS footprint. The full retrieved count may exceed the thirty nearest records retained for display. GeoNames is attributed under CC BY 4.0; its records are not verified current occupancy or a fire-risk assessment. When this fallback is used, economic land-use data remain unavailable.

The configured model is now `gemini-3.5-flash-lite`. Google rejected generation with the previously selected older model for this account even though a model-information request succeeded. A live generated assessment with the new model has passed server validation. Restart the backend after updating these settings.

For the full evidence context, `AI_MAX_OUTPUT_TOKENS=4000` is configured to allow the complete structured assessment. Lower limits may truncate it; truncated output is rejected rather than displayed as complete advice.

## Read the new AI result

- **Primary suggestion:** one provisional restoration approach, why it is suggested and what would change it. If choosing a pathway is not defensible, the primary step is field verification.
- **Other options:** expand an alternative to compare its benefit, trade-off and required check.
- **Which animals could we support?** Up to three species selected from retrieved animal observations. Each card gives a conditional habitat-support idea and a field check. Open the card for its historical source record. This is not a list of confirmed injured animals or species known to need rehabilitation today.
- **Discuss this option:** explicitly selects the option for the human decision form. AI never selects it automatically. Experts can accept, adapt, reject or defer the suggestion.

Evidence, source links, uncertainty and sharing details are collapsed to keep the main view short. Re-run the suggestion to use the new format for older answers. Habitat restoration differs from rescue/treatment of injured individuals, which requires qualified wildlife professionals.

### Simplified presentation layout

The main screens use a dark sidebar and orange highlights. Step two focuses on your question; manual option cards sit under **Prefer to compare the options yourself?**. On step three, open **Review or update the AI suggestion** if needed; your human decision form remains the main task. Regional records and limitations are expandable. The demo status note is a page footer and does not cover controls.
