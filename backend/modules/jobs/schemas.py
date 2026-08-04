from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
from modules.jobs.constants import JobPriority, JobState

class JobPayload(BaseModel):
    worker_name: str
    args: Dict[str, Any] = Field(default_factory=dict)
    
class JobResponse(BaseModel):
    id: str
    job_number: str
    worker_name: str
    priority: JobPriority
    state: JobState
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    retry_count: int = 0
    error: Optional[str] = None
    
class JobStats(BaseModel):
    queued: int
    running: int
    completed: int
    failed: int
    dead_letter: int
