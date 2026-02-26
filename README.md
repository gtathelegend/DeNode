# DeNode

DeNode is a minimal full-stack product for logging decisions, reviewing outcomes later, and capturing lessons learned.

## What the product does

- Create decisions with title, context, optional options considered, and confidence level (1-5).
- Review decisions later by adding an outcome (`success`, `neutral`, `failure`), reflection notes, and lessons learned.
- Browse all decisions and filter by outcome and confidence level.

## Tech stack

- Backend: Python 3, Flask (REST API), SQLAlchemy ORM, SQLite
- Frontend: React (functional components + hooks), React Router
- Styling: Minimal CSS
- Auth model: Single-user default (`user_id` defaults to `local-user`)

## Project structure

```text
backend/
   app/
      models/
      routes/
      schemas/
      services/
   tests/
frontend/
   src/
      components/
      pages/
      services/
agents.md
README.md
```

## Key technical decisions

1. **Application factory pattern (Flask)**
    - Enables clean startup configuration and easy testing.

2. **Normalized relational schema**
    - `decisions` stores decision metadata.
    - `decision_outcomes` stores review/outcome data in a one-to-one relation.
    - Keeps creation and review concerns separate.

3. **Service layer split by concern**
    - `routes/` handles HTTP in/out.
    - `schemas/` handles payload validation + serialization.
    - `services/` handles business logic and error contracts.

4. **Single API service in frontend**
    - All requests are centralized in `frontend/src/services/api.js` for consistency and easy future changes.

## API summary

- `POST /decisions`
- `GET /decisions?outcome=<success|neutral|failure>&confidence_level=<1..5>`
- `GET /decisions/<id>`
- `PUT /decisions/<id>/outcome`

## Tradeoffs

- SQLite is ideal for local MVP speed, but not for high-concurrency production workloads.
- No complex auth/permissions are included by design (single-user assumption for MVP).
- Validation is explicit and lightweight (custom schema helpers) instead of adding another heavy abstraction.

## AI usage

AI is intentionally optional in this MVP.

- Current implementation: no external AI API call in runtime flow.
- AI-ready extension point: add a module under `backend/app/services/` (for example, `ai_reflection_service.py`) and call it after outcome submission to summarize reflections.
- See `agents.md` for prompt and safety guidance.

## Run locally

### 1) Backend

```bash
cd backend
py -3 -m pip install -r requirements.txt
py -3 init_db.py
py -3 run.py
```

Backend runs at: `http://127.0.0.1:5000`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://127.0.0.1:5173`

Optional API base URL override:

```bash
set VITE_API_BASE_URL=http://127.0.0.1:5000
```

## Tests

From `backend/`:

```bash
set PYTEST_DISABLE_PLUGIN_AUTOLOAD=1
py -3 -m pytest -q
```

