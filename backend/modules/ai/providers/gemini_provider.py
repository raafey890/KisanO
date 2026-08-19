"""
Google Gemini AI Provider
Implements the IAIProvider interface using the Google Generative AI SDK.
"""
import logging
from typing import Dict, List

import google.generativeai as genai

from core.config import settings
from .base_provider import IAIProvider

logger = logging.getLogger(__name__)


class GeminiProvider(IAIProvider):
    """
    Production AI provider using Google Gemini.
    Supports text generation, image analysis, and multi-turn chat.
    """

    def __init__(self):
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        genai.configure(api_key=api_key)
        self._text_model = genai.GenerativeModel("gemini-1.5-flash")
        self._vision_model = genai.GenerativeModel("gemini-1.5-flash")
        logger.info("[GeminiProvider] Initialized with gemini-1.5-flash")

    async def analyze_image(
        self, system_prompt: str, image_url: str, user_prompt: str
    ) -> str:
        """
        Analyze an image using Gemini Vision.
        Downloads the image from the URL and sends it with the prompt.
        """
        try:
            import httpx

            # Download the image
            async with httpx.AsyncClient() as client:
                resp = await client.get(image_url, timeout=30)
                resp.raise_for_status()
                image_bytes = resp.content
                content_type = resp.headers.get("content-type", "image/jpeg")

            # Build the multimodal prompt
            image_part = {
                "mime_type": content_type,
                "data": image_bytes,
            }

            full_prompt = f"{system_prompt}\n\n{user_prompt}"

            response = self._vision_model.generate_content(
                [full_prompt, image_part],
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=2000,
                ),
            )

            result = response.text
            logger.info(
                f"[GeminiProvider] Image analysis complete "
                f"({len(result)} chars)"
            )
            return result

        except Exception as e:
            logger.error(f"[GeminiProvider] Image analysis failed: {e}")
            raise

    async def get_structured_response(
        self, system_prompt: str, user_prompt: str
    ) -> str:
        """
        Get a structured JSON response from Gemini.
        Used for crop advisories and reports.
        """
        try:
            full_prompt = (
                f"{system_prompt}\n\n"
                f"IMPORTANT: Respond ONLY with valid JSON. "
                f"No markdown, no explanations.\n\n"
                f"{user_prompt}"
            )

            response = self._text_model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=2000,
                ),
            )

            result = response.text
            logger.info(
                f"[GeminiProvider] Structured response complete "
                f"({len(result)} chars)"
            )
            return result

        except Exception as e:
            logger.error(f"[GeminiProvider] Structured response failed: {e}")
            raise

    async def chat(
        self, system_prompt: str, messages: List[Dict[str, str]]
    ) -> str:
        """
        Multi-turn chat using Gemini.
        Converts the OpenAI-style messages into Gemini format.
        """
        try:
            # Build conversation history for Gemini
            gemini_history = []
            for msg in messages[:-1]:  # All messages except the last
                role = "user" if msg["role"] == "user" else "model"
                gemini_history.append({
                    "role": role,
                    "parts": [msg["content"]],
                })

            # Start chat with history
            chat = self._text_model.start_chat(history=gemini_history)

            # The last message is the current user input
            last_message = messages[-1]["content"] if messages else ""
            full_prompt = f"{system_prompt}\n\n{last_message}"

            response = chat.send_message(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=1500,
                ),
            )

            result = response.text
            logger.info(
                f"[GeminiProvider] Chat response complete "
                f"({len(result)} chars)"
            )
            return result

        except Exception as e:
            logger.error(f"[GeminiProvider] Chat failed: {e}")
            raise
