export class q extends i {
    var_k_b = new k();
    f_c = new k();
    f_d = new k();
    var_k_e = new k();
    var_k_f = new k();
    var_k_g = new k();
    var_k_h = new k();
    var_k_i = new k();
    var_k_j = new k();
    var_k_k = new k();
    var_k_l = new k();
    f_m = new k();
    f_n = new k();
    f_o = new k();
    f_p = new k();
    f_q = new k();
    var_k_r = new k();
    var_k_s = new k();
    var_k_t = new k();
    var_k_u = new k();
    var_h_b = new h();
    var_int_r = 0;
    var_boolean_e = false;
    var_boolean_f = false;
    var_boolean_g = false;
    var_boolean_h = false;
    var_boolean_i = false;
    var_boolean_j = false;
    var_int_s = 0;
    var_boolean_k = false;
    var_boolean_l = false;
    var_byte_arr_a = new Int8Array(600);
    var_int_t = 0;
    var_int_u = 0;
    f_v = 0;
    var_short_a = 0;
    
    constructor(n2, n3) {
        super();
    this.a(n2, n3, 8);
    }
    
    _a_0(n2, n3, n4) {
    if (!super.a(n2, n3, n4)) {
    return false;
    }
    this.f_o = 2;
    this.var_h_a.f_e = 2;
    this.var_h_a.f_d = 2;
    this.var_h_b.f_d = 1;
    this.var_h_b.f_e = 2;
    this.var_int_r = 0;
    this.var_boolean_e = false;
    this.var_boolean_f = false;
    this.var_boolean_h = false;
    this.var_boolean_g = false;
    this.var_boolean_i = false;
    this.var_boolean_j = false;
    this.var_int_s = 0;
    this.f_v = 0;
    this.var_int_u = 0;
    this.var_int_t = 0;
    this.var_boolean_k = false;
    this.var_boolean_l = false;
    return true;
    }
    
    _a_1() {
    this.var_k_b.a(0, 4, 4);
    this.f_c.a(4, 4, 4);
    this.f_d.a(8, 4, 4);
    this.var_k_e.a(12, 4, 4);
    this.var_k_f.a(16, 12, 1);
    this.var_k_g.a(28, 12, 1);
    this.var_k_h.a(40, 12, 1);
    this.var_k_i.a(52, 12, 1);
    this.var_k_j.a(64, 6, 4);
    this.var_k_k.a(70, 6, 4);
    this.var_k_l.a(76, 6, 4);
    this.f_m.a(82, 6, 4);
    this.var_k_r.a(62, 3, 3);
    this.var_k_s.a(65, 3, 3);
    this.var_k_t.a(68, 3, 3);
    this.var_k_u.a(71, 3, 3);
    this.f_n.a(88, 6, 3);
    this.f_o.a(107, 7, 4);
    this.f_p.a(114, 9, 4);
    this.f_q.a(127, 10, 4);
    this.var_h_a.f_c = this.f_d.f_a;
    }
    
    boolean_a(n2, n3) {
    super.boolean_a(n2, n3);
    this.f_k = (t.var_int_c * this.var_int_b - i.var_n_a.var_t_a.var_int_e + i.var_n_a.var_t_a.var_int_g) * 100;
    this.f_l = (t.var_int_c * this.var_int_d + i.var_n_a.var_t_a.var_int_f - t.var_int_c) * 100;
    this.void_a(this.f_k, this.f_l);
    return true;
    }
    
    g() {
    if (i.var_n_a.var_boolean_i && i.var_n_a.var_int_h >= this.var_h_a.f_a) {
    return;
    }
    if (!this.var_boolean_c) {
    this.var_boolean_c = true;
    if (this.var_int_d >= this.var_int_c) {
    if (this.var_int_c > 0) {
    i.var_n_a.var_r_a.void_a(this.var_int_a, this.var_int_c - 1);
    }
    } else if (this.var_int_d < this.var_int_c && this.var_int_c < r.var_int_b - 1) {
    i.var_n_a.var_r_a.void_a(this.var_int_a, this.var_int_c + 1);
    }
    i.var_n_a.var_r_a.void_a(this.var_int_a, this.var_int_c);
    i.var_n_a.var_r_a.void_a(this.var_int_b, this.var_int_d);
    if (this.f_e != 0) {
    i.var_n_a.var_r_a.void_a(this.var_int_a + 1, this.var_int_c);
    i.var_n_a.var_r_a.void_a(this.var_int_a + 1, this.var_int_c - 1);
    i.var_n_a.var_r_a.void_a(this.var_int_a - 1, this.var_int_c);
    i.var_n_a.var_r_a.void_a(this.var_int_a - 1, this.var_int_c - 1);
    if (this.var_boolean_f && !i.var_n_a.f_m && (this.f_o == 2 || this.f_o == 0)) {
    i.var_n_a.var_r_a.void_a(this.var_int_a - 1, this.var_int_c);
    i.var_n_a.var_r_a.void_a(this.var_int_a - 1, this.var_int_c - 1);
    }
    }
    i.var_n_a.var_r_a.void_a(this.var_int_b - 1, this.var_int_d);
    i.var_n_a.var_r_a.void_a(this.var_int_b - 1, this.var_int_d - 1);
    i.var_n_a.var_r_a.void_a(this.var_int_b + 1, this.var_int_d);
    i.var_n_a.var_r_a.void_a(this.var_int_b + 1, this.var_int_d - 1);
    if (this.var_int_d > 0) {
    i.var_n_a.var_r_a.void_a(this.var_int_b, this.var_int_d - 1);
    }
    }
    }
    
    _b_0() {
    this.var_char_a = 64;
    this.var_char_b = 13;
    this.var_char_c = 29;
    }
    
    _b_1(n2, n3) {
    if (super.b(n2, n3)) {
    this.var_short_a = (this.var_short_a + 1);
    return true;
    }
    return false;
    }
    
    l() {
    let n2 = 0;
    switch (this.f_o) {
    case 0: {
    n2 = this.var_k_r.f_a + this.var_int_u / this.var_k_r.f_c;
    if (n2 <= this.var_k_r.f_a + this.var_k_r.f_b - 1) break;
    n2 = this.var_k_r.f_a;
    this.var_int_u = 0;
    break;
    }
    case 1: {
    n2 = this.var_k_s.f_a + this.var_int_u / this.var_k_s.f_c;
    if (n2 <= this.var_k_s.f_a + this.var_k_s.f_b - 1) break;
    n2 = this.var_k_s.f_a;
    this.var_int_u = 0;
    break;
    }
    case 2: {
    n2 = this.var_k_t.f_a + this.var_int_u / this.var_k_t.f_c;
    if (n2 <= this.var_k_t.f_a + this.var_k_t.f_b - 1) break;
    n2 = this.var_k_t.f_a;
    this.var_int_u = 0;
    break;
    }
    case 3: {
    n2 = this.var_k_u.f_a + this.var_int_u / this.var_k_u.f_c;
    if (n2 <= this.var_k_u.f_a + this.var_k_u.f_b - 1) break;
    n2 = this.var_k_u.f_a;
    this.var_int_u = 0;
    }
    }
    this.var_h_b.f_c = n2;
    this.var_h_b.f_a = this.f_o == 3 ? this.var_h_a.f_a + t.var_int_c : this.var_h_a.f_a;
    this.var_h_b.f_b = this.var_h_a.f_b + t.var_int_c;
    }
    
    h() {
    if (this.var_boolean_j) {
    this.f_e = 5;
    this.j();
    this.var_h_a.f_c = this.f_d.f_a;
    }
    }
    
    c() {
    let c2 = 0;
    super.c();
    if (this.var_boolean_l) {
    c2 = this.var_byte_arr_a[this.var_int_t];
    ++this.var_int_t;
    } else {
    c2 = i.var_n_a.var_short_a;
    }
    if (this.f_e == 6) {
    i.var_n_a.var_r_a.d(this.var_int_b, this.var_int_d, 0);
    if (this.a(this.f_q)) {
    this.var_h_a.f_c = this.f_q.f_a + this.f_q.f_b - 1;
    i.var_n_a.var_boolean_k = true;
    i.var_n_a.var_boolean_j = true;
    return;
    }
    } else {
    if (this.f_e == 5) {
    this.g();
    return;
    }
    if (this.f_e == 3) {
    this.var_h_a.f_e = 2;
    i.var_n_a.var_r_a.void_a(this.var_int_b - 1, this.var_int_d - 1);
    i.var_n_a.var_r_a.void_a(this.var_int_b - 1, this.var_int_d);
    i.var_n_a.var_r_a.void_a(this.var_int_b - 1, this.var_int_d + 1);
    i.var_n_a.var_r_a.void_a(this.var_int_b, this.var_int_d - 1);
    i.var_n_a.var_r_a.void_a(this.var_int_b, this.var_int_d);
    i.var_n_a.var_r_a.void_a(this.var_int_b, this.var_int_d + 1);
    i.var_n_a.var_r_a.void_a(this.var_int_b + 1, this.var_int_d - 1);
    i.var_n_a.var_r_a.void_a(this.var_int_b + 1, this.var_int_d);
    i.var_n_a.var_r_a.void_a(this.var_int_b + 1, this.var_int_d + 1);
    if (this.var_boolean_i) {
    if (this.a(this.f_n)) {
    this.var_h_a.f_c = this.f_n.f_a + this.f_n.f_b - 1;
    i.var_n_a.var_boolean_j = true;
    return;
    }
    } else if (this.var_boolean_j) {
    if (this.a(this.f_p)) {
    this.var_h_a.f_c = this.f_p.f_a + this.f_p.f_b - 1;
    i.var_n_a.var_boolean_j = true;
    return;
    }
    } else if (this.a(this.f_o)) {
    this.var_h_a.f_c = this.f_o.f_a + this.f_o.f_b - 1;
    i.var_n_a.var_boolean_j = true;
    return;
    }
    return;
    }
    }
    if (this.var_boolean_f) {
    this.l();
    ++this.var_int_u;
    }
    if (this.var_boolean_g && ((c2 & 1) != 0 || (c2 & 2) != 0 || (c2 & 4) != 0 || (c2 & 8) != 0)) {
    this.var_boolean_g = false;
    }
    if (this.f_e == 0) {
    if (this.var_boolean_h) {
    if (!this.var_boolean_j) {
    this.f_e = 3;
    this.j();
    if (this.var_boolean_i) {
    this.var_h_a.f_c = this.f_n.f_a;
    return;
    }
    if (this.var_boolean_j) {
    this.var_h_a.f_c = this.f_d.f_a;
    return;
    }
    this.var_h_a.f_c = this.f_o.f_a;
    return;
    }
    if (this.var_int_s > 0) {
    this.h();
    } else {
    ++this.var_int_s;
    }
    }
    if ((i.var_n_a.var_r_a.f_e[this.var_int_b][this.var_int_d] & 0x20) != 0) {
    this.f_e = 6;
    this.var_h_a.f_c = this.f_q.f_a;
    i.var_n_a.var_t_a.f();
    if (!i.var_n_a.var_boolean_l) {
    i.var_n_a.var_t_a.var_a_a.void_a();
    }
    return;
    }
    if (this.var_boolean_a) {
    switch (this.f_o) {
    case 0: {
    if ((c2 & 1) != 0) break;
    this.var_boolean_a = false;
    break;
    }
    case 1: {
    if ((c2 & 2) != 0) break;
    this.var_boolean_a = false;
    break;
    }
    case 2: {
    if ((c2 & 4) != 0) break;
    this.var_boolean_a = false;
    break;
    }
    case 3: {
    if ((c2 & 8) != 0) break;
    this.var_boolean_a = false;
    }
    }
    if (!this.var_boolean_a) {
    this.var_boolean_b = true;
    }
    }
    if (this.f_v > 0) {
    --this.f_v;
    }
    if ((c2 & 0x20) != 0) {
    this.var_boolean_i = true;
    this.var_boolean_h = true;
    } else if ((c2 & 0x10) != 0) {
    if (this.var_int_r == 0) {
    this.var_int_r = 1;
    if (!i.var_n_a.f_m) {
    this.m();
    }
    }
    } else if ((c2 & 1) != 0) {
    if (this.f_o != 0) {
    this.j();
    this.f_v = 2;
    this.f_o = 0;
    }
    if (this.f_v <= 0 && !this.b(this.var_int_b, this.var_int_d - 1)) {
    this.f_o = 0;
    }
    } else if ((c2 & 4) != 0) {
    if (this.f_o != 2) {
    this.j();
    this.f_v = 2;
    this.f_o = 2;
    }
    if (this.f_v <= 0 && !this.b(this.var_int_b, this.var_int_d + 1)) {
    this.f_o = 2;
    }
    } else if ((c2 & 8) != 0) {
    if (this.f_o != 3) {
    this.j();
    this.f_v = 2;
    this.f_o = 3;
    }
    if (this.f_v <= 0 && !this.b(this.var_int_b - 1, this.var_int_d)) {
    this.f_o = 3;
    }
    } else if ((c2 & 2) != 0) {
    if (this.f_o != 1) {
    this.j();
    this.f_v = 2;
    this.f_o = 1;
    }
    if (this.f_v <= 0 && !this.b(this.var_int_b + 1, this.var_int_d)) {
    this.f_o = 1;
    }
    }
    if ((c2 & 0x10) == 0) {
    this.var_int_r = 0;
    }
    }
    if (this.f_e == 4) {
    if (this.var_boolean_h && !this.var_boolean_j) {
    this.f_e = 3;
    this.j();
    if (this.var_boolean_i) {
    this.var_h_a.f_c = this.f_n.f_a;
    return;
    }
    if (this.var_boolean_j) {
    this.var_h_a.f_c = this.f_d.f_a;
    return;
    }
    this.var_h_a.f_c = this.f_o.f_a;
    return;
    }
    if ((c2 & 0x20) != 0) {
    this.var_boolean_i = true;
    this.var_boolean_h = true;
    } else if ((c2 & 1) != 0) {
    this.f_o = 0;
    } else if ((c2 & 4) != 0) {
    this.f_o = 2;
    } else if ((c2 & 8) != 0) {
    this.f_o = 3;
    } else if ((c2 & 2) != 0) {
    this.f_o = 1;
    } else if ((c2 & 0x10) != 0 && this.var_int_r == 0) {
    this.var_int_r = 1;
    if (!i.var_n_a.f_m) {
    this.m();
    }
    }
    if (this.var_boolean_e) {
    if (i.var_n_a.var_r_a.int_b(this.var_int_a, this.var_int_c) == 256 && (this.var_h_a.f_b - i.var_n_a.var_t_a.var_int_f - this.f_n) % t.var_int_c == 0) {
    if (!i.var_n_a.f_m) {
    this.m();
    }
    this.var_boolean_e = false;
    } else if (i.var_n_a.var_r_a.int_b(this.var_int_a, this.var_int_c) == 512 && (this.var_h_a.f_a + this.f_n + i.var_n_a.var_t_a.var_int_g) % t.var_int_c == 0) {
    if (!i.var_n_a.f_m) {
    this.m();
    }
    this.var_boolean_e = false;
    } else if (i.var_n_a.var_r_a.int_b(this.var_int_a, this.var_int_c) == 1024 && (this.var_h_a.f_b - i.var_n_a.var_t_a.var_int_f + this.f_n) % t.var_int_c == 0) {
    if (!i.var_n_a.f_m) {
    this.m();
    }
    this.var_boolean_e = false;
    } else if (i.var_n_a.var_r_a.int_b(this.var_int_a, this.var_int_c) == 2048 && (this.var_h_a.f_a - this.f_n + i.var_n_a.var_t_a.var_int_g) % t.var_int_c == 0) {
    if (!i.var_n_a.f_m) {
    this.m();
    }
    this.var_boolean_e = false;
    }
    }
    if ((c2 & 0x10) == 0) {
    this.var_int_r = 0;
    }
    }
    if (this.var_boolean_a) {
    switch (this.f_o) {
    case 0: {
    this.a(this.var_k_j);
    break;
    }
    case 1: {
    this.a(this.var_k_k);
    break;
    }
    case 2: {
    this.a(this.var_k_l);
    break;
    }
    case 3: {
    this.a(this.f_m);
    }
    }
    } else if (this.f_e == 1) {
    switch (this.f_o) {
    case 0: {
    this.a(this.var_k_f);
    break;
    }
    case 1: {
    this.a(this.var_k_g);
    break;
    }
    case 2: {
    this.a(this.var_k_h);
    break;
    }
    case 3: {
    this.a(this.var_k_i);
    }
    }
    }
    if (this.f_e == 0 || this.f_e == 4) {
    switch (this.f_o) {
    case 0: {
    if (this.var_boolean_g) {
    this.var_h_a.f_c = 100;
    break;
    }
    this.a(this.var_k_b);
    break;
    }
    case 1: {
    if (this.var_boolean_g) {
    this.var_h_a.f_c = 101;
    break;
    }
    this.a(this.f_c);
    break;
    }
    case 2: {
    if (this.var_boolean_g) {
    this.var_h_a.f_c = 102;
    break;
    }
    this.a(this.f_d);
    break;
    }
    case 3: {
    if (this.var_boolean_g) {
    this.var_h_a.f_c = 103;
    break;
    }
    this.a(this.var_k_e);
    }
    }
    this.g();
    }
    if (this.var_boolean_k) {
    this.var_byte_arr_a[this.var_int_t] = c2;
    ++this.var_int_t;
    }
    }
    
    m() {
    let n2 = Math.abs(this.var_h_a.f_a - this.var_int_b * t.var_int_c + i.var_n_a.var_t_a.var_int_g) <= Math.abs(this.var_h_a.f_a - this.var_int_a * t.var_int_c + i.var_n_a.var_t_a.var_int_g) ? this.var_int_b : this.var_int_a;
    let n3 = Math.abs(this.var_h_a.f_b + t.var_int_c - this.var_int_d * t.var_int_c - i.var_n_a.var_t_a.var_int_f) <= Math.abs(this.var_h_a.f_b + t.var_int_c - this.var_int_c * t.var_int_c - i.var_n_a.var_t_a.var_int_f) ? this.var_int_d : this.var_int_c;
    switch (this.f_o) {
    case 0: {
    --n3;
    break;
    }
    case 1: {
    ++n2;
    break;
    }
    case 2: {
    ++n3;
    break;
    }
    case 3: {
    --n2;
    }
    }
    if (n2 < 0 || n2 > r.var_int_a - 1 || n3 < 0 || n3 > r.var_int_b - 1) {
    return;
    }
    if (n2 == this.var_int_b && n3 == this.var_int_d) {
    switch (this.f_o) {
    case 0: {
    --n3;
    break;
    }
    case 1: {
    ++n2;
    break;
    }
    case 2: {
    ++n3;
    break;
    }
    case 3: {
    --n2;
    }
    }
    }
    if (n2 < 0 || n2 > r.var_int_a - 1 || n3 < 0 || n3 > r.var_int_b - 1) {
    return;
    }
    if (!this.var_boolean_f) {
    i.var_n_a.var_g_a.i_a(new i(n2, n3, 9, this.f_o));
    i.var_n_a.f_m = true;
    return;
    }
    i.var_n_a.var_g_a.i_a(new i(n2, n3, 10, this.f_o));
    i.var_n_a.f_m = true;
    this.var_boolean_g = true;
    }
    
    k() {
    if (i.var_n_a.var_r_a.int_b(i.var_n_a.var_q_a.var_int_b, i.var_n_a.var_q_a.var_int_d) == 32) {
    return;
    }
    this.var_boolean_h = true;
    }

    a(...args) {
        const len = args.length;
        // Search available overload functions
        for (let idx = 0; idx < 12; idx++) {
            const fn = this[`_a_${idx}`];
            if (fn && fn.length === len) {
                return fn.apply(this, args);
            }
        }
        // Fallback to first overload if found
        if (this[`_a_0`]) return this[`_a_0`].apply(this, args);
    }

    b(...args) {
        const len = args.length;
        // Search available overload functions
        for (let idx = 0; idx < 12; idx++) {
            const fn = this[`_b_${idx}`];
            if (fn && fn.length === len) {
                return fn.apply(this, args);
            }
        }
        // Fallback to first overload if found
        if (this[`_b_0`]) return this[`_b_0`].apply(this, args);
    }
}
