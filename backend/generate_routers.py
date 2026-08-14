import os
import ast

def generate_router(module_path, module_name):
    service_path = os.path.join(module_path, "service.py")
    router_path = os.path.join(module_path, "router.py")
    
    if not os.path.exists(service_path):
        return
        
    with open(service_path, "r", encoding="utf-8") as f:
        tree = ast.parse(f.read())
        
    methods = []
    service_class_name = None
    
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef) and node.name.endswith("Service"):
            service_class_name = node.name
            for item in node.body:
                if isinstance(item, ast.AsyncFunctionDef) and not item.name.startswith("_"):
                    methods.append(item.name)
                    
    if not methods or not service_class_name:
        return
        
    # Generate router content
    lines = [
        "from fastapi import APIRouter, Depends",
        "from typing import Dict, Any, List",
        "from shared.responses import success_response, SuccessResponse",
        f"from modules.{module_name}.service import {service_class_name}",
        "",
        f"router = APIRouter(prefix=\"/api/v1/{module_name.replace('_', '-')}\", tags=[\"{module_name.title()}\"])",
        ""
    ]
    
    for method in methods:
        method_dash = method.replace('_', '-')
        http_method = "get" if method.startswith("get") or method.startswith("search") else "post"
        
        lines.append(f"@{http_method}(\"/{method_dash}\")")
        lines.append(f"async def {method}_route():")
        lines.append(f"    # Auto-generated placeholder for {method}")
        lines.append(f"    return success_response(message=\"Success\", data={{}})")
        lines.append("")
        
    with open(router_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Generated {router_path}")

modules_dir = r"C:\Users\DELL\OneDrive\Desktop\KisanO\backend\modules"
for item in os.listdir(modules_dir):
    path = os.path.join(modules_dir, item)
    if os.path.isdir(path) and item not in ["admin", "users", "auth"]:
        # Don't touch admin or users, we fixed them. auth also needs careful handling.
        generate_router(path, item)
