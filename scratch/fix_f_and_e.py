# Fix f.js
with open('engine/classes/f.js', 'r', encoding='utf-8') as f:
    f_content = f.read()

target_f = """    if (n7 < string.length) {
    if (string.charCodeAt(n7) == '|') {
    bl = true;
    }
    if (string.charCodeAt(n7) == ' ') {
    n6 = n7;
    }
    n8 += e.a(n3, string.charCodeAt(n7)) + e.var_byte_arr_b[n3];
    }"""

repl_f = """    if (n7 < string.length) {
    let code = string.charCodeAt(n7);
    if (code === 124) {
    bl = true;
    }
    if (code === 32) {
    n6 = n7;
    }
    n8 += e.a(n3, code) + e.var_byte_arr_b[n3];
    }"""

if target_f.replace('\n', '\r\n') in f_content:
    f_content = f_content.replace(target_f.replace('\n', '\r\n'), repl_f.replace('\n', '\r\n'))
    print("Found CRLF in f.js and replaced!")
elif target_f in f_content:
    f_content = f_content.replace(target_f, repl_f)
    print("Found LF in f.js and replaced!")
else:
    print("Target NOT found in f.js!")

with open('engine/classes/f.js', 'w', encoding='utf-8') as f:
    f.write(f_content)

# Fix e.js
with open('engine/classes/e.js', 'r', encoding='utf-8') as f:
    e_content = f.read()

target_e1 = "e.var_int_d != 97 && c2 >= 'a' && c2 <= 'z'"
repl_e1 = "e.var_int_d != 97 && c2 >= 97 && c2 <= 122"

target_e2 = "if (c2 == ' ' || c2 == 160) {"
repl_e2 = "if (c2 == 32 || c2 == 160) {"

if target_e1 in e_content:
    e_content = e_content.replace(target_e1, repl_e1)
    print("Replaced target_e1 in e.js")
else:
    print("target_e1 not found in e.js")

if target_e2 in e_content:
    e_content = e_content.replace(target_e2, repl_e2)
    print("Replaced target_e2 in e.js")
else:
    print("target_e2 not found in e.js")

with open('engine/classes/e.js', 'w', encoding='utf-8') as f:
    f.write(e_content)

print("Done fixing f.js and e.js!")

