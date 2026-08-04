import logging
import uuid
from typing import Dict, Any, List
from core.exceptions import NotFoundException, AppException
from modules.users.repository import user_repository
from modules.users.schemas import ProfileUpdate, FarmCreate, AddressCreate
from integrations.media import media_service
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

class UserService:
    
    @staticmethod
    def _calculate_completion(user: Dict[str, Any]) -> int:
        """
        Dynamically calculates profile completion percentage.
        Base points:
        - Email: 10%
        - First & Last Name: 20%
        - Profile Photo: 20%
        - At least 1 Farm: 20%
        - At least 1 Address: 20%
        - KYC Verified: 10%
        """
        score = 0
        if user.get("email"): score += 10
        
        profile = user.get("profile", {})
        if profile.get("firstName") and profile.get("lastName"): score += 20
        if profile.get("profilePhotoUrl"): score += 20
        
        if len(user.get("farms", [])) > 0: score += 20
        if len(user.get("addresses", [])) > 0: score += 20
        
        kyc = user.get("kyc", {})
        if kyc.get("status") == "VERIFIED": score += 10
        
        return min(score, 100)

    @staticmethod
    async def get_user_profile(user_id: str) -> Dict[str, Any]:
        user = await user_repository.get_full_profile(user_id)
        if not user:
            raise NotFoundException("User not found")
            
        # Guarantee embedded structures exist for response mapping
        user.setdefault("profile", {})
        user.setdefault("preferences", {
            "language": "en", "notificationsEnabled": True, "theme": "system",
            "measurementUnit": "metric", "currency": "INR", "dateFormat": "DD/MM/YYYY", "timeFormat": "24h"
        })
        user.setdefault("farms", [])
        user.setdefault("addresses", [])
        
        # Calculate dynamic completion before returning
        user["profile"]["completionPercentage"] = UserService._calculate_completion(user)
        
        user["id"] = str(user["_id"])
        user.pop("passwordHash", None)
        user.pop("deviceSessions", None)
        user.pop("failedLoginAttempts", None)
        
        return user

    @staticmethod
    async def update_profile(user_id: str, data: ProfileUpdate) -> Dict[str, Any]:
        logger.info(f"Updating profile for user: {user_id}")
        
        # Check email uniqueness if changing email
        if data.email:
            existing = await user_repository.get_by_email(data.email)
            if existing and str(existing["_id"]) != user_id:
                raise AppException("Email is already in use by another account", 400)

        # Get current state to compute new completion score
        current_user = await user_repository.get_full_profile(user_id)
        if not current_user:
            raise NotFoundException("User not found")
            
        # Temporarily apply updates to calculate score
        temp_user = current_user.copy()
        temp_user.setdefault("profile", {})
        for k, v in data.model_dump(exclude_unset=True).items():
            if k == "email":
                temp_user["email"] = v
            else:
                temp_user["profile"][k] = v
                
        new_score = UserService._calculate_completion(temp_user)
        
        await user_repository.update_profile(user_id, data.model_dump(exclude_unset=True), new_score)
        return await UserService.get_user_profile(user_id)

    @staticmethod
    async def upload_profile_photo(user_id: str, file_bytes: bytes, filename: str) -> str:
        # Mock upload using the media abstraction
        photo_url = await media_service.upload_image(file_bytes, filename, folder="profiles")
        
        # Update user profile
        current = await user_repository.get_full_profile(user_id)
        current.setdefault("profile", {})["profilePhotoUrl"] = photo_url
        new_score = UserService._calculate_completion(current)
        
        await user_repository.update_profile(user_id, {"profilePhotoUrl": photo_url}, new_score)
        return photo_url

    # --- Farm Management ---
    @staticmethod
    async def add_farm(user_id: str, farm: FarmCreate) -> Dict[str, Any]:
        farm_data = farm.model_dump()
        farm_data["id"] = str(uuid.uuid4())
        
        # We don't unset default farm here, but normally you would if isDefault=True
        
        await user_repository.add_farm(user_id, farm_data)
        
        # Recompute completion
        user = await user_repository.get_full_profile(user_id)
        await user_repository.update_profile(user_id, {}, UserService._calculate_completion(user))
        
        return farm_data

    @staticmethod
    async def remove_farm(user_id: str, farm_id: str) -> None:
        await user_repository.remove_farm(user_id, farm_id)
        # Recompute completion
        user = await user_repository.get_full_profile(user_id)
        await user_repository.update_profile(user_id, {}, UserService._calculate_completion(user))

    # --- Address Management ---
    @staticmethod
    async def add_address(user_id: str, address: AddressCreate) -> Dict[str, Any]:
        addr_data = address.model_dump()
        addr_data["id"] = str(uuid.uuid4())
        
        if address.isDefault:
            await user_repository.unset_default_addresses(user_id)
            
        await user_repository.add_address(user_id, addr_data)
        
        user = await user_repository.get_full_profile(user_id)
        await user_repository.update_profile(user_id, {}, UserService._calculate_completion(user))
        return addr_data

    @staticmethod
    async def remove_address(user_id: str, address_id: str) -> None:
        await user_repository.remove_address(user_id, address_id)
        user = await user_repository.get_full_profile(user_id)
        await user_repository.update_profile(user_id, {}, UserService._calculate_completion(user))

    # --- Admin Functions ---
    @staticmethod
    async def update_status(user_id: str, status: str) -> None:
        valid_statuses = ["ACTIVE", "INACTIVE", "SUSPENDED", "BLOCKED", "DELETED"]
        if status not in valid_statuses:
            raise AppException("Invalid status", 400)
            
        await user_repository.update(user_id, {"status": status, "updatedAt": datetime.now(timezone.utc)})

    @staticmethod
    async def search_users(filters: Dict[str, Any], skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        items, total = await user_repository.search_users(filters, skip, limit)
        for user in items:
            user["id"] = str(user["_id"])
            user.pop("passwordHash", None)
            
            # Form defaults
            user.setdefault("profile", {})
            user.setdefault("preferences", {})
            user.setdefault("farms", [])
            user.setdefault("addresses", [])
            user["profile"]["completionPercentage"] = UserService._calculate_completion(user)
            
        return items, total
