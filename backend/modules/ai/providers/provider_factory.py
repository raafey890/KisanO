from .base_provider import IAIProvider
from .openai_provider import OpenAIProvider

def get_ai_provider(provider_name: str) -> IAIProvider:
    if provider_name == "OPENAI":
        return OpenAIProvider()
    # future: elif provider_name == "GEMINI": return GeminiProvider()
    raise ValueError(f"Unsupported AI Provider: {provider_name}")
