import os
import re

DECOMPILED_DIR = r"D:\source\nightmare-b4-xmas\scratch\decompiled_renamed"
OUTPUT_DIR = r"D:\source\nightmare-b4-xmas\engine\classes"
os.makedirs(OUTPUT_DIR, exist_ok=True)

CLASS_NAMES = [
    "k", "l", "s", "d", "p", "c", "o", "h", "g", "b", "f", "GMIDlet", "j", "m", "e", "q", "r", "n", "t", "i", "a"
]

SUBCLASS_MAP = {
    "d": "l", "p": "l", "c": "l", "o": "l", "h": "l", "f": "l",
    "i": "l", "b": "i", "m": "i", "q": "i", "s": "TimerTask", "GMIDlet": "MIDlet"
}

def clean_expressions(expr):
    # Java casts
    expr = re.sub(r'\((?:int|short|byte|char|long|float|double|Object|TimerTask|Displayable|MIDlet|PlayerListener|InputStream|byte\[\]|short\[\]|int\[\]|String\[\])\)', '', expr)
    expr = re.sub(r'\(Object\)(?:\(Object\))?', '', expr)
    expr = re.sub(r'System\.currentTimeMillis\(\)', 'Date.now()', expr)
    expr = re.sub(r'System\.gc\(\);', '/* gc */', expr)
    expr = re.sub(r'System\.err\.println\((.*?)\);', r'console.error(\1);', expr)
    expr = re.sub(r'System\.out\.println\((.*?)\);', r'console.log(\1);', expr)
    
    expr = re.sub(r'(\w+)\.equals\((.*?)\)', r'(\1 === \2)', expr)
    expr = re.sub(r'(\w+)\.equalsIgnoreCase\((.*?)\)', r'(\1.toLowerCase() === (\2).toLowerCase())', expr)
    expr = re.sub(r'(\w+)\.length\(\)', r'\1.length', expr)
    expr = re.sub(r'(\w+)\.charAt\((.*?)\)', r'\1.charCodeAt(\2)', expr)
    expr = re.sub(r'(\w+)\.toCharArray\(\)', r'\1.split("").map(c => c.charCodeAt(0))', expr)
    expr = re.sub(r'(\w+)\.setLength\(0\)', r'\1 = ""', expr)
    expr = re.sub(r'(\w+)\.append\((.*?)\)', r'\1 += String.fromCharCode(\2)', expr)
    expr = re.sub(r'new StringBuffer\(\)', '""', expr)
    expr = re.sub(r'(?:\(\(Object\)\(\(Object\)\w+\)\)\.)?getClass\(\)\.getResourceAsStream\((.*?)\)', r'ResourceManager.getResourceAsStream(\1)', expr)
    
    # 2D Arrays
    expr = re.sub(r'new\s+(?:short|int|byte)\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Int32Array(\2))', expr)
    expr = re.sub(r'new\s+boolean\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Array(\2).fill(false))', expr)
    expr = re.sub(r'new\s+i\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Array(\2).fill(null))', expr)
    expr = re.sub(r'new\s+l\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Array(\2).fill(null))', expr)
    expr = re.sub(r'new\s+char\[(.*?)\]\[\s*\]', r'Array.from({length: \1}, () => null)', expr)
    expr = re.sub(r'new\s+byte\[(.*?)\]\[\s*\]', r'Array.from({length: \1}, () => null)', expr)
    
    # 1D Arrays
    expr = re.sub(r'new\s+byte\[(.*?)\]', r'new Int8Array(\1)', expr)
    expr = re.sub(r'new\s+short\[(.*?)\]', r'new Int16Array(\1)', expr)
    expr = re.sub(r'new\s+int\[(.*?)\]', r'new Int32Array(\1)', expr)
    expr = re.sub(r'new\s+char\[(.*?)\]', r'new Uint16Array(\1)', expr)
    expr = re.sub(r'new\s+boolean\[(.*?)\]', r'new Array(\1).fill(false)', expr)
    expr = re.sub(r'new\s+String\[(.*?)\]', r'new Array(\1).fill("")', expr)
    expr = re.sub(r'new\s+Image\[(.*?)\]', r'new Array(\1).fill(null)', expr)
    expr = re.sub(r'new\s+l\[(.*?)\]', r'new Array(\1).fill(null)', expr)
    expr = re.sub(r'new\s+Object\[(.*?)\]', r'new Array(\1).fill(null)', expr)
    
    # Character literals '\u0001'
    expr = re.sub(r"'\\u([0-9a-fA-F]{4})'", lambda m: str(int(m.group(1), 16)), expr)

    # Array literals: new int[]{...} -> [...]
    expr = re.sub(r'new\s+(?:int|short|byte|String)\[\s*\]\s*\{', '[', expr)
    return expr

def clean_param_types(raw):
    raw = raw.strip()
    if not raw: return ""
    params = []
    for p in raw.split(","):
        p = p.strip()
        if not p: continue
        parts = p.split()
        params.append(parts[-1])
    return ", ".join(params)

def transpile_class(class_name):
    path = os.path.join(DECOMPILED_DIR, f"{class_name}.java")
    with open(path, "r", encoding="utf-8") as fp:
        raw_code = fp.read()

    # Pre-clean multi-line class headers
    raw_code = re.sub(r'(class\s+\w+)\s*\n\s*(extends\s+\w+)', r'\1 \2', raw_code)
    raw_code = re.sub(r'(class\s+\w+(?:\s+extends\s+\w+)?)\s*\n\s*(implements\s+[\w,\s]+)', r'\1 \2', raw_code)

    lines = raw_code.splitlines()
    out = []
    has_super = SUBCLASS_MAP.get(class_name) in ['l', 'i']
    super_class = SUBCLASS_MAP.get(class_name) if SUBCLASS_MAP.get(class_name) not in ['MIDlet', 'TimerTask', 'PlayerListener'] else None

    # Track if inside constructor or method
    in_class = False
    in_ctor = False
    ctor_has_super = False

    types = [
        'int', 'short', 'byte', 'boolean', 'char', 'long', 'float', 'double',
        'String', 'Image', 'Graphics', 'DataInputStream', 'InputStream', 'Random',
        'ByteArrayInputStream', 'Player', 'VolumeControl'
    ] + CLASS_NAMES

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Skip comments & imports
        if stripped.startswith("import ") or stripped.startswith("/*") or stripped.startswith("*") or stripped == "*/":
            i += 1
            continue

        # Class header
        m_class = re.match(r'^(public\s+)?(final\s+|abstract\s+)?class\s+(\w+)(\s+extends\s+(\w+))?(\s+implements\s+[\w,\s]+)?\s*\{', stripped)
        if m_class:
            in_class = True
            if super_class:
                out.append(f"export class {class_name} extends {super_class} {{\n")
            else:
                out.append(f"export class {class_name} {{\n")
            i += 1
            continue

        if not in_class:
            i += 1
            continue

        # Check constructor
        m_ctor = re.match(r'^(public|private|protected)?\s*' + re.escape(class_name) + r'\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{', stripped)
        if m_ctor:
            in_ctor = True
            ctor_has_super = False
            params = clean_param_types(m_ctor.group(2))
            out.append(f"    constructor({params}) {{\n")
            if has_super:
                # We will check if next line is super(...)
                pass
            i += 1
            continue

        # Method header
        m_method = re.match(r'^(public|private|protected)?\s*(static\s+)?(final\s+|abstract\s+)?([\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{', stripped)
        if m_method and m_method.group(5) not in ['if', 'while', 'for', 'switch']:
            is_static = bool(m_method.group(2))
            m_name = m_method.group(5)
            params = clean_param_types(m_method.group(6))
            prefix = "    static " if is_static else "    "
            out.append(f"{prefix}{m_name}({params}) {{\n")
            i += 1
            continue

        # Class field outside methods
        m_field = re.match(r'^(public|private|protected)?\s*(static\s+)?(final\s+)?([\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*(=\s*[^;]+)?\s*;', stripped)
        if m_field and not any(k in stripped for k in ['return', 'goto', 'throw', 'package', 'import']):
            is_static = bool(m_field.group(2))
            f_name = m_field.group(5)
            val = m_field.group(6)
            if val:
                val = clean_expressions(val[1:].strip())
            else:
                val = "null" if is_static else "0"
            prefix = "    static " if is_static else "    "
            out.append(f"{prefix}{f_name} = {val};\n")
            i += 1
            continue

        # If inside constructor and has superclass, ensure super() is called
        if in_ctor:
            if stripped.startswith("super(") or stripped == "super();":
                ctor_has_super = True
            elif not ctor_has_super and has_super:
                out.append("        super();\n")
                ctor_has_super = True

        if in_ctor and stripped == "}":
            if not ctor_has_super and has_super:
                out.append("        super();\n")
            in_ctor = False

        # Regular lines
        s = stripped
        # CFR artifacts
        s = re.sub(r'block\d+\s*:\s*', '', s)
        s = re.sub(r'break\s+block\d+\s*;', 'break;', s)
        s = re.sub(r'continue\s+block\d+\s*;', 'continue;', s)

        # Local variable declarations
        for t in types:
            s = re.sub(rf'\b{t}\s*\[\s*\](?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*=', r'let \1 =', s)
            s = re.sub(rf'\b{t}\s*\[\s*\](?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*;', r'let \1 = null;', s)
            s = re.sub(rf'\b{t}\s+([a-zA-Z_]\w*)\s*=', r'let \1 =', s)
            s = re.sub(rf'\b{t}\s+([a-zA-Z_]\w*)\s*;', r'let \1 = 0;', s)

        s = clean_expressions(s)
        out.append("    " + s + "\n")
        i += 1

    return "".join(out)

print("Transpiling all 21 classes...")
for c in CLASS_NAMES:
    js_code = transpile_class(c)
    out_file = os.path.join(OUTPUT_DIR, f"{c}.js")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(js_code)
    print(f"Generated {c}.js ({len(js_code.splitlines())} lines)")
