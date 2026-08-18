from fastapi import APIRouter

from app.models.schemas import RealityCheckRequest, RealityCheckResponse
from app.services.reality_check_service import get_reality_check

router = APIRouter(prefix="/api")


@router.post("/reality-check", response_model=RealityCheckResponse)
def run_reality_check(payload: RealityCheckRequest | None = None):
    return get_reality_check()
