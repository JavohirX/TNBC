import re

code = """
this.k = 5;
this.k();
int x = this.k + 2;
this.var_t_a.k = 10;
this.var_t_a.k();
this.var_r_a.d[0][0] = 1;
this.var_r_a.d(0, 0, 1);
for (int k = 0; k < 10; k++) {
    int y = k * 2;
}
"""

all_clash = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s"]

for fld in all_clash:
    # Match dot before, word boundary, NOT followed by '('
    code = re.sub(rf'(?<=\.){fld}\b(?!\s*\()', f'f_{fld}', code)

print(code)
