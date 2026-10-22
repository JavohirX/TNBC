import os
import re

DECOMPILED_DIR = r"D:\source\nightmare-b4-xmas\scratch\decompiled_renamed"

for f in sorted(os.listdir(DECOMPILED_DIR)):
    if not f.endswith(".java"): continue
    c = f[:-5]
    path = os.path.join(DECOMPILED_DIR, f)
    with open(path, "r", encoding="utf-8") as fp:
        code = fp.read()

    field_pat = re.compile(r'^\s*(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?(?:[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*(?:=[^;]+)?\s*;', re.M)
    fields = set(field_pat.findall(code))

    method_pat = re.compile(r'^\s*(public|private|protected)?\s*(static\s+)?(final\s+|abstract\s+)?([\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*\(', re.M)
    methods = method_pat.findall(code)

    for vis, is_static, is_fin, ret, name in methods:
        if name in fields:
            print(f"Class {c}: method '{name}' (vis={vis}, static={bool(is_static)}) clashes with field '{name}'")

