# agents.md

## Purpose

This document defines lightweight AI usage and prompting rules for DeNode.

## AI scope for this project

- AI is optional and non-blocking.
- Core decision logging must work without AI.
- If AI is used, it should assist reflection quality (for example summarization), not replace user judgment.

## Implementation rules

1. Keep AI logic isolated in a dedicated service module under `backend/app/services/`.
2. Never mix AI prompting logic directly in route handlers.
3. Never hardcode secrets or API keys in source code.
4. Support a mock/stub mode for local development and tests.
5. AI failures must never break decision CRUD or outcome update flows.

## Prompting rules

- Use clear, deterministic prompts.
- Ask for concise outputs (short bullet summaries).
- Preserve user-provided meaning; avoid adding new facts.
- Prefer neutral wording and avoid prescriptive advice.

### Example prompt template (if added later)

"You are an assistant helping summarize a decision reflection.\nSummarize the reflection notes in 3 bullets and extract up to 3 lessons learned.\nDo not invent details not present in the input."

## Safety and privacy

- Treat all decision text as sensitive user content.
- Do not log raw prompts/responses in production by default.
- Redact or minimize personal data before external model calls.

## Recommended fallback behavior

If AI is unavailable:

- Return a deterministic fallback response (for example, `summary: null`, `lessons: []`).
- Keep endpoint/API contract stable.
