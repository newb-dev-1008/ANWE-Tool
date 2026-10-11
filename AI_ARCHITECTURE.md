# AI architecture

The browser sends a question and the current evidence snapshot version to the local Python backend. It cannot supply trusted measurements. The backend owns evidence from documented CEMS data, queried CDSE metadata, GBIF records and completed raster analyses. Reviewer imports remain separate. Snapshot IDs derive from sorted evidence records; mismatches fail closed and require refreshing.

## Actual model integration

`backend/ai.py` calls the OpenAI Responses API with a configured server-side key/model and strict structured outputs. See the [official Responses structured-output guide](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses). There is no template pretending to be model output. No key/model means HTTP 503 and a disabled interface. Incomplete responses, refusals, invalid JSON, authentication/rate-limit errors and invalid output are shown as failures, without substitute answers. Live OpenAI responses could not be tested because credentials were absent; a mocked provider test checks the request and failure handling, not model quality.

The bounded context contains official case records, up to 18 relevant indexed animal records and up to four catalogue records, plus available measurements. The answer reports exactly which evidence was supplied; not all regional records necessarily enter a model request. Prompts distinguish observations, derived metrics, hypotheses and unknowns; include animal welfare across guilds; consider passive recovery, assisted natural regeneration and active intervention; and require human oversight. Source text and questions are untrusted and cannot authorise changes to the instructions.

## Grounding design and limits

The model selects factual evidence IDs from a schema enum. Observed facts shown to the user are rendered from server-owned records, rather than free model-authored measurements. Model-written hypotheses, unknowns, benefits, harms, field checks and inappropriate conditions are separate. The backend validates all references, exactly three alternatives, output structure, numeric/URL restrictions in free prose and prohibited authority claims. Unknown references, fabricated citations and invented numeric assertions fail closed.

These checks do not prove semantic truth or prevent every qualitative hallucination. The assistant has no field observations, no tool to authorise action and no automatic intervention. Expert judgement is necessary; references alone do not validate a causal claim. The JSON/text reports preserve model identity, timestamp, question, evidence snapshot, source references and separate human conclusions.

## Security, privacy and cost

Secrets load from local `.env` or environment; no key is returned to JavaScript. Static routes are allowlisted and deny `.env`, backend, Git and runtime files. Mutation routes require a random session token, JSON content type and same-origin/Host checks. There is no cross-origin API access. Model requests use `store:false`; this does not override the provider's applicable data policies. Questions and supplied evidence are transmitted to OpenAI. Avoid personal or confidential information. Exact GBIF coordinates are suppressed before model context/export.

The local server has one concurrent model request, a ten-second cooldown, bounded question/output size and a persistent daily attempt cap (default 20, maximum 100). Failed provider attempts also consume the cap. No automatic model retries. Satellite processing has its own concurrent lock, default three attempts per UTC day, and local result caching. Deleting runtime state resets local counters; these are prototype safeguards, not a billing guarantee or production identity/quota system. Use provider project limits. The server binds to loopback; public deployment needs authentication, TLS, external rate enforcement and a deployment security review.
