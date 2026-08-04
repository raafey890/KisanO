from typing import Dict, Any, List
from modules.support.schemas import KBArticleCreate
from modules.support.repository import kb_repository, audit_repository
from modules.support.events import support_events, SupportDomainEvents

class KBEngine:
    @staticmethod
    async def create_article(author_id: str, data: KBArticleCreate) -> str:
        doc = {
            "title": data.title,
            "content": data.content,
            "category": data.category,
            "tags": data.tags,
            "authorId": author_id,
            "isPublished": True # Simple MVP default
        }
        
        article_id = await kb_repository.create_article(doc)
        await audit_repository.log({"articleId": article_id, "action": "KB_ARTICLE_CREATED"})
        
        await support_events.publish(SupportDomainEvents.KNOWLEDGE_BASE_UPDATED, {"articleId": article_id})
        
        return article_id
        
    @staticmethod
    async def search_articles(query: str) -> List[Dict[str, Any]]:
        # In a real system, this would use MongoDB Atlas Full Text Search.
        # Here we do a basic regex match on title and content.
        cursor = kb_repository.collection.find({
            "isPublished": True,
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},
                {"content": {"$regex": query, "$options": "i"}}
            ]
        }).limit(20)
        
        items = await cursor.to_list(length=20)
        for i in items:
            i["id"] = str(i["_id"])
        return items

kb_engine = KBEngine()
