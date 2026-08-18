from fastapi import APIRouter

from app.models.schemas import BlindSpotItem
from app.services.blind_spots_service import get_blind_spots

router = APIRouter(prefix="/api")


@router.get("/blind-spots", response_model=list[BlindSpotItem])
def list_blind_spots():
    return get_blind_spots()
