import os
import re

DECOMPILED_DIR = r"D:\source\nightmare-b4-xmas\scratch\decompiled_renamed"

# Find all single-letter field declarations across all classes
single_letter_fields = {}

for f in sorted(os.listdir(DECOMPILED_DIR)):
    if not f.endswith(".java"): continue
    c = f[:-5]
    path = os.path.join(DECOMPILED_DIR, f)
    with open(path, "r", encoding="utf-8") as fp:
        code = fp.read()
    
    # Class field pattern: (int|short|byte|...) [a-z] (=...)?;
    field_pat = re.compile(r'^\s*(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?(?:[\w<>\[\]]+)\s+([a-z])\s*(?:=[^;]+)?\s*;', re.M)
    flds = set(field_pat.findall(code))
    if flds:
        single_letter_fields[c] = flds
        print(f"Class {c} has single letter fields: {sorted(flds)}")
