with open('engine/classes/t.js', 'r', encoding='utf-8') as f:
    s = f.read()

target = """    if (n2 == -1) {
    n2 = 0;
    t.var_byte_a = -1;
    } else {
    t.var_byte_a = n2;
    }
    let string = "/text__" + t.var_java_lang_String_arr_a[n2] + ".txt";"""

repl = """    if (n2 === undefined || n2 === null || isNaN(n2) || n2 < 0) {
    n2 = 0;
    t.var_byte_a = -1;
    } else {
    t.var_byte_a = n2;
    }
    if (!t.var_java_lang_String_arr_a || !t.var_java_lang_String_arr_a.length) {
    t.var_java_lang_String_arr_a = ["ru", "de", "fr", "it"];
    }
    if (n2 >= t.var_java_lang_String_arr_a.length) {
    n2 = 0;
    }
    let lang = t.var_java_lang_String_arr_a[n2] || "ru";
    let string = "/text__" + lang + ".txt";"""

target_crlf = target.replace('\n', '\r\n')
repl_crlf = repl.replace('\n', '\r\n')

if target_crlf in s:
    s = s.replace(target_crlf, repl_crlf)
    print("Found CRLF target and replaced!")
elif target in s:
    s = s.replace(target, repl)
    print("Found LF target and replaced!")
else:
    print("Target NOT found!")
    exit(1)

with open('engine/classes/t.js', 'w', encoding='utf-8') as f:
    f.write(s)
print("Updated engine/classes/t.js successfully!")
