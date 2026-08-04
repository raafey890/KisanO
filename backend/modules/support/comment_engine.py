from typing import Dict, Any, List
from core.exceptions import NotFoundException, UnauthorizedException
from modules.support.schemas import CommentCreate
from modules.support.constants import CommentVisibility
from modules.support.repository import comment_repository, ticket_repository, audit_repository

from modules.users.repository import user_repository

class CommentEngine:
    @staticmethod
    async def add_comment(user_id: str, data: CommentCreate) -> str:
        # Fetch ticket
        ticket = await ticket_repository.get_by_id(data.ticketId)
        if not ticket or ticket.get("isDeleted"):
            raise NotFoundException("Ticket not found.")
            
        # Fetch user (Author)
        user = await user_repository.get_by_id(user_id)
        if not user:
            raise NotFoundException("User not found.")
            
        author_role = user.get("role", "Unknown")
        
        # Enforce Visibility RBAC
        # Farmers cannot create INTERNAL comments
        if data.visibility == CommentVisibility.INTERNAL and author_role not in ["Support Agent", "Admin", "SuperAdmin"]:
            raise UnauthorizedException("Customers cannot add internal notes.")
            
        # Ensure Farmer only comments on their own ticket
        if author_role not in ["Support Agent", "Admin", "SuperAdmin"]:
            if ticket["userSnapshot"]["userId"] != user_id:
                raise UnauthorizedException("You can only comment on your own tickets.")
        
        # In a real system, SLA Engine would check "First Response Time" here if a Support Agent replies to a Farmer.
        
        comment_doc = {
            "ticketId": data.ticketId,
            "authorId": str(user["_id"]),
            "authorName": user.get("fullName", "Unknown"),
            "authorRole": author_role,
            "comment": data.comment,
            "visibility": data.visibility.value,
            "attachmentUrls": data.attachmentUrls
        }
        
        comment_id = await comment_repository.create_comment(comment_doc)
        await audit_repository.log({"ticketId": data.ticketId, "action": "COMMENT_ADDED", "commentId": comment_id})
        
        return comment_id

comment_engine = CommentEngine()
