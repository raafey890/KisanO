from typing import Dict, Any, List
from modules.analytics.schemas import DashboardResponse, ExportRequest, ExportResponse, ForecastResult, MetricType
from modules.analytics.analytics_engine import analytics_engine
from modules.analytics.repository import audit_repo
from core.exceptions import UnauthorizedException

class AnalyticsService:
    @staticmethod
    async def get_dashboard(user_id: str, user_role: str) -> DashboardResponse:
        await audit_repo.log({"actorId": user_id, "action": "DASHBOARD_VIEWED"})
        return await analytics_engine.get_dashboard()

    @staticmethod
    async def get_forecast(user_id: str, metric: MetricType) -> ForecastResult:
        await audit_repo.log({"actorId": user_id, "action": "FORECAST_REQUESTED", "metric": metric.value})
        return await analytics_engine.get_forecast(metric)

    @staticmethod
    async def request_export(user_id: str, request: ExportRequest) -> ExportResponse:
        await audit_repo.log({"actorId": user_id, "action": "EXPORT_CREATED", "reportName": request.reportName})
        return await analytics_engine.request_export(user_id, request)

    @staticmethod
    async def get_custom_report(user_id: str, read_name: str, start_date: str, end_date: str) -> List[Dict[str, Any]]:
        await audit_repo.log({"actorId": user_id, "action": "CUSTOM_REPORT_GENERATED", "readName": read_name})
        return await analytics_engine.get_custom_aggregation(read_name, start_date, end_date)
