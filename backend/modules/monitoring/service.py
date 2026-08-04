from typing import Dict, Any, List
from modules.monitoring.observability_engine import observability_engine
from modules.monitoring.schemas import SystemHealthResponse
from modules.monitoring.repository import audit_repo

class MonitoringService:
    @staticmethod
    async def get_health() -> SystemHealthResponse:
        return await observability_engine.check_health()
        
    @staticmethod
    def get_metrics() -> Dict[str, float]:
        from modules.monitoring.engines.metrics_engine import metrics_engine
        return metrics_engine.get_metrics_snapshot()

    @staticmethod
    async def get_audit_logs(skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        cursor = audit_repo.collection.find().sort("createdAt", -1).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        for i in items: i["id"] = str(i["_id"])
        total = await audit_repo.collection.count_documents({})
        return items, total
