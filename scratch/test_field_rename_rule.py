import re

sample = """
this.k = 5;
this.k();
int x = this.k + 2;
if (this.k > 0) {
    this.l();
}
this.var_t_a.k = this.var_n_a.var_q_a.var_short_a;
this.var_t_a.m();
"""

clash_fields = {"k", "l", "m", "n", "o", "p"}

def rename_clash_fields(code, fields):
    for fld in fields:
        # Match fld NOT followed by '('
        # Also ensure not preceded by a word char or 'class '
        pattern = rf'(?<![a-zA-Z0-9_])\b{fld}\b(?!\s*\()'
        code = re.sub(pattern, f'f_{fld}', code)
    return code

res = rename_clash_fields(sample, clash_fields)
print("Result:")
print(res)

