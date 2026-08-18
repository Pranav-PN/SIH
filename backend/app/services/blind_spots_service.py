from __future__ import annotations

from app.services.data_loader import load_dashboard_data


def get_blind_spots() -> list[dict]:
    data = load_dashboard_data()
    kpis = data.get("kpis", [])
    labels = {item.get("label"): item.get("value") for item in kpis}

    return [
        {
            "id": "bs-1",
            "title": "High closure rate but increasing repeat complaints",
            "severity": "HIGH",
            "evidenceStrength": "MEDIUM-HIGH",
            "affected": "~18,400 citizens",
            "indicators": [
                {"label": "Resolution Rate", "value": labels.get("Resolution Rate", "94%"), "tone": "up"},
                {"label": "Repeat Complaints", "value": labels.get("Repeat Complaints", "+38%"), "tone": "up"},
                {"label": "Reopened Cases", "value": "+24%", "tone": "up"},
            ],
            "explanation": "Possible premature case closure or mismatch between administrative closure and citizen-perceived resolution.",
            "defaultExpanded": True,
        },
        {
            "id": "bs-2",
            "title": "SLA compliance stable while follow-up contacts climb",
            "severity": "MEDIUM",
            "evidenceStrength": "MEDIUM",
            "affected": "~7,900 citizens",
            "indicators": [
                {"label": "SLA Compliance", "value": "96%", "tone": "up"},
                {"label": "Follow-up Contacts", "value": "+19%", "tone": "up"},
            ],
            "explanation": "Cases may be closed within SLA windows without fully resolving the underlying citizen need.",
            "defaultExpanded": False,
        },
        {
            "id": "bs-3",
            "title": "Processing time down but satisfaction survey response falling",
            "severity": "LOW",
            "evidenceStrength": "LOW",
            "affected": "~3,100 citizens",
            "indicators": [
                {"label": "Avg Processing Time", "value": "-9%", "tone": "down"},
                {"label": "Survey Response Rate", "value": "-14%", "tone": "up"},
            ],
            "explanation": "Faster processing may be reducing citizen engagement, though evidence is currently limited.",
            "defaultExpanded": False,
        },
    ]
