from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Tuple
from modules.support.constants import TicketPriority

class SLAEngine:
    """
    Manages SLA targets. In a real production system, this would skip weekends
    and holidays by using a Business Hours library.
    """
    
    # Simple SLA Matrix (Hours)
    # Priority: (First Response, Resolution)
    SLA_MATRIX = {
        TicketPriority.CRITICAL: (1, 4),
        TicketPriority.HIGH: (4, 24),
        TicketPriority.MEDIUM: (24, 72),
        TicketPriority.LOW: (48, 120),
    }

    def calculate_targets(self, priority: TicketPriority, created_at: datetime) -> Tuple[datetime, datetime]:
        """
        Returns (firstResponseTargetAt, resolutionTargetAt)
        """
        first_resp_hours, resolution_hours = self.SLA_MATRIX.get(priority, self.SLA_MATRIX[TicketPriority.MEDIUM])
        
        first_resp_target = created_at + timedelta(hours=first_resp_hours)
        resolution_target = created_at + timedelta(hours=resolution_hours)
        
        return first_resp_target, resolution_target

sla_engine = SLAEngine()
