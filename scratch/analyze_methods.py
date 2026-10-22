import os
import re

DECOMPILED_DIR = r"D:\source\nightmare-b4-xmas\scratch\decompiled_renamed"

def analyze_class_methods(class_name):
    path = os.path.join(DECOMPILED_DIR, f"{class_name}.java")
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # Match methods
    pat = re.compile(r'^\s*(public|private|protected)?\s*(static\s+)?(final\s+|abstract\s+)?([\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{', re.MULTILINE)
    methods = pat.findall(code)
    by_name = {}
    for vis, is_static, is_fin, ret, name, params in methods:
        if name in ['if', 'while', 'for', 'switch']: continue
        by_name.setdefault(name, []).append({
            'static': bool(is_static),
            'ret': ret,
            'params': [p.strip() for p in params.split(',') if p.strip()]
        })
    
    print(f"=== {class_name} ===")
    for name, variants in by_name.items():
        if len(variants) > 1:
            print(f"  Overload '{name}':")
            for idx, v in enumerate(variants):
                print(f"    [{idx}] static={v['static']} ret={v['ret']} params={v['params']}")

for c in ["GMIDlet", "j", "d", "p", "c", "o", "h", "g", "b", "f", "m", "q", "r", "n", "t", "i", "a", "e"]:
    analyze_class_methods(c)

