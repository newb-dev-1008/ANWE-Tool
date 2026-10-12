# ANWE 4.0 AI architecture

The browser submits a question and evidence snapshot version. It cannot supply trusted measurements. The backend assembles CEMS observations, CDSE metadata, completed raster results, indexed animal records and the loaded GBIF temporal comparison. Reviewer notes and species coordinates are excluded from model input. User questions and source text are untrusted instructions.

## Structured, source-grounded output

`backend/ai.py` calls the actual OpenAI Responses API with a configured model, `store:false` and a strict JSON schema. The [official structured-output guide](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses) documents string constraints and schema-based output. Missing keys disable the endpoint; no simulated answer is generated.

Output includes a summary, observed references, factual field selections, hypothetical implications, unknowns, three restoration options, five separate DfV assessments and `humanReviewRequired:true`.

For a numerical fact or date, the model selects `{evidenceId, field}`. It cannot provide a value. The backend validates that pair and inserts the exact source value. Dates, GBIF counts, NDVI/dNBR and genuinely available area measurements can therefore appear without inventing measurements. No area is fabricated when the source contains none. Factual panels retain Observed/Derived labels and source references. Conditional narrative is Hypothetical; absent information is Unknown.

## Validation mismatch fixed

The previous digit ban rejected source labels such as Sentinel-2. It also risked rejecting explicit denials of approval. The new schema allows known source labels in qualitative text; quantitative material is selected through factual fields. Checks reject unknown IDs/fields, supplied model values, invalid structure, missing values/pathways, links/inline citations and unsupported numeric prose. Explicit denials of certainty/approval are allowed; positive authority claims remain rejected.

Format and reference validation cannot prove semantic truth. Qualitative hallucinations, inappropriate hypotheses and misleading source selection remain possible and require ecological review. Source-backed numbers do not establish representative sampling.

## Five values and temporal evidence

Instructions address animal shelter, food, movement and breeding; vegetation, structure, regeneration and soil; assumptions and methodology; evidence gaps and field checks; and human responsibility. All five values and all three pathways are required. No ethical score or automatic planting default is produced.

The temporal comparison includes selected periods, burned extent, outside buffer, uncertain locations, groups, species samples, retrieval limits and quality. Context is bounded: at most thirty species names per zone/period, eighteen relevant occurrence records and four catalogue records. Missing later records do not establish disappearance; increased records do not establish recovery or population growth. Later records may include July-fire effects.

## Controlled repair and errors

Invalid structure or incomplete generation is logged as a fixed validation category, timestamp and attempt number in ignored `.runtime/ai-validation.jsonl`. Raw answers, questions, prompts and secrets are not logged. One concise regeneration is attempted using the same question/evidence and the validation category. It consumes another attempt from the daily cap. The invalid answer is neither displayed nor trusted as evidence.

Refusal, authentication, rate-limit and network errors are not automatically retried. If repair fails, a readable error appears and the question is preserved. Valid responses remain in a bounded server-session store; PDF exports retrieve them by ID rather than trusting browser-supplied AI prose. Restart clears this store: ask again or omit old drafts before PDF export.

## Security, privacy and cost

Keys stay in ignored `.env` or environment variables. Static routes are allowlisted. Mutations require JSON, same-origin/Host validation and a random session token. The server binds to loopback; public hosting requires authentication and deployment security work.

One concurrent model request, a user-request cooldown, bounded input/output and a persistent daily attempt cap limit usage. Repairs count toward that cap. Request counts do not guarantee a currency budget; use provider limits. Questions/source context are transmitted to OpenAI, and `store:false` does not override provider data policies.

PDF, JSON and text exports omit personal review details by default. Review details require explicit selection; additional notes require separate selection. Reports include AI questions/drafts, so avoid confidential questions. Species coordinates remain withheld.

An actual model request and browser/PDF workflow passed on 12 October 2026. See TESTING.md for scope and limits. Mocked tests do not establish live answer quality.
