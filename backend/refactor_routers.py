import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Add imports if missing
    if 'from shared.responses import success_response, SuccessResponse' not in content:
        # Find the last import
        imports_end = 0
        for match in re.finditer(r'^from .* import .*$|^import .*$', content, re.MULTILINE):
            imports_end = match.end()
        
        insert_text = "\nfrom shared.responses import success_response, SuccessResponse\n"
        content = content[:imports_end] + insert_text + content[imports_end:]

    # 2. Replace response_models
    content = re.sub(
        r'response_model=(Dict\[.*?\]|List\[.*?\]|Any)',
        r'response_model=SuccessResponse[\1]',
        content
    )
    
    # 3. Replace direct dictionary returns with message
    content = re.sub(
        r'return\s*{\s*"message"\s*:\s*("[^"]+")\s*}',
        r'return success_response(message=\1)',
        content
    )

    # 4. Replace other dictionary returns
    # e.g. return {"items": items, "total": total, "skip": skip, "limit": limit}
    # We will use a regex callback to safely replace these
    def dict_return_replacer(match):
        inner = match.group(1)
        if '"message"' in inner:
            return match.group(0) # Already handled or complex
        return f'return success_response(message="Success", data={{{inner}}})'
    
    content = re.sub(
        r'return\s*({(.*?)})',
        dict_return_replacer,
        content,
        flags=re.DOTALL
    )

    # 5. Replace `return await AdminService.get_dashboard(role)`
    # with `data = await AdminService.get_dashboard(role)\n    return success_response(message="Success", data=data)`
    def await_return_replacer(match):
        indent = match.group(1)
        expr = match.group(2)
        return f'{indent}data = {expr}\n{indent}return success_response(message="Success", data=data)'
    
    content = re.sub(
        r'^(\s+)return\s+(await\s+[a-zA-Z0-9_.]+\(.*?\))$',
        await_return_replacer,
        content,
        flags=re.MULTILINE
    )
    
    # 6. Replace `return AdminService.get_settings()` (sync)
    def sync_return_replacer(match):
        indent = match.group(1)
        expr = match.group(2)
        if expr.startswith('success_response'):
            return match.group(0)
        return f'{indent}data = {expr}\n{indent}return success_response(message="Success", data=data)'
        
    content = re.sub(
        r'^(\s+)return\s+([a-zA-Z0-9_.]+\(.*?\))$',
        sync_return_replacer,
        content,
        flags=re.MULTILINE
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Refactored {filepath}")

def main():
    base_dir = r"C:\Users\DELL\OneDrive\Desktop\KisanO\backend\modules"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file == 'router.py':
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
