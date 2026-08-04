from typing import List, Dict, Any

class KnowledgeBaseService:
    """Mocked service for Knowledge Base Articles. In production, this reads from MongoDB."""
    
    ARTICLES = [
        {
            "id": "art1",
            "title": "Understanding the AI Plant Doctor",
            "content": "The AI Plant Doctor analyzes crop images to detect diseases...",
            "category": "AI_PLANT_DOCTOR",
            "tags": ["guide", "ai"],
            "viewCount": 150,
            "helpfulVotes": 45
        }
    ]

    @classmethod
    def get_articles(cls) -> List[Dict[str, Any]]:
        return cls.ARTICLES
