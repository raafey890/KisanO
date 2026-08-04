from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from bson import ObjectId

class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__("users")

    # The creation of user documents is handled in the Auth module. 
    # This repository expands upon it for profile management.

    async def get_by_phone(self, phone: str) -> Optional[Dict[str, Any]]:
        return await self.collection.find_one({"phone": phone, "isDeleted": False})

    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        return await self.collection.find_one({"email": email, "isDeleted": False})
        
    async def get_full_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        return await self.get_by_id(user_id)

    # --- Embedded Document Helpers ---

    async def update_profile(self, user_id: str, profile_data: Dict[str, Any], completion_score: int):
        update_doc = {f"profile.{k}": v for k, v in profile_data.items() if v is not None}
        update_doc["profile.completionPercentage"] = completion_score
        update_doc["updatedAt"] = datetime.now(timezone.utc)
        
        # If email or full name changes, update root as well
        if "email" in profile_data and profile_data["email"]:
            update_doc["email"] = profile_data["email"]
        if "firstName" in profile_data or "lastName" in profile_data:
            first = profile_data.get("firstName", "")
            last = profile_data.get("lastName", "")
            update_doc["fullName"] = f"{first} {last}".strip()

        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_doc}
        )

    async def update_preferences(self, user_id: str, preferences: Dict[str, Any]):
        update_doc = {f"preferences.{k}": v for k, v in preferences.items()}
        update_doc["updatedAt"] = datetime.now(timezone.utc)
        await self.collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_doc})

    # --- Farms ---

    async def add_farm(self, user_id: str, farm_data: Dict[str, Any]):
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$push": {"farms": farm_data},
                "$set": {"updatedAt": datetime.now(timezone.utc)}
            }
        )
        
    async def remove_farm(self, user_id: str, farm_id: str):
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$pull": {"farms": {"id": farm_id}},
                "$set": {"updatedAt": datetime.now(timezone.utc)}
            }
        )

    # --- Addresses ---

    async def add_address(self, user_id: str, address_data: Dict[str, Any]):
        # If isDefault is true, unset others first (business logic usually handles this, but repo can enforce)
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$push": {"addresses": address_data},
                "$set": {"updatedAt": datetime.now(timezone.utc)}
            }
        )
        
    async def unset_default_addresses(self, user_id: str):
        # Mocks setting isDefault to False for all elements in array using arrayFilters
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"addresses.$[elem].isDefault": False}},
            array_filters=[{"elem.isDefault": True}]
        )

    async def remove_address(self, user_id: str, address_id: str):
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$pull": {"addresses": {"id": address_id}},
                "$set": {"updatedAt": datetime.now(timezone.utc)}
            }
        )
        
    # --- Analytics & Search ---
    
    async def search_users(self, filters: Dict[str, Any], skip: int = 0, limit: int = 20) -> tuple[List[Dict[str, Any]], int]:
        query = {"isDeleted": False}
        
        if "role" in filters:
            query["role"] = filters["role"]
        if "status" in filters:
            query["status"] = filters["status"]
        if "query" in filters: # Search name, phone, email
            search_regex = {"$regex": filters["query"], "$options": "i"}
            query["$or"] = [
                {"fullName": search_regex},
                {"phone": search_regex},
                {"email": search_regex}
            ]
            
        cursor = self.collection.find(query).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(query)
        return items, total

user_repository = UserRepository()
