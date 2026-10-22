import os
import re

DECOMPILED_DIR = r"D:\source\nightmare-b4-xmas\scratch\decompiled_renamed"
OUTPUT_DIR = r"D:\source\nightmare-b4-xmas\engine\classes"

os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Starting class analysis...")
files = [f for f in os.listdir(DECOMPILED_DIR) if f.endswith(".java")]
for f in sorted(files):
    path = os.path.join(DECOMPILED_DIR, f)
    with open(path, "r", encoding="utf-8") as fp:
        lines = fp.readlines()
    print(f"{f}: {len(lines)} lines")

