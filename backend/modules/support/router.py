from fastapi import APIRouter, Depends, Query, Body
from typing import Dict, Any, List
from modules.auth.dependencies import get_current_user_id, get_current_user_role
from modules.support.schemas import TicketCreate, TicketResponse, CommentCreate, KBArticleCreate, KBArticleResponse
from modules.support.service import SupportService
from modules.support.constants import TicketStatus

router = APIRouter(prefix="/api/v1/support", tags=["Support Center"])

@router.post("/tickets", response_model=Dict[str, str])
async def create_ticket(
    data: TicketCreate,
    user_id: str = Depends(get_current_user_id)
):
    """
    Submits a new support ticket.
    """
    ticket_id = await SupportService.create_ticket(user_id, data)
    return {"ticketId": ticket_id}

@router.get("/tickets", response_model=Dict[str, Any])
async def get_tickets(
    status: str = None,
    priority: str = None,
    category: str = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id),
    user_role: str = Depends(get_current_user_role)
):
    """
    Fetches support tickets. Farmers only see their own.
    """
    filters = {}
    if user_role not in ["Support Agent", "Admin", "SuperAdmin"]:
        filters["userId"] = user_id
    
    if status: filters["status"] = status
    if priority: filters["priority"] = priority
    if category: filters["category"] = category
        
    items, total = await SupportService.search_tickets(filters, skip, limit)
    return {"items": items, "total": total, "skip": skip, "limit": limit}

@router.get("/tickets/{ticket_id}", response_model=Dict[str, Any])
async def get_ticket(
    ticket_id: str,
    user_id: str = Depends(get_current_user_id),
    user_role: str = Depends(get_current_user_role)
):
    """
    Fetches a specific ticket, its snapshots, and its threaded comments.
    """
    return await SupportService.get_ticket(ticket_id, user_id, user_role)

@router.patch("/tickets/{ticket_id}/status", response_model=Dict[str, str])
async def update_ticket_status(
    ticket_id: str,
    status: TicketStatus = Body(..., embed=True),
    resolution: str = Body(None, embed=True),
    user_id: str = Depends(get_current_user_id),
    user_role: str = Depends(get_current_user_role)
):
    """
    Advances the Ticket FSM (e.g. In Progress -> Resolved).
    """
    await SupportService.update_status(ticket_id, status, user_id, user_role, resolution)
    return {"message": f"Status updated to {status.value}"}

@router.post("/tickets/comments", response_model=Dict[str, str])
async def add_comment(
    data: CommentCreate,
    user_id: str = Depends(get_current_user_id)
):
    """
    Adds a public or internal comment to a ticket.
    """
    comment_id = await SupportService.add_comment(user_id, data)
    return {"commentId": comment_id}

@router.get("/knowledge-base/search", response_model=List[KBArticleResponse])
async def search_kb(query: str = Query(..., min_length=3)):
    """
    Searches published Knowledge Base articles.
    """
    return await SupportService.search_kb_articles(query)
