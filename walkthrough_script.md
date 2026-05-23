# DeNode Walkthrough Script (10–15 minutes)

## 0) Opening (30–45 sec)

Hi everyone — this is a quick walkthrough of **DeNode**, a minimal full-stack app for capturing decisions, reviewing outcomes, and extracting lessons learned.

In this walkthrough, I’ll cover:
1. Architecture
2. Project structure
3. Technical decisions and tradeoffs
4. AI usage strategy
5. Key risks
6. How we can extend this cleanly

---

## 1) Product framing (1 min)

At a product level, DeNode solves a simple but common gap: we make decisions, but we rarely close the loop.

So the app supports a two-stage workflow:
- **Stage 1:** Create a decision with title, context, options considered, and confidence level.
- **Stage 2:** Later, attach an outcome — success, neutral, or failure — with reflection notes and lessons learned.

That separation is intentional: decision capture and decision review happen at different times, and the data model reflects that.

---

## 2) Architecture overview (2 min)

DeNode is a classic split frontend/backend architecture:

- **Frontend:** React + React Router, functional components and hooks.
- **Backend:** Flask REST API with SQLAlchemy.
- **Database:** SQLite for MVP speed.

The request flow is straightforward:
1. React pages call a centralized API client.
2. Flask routes receive HTTP requests.
3. Routes validate payloads via schema helpers.
4. Service layer runs business logic.
5. SQLAlchemy persists/fetches from SQLite.
6. Responses are serialized back to JSON and rendered in the UI.

This keeps concerns separated and makes each layer easier to test and replace.

---

## 3) Project structure walkthrough (2–3 min)

### Backend

Under `backend/app/`, the code is split by responsibility:

- `models/` — persistence entities:
  - `Decision`
  - `DecisionOutcome`
- `routes/` — HTTP endpoints:
  - create, list, detail, and outcome upsert
- `schemas/` — validation + serialization
- `services/` — business logic and domain errors

Important design point: route handlers stay thin. They mostly parse input, call validators and services, and return structured responses.

### Frontend

Under `frontend/src/`:

- `pages/` define route-level screens:
  - list
  - create
  - detail
- `components/` holds reusable UI units like filters and outcome form
- `services/api.js` centralizes all API calls

This means pages focus on UI state, while API wiring is in one place.

---

## 4) Core technical decisions (3 min)

### Decision 1: Flask application factory

`create_app()` is used instead of global app setup.

Why it matters:
- Better configurability across environments.
- Easier tests using in-memory SQLite.
- Cleaner composition of extensions and error handlers.

### Decision 2: Normalized one-to-one decision/outcome model

The app stores base decision data in `decisions` and review data in `decision_outcomes` with one-to-one linkage.

Why this is good:
- Creation and review are decoupled.
- Null-heavy “single table for everything” design is avoided.
- Domain lifecycle is clearer.

### Decision 3: Layered validation

Validation exists at two levels:
- Schema-level checks in Python helpers for payload quality and messages.
- Database constraints for confidence range and allowed result values.

This gives defense in depth: cleaner API errors plus DB integrity guarantees.

### Decision 4: Central API service on frontend

All fetch logic lives in one module.

Benefits:
- Consistent error handling.
- Easier future additions like auth headers, retries, telemetry, or interceptors.

### Decision 5: Explicit, lightweight MVP choices

This codebase intentionally avoids heavy abstractions.
That keeps onboarding fast and the architecture legible for iteration.

---

## 5) API + user flow in one minute (1 min)

The API surface is intentionally small:
- `POST /decisions`
- `GET /decisions` with optional filters
- `GET /decisions/<id>`
- `PUT /decisions/<id>/outcome`

Typical user flow:
1. User creates a decision.
2. It appears in the list with confidence.
3. User opens detail view.
4. After outcome is known, user submits reflection and lessons.
5. Decision is now “closed loop” and becomes learning data.

---

## 6) AI usage approach (1–2 min)

AI is **optional and non-blocking** by design.

Current state:
- No external AI call in runtime flow.
- Core decision CRUD and outcome updates work fully without AI.

Governance from `agents.md` is clear:
- Keep AI isolated under `backend/app/services/`.
- Do not put prompts in route handlers.
- Never hardcode keys.
- Support mock/stub mode.
- AI failures must not break core flows.
- Prompts should be deterministic, concise, and non-fabricating.

So AI is treated as a quality enhancer for reflections, not a system dependency.

---

## 7) Risks and tradeoffs (2 min)

### Current MVP risks

1. **SQLite scalability risk**
   - Great for local MVP speed, limited for high concurrency and production scale.

2. **Open CORS policy**
   - Useful during development, should be restricted in production.

3. **No auth/authorization**
   - App is currently single-user by assumption (`local-user`).
   - Multi-user scenarios need identity, tenancy boundaries, and access control.

4. **Limited test depth**
   - Core API paths are covered, but edge cases and frontend behavior can be expanded.

5. **Error handling granularity**
   - Good baseline, but production observability and structured logging are still needed.

### Why acceptable right now

For MVP objectives — validate value, keep delivery fast, and preserve clarity — these are reasonable tradeoffs.

---

## 8) Extension approach (2 min)

Here’s the extension strategy that preserves architecture quality.

### Near-term extensions

1. **AI reflection summarization (optional)**
   - Add `backend/app/services/ai_reflection_service.py`.
   - Trigger after successful outcome upsert.
   - If AI fails, return deterministic fallback (`summary: null`, `lessons: []`).

2. **Production readiness pass**
   - Move SQLite to Postgres.
   - Add migrations.
   - Tighten CORS and environment-specific config.

3. **Auth and user boundaries**
   - Add login, identity propagation, and decision ownership checks.

4. **Analytics and learning loop**
   - Add dashboards: confidence vs. outcome trend, recurring lesson themes.

5. **Testing expansion**
   - Add API edge-case tests and frontend integration tests around full create-review flows.

### Architectural rule for all extensions

Keep the existing layering contract:
- Route = transport
- Schema = input/output contract
- Service = business rules
- Model = persistence

Following this rule prevents complexity drift as features grow.

---

## 9) Closing (30–45 sec)

To summarize:
- DeNode is intentionally minimal, but structurally clean.
- The architecture separates concerns clearly across backend and frontend.
- Technical decisions prioritize clarity, testability, and safe iteration.
- AI is intentionally optional, isolated, and failure-tolerant.
- The extension path is straightforward without rewriting core foundations.

If useful, I can next walk through a concrete phase-1 roadmap with estimated effort by milestone.
