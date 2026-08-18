# CivicSage

CivicSage is a civic intelligence dashboard designed to surface blind spots in public service operations by comparing operational KPIs, citizen feedback, and historical case data. The project is built to help identify mismatches between administrative resolution metrics and citizen-perceived outcomes, making it easier to flag issues such as premature case closure, rising repeat complaints, or weak evidence quality.

## What the project does

The application has three core goals:

1. Monitor service delivery signals in one place.
2. Detect contradictions between official performance metrics and citizen experience.
3. Provide an investigation workflow to explain and review possible root causes.

The dashboard includes:

- summary cards for key metrics
- KPI trend analysis
- blind spot detection
- reality-check analysis
- evidence chain review
- impact-tracker comparison
- investigation brief and human review workflow

## Project structure

### Backend

The backend lives under the `backend` folder and is built with FastAPI.

It exposes API endpoints for:

- dashboard summary data
- reality-check analysis
- blind spots
- investigations
- evidence chain
- impact tracking

The backend reads structured JSON datasets from the `backend/data` folder and serves them through typed API responses.

### Frontend

The frontend lives under the `frontend` folder and is built with Next.js and React.

It renders the dashboard and analysis screens for:

- home dashboard
- reality check page
- blind spots page
- investigations page
- evidence page
- impact tracker page

## Data sources

The project uses synthetic demo data created for a civic operations prototype. The data is intentionally illustrative and not sourced from a real government system.

These files are in `backend/data`:

- `kpis.json` — summary metrics, KPI cards, trend data, and dashboard alert text
- `citizen_signals.json` — repeat complaints, follow-up contacts, response-rate trends, and escalation patterns
- `historical_cases.json` — district-level historical performance snapshots and case health indicators
- `operations.json` — processing times, SLA compliance, reopen counts, and closure performance over time

This dataset was assembled to simulate the kind of contradictions that can appear in civic service systems:

- administrative metrics rising while citizen complaint signals worsen
- higher case closure performance without better citizen satisfaction
- increasing repeat-contact behavior despite improved SLA and processing efficiency

## Why this project exists

Many public-service systems track efficiency using official internal metrics, but they can miss whether citizens actually feel the issue was resolved. This project demonstrates how a civic dashboard can combine operational data and citizen feedback to reveal possible blind spots in the system.

## How the app works

1. The FastAPI backend loads JSON datasets from `backend/data`.
2. The backend exposes structured API responses for each dashboard section.
3. The React frontend calls those endpoints using a shared client helper.
4. Each screen displays loading/error states and renders response data into cards, charts, and investigation briefs.

## Local setup

### Backend

```bash
cd backend
python -m venv .venv
. .venv/bin/activate   # Linux/macOS
# or .venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open:

- frontend: http://localhost:3000
- backend API: http://127.0.0.1:8000

## API overview

The backend exposes these main routes:

- `GET /health` — health check
- `GET /api/dashboard` — dashboard summary payload
- `POST /api/reality-check` — perform reality-check analysis on the service signals
- `GET /api/blind-spots` — list detected blind spots
- `GET /api/investigations` — fetch investigation data
- `POST /api/investigations/{id}/review` — accept, modify, or reject an investigation
- `GET /api/evidence` — display evidence chain and source metadata
- `GET /api/impact-tracker` — show before/after impact metrics
