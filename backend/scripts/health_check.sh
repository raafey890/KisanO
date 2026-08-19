#!/bin/bash
# =============================================================================
# KisanO — Post-Deployment Health Validation Suite
# Validates ALL critical services after deployment.
# Deployment fails automatically if ANY critical check fails.
# Usage: bash scripts/health_check.sh [BASE_URL]
# =============================================================================
set -euo pipefail

BASE_URL="${1:-https://api.kisano.in}"
LOG_FILE="${LOG_FILE:-/tmp/kisano_health_check.log}"
TIMEOUT=15
PASS=0
FAIL=0
WARN=0

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'

log()     { echo -e "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG_FILE"; }
pass()    { PASS=$((PASS+1)); log "${GREEN}[PASS]${NC} $*"; }
fail()    { FAIL=$((FAIL+1)); log "${RED}[FAIL]${NC} $*"; }
warn()    { WARN=$((WARN+1)); log "${YELLOW}[WARN]${NC} $*"; }
section() { log "${BLUE}${BOLD}--- $* ---${NC}"; }

echo "" | tee "$LOG_FILE"
log "${BOLD}================================================${NC}"
log "${BOLD} KisanO Post-Deployment Health Validation${NC}"
log "${BOLD} Base URL  : $BASE_URL${NC}"
log "${BOLD} Timestamp : $(date -u '+%Y-%m-%dT%H:%M:%SZ')${NC}"
log "${BOLD}================================================${NC}"
echo ""

# ---------------------------------------------------------------------------
# Helper: HTTP check
# ---------------------------------------------------------------------------
check_http() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    local critical="${4:-true}"

    local status
    status=$(curl -s -o /dev/null -w "%{http_code}" \
        --max-time "$TIMEOUT" --connect-timeout 5 "$url" 2>/dev/null || echo "000")

    if [ "$status" = "$expected_status" ]; then
        pass "$name → HTTP $status [$url]"
    else
        if [ "$critical" = "true" ]; then
            fail "$name → Expected HTTP $expected_status, got $status [$url]"
        else
            warn "$name → Expected HTTP $expected_status, got $status [$url]"
        fi
    fi
}

# ---------------------------------------------------------------------------
# Helper: JSON field check
# ---------------------------------------------------------------------------
check_json_field() {
    local name="$1"
    local url="$2"
    local field="$3"
    local expected="$4"

    local value
    value=$(curl -s --max-time "$TIMEOUT" "$url" 2>/dev/null | \
        python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('$field','MISSING'))" 2>/dev/null || echo "MISSING")

    if [ "$value" = "$expected" ]; then
        pass "$name → $.${field} = '$value'"
    else
        fail "$name → $.${field} expected '$expected', got '$value'"
    fi
}

# ===========================================================================
# CHECK 1: Backend API Health Endpoint
# ===========================================================================
section "1. Backend API"
check_http "Backend /health" "${BASE_URL}/health" "200"
check_json_field "Health status field" "${BASE_URL}/health" "status" "healthy"

# ===========================================================================
# CHECK 2: OpenAPI / Swagger Documentation
# ===========================================================================
section "2. OpenAPI Documentation"
check_http "Swagger UI" "${BASE_URL}/docs" "200"
check_http "OpenAPI JSON Schema" "${BASE_URL}/openapi.json" "200"

# ===========================================================================
# CHECK 3: HTTPS & SSL (production only)
# ===========================================================================
section "3. HTTPS & SSL/TLS"
if [[ "$BASE_URL" == https://* ]]; then
    # Check SSL cert validity using curl's built-in verification
    if curl -s --max-time "$TIMEOUT" --cert-status "${BASE_URL}/health" -o /dev/null 2>/dev/null; then
        pass "SSL Certificate is valid and trusted"
    else
        # Fallback: just check if HTTPS responds without --insecure
        if curl -s --max-time "$TIMEOUT" "${BASE_URL}/health" -o /dev/null 2>/dev/null; then
            pass "SSL Certificate is valid (HTTPS responds)"
        else
            fail "SSL Certificate verification failed for $BASE_URL"
        fi
    fi

    # Check HSTS header
    HSTS=$(curl -sI --max-time "$TIMEOUT" "${BASE_URL}/health" 2>/dev/null | \
        grep -i "strict-transport-security" | head -1 || echo "")
    if [ -n "$HSTS" ]; then
        pass "HSTS header present: $HSTS"
    else
        warn "HSTS header missing"
    fi
else
    warn "Skipping SSL checks — non-HTTPS URL: $BASE_URL"
fi

# ===========================================================================
# CHECK 4: NGINX / Reverse Proxy
# ===========================================================================
section "4. NGINX Reverse Proxy"
check_http "NGINX proxy routing" "${BASE_URL}/health" "200"
# Check security headers are present
HEADERS=$(curl -sI --max-time "$TIMEOUT" "${BASE_URL}/health" 2>/dev/null)
for header in "X-Content-Type-Options" "X-Frame-Options" "Referrer-Policy"; do
    if echo "$HEADERS" | grep -qi "$header"; then
        pass "Security header present: $header"
    else
        warn "Security header missing: $header"
    fi
done

# ===========================================================================
# CHECK 5: API Core Endpoints (spot-check)
# ===========================================================================
section "5. API Endpoint Availability"
check_http "API v1 auth login"    "${BASE_URL}/api/v1/auth/login"   "405" "false"
check_http "API v1 equipment"     "${BASE_URL}/api/v1/equipment"    "401" "false"
check_http "API v1 marketplace"   "${BASE_URL}/api/v1/marketplace"  "401" "false"
check_http "404 returns JSON"     "${BASE_URL}/api/v1/nonexistent"  "404" "false"

# ===========================================================================
# CHECK 6: Docker Container Health (local checks only)
# ===========================================================================
section "6. Docker Container Status"
if command -v docker &>/dev/null; then
    for service in backend worker scheduler; do
        CONTAINER=$(docker ps --filter "name=kisano-${service}" --format "{{.Names}}" 2>/dev/null | head -1 || echo "")
        if [ -n "$CONTAINER" ]; then
            STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null || echo "no-healthcheck")
            if [ "$STATUS" = "healthy" ]; then
                pass "Container $CONTAINER → $STATUS"
            elif [ "$STATUS" = "no-healthcheck" ]; then
                warn "Container $CONTAINER → running (no healthcheck configured)"
            else
                fail "Container $CONTAINER → $STATUS"
            fi
        else
            warn "Container 'kisano-${service}' not found (may be on remote server)"
        fi
    done
else
    warn "docker not found locally — skipping container checks"
fi

# ===========================================================================
# RESULTS SUMMARY
# ===========================================================================
echo ""
log "${BOLD}================================================${NC}"
log "${BOLD} VALIDATION RESULTS${NC}"
log "${GREEN}[PASS]${NC} ${PASS} checks passed"
log "${YELLOW}[WARN]${NC} ${WARN} warnings"
log "${RED}[FAIL]${NC} ${FAIL} checks FAILED"
log "${BOLD}================================================${NC}"

if [ "$FAIL" -gt 0 ]; then
    log "${RED}${BOLD}VALIDATION FAILED — $FAIL critical check(s) did not pass.${NC}"
    log "${RED}Deployment should be rolled back.${NC}"
    exit 1
else
    log "${GREEN}${BOLD}ALL CRITICAL CHECKS PASSED ✓${NC}"
    exit 0
fi
