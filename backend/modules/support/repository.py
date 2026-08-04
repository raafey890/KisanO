from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from bson import ObjectId

class TicketRepository(BaseRepository):
    def __init__(self):
        super().__init__("support_tickets")

    async def setup_indexes(self):
        await self.collection.create_index("ticketNumber", unique=True)
        await self.collection.create_index("userSnapshot.userId")
        await self.collection.create_index("assignedAgentSnapshot.agentId")
        await self.collection.create_index("status")
        await self.collection.create_index("priority")
        await self.collection.create_index("category")
        await self.collection.create_index("createdAt")

    async def generate_number(self) -> str:
        """Generates sequential number e.g. SUP-2026-000001"""
        year = datetime.now(timezone.utc).year
        count = await self.collection.count_documents({
            "createdAt": {
                "$gte": datetime(year, 1, 1, tzinfo=timezone.utc),
                "$lt": datetime(year + 1, 1, 1, tzinfo=timezone.utc)
            }
        })
        sequence = str(count + 1).zfill(6)
        return f"SUP-{year}-{sequence}"

    async def create_ticket(self, data: Dict[str, Any]) -> str:
        data["ticketNumber"] = await self.generate_number()
        data["isDeleted"] = False
        data["createdAt"] = datetime.now(timezone.utc)
        data["updatedAt"] = datetime.now(timezone.utc)
        
        res = await self.create(data)
        return str(res["_id"])

    async def update_ticket(self, ticket_id: str, fields: Dict[str, Any]) -> bool:
        fields["updatedAt"] = datetime.now(timezone.utc)
        result = await self.collection.update_one(
            {"_id": ObjectId(ticket_id)},
            {"$set": fields}
        )
        return result.modified_count > 0

    async def search_tickets(self, filters: Dict[str, Any], skip: int = 0, limit: int = 20) -> tuple[List[Dict[str, Any]], int]:
        query = {"isDeleted": False}
        
        if "userId" in filters:
            query["userSnapshot.userId"] = filters["userId"]
        if "agentId" in filters:
            query["assignedAgentSnapshot.agentId"] = filters["agentId"]
        if "status" in filters:
            query["status"] = filters["status"]
        if "priority" in filters:
            query["priority"] = filters["priority"]
        if "category" in filters:
            query["category"] = filters["category"]
            
        cursor = self.collection.find(query)
        
        sort_by = filters.get("sort", "newest")
        if sort_by == "newest":
            cursor = cursor.sort("createdAt", -1)
        elif sort_by == "oldest":
            cursor = cursor.sort("createdAt", 1)
        elif sort_by == "priority":
            # Assuming custom sorting would be handled via weights in a real scenario
            cursor = cursor.sort([("priority", -1), ("createdAt", -1)])
            
        cursor = cursor.skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(query)
        return items, total

class CommentRepository(BaseRepository):
    def __init__(self):
        super().__init__("ticket_comments")

    async def create_comment(self, data: Dict[str, Any]) -> str:
        data["isEdited"] = False
        data["isDeleted"] = False
        data["createdAt"] = datetime.now(timezone.utc)
        data["updatedAt"] = datetime.now(timezone.utc)
        res = await self.create(data)
        return str(res["_id"])

    async def get_ticket_comments(self, ticket_id: str, include_internal: bool = False) -> List[Dict[str, Any]]:
        query = {"ticketId": ticket_id, "isDeleted": False}
        if not include_internal:
            query["visibility"] = "PUBLIC"
            
        cursor = self.collection.find(query).sort("createdAt", 1)
        return await cursor.to_list(length=100)

class KBRepository(BaseRepository):
    def __init__(self):
        super().__init__("knowledge_base")

    async def create_article(self, data: Dict[str, Any]) -> str:
        data["version"] = 1
        data["createdAt"] = datetime.now(timezone.utc)
        data["updatedAt"] = datetime.now(timezone.utc)
        res = await self.create(data)
        return str(res["_id"])

class SupportAuxRepository(BaseRepository):
    def __init__(self, collection_name: str):
        super().__init__(collection_name)

    async def log(self, data: Dict[str, Any]):
        data["createdAt"] = datetime.now(timezone.utc)
        await self.create(data)

ticket_repository = TicketRepository()
comment_repository = CommentRepository()
kb_repository = KBRepository()
sla_log_repository = SupportAuxRepository("sla_logs")
audit_repository = SupportAuxRepository("support_audit_logs")
