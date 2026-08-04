from typing import Dict, Any, List, Optional
from core.exceptions import NotFoundException
from shared.base_repository import BaseRepository

class BaseService:
    """Generic base service class."""
    
    def __init__(self, repository: BaseRepository):
        self.repository = repository

    async def get_by_id(self, id: str) -> Dict[str, Any]:
        item = await self.repository.get_by_id(id)
        if not item:
            raise NotFoundException("Resource not found")
        
        # Format id string
        item["id"] = str(item["_id"])
        del item["_id"]
        return item

    async def find_all(self, skip: int = 0, limit: int = 20, filters: Dict[str, Any] = {}) -> Dict[str, Any]:
        items, total = await self.repository.find(filters, skip, limit)
        for item in items:
            item["id"] = str(item["_id"])
            if "_id" in item: del item["_id"]
            
        return {
            "items": items,
            "total": total,
            "skip": skip,
            "limit": limit
        }
