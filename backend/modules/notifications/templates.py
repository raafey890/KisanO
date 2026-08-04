from typing import Dict, Any, Tuple
import re
from modules.notifications.repository import template_repo

class TemplateEngine:
    """
    Resolves variables like {{bookingId}} from the payload.
    """
    
    # Mock templates to use if MongoDB fallback fails (useful for bootstrap)
    _mock_templates = {
        "BOOKING_CONFIRMED": {
            "subject": "Booking {{bookingId}} Confirmed",
            "body": "Hi {{userName}}, your booking for {{equipmentName}} on {{date}} is confirmed!"
        },
        "PAYMENT_SUCCESS": {
            "subject": "Payment Received: {{amount}}",
            "body": "Thank you {{userName}}. We have successfully processed your payment of {{amount}} for {{reference}}."
        }
    }

    async def render(self, template_id: str, channel: str, language: str, payload: Dict[str, Any]) -> Tuple[str, str]:
        """
        Returns (Subject, Body)
        """
        # 1. Try fetching from DB
        db_template = await template_repo.get_template(template_id, channel, language)
        
        if db_template:
            subject_tmpl = db_template["subjectTemplate"]
            body_tmpl = db_template["bodyTemplate"]
        else:
            # 2. Fallback to mock dictionaries
            fallback = self._mock_templates.get(template_id)
            if not fallback:
                # If absolute failure, just dump the payload
                return f"Notification: {template_id}", f"Data: {str(payload)}"
            subject_tmpl = fallback["subject"]
            body_tmpl = fallback["body"]
            
        # 3. Simple Interpolation
        def replace_var(match):
            var_name = match.group(1).strip()
            return str(payload.get(var_name, f"{{{{{var_name}}}}}"))
            
        subject = re.sub(r'\{\{(.*?)\}\}', replace_var, subject_tmpl)
        body = re.sub(r'\{\{(.*?)\}\}', replace_var, body_tmpl)
        
        return subject, body

template_engine = TemplateEngine()
