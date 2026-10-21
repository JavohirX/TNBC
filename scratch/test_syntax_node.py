import os
import subprocess

OUTPUT_DIR = r"D:\source\nightmare-b4-xmas\engine\classes"
files = sorted([f for f in os.listdir(OUTPUT_DIR) if f.endswith(".js")])

for f in files:
    path = os.path.join(OUTPUT_DIR, f)
    # Check syntax using node --check
    cmd = f'node --check "{path}"'
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"OK: {f}")
    else:
        print(f"ERROR: {f}")
        for err_line in res.stderr.splitlines()[:5]:
            print("  ", err_line)
