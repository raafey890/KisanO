from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.database import engine, Base
from app.routers import auth, equipment, bookings, marketplace, dashboards, sprayers, reviews, notifications
from app.core.responses import standard_response
from app.core.exceptions import KisanOException

# Dynamically construct database tables on application initialization
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KisanO Smart Agriculture Backend API",
    description="Production-ready farm resource sharing and service booking REST API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints routers
app.include_router(auth.router)
app.include_router(equipment.router)
app.include_router(bookings.router)
app.include_router(marketplace.router)
app.include_router(dashboards.router)
app.include_router(sprayers.router)
app.include_router(reviews.router)
app.include_router(notifications.router)

# -------------------------------------------------------------
# Central Exception Handlers (Global Error Handling)
# -------------------------------------------------------------

@app.exception_handler(KisanOException)
async def kisano_exception_handler(request: Request, exc: KisanOException):
    return standard_response(
        success=False,
        message=exc.message,
        errors=exc.errors,
        status_code=exc.status_code
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = {}
    for error in exc.errors():
        # Get parameter name
        loc = error.get("loc", [])
        field_name = loc[-1] if loc else "body"
        errors[str(field_name)] = error.get("msg", "Validation error")
        
    return standard_response(
        success=False,
        message="Request validation failed",
        errors=errors,
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    # Log internal error here
    return standard_response(
        success=False,
        message="An unexpected server error occurred",
        errors=str(exc),
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
    )

@app.get("/")
def read_root():
    return standard_response(
        success=True,
        message="Welcome to KisanO Smart Agriculture API Dashboard. Visit /docs for interactive Swagger UI."
    )
