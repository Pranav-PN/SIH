from __future__ import annotations

from app.services.contradiction_service import detect_contradictions
from app.services.data_loader import load_citizen_signals, load_dashboard_data, load_operations_data
from app.services.gemini_service import get_gemini_service


def get_reality_check() -> dict:
    dashboard_data = load_dashboard_data()
    citizen_signals = load_citizen_signals()
    operations = load_operations_data()

    contradictions = detect_contradictions(dashboard_data, citizen_signals, operations)
    if not contradictions:
        return {
            "status": "success",
            "kpiAnalyzed": "Resolution Rate ↑ 12%",
            "contradictingSignals": ["No material contradiction detected"],
            "finding": "Insufficient evidence",
            "confidence": "Low",
            "requires_investigation": False,
            "blind_spots": [],
            "evidence_strength": "Low",
        }

    payload = {
        "kpis": dashboard_data.get("kpis", []),
        "citizen_signals": citizen_signals,
        "operations": operations,
        "contradictions": contradictions,
    }

    ai = get_gemini_service().generate_analysis(payload)
    finding_text = ai.get("finding", "Insufficient evidence")

    return {
        "status": "success",
        "kpiAnalyzed": "Resolution Rate ↑ 12%",
        "contradictingSignals": [
            c.get("metric", "Unknown signal") for c in contradictions
        ],
        "finding": finding_text,
        "confidence": ai.get("confidence", "Medium-High"),
        "requires_investigation": True,
        "blind_spots": contradictions,
        "evidence_strength": "Medium-High" if contradictions else "Low",
    }
