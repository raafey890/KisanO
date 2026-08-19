from core.config import settings


class RetryEngine:
    @staticmethod
    def calculate_backoff(retry_count: int, base_delay: int = None) -> int:
        """
        Calculates exponential backoff based on settings.
        """
        if base_delay is None:
            base_delay = settings.RETRY_DELAY_SECONDS
        return int(base_delay * (settings.BACKOFF_MULTIPLIER ** retry_count))

    @staticmethod
    def should_retry(retry_count: int, max_retries: int = None) -> bool:
        if max_retries is None:
            max_retries = settings.MAX_JOB_RETRIES
        return retry_count < max_retries


retry_engine = RetryEngine()
