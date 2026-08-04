# syntax=docker/dockerfile:1.4
# ==========================================
# Base Stage
# ==========================================
FROM python:3.11-slim AS base
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

WORKDIR /app

# ==========================================
# Builder Stage
# ==========================================
FROM base AS builder
# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies as wheels
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# ==========================================
# Production Stage
# ==========================================
FROM base AS production

# Create non-root user
RUN addgroup --system kisano && adduser --system --ingroup kisano kisano

# Copy compiled wheels from builder
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .

# Install dependencies from wheels
RUN pip install --no-cache /wheels/*

# Copy application code
COPY . /app

# Make scripts executable
RUN chmod +x /app/scripts/*.sh

# Change ownership to non-root user
RUN chown -R kisano:kisano /app

# Drop to non-root user
USER kisano

# Expose API port
EXPOSE 8000

# Metadata Labels (OCI Standard)
LABEL org.opencontainers.image.title="KisanO Backend" \
      org.opencontainers.image.description="Modular Monolith API for KisanO" \
      org.opencontainers.image.vendor="KisanO"

# Entrypoint script
ENTRYPOINT ["/app/scripts/entrypoint.sh"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
