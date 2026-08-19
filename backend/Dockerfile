# syntax=docker/dockerfile:1.6
# =============================================================================
# KisanO Backend — Enterprise Multi-Stage Dockerfile
# Stages: deps → builder → production
# Security: non-root user, minimal attack surface, no secrets baked in
# =============================================================================

# ---------------------------------------------------------------------------
# STAGE 1: deps — Install Python dependencies as wheels
# Purpose: Isolate build tools from the final image
# ---------------------------------------------------------------------------
FROM python:3.11-slim AS deps

# Build-time environment
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=100

WORKDIR /build

# Install only build dependencies — they will NOT be in the final image
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        libssl-dev \
        libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for maximum layer cache reuse
COPY requirements.txt .

# Build wheels (binary packages) — fast installs with no compiler in prod
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt


# ---------------------------------------------------------------------------
# STAGE 2: production — Lean, secure final image
# No build tools, no compiler, non-root user, minimal OS footprint
# ---------------------------------------------------------------------------
FROM python:3.11-slim AS production

# Runtime labels (OCI standard)
LABEL org.opencontainers.image.title="KisanO Backend" \
      org.opencontainers.image.description="KisanO Modular Monolith API" \
      org.opencontainers.image.vendor="KisanO" \
      org.opencontainers.image.licenses="Proprietary"

# Runtime environment — deterministic Python behaviour
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    # Ensure user scripts are on PATH
    PATH="/home/kisano/.local/bin:$PATH"

# Install only the minimal runtime OS deps (no build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
        # curl: used by healthcheck script
        curl \
        # ca-certificates: needed for HTTPS calls to external APIs
        ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    # Clean up apt cache
    && apt-get clean

# Create a dedicated non-root system user + group
RUN groupadd --system --gid 1001 kisano \
    && useradd --system --uid 1001 --gid kisano \
               --no-create-home --shell /sbin/nologin kisano

# Create app directory — owned by root, readable by app user
WORKDIR /app

# Copy pre-built wheels from the deps stage (no compiler needed)
COPY --from=deps /build/wheels /wheels
COPY --from=deps /build/requirements.txt .

# Install from pre-built wheels only — fast and reproducible
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt \
    # Remove wheels after install
    && rm -rf /wheels

# Copy application source code
# The .dockerignore ensures no .env, __pycache__, venv, tests, etc.
COPY --chown=kisano:kisano . /app

# Make scripts executable
RUN chmod +x /app/scripts/*.sh

# Create writable directories that the app needs at runtime
# (everything else stays read-only when --read-only is set in compose)
RUN mkdir -p /app/logs /app/tmp /app/static \
    && chown -R kisano:kisano /app/logs /app/tmp /app/static

# Switch to non-root user — MUST be before EXPOSE/CMD
USER kisano

# Expose the API port
EXPOSE 8000

# Health check for Docker daemon (also used by compose)
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=20s \
    CMD curl -f http://localhost:8000/health || exit 1

# Entrypoint: runs migrations / startup checks before uvicorn
ENTRYPOINT ["/app/scripts/entrypoint.sh"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", \
     "--workers", "1", "--loop", "uvloop", "--no-access-log"]
