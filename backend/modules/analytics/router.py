from fastapi import APIRouter, Depends, Query, Body, Request
from typing import Dict, Any, List
from modules.auth.dependencies import get_current_user_id, get_current_user_role
from modules.analytics.schemas import DashboardResponse, ExportRequest, ExportResponse, ForecastResult, MetricType
from modules.analytics.service import AnalyticsService
from core.exceptions import UnauthorizedException

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics & BI"])

def require_analytics_access(role: str = Depends(get_current_user_role)):
    if role not in ["SUPER_ADMIN", "ADMIN", "FINANCE_MANAGER", "OPERATIONS_MANAGER"]:
        raise UnauthorizedException("Analytics access required.")
    return role

@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    user_id: str = Depends(get_current_user_id),
    role: str = Depends(require_analytics_access)
):
    """
    Fetches the pre-aggregated executive dashboard widgets.
    """
    return await AnalyticsService.get_dashboard(user_id, role)

@router.get("/forecast", response_model=ForecastResult)
async def get_forecast(
    metric: MetricType = Query(...),
    user_id: str = Depends(get_current_user_id),
    role: str = Depends(require_analytics_access)
):
    """
    Fetches predicted metrics based on historical snapshots.
    """
    return await AnalyticsService.get_forecast(user_id, metric)

@router.post("/export", response_model=ExportResponse)
async def request_export(
    request: ExportRequest,
    user_id: str = Depends(get_current_user_id),
    role: str = Depends(require_analytics_access)
):
    """
    Generates a CSV/JSON export and returns a temporary download URL.
    """
    return await AnalyticsService.request_export(user_id, request)

@router.get("/reports/custom", response_model=List[Dict[str, Any]])
async def get_custom_report(
    readName: str = Query(...),
    startDate: str = Query(...),
    endDate: str = Query(...),
    user_id: str = Depends(get_current_user_id),
    role: str = Depends(require_analytics_access)
):
    """
    Executes a custom date-range aggregation via the AnalyticsReadFacade.
    """
    return await AnalyticsService.get_custom_report(user_id, readName, startDate, endDate)
