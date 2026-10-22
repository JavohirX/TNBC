import os
import re

DECOMPILED_DIR = r"D:\source\nightmare-b4-xmas\scratch\decompiled_renamed"
OUTPUT_DIR = r"D:\source\nightmare-b4-xmas\engine\classes"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# List of all game classes
CLASS_NAMES = [
    "k", "l", "s", "d", "p", "c", "o", "h", "g", "b", "f", "GMIDlet", "j", "m", "e", "q", "r", "n", "t", "i", "a"
]

def clean_java_to_js(code, class_name):
    # Remove package and unused imports
    code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
    code = re.sub(r'import\s+[\w\.]+;\s*', '', code)
    
    # Replace System.currentTimeMillis()
    code = re.sub(r'System\.currentTimeMillis\(\)', 'Date.now()', code)
    code = re.sub(r'System\.gc\(\);', '/* gc */', code)
    code = re.sub(r'System\.err\.println\((.*?)\);', r'console.error(\1);', code)
    code = re.sub(r'System\.out\.println\((.*?)\);', r'console.log(\1);', code)
    
    # Replace string methods
    code = re.sub(r'(\w+)\.equals\((.*?)\)', r'(\1 === \2)', code)
    code = re.sub(r'(\w+)\.equalsIgnoreCase\((.*?)\)', r'(\1.toLowerCase() === (\2).toLowerCase())', code)
    code = re.sub(r'(\w+)\.length\(\)', r'\1.length', code)
    code = re.sub(r'(\w+)\.charAt\((.*?)\)', r'\1.charCodeAt(\2)', code)
    code = re.sub(r'(\w+)\.toCharArray\(\)', r'\1.split("").map(c => c.charCodeAt(0))', code)
    code = re.sub(r'(\w+)\.setLength\(0\)', r'\1 = ""', code)
    code = re.sub(r'(\w+)\.append\((.*?)\)', r'\1 += String.fromCharCode(\2)', code)
    code = re.sub(r'(\w+)\.toString\(\)', r'\1', code)
    code = re.sub(r'new StringBuffer\(\)', '""', code)
    
    # Cast removals
    code = re.sub(r'\((?:int|short|byte|char|long|float|double)\)', '', code)
    code = re.sub(r'\(Object\)(?:\(Object\))?', '', code)
    code = re.sub(r'\(TimerTask\)', '', code)
    code = re.sub(r'\(Displayable\)', '', code)
    code = re.sub(r'\(MIDlet\)', '', code)
    code = re.sub(r'\(PlayerListener\)', '', code)
    code = re.sub(r'\(InputStream\)', '', code)
    code = re.sub(r'\(byte\[\]\)', '', code)
    code = re.sub(r'\(short\[\]\)', '', code)
    code = re.sub(r'\(int\[\]\)', '', code)
    code = re.sub(r'\(String\[\]\)', '', code)
    
    # Class declaration
    code = re.sub(rf'public\s+(?:final\s+|abstract\s+)?class\s+{class_name}\s*(?:extends\s+(\w+))?\s*(?:implements\s+[\w,\s]+)?\s*\{{', 
                  lambda m: f'export class {class_name}' + (f' extends {m.group(1)} {{' if m.group(1) and m.group(1) not in ['MIDlet', 'TimerTask', 'PlayerListener'] else ' {'), 
                  code)

    # Convert constructor
    code = re.sub(rf'public\s+{class_name}\s*\((.*?)\)\s*\{{', r'constructor(\1) {', code)
    
    # Convert methods: public / private / protected static final void / type
    code = re.sub(r'(?:public|private|protected)?\s*static\s+(?:final\s+)?(?:void|[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{',
                  r'static \1(\2) {', code)
    code = re.sub(r'(?:public|private|protected)?\s*(?:final\s+|abstract\s+)?(?:void|[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{',
                  r'\1(\2) {', code)

    # Types in parameter lists
    # e.g. (int n2, int n3) -> (n2, n3)
    def clean_params(m):
        raw = m.group(1)
        params = []
        for p in raw.split(','):
            p = p.strip()
            if not p: continue
            parts = p.split()
            params.append(parts[-1])
        return '(' + ', '.join(params) + ')'
    
    code = re.sub(r'(?:static\s+)?([a-zA-Z_]\w*)\s*\((.*?)\)\s*\{', 
                  lambda m: m.group(0).split('(')[0] + clean_params(re.search(r'\((.*?)\)', m.group(0))) + ' {', 
                  code)
    
    # Variable declarations inside methods
    types = [
        'int', 'short', 'byte', 'boolean', 'char', 'long', 'float', 'double',
        'String', 'Image', 'Graphics', 'DataInputStream', 'InputStream', 'Random',
        'ByteArrayInputStream', 'Player', 'VolumeControl'
    ] + CLASS_NAMES
    
    for t in types:
        # Array decl: int[] arr = ... -> let arr = ...
        code = re.sub(rf'\b{t}\s*\[\s*\](?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*=', r'let \1 =', code)
        code = re.sub(rf'\b{t}\s*\[\s*\](?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*;', r'let \1 = null;', code)
        # Var decl: int n2 = ... -> let n2 = ...
        code = re.sub(rf'\b{t}\s+([a-zA-Z_]\w*)\s*=', r'let \1 =', code)
        code = re.sub(rf'\b{t}\s+([a-zA-Z_]\w*)\s*;', r'let \1 = 0;', code)
    
    # Array instantiations:
    # new short[a][b]
    code = re.sub(r'new\s+(?:short|int|byte)\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Int32Array(\2))', code)
    code = re.sub(r'new\s+boolean\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Array(\2).fill(false))', code)
    code = re.sub(r'new\s+i\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Array(\2).fill(null))', code)
    code = re.sub(r'new\s+l\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Array(\2).fill(null))', code)
    code = re.sub(r'new\s+char\[(.*?)\]\[\s*\]', r'Array.from({length: \1}, () => null)', code)
    code = re.sub(r'new\s+byte\[(.*?)\]\[\s*\]', r'Array.from({length: \1}, () => null)', code)
    
    # 1D arrays:
    code = re.sub(r'new\s+byte\[(.*?)\]', r'new Int8Array(\1)', code)
    code = re.sub(r'new\s+short\[(.*?)\]', r'new Int16Array(\1)', code)
    code = re.sub(r'new\s+int\[(.*?)\]', r'new Int32Array(\1)', code)
    code = re.sub(r'new\s+char\[(.*?)\]', r'new Uint16Array(\1)', code)
    code = re.sub(r'new\s+boolean\[(.*?)\]', r'new Array(\1).fill(false)', code)
    code = re.sub(r'new\s+String\[(.*?)\]', r'new Array(\1).fill("")', code)
    code = re.sub(r'new\s+Image\[(.*?)\]', r'new Array(\1).fill(null)', code)
    code = re.sub(r'new\s+l\[(.*?)\]', r'new Array(\1).fill(null)', code)
    code = re.sub(r'new\s+Object\[(.*?)\]', r'new Array(\1).fill(null)', code)
    
    # Class fields: static int a; -> static a = 0;
    # public int a = 1; -> a = 1;
    code = re.sub(r'(?:public|private|protected)?\s*static\s+(?:final\s+)?(?:[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*=\s*(.*?);',
                  r'static \1 = \2;', code)
    code = re.sub(r'(?:public|private|protected)?\s*static\s+(?:final\s+)?(?:[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*;',
                  r'static \1 = null;', code)
    code = re.sub(r'(?:public|private|protected)?\s*(?:final\s+)?(?:[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*=\s*(.*?);',
                  r'\1 = \2;', code)
    code = re.sub(r'(?:public|private|protected)?\s*(?:final\s+)?(?:[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*;',
                  r'\1 = 0;', code)
    
    # Labeled break / continue: break block32; -> break;
    code = re.sub(r'block\d+\s*:\s*', '', code)
    code = re.sub(r'break\s+block\d+\s*;', 'break;', code)
    code = re.sub(r'continue\s+block\d+\s*;', 'continue;', code)

    # Resource loading
    code = re.sub(r'(?:\(\(Object\)\(\(Object\)\w+\)\)\.)?getClass\(\)\.getResourceAsStream\((.*?)\)', 
                  r'ResourceManager.getResourceAsStream(\1)', code)
    
    # Literal characters: '\u0001' -> 1, '\u0000' -> 0
    code = re.sub(r"'\\u([0-9a-fA-F]{4})'", lambda m: str(int(m.group(1), 16)), code)
    
    # Array literals: new int[]{...} -> [...]
    code = re.sub(r'new\s+(?:int|short|byte|String)\[\s*\]\s*\{', '[', code)
    # Closing brace of array literal if matched with [
    # (standard regex might need care)
    
    return code

print("Testing transpiler pipeline...")
for c in ["k", "l", "s", "d", "p", "c", "o", "h"]:
    path = os.path.join(DECOMPILED_DIR, f"{c}.java")
    with open(path, "r", encoding="utf-8") as fp:
        raw = fp.read()
    js = clean_java_to_js(raw, c)
    out_path = os.path.join(OUTPUT_DIR, f"{c}.js")
    with open(out_path, "w", encoding="utf-8") as fp:
        fp.write(js)
    print(f"Generated {c}.js")

