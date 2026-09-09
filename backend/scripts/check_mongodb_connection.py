#!/usr/bin/env python3
"""
KisanO — MongoDB Atlas Connection Diagnostic Script

Usage:
    python scripts/check_mongodb_connection.py

This script loads environment variables using the same Settings class as the app,
prints redacted connection details, and tests the MongoDB ping command.
It NEVER prints the password or full URI.
"""
import asyncio
import sys
import os

# Ensure the backend directory is on the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def redact_uri(uri: str) -> str:
    """Redact password from a MongoDB URI for safe printing."""
    from urllib.parse import urlparse, urlunparse
    parsed = urlparse(uri)
    if parsed.password:
        redacted = parsed._replace(
            netloc=f"{parsed.username}:****@{parsed.hostname}"
            + (f":{parsed.port}" if parsed.port else "")
        )
        return urlunparse(redacted)
    return uri

async def check():
    print("=" * 60)
    print("KisanO — MongoDB Atlas Connection Diagnostic")
    print("=" * 60)
    
    # 1. Load settings using the same class as the app
    try:
        from core.config import settings
        print("\n[OK] Settings loaded successfully")
    except Exception as e:
        print(f"\n[FAIL] Could not load settings: {e}")
        sys.exit(1)
    
    # 2. Print redacted connection details
    uri = settings.MONGODB_URI
    from urllib.parse import urlparse
    parsed = urlparse(uri)
    
    print(f"\n--- Connection Details (redacted) ---")
    print(f"  MONGODB_URI present:  True")
    print(f"  Scheme:               {parsed.scheme}")
    print(f"  Hostname:             {parsed.hostname}")
    print(f"  Username:             {parsed.username}")
    print(f"  Password present:     {bool(parsed.password)}")
    print(f"  DB from URI path:     {parsed.path}")
    print(f"  Query params:         {parsed.query}")
    print(f"  authSource in params: {'authSource' in (parsed.query or '')}")
    print(f"  DATABASE_NAME:        {settings.DATABASE_NAME}")
    print(f"  Redacted URI:         {redact_uri(uri)}")
    
    # 3. Test connection
    print(f"\n--- Connection Test ---")
    try:
        import certifi
        from motor.motor_asyncio import AsyncIOMotorClient
        
        client = AsyncIOMotorClient(
            uri,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=10000
        )
        result = await client.admin.command("ping")
        print(f"  [OK] Ping result: {result}")
        
        # Test database access
        db = client[settings.DATABASE_NAME]
        collections = await db.list_collection_names()
        print(f"  [OK] Database '{settings.DATABASE_NAME}' accessible")
        print(f"  [OK] Collections found: {len(collections)}")
        if collections:
            print(f"  [OK] Collection names: {collections[:10]}")
        
        client.close()
        print(f"\n{'=' * 60}")
        print("RESULT: MongoDB Atlas connection SUCCESSFUL")
        print(f"{'=' * 60}")
        
    except Exception as e:
        print(f"  [FAIL] Connection error: {e}")
        print(f"\n{'=' * 60}")
        print("RESULT: MongoDB Atlas connection FAILED")
        print(f"{'=' * 60}")
        print("\nPossible causes:")
        print("  1. Wrong password in MONGODB_URI")
        print("  2. Wrong username in MONGODB_URI")
        print("  3. IP not whitelisted in Atlas Network Access")
        print("  4. Cluster is paused or not deployed")
        print("  5. authSource mismatch (should be 'admin' for Atlas)")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(check())
