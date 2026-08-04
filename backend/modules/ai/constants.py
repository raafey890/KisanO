class ConsultationStatus:
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class SeverityLevel:
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"
    UNKNOWN = "UNKNOWN"

class AIProvider:
    OPENAI = "OPENAI"
    GEMINI = "GEMINI"
    CLAUDE = "CLAUDE"
    LOCAL = "LOCAL"

class ConsultationType:
    DISEASE_DETECTION = "DISEASE_DETECTION"
    CROP_ADVISORY = "CROP_ADVISORY"
    GENERAL_QA = "GENERAL_QA"
