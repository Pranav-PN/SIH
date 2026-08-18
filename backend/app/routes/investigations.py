from fastapi import APIRouter, HTTPException

from app.models.schemas import InvestigationRecord, InvestigationReviewRequest, InvestigationReviewResponse
from app.services.investigation_service import get_investigation_by_id, get_investigations, review_investigation

router = APIRouter(prefix="/api")


@router.get("/investigations", response_model=list[InvestigationRecord])
def list_investigations():
    return get_investigations()


@router.get("/investigations/{investigation_id}", response_model=InvestigationRecord)
def get_investigation(investigation_id: str):
    try:
        return get_investigation_by_id(investigation_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Investigation not found") from None


@router.post("/investigations/{investigation_id}/review", response_model=InvestigationReviewResponse)
def review_investigation_route(investigation_id: str, payload: InvestigationReviewRequest):
    try:
        return review_investigation(investigation_id, payload.model_dump()["decision"])
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
