from typing import Dict, List, Optional
from datetime import datetime, timezone
from modules.jobs.schemas import WorkerStatus


class HeartbeatEngine:
    def __init__(self):
        self._workers: Dict[str, WorkerStatus] = {}

    def register_worker(self, worker_id: str):
        self._workers[worker_id] = WorkerStatus(
            worker_id=worker_id,
            status="IDLE",
            last_heartbeat=datetime.now(timezone.utc)
        )

    def record_heartbeat(self, worker_id: str, current_job_id: Optional[str] = None):
        if worker_id in self._workers:
            self._workers[worker_id].last_heartbeat = datetime.now(timezone.utc)
            self._workers[worker_id].current_job_id = current_job_id
            self._workers[worker_id].status = "BUSY" if current_job_id else "IDLE"

    def get_worker_statuses(self) -> List[WorkerStatus]:
        return list(self._workers.values())

    def detect_stalled(self, threshold_seconds: int = 120) -> List[str]:
        now = datetime.now(timezone.utc)
        stalled = []
        for worker_id, info in self._workers.items():
            if (now - info.last_heartbeat).total_seconds() > threshold_seconds:
                stalled.append(worker_id)
        return stalled


heartbeat_engine = HeartbeatEngine()
