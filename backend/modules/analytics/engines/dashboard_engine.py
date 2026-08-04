from typing import Dict, Any, List
from datetime import datetime, timezone
from modules.analytics.schemas import DashboardResponse, DashboardWidget, ChartMetadata
from modules.analytics.constants import MetricType, ChartType
from modules.analytics.engines.kpi_engine import kpi_engine

class DashboardEngine:
    @staticmethod
    async def build_executive_dashboard() -> DashboardResponse:
        """
        Builds the unified dashboard UI payloads.
        """
        revenue_kpi = await kpi_engine.get_kpi(MetricType.REVENUE, 30)
        users_kpi = await kpi_engine.get_kpi(MetricType.USER_GROWTH, 30)
        
        # Prepare Chart Metadata
        revenue_chart = ChartMetadata(
            title="Revenue (30 Days)",
            chartType=ChartType.LINE,
            labels=[str(item["timestamp"].date()) for item in revenue_kpi["series"]],
            datasets=[{"label": "Revenue", "data": [item["value"] for item in revenue_kpi["series"]]}]
        )
        
        widgets = [
            DashboardWidget(
                widgetId="w_rev_01",
                title="Total Revenue (30d)",
                metricType=MetricType.REVENUE,
                value=revenue_kpi["currentTotal"],
                previousValue=revenue_kpi["previousTotal"],
                percentageChange=revenue_kpi["percentageChange"],
                chart=revenue_chart
            ),
            DashboardWidget(
                widgetId="w_usr_01",
                title="New Users (30d)",
                metricType=MetricType.USER_GROWTH,
                value=users_kpi["currentTotal"],
                previousValue=users_kpi["previousTotal"],
                percentageChange=users_kpi["percentageChange"]
            )
        ]
        
        return DashboardResponse(
            generatedAt=datetime.now(timezone.utc),
            widgets=widgets
        )

dashboard_engine = DashboardEngine()
