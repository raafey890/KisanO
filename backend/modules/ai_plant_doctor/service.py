import logging
from typing import Dict, Any, List
from core.exceptions import NotFoundException, UnauthorizedException

from modules.ai_plant_doctor.schemas import DiagnosisRequest, AIFeedback
from modules.ai_plant_doctor.orchestrator import AIOrchestrator
from modules.ai_plant_doctor.repository import diagnosis_repository, feedback_repository, audit_repository

logger = logging.getLogger(__name__)

class AIPlantDoctorService:
    @staticmethod
    async def request_diagnosis(data: DiagnosisRequest) -> str:
        """
        Entry point for requesting a new diagnosis.
        Delegates the heavy lifting to the AIOrchestrator.
        """
        diagnosis_id = await AIOrchestrator.process_diagnosis(data)
        return diagnosis_id

    @staticmethod
    async def get_diagnosis(diagnosis_id: str, user_id: str, user_role: str) -> Dict[str, Any]:
        """
        Fetches a completed diagnosis. Enforces RBAC.
        """
        diagnosis = await diagnosis_repository.get_by_id(diagnosis_id)
        if not diagnosis or diagnosis.get("isDeleted"):
            raise NotFoundException("Diagnosis not found")
            
        is_admin = user_role in ["Admin", "SuperAdmin"]
        is_owner = diagnosis["farmerSnapshot"]["farmerId"] == user_id
        
        if not (is_admin or is_owner):
            raise UnauthorizedException("You do not have permission to view this diagnosis.")
            
        diagnosis["id"] = str(diagnosis["_id"])
        return diagnosis

    @staticmethod
    async def submit_feedback(data: AIFeedback, user_id: str) -> str:
        """
        Allows farmers to submit feedback on AI accuracy.
        """
        if data.farmerId != user_id:
            raise UnauthorizedException("You can only submit feedback for your own diagnosis.")
            
        # Verify diagnosis exists
        diagnosis = await diagnosis_repository.get_by_id(data.diagnosisId)
        if not diagnosis:
            raise NotFoundException("Diagnosis not found")
            
        feedback_doc = {
            "diagnosisId": data.diagnosisId,
            "farmerId": data.farmerId,
            "isCorrect": data.isCorrect,
            "isHelpful": data.isHelpful,
            "notes": data.notes
        }
        
        feedback_id = await feedback_repository.create_feedback(feedback_doc)
        
        await audit_repository.log_action(data.diagnosisId, "FEEDBACK_SUBMITTED", {"isCorrect": data.isCorrect})
        
        return feedback_id

    @staticmethod
    async def search_history(filters: Dict[str, Any], skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        """
        Searches historical AI diagnoses.
        """
        items, total = await diagnosis_repository.search_diagnoses(filters, skip, limit)
        for i in items:
            i["id"] = str(i["_id"])
        return items, total
