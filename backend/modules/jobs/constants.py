from enum import Enum

class JobPriority(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    NORMAL = "NORMAL"
    LOW = "LOW"
    BACKGROUND = "BACKGROUND"

class JobState(str, Enum):
    PENDING = "PENDING"
    QUEUED = "QUEUED"
    SCHEDULED = "SCHEDULED"
    RUNNING = "RUNNING"
    SUCCESS = "SUCCESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    RETRYING = "RETRYING"
    DEAD_LETTER = "DEAD_LETTER"
