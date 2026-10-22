# 1. Fix n.js
with open('engine/classes/n.js', 'r', encoding='utf-8') as f:
    n_code = f.read()

n_code = n_code.replace('let n5 = i3 / r.var_int_a;', 'let n5 = Math.floor(i3 / r.var_int_a);')
n_code = n_code.replace('if (this.var_int_j / 25 == 0) {', 'if (Math.floor(this.var_int_j / 25) == 0) {')
n_code = n_code.replace('} else if (this.var_int_j / 25 == 1) {', '} else if (Math.floor(this.var_int_j / 25) == 1) {')
n_code = n_code.replace('if ((this.var_short_a & 0x40) != 0) {', 'if ((this.var_short_a & 0x50) != 0) {')

with open('engine/classes/n.js', 'w', encoding='utf-8') as f:
    f.write(n_code)
print("Updated n.js")

# 2. Fix q.js
with open('engine/classes/q.js', 'r', encoding='utf-8') as f:
    q_code = f.read()

q_code = q_code.replace('this.var_k_r.f_a + this.var_int_u / this.var_k_r.f_c', 'this.var_k_r.f_a + Math.floor(this.var_int_u / this.var_k_r.f_c)')
q_code = q_code.replace('this.var_k_s.f_a + this.var_int_u / this.var_k_s.f_c', 'this.var_k_s.f_a + Math.floor(this.var_int_u / this.var_k_s.f_c)')
q_code = q_code.replace('this.var_k_t.f_a + this.var_int_u / this.var_k_t.f_c', 'this.var_k_t.f_a + Math.floor(this.var_int_u / this.var_k_t.f_c)')
q_code = q_code.replace('this.var_k_u.f_a + this.var_int_u / this.var_k_u.f_c', 'this.var_k_u.f_a + Math.floor(this.var_int_u / this.var_k_u.f_c)')

with open('engine/classes/q.js', 'w', encoding='utf-8') as f:
    f.write(q_code)
print("Updated q.js")

# 3. Fix i.js
with open('engine/classes/i.js', 'r', encoding='utf-8') as f:
    i_code = f.read()

i_code = i_code.replace('this.f_g = t.var_int_c * 100 / this.f_n;', 'this.f_g = Math.floor(t.var_int_c * 100 / this.f_n);')
i_code = i_code.replace('this.f_g = t.var_int_c * 100 / this.f_m;', 'this.f_g = Math.floor(t.var_int_c * 100 / this.f_m);')
i_code = i_code.replace('this.var_h_a.f_a = n2 / 100;', 'this.var_h_a.f_a = Math.floor(n2 / 100);')
i_code = i_code.replace('this.var_h_a.f_b = n3 / 100;', 'this.var_h_a.f_b = Math.floor(n3 / 100);')
i_code = i_code.replace('let n2 = k2.f_a + this.f_p / k2.f_c;', 'let n2 = k2.f_a + Math.floor(this.f_p / k2.f_c);')

with open('engine/classes/i.js', 'w', encoding='utf-8') as f:
    f.write(i_code)
print("Updated i.js")

# 4. Fix t.js
with open('engine/classes/t.js', 'r', encoding='utf-8') as f:
    t_code = f.read()

t_code = t_code.replace('t.f_o = n3 / 12;', 't.f_o = Math.floor(n3 / 12);')

with open('engine/classes/t.js', 'w', encoding='utf-8') as f:
    f.write(t_code)
print("Updated t.js")

# 5. Fix a.js
with open('engine/classes/a.js', 'r', encoding='utf-8') as f:
    a_code = f.read()

a_code = a_code.replace('let n3 = n2 / 60;', 'let n3 = Math.floor(n2 / 60);')

with open('engine/classes/a.js', 'w', encoding='utf-8') as f:
    f.write(a_code)
print("Updated a.js")

