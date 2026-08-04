from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from pymongo import UpdateOne

class SnapshotRepository(BaseRepository):
    def __init__(self):
        super().__init__("analytics_snapshots")

    async def setup_indexes(self):
        # Unique index on interval + timestamp + metricType to allow fast upserts
        await self.collection.create_index(
            [("interval", 1), ("timestamp", 1), ("metricType", 1)],
            unique=True
        )

    async def increment_metric(self, interval: str, timestamp: datetime, metric_type: str, increment_value: float, dimensions: Dict[str, str] = None):
        """
        Thread-safe atomic increment for a snapshot.
        """
        query = {
            "interval": interval,
            "timestamp": timestamp,
            "metricType": metric_type
        }
        
        update = {
            "$inc": {"value": increment_value},
            "$setOnInsert": {"dimensions": dimensions or {}, "createdAt": datetime.now(timezone.utc)}
        }
        
        await self.collection.update_one(query, update, upsert=True)
        
    async def get_series(self, metric_type: str, interval: str, start_time: datetime, end_time: datetime) -> List[Dict[str, Any]]:
        cursor = self.collection.find({
            "metricType": metric_type,
            "interval": interval,
            "timestamp": {"$gte": start_time, "$lte": end_time}
        }).sort("timestamp", 1)
        
        return await cursor.to_list(length=1000)

class AnalyticsAuxRepository(BaseRepository):
    def __init__(self, collection_name: str):
        super().__init__(collection_name)
        
    async def log(self, data: Dict[str, Any]):
        data["createdAt"] = datetime.now(timezone.utc)
        await self.create(data)

snapshot_repo = SnapshotRepository()
report_repo = AnalyticsAuxRepository("scheduled_reports")
export_repo = AnalyticsAuxRepository("report_exports")
audit_repo = AnalyticsAuxRepository("analytics_audit_logs")
