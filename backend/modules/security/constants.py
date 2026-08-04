from enum import Enum

class SecurityEventType(str, Enum):
    AUTH_FAILURE = "auth_failure"
    AUTH_SUCCESS = "auth_success"
    AUTHZ_FAILURE = "authorization_failure"
    RATE_LIMIT_VIOLATION = "rate_limit_violation"
    WEBHOOK_FAILURE = "webhook_failure"
    UPLOAD_REJECTED = "upload_rejected"
    THREAT_DETECTED = "threat_detected"

class ThreatLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"
