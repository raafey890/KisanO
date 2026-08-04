import logging
from typing import Dict, Any, List
from core.exceptions import AppException, NotFoundException

from modules.ai_plant_doctor.schemas import DiagnosisRequest
from modules.ai_plant_doctor.providers import get_ai_provider
from modules.ai_plant_doctor.confidence import confidence_engine
from modules.ai_plant_doctor.repository import diagnosis_repository, audit_repository
from modules.ai_plant_doctor.events import ai_events, AIDomainEvents

from modules.users.repository import user_repository
# Assuming global media service exists
# from modules.shared.media import upload_image 

logger = logging.getLogger(__name__)

class AIOrchestrator:
    @staticmethod
    async def process_diagnosis(data: DiagnosisRequest) -> str:
        # 1. Fetch User and Context
        farmer = await user_repository.get_by_id(data.farmerId)
        if not farmer:
            raise NotFoundException("Farmer profile not found.")
            
        farmer_snapshot = {
            "farmerId": str(farmer["_id"]),
            "farmerName": farmer.get("fullName", "Unknown"),
            "farmerPhone": farmer.get("phone", "")
        }
        
        # In a real scenario, fetch specific farm snapshot using data.farmId
        farm_snapshot = {
            "farmId": data.farmId,
            "district": "Mock District",
            "village": "Mock Village",
            "latitude": 0.0,
            "longitude": 0.0
        }
        
        crop_snapshot = {
            "cropName": data.cropName,
            "cropStage": data.cropStage,
            "symptoms": data.symptoms
        }

        # 2. Call AI Provider Abstraction
        provider = get_ai_provider("mock")
        
        try:
            ai_response = await provider.analyze_image(data.imageUrls[0], crop_snapshot)
        except Exception as e:
            raise AppException(f"AI Provider failed: {str(e)}", 502)

        # 3. Confidence Engine
        conf_eval = confidence_engine.evaluate(ai_response["confidence"])
        
        confidence_summary = {
            "rawScore": conf_eval["rawScore"],
            "level": conf_eval["level"].value,
            "thresholdUsed": conf_eval["thresholdUsed"]
        }
        
        # 4. Construct Final Document
        diagnosis_doc = {
            "farmerSnapshot": farmer_snapshot,
            "farmSnapshot": farm_snapshot,
            "cropSnapshot": crop_snapshot,
            "imageUrls": data.imageUrls,
            
            "detectedDisease": ai_response["detectedDisease"],
            "diseaseCategory": ai_response["diseaseCategory"],
            "diseaseDescription": ai_response["diseaseDescription"],
            "severity": ai_response["severity"],
            
            "confidenceSummary": confidence_summary,
            "treatments": ai_response["treatments"],
            "preventiveMeasures": ai_response["preventiveMeasures"],
            
            "aiProvider": provider.provider_name,
            "modelVersion": provider.model_version,
            "promptVersion": "v1.0",
            
            "status": conf_eval["status"].value
        }
        
        diagnosis_id = await diagnosis_repository.create_diagnosis(diagnosis_doc)
        
        # 5. Audit Logging
        await audit_repository.log_action(diagnosis_id, "DIAGNOSIS_COMPLETED", {"status": conf_eval["status"].value})
        
        # 6. Publish Domain Events
        if conf_eval["status"].value == "MANUAL_REVIEW_REQUIRED":
            await ai_events.publish(AIDomainEvents.LOW_CONFIDENCE_DIAGNOSIS, {"diagnosisId": diagnosis_id})
        else:
            await ai_events.publish(AIDomainEvents.DIAGNOSIS_COMPLETED, {"diagnosisId": diagnosis_id})
            
            # Hook into Marketplace for specific search tags returned by the AI
            for treatment in ai_response["treatments"]:
                for tag in treatment.get("searchTags", []):
                    if tag["tagType"] == "Fungicide":
                        await ai_events.publish(AIDomainEvents.MARKETPLACE_RECOMMENDATION_REQUESTED, {
                            "diagnosisId": diagnosis_id,
                            "searchTerm": tag["value"]
                        })
                    elif tag["tagType"] == "SprayerService":
                        await ai_events.publish(AIDomainEvents.SPRAYER_RECOMMENDATION_REQUESTED, {
                            "diagnosisId": diagnosis_id,
                            "serviceType": tag["value"]
                        })
                        
        return diagnosis_id
