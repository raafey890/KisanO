#!/bin/sh
set -e

echo "[+] Running Unit & Integration Tests (Pytest)"
pytest --cov=modules --cov-report=xml --cov-report=term-missing
