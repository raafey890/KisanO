import logging
import json
from datetime import datetime, timezone
from typing import Dict, Any, List
from bson import ObjectId

from core.exceptions import NotFoundException, ForbiddenException, AppException
from core.config import settings

from modules.ai.repository import ai_consultation_repository
from modules.ai.schemas import ConsultationRequest, ChatRequest
from modules.ai.constants import ConsultationStatus, AIProvider, ConsultationType
from modules.ai.prompts.system_prompts import DISEASE_DETECTION_PROMPT, CROP_ADVISORY_PROMPT, GENERAL_QA_PROMPT
from modules.ai.providers.provider_factory import get_ai_provider
from integrations.cloudinary_service import cloudinary_service

logger = logging.getLogger(__name__)

class AIService:

    @staticmethod
    def _format_consultation(c: Dict[str, Any]) -> Dict[str, Any]:
        if not c: return None
        c["id"] = str(c["_id"])
        c["farmerId"] = str(c["farmerId"])
        return c

    @staticmethod
    async def upload_image(user_id: str, file_bytes: bytes) -> str:
        url = await cloudinary_service.upload_image(file_bytes, folder=f"ai_uploads/{user_id}")
        if not url:
            raise AppException("Failed to upload image for AI analysis")
        return url

    @staticmethod
    async def process_disease_detection(farmer_id: str, data: ConsultationRequest) -> Dict[str, Any]:
        provider_name = getattr(settings, "DEFAULT_AI_PROVIDER", AIProvider.OPENAI)
        ai = get_ai_provider(provider_name)
        
        if not data.images:
            raise AppException("At least one image is required for disease detection")
            
        user_prompt = f"Crop: {data.cropName or 'Unknown'}. Please analyze this image for diseases."
        if data.question:
            user_prompt += f" Additional context: {data.question}"

        # Initialize consultation doc
        doc = {
            "farmerId": ObjectId(farmer_id),
            "consultationType": ConsultationType.DISEASE_DETECTION,
            "cropName": data.cropName,
            "cropVariety": data.cropVariety,
            "cropAgeDays": data.cropAgeDays,
            "location": data.location,
            "images": data.images,
            "question": data.question,
            "aiProvider": provider_name,
            "aiModel": "gpt-4-vision-preview", # or dynamic
            "diseaseReport": None,
            "status": ConsultationStatus.PENDING,
            "isFavourite": False,
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc)
        }
        
        consultation = await ai_consultation_repository.create_consultation(doc)
        consultation_id = str(consultation["_id"])
        
        try:
            # Call AI
            response_text = await ai.analyze_image(DISEASE_DETECTION_PROMPT, data.images[0], user_prompt)
            
            # Clean JSON (in case LLM outputs markdown block)
            response_text = response_text.strip().removeprefix("```json").removesuffix("```").strip()
            report_data = json.loads(response_text)
            
            await ai_consultation_repository.update_consultation(consultation_id, {
                "diseaseReport": report_data,
                "status": ConsultationStatus.COMPLETED
            })
            
            consultation["diseaseReport"] = report_data
            consultation["status"] = ConsultationStatus.COMPLETED
            
        except Exception as e:
            logger.error(f"AI Disease Detection Failed: {e}")
            await ai_consultation_repository.update_consultation(consultation_id, {"status": ConsultationStatus.FAILED})
            raise AppException("Failed to analyze image via AI")
            
        return AIService._format_consultation(consultation)

    @staticmethod
    async def process_crop_advisory(farmer_id: str, data: ConsultationRequest) -> Dict[str, Any]:
        provider_name = getattr(settings, "DEFAULT_AI_PROVIDER", AIProvider.OPENAI)
        ai = get_ai_provider(provider_name)
        
        user_prompt = f"Crop: {data.cropName}. Age: {data.cropAgeDays} days. Location: {data.location}. Farm Size: {data.farmSizeAcres} acres. Question: {data.question}"
        
        doc = {
            "farmerId": ObjectId(farmer_id),
            "consultationType": ConsultationType.CROP_ADVISORY,
            "cropName": data.cropName,
            "cropAgeDays": data.cropAgeDays,
            "farmSizeAcres": data.farmSizeAcres,
            "location": data.location,
            "question": data.question,
            "aiProvider": provider_name,
            "aiModel": "gpt-4-turbo",
            "advisoryReport": None,
            "status": ConsultationStatus.PENDING,
            "isFavourite": False,
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc)
        }
        
        consultation = await ai_consultation_repository.create_consultation(doc)
        consultation_id = str(consultation["_id"])
        
        try:
            response_text = await ai.get_structured_response(CROP_ADVISORY_PROMPT, user_prompt)
            response_text = response_text.strip().removeprefix("```json").removesuffix("```").strip()
            report_data = json.loads(response_text)
            
            await ai_consultation_repository.update_consultation(consultation_id, {
                "advisoryReport": report_data,
                "status": ConsultationStatus.COMPLETED
            })
            
            consultation["advisoryReport"] = report_data
            consultation["status"] = ConsultationStatus.COMPLETED
            
        except Exception as e:
            logger.error(f"AI Advisory Failed: {e}")
            await ai_consultation_repository.update_consultation(consultation_id, {"status": ConsultationStatus.FAILED})
            raise AppException("Failed to generate advisory via AI")
            
        return AIService._format_consultation(consultation)

    @staticmethod
    async def process_chat(farmer_id: str, data: ChatRequest) -> Dict[str, Any]:
        provider_name = getattr(settings, "DEFAULT_AI_PROVIDER", AIProvider.OPENAI)
        ai = get_ai_provider(provider_name)
        
        messages = [m.model_dump() for m in data.messages]
        
        try:
            response_text = await ai.chat(GENERAL_QA_PROMPT, messages)
            
            # For general chat we might just save to history directly or return it.
            # We'll save it as a lightweight consultation record.
            doc = {
                "farmerId": ObjectId(farmer_id),
                "consultationType": ConsultationType.GENERAL_QA,
                "question": messages[-1]["content"] if messages else "",
                "aiProvider": provider_name,
                "aiModel": "gpt-3.5-turbo",
                "generalAnswer": response_text,
                "status": ConsultationStatus.COMPLETED,
                "isFavourite": False,
                "createdAt": datetime.now(timezone.utc),
                "updatedAt": datetime.now(timezone.utc)
            }
            created = await ai_consultation_repository.create_consultation(doc)
            return AIService._format_consultation(created)
            
        except Exception as e:
            logger.error(f"AI Chat Failed: {e}")
            raise AppException("Failed to get response from AI")

    @staticmethod
    async def toggle_favourite(consultation_id: str, user_id: str, is_favourite: bool) -> Dict[str, Any]:
        c = await ai_consultation_repository.get_by_id(consultation_id)
        if not c or str(c["farmerId"]) != user_id:
            raise NotFoundException("Consultation not found")
            
        await ai_consultation_repository.toggle_favourite(consultation_id, is_favourite)
        c["isFavourite"] = is_favourite
        return AIService._format_consultation(c)

    @staticmethod
    async def get_consultation(consultation_id: str, user_id: str, role: str) -> Dict[str, Any]:
        c = await ai_consultation_repository.get_by_id(consultation_id)
        if not c:
            raise NotFoundException("Consultation not found")
        if role != "ADMIN" and str(c["farmerId"]) != user_id:
            raise ForbiddenException("Access denied")
        return AIService._format_consultation(c)

    @staticmethod
    async def search_history(
        farmer_id: str = None, crop_name: str = None, disease_name: str = None,
        status: str = None, consultation_type: str = None, is_favourite: bool = None,
        sort_by: str = "newest", skip: int = 0, limit: int = 20
    ) -> Dict[str, Any]:
        items, total = await ai_consultation_repository.search_consultations(
            farmer_id=farmer_id, crop_name=crop_name, disease_name=disease_name,
            status=status, consultation_type=consultation_type, is_favourite=is_favourite,
            sort_by=sort_by, skip=skip, limit=limit
        )
        return {
            "items": [AIService._format_consultation(i) for i in items],
            "total": total,
            "skip": skip,
            "limit": limit
        }

    @staticmethod
    async def get_analytics() -> Dict[str, Any]:
        return await ai_consultation_repository.get_analytics()
