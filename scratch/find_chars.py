with open('engine/classes/e.js', 'r', encoding='utf-8') as f:
    for idx, l in enumerate(f, 1):
        if "'a'" in l or "'z'" in l or "' '" in l:
            print(f"e.js:{idx} {l.strip()}")

with open('engine/classes/f.js', 'r', encoding='utf-8') as f:
    for idx, l in enumerate(f, 1):
        if "'|'" in l or "' '" in l:
            print(f"f.js:{idx} {l.strip()}")

