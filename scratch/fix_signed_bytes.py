import re

# 1. Fix RecordStore.js
with open('engine/lcd/RecordStore.js', 'r', encoding='utf-8') as f:
    rs = f.read()

rs_target = """    getRecord(id) {
        const rec = this.records[id];
        if (!rec) return null;
        return rec.slice(0); // return copy
    }"""
rs_repl = """    getRecord(id) {
        const rec = this.records[id];
        if (!rec) return null;
        return new Int8Array(rec.buffer, rec.byteOffset, rec.byteLength);
    }"""
rs = rs.replace(rs_target.replace('\n', '\r\n'), rs_repl.replace('\n', '\r\n'))
rs = rs.replace(rs_target, rs_repl)

with open('engine/lcd/RecordStore.js', 'w', encoding='utf-8') as f:
    f.write(rs)
print("Updated RecordStore.js")

# 2. Fix t.js
with open('engine/classes/t.js', 'r', encoding='utf-8') as f:
    tjs = f.read()

t_target_q = """t.var_byte_a = !t.var_boolean_f ? byArray[byArray.length - 3] : -1;"""
t_repl_q = """t.var_byte_a = !t.var_boolean_f ? ((byArray[byArray.length - 3] << 24) >> 24) : -1;"""
tjs = tjs.replace(t_target_q, t_repl_q)

t_target_x = """    static x() {
    try {
    let by = t.var_byte_a;
    if (t.var_byte_a == -1) {
    by = 0;
    }
    let string = "/sp__" + t.var_java_lang_String_arr_a[by];"""
t_repl_x = """    static x() {
    try {
    let by = t.var_byte_a;
    if (by === undefined || by == -1 || !t.var_java_lang_String_arr_a || by >= t.var_java_lang_String_arr_a.length) {
    by = 0;
    }
    if (!t.var_java_lang_String_arr_a || !t.var_java_lang_String_arr_a.length) {
    t.var_java_lang_String_arr_a = ["ru", "de", "fr", "it"];
    }
    let lang = t.var_java_lang_String_arr_a[by] || "ru";
    let string = "/sp__" + lang;"""
tjs = tjs.replace(t_target_x.replace('\n', '\r\n'), t_repl_x.replace('\n', '\r\n'))
tjs = tjs.replace(t_target_x, t_repl_x)

with open('engine/classes/t.js', 'w', encoding='utf-8') as f:
    f.write(tjs)
print("Updated t.js")

# 3. Fix e.js
with open('engine/classes/e.js', 'r', encoding='utf-8') as f:
    ejs = f.read()

e_target = """    static _a_0() {
    let string = 0;
    let string2 = 0;
    let by = t.var_byte_a;
    if (by == -1) {
    by = 0;
    }
    if ((string2 = t.var_java_lang_String_arr_a[by].toLowerCase()).equals("el")) {"""
e_repl = """    static _a_0() {
    let string = 0;
    let string2 = 0;
    let by = t.var_byte_a;
    if (by === undefined || by == -1 || !t.var_java_lang_String_arr_a || by >= t.var_java_lang_String_arr_a.length) {
    by = 0;
    }
    if (!t.var_java_lang_String_arr_a || !t.var_java_lang_String_arr_a.length) {
    t.var_java_lang_String_arr_a = ["ru", "de", "fr", "it"];
    }
    let lang = t.var_java_lang_String_arr_a[by] || "ru";
    if ((string2 = lang.toLowerCase()).equals("el")) {"""
ejs = ejs.replace(e_target.replace('\n', '\r\n'), e_repl.replace('\n', '\r\n'))
ejs = ejs.replace(e_target, e_repl)

with open('engine/classes/e.js', 'w', encoding='utf-8') as f:
    f.write(ejs)
print("Updated e.js")

