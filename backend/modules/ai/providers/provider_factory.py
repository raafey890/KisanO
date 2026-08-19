"""
AI Provider Factory
Returns the appropriate AI provider based on configuration.
Supports: Gemini (default), OpenAI, and Mock (for tests).
"""
import json
import logging
from typing import Dict, List

from core.config import settings
from .base_provider import IAIProvider

logger = logging.getLogger(__name__)


class MockAIProvider(IAIProvider):
    """
    Mock AI provider for unit/integration tests.
    Returns deterministic canned responses without hitting external APIs.
    """

    provider_name = "MockAI"

    async def analyze_image(
        self, system_prompt: str, image_url: str, user_prompt: str
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
                    "safetyPrecautions": "Wear gloves and mask",
                },
                {
                    "treatmentType": "ORGANIC",
                    "productName": "Neem Oil",
                    "applicationMethod": "Foliar spray",
                    "dosage": "5ml per litre of water",
                    "frequency": "Weekly",
                    "safetyPrecautions": "Apply in cooler hours",
                },
            ],
            "preventionMeasures": ["Crop rotation", "Proper spacing"],
            "additionalNotes": "Mock response for testing",
        })

    async def get_structured_response(
        self, system_prompt: str, user_prompt: str
    ) -> str:
        return json.dumps({"response": "Mock advisory response"})

    async def chat(
        self, system_prompt: str, messages: List[Dict[str, str]]
    ) -> str:
        return "Mock chat response"


def get_ai_provider(provider_name: str = None) -> IAIProvider:
    """
    Factory function that returns the correct AI provider.

    Priority:
    1. Explicit provider_name argument.
    2. DEFAULT_AI_PROVIDER from settings.
    3. Auto-detect: use Gemini if GEMINI_API_KEY is set, else Mock.
    """
    if provider_name is None:
        provider_name = getattr(settings, "DEFAULT_AI_PROVIDER", None)

    # Auto-detect when no explicit choice
    if provider_name is None:
        if settings.GEMINI_API_KEY:
            provider_name = "GEMINI"
        else:
            provider_name = "MOCK"

    provider_name = provider_name.upper()

    if provider_name == "GEMINI":
        if not settings.GEMINI_API_KEY:
            logger.warning(
                "[AIFactory] GEMINI requested but no API key — "
                "falling back to MockAI"
            )
            return MockAIProvider()

        from .gemini_provider import GeminiProvider
        return GeminiProvider()

    if provider_name == "OPENAI":
        from .openai_provider import OpenAIProvider
        return OpenAIProvider()

    if provider_name in ("MOCK", "MOCKAI"):
        return MockAIProvider()

    # Unknown provider — fall back to mock
    logger.warning(f"[AIFactory] Unknown provider '{provider_name}' — using MockAI")
    return MockAIProvider()
