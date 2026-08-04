from enum import Enum

class DiseaseSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"         # 90-100%
    MEDIUM = "MEDIUM"       # 80-89%
    NEEDS_REVIEW = "NEEDS_REVIEW" # < 80%

class DiagnosisStatus(str, Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    MANUAL_REVIEW_REQUIRED = "MANUAL_REVIEW_REQUIRED"
    REVIEWED = "REVIEWED"

class TreatmentType(str, Enum):
    ORGANIC = "ORGANIC"
    CHEMICAL = "CHEMICAL"
    PREVENTATIVE = "PREVENTATIVE"
    CULTURAL = "CULTURAL" # e.g. pruning, water management
