with open('engine/classes/g.js', 'r', encoding='utf-8') as f:
    s = f.read()

target = """    boolean_a() {
    if (this.var_int_b < this.var_int_a - 1 && this.var_int_b > -1) {
    ++this.var_int_b;
    this.var_i_a = this.var_i_a.var_i_b;
    return true;
    }
    if (this.var_int_b == -1) {
    ++this.var_int_b;
    this.var_i_a = this.var_i_b;
    return true;
    }
    return false;
    }"""

repl = """    boolean_a() {
    if (this.var_int_b < this.var_int_a - 1 && this.var_int_b > -1) {
    ++this.var_int_b;
    this.var_i_a = this.var_i_a ? this.var_i_a.var_i_b : null;
    return this.var_i_a != null;
    }
    if (this.var_int_b == -1 && this.var_int_a > 0) {
    ++this.var_int_b;
    this.var_i_a = this.var_i_b;
    return this.var_i_a != null;
    }
    return false;
    }"""

if target.replace('\n', '\r\n') in s:
    s = s.replace(target.replace('\n', '\r\n'), repl.replace('\n', '\r\n'))
    print("Replaced CRLF in g.js")
elif target in s:
    s = s.replace(target, repl)
    print("Replaced LF in g.js")
else:
    print("Target not found in g.js!")

with open('engine/classes/g.js', 'w', encoding='utf-8') as f:
    f.write(s)

