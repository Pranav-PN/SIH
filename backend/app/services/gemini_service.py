from __future__ import annotations

import json
from typing import Any

from app.config import Settings

try:
    from google import genai as google_genai
except Exception:  # pragma: no cover
    google_genai = None


class GeminiService:
    def __init__(self) -> None:
        self.api_key = Settings.GEMINI_API_KEY
        self.client = None
        self.enabled = bool(self.api_key) and google_genai is not None
        if self.enabled:
            try:
                self.client = google_genai.Client(api_key=self.api_key)
            except Exception:
                self.client = None
                self.enabled = False

    def generate_analysis(self, payload: dict[str, Any]) -> dict[str, Any]:
        if not self.enabled or self.client is None:
            return {
                "status": "fallback",
                "finding": "Insufficient evidence",
                "confidence": "Low",
                "explanation": "Gemini is unavailable in this environment. Human review is required.",
            }

        prompt = self._build_prompt(payload)

        try:
            response = self.client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
            text = getattr(response, "text", "")
            if not text:
                return {
                    "status": "fallback",
                    "finding": "Insufficient evidence",
                    "confidence": "Low",
                    "explanation": "Gemini returned no usable output.",
                }
            return self._parse_response(text)
        except Exception:
            return {
                "status": "fallback",
                "finding": "Insufficient evidence",
                "confidence": "Low",
                "explanation": "Gemini request failed. No autonomous decision was made.",
            }

    def _build_prompt(self, payload: dict[str, Any]) -> str:
        return f"""
You are a cautious public-administration analyst.
Analyze the following synthetic data only. Do not invent evidence.
Use only the supplied data. Distinguish evidence from hypotheses.
Clearly state uncertainty. Never claim causation from correlation.
Return a brief JSON object with keys: finding, confidence, evidence, uncertainty, recommendation.

Data:
{json.dumps(payload, ensure_ascii=True, indent=2)}

Rules:
- If evidence is insufficient, return finding = "Insufficient evidence".
- Keep conclusions advisory only.
- Require human investigation before any decision.
- Clearly label AI-generated conclusions.
"""

    def _parse_response(self, text: str) -> dict[str, Any]:
        cleaned = text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`")
            if cleaned.lower().startswith("json"):
                cleaned = cleaned[4:].strip()

        try:
            data = json.loads(cleaned)
            if isinstance(data, dict):
                return {
                    "status": "success",
                    "finding": data.get("finding", "Insufficient evidence"),
                    "confidence": data.get("confidence", "Low"),
                    "evidence": data.get("evidence", "No evidence provided."),
                    "uncertainty": data.get("uncertainty", "Evidence is limited."),
                    "recommendation": data.get("recommendation", "Human review required."),
                }
        except Exception:
            pass

        return {
            "status": "success",
            "finding": "Insufficient evidence",
            "confidence": "Low",
            "evidence": text[:200],
            "uncertainty": "Model output could not be parsed safely.",
            "recommendation": "Human review required.",
        }


def get_gemini_service() -> GeminiService:
    return GeminiService()
