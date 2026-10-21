export class i extends l {
    static var_n_a = null;
    var_h_a = new h();
    var_k_a = new k();
    var_int_a = 0;
    var_int_b = 0;
    var_int_c = 0;
    var_int_d = 0;
    f_e = 0;
    f_f = 0;
    f_g = 0;
    f_h = 0;
    f_i = 0;
    f_j = 0;
    f_k = 0;
    f_l = 0;
    f_m = 0;
    f_n = 0;
    f_o = 0;
    var_boolean_a = false;
    var_boolean_b = false;
    f_p = 0;
    var_char_a = 0;
    var_char_b = 0;
    var_char_c = 0;
    var_boolean_c = false;
    var_boolean_d = false;
    var_i_a = null;
    var_i_b = null;
    f_q = 0;
    
    _init_0() {
    this.var_i_a = null;
    this.var_i_b = null;
    this.f_q = -1;
    this.var_boolean_d = false;
    }
    
    _init_4(n2, n3, n4, n5) {
    this.var_i_a = null;
    this.var_i_b = null;
    this.f_q = n4;
    let n6 = 0;
    block0: switch (this.f_q) {
    case 0: {
    n6 = 192;
    break;
    }
    case 7: {
    n6 = 99;
    break;
    }
    case 1: {
    n6 = 87;
    break;
    }
    case 6: {
    switch (n5) {
    case 0: {
    n6 = 82;
    break;
    }
    case 1: {
    n6 = 83;
    break;
    }
    case 2: {
    n6 = 84;
    break;
    }
    case 3: {
    n6 = 85;
    }
    }
    break;
    }
    case 5: {
    i.var_n_a.f_n = false;
    n6 = 95;
    break;
    }
    case 3: {
    n6 = 65;
    break;
    }
    case 4: {
    n6 = 97;
    break;
    }
    case 8: {
    switch (n5) {
    case 0: {
    n6 = 74;
    break;
    }
    case 1: {
    n6 = 76;
    break;
    }
    case 2: {
    n6 = 78;
    break;
    }
    case 3: {
    n6 = 80;
    }
    }
    break;
    }
    case 9: {
    n6 = 50;
    break;
    }
    case 10: {
    switch (this.f_o) {
    case 0: {
    n6 = 62;
    break block0;
    }
    case 1: {
    n6 = 65;
    break block0;
    }
    case 2: {
    n6 = 68;
    break block0;
    }
    case 3: {
    n6 = 71;
    }
    }
    }
    }
    if (this.f_q == 8 || this.f_q == 9 || this.f_q == 10) {
    this.f_o = n5;
    }
    this.a(n2, n3, n6);
    if (this.f_q == 6) {
    this.f_h = n5;
    } else if (this.f_q != 8) {
    this.f_p = n5 * this.var_k_a.f_c;
    }
    if (this.f_q == 9 || this.f_q == 10) {
    this.f_m *= 2;
    }
    }
    
    _init_7(n2, n3, n4, n5, n6, n7, n8) {
    this.f_q = n4;
    this.var_k_a.a(n5, n6, n7);
    this.a(n2, n3, n5);
    this.f_p = n8 * this.var_k_a.f_c;
    }
    
    _init_5(n2, n3, n4, n5, n6) {
    this.var_i_a = null;
    this.var_i_b = null;
    this.f_q = n4;
    let n7 = 0;
    block0: switch (this.f_q) {
    case 2: {
    switch (n6 % 3) {
    case 0: {
    n7 = 91;
    break block0;
    }
    case 1: {
    n7 = 244;
    break block0;
    }
    case 2: {
    n7 = 248;
    }
    }
    }
    }
    this.a(n2, n3, n7);
    if (this.f_q == 2) {
    this.f_h = n5 + 25;
    this.f_f = n6 % 3;
    ++i.var_n_a.var_int_g;
    }
    }
    
    _a_0(n2, n3, n4) {
    this.f_e = 0;
    this.f_f = 0;
    this.f_g = 0;
    this.f_h = 0;
    this.f_i = 2;
    this.f_j = 0;
    this.var_boolean_d = false;
    this.var_boolean_a = false;
    this.var_boolean_b = false;
    this.b();
    if (!this.boolean_a(n2, n3)) {
    return false;
    }
    this.var_h_a.f_c = n4;
    this.var_h_a.f_d = 1;
    this.a();
    this.j();
    this.f_m = i.var_n_a.var_t_a.var_int_e * 50;
    this.f_n = i.var_n_a.var_t_a.var_int_e * 25;
    return true;
    }
    
    f() {
    switch (this.f_q) {
    case 3: {
    if (i.var_n_a != null) {
    i.var_n_a.var_q_a.var_boolean_f = true;
    i.var_n_a.var_q_a.l();
    }
    if (this.var_int_b > 0 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b - 1][this.var_int_d] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_b < r.var_int_a - 1 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b + 1][this.var_int_d] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_d > 0 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b][this.var_int_d - 1] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_d >= r.var_int_b - 1 || i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b][this.var_int_d + 1] == 0) break;
    i.var_n_a.var_r_a.c();
    return;
    }
    case 9:
    case 10: {
    i.var_n_a.f_m = false;
    if (this.f_q != 10 || i.var_n_a.var_q_a == null) break;
    i.var_n_a.var_q_a.var_boolean_g = false;
    }
    }
    }
    
    _a_1() {
    switch (this.f_q) {
    case 0: {
    this.var_k_a.a(192, 4, 8);
    return;
    }
    case 7: {
    this.var_k_a.a(99, 4, 4);
    return;
    }
    case 1: {
    this.var_k_a.a(88, 3, 1);
    return;
    }
    case 2: {
    this.var_k_a.a(this.var_h_a.f_c, 4, 1);
    return;
    }
    case 3: {
    this.var_k_a.a(65, 3, 3);
    return;
    }
    case 4: {
    this.var_k_a.a(221, 2, 3);
    return;
    }
    case 8: {
    switch (this.f_o) {
    case 0: {
    this.var_k_a.a(74, 2, 1);
    break;
    }
    case 1: {
    this.var_k_a.a(76, 2, 1);
    break;
    }
    case 2: {
    this.var_k_a.a(78, 2, 1);
    break;
    }
    case 3: {
    this.var_k_a.a(80, 2, 1);
    }
    }
    return;
    }
    case 9: {
    this.var_k_a.a(50, 4, 1);
    return;
    }
    case 10: {
    switch (this.f_o) {
    case 0: {
    this.var_k_a.a(62, 3, 3);
    return;
    }
    case 1: {
    this.var_k_a.a(65, 3, 3);
    return;
    }
    case 2: {
    this.var_k_a.a(68, 3, 3);
    return;
    }
    case 3: {
    this.var_k_a.a(71, 3, 3);
    }
    }
    }
    }
    }
    
    _b_0() {
    switch (this.f_q) {
    case 0: {
    this.var_char_a = 1;
    this.var_char_b = 0;
    this.var_char_c = 29;
    return;
    }
    case 7: {
    this.var_char_a = 16;
    this.var_char_c = 0;
    return;
    }
    case 1: {
    this.var_char_a = 19;
    this.var_char_b = 0;
    this.var_char_c = 29;
    return;
    }
    case 6: {
    this.var_char_a = 51;
    this.var_char_b = 0;
    this.var_char_c = 29;
    return;
    }
    case 5: {
    this.var_char_a = 2;
    this.var_char_b = 0;
    this.var_char_c = 0;
    return;
    }
    case 2: {
    this.var_char_a = 8;
    this.var_char_b = 0;
    this.var_char_c = 0;
    return;
    }
    case 3: {
    this.var_char_a = 8;
    this.var_char_b = 8;
    this.var_char_c = 0;
    return;
    }
    case 4: {
    this.var_char_a = 4;
    this.var_char_b = 0;
    this.var_char_c = 0;
    return;
    }
    case 8: {
    this.var_char_a = 18;
    this.var_char_b = 0;
    if (this.f_o == 0 || this.f_o == 2) {
    this.var_char_c = 9;
    return;
    }
    this.var_char_c = 17;
    return;
    }
    case 9: {
    this.var_char_a = 0;
    this.var_char_b = 2;
    this.var_char_c = 25;
    return;
    }
    case 10: {
    this.var_char_a = 0;
    this.var_char_b = 10;
    this.var_char_c = 25;
    return;
    }
    }
    this.var_char_a = 0;
    this.var_char_b = 0;
    this.var_char_c = 0;
    }
    
    g() {
    if (this.f_q == 14) {
    this.var_boolean_c = false;
    i.var_n_a.var_r_a.c(this.var_int_b, this.var_int_d, this.var_h_a.f_c);
    return;
    }
    if (!this.var_boolean_c) {
    this.var_boolean_c = true;
    i.var_n_a.var_r_a.void_a(this.var_int_a, this.var_int_c);
    i.var_n_a.var_r_a.void_a(this.var_int_b, this.var_int_d);
    }
    }
    
    boolean_a(n2, n3) {
    if (this.f_q == 14) {
    this.var_int_a = this.var_int_b;
    this.var_int_c = this.var_int_d;
    this.var_int_b = n2;
    this.var_int_d = n3;
    if (n2 > 20 || n3 > 22) {
    this.var_boolean_d = true;
    return false;
    }
    this.void_a(t.var_int_c * this.var_int_b + i.var_n_a.var_t_a.var_int_g, t.var_int_c * this.var_int_d + i.var_n_a.var_t_a.var_int_f);
    this.var_h_a.f_c = this.var_k_a.f_a;
    this.g();
    return true;
    }
    this.var_int_b = n2;
    this.var_int_d = n3;
    this.var_int_a = this.var_int_b;
    this.var_int_c = this.var_int_d;
    if (n2 > r.var_int_a - 1 || n3 > r.var_int_b - 1) {
    this.var_boolean_d = true;
    return false;
    }
    if (!i.var_n_a.var_r_a.boolean_a(n2, n3, this)) {
    this.var_boolean_d = true;
    return false;
    }
    this.f_k = (t.var_int_c * this.var_int_b + i.var_n_a.var_t_a.var_int_g) * 100;
    this.f_l = (t.var_int_c * this.var_int_d + i.var_n_a.var_t_a.var_int_f) * 100;
    this.void_a(this.f_k, this.f_l);
    this.g();
    return true;
    }
    
    _b_1(n2, n3) {
    if (this.f_e != 0) {
    return false;
    }
    this.var_int_a = this.var_int_b;
    this.var_int_c = this.var_int_d;
    if (n2 > r.var_int_a - 1 || n3 > r.var_int_b - 1) {
    return false;
    }
    if (n2 < 0 || n3 < 0) {
    return false;
    }
    if (!i.var_n_a.var_r_a.boolean_a(this.var_int_b, this.var_int_d, n2, n3)) {
    return false;
    }
    this.var_int_b = n2;
    this.var_int_d = n3;
    this.f_i = 2;
    if ((this.var_char_b & 2) == 0 && (i.var_n_a.var_r_a.int_b(this.var_int_a, this.var_int_c) == 1024 || i.var_n_a.var_r_a.int_b(this.var_int_a, this.var_int_c) == 256 || i.var_n_a.var_r_a.int_b(this.var_int_a, this.var_int_c) == 2048 || i.var_n_a.var_r_a.int_b(this.var_int_a, this.var_int_c) == 512)) {
    this.f_e = 4;
    this.f_g = t.var_int_c * 100 / this.f_n;
    } else {
    this.f_e = 1;
    this.f_g = t.var_int_c * 100 / this.f_m;
    if (this.var_int_a < n2) {
    this.f_o = 1;
    } else if (this.var_int_a > n2) {
    this.f_o = 3;
    }
    if (this.var_int_c < n3) {
    this.f_o = 2;
    } else if (this.var_int_c > n3) {
    this.f_o = 0;
    }
    }
    if ((this.var_char_b & 2) == 0 && (this.var_char_b & 4) == 0) {
    if (i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b][this.var_int_d] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_a > 0 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_a - 1][this.var_int_c] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_a < r.var_int_a - 1 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_a + 1][this.var_int_c] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_c > 0 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_a][this.var_int_c - 1] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_c < r.var_int_b - 1 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_a][this.var_int_c + 1] != 0) {
    i.var_n_a.var_r_a.c();
    }
    }
    this.g();
    return true;
    }
    
    void_a(n2, n3) {
    this.f_k = n2;
    this.f_l = n3;
    this.var_h_a.f_a = n2 / 100;
    this.var_h_a.f_b = n3 / 100;
    }
    
    c() {
    if (this.f_q == 8) {
    if (this.f_e == 0 && i.var_n_a.f_n) {
    this.f_e = 1;
    this.var_h_a.f_c = this.var_k_a.f_a + 1;
    this.g();
    i.var_n_a.var_r_a.c();
    }
    if (this.f_e == 1 && !i.var_n_a.f_n) {
    this.f_e = 2;
    }
    if (this.f_e == 2) {
    this.f_e = 0;
    this.var_h_a.f_c = this.var_k_a.f_a;
    i.var_n_a.var_r_a.c();
    }
    return;
    }
    if (this.f_q == 4) {
    if (i.var_n_a.var_int_g == i.var_n_a.var_int_f && this.f_f == 0) {
    this.f_f = 1;
    }
    if (this.f_f == 1 && !i.var_n_a.var_boolean_j && !i.var_n_a.var_q_a.var_boolean_h) {
    let h2 = new h();
    this.a(this.var_k_a);
    i.var_n_a.var_r_a.void_a(this.var_int_b, this.var_int_d - 1);
    h2.f_c = 199 + this.var_h_a.f_c - this.var_k_a.f_a;
    h2.f_a = this.var_h_a.f_a;
    h2.f_b = this.var_h_a.f_b - t.var_int_c;
    i.var_n_a.a(h2, 3);
    this.g();
    }
    return;
    }
    if (this.f_q == 2) {
    if (this.f_e == 1 && !i.var_n_a.var_q_a.var_boolean_h) {
    this.g();
    if (this.a(this.var_k_a)) {
    this.f_e = 2;
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    if (i.var_n_a.var_r_a.int_b(i2, i3) != 32) continue;
    this.var_int_a = this.var_int_b;
    this.var_int_c = this.var_int_d;
    this.var_int_b = i2;
    this.var_int_d = i3;
    this.var_h_a.f_a = i2 * t.var_int_c + i.var_n_a.var_t_a.var_int_g;
    this.var_h_a.f_b = i3 * t.var_int_c + i.var_n_a.var_t_a.var_int_f;
    }
    }
    }
    return;
    }
    if (this.f_e == 2) {
    this.g();
    if (this.a(this.var_k_a)) {
    this.var_boolean_d = true;
    return;
    }
    }
    if (this.f_g > this.f_h - 4) {
    this.a(this.var_k_a);
    }
    if (this.f_g > this.f_h) {
    this.f_g = 0;
    this.j();
    return;
    }
    ++this.f_g;
    return;
    }
    if (this.f_q == 5) {
    this.f_g = 0;
    return;
    }
    if (this.f_e == 2 && this.f_q == 6) {
    this.f_e = 0;
    }
    if (this.f_e == 1) {
    if (this.var_int_a < this.var_int_b) {
    this.void_a(this.f_k + this.f_m, this.f_l);
    this.f_o = 1;
    } else if (this.var_int_a > this.var_int_b) {
    this.void_a(this.f_k - this.f_m, this.f_l);
    this.f_o = 3;
    }
    if (this.var_int_c < this.var_int_d) {
    this.void_a(this.f_k, this.f_l + this.f_m);
    this.f_o = 2;
    } else if (this.var_int_c > this.var_int_d) {
    this.void_a(this.f_k, this.f_l - this.f_m);
    this.f_o = 0;
    }
    this.g();
    --this.f_g;
    if (this.f_g == 0) {
    this.f_e = 0;
    this.h();
    if (this.var_boolean_a) {
    this.var_boolean_a = false;
    this.var_boolean_b = true;
    } else {
    this.var_boolean_b = false;
    }
    }
    }
    if (this.f_e == 4 && (this.f_q != 1 || this.f_q == 1 && this.f_f != 2)) {
    if (this.var_int_a < this.var_int_b) {
    this.void_a(this.f_k + this.f_n, this.f_l);
    } else if (this.var_int_a > this.var_int_b) {
    this.void_a(this.f_k - this.f_n, this.f_l);
    }
    if (this.var_int_c < this.var_int_d) {
    this.void_a(this.f_k, this.f_l + this.f_n);
    } else if (this.var_int_c > this.var_int_d) {
    this.void_a(this.f_k, this.f_l - this.f_n);
    }
    this.g();
    --this.f_g;
    if (this.f_g == 0) {
    this.f_e = 0;
    this.h();
    }
    }
    if (this.f_e == 0) {
    if (this.f_j > 0) {
    --this.f_j;
    } else {
    this.f_i = 2;
    }
    if ((this.var_char_a & 1) != 0 || (this.var_char_b & 4) != 0 || (this.var_char_b & 0x40) != 0) {
    if ((i.var_n_a.var_r_a.int_b(this.var_int_b, this.var_int_d) & 0x100) != 0 && this.b(this.var_int_b, this.var_int_d - 1)) {
    return;
    }
    if ((i.var_n_a.var_r_a.int_b(this.var_int_b, this.var_int_d) & 0x200) != 0 && this.b(this.var_int_b + 1, this.var_int_d)) {
    return;
    }
    if ((i.var_n_a.var_r_a.int_b(this.var_int_b, this.var_int_d) & 0x400) != 0 && this.b(this.var_int_b, this.var_int_d + 1)) {
    return;
    }
    if ((i.var_n_a.var_r_a.int_b(this.var_int_b, this.var_int_d) & 0x800) != 0 && this.b(this.var_int_b - 1, this.var_int_d)) {
    return;
    }
    }
    switch (this.f_q) {
    case 0:
    case 3:
    case 7:
    case 14: {
    this.a(this.var_k_a);
    }
    }
    } else if (this.f_e == 2) {
    switch (this.f_q) {
    case 7: {
    if (!this.a(this.var_k_a)) break;
    i.var_n_a.var_r_a.c();
    this.var_boolean_d = true;
    }
    }
    }
    if (this.f_q == 9 || this.f_q == 10) {
    if (this.f_e != 2) {
    this.a(this.var_k_a);
    }
    if (this.f_e == 0) {
    switch (this.f_o) {
    case 0: {
    if (this.b(this.var_int_b, this.var_int_d - 1)) break;
    this.j();
    this.f_e = 2;
    if (this.f_q == 9) {
    this.var_k_a.a(54, 4, 1);
    break;
    }
    this.f_o = 2;
    break;
    }
    case 1: {
    if (this.b(this.var_int_b + 1, this.var_int_d)) break;
    this.j();
    this.f_e = 2;
    if (this.f_q == 9) {
    this.var_k_a.a(54, 4, 1);
    break;
    }
    this.f_o = 3;
    break;
    }
    case 2: {
    if (this.b(this.var_int_b, this.var_int_d + 1)) break;
    this.j();
    this.f_e = 2;
    if (this.f_q == 9) {
    this.var_k_a.a(54, 4, 1);
    break;
    }
    this.f_o = 0;
    break;
    }
    case 3: {
    if (this.b(this.var_int_b - 1, this.var_int_d)) break;
    this.j();
    this.f_e = 2;
    if (this.f_q == 9) {
    this.var_k_a.a(54, 4, 1);
    break;
    }
    this.f_o = 1;
    }
    }
    }
    if (this.f_e == 2) {
    if (this.f_q == 9) {
    if (this.a(this.var_k_a)) {
    this.var_boolean_d = true;
    }
    } else if (this.f_f == 0) {
    this.f_f = 1;
    this.f_e = 0;
    switch (this.f_o) {
    case 0: {
    this.var_k_a.a(62, 3, 3);
    break;
    }
    case 1: {
    this.var_k_a.a(65, 3, 3);
    break;
    }
    case 2: {
    this.var_k_a.a(68, 3, 3);
    break;
    }
    case 3: {
    this.var_k_a.a(71, 3, 3);
    }
    }
    } else {
    this.var_boolean_d = true;
    }
    }
    }
    if (this.f_f == 1) {
    switch (this.f_q) {
    case 1: {
    if (!this.a(this.var_k_a)) break;
    i.var_n_a.var_q_a.var_boolean_h = true;
    this.f_f = 2;
    }
    }
    return;
    }
    if (this.f_f == 2) {
    switch (this.f_q) {
    case 1: {
    let c2 = new c();
    c2.b(0, 255, 0);
    c2.a(0, 220, 0);
    c2.f_a = this.var_int_b * t.var_int_c + i.var_n_a.var_t_a.var_int_e + i.var_n_a.var_t_a.var_int_g;
    c2.f_b = this.var_int_d * t.var_int_c + i.var_n_a.var_t_a.var_int_e + i.var_n_a.var_t_a.var_int_f;
    c2.f_c = this.f_h * 14;
    i.var_n_a.a(c2, 3);
    if (this.f_h >= 5) {
    c2.b(0, 175, 0);
    c2.a(0, 160, 0);
    c2.f_c = (this.f_h - 4) * 16;
    i.var_n_a.a(c2, 3);
    }
    if (this.f_h >= 10) {
    c2.b(0, 145, 0);
    c2.a(0, 100, 0);
    c2.f_c = (this.f_h - 9) * 20;
    i.var_n_a.a(c2, 3);
    }
    ++this.f_h;
    }
    }
    }
    }
    
    h() {
    }
    
    i() {
    if (this.f_q == 8 && this.f_e == 1) {
    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 8);
    block0: switch (this.f_o) {
    case 0: {
    for (let i2 = this.var_int_d - 1; i2 >= 0; --i2) {
    if ((i.var_n_a.var_r_a.int_b(this.var_int_b, i2) & this.var_char_c) != 0) {
    return;
    }
    let i3 = i.var_n_a.var_r_a.i_a(this.var_int_b, i2);
    if (!(i3 == null || i3.var_boolean_d || (i3.var_char_a & 1) == 0 && (i3.var_char_a & 0x10) == 0 && (i3.var_char_a & 8) == 0)) {
    if ((i3.var_char_a & 0x10) == 0) break block0;
    i3.a(this.f_o);
    return;
    }
    i.var_n_a.var_r_a.b(this.var_int_b, i2, 2);
    }
    break;
    }
    case 1: {
    for (let i4 = this.var_int_b + 1; i4 < r.var_int_a; ++i4) {
    if ((i.var_n_a.var_r_a.int_b(i4, this.var_int_d) & this.var_char_c) != 0) {
    return;
    }
    let i5 = i.var_n_a.var_r_a.i_a(i4, this.var_int_d);
    if (!(i5 == null || i5.var_boolean_d || (i5.var_char_a & 1) == 0 && (i5.var_char_a & 0x10) == 0 && (i5.var_char_a & 8) == 0)) {
    if ((i5.var_char_a & 0x10) == 0) break block0;
    i5.a(this.f_o);
    return;
    }
    i.var_n_a.var_r_a.b(i4, this.var_int_d, 1);
    }
    break;
    }
    case 2: {
    for (let i6 = this.var_int_d + 1; i6 < r.var_int_b; ++i6) {
    if ((i.var_n_a.var_r_a.int_b(this.var_int_b, i6) & this.var_char_c) != 0) {
    return;
    }
    let i7 = i.var_n_a.var_r_a.i_a(this.var_int_b, i6);
    if (!(i7 == null || i7.var_boolean_d || (i7.var_char_a & 1) == 0 && (i7.var_char_a & 0x10) == 0 && (i7.var_char_a & 8) == 0)) {
    if ((i7.var_char_a & 0x10) == 0) break block0;
    i7.a(this.f_o);
    return;
    }
    i.var_n_a.var_r_a.b(this.var_int_b, i6, 2);
    }
    break;
    }
    case 3: {
    for (let i8 = this.var_int_b - 1; i8 >= 0; --i8) {
    if ((i.var_n_a.var_r_a.int_b(i8, this.var_int_d) & this.var_char_c) != 0) {
    return;
    }
    let i9 = i.var_n_a.var_r_a.i_a(i8, this.var_int_d);
    if (!(i9 == null || i9.var_boolean_d || (i9.var_char_a & 1) == 0 && (i9.var_char_a & 0x10) == 0 && (i9.var_char_a & 8) == 0)) {
    if ((i9.var_char_a & 0x10) == 0) break block0;
    i9.a(this.f_o);
    return;
    }
    i.var_n_a.var_r_a.b(i8, this.var_int_d, 1);
    }
    break;
    }
    }
    }
    }
    
    j() {
    this.f_p = 0;
    }
    
    _a_2(k2) {
    let bl = false;
    if (k2.f_c != 0 && this.f_p % k2.f_c == 0) {
    let n2 = k2.f_a + this.f_p / k2.f_c;
    if (n2 > k2.f_a + k2.f_b - 1) {
    n2 = k2.f_a;
    this.j();
    bl = true;
    }
    this.var_h_a.f_c = n2;
    this.g();
    }
    ++this.f_p;
    return bl;
    }
    
    e() {
    switch (this.f_q) {
    case 1: {
    if (this.f_f != 0) break;
    this.f_f = 1;
    return;
    }
    case 6: {
    if (this.f_e != 0 || (i.var_n_a.var_r_a.int_b(this.var_int_b, this.var_int_d) & 0x80) == 0) break;
    ++this.f_h;
    if (this.f_h > 3) {
    this.f_h = 0;
    }
    this.var_h_a.f_c = 82 + this.f_h;
    this.f_e = 2;
    this.g();
    if (this.var_int_b > 0 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b - 1][this.var_int_d] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_b < r.var_int_a - 1 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b + 1][this.var_int_d] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_d > 0 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b][this.var_int_d - 1] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_d >= r.var_int_b - 1 || i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b][this.var_int_d + 1] == 0) break;
    i.var_n_a.var_r_a.c();
    return;
    }
    case 5: {
    if (this.f_g >= 1) break;
    if (this.f_e == 0) {
    this.f_e = 1;
    this.var_h_a.f_c = 96;
    i.var_n_a.f_n = true;
    } else if (this.f_e == 1) {
    this.f_e = 0;
    this.var_h_a.f_c = 95;
    i.var_n_a.f_n = false;
    }
    ++this.f_g;
    this.g();
    }
    }
    }
    
    d() {
    switch (this.f_q) {
    case 2: {
    this.f_e = 1;
    this.j();
    this.var_k_a.a(252, 3, 3);
    this.var_h_a.f_e = 3;
    ++i.var_n_a.var_int_f;
    if (i.var_n_a == null) break;
    if (this.var_int_b > 0 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b - 1][this.var_int_d] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_b < r.var_int_a - 1 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b + 1][this.var_int_d] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_d > 0 && i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b][this.var_int_d - 1] != 0) {
    i.var_n_a.var_r_a.c();
    }
    if (this.var_int_d >= r.var_int_b - 1 || i.var_n_a.var_r_a.var_short_arr_arr_a[this.var_int_b][this.var_int_d + 1] == 0) break;
    i.var_n_a.var_r_a.c();
    return;
    }
    case 3: {
    this.var_boolean_d = true;
    }
    }
    }
    
    k() {
    }
    

    _i_laser_a(var1_1) {
        if (this.f_q === 7) {
            if (this.f_e !== 2) {
                this.f_e = 2;
                this.var_k_a.a(103, 4, 4);
                this.j();
            }
            return;
        }
        if (this.f_q === 1) {
            if (this.f_f === 0) {
                this.f_f = 1;
            }
            return;
        }
        if (this.f_q === 6) {
            let var3_2 = 0;
            if (this.f_h === 0) {
                if (var1_1 === 1) {
                    var3_2 = 2;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 6);
                } else if (var1_1 === 0) {
                    var3_2 = 3;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 6);
                } else {
                    return;
                }
            } else if (this.f_h === 1) {
                if (var1_1 === 1) {
                    var3_2 = 0;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 5);
                } else if (var1_1 === 2) {
                    var3_2 = 3;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 5);
                } else {
                    return;
                }
            } else if (this.f_h === 2) {
                if (var1_1 === 2) {
                    var3_2 = 1;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 4);
                } else if (var1_1 === 3) {
                    var3_2 = 0;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 4);
                } else {
                    return;
                }
            } else if (this.f_h === 3) {
                if (var1_1 === 0) {
                    var3_2 = 1;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 7);
                } else if (var1_1 === 3) {
                    var3_2 = 2;
                    i.var_n_a.var_r_a.b(this.var_int_b, this.var_int_d, 7);
                } else {
                    return;
                }
            }

            let var4_3 = (var3_2 === 0 || var3_2 === 2) ? 9 : 17;
            switch (var3_2) {
                case 0: { // UP
                    for (let var2_5 = this.var_int_d - 1; var2_5 >= 0; --var2_5) {
                        if ((i.var_n_a.var_r_a.int_b(this.var_int_b, var2_5) & var4_3) !== 0) return;
                        let var6 = i.var_n_a.var_r_a.i_a(this.var_int_b, var2_5);
                        if (var6 !== null && !var6.var_boolean_d && ((var6.var_char_a & 1) !== 0 || (var6.var_char_a & 16) !== 0 || (var6.var_char_a & 8) !== 0)) {
                            if ((var6.var_char_a & 16) !== 0) {
                                var6.a(var3_2);
                                return;
                            }
                            break;
                        }
                        i.var_n_a.var_r_a.b(this.var_int_b, var2_5, 2);
                    }
                    break;
                }
                case 1: { // RIGHT
                    for (let var2_6 = this.var_int_b + 1; var2_6 < r.var_int_a; ++var2_6) {
                        if ((i.var_n_a.var_r_a.int_b(var2_6, this.var_int_d) & var4_3) !== 0) return;
                        let var6 = i.var_n_a.var_r_a.i_a(var2_6, this.var_int_d);
                        if (var6 !== null && !var6.var_boolean_d && ((var6.var_char_a & 1) !== 0 || (var6.var_char_a & 16) !== 0 || (var6.var_char_a & 8) !== 0)) {
                            if ((var6.var_char_a & 16) !== 0) {
                                var6.a(var3_2);
                                return;
                            }
                            break;
                        }
                        i.var_n_a.var_r_a.b(var2_6, this.var_int_d, 1);
                    }
                    break;
                }
                case 2: { // DOWN
                    for (let var2_7 = this.var_int_d + 1; var2_7 < r.var_int_b; ++var2_7) {
                        if ((i.var_n_a.var_r_a.int_b(this.var_int_b, var2_7) & var4_3) !== 0) return;
                        let var6 = i.var_n_a.var_r_a.i_a(this.var_int_b, var2_7);
                        if (var6 !== null && !var6.var_boolean_d && ((var6.var_char_a & 1) !== 0 || (var6.var_char_a & 16) !== 0 || (var6.var_char_a & 8) !== 0)) {
                            if ((var6.var_char_a & 16) !== 0) {
                                var6.a(var3_2);
                                return;
                            }
                            break;
                        }
                        i.var_n_a.var_r_a.b(this.var_int_b, var2_7, 2);
                    }
                    break;
                }
                case 3: { // LEFT
                    for (let var2_8 = this.var_int_b - 1; var2_8 >= 0; --var2_8) {
                        if ((i.var_n_a.var_r_a.int_b(var2_8, this.var_int_d) & var4_3) !== 0) return;
                        let var6 = i.var_n_a.var_r_a.i_a(var2_8, this.var_int_d);
                        if (var6 !== null && !var6.var_boolean_d && ((var6.var_char_a & 1) !== 0 || (var6.var_char_a & 16) !== 0 || (var6.var_char_a & 8) !== 0)) {
                            if ((var6.var_char_a & 16) !== 0) {
                                var6.a(var3_2);
                                return;
                            }
                            break;
                        }
                        i.var_n_a.var_r_a.b(var2_8, this.var_int_d, 1);
                    }
                    break;
                }
            }
        }
    }

    constructor(...args) {
        super();
        const len = args.length;
        const fn = this[`_init_${len}`];
        if (fn) {
            fn.apply(this, args);
        }
    }

    a(...args) {
        if (args.length === 0) return i.prototype._a_1.apply(this, args);
        if (args.length === 3) return i.prototype._a_0.apply(this, args);
        if (args.length === 1) {
            if (typeof args[0] === 'number') return this._i_laser_a(args[0]);
            return i.prototype._a_2.apply(this, args);
        }
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
