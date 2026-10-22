import os
import re

DECOMPILED_DIR = r"D:\source\nightmare-b4-xmas\scratch\decompiled_renamed"

def clean_code(code, class_name):
    # Normalize class header split across lines:
    # class Foo\nextends Bar { -> class Foo extends Bar {
    code = re.sub(r'(class\s+\w+)\s*\n\s*(extends\s+\w+)', r'\1 \2', code)
    code = re.sub(r'(class\s+\w+(?:\s+extends\s+\w+)?)\s*\n\s*(implements\s+[\w,\s]+)', r'\1 \2', code)
    return code

with open(os.path.join(DECOMPILED_DIR, "h.java"), "r", encoding="utf-8") as f:
    raw = f.read()

res = clean_code(raw, "h")
for line in res.splitlines()[:20]:
    print(line)

