#!/bin/sh
set -e

echo "[+] Running Code Formatting (Black)"
black --check .

echo "[+] Running Import Sorting (isort)"
isort --check-only .

echo "[+] Running Static Linting (Ruff)"
ruff check .
