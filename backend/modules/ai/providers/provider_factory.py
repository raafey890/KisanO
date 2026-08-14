import json
from typing import Dict, Any, List
from .base_provider import IAIProvider
from .openai_provider import OpenAIProvider


class MockAIProvider(IAIProvider):
    """
    Mock AI provider for unit/integration tests.
    Returns deterministic canned responses without hitting external APIs.
    """

    provider_name = "MockAI"

    async def analyze_image(
        self,
        system_prompt: str,
        image_url: str,
        user_prompt: str
    ) -> str:
        return json.dumps({
            "detectedDisease": "Early Blight",
            "confidence": 0.88,
            "affectedCropParts": ["Leaves", "Stems"],
            "severity": "MODERATE",
            "treatments": [
                {
                    "treatmentType": "CHEMICAL",
                    "productName": "Mancozeb 75% WP",
                    "applicationMethod": "Foliar spray",
                    "dosage": "2.5g per litre of water",
                    "frequency": "Every 10-14 days",
                    "safetyPrecautions": "Wear gloves and mask"
                },
                {
                    "treatmentType": "ORGANIC",
                    "productName": "Neem Oil",
                    "applicationMethod": "Foliar spray",
                    "dosage": "5ml per litre of water",
                    "frequency": "Weekly",
                    "safetyPrecautions": "Apply in cooler hours"
                }
            ],
            "preventionMeasures": ["Crop rotation", "Proper spacing"],
            "additionalNotes": "Mock response for testing"
        })

    async def get_structured_response(
        self,
        system_prompt: str,
        user_prompt: str
    ) -> str:
        return json.dumps({"response": "Mock advisory response"})

    async def chat(
        self,
        system_prompt: str,
        messages: List[Dict[str, str]]
    ) -> str:
        return "Mock chat response"


def get_ai_provider(provider_name: str) -> IAIProvider:
    if provider_name == "OPENAI":
        return OpenAIProvider()
    if provider_name in ("MOCK", "mock"):
        return MockAIProvider()
    # Fallback to mock in non-production environments
    return MockAIProvider()
