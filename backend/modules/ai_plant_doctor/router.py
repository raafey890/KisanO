from fastapi import APIRouter, Depends, Query
from typing import Dict, Any, List
from modules.auth.dependencies import get_current_user_id, get_current_user_role
from modules.ai_plant_doctor.schemas import DiagnosisRequest, DiagnosisResponse, AIFeedback
from modules.ai_plant_doctor.service import AIPlantDoctorService

router = APIRouter(prefix="/api/v1/ai", tags=["AI Plant Doctor"])

@router.post("/diagnose", response_model=Dict[str, str])
async def create_diagnosis(
    data: DiagnosisRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Submits an image and crop context to the AI Orchestrator for disease diagnosis.
    Returns the ID of the created Diagnosis document.
    """
    diagnosis_id = await AIPlantDoctorService.request_diagnosis(data)
    return {"diagnosisId": diagnosis_id}

@router.get("/history", response_model=Dict[str, Any])
async def get_history(
    farmerId: str = None,
    disease: str = None,
    crop: str = None,
    status: str = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id),
    user_role: str = Depends(get_current_user_role)
):
    """
    Searches historical AI diagnoses.
    """
    filters = {}
    
    # Enforce RBAC
    if user_role == "Farmer":
        filters["farmerId"] = user_id
    elif user_role in ["Admin", "SuperAdmin"] and farmerId:
        filters["farmerId"] = farmerId
        
    if disease: filters["disease"] = disease
    if crop: filters["crop"] = crop
    if status: filters["status"] = status
        
    items, total = await AIPlantDoctorService.search_history(filters, skip, limit)
    return {"items": items, "total": total, "skip": skip, "limit": limit}

@router.get("/history/{diagnosis_id}", response_model=DiagnosisResponse)
async def get_diagnosis_by_id(
    diagnosis_id: str,
    user_id: str = Depends(get_current_user_id),
    user_role: str = Depends(get_current_user_role)
):
    """
    Fetches a specific diagnosis result including confidence and recommendations.
    """
    return await AIPlantDoctorService.get_diagnosis(diagnosis_id, user_id, user_role)

@router.post("/feedback", response_model=Dict[str, str])
async def submit_feedback(
    data: AIFeedback,
    user_id: str = Depends(get_current_user_id)
):
    """
    Allows farmers to rate the accuracy of the AI prediction.
    """
    feedback_id = await AIPlantDoctorService.submit_feedback(data, user_id)
    return {"feedbackId": feedback_id}
