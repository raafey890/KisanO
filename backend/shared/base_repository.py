from typing import Generic, TypeVar, Dict, Any, List, Optional
from pydantic import BaseModel
from bson import ObjectId
from db.mongodb import get_db

T = TypeVar("T", bound=BaseModel)

class BaseRepository(Generic[T]):
    """Generic repository providing standard CRUD operations for MongoDB."""
    
    def __init__(self, collection_name: str):
        self.collection_name = collection_name

    @property
    def collection(self):
        return get_db()[self.collection_name]

    async def get_by_id(self, id: str) -> Optional[Dict[str, Any]]:
        return await self.collection.find_one({"_id": ObjectId(id)})

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        result = await self.collection.insert_one(data)
        data["_id"] = result.inserted_id
        return data

    async def update(self, id: str, data: Dict[str, Any]) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": data}
        )
        return result.modified_count > 0

    async def delete(self, id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
        
    async def find(self, filter_query: Dict[str, Any] = {}, skip: int = 0, limit: int = 100) -> tuple[List[Dict[str, Any]], int]:
        cursor = self.collection.find(filter_query).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(filter_query)
        return items, total
