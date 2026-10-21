import os
import re

DECOMPILED_DIR = r"D:\source\nightmare-b4-xmas\scratch\decompiled_renamed"

method_sig_pattern = re.compile(r'^\s*(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?(?:[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{', re.MULTILINE)

for f in sorted(os.listdir(DECOMPILED_DIR)):
    if not f.endswith(".java"): continue
    path = os.path.join(DECOMPILED_DIR, f)
    with open(path, "r", encoding="utf-8") as fp:
        code = fp.read()
    
    matches = method_sig_pattern.findall(code)
    counts = {}
    for name, params in matches:
        counts[name] = counts.get(name, []) + [params.strip()]
    
    overloads = {k: v for k, v in counts.items() if len(v) > 1}
    if overloads:
        print(f"=== {f} ===")
        for k, v in overloads.items():
            print(f"  Method '{k}': {len(v)} overloads -> {v}")
