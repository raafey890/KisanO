import json
import os
import re

log_path = r"C:\Users\DELL\.gemini\antigravity\brain\f60d2b6e-2f38-4ed4-8907-ce984497d09c\.system_generated\logs\transcript_full.jsonl"

routers = {}

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
        except:
            continue
            
        if data.get('type') == 'PLANNER_RESPONSE':
            tool_calls = data.get('tool_calls', [])
            for call in tool_calls:
                if call.get('tool_name') in ('write_to_file', 'replace_file_content', 'multi_replace_file_content'):
                    args = call.get('tool_args', {})
                    target_file = args.get('TargetFile', '')
                    if 'router.py' in target_file:
                        if call.get('tool_name') == 'write_to_file':
                            routers[target_file] = args.get('CodeContent', '')
                        elif call.get('tool_name') == 'replace_file_content':
                            # Basic string replace on the tracked state
                            if target_file in routers:
                                routers[target_file] = routers[target_file].replace(args.get('TargetContent', ''), args.get('ReplacementContent', ''))
                        elif call.get('tool_name') == 'multi_replace_file_content':
                            if target_file in routers:
                                content = routers[target_file]
                                for chunk in args.get('ReplacementChunks', []):
                                    content = content.replace(chunk.get('TargetContent', ''), chunk.get('ReplacementContent', ''))
                                routers[target_file] = content

# Write them back
for path, content in routers.items():
    if os.path.exists(path) and os.path.getsize(path) > 0:
        continue # don't overwrite if it has data
    if "modules" in path and "router.py" in path:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Restored {path}")
