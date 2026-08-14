import os

modules_dir = r"C:\Users\DELL\OneDrive\Desktop\KisanO\backend\modules"
for root, _, files in os.walk(modules_dir):
    for file in files:
        if file == 'router.py':
            filepath = os.path.join(root, file)
            if os.path.getsize(filepath) == 0:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write("from fastapi import APIRouter\nfrom shared.responses import success_response, SuccessResponse\n\nrouter = APIRouter()\n")
                print(f"Fixed {filepath}")
