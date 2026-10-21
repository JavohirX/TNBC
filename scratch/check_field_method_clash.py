import os
import re

DECOMPILED_DIR = r"D:\source\nightmare-b4-xmas\scratch\decompiled_renamed"

for f in sorted(os.listdir(DECOMPILED_DIR)):
    if not f.endswith(".java"): continue
    c = f[:-5]
    path = os.path.join(DECOMPILED_DIR, f)
    with open(path, "r", encoding="utf-8") as fp:
        code = fp.read()

    # Find fields
    field_pat = re.compile(r'^\s*(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?(?:[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*(?:=[^;]+)?\s*;', re.M)
    fields = set(field_pat.findall(code))

    # Find methods
    method_pat = re.compile(r'^\s*(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+|abstract\s+)?(?:[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*\(', re.M)
    methods = set(method_pat.findall(code))

    clashes = fields.intersection(methods)
    if clashes:
        print(f"Class {c}: {len(clashes)} field-method clashes -> {sorted(clashes)}")
