from typing import List, Dict, Any

class FAQService:
    """Mocked service for FAQs. In production, this reads from MongoDB."""
    
    FAQS = [
        {
            "id": "faq1",
            "question": "How do I reset my password?",
            "answer": "Go to the login screen and click 'Forgot Password'. Follow the email instructions.",
            "category": "AUTHENTICATION",
            "tags": ["password", "login"],
            "displayOrder": 1
        },
        {
            "id": "faq2",
            "question": "When will my equipment be delivered?",
            "answer": "Delivery times depend on the equipment owner, typically 1-2 days.",
            "category": "EQUIPMENT_BOOKING",
            "tags": ["delivery", "booking"],
            "displayOrder": 2
        }
    ]

    @classmethod
    def get_all_faqs(cls) -> List[Dict[str, Any]]:
        return cls.FAQS
