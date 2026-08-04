from fastapi import APIRouter, Depends, Query, Body, UploadFile, File
from typing import Dict, Any

from shared.responses import success_response, SuccessResponse
from core.dependencies import get_current_user, RequireRole
from modules.ai.service import AIService
from modules.ai.schemas import ConsultationRequest, ChatRequest, ConsultationResponse

router = APIRouter()

@router.post("/upload-image", response_model=SuccessResponse[Dict[str, Any]], dependencies=[Depends(RequireRole(["FARMER"]))])
async def upload_image(
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Upload crop image for AI analysis."""
    contents = await file.read()
    url = await AIService.upload_image(str(current_user["_id"]), contents)
    return success_response(message="Image uploaded", data={"imageUrl": url})

@router.post("/detect-disease", response_model=SuccessResponse[ConsultationResponse], dependencies=[Depends(RequireRole(["FARMER"]))])
async def detect_disease(
    data: ConsultationRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Analyze crop image to detect diseases."""
    consultation = await AIService.process_disease_detection(str(current_user["_id"]), data)
    return success_response(message="Disease analysis complete", data=consultation)

@router.post("/recommend-treatment", response_model=SuccessResponse[ConsultationResponse], dependencies=[Depends(RequireRole(["FARMER"]))])
async def recommend_treatment(
    data: ConsultationRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get general agronomic advice for a crop."""
    consultation = await AIService.process_crop_advisory(str(current_user["_id"]), data)
    return success_response(message="Advisory complete", data=consultation)

@router.post("/chat", response_model=SuccessResponse[ConsultationResponse], dependencies=[Depends(RequireRole(["FARMER"]))])
async def chat_ai(
    data: ChatRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """General QA chat with AI."""
    response = await AIService.process_chat(str(current_user["_id"]), data)
    return success_response(message="Chat response generated", data=response)

@router.patch("/history/{consultation_id}/favourite", response_model=SuccessResponse[ConsultationResponse], dependencies=[Depends(RequireRole(["FARMER"]))])
async def toggle_favourite(
    consultation_id: str,
    isFavourite: bool = Body(..., embed=True),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Toggle favourite status of a report."""
    response = await AIService.toggle_favourite(consultation_id, str(current_user["_id"]), isFavourite)
    return success_response(message="Favourite updated", data=response)

@router.get("/history", response_model=SuccessResponse[Dict[str, Any]], dependencies=[Depends(RequireRole(["FARMER"]))])
async def get_history(
    consultation_type: str = Query(None),
    is_favourite: bool = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get farmer's past consultations."""
    result = await AIService.search_history(
        farmer_id=str(current_user["_id"]), 
        consultation_type=consultation_type,
        is_favourite=is_favourite,
        skip=skip, 
        limit=limit
    )
    return success_response(message="History retrieved", data=result)

@router.get("/history/{consultation_id}", response_model=SuccessResponse[ConsultationResponse])
async def get_consultation(
    consultation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get specific consultation details."""
    response = await AIService.get_consultation(consultation_id, str(current_user["_id"]), current_user["role"])
    return success_response(message="Consultation retrieved", data=response)

# ----------------- Admin Endpoints -----------------

@router.get("/search", response_model=SuccessResponse[Dict[str, Any]], dependencies=[Depends(RequireRole(["ADMIN"]))])
async def search_all_consultations(
    farmer_id: str = Query(None),
    crop_name: str = Query(None),
    disease_name: str = Query(None),
    status: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    """Admin full search across all platform AI usage."""
    result = await AIService.search_history(
        farmer_id=farmer_id, crop_name=crop_name, disease_name=disease_name,
        status=status, skip=skip, limit=limit
    )
    return success_response(message="Consultations retrieved", data=result)

@router.get("/analytics", response_model=SuccessResponse[Dict[str, Any]], dependencies=[Depends(RequireRole(["ADMIN"]))])
async def get_ai_analytics():
    """Admin analytics for AI usage."""
    result = await AIService.get_analytics()
    return success_response(message="Analytics retrieved", data=result)

@router.get("/providers", dependencies=[Depends(RequireRole(["ADMIN"]))])
async def list_providers():
    return success_response(message="Providers retrieved", data=["OPENAI", "GEMINI", "CLAUDE"])

@router.patch("/admin/provider", dependencies=[Depends(RequireRole(["ADMIN"]))])
async def change_default_provider(provider: str = Body(..., embed=True)):
    return success_response(message=f"Default provider updated to {provider}", data={})

@router.patch("/admin/model", dependencies=[Depends(RequireRole(["ADMIN"]))])
async def change_default_model(model: str = Body(..., embed=True)):
    return success_response(message=f"Default model updated to {model}", data={})
