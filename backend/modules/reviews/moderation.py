import re
from typing import Dict, Any, List
from modules.reviews.constants import ModerationStatus

class ModerationEngine:
    def __init__(self):
        # In a real enterprise system, this is loaded from DB or external service.
        self.blocked_words = {"spam", "scam", "fake", "abuse1", "abuse2"}

    def auto_moderate(self, title: str, comment: str) -> ModerationStatus:
        """
        Runs simple rules and fake AI sentiment hooks to auto-moderate.
        """
        text = f"{title or ''} {comment or ''}".lower()
        
        # 1. Blocked Words Check
        for word in self.blocked_words:
            if re.search(r'\b' + re.escape(word) + r'\b', text):
                return ModerationStatus.HIDDEN
                
        # 2. Future AI Hook Placeholder
        # if await self.call_ai_sentiment_analyzer(text) < 0.2: # High toxicity
        #     return ModerationStatus.HIDDEN
            
        return ModerationStatus.APPROVED

moderation_engine = ModerationEngine()
