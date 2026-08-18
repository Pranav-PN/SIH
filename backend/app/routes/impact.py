from fastapi import APIRouter

from app.models.schemas import ImpactTrackerResponse

router = APIRouter(prefix="/api")


@router.get("/impact-tracker", response_model=ImpactTrackerResponse)
def get_impact_tracker():
    return {
        "metrics": [
            {"label": "Repeat Complaints", "before": 31, "after": 17, "tone": "green"},
            {"label": "Reopened Cases", "before": 24, "after": 13, "tone": "green"},
            {"label": "Resolution Rate", "before": 91, "after": 88, "tone": "amber"},
        ],
        "chart": [
            {"metric": "Repeat Complaints", "Before": 31, "After": 17},
            {"metric": "Reopened Cases", "Before": 24, "After": 13},
            {"metric": "Resolution Rate", "Before": 91, "After": 88},
        ],
        "aiInterpretation": "A lower closure rate accompanied by a substantial reduction in repeat complaints may indicate more accurate closure rather than poorer performance.",
    }
