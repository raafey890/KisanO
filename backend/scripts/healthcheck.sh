#!/bin/sh
set -e

# Checks the backend health endpoint
# Requires curl to be installed in the container
curl -f http://localhost:8000/health || exit 1
