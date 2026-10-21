import os
import re

DECOMPILED_DIR = r"D:\source\nightmare-b4-xmas\scratch\decompiled_renamed"

def transpile_file(class_name):
    path = os.path.join(DECOMPILED_DIR, f"{class_name}.java")
    with open(path, "r", encoding="utf-8") as fp:
        lines = fp.readlines()

    out_lines = []
    in_class = False

    for line in lines:
        raw = line
        stripped = raw.strip()

        # Skip imports and decompilation header
        if stripped.startswith("import ") or stripped.startswith("/*") or stripped.startswith("*") or stripped == "*/":
            continue

        # Class header
        m_class = re.match(r'^(public\s+)?(final\s+|abstract\s+)?class\s+(\w+)(\s+extends\s+(\w+))?(\s+implements\s+[\w,\s]+)?\s*\{', stripped)
        if m_class:
            c_name = m_class.group(3)
            super_name = m_class.group(5)
            if super_name and super_name not in ['MIDlet', 'TimerTask', 'PlayerListener']:
                out_lines.append(f"export class {c_name} extends {super_name} {{\n")
            else:
                out_lines.append(f"export class {c_name} {{\n")
            in_class = True
            continue

        if not in_class:
            continue

        # Constructor
        m_ctor = re.match(r'^(public|private|protected)?\s*' + re.escape(class_name) + r'\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{', stripped)
        if m_ctor:
            params = clean_param_types(m_ctor.group(2))
            out_lines.append(f"    constructor({params}) {{\n")
            continue

        # Method
        m_method = re.match(r'^(public|private|protected)?\s*(static\s+)?(final\s+|abstract\s+)?([\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{', stripped)
        if m_method and m_method.group(5) not in ['if', 'while', 'for', 'switch']:
            is_static = bool(m_method.group(2))
            name = m_method.group(5)
            params = clean_param_types(m_method.group(6))
            prefix = "    static " if is_static else "    "
            out_lines.append(f"{prefix}{name}({params}) {{\n")
            continue

        # Static / instance fields in class body (outside methods)
        # Note: in CFR, field declarations are at top of class before first method/constructor.
        m_field = re.match(r'^(public|private|protected)?\s*(static\s+)?(final\s+)?([\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*(=\s*[^;]+)?\s*;', stripped)
        if m_field and not any(k in stripped for k in ['return', 'goto', 'throw', 'package', 'import']):
            is_static = bool(m_field.group(2))
            name = m_field.group(5)
            val = m_field.group(6)
            if val:
                val = clean_expressions(val[1:].strip())
            else:
                val = "null" if is_static else "0"
            prefix = "    static " if is_static else "    "
            out_lines.append(f"{prefix}{name} = {val};\n")
            continue

        # Normal line inside method/static block
        converted = clean_line(stripped)
        out_lines.append("    " + converted + "\n")

    return "".join(out_lines)

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

def clean_expressions(expr):
    # Remove Java casts: (int), (short), (byte), (char), (String[]), etc.
    expr = re.sub(r'\((?:int|short|byte|char|long|float|double|Object|TimerTask|Displayable|MIDlet|PlayerListener|InputStream|byte\[\]|short\[\]|int\[\]|String\[\])\)', '', expr)
    expr = re.sub(r'System\.currentTimeMillis\(\)', 'Date.now()', expr)
    expr = re.sub(r'System\.gc\(\);', '/* gc */', expr)
    expr = re.sub(r'(\w+)\.equals\((.*?)\)', r'(\1 === \2)', expr)
    expr = re.sub(r'(\w+)\.equalsIgnoreCase\((.*?)\)', r'(\1.toLowerCase() === (\2).toLowerCase())', expr)
    expr = re.sub(r'(\w+)\.length\(\)', r'\1.length', expr)
    expr = re.sub(r'(\w+)\.charAt\((.*?)\)', r'\1.charCodeAt(\2)', expr)
    expr = re.sub(r'(\w+)\.toCharArray\(\)', r'\1.split("").map(c => c.charCodeAt(0))', expr)
    expr = re.sub(r'(\w+)\.setLength\(0\)', r'\1 = ""', expr)
    expr = re.sub(r'(\w+)\.append\((.*?)\)', r'\1 += String.fromCharCode(\2)', expr)
    expr = re.sub(r'(\w+)\.toString\(\)', r'\1', expr)
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

def clean_line(line):
    # Labeled breaks/blocks
    line = re.sub(r'block\d+\s*:\s*', '', line)
    line = re.sub(r'break\s+block\d+\s*;', 'break;', line)
    line = re.sub(r'continue\s+block\d+\s*;', 'continue;', line)

    # Types in local variable declarations
    types = [
        'int', 'short', 'byte', 'boolean', 'char', 'long', 'float', 'double',
        'String', 'Image', 'Graphics', 'DataInputStream', 'InputStream', 'Random',
        'ByteArrayInputStream', 'Player', 'VolumeControl'
    ] + [
        "k", "l", "s", "d", "p", "c", "o", "h", "g", "b", "f", "GMIDlet", "j", "m", "e", "q", "r", "n", "t", "i", "a"
    ]
    for t in types:
        # Array decl: int[] arr = ... -> let arr = ...
        line = re.sub(rf'\b{t}\s*\[\s*\](?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*=', r'let \1 =', line)
        line = re.sub(rf'\b{t}\s*\[\s*\](?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*;', r'let \1 = null;', line)
        # Var decl: int n2 = ... -> let n2 = ...
        line = re.sub(rf'\b{t}\s+([a-zA-Z_]\w*)\s*=', r'let \1 =', line)
        line = re.sub(rf'\b{t}\s+([a-zA-Z_]\w*)\s*;', r'let \1 = 0;', line)

    return clean_expressions(line)

print("Testing h.java transpile:")
h_js = transpile_file("h")
print(h_js)
