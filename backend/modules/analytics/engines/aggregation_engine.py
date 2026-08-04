from typing import Dict, Any, List
from modules.analytics.facades import analytics_read_facade

class AggregationEngine:
    @staticmethod
    async def run_custom_aggregation(read_name: str, start_date: str, end_date: str, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Executes a live aggregation pipeline via the AnalyticsReadFacade.
        Used for custom date ranges where snapshots aren't granular enough.
        """
        params = {
            "startDate": start_date,
            "endDate": end_date,
            "filters": filters or {}
        }
        return await analytics_read_facade.fetch(read_name, params)

aggregation_engine = AggregationEngine()
