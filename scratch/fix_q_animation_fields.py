with open('engine/classes/q.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Field definitions
text = text.replace('f_c = new k();', 'var_k_c = new k();')
text = text.replace('f_d = new k();', 'var_k_d = new k();')
text = text.replace('f_m = new k();', 'var_k_m = new k();')
text = text.replace('f_n = new k();', 'var_k_n = new k();')
text = text.replace('f_o = new k();', 'var_k_o = new k();')
text = text.replace('f_p = new k();', 'var_k_p = new k();')
text = text.replace('f_q = new k();', 'var_k_q = new k();')

# 2. c, d, m
text = text.replace('this.f_c', 'this.var_k_c')
text = text.replace('this.f_d', 'this.var_k_d')
text = text.replace('this.f_m', 'this.var_k_m')

# 3. n
text = text.replace('this.f_n.a(', 'this.var_k_n.a(')
text = text.replace('this.f_n.f_a', 'this.var_k_n.f_a')
text = text.replace('this.f_n.f_b', 'this.var_k_n.f_b')
text = text.replace('this.a(this.f_n)', 'this.a(this.var_k_n)')

# 4. o
text = text.replace('this.f_o.a(', 'this.var_k_o.a(')
text = text.replace('this.f_o.f_a', 'this.var_k_o.f_a')
text = text.replace('this.f_o.f_b', 'this.var_k_o.f_b')
text = text.replace('this.a(this.f_o)', 'this.a(this.var_k_o)')

# 5. p
text = text.replace('this.f_p.a(', 'this.var_k_p.a(')
text = text.replace('this.f_p.f_a', 'this.var_k_p.f_a')
text = text.replace('this.f_p.f_b', 'this.var_k_p.f_b')
text = text.replace('this.a(this.f_p)', 'this.a(this.var_k_p)')

# 6. q
text = text.replace('this.f_q.a(', 'this.var_k_q.a(')
text = text.replace('this.f_q.f_a', 'this.var_k_q.f_a')
text = text.replace('this.f_q.f_b', 'this.var_k_q.f_b')
text = text.replace('this.a(this.f_q)', 'this.a(this.var_k_q)')

with open('engine/classes/q.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated q.js animation fields successfully!")

