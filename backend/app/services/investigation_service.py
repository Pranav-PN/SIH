from __future__ import annotations


def get_investigations() -> list[dict]:
    return [
        {
            "id": "inv-1",
            "title": "High closure rate but increasing repeat complaints",
            "severity": "HIGH",
            "hypotheses": [
                {"label": "Premature case closure", "confidence": 64},
                {"label": "Increased citizen reporting behavior", "confidence": 41},
                {"label": "Change in service complexity", "confidence": 27},
            ],
            "evidenceGaps": [
                "Reopening timestamps",
                "Citizen confirmation after closure",
                "Final-resolution records",
                "Field verification",
            ],
            "brief": {
                "problem": "Administrative resolution metrics are improving while citizen-side signals suggest cases are not being fully resolved.",
                "observedContradiction": "Resolution Rate rose +12% over six months, yet Repeat Complaints rose +38% and Reopened Cases +24% in the same period.",
                "evidence": "KPI data from the municipal case management system, citizen feedback portal signals, and internal operations logs (all synthetic prototype data).",
                "possibleHypotheses": "Premature case closure; increased citizen reporting behavior; a shift in the complexity of incoming service requests.",
                "uncertainty": "Root cause cannot be determined with certainty; current evidence is correlational and may reflect reporting changes rather than service quality.",
                "affectedGroups": "An estimated ~18,400 citizens across districts with the highest repeat-contact volumes.",
                "additionalEvidenceRequired": "Reopening timestamps, citizen confirmation after closure, final-resolution records, and field verification.",
                "recommendedInvestigationSteps": "Sample recently closed cases for citizen confirmation, audit closure-to-reopen intervals, and interview front-line case handlers before drawing conclusions.",
            },
        }
    ]


def get_investigation_by_id(investigation_id: str) -> dict:
    items = get_investigations()
    for item in items:
        if item["id"] == investigation_id:
            return item
    raise KeyError(investigation_id)


def review_investigation(investigation_id: str, decision: str) -> dict:
    valid = {"accept", "modify", "reject"}
    normalized = decision.lower()
    if normalized not in valid:
        raise ValueError("decision must be one of: accept, modify, reject")

    messages = {
        "accept": "Investigation accepted — routed to administrator queue.",
        "modify": "Investigation flagged for modification — returned to analyst.",
        "reject": "Investigation rejected — no action taken.",
    }

    return {
        "investigationId": investigation_id,
        "status": "success",
        "decision": messages[normalized],
    }
