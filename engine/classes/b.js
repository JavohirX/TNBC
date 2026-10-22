export class b extends i {
    f_r = 0;
    var_boolean_e = false;
    f_b = new k();
    f_c = new k();
    f_d = new k();
    var_k_e = new k();
    f_f = new k();
    f_g = new k();
    
    constructor(n2, n3, n4) {
        super();
    this.f_q = n4;
    if (this.f_q == 11) {
    this.a(n2, n3, 0);
    return;
    }
    this.a(n2, n3, 24);
    }
    
    _a_0(n2, n3, n4) {
    if (!super.a(n2, n3, n4)) {
    return false;
    }
    this.f_o = 2;
    this.f_m /= 2;
    this.f_r = 0;
    this.var_h_a.f_e = 1;
    this.var_h_a.f_d = 1;
    this.var_boolean_e = false;
    return true;
    }
    
    _a_1() {
    if (this.f_q == 11) {
    this.f_b.a(0, 4, 3);
    this.f_c.a(8, 4, 2);
    this.f_d.a(12, 4, 2);
    this.var_k_e.a(16, 4, 2);
    this.f_f.a(20, 4, 2);
    this.f_g.a(4, 4, 3);
    } else {
    this.f_b.a(24, 4, 3);
    this.f_c.a(28, 4, 1);
    this.f_d.a(32, 4, 1);
    this.var_k_e.a(36, 4, 1);
    this.f_f.a(40, 4, 1);
    this.f_g.a(44, 6, 4);
    }
    this.var_h_a.f_c = this.f_b.f_a;
    }
    
    b() {
    this.var_char_a = this.f_q == 11 ? (this.var_char_a | 0x16) : (this.var_char_a | 0x14);
    this.var_char_b = 64;
    this.var_char_c = 31;
    }
    
    c() {
    super.c();
    let bl = false;
    if (this.f_e == 3) {
    if (this.a(this.f_g)) {
    this.var_boolean_d = true;
    return;
    }
    return;
    }
    if (this.f_e == 0) {
    if (this.f_q == 11) {
    if (this.f_r != 0) {
    if (!this.var_boolean_e && this.a(this.f_g)) {
    this.var_boolean_e = true;
    this.var_h_a.f_c = this.f_g.f_a + this.f_g.f_b - 1;
    }
    if (90 <= this.f_r++) {
    this.j();
    this.a(this.f_b);
    this.f_r = 0;
    this.var_boolean_e = false;
    }
    return;
    }
    } else if ((0x40 & i.var_n_a.var_r_a.int_b(this.var_int_b, this.var_int_d)) != 0) {
    this.f_e = 3;
    this.var_char_a = (this.var_char_a & 0xFFFFFFFB);
    this.j();
    this.var_h_a.f_c = this.f_g.f_a;
    return;
    }
    if (this.var_int_d != i.var_n_a.var_q_a.var_int_d) {
    if (this.var_int_d < i.var_n_a.var_q_a.var_int_d) {
    bl = this.b(this.var_int_b, this.var_int_d + 1);
    if (this.f_o != 2 && bl) {
    this.j();
    }
    } else {
    bl = this.b(this.var_int_b, this.var_int_d - 1);
    if (this.f_o != 0 && bl) {
    this.j();
    }
    }
    }
    if (!bl && this.var_int_b != i.var_n_a.var_q_a.var_int_b) {
    if (this.var_int_b < i.var_n_a.var_q_a.var_int_b) {
    bl = this.b(this.var_int_b + 1, this.var_int_d);
    if (this.f_o != 1 && bl) {
    this.j();
    }
    } else {
    bl = this.b(this.var_int_b - 1, this.var_int_d);
    if (this.f_o != 3 && bl) {
    this.j();
    }
    }
    }
    }
    if (this.f_e == 1) {
    switch (this.f_o) {
    case 0: {
    this.a(this.f_c);
    break;
    }
    case 1: {
    this.a(this.f_d);
    break;
    }
    case 2: {
    this.a(this.var_k_e);
    break;
    }
    case 3: {
    this.a(this.f_f);
    }
    }
    }
    if (this.f_e == 0) {
    this.a(this.f_b);
    }
    }
    
    d() {
    if (i.var_n_a.var_r_a.int_b(i.var_n_a.var_q_a.var_int_b, i.var_n_a.var_q_a.var_int_d) == 32) {
    return;
    }
    if (this.f_r == 0) {
    i.var_n_a.var_q_a.var_boolean_h = true;
    }
    }
    
    e() {
    this.f_r = 1;
    this.j();
    }

    a(...args) {
        if (args.length === 0) return this._a_1();
        if (args.length === 3) return this._a_0(...args);
        return super.a(...args);
    }
}
