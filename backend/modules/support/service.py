from typing import Dict, Any, List, Optional
from core.exceptions import UnauthorizedException
from modules.support.schemas import TicketCreate, CommentCreate, KBArticleCreate
from modules.support.constants import TicketStatus
from modules.support.support_engine import support_engine
from modules.support.comment_engine import comment_engine
from modules.support.kb_engine import kb_engine
from modules.support.repository import ticket_repository, comment_repository

class SupportService:
    @staticmethod
    async def create_ticket(user_id: str, data: TicketCreate) -> str:
        return await support_engine.create_ticket(user_id, data)

    @staticmethod
    async def update_status(ticket_id: str, new_status: TicketStatus, user_id: str, user_role: str, resolution_notes: Optional[str] = None) -> bool:
        return await support_engine.update_status(ticket_id, new_status, user_id, user_role, resolution_notes)

    @staticmethod
    async def get_ticket(ticket_id: str, user_id: str, user_role: str) -> Dict[str, Any]:
        ticket = await ticket_repository.get_by_id(ticket_id)
        if not ticket or ticket.get("isDeleted"):
            from core.exceptions import NotFoundException
            raise NotFoundException("Ticket not found.")
            
        # RBAC Check
        if user_role not in ["Support Agent", "Admin", "SuperAdmin"]:
            if ticket["userSnapshot"]["userId"] != user_id:
                raise UnauthorizedException("You can only view your own tickets.")
                
        ticket["id"] = str(ticket["_id"])
        
        # Hydrate Comments
        include_internal = user_role in ["Support Agent", "Admin", "SuperAdmin"]
        comments = await comment_repository.get_ticket_comments(ticket_id, include_internal)
        for c in comments:
            c["id"] = str(c["_id"])
            
        ticket["comments"] = comments
        return ticket

    @staticmethod
    async def search_tickets(filters: Dict[str, Any], skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        items, total = await ticket_repository.search_tickets(filters, skip, limit)
        for i in items:
            i["id"] = str(i["_id"])
        return items, total

    @staticmethod
    async def add_comment(user_id: str, data: CommentCreate) -> str:
        return await comment_engine.add_comment(user_id, data)

    @staticmethod
    async def create_kb_article(author_id: str, data: KBArticleCreate) -> str:
        return await kb_engine.create_article(author_id, data)

    @staticmethod
    async def search_kb_articles(query: str) -> List[Dict[str, Any]]:
        return await kb_engine.search_articles(query)
