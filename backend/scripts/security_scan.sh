#!/bin/sh
set -e

echo "[+] Running AST Security Scan (Bandit)"
bandit -r modules/ core/

echo "[+] Running Dependency Vulnerability Scan (Safety)"
safety check -r requirements.txt
