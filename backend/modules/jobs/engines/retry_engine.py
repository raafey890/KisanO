class RetryEngine:
    @staticmethod
    def calculate_backoff(retry_count: int, base_delay: int = 5) -> int:
        """
        Calculates exponential backoff: base_delay * (2 ^ retry_count)
        """
        return base_delay * (2 ** retry_count)
        
    @staticmethod
    def should_retry(retry_count: int, max_retries: int = 3) -> bool:
        return retry_count < max_retries

retry_engine = RetryEngine()
