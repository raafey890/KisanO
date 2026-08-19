#!/bin/bash
# =============================================================================
# KisanO - Automated Deployment Verification
# =============================================================================

API_URL="https://api.kisano.in"
FRONTEND_URL="https://kisano.in"
GRAFANA_URL="https://monitoring.kisano.in"

echo "========================================"
echo " Starting Post-Deployment Verification"
echo "========================================"

missing=0

check_endpoint() {
  local name=$1
  local url=$2
  local expected=$3
  
  echo -n "Checking $name... "
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$status" -eq "$expected" ]; then
    echo "✅ SUCCESS ($status)"
  else
    echo "❌ FAILED (Expected $expected, got $status)"
    missing=1
  fi
}

check_endpoint "Frontend Application" "$FRONTEND_URL" 200
check_endpoint "Backend API Health" "$API_URL/health" 200
check_endpoint "Swagger Docs" "$API_URL/docs" 200

echo -n "Checking MongoDB Connection... "
if docker exec kisano-backend-1 python -c "from db.mongodb import db_manager; import asyncio; asyncio.run(db_manager.connect())" 2>/dev/null; then
  echo "✅ SUCCESS"
else
  echo "❌ FAILED"
  missing=1
fi

echo -n "Checking Redis Connection... "
if docker exec kisano-backend-1 python -c "from core.redis_client import redis_manager; import asyncio; asyncio.run(redis_manager.connect())" 2>/dev/null; then
  echo "✅ SUCCESS"
else
  echo "❌ FAILED"
  missing=1
fi

echo -n "Checking Worker Process... "
if docker ps | grep -q 'kisano-worker'; then
  echo "✅ RUNNING"
else
  echo "❌ FAILED (Not found)"
  missing=1
fi

echo -n "Checking Scheduler Process... "
if docker ps | grep -q 'kisano-scheduler'; then
  echo "✅ RUNNING"
else
  echo "❌ FAILED (Not found)"
  missing=1
fi

echo -n "Checking NGINX... "
if docker ps | grep -q 'kisano-nginx'; then
  echo "✅ RUNNING"
else
  echo "❌ FAILED (Not found)"
  missing=1
fi

echo "========================================"
if [ $missing -eq 0 ]; then
  echo "🎉 ALL SYSTEMS GO! Deployment is verified and healthy."
  exit 0
else
  echo "⚠️ DEPLOYMENT ISSUES DETECTED. See logs above."
  exit 1
fi
