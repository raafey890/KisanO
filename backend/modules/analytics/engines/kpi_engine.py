from typing import Dict, Any, List
from datetime import datetime, timedelta, timezone
from modules.analytics.repository import snapshot_repo
from modules.analytics.constants import SnapshotInterval, MetricType

class KPIEngine:
    @staticmethod
    async def get_kpi(metric_type: MetricType, days: int = 30) -> Dict[str, Any]:
        """
        Fetches the aggregated snapshot data for a specific KPI over the last N days.
        Calculates the total, previous period total, and % change.
        """
        end_time = datetime.now(timezone.utc)
        start_time = end_time - timedelta(days=days)
        previous_start = start_time - timedelta(days=days)
        
        # Current Period
        current_series = await snapshot_repo.get_series(metric_type.value, SnapshotInterval.DAILY.value, start_time, end_time)
        current_total = sum(item.get("value", 0) for item in current_series)
        
        # Previous Period
        previous_series = await snapshot_repo.get_series(metric_type.value, SnapshotInterval.DAILY.value, previous_start, start_time)
        previous_total = sum(item.get("value", 0) for item in previous_series)
        
        perc_change = 0.0
        if previous_total > 0:
            perc_change = ((current_total - previous_total) / previous_total) * 100
            
        return {
            "metricType": metric_type.value,
            "currentTotal": current_total,
            "previousTotal": previous_total,
            "percentageChange": round(perc_change, 2),
            "series": current_series
        }

kpi_engine = KPIEngine()
