import pytest
from datetime import datetime, timezone
from core.exceptions import AppException

def test_ticket_engine_transitions():
    from modules.support.ticket_engine import ticket_engine
    from modules.support.constants import TicketStatus
    
    # Valid Transition
    assert ticket_engine.validate_transition(TicketStatus.CREATED, TicketStatus.ASSIGNED) == True
    assert ticket_engine.validate_transition(TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED) == True
    
    # Invalid Transition
    with pytest.raises(AppException):
        ticket_engine.validate_transition(TicketStatus.CREATED, TicketStatus.CLOSED)
        
def test_sla_engine():
    from modules.support.sla_engine import sla_engine
    from modules.support.constants import TicketPriority
    
    start_time = datetime(2026, 1, 1, 12, 0, tzinfo=timezone.utc)
    
    # Critical should be 1 hr first response, 4 hr resolution
    f_resp, res = sla_engine.calculate_targets(TicketPriority.CRITICAL, start_time)
    assert f_resp.hour == 13
    assert res.hour == 16
