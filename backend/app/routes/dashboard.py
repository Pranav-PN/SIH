from fastapi import APIRouter

from app.models.schemas import DashboardResponse
from app.services.dashboard_service import get_dashboard_payload

router = APIRouter(prefix="/api")


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard():
    return get_dashboard_payload()


@router.get("/dashboard/summary", response_model=DashboardResponse)
def get_dashboard_summary():
    return get_dashboard_payload()
