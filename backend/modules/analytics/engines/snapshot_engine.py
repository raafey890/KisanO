from typing import Dict, Any, Optional
from datetime import datetime, timezone
from modules.analytics.repository import snapshot_repo
from modules.analytics.constants import SnapshotInterval, MetricType

class SnapshotEngine:
    @staticmethod
    async def record_event(metric_type: MetricType, value_increment: float, dimensions: Dict[str, str] = None):
        """
        Takes an event (like a $500 payment) and updates the Hourly and Daily snapshots.
        This is called asynchronously by the EventBus listeners.
        """
        now = datetime.now(timezone.utc)
        
        # Hourly Bucket
        hourly_ts = now.replace(minute=0, second=0, microsecond=0)
        await snapshot_repo.increment_metric(
            interval=SnapshotInterval.HOURLY.value,
            timestamp=hourly_ts,
            metric_type=metric_type.value,
            increment_value=value_increment,
            dimensions=dimensions
        )
        
        # Daily Bucket
        daily_ts = now.replace(hour=0, minute=0, second=0, microsecond=0)
        await snapshot_repo.increment_metric(
            interval=SnapshotInterval.DAILY.value,
            timestamp=daily_ts,
            metric_type=metric_type.value,
            increment_value=value_increment,
            dimensions=dimensions
        )
        
snapshot_engine = SnapshotEngine()
