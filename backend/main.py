import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError

from core.config import settings
from core.exceptions import (
    AppException,
    app_exception_handler,
    validation_exception_handler,
    global_exception_handler
)
from db.mongodb import db_manager
from core.redis_client import redis_manager
from middleware.cors import setup_cors
from middleware.request_id import RequestIDMiddleware
from middleware.logging_middleware import LoggingMiddleware
from modules.monitoring.middleware import ObservabilityMiddleware
from modules.security.middleware import SecurityHeadersMiddleware
from modules.gateway.middleware import GatewayMiddleware
from core.logging import setup_logging

# Configure logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application Startup and Shutdown Events"""
    # Startup
    logger.info("Starting up KisanO Backend Application...")
    await db_manager.connect()
    await redis_manager.connect()
    yield
    # Shutdown
    logger.info("Shutting down KisanO Backend Application...")
    await redis_manager.disconnect()
    await db_manager.disconnect()

def create_app() -> FastAPI:
    """FastAPI Application Factory"""
    app = FastAPI(
        title=settings.APP_NAME,
        version="1.0.0",
        description="Modular Monolith API for KisanO",
        lifespan=lifespan,
    )

    # 1. Setup Middleware
    setup_cors(app)
    # GatewayMiddleware sits just inside SecurityHeaders to handle routing/transformation
    app.add_middleware(SecurityHeadersMiddleware) # Runs first/outermost for all responses
    app.add_middleware(GatewayMiddleware)
    app.add_middleware(ObservabilityMiddleware)
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(RequestIDMiddleware)

    # 2. Register Global Exception Handlers
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)

    # 3. Register Modular Routers
    from modules.auth.router import router as auth_router
    from modules.users.router import router as users_router
    from modules.equipment.router import router as equipment_router
    from modules.equipment_bookings.router import router as equipment_booking_router
    from modules.marketplace.router import router as marketplace_router
    from modules.orders.router import router as orders_router
    from modules.sprayer_services.router import router as sprayer_services_router
    from modules.sprayer_bookings.router import router as sprayer_bookings_router
    from modules.payments.router import router as payments_router
    from modules.ai.router import router as ai_router
    from modules.reviews.router import router as reviews_router
    from modules.notifications.router import router as notifications_router
    from modules.support.router import router as support_router
    from modules.admin.router import router as admin_router
    from modules.analytics.router import router as analytics_router
    from modules.monitoring.router import router as monitoring_router
    from modules.cache.router import router as cache_router
    from modules.jobs.router import router as jobs_router
    from modules.security.router import router as security_router
    from modules.gateway.router import router as gateway_router
    
    app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
    app.include_router(users_router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
    app.include_router(equipment_router, prefix=f"{settings.API_V1_STR}/equipment", tags=["Equipment"])
    app.include_router(equipment_booking_router, prefix=f"{settings.API_V1_STR}/equipment-bookings", tags=["Equipment Bookings"])
    app.include_router(marketplace_router, prefix=f"{settings.API_V1_STR}/marketplace", tags=["Marketplace"])
    app.include_router(orders_router, prefix=f"{settings.API_V1_STR}/orders", tags=["Orders"])
    app.include_router(sprayer_services_router, prefix=f"{settings.API_V1_STR}/sprayer-services", tags=["Sprayer Services"])
    app.include_router(sprayer_bookings_router, prefix=f"{settings.API_V1_STR}/sprayer-bookings", tags=["Sprayer Bookings"])
    app.include_router(payments_router, prefix=f"{settings.API_V1_STR}/payments", tags=["Payments"])
    app.include_router(ai_router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Plant Doctor"])
    app.include_router(reviews_router, prefix=f"{settings.API_V1_STR}/reviews", tags=["Reviews & Ratings"])
    app.include_router(notifications_router, prefix=f"{settings.API_V1_STR}/notifications", tags=["Notifications"])
    app.include_router(support_router, prefix=f"{settings.API_V1_STR}/support", tags=["Support & Help Center"])
    app.include_router(admin_router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin Operations"])
    app.include_router(analytics_router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Analytics & Reports"])
    app.include_router(monitoring_router, prefix=f"{settings.API_V1_STR}/monitoring", tags=["Observability & Monitoring"])
    app.include_router(cache_router, prefix=f"{settings.API_V1_STR}/cache", tags=["Distributed Cache"])
    app.include_router(jobs_router, prefix=f"{settings.API_V1_STR}/jobs", tags=["Background Jobs & Scheduler"])
    app.include_router(security_router, prefix=f"{settings.API_V1_STR}/security", tags=["Security & Hardening"])
    app.include_router(gateway_router, prefix=f"{settings.API_V1_STR}/gateway", tags=["API Gateway & Traffic Management"])

    @app.get("/health", tags=["System"])
    async def health_check():
        return {"status": "ok", "app": settings.APP_NAME, "environment": settings.ENVIRONMENT}

    @app.get("/ready", tags=["System"])
    async def readiness_check():
        # In a real app, this might ping the database to ensure it's fully connected
        from db.mongodb import db_manager
        if db_manager.db is None:
            from fastapi import HTTPException
            raise HTTPException(status_code=503, detail="Database not ready")
        return {"status": "ready"}

    @app.get("/live", tags=["System"])
    async def liveness_check():
        return {"status": "alive"}

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
