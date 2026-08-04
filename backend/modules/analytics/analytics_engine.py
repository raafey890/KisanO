import logging
from typing import Dict, Any, List
from modules.analytics.schemas import DashboardResponse, ExportRequest, ExportResponse, ForecastResult, MetricType
from modules.analytics.engines.dashboard_engine import dashboard_engine
from modules.analytics.engines.aggregation_engine import aggregation_engine
from modules.analytics.engines.export_engine import export_engine
from modules.analytics.engines.forecast_engine import forecast_engine
from modules.analytics.engines.kpi_engine import kpi_engine
from modules.analytics.engines.report_engine import report_engine
from modules.analytics.cache import cache_engine

logger = logging.getLogger(__name__)

class AnalyticsEngine:
    """
    Unified CQRS Read-Only Orchestrator.
    """
    @staticmethod
    async def get_dashboard() -> DashboardResponse:
        # Check Cache
        cached = cache_engine.get("dashboard_main")
        if cached:
            return cached
            
        dashboard = await dashboard_engine.build_executive_dashboard()
        cache_engine.set("dashboard_main", dashboard, 600) # 10 minute cache
        return dashboard

    @staticmethod
    async def get_custom_aggregation(read_name: str, start_date: str, end_date: str) -> List[Dict[str, Any]]:
        # Defers to the business module read models
        return await aggregation_engine.run_custom_aggregation(read_name, start_date, end_date)

    @staticmethod
    async def get_forecast(metric: MetricType) -> ForecastResult:
        return await forecast_engine.predict(metric)

    @staticmethod
    async def request_export(actor_id: str, request: ExportRequest) -> ExportResponse:
        # Mock pulling the dataset
        mock_dataset = [{"date": "2026-08-01", "value": 100}]
        return await export_engine.generate_export(actor_id, request, mock_dataset)

analytics_engine = AnalyticsEngine()
