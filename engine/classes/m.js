export class m extends i {
    var_k_b = new k();
    f_e = false;
    var_h_b = new h();
    f_c = new h();
    
    constructor(n2, n3, n4) {
        super();
    this.f_o = n4;
    this.f_e = false;
    let n5 = 0;
    switch (this.f_o) {
    case 0: {
    n5 = 108;
    break;
    }
    case 1: {
    n5 = 112;
    break;
    }
    case 2: {
    n5 = 116;
    break;
    }
    case 3: {
    n5 = 120;
    }
    }
    this.a(n2, n3, n5);
    }
    
    _b_0() {
    this.var_char_a = 16;
    this.var_char_b = 0;
    this.var_char_c = 0;
    }

    b(...args) {
        if (args.length === 0) return this._b_0();
        return super.b(...args);
    }
    
    _a_0() {
    switch (this.f_o) {
    case 0: {
    this.var_k_b.a(108, 3, 3);
    this.var_h_b.f_c = 255;
    this.f_c.f_c = 267;
    this.f_c.f_b = this.var_h_a.f_b + t.var_int_c;
    this.f_c.f_a = this.var_h_a.f_a;
    break;
    }
    case 1: {
    this.var_k_b.a(112, 3, 3);
    this.var_h_b.f_c = 256;
    this.f_c.f_c = 268;
    this.f_c.f_b = this.var_h_a.f_b;
    this.f_c.f_a = this.var_h_a.f_a - t.var_int_c;
    break;
    }
    case 2: {
    this.var_k_b.a(116, 3, 3);
    this.var_h_b.f_c = 257;
    this.f_c.f_c = 269;
    this.f_c.f_b = this.var_h_a.f_b - t.var_int_c;
    this.f_c.f_a = this.var_h_a.f_a;
    break;
    }
    case 3: {
    this.var_k_b.a(120, 3, 3);
    this.var_h_b.f_c = 258;
    this.f_c.f_c = 270;
    this.f_c.f_b = this.var_h_a.f_b;
    this.f_c.f_a = this.var_h_a.f_a + t.var_int_c;
    }
    }
    this.var_h_b.f_a = this.var_h_a.f_a;
    this.var_h_b.f_b = this.var_h_a.f_b;
    }
    
    l() {
    let i2 = null;
    switch (this.f_o) {
    case 0: {
    let n2 = 0;
    if (i.var_n_a.var_q_a.var_int_d >= this.var_int_d || i.var_n_a.var_q_a.var_int_b != this.var_int_b) break;
    for (n2 = this.var_int_d - 1; n2 > i.var_n_a.var_q_a.var_int_d; --n2) {
    if ((0x39 & i.var_n_a.var_r_a.int_b(this.var_int_b, n2)) == 0) continue;
    return;
    }
    for (n2 = this.var_int_d - 1; n2 > i.var_n_a.var_q_a.var_int_d; --n2) {
    i2 = i.var_n_a.var_r_a.i_a(this.var_int_b, n2);
    if (i2 == null) continue;
    if (i2.f_q == 11 || i2.f_q == 12) {
    if (i2.f_e == 1 && i2.var_int_a != i2.var_int_b) continue;
    return;
    }
    return;
    }
    i.var_n_a.var_q_a.var_boolean_h = true;
    i.var_n_a.var_q_a.var_boolean_j = true;
    this.var_h_a.f_c = 111;
    this.f_e = true;
    return;
    }
    case 1: {
    let n3 = 0;
    if (this.var_int_b >= i.var_n_a.var_q_a.var_int_b || i.var_n_a.var_q_a.var_int_d != this.var_int_d) break;
    for (n3 = this.var_int_b + 1; n3 < i.var_n_a.var_q_a.var_int_b; ++n3) {
    if ((0x39 & i.var_n_a.var_r_a.int_b(n3, this.var_int_d)) == 0) continue;
    return;
    }
    for (n3 = this.var_int_b + 1; n3 < i.var_n_a.var_q_a.var_int_b; ++n3) {
    i2 = i.var_n_a.var_r_a.i_a(n3, this.var_int_d);
    if (i2 == null) continue;
    if (i2.f_q == 11 || i2.f_q == 12) {
    if (i2.f_e == 1 && i2.var_int_c != i2.var_int_d) continue;
    return;
    }
    return;
    }
    i.var_n_a.var_q_a.var_boolean_h = true;
    i.var_n_a.var_q_a.var_boolean_j = true;
    this.var_h_a.f_c = 115;
    this.f_e = true;
    return;
    }
    case 2: {
    let n4 = 0;
    if (this.var_int_d >= i.var_n_a.var_q_a.var_int_d || i.var_n_a.var_q_a.var_int_b != this.var_int_b) break;
    for (n4 = this.var_int_d + 1; n4 < i.var_n_a.var_q_a.var_int_d; ++n4) {
    if ((0x39 & i.var_n_a.var_r_a.int_b(this.var_int_b, n4)) == 0) continue;
    return;
    }
    for (n4 = this.var_int_d + 1; n4 < i.var_n_a.var_q_a.var_int_d; ++n4) {
    i2 = i.var_n_a.var_r_a.i_a(this.var_int_b, n4);
    if (i2 == null) continue;
    if (i2.f_q == 11 || i2.f_q == 12) {
    if (i2.f_e == 1 && i2.var_int_a != i2.var_int_b) continue;
    return;
    }
    return;
    }
    i.var_n_a.var_q_a.var_boolean_h = true;
    i.var_n_a.var_q_a.var_boolean_j = true;
    this.var_h_a.f_c = 119;
    this.f_e = true;
    return;
    }
    case 3: {
    let n5 = 0;
    if (i.var_n_a.var_q_a.var_int_b >= this.var_int_b || i.var_n_a.var_q_a.var_int_d != this.var_int_d) break;
    for (n5 = this.var_int_b - 1; n5 > i.var_n_a.var_q_a.var_int_b; --n5) {
    if ((0x39 & i.var_n_a.var_r_a.int_b(n5, this.var_int_d)) == 0) continue;
    return;
    }
    for (n5 = this.var_int_b - 1; n5 > i.var_n_a.var_q_a.var_int_b; --n5) {
    i2 = i.var_n_a.var_r_a.i_a(n5, this.var_int_d);
    if (i2 == null) continue;
    if (i2.f_q == 11 || i2.f_q == 12) {
    if (i2.f_e == 1 && i2.var_int_c != i2.var_int_d) continue;
    return;
    }
    return;
    }
    i.var_n_a.var_q_a.var_boolean_h = true;
    i.var_n_a.var_q_a.var_boolean_j = true;
    this.var_h_a.f_c = 123;
    this.f_e = true;
    }
    }
    }
    
    c() {
    this.l();
    if (!this.f_e) {
    this.a(this.var_k_b);
    }
    if (this.f_e && i.var_n_a.var_q_a.f_e == 5 && !i.var_n_a.var_boolean_j) {
    this.g();
    let bl = true;
    switch (this.f_o) {
    case 0: {
    if (this.var_h_b.f_b > i.var_n_a.var_q_a.var_h_a.f_b + t.var_int_c) {
    this.var_h_b.f_b -= t.var_int_c;
    this.f_c.f_b -= t.var_int_c;
    } else {
    bl = false;
    }
    let n2 = this.var_int_b;
    for (let i2 = this.var_int_d; i2 >= 0; --i2) {
    i.var_n_a.var_r_a.void_a(n2, i2);
    }
    break;
    }
    case 1: {
    if (this.var_h_b.f_a < i.var_n_a.var_q_a.var_h_a.f_a) {
    this.var_h_b.f_a += t.var_int_c;
    this.f_c.f_a += t.var_int_c;
    } else {
    bl = false;
    }
    let n3 = this.var_int_d;
    for (let i3 = this.var_int_b; i3 < r.var_int_a; ++i3) {
    i.var_n_a.var_r_a.void_a(i3, n3);
    }
    break;
    }
    case 2: {
    if (this.var_h_b.f_b < i.var_n_a.var_q_a.var_h_a.f_b - t.var_int_c) {
    this.var_h_b.f_b += t.var_int_c;
    this.f_c.f_b += t.var_int_c;
    } else {
    bl = false;
    }
    let n4 = this.var_int_b;
    for (let i4 = this.var_int_d; i4 < r.var_int_b; ++i4) {
    i.var_n_a.var_r_a.void_a(n4, i4);
    }
    break;
    }
    case 3: {
    if (this.var_h_b.f_a > i.var_n_a.var_q_a.var_h_a.f_a + t.var_int_c) {
    this.var_h_b.f_a -= t.var_int_c;
    this.f_c.f_a -= t.var_int_c;
    } else {
    bl = false;
    }
    let n5 = this.var_int_d;
    for (let i5 = this.var_int_b; i5 >= 0; --i5) {
    i.var_n_a.var_r_a.void_a(i5, n5);
    }
    break;
    }
    }
    if (bl) {
    i.var_n_a.a(this.var_h_b, 2);
    i.var_n_a.a(this.f_c, 2);
    return;
    }
    i.var_n_a.var_q_a.f_e = 3;
    }
    }
    a(...args) {
        if (args.length === 0) return this._a_0();
        return super.a(...args);
    }
}