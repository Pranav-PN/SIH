from __future__ import annotations

from typing import Any


def pct_change(start: float | int, end: float | int) -> float:
    if start == 0:
        return 0.0
    return ((end - start) / abs(start)) * 100.0


def detect_contradictions(kpi_data: dict[str, Any], citizen_signals: list[dict], operations: list[dict]) -> list[dict]:
    contradictions: list[dict] = []

    if not kpi_data or not citizen_signals or not operations:
        return contradictions

    start = operations[0]
    end = operations[-1]
    resolution_increase = pct_change(start.get("closure_rate", 0), end.get("closure_rate", 0))
    repeat_increase = pct_change(citizen_signals[0].get("repeat_complaints", 0), citizen_signals[-1].get("repeat_complaints", 0))

    if resolution_increase > 5 and repeat_increase > 20:
        contradictions.append({
            "type": "resolution_vs_repeat_complaints",
            "severity": "HIGH" if repeat_increase > 30 else "MEDIUM",
            "label": "Resolution Rate and Repeat Complaints diverge",
            "metric": "Resolution Rate ↑ {:.1f}% while Repeat Complaints ↑ {:.1f}%".format(resolution_increase, repeat_increase),
            "impact": "Administrative closure improved while citizen complaints increased, suggesting a possible mismatch between reported and experienced outcomes.",
        })

    if start.get("sla_compliance", 0) and end.get("sla_compliance", 0):
        sla_change = pct_change(start.get("sla_compliance", 0), end.get("sla_compliance", 0))
        follow_up_increase = pct_change(citizen_signals[0].get("follow_up_contacts", 0), citizen_signals[-1].get("follow_up_contacts", 0))
        if sla_change > 0 and follow_up_increase > 15:
            contradictions.append({
                "type": "sla_vs_follow_up",
                "severity": "MEDIUM",
                "label": "SLA compliance improves while follow-up contacts rise",
                "metric": "SLA Compliance ↑ {:.1f}% while Follow-up Contacts ↑ {:.1f}%".format(sla_change, follow_up_increase),
                "impact": "Cases may be closed within procedural timeliness targets without fully resolving the underlying citizen need.",
            })

    time_drop = pct_change(start.get("avg_processing_time_days", 0), end.get("avg_processing_time_days", 0))
    survey_drop = pct_change(citizen_signals[0].get("survey_response_rate", 0), citizen_signals[-1].get("survey_response_rate", 0))
    if time_drop < -5 and survey_drop < -10:
        contradictions.append({
            "type": "processing_time_vs_satisfaction",
            "severity": "LOW",
            "label": "Processing time falls while survey engagement falls",
            "metric": "Avg Processing Time ↓ {:.1f}% while Survey Response Rate ↓ {:.1f}%".format(abs(time_drop), abs(survey_drop)),
            "impact": "Faster processing may coincide with lower citizen engagement, but the relationship is not yet confirmed.",
        })

    return contradictions
