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
    "i": "l", "b": "i", "m": "i", "q": "i", "s": "TimerTask", "GMIDlet": "MIDlet", "t": "FullCanvas"
}

STRUCTURED_J_A = """
    static _a_1(n2) {
        if ((GMIDlet.var_byte_a & 3) === 0) return;
        try {
            if (!j.var_java_lang_Object_arr_a || n2 < 0 || n2 >= j.var_java_lang_Object_arr_a.length || !j.var_java_lang_Object_arr_a[n2]) {
                if ((n2 === 3 || n2 === 4 || n2 === 5) && j.var_int_a >= 0) {
                    j.a();
                }
                return;
            }
            if (j.var_int_a >= 0 && j.var_javax_microedition_media_Player_a) {
                if (j.var_int_a === n2 && (n2 === 3 || n2 === 4 || n2 === 5)) {
                    return;
                }
                j.a();
            }

            const item = j.var_java_lang_Object_arr_a[n2];
            if (item instanceof Int8Array || item instanceof Uint8Array || Array.isArray(item)) {
                const byArray = item;
                const typeCode = byArray[byArray.length - 1];
                const mime = "audio/" + j.var_java_lang_String_arr_a[typeCode];
                let loopCount = (n2 === 3 || n2 === 4 || n2 === 5) ? -1 : 1;
                if (typeof AudioManager !== 'undefined') {
                    AudioManager.playAudio(n2, byArray, mime, loopCount);
                }
                j.var_int_a = n2;
            } else {
                const sArray = item;
                if (typeof AudioManager !== 'undefined') {
                    AudioManager.playTone(sArray[0], sArray[1], sArray[2]);
                }
            }
        } catch (e) {
            console.warn("Audio playback error:", n2, e);
        }
    }
"""

STRUCTURED_E_A = """
    static _a_init_font(clazz) {
        if (e._a_0()) {
            let dataInputStream = ResourceManager.getResourceAsStream(e.var_java_lang_String_a);
            e._a_1(dataInputStream);
            try { dataInputStream.close(); } catch (err) {}
        }
    }
"""

STRUCTURED_I_A_LASER = """
    _i_laser_a(var1_1) {
        if (this.f_q === 7) {
            if (this.f_e !== 2) {
                this.f_e = 2;
                this.var_k_a.a(103, 4, 4);
                this.j();
            }
            return;
        }
        if (this.f_q === 1) {
            if (this.f_f === 0) {
                this.f_f = 1;
            }
            return;
        }
        if (this.f_q === 6) {
            let var3_2 = 0;
            if (this.f_h === 0) {
                if (var1_1 === 1) {
                    var3_2 = 2;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 6);
                } else if (var1_1 === 0) {
                    var3_2 = 3;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 6);
                } else {
                    return;
                }
            } else if (this.f_h === 1) {
                if (var1_1 === 1) {
                    var3_2 = 0;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 5);
                } else if (var1_1 === 2) {
                    var3_2 = 3;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 5);
                } else {
                    return;
                }
            } else if (this.f_h === 2) {
                if (var1_1 === 2) {
                    var3_2 = 1;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 4);
                } else if (var1_1 === 3) {
                    var3_2 = 0;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 4);
                } else {
                    return;
                }
            } else if (this.f_h === 3) {
                if (var1_1 === 0) {
                    var3_2 = 1;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 7);
                } else if (var1_1 === 3) {
                    var3_2 = 2;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 7);
                } else {
                    return;
                }
            }

            let var4_3 = (var3_2 === 0 || var3_2 === 2) ? 9 : 17;
            switch (var3_2) {
                case 0: { // UP
                    for (let var2_5 = this.var_int_d - 1; var2_5 >= 0; --var2_5) {
                        if ((i.var_n_a.var_r_a.int_b(this.var_int_b, var2_5) & var4_3) !== 0) return;
                        let var6 = i.var_n_a.var_r_a.i_a(this.var_int_b, var2_5);
                        if (var6 !== null && !var6.var_boolean_d && ((var6.var_char_a & 1) !== 0 || (var6.var_char_a & 16) !== 0 || (var6.var_char_a & 8) !== 0)) {
                            if ((var6.var_char_a & 16) !== 0) {
                                var6.a(var3_2);
                                return;
                            }
                            break;
                        }
                        i.var_n_a.var_r_a.b(this.var_int_b, var2_5, 2);
                    }
                    break;
                }
                case 1: { // RIGHT
                    for (let var2_6 = this.var_int_b + 1; var2_6 < r.var_int_a; ++var2_6) {
                        if ((i.var_n_a.var_r_a.int_b(var2_6, this.var_int_d) & var4_3) !== 0) return;
                        let var6 = i.var_n_a.var_r_a.i_a(var2_6, this.var_int_d);
                        if (var6 !== null && !var6.var_boolean_d && ((var6.var_char_a & 1) !== 0 || (var6.var_char_a & 16) !== 0 || (var6.var_char_a & 8) !== 0)) {
                            if ((var6.var_char_a & 16) !== 0) {
                                var6.a(var3_2);
                                return;
                            }
                            break;
                        }
                        i.var_n_a.var_r_a.b(var2_6, this.var_int_d, 1);
                    }
                    break;
                }
                case 2: { // DOWN
                    for (let var2_7 = this.var_int_d + 1; var2_7 < r.var_int_b; ++var2_7) {
                        if ((i.var_n_a.var_r_a.int_b(this.var_int_b, var2_7) & var4_3) !== 0) return;
                        let var6 = i.var_n_a.var_r_a.i_a(this.var_int_b, var2_7);
                        if (var6 !== null && !var6.var_boolean_d && ((var6.var_char_a & 1) !== 0 || (var6.var_char_a & 16) !== 0 || (var6.var_char_a & 8) !== 0)) {
                            if ((var6.var_char_a & 16) !== 0) {
                                var6.a(var3_2);
                                return;
                            }
                            break;
                        }
                        i.var_n_a.var_r_a.b(this.var_int_b, var2_7, 2);
                    }
                    break;
                }
                case 3: { // LEFT
                    for (let var2_8 = this.var_int_b - 1; var2_8 >= 0; --var2_8) {
                        if ((i.var_n_a.var_r_a.int_b(var2_8, this.var_int_d) & var4_3) !== 0) return;
                        let var6 = i.var_n_a.var_r_a.i_a(var2_8, this.var_int_d);
                        if (var6 !== null && !var6.var_boolean_d && ((var6.var_char_a & 1) !== 0 || (var6.var_char_a & 16) !== 0 || (var6.var_char_a & 8) !== 0)) {
                            if ((var6.var_char_a & 16) !== 0) {
                                var6.a(var3_2);
                                return;
                            }
                            break;
                        }
                        i.var_n_a.var_r_a.b(var2_8, this.var_int_d, 1);
                    }
                    break;
                }
            }
        }
    }
"""

ALL_CLASH_FIELDS = set("abcdefghijklmnopqrstuvwxyz")

def clean_expressions(expr):
    # Java class casts: ((i)this).e -> this.e
    expr = re.sub(r'\(\([a-zA-Z_]\w*\)\s*([a-zA-Z_0-9\.]+)\)\.', r'\1.', expr)

    # Rename clashing field accesses obj.x -> obj.f_x when not followed by '('
    for fld in ALL_CLASH_FIELDS:
        expr = re.sub(rf'(?<=\.){fld}\b(?!\s*\()', f'f_{fld}', expr)

    # instanceof byte[] -> instanceof Int8Array
    expr = re.sub(r'([a-zA-Z0-9_\.\[\]]+)\s+instanceof\s+byte\[\]', r'(\1 instanceof Int8Array || \1 instanceof Uint8Array)', expr)
    expr = re.sub(r'([a-zA-Z0-9_\.\[\]]+)\s+instanceof\s+\w+\[\]', r'Array.isArray(\1)', expr)

    # Java catch: catch (Exception exception) -> catch (exception)
    expr = re.sub(r'catch\s*\(\s*[\w\.]+\s+([a-zA-Z_]\w*)\s*\)', r'catch (\1)', expr)

    # Java casts
    expr = re.sub(r'\((?:int|short|byte|char|long|float|double|boolean|Object)(?:\[\])?\)\s*', '', expr)
    expr = re.sub(r'\([A-Z]\w*(?:\[\])?\)\s*', '', expr)
    expr = re.sub(r'\(([a-z])\)\s*([a-zA-Z_]\w*)', r'\2', expr)
    expr = re.sub(r'\(Object\)(?:\(Object\))?', '', expr)
    expr = re.sub(r'System\.currentTimeMillis\(\)', 'Date.now()', expr)
    expr = re.sub(r'System\.gc\(\);', '/* gc */', expr)
    expr = re.sub(r'Runtime\.getRuntime\(\);?', '/* Runtime.getRuntime() */', expr)
    expr = re.sub(r'System\.err\.println\((.*?)\);', r'console.error(\1);', expr)
    expr = re.sub(r'System\.out\.println\((.*?)\);', r'console.log(\1);', expr)
    
    expr = re.sub(r'([a-zA-Z0-9_\.]+)\.equals\((.*?)\)', r'(\1 === \2)', expr)
    expr = re.sub(r'([a-zA-Z0-9_\.]+)\.equalsIgnoreCase\((.*?)\)', r'(\1.toLowerCase() === (\2).toLowerCase())', expr)
    expr = re.sub(r'([a-zA-Z0-9_\.]+)\.length\(\)', r'\1.length', expr)
    expr = re.sub(r'([a-zA-Z0-9_\.]+)\.charAt\((.*?)\)', r'\1.charCodeAt(\2)', expr)
    expr = re.sub(r'([a-zA-Z0-9_\.]+)\.toCharArray\(\)', r'\1.split("").map(c => c.charCodeAt(0))', expr)
    expr = re.sub(r'([a-zA-Z0-9_\.]+)\.setLength\(0\)', r'\1 = ""', expr)
    expr = re.sub(r'([a-zA-Z0-9_\.]+)\.append\((.*?)\)', r'\1 += String.fromCharCode(\2)', expr)
    expr = re.sub(r'new StringBuffer\(\)', '""', expr)
    expr = re.sub(r'new\s+DataInputStream\((?:[a-zA-Z0-9_\(\)\.]+)?getClass\(\)\.getResourceAsStream\((.*?)\)\)', r'ResourceManager.getResourceAsStream(\1)', expr)
    expr = re.sub(r'(?:[a-zA-Z0-9_\(\)\.]+)?getClass\(\)\.getResourceAsStream\((.*?)\)', r'ResourceManager.getResourceAsStream(\1)', expr)
    expr = re.sub(r'([a-zA-Z0-9_\.]+)\.getMessage\(\)', r'\1.message', expr)
    
    # Vector handling
    expr = re.sub(r'new\s+Vector(?:<.*?>)?\(\)', '[]', expr)
    expr = re.sub(r'([a-zA-Z0-9_\.]+)\.addElement\((.*?)\)', r'\1.push(\2)', expr)
    expr = re.sub(r'([a-zA-Z0-9_\.]+)\.size\(\)', r'\1.length', expr)
    expr = re.sub(r'([a-zA-Z0-9_\.]+)\.copyInto\((.*?)\)', r'for (let _ci = 0; _ci < \1.length; _ci++) \2[_ci] = \1[_ci]', expr)

    # 2D Arrays
    expr = re.sub(r'new\s+(?:short|int|byte)\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Int32Array(\2))', expr)
    expr = re.sub(r'new\s+boolean\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Array(\2).fill(false))', expr)
    expr = re.sub(r'new\s+i\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Array(\2).fill(null))', expr)
    expr = re.sub(r'new\s+l\[(.*?)\]\[(.*?)\]', r'Array.from({length: \1}, () => new Array(\2).fill(null))', expr)
    expr = re.sub(r'new\s+char\[(.*?)\]\[\s*\]', r'Array.from({length: \1}, () => null)', expr)
    expr = re.sub(r'new\s+byte\[(.*?)\]\[\s*\]', r'Array.from({length: \1}, () => null)', expr)
    
    # Array initializers with literal elements
    expr = re.sub(r'new\s+int\[\s*\]\s*\{(.*?)\}', r'new Int32Array([\1])', expr)
    expr = re.sub(r'new\s+byte\[\s*\]\s*\{(.*?)\}', r'new Int8Array([\1])', expr)
    expr = re.sub(r'new\s+short\[\s*\]\s*\{(.*?)\}', r'new Int16Array([\1])', expr)
    expr = re.sub(r'new\s+String\[\s*\]\s*\{(.*?)\}', r'[\1]', expr)

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

    # Long literals 0L -> 0
    expr = re.sub(r'\b(\d+)L\b', r'\1', expr)

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

CUSTOM_DISPATCHERS = {
    ("e", "a"): """
    static a(...args) {
        const len = args.length;
        if (len === 0) return e._a_0();
        if (len === 1) {
            const arg = args[0];
            if (typeof arg === 'string') return e._a_3(arg);
            if (typeof arg === 'number') {
                if (arg < 10) return e._a_9(arg);
                return e._a_8(arg);
            }
            if (arg && typeof arg.readByte === 'function') return e._a_1(arg);
            return e._a_init_font(arg);
        }
        if (len === 2) {
            if (typeof args[1] === 'string') return e._a_5(args[0], args[1]);
            return e._a_7(args[0], args[1]);
        }
        if (len === 4) return e._a_6(args[0], args[1], args[2], args[3]);
        if (len === 5) return e._a_4(args[0], args[1], args[2], args[3], args[4]);
        if (len === 7) return e._a_2(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        for (let idx = 0; idx < 12; idx++) {
            const fn = e[`_a_${idx}`];
            if (fn && fn.length === len) return fn.apply(e, args);
        }
    }
""",
    ("j", "a"): """
    static a(...args) {
        if (args.length === 0) {
            return j._a_0();
        } else if (typeof args[0] === 'number') {
            return j._a_1(args[0]);
        } else {
            return j._a_2(args[0]);
        }
    }
""",
    ("GMIDlet", "a"): """
    static a(...args) {
        if (args.length === 1) {
            if (typeof args[0] === 'string') return GMIDlet._a_0(args[0]);
            if (typeof args[0] === 'number') return GMIDlet._a_3(args[0]);
            return GMIDlet._a_1(args[0]);
        } else if (args.length === 5) {
            return GMIDlet._a_2(args[0], args[1], args[2], args[3], args[4]);
        }
    }
""",
    ("t", "a"): """
    static a(...args) {
        return t._a_1(...args);
    }
    a(...args) {
        if (args.length === 0) return t.prototype._a_0.apply(this, args);
        if (args.length === 1) {
            if (typeof args[0] === 'number') return t._a_1(args[0]);
            if (typeof args[0] === 'string') return t.prototype._a_2.apply(this, args);
            return t.prototype._a_3.apply(this, args);
        }
        return t.prototype._a_0.apply(this, args);
    }
""",
    ("a", "a"): """
    a(...args) {
        if (args.length === 2) return a.prototype._a_0.apply(this, args);
        if (args.length === 3) return a.prototype._a_1.apply(this, args);
    }
""",
    ("f", "a"): """
    a(...args) {
        if (args.length === 2) {
            if (typeof args[0] === 'string') return f.prototype._a_3.apply(this, args);
            return f.prototype._a_1.apply(this, args);
        }
        if (args.length === 4) return f.prototype._a_0.apply(this, args);
        if (args.length === 5) return f.prototype._a_2.apply(this, args);
    }
""",
    ("i", "a"): """
    a(...args) {
        if (args.length === 0) return i.prototype._a_1.apply(this, args);
        if (args.length === 3) return i.prototype._a_0.apply(this, args);
        if (args.length === 1) {
            if (typeof args[0] === 'number') return this._i_laser_a(args[0]);
            return i.prototype._a_2.apply(this, args);
        }
    }
""",
    ("n", "a"): """
    a(...args) {
        if (args.length === 0) return n.prototype._a_0.apply(this, args);
        if (args.length === 1) return n.prototype._a_1.apply(this, args);
        if (args.length === 2) {
            if (typeof args[0] === 'number') return n.prototype._a_2.apply(this, args);
            return n.prototype._a_3.apply(this, args);
        }
    }
""",
    ("r", "b"): """
    b(...args) {
        if (args.length === 0) return r.prototype._b_0.apply(this, args);
        if (args.length === 1) return r.prototype._b_3.apply(this, args);
        if (args.length === 3) {
            if (typeof args[2] === 'number') return r.prototype._b_1.apply(this, args);
            return r.prototype._b_2.apply(this, args);
        }
    }
"""
}

def transpile_class_full(class_name):
    path = os.path.join(DECOMPILED_DIR, f"{class_name}.java")
    with open(path, "r", encoding="utf-8") as fp:
        raw_code = fp.read()

    # Pre-clean multi-line class headers
    raw_code = re.sub(r'(class\s+\w+)\s*\n\s*(extends\s+\w+)', r'\1 \2', raw_code)
    raw_code = re.sub(r'(class\s+\w+(?:\s+extends\s+\w+)?)\s*\n\s*(implements\s+[\w,\s]+)', r'\1 \2', raw_code)

    # Find all methods and overloads (skip constructors!)
    method_pat = re.compile(r'^\s*(public|private|protected)?\s*(static\s+)?(final\s+|abstract\s+)?([\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{', re.MULTILINE)
    all_methods = method_pat.findall(raw_code)
    method_counts = {}
    for vis, is_static, is_fin, ret, name, params in all_methods:
        if name in ['if', 'while', 'for', 'switch']: continue
        if name == class_name and ret in ['public', 'private', 'protected', 'final', '']:
            continue
        method_counts[name] = method_counts.get(name, 0) + 1

    overloaded_names = {k for k, v in method_counts.items() if v > 1}

    # Find constructors
    ctor_pat = re.compile(r'^\s*(public|private|protected)?\s*' + re.escape(class_name) + r'\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{', re.MULTILINE)
    all_ctors = ctor_pat.findall(raw_code)
    has_multiple_ctors = len(all_ctors) > 1

    lines = raw_code.splitlines()
    out = []
    super_class = SUBCLASS_MAP.get(class_name) if SUBCLASS_MAP.get(class_name) not in ['TimerTask', 'PlayerListener'] else None
    has_super = bool(super_class)

    types = [
        'int', 'short', 'byte', 'boolean', 'char', 'long', 'float', 'double',
        'String', 'Image', 'Graphics', 'DataInputStream', 'InputStream', 'Random',
        'ByteArrayInputStream', 'Player', 'VolumeControl', 'Object', 'RecordStore',
        'Timer', 'TimerTask', 'Display', 'Class'
    ] + CLASS_NAMES

    # Find static fields in class (ending with semicolon, NOT methods ending with parenthesis)
    static_field_pat = re.compile(r'^\s*(?:public|private|protected)?\s*static\s+(?:final\s+)?(?:[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*(?:=[^;]+)?\s*;', re.MULTILINE)
    raw_static_fields = static_field_pat.findall(raw_code)

    in_class = False
    in_ctor = False
    in_static_block = False
    brace_depth = 0
    ctor_idx = 0
    overload_current_idx = {}
    
    # In i.java, skip the unstructured method lines
    skip_until_end_of_laser = False

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Check for start of i.java laser method
        if class_name == "i" and "public final void a(int var1_1)" in stripped:
            out.append(STRUCTURED_I_A_LASER)
            skip_until_end_of_laser = True
            i += 1
            continue

        if class_name == "j" and "public static final void a(int n2)" in stripped:
            out.append(STRUCTURED_J_A)
            # Skip until a(DataInputStream)
            while i < len(lines) and "a(DataInputStream" not in lines[i]:
                i += 1
            continue

        if class_name == "e" and "public static final void a(Class" in stripped:
            out.append(STRUCTURED_E_A)
            # Skip until boolean a()
            while i < len(lines) and "boolean a()" not in lines[i]:
                i += 1
            continue

        if skip_until_end_of_laser:
            # Look for the end of a(int var1_1)
            # The method ends right before the closing brace of class i (line 1106)
            if i >= len(lines) - 2:
                skip_until_end_of_laser = False
            else:
                i += 1
                continue

        # Skip comments & imports
        if stripped.startswith("import ") or stripped.startswith("/*") or stripped.startswith("*") or stripped == "*/":
            i += 1
            continue

        # Class header
        m_class = re.match(r'^(public\s+)?(final\s+|abstract\s+)?class\s+(\w+)(\s+extends\s+(\w+))?(\s+implements\s+[\w,\s]+)?\s*\{', stripped)
        if m_class:
            in_class = True
            brace_depth = 1
            if super_class:
                out.append(f"export class {class_name} extends {super_class} {{\n")
            else:
                out.append(f"export class {class_name} {{\n")
            i += 1
            continue

        if not in_class:
            i += 1
            continue

        # Static block: static { ... }
        if brace_depth == 1 and stripped == "static {":
            in_static_block = True
            brace_depth += 1
            out.append("    static {\n")
            i += 1
            continue

        if in_static_block and stripped == "}":
            in_static_block = False
            brace_depth -= 1
            out.append("    }\n")
            i += 1
            continue

        # Constructor (only at class scope)
        m_ctor = re.match(r'^(public|private|protected)?\s*' + re.escape(class_name) + r'\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{', stripped)
        if brace_depth == 1 and m_ctor:
            raw_params = m_ctor.group(2).strip()
            params = clean_param_types(raw_params)
            param_list = [p.strip() for p in raw_params.split(",") if p.strip()]
            num_params = len(param_list)

            if has_multiple_ctors:
                out.append(f"    _init_{num_params}({params}) {{\n")
            else:
                out.append(f"    constructor({params}) {{\n")
                if has_super:
                    out.append("        super();\n")
            in_ctor = True
            brace_depth += 1
            i += 1
            continue

        # Method header (only at class scope)
        m_method = re.match(r'^(public|private|protected)?\s*(static\s+)?(final\s+|abstract\s+)?([\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*(?:throws\s+[\w,\s]+)?\s*\{', stripped)
        if brace_depth == 1 and m_method and m_method.group(5) not in ['if', 'while', 'for', 'switch']:
            if m_method.group(5) == class_name and m_method.group(4) in ['public', 'private', 'protected']:
                # Constructor, handled above
                i += 1
                continue

            is_static = bool(m_method.group(2))
            m_name = m_method.group(5)
            raw_params = m_method.group(6).strip()
            params = clean_param_types(raw_params)
            prefix = "static " if is_static else ""

            if m_name in overloaded_names:
                idx = overload_current_idx.get(m_name, 0)
                overload_current_idx[m_name] = idx + 1
                out.append(f"    {prefix}_{m_name}_{idx}({params}) {{\n")
            else:
                out.append(f"    {prefix}{m_name}({params}) {{\n")
            brace_depth += 1
            i += 1
            continue

        # Lines inside static block
        if in_static_block:
            s = stripped
            for t in types:
                s = re.sub(rf'\b{t}\s*\[\s*\](?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*=', r'let \1 =', s)
                s = re.sub(rf'\b{t}\s*\[\s*\](?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*;', r'let \1 = null;', s)
                s = re.sub(rf'\b{t}\s+([a-zA-Z_]\w*)\s*=', r'let \1 =', s)
                s = re.sub(rf'\b{t}\s+([a-zA-Z_]\w*)\s*;', r'let \1 = 0;', s)
            s = clean_expressions(s)
            for raw_fld in raw_static_fields:
                target_fld = f"f_{raw_fld}" if raw_fld in ALL_CLASH_FIELDS else raw_fld
                if raw_fld in CLASS_NAMES:
                    s = re.sub(rf'(?<!new\s)(?<![\.\w]){raw_fld}\b(?!\.)(?!\s*\()', f'{class_name}.{target_fld}', s)
                else:
                    s = re.sub(rf'(?<!new\s)(?<![\.\w]){raw_fld}\b(?!\s*\()', f'{class_name}.{target_fld}', s)
            out.append("        " + s + "\n")
            i += 1
            continue

        # Class fields (only at class scope)
        m_field = re.match(r'^(public|private|protected)?\s*(static\s+)?(final\s+)?([\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*(=\s*[^;]+)?\s*;', stripped)
        if brace_depth == 1 and m_field and not any(k in stripped for k in ['return', 'goto', 'throw', 'package', 'import']):
            is_static = bool(m_field.group(2))
            f_type = m_field.group(4)
            raw_f_name = m_field.group(5)
            f_name = f"f_{raw_f_name}" if raw_f_name in ALL_CLASH_FIELDS else raw_f_name
            val = m_field.group(6)
            if val:
                val = clean_expressions(val[1:].strip())
                for raw_fld in raw_static_fields:
                    target_fld = f"f_{raw_fld}" if raw_fld in ALL_CLASH_FIELDS else raw_fld
                    if raw_fld in CLASS_NAMES:
                        val = re.sub(rf'(?<!new\s)(?<![\.\w]){raw_fld}\b(?!\.)(?!\s*\()', f'{class_name}.{target_fld}', val)
                    else:
                        val = re.sub(rf'(?<!new\s)(?<![\.\w]){raw_fld}\b(?!\s*\()', f'{class_name}.{target_fld}', val)
            else:
                if f_type in ['int', 'short', 'byte', 'char', 'long', 'float', 'double']:
                    val = "0"
                elif f_type == 'boolean':
                    val = "false"
                else:
                    val = "null"
            prefix = "    static " if is_static else "    "
            out.append(f"{prefix}{f_name} = {val};\n")
            i += 1
            continue

        # Regular lines inside methods
        brace_depth += stripped.count('{') - stripped.count('}')
        if in_ctor and stripped == "}" and brace_depth == 1:
            in_ctor = False
        s = stripped
        # Normalize block labels: block34 : { -> block34: {
        s = re.sub(r'(block\d+)\s*:', r'\1:', s)

        # Vector declaration
        s = re.sub(r'Vector(?:<.*?>)?\s+(\w+)\s*=', r'let \1 =', s)

        # Local variable declarations
        for t in types:
            s = re.sub(rf'\b{t}\s*\[\s*\](?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*=', r'let \1 =', s)
            s = re.sub(rf'\b{t}\s*\[\s*\](?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*;', r'let \1 = null;', s)
            s = re.sub(rf'\b{t}\s+([a-zA-Z_]\w*)\s*=', r'let \1 =', s)
            s = re.sub(rf'\b{t}\s+([a-zA-Z_]\w*)\s*;', r'let \1 = 0;', s)

        s = clean_expressions(s)
        # Replace static fields of this class with ClassName.fieldName
        for raw_fld in raw_static_fields:
            target_fld = f"f_{raw_fld}" if raw_fld in ALL_CLASH_FIELDS else raw_fld
            if raw_fld in CLASS_NAMES:
                s = re.sub(rf'(?<!new\s)(?<![\.\w]){raw_fld}\b(?!\.)(?!\s*\()', f'{class_name}.{target_fld}', s)
            else:
                s = re.sub(rf'(?<!new\s)(?<![\.\w]){raw_fld}\b(?!\s*\()', f'{class_name}.{target_fld}', s)

        out.append("    " + s + "\n")
        i += 1

    # Remove only trailing empty lines and exactly one closing brace for the class
    while out and out[-1].strip() == "":
        out.pop()
    if out and out[-1].strip() == "}":
        out.pop()

    # Add constructor dispatcher if multiple constructors
    if has_multiple_ctors:
        super_call = "super();\n        " if has_super else ""
        ctor_dispatch = f"""
    constructor(...args) {{
        {super_call}const len = args.length;
        const fn = this[`_init_${{len}}`];
        if (fn) {{
            fn.apply(this, args);
        }}
    }}
"""
        out.append(ctor_dispatch)

    # Add dispatchers for overloaded methods
    for name in sorted(overloaded_names):
        if (class_name, name) in CUSTOM_DISPATCHERS:
            out.append(CUSTOM_DISPATCHERS[(class_name, name)])
            continue

        dispatcher = f"""
    {name}(...args) {{
        const len = args.length;
        // Search available overload functions
        for (let idx = 0; idx < 12; idx++) {{
            const fn = this[`_{name}_${{idx}}`];
            if (fn && fn.length === len) {{
                return fn.apply(this, args);
            }}
        }}
        // Fallback to first overload if found
        if (this[`_{name}_0`]) return this[`_{name}_0`].apply(this, args);
    }}
"""
        out.append(dispatcher)

    out.append("}\n")
    return "".join(out)

print("Building complete engine with overload dispatchers...")
for c in CLASS_NAMES:
    code = transpile_class_full(c)
    out_path = os.path.join(OUTPUT_DIR, f"{c}.js")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(code)
    print(f"Built {c}.js")
