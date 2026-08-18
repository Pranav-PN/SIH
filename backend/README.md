# CivicSage Backend

A lightweight FastAPI backend for the CivicSage prototype.

## Purpose

The backend powers the existing dashboard, reality-check analysis, blind spot detection, investigation workflow, evidence chain, and impact tracker UI without replacing the frontend.

## Stack

- FastAPI
- Pydantic
- Python-dotenv
- Gemini API integration
- JSON-based synthetic data layer

## Environment

Create a local `.env` file in this directory with:

```bash
GEMINI_API_KEY=your_key_here
```

Do not commit the real key.

## Running locally

From the backend directory:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Health check

```bash
curl http://localhost:8000/health
```

## API docs

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Notes

This is an SIH prototype using synthetic administrative data and a Gemini-backed analysis layer. AI findings are advisory and require human review.
