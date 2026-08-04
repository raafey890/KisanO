import logging
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from core.exceptions import NotFoundException, AppException

from modules.support.schemas import TicketCreate
from modules.support.constants import TicketStatus
from modules.support.repository import ticket_repository, audit_repository, sla_log_repository
from modules.support.ticket_engine import ticket_engine
from modules.support.sla_engine import sla_engine
from modules.support.assignment_engine import assignment_engine
from modules.support.events import support_events, SupportDomainEvents

from modules.users.repository import user_repository

logger = logging.getLogger(__name__)

class SupportEngine:
    """
    The main Orchestrator that unifies the FSM, SLA, Assignment, and Events.
    """
    @staticmethod
    async def create_ticket(user_id: str, data: TicketCreate) -> str:
        # Fetch user
        user = await user_repository.get_by_id(user_id)
        if not user:
            raise NotFoundException("User not found.")
            
        user_snapshot = {
            "userId": str(user["_id"]),
            "userName": user.get("fullName", "Unknown"),
            "userRole": user.get("role", "Unknown")
        }

        created_at = datetime.now(timezone.utc)
        
        # Calculate SLAs
        first_resp, resolution = sla_engine.calculate_targets(data.priority, created_at)
        
        # Build raw document
        ticket_doc = {
            "userSnapshot": user_snapshot,
            "assignedAgentSnapshot": None, # Will be set by Assignment Engine
            "category": data.category.value,
            "subCategory": data.subCategory,
            "priority": data.priority.value,
            "severity": data.severity.value,
            "status": TicketStatus.CREATED.value,
            
            "subject": data.subject,
            "description": data.description,
            "attachmentUrls": data.attachmentUrls,
            "relatedModule": data.relatedModule,
            "relatedResourceId": data.relatedResourceId,
            
            "firstResponseTargetAt": first_resp,
            "resolutionTargetAt": resolution,
            "firstResponseAt": None,
            "closedAt": None
        }
        
        # Save to DB
        ticket_id = await ticket_repository.create_ticket(ticket_doc)
        await audit_repository.log({"ticketId": ticket_id, "action": "TICKET_CREATED"})
        
        # Trigger Auto-Assignment
        agent_snapshot = await assignment_engine.get_agent_for_ticket(data.category.value, data.priority.value)
        if agent_snapshot:
            # We bypass validate_transition here since it's the system assigning immediately on create
            await ticket_repository.update_ticket(ticket_id, {
                "assignedAgentSnapshot": agent_snapshot,
                "status": TicketStatus.ASSIGNED.value
            })
            await audit_repository.log({"ticketId": ticket_id, "action": "TICKET_ASSIGNED", "agent": agent_snapshot})
            await support_events.publish(SupportDomainEvents.TICKET_ASSIGNED, {"ticketId": ticket_id, "agentId": agent_snapshot["agentId"]})
        else:
            await support_events.publish(SupportDomainEvents.TICKET_CREATED, {"ticketId": ticket_id})
            
        return ticket_id
        
    @staticmethod
    async def update_status(ticket_id: str, new_status: TicketStatus, user_id: str, user_role: str, resolution_notes: Optional[str] = None) -> bool:
        ticket = await ticket_repository.get_by_id(ticket_id)
        if not ticket or ticket.get("isDeleted"):
            raise NotFoundException("Ticket not found.")
            
        current_status = TicketStatus(ticket["status"])
        
        # 1. Enforce FSM
        ticket_engine.validate_transition(current_status, new_status)
        
        # 2. RBAC rules (e.g., Farmer can't Escalate, System can't Reopen)
        if new_status == TicketStatus.ESCALATED and user_role not in ["Support Agent", "Admin"]:
            raise AppException("Only support agents can escalate a ticket.", 403)
            
        # 3. Apply changes
        updates = {"status": new_status.value}
        if new_status == TicketStatus.RESOLVED:
            updates["resolution"] = resolution_notes
            
        # SLA Check: Resolution Target
        if new_status in [TicketStatus.RESOLVED, TicketStatus.CLOSED]:
            updates["closedAt"] = datetime.now(timezone.utc)
            if ticket["resolutionTargetAt"] and datetime.now(timezone.utc) > ticket["resolutionTargetAt"]:
                await sla_log_repository.log({
                    "ticketId": ticket_id,
                    "breachType": "RESOLUTION",
                    "targetTime": ticket["resolutionTargetAt"],
                    "actualTime": updates["closedAt"]
                })
            
        await ticket_repository.update_ticket(ticket_id, updates)
        await audit_repository.log({"ticketId": ticket_id, "action": f"STATUS_CHANGED_TO_{new_status.name}"})
        
        # 4. Fire Domain Events
        if new_status == TicketStatus.RESOLVED:
            await support_events.publish(SupportDomainEvents.TICKET_RESOLVED, {"ticketId": ticket_id})
        elif new_status == TicketStatus.ESCALATED:
            await support_events.publish(SupportDomainEvents.TICKET_ESCALATED, {"ticketId": ticket_id})
        elif new_status == TicketStatus.CLOSED:
            await support_events.publish(SupportDomainEvents.TICKET_CLOSED, {"ticketId": ticket_id})
            
        return True

support_engine = SupportEngine()
