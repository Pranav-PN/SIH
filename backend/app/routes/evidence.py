from fastapi import APIRouter

from app.models.schemas import EvidenceItem

router = APIRouter(prefix="/api")


@router.get("/evidence", response_model=list[EvidenceItem])
def list_evidence():
    return [
        {
            "id": "kpi",
            "title": "KPI Data",
            "detail": "Resolution Rate, SLA Compliance",
            "source": "Municipal case management system (synthetic)",
        },
        {
            "id": "citizen",
            "title": "Citizen Signals",
            "detail": "Repeat Complaints, Follow-ups",
            "source": "Citizen feedback portal (synthetic)",
        },
        {
            "id": "operational",
            "title": "Operational Data",
            "detail": "Processing times, case reopens",
            "source": "Internal operations log (synthetic)",
        },
        {
            "id": "historical",
            "title": "Historical Data",
            "detail": "12-month case trends",
            "source": "12-month historical case archive (synthetic)",
        },
    ]
