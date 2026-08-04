from typing import Dict, Any, List
from modules.analytics.constants import ReportType
from modules.analytics.repository import report_repo

class ReportEngine:
    @staticmethod
    async def schedule_report(user_id: str, report_type: ReportType, email_list: List[str]) -> str:
        doc = {
            "userId": user_id,
            "type": report_type.value,
            "emails": email_list,
            "isActive": True
        }
        res = await report_repo.create(doc)
        return str(res["_id"])

report_engine = ReportEngine()
