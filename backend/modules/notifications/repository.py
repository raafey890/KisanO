from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from bson import ObjectId

class NotificationRepository(BaseRepository):
    def __init__(self):
        super().__init__("notifications")

    async def setup_indexes(self):
        await self.collection.create_index("notificationNumber", unique=True)
        await self.collection.create_index("userSnapshot.userId")
        await self.collection.create_index("status")
        await self.collection.create_index("createdAt")

    async def generate_number(self) -> str:
        """Generates sequential number e.g. NOT-2026-000001"""
        year = datetime.now(timezone.utc).year
        count = await self.collection.count_documents({
            "createdAt": {
                "$gte": datetime(year, 1, 1, tzinfo=timezone.utc),
                "$lt": datetime(year + 1, 1, 1, tzinfo=timezone.utc)
            }
        })
        sequence = str(count + 1).zfill(6)
        return f"NOT-{year}-{sequence}"

    async def create_notification(self, data: Dict[str, Any]) -> str:
        data["notificationNumber"] = await self.generate_number()
        data["isDeleted"] = False
        data["isRead"] = False
        data["createdAt"] = datetime.now(timezone.utc)
        data["updatedAt"] = datetime.now(timezone.utc)
        
        res = await self.create(data)
        return str(res["_id"])

    async def update_status(self, notification_id: str, status: str, fields: Dict[str, Any] = None) -> bool:
        update_doc = {"status": status, "updatedAt": datetime.now(timezone.utc)}
        if fields:
            update_doc.update(fields)
            
        result = await self.collection.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": update_doc}
        )
        return result.modified_count > 0
        
    async def mark_as_read(self, notification_id: str) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": {"isRead": True, "readAt": datetime.now(timezone.utc), "updatedAt": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0


class TemplateRepository(BaseRepository):
    def __init__(self):
        super().__init__("notification_templates")

    async def get_template(self, template_id: str, channel: str, language: str) -> Optional[Dict[str, Any]]:
        # Sort by version descending to get latest
        cursor = self.collection.find({
            "templateId": template_id,
            "channel": channel,
            "language": language
        }).sort("version", -1).limit(1)
        
        results = await cursor.to_list(length=1)
        return results[0] if results else None


class PreferenceRepository(BaseRepository):
    def __init__(self):
        super().__init__("notification_preferences")

    async def get_preferences(self, user_id: str) -> Dict[str, Any]:
        pref = await self.collection.find_one({"userId": user_id})
        if not pref:
            # Return defaults
            return {
                "userId": user_id,
                "pushEnabled": True,
                "emailEnabled": True,
                "smsEnabled": True,
                "language": "en",
                "quietHoursStart": None,
                "quietHoursEnd": None,
                "marketingOptIn": False
            }
        return pref


class NotificationAuxRepository(BaseRepository):
    def __init__(self, collection_name: str):
        super().__init__(collection_name)

    async def log(self, data: Dict[str, Any]):
        data["createdAt"] = datetime.now(timezone.utc)
        await self.create(data)


notification_repo = NotificationRepository()
template_repo = TemplateRepository()
preference_repo = PreferenceRepository()
audit_repo = NotificationAuxRepository("notification_logs")
failure_repo = NotificationAuxRepository("notification_failures")
