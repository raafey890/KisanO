import logging
import uuid
from typing import Dict, Any, List
from datetime import datetime, timezone
from core.exceptions import NotFoundException, AppException, UnauthorizedException
from modules.equipment.repository import equipment_repository, availability_repository, maintenance_repository
from modules.equipment.schemas import EquipmentCreate, EquipmentUpdate, AvailabilityCreate, MaintenanceCreate
from modules.equipment.constants import EquipmentStatus, VALID_TRANSITIONS
from integrations.media import media_service
from modules.users.repository import user_repository

logger = logging.getLogger(__name__)

class EquipmentService:

    @staticmethod
    async def create_equipment(user_id: str, data: EquipmentCreate) -> str:
        # Fetch Owner Snapshot from Users Module
        user = await user_repository.get_by_id(user_id)
        if not user:
            raise UnauthorizedException("Owner profile not found.")
            
        owner_snapshot = {
            "ownerId": str(user["_id"]),
            "ownerName": user.get("fullName", "Unknown"),
            "ownerRating": user.get("analytics", {}).get("averageRating", 0.0),
            "ownerVerification": user.get("kyc", {}).get("status", "PENDING"),
            "contactSummary": user.get("phone", "")
        }

        equipment_doc = data.model_dump()
        equipment_doc["ownerSnapshot"] = owner_snapshot
        
        eq_id = await equipment_repository.create_equipment(equipment_doc)
        logger.info(f"Created new equipment {eq_id} by owner {user_id}")
        return eq_id

    @staticmethod
    async def get_equipment(eq_id: str) -> Dict[str, Any]:
        eq = await equipment_repository.get_by_id(eq_id)
        if not eq or eq.get("isDeleted"):
            raise NotFoundException("Equipment not found")
        eq["id"] = str(eq["_id"])
        return eq

    @staticmethod
    async def update_equipment(eq_id: str, user_id: str, current_version: int, data: EquipmentUpdate) -> Dict[str, Any]:
        eq = await EquipmentService.get_equipment(eq_id)
        if eq["ownerSnapshot"]["ownerId"] != user_id:
            raise UnauthorizedException("You do not own this equipment.")
            
        update_doc = data.model_dump(exclude_unset=True)
        success = await equipment_repository.update_equipment_optimistic(eq_id, current_version, update_doc)
        if not success:
            raise AppException("Update failed due to a version conflict. Please refresh and try again.", status_code=409)
            
        return await EquipmentService.get_equipment(eq_id)

    @staticmethod
    async def change_status(eq_id: str, user_id: str, user_role: str, new_status: EquipmentStatus, current_version: int) -> None:
        eq = await EquipmentService.get_equipment(eq_id)
        current_status = EquipmentStatus(eq["status"])
        
        # Admin Override check
        is_admin = user_role in ["Admin", "SuperAdmin"]
        if not is_admin and eq["ownerSnapshot"]["ownerId"] != user_id:
            raise UnauthorizedException("Not authorized to change status.")
            
        # Validate FSM Transition
        if new_status not in VALID_TRANSITIONS.get(current_status, []):
            if not is_admin: # Admins can force override, owners cannot
                raise AppException(f"Invalid transition from {current_status} to {new_status}", status_code=400)
            logger.warning(f"Admin override FSM: {current_status} -> {new_status} on {eq_id}")

        success = await equipment_repository.update_status(eq_id, new_status.value, current_version)
        if not success:
            raise AppException("Status change failed due to version conflict.", status_code=409)

    # --- Media Management ---
    
    @staticmethod
    async def upload_image(eq_id: str, user_id: str, file_bytes: bytes, filename: str, is_cover: bool = False) -> str:
        eq = await EquipmentService.get_equipment(eq_id)
        if eq["ownerSnapshot"]["ownerId"] != user_id:
            raise UnauthorizedException("You do not own this equipment.")
            
        url = await media_service.upload_image(file_bytes, filename, folder="equipment")
        
        image_doc = {
            "imageId": str(uuid.uuid4()),
            "cloudinaryUrl": url,
            "thumbnailUrl": url, # Mock
            "displayOrder": len(eq.get("images", [])),
            "isCover": is_cover,
            "uploadedAt": datetime.now(timezone.utc)
        }
        await equipment_repository.push_image(eq_id, image_doc)
        return url

    @staticmethod
    async def remove_image(eq_id: str, user_id: str, image_id: str) -> None:
        eq = await EquipmentService.get_equipment(eq_id)
        if eq["ownerSnapshot"]["ownerId"] != user_id:
            raise UnauthorizedException("You do not own this equipment.")
        await equipment_repository.pull_image(eq_id, image_id)

    # --- Availability Management ---

    @staticmethod
    async def add_availability_block(eq_id: str, user_id: str, data: AvailabilityCreate) -> str:
        eq = await EquipmentService.get_equipment(eq_id)
        if eq["ownerSnapshot"]["ownerId"] != user_id:
            raise UnauthorizedException("You do not own this equipment.")
            
        # Check overlap
        has_overlap = await availability_repository.check_overlap(eq_id, data.startTime, data.endTime)
        if has_overlap:
            raise AppException("The selected time slot overlaps with an existing block or booking.", status_code=409)
            
        doc = data.model_dump()
        doc.update({
            "equipmentId": eq_id,
            "status": "ACTIVE",
            "createdAt": datetime.now(timezone.utc)
        })
        res = await availability_repository.create(doc)
        return str(res["_id"])

    # --- Maintenance Management ---

    @staticmethod
    async def log_maintenance(eq_id: str, user_id: str, data: MaintenanceCreate) -> str:
        eq = await EquipmentService.get_equipment(eq_id)
        if eq["ownerSnapshot"]["ownerId"] != user_id:
            raise UnauthorizedException("You do not own this equipment.")
            
        doc = data.model_dump()
        doc.update({
            "equipmentId": eq_id,
            "serviceDate": datetime.now(timezone.utc),
            "createdAt": datetime.now(timezone.utc)
        })
        res = await maintenance_repository.create(doc)
        return str(res["_id"])

    # --- Search ---
    
    @staticmethod
    async def search(filters: Dict[str, Any], skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        items, total = await equipment_repository.search_equipment(filters, skip, limit)
        for i in items:
            i["id"] = str(i["_id"])
        return items, total
