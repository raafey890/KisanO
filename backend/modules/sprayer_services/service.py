import logging
import uuid
from typing import Dict, Any, List
from datetime import datetime, timezone
from core.exceptions import NotFoundException, AppException, UnauthorizedException

from modules.sprayer_services.repository import sprayer_repository, availability_repository, pricing_history_repository, certification_repository
from modules.sprayer_services.schemas import ServiceCreate, ServiceUpdate, PricingUpdate, AvailabilityCreate, CertificationCreate
from modules.sprayer_services.constants import ServiceStatus, VALID_SERVICE_TRANSITIONS
from integrations.media import media_service
from modules.users.repository import user_repository

logger = logging.getLogger(__name__)

class SprayerServiceManagement:

    @staticmethod
    async def create_service(operator_id: str, data: ServiceCreate) -> str:
        # 1. Fetch Operator Snapshot from Users Module
        user = await user_repository.get_by_id(operator_id)
        if not user:
            raise UnauthorizedException("Operator profile not found.")
            
        operator_snapshot = {
            "operatorId": str(user["_id"]),
            "operatorName": user.get("fullName", "Unknown"),
            "businessName": data.businessName,
            "phone": user.get("phone", ""),
            "verificationStatus": user.get("kyc", {}).get("status", "PENDING"),
            "averageRating": user.get("analytics", {}).get("averageRating", 0.0),
            "experienceYears": data.yearsOfExperience
        }

        # 2. Build Document
        service_doc = data.model_dump()
        service_doc["operatorSnapshot"] = operator_snapshot
        
        # 3. Save to DB
        service_id = await sprayer_repository.create_service(service_doc)
        logger.info(f"Created new sprayer service {service_id} by operator {operator_id}")
        return service_id

    @staticmethod
    async def get_service(service_id: str) -> Dict[str, Any]:
        service = await sprayer_repository.get_by_id(service_id)
        if not service or service.get("isDeleted"):
            raise NotFoundException("Service not found")
        service["id"] = str(service["_id"])
        return service

    @staticmethod
    async def update_service(service_id: str, operator_id: str, current_version: int, data: ServiceUpdate) -> Dict[str, Any]:
        service = await SprayerServiceManagement.get_service(service_id)
        if service["operatorSnapshot"]["operatorId"] != operator_id:
            raise UnauthorizedException("You do not own this service.")
            
        update_doc = data.model_dump(exclude_unset=True)
        success = await sprayer_repository.update_service_optimistic(service_id, current_version, update_doc)
        if not success:
            raise AppException("Update failed due to version conflict.", status_code=409)
            
        return await SprayerServiceManagement.get_service(service_id)

    @staticmethod
    async def change_status(service_id: str, user_id: str, user_role: str, new_status: ServiceStatus, current_version: int) -> None:
        service = await SprayerServiceManagement.get_service(service_id)
        current_status = ServiceStatus(service["status"])
        
        is_admin = user_role in ["Admin", "SuperAdmin"]
        if not is_admin and service["operatorSnapshot"]["operatorId"] != user_id:
            raise UnauthorizedException("Not authorized to change status.")
            
        # Validate FSM Transition
        if new_status not in VALID_SERVICE_TRANSITIONS.get(current_status, []):
            if not is_admin: 
                raise AppException(f"Invalid transition from {current_status} to {new_status}", status_code=400)
            logger.warning(f"Admin override FSM: {current_status} -> {new_status} on {service_id}")

        update_doc = {"status": new_status.value}
        success = await sprayer_repository.update_service_optimistic(service_id, current_version, update_doc)
        if not success:
            raise AppException("Status change failed due to version conflict.", status_code=409)

    @staticmethod
    async def update_pricing(service_id: str, operator_id: str, current_version: int, data: PricingUpdate) -> None:
        service = await SprayerServiceManagement.get_service(service_id)
        if service["operatorSnapshot"]["operatorId"] != operator_id:
            raise UnauthorizedException("You do not own this service.")
            
        new_pricing = data.pricing.model_dump()
            
        success = await sprayer_repository.update_service_optimistic(service_id, current_version, {"pricing": new_pricing})
        if not success:
            raise AppException("Update failed due to version conflict.", status_code=409)
            
        await pricing_history_repository.log_price_change(
            service_id, service["pricing"], new_pricing, operator_id, data.reason
        )

    # --- Availability Management ---

    @staticmethod
    async def add_availability_block(service_id: str, operator_id: str, data: AvailabilityCreate) -> str:
        service = await SprayerServiceManagement.get_service(service_id)
        if service["operatorSnapshot"]["operatorId"] != operator_id:
            raise UnauthorizedException("You do not own this service.")
            
        # Check overlap
        has_overlap = await availability_repository.check_overlap(service_id, data.startTime, data.endTime)
        if has_overlap:
            raise AppException("The selected time slot overlaps with an existing block.", status_code=409)
            
        doc = data.model_dump()
        doc.update({
            "serviceId": service_id,
            "status": "ACTIVE",
            "createdAt": datetime.now(timezone.utc)
        })
        res = await availability_repository.create(doc)
        return str(res["_id"])

    # --- Media Management ---
    
    @staticmethod
    async def upload_image(service_id: str, operator_id: str, file_bytes: bytes, filename: str, is_cover: bool = False) -> str:
        service = await SprayerServiceManagement.get_service(service_id)
        if service["operatorSnapshot"]["operatorId"] != operator_id:
            raise UnauthorizedException("You do not own this service.")
            
        url = await media_service.upload_image(file_bytes, filename, folder="sprayer_services")
        
        image_doc = {
            "imageId": str(uuid.uuid4()),
            "cloudinaryUrl": url,
            "thumbnailUrl": url,
            "displayOrder": len(service.get("images", [])),
            "isCover": is_cover,
            "uploadedAt": datetime.now(timezone.utc)
        }
        await sprayer_repository.push_image(service_id, image_doc)
        return url

    # --- Search ---
    
    @staticmethod
    async def search(filters: Dict[str, Any], skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        items, total = await sprayer_repository.search_services(filters, skip, limit)
        for i in items:
            i["id"] = str(i["_id"])
        return items, total
