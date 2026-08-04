from typing import Dict, Any
from modules.ai_plant_doctor.constants import ConfidenceLevel, DiagnosisStatus

class ConfidenceEngine:
    def __init__(self, manual_review_threshold: float = 0.80, high_confidence_threshold: float = 0.90):
        self.manual_review_threshold = manual_review_threshold
        self.high_confidence_threshold = high_confidence_threshold

    def evaluate(self, raw_score: float) -> Dict[str, Any]:
        """
        Evaluates the raw confidence score against configured thresholds.
        Returns the derived ConfidenceLevel and the resulting DiagnosisStatus.
        """
        level = ConfidenceLevel.HIGH
        status = DiagnosisStatus.COMPLETED
        
        if raw_score < self.manual_review_threshold:
            level = ConfidenceLevel.NEEDS_REVIEW
            status = DiagnosisStatus.MANUAL_REVIEW_REQUIRED
        elif raw_score < self.high_confidence_threshold:
            level = ConfidenceLevel.MEDIUM
            
        return {
            "level": level,
            "status": status,
            "thresholdUsed": self.manual_review_threshold,
            "rawScore": raw_score
        }

confidence_engine = ConfidenceEngine()
