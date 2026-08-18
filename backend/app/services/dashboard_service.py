from app.services.data_loader import load_dashboard_data


def _map_summary_cards(summary: dict) -> list[dict]:
    return [
        {
            "label": "Active Blind Spots",
            "value": str(summary.get("active_blind_spots", 0)),
            "icon": "EyeOff",
            "tone": "blue",
        },
        {
            "label": "High Severity",
            "value": str(summary.get("high_severity", 0)),
            "icon": "Flame",
            "tone": "red",
        },
        {
            "label": "Cases Analyzed",
            "value": f"{summary.get('cases_analyzed', 0):,}",
            "icon": "FileText",
            "tone": "blue",
        },
        {
            "label": "Citizen Signal Health",
            "value": summary.get("citizen_signal_health", "Amber"),
            "icon": "Activity",
            "tone": "amber",
        },
    ]


def _map_kpis(raw_kpis: list[dict]) -> list[dict]:
    return [
        {
            "label": item.get("label", ""),
            "value": item.get("value", ""),
            "tone": item.get("tone", "green"),
        }
        for item in raw_kpis
    ]


def _map_trend(raw_trend: list[dict]) -> list[dict]:
    return [
        {
            "month": item.get("month", ""),
            "resolutionRate": item.get("resolution_rate", 0),
            "repeatComplaints": item.get("repeat_complaints", 0),
        }
        for item in raw_trend
    ]


def get_dashboard_payload() -> dict:
    data = load_dashboard_data()
    summary = data.get("summary", {})
    alert = data.get("alert", {})

    return {
        "summaryCards": _map_summary_cards(summary),
        "kpis": _map_kpis(data.get("kpis", [])),
        "trendData": _map_trend(data.get("trend", [])),
        "alert": {
            "title": alert.get("title", "Potential blind spot detected"),
            "description": alert.get(
                "description",
                "Administrative closure rate improving while repeat complaints rise.",
            ),
        },
    }
