from typing import Any, Dict
# Centralized imports to avoid circular dependencies in tests

class TestingEngine:
    """
    Unified Testing Engine Facade.
    Provides central hooks to spin up DB mocks, clean up data, and access fixtures.
    """
    @staticmethod
    def get_db_mode() -> str:
        """
        Returns 'mongomock' or 'testcontainers' based on env vars.
        """
        import os
        return os.getenv("TEST_DB_MODE", "mongomock")

testing_engine = TestingEngine()
