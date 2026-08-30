from typing import List, Optional
from pydantic import Field, AliasChoices
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application Info
    APP_NAME: str = "KisanO API"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # MongoDB Setup
    MONGODB_URI: str
    DATABASE_NAME: str = "kisano_db"

    # Redis Setup
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT Setup
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    # Razorpay
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None
    RAZORPAY_WEBHOOK_SECRET: Optional[str] = None

    # Google Maps
    GOOGLE_MAPS_API_KEY: Optional[str] = None

    # Firebase
    FIREBASE_CREDENTIALS_JSON_PATH: Optional[str] = None

    # MSG91 (OTP Provider)
    MSG91_AUTH_KEY: Optional[str] = None
    MSG91_SENDER_ID: Optional[str] = None
    MSG91_OTP_TEMPLATE_ID: Optional[str] = None

    # AI (Gemini)
    GEMINI_API_KEY: Optional[str] = None
    DEFAULT_AI_PROVIDER: str = "GEMINI"  # GEMINI, OPENAI, or MOCK

    # Background Workers
    BACKGROUND_WORKERS_COUNT: int = 3
    WORKER_MODE: str = "embedded"  # "embedded" or "standalone"

    # Retry Policy
    MAX_JOB_RETRIES: int = 3
    RETRY_DELAY_SECONDS: int = 5
    BACKOFF_MULTIPLIER: float = 2.0

    # Provider Timeouts (seconds)
    EMAIL_TIMEOUT: int = 30
    SMS_TIMEOUT: int = 15
    FCM_TIMEOUT: int = 10

    # Concurrency Limits
    MAX_CONCURRENT_EMAILS: int = 5
    MAX_CONCURRENT_SMS: int = 10
    MAX_CONCURRENT_PUSH: int = 20

    # SMTP
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: str = "noreply@kisano.in"
    SMTP_USE_TLS: bool = True

    # Scheduler
    CLEANUP_INTERVAL_HOURS: int = 24
    ANALYTICS_REFRESH_HOURS: int = 6
    SESSION_EXPIRY_DAYS: int = 30
    WEBHOOK_LOG_RETENTION_DAYS: int = 90

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


# Global settings instance
settings = Settings()

def validate_production_environment():
    if settings.ENVIRONMENT == "production":
        import sys
        missing_required = []
        required = ["SECRET_KEY", "MONGODB_URI"]
        
        missing_optional = []
        optional = [
            "REDIS_URL", "CLOUDINARY_API_KEY", "RAZORPAY_KEY_ID", 
            "MSG91_AUTH_KEY", "GEMINI_API_KEY", "FIREBASE_CREDENTIALS_JSON_PATH"
        ]
        
        for key in required:
            if not getattr(settings, key, None):
                missing_required.append(key)
                
        for key in optional:
            if not getattr(settings, key, None):
                missing_optional.append(key)
                
        if missing_optional:
            print("⚠️ WARNING: The following optional providers are not configured:")
            for m in missing_optional:
                print(f"  - {m}")
            print("⚠️ Features relying on these providers will be disabled or fall back to mock implementations.")
                
        if missing_required:
            print("=====================================================")
            print("🔥 CRITICAL: FAILED FAST DURING STARTUP 🔥")
            print("The following REQUIRED environment variables are missing in production:")
            for m in missing_required:
                print(f"  - {m}")
            print("=====================================================")
            sys.exit(1)

validate_production_environment()
