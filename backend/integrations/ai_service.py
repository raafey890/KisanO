"""
AI Integration Service
Convenience wrapper around the AI provider system.
Provides simple top-level functions for other modules to call.
"""
import logging
from typing import Dict, List, Optional

from modules.ai.providers.provider_factory import get_ai_provider

logger = logging.getLogger(__name__)


class AIIntegrationService:
    """
    High-level AI service for use outside the AI module.
    Automatically selects the configured provider (Gemini by default).
    """

    @staticmethod
    async def analyze_image(
        image_url: str,
        prompt: str,
        system_prompt: Optional[str] = None,
    ) -> str:
        """
        Analyze an image with the configured AI provider.

        Args:
            image_url: Public URL of the image.
            prompt: User's question/context about the image.
            system_prompt: Optional system instruction.

        Returns:
            AI response text (usually JSON for disease detection).
        """
        provider = get_ai_provider()
        sys_prompt = system_prompt or "You are an expert agricultural AI assistant."
        return await provider.analyze_image(sys_prompt, image_url, prompt)

    @staticmethod
    async def get_response(
        prompt: str,
        system_prompt: Optional[str] = None,
    ) -> str:
        """
        Get a text/JSON response from the AI.

        Args:
            prompt: The user's question.
            system_prompt: Optional system instruction.

        Returns:
            AI response text.
        """
        provider = get_ai_provider()
        sys_prompt = system_prompt or "You are an expert agricultural AI assistant."
        return await provider.get_structured_response(sys_prompt, prompt)

    @staticmethod
    async def chat(
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
    ) -> str:
        """
        Multi-turn conversation with the AI.

        Args:
            messages: List of {"role": "user"/"assistant", "content": "..."}.
            system_prompt: Optional system instruction.

        Returns:
            AI response text.
        """
        provider = get_ai_provider()
        sys_prompt = system_prompt or "You are an expert agricultural AI assistant."
        return await provider.chat(sys_prompt, messages)


ai_integration_service = AIIntegrationService()
