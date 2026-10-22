export class n {
    var_q_a = null;
    static var_boolean_a = false;
    var_boolean_b = false;
    var_short_a = 0;
    var_boolean_c = true;
    var_boolean_d = false;
    var_int_a = 0;
    var_int_b = 0;
    var_boolean_e = false;
    var_boolean_f = false;
    var_int_c = 0;
    var_int_d = 0;
    var_int_e = 0;
    var_boolean_g = false;
    var_boolean_h = false;
    var_int_f = 0;
    var_int_g = 0;
    var_boolean_i = false;
    var_int_h = 0;
    var_boolean_j = false;
    var_boolean_k = false;
    var_boolean_l = false;
    f_m = false;
    f_n = false;
    var_int_i = 0;
    var_int_j = 0;
    var_int_k = 0;
    var_int_l = -1;
    var_r_a = new r();
    var_g_a = new g();
    var_t_a = null;
    var_l_arr_arr_a = Array.from({length: 4}, () => new Array(200).fill(null));
    var_int_arr_a = new Int32Array(4);
    
    _init_0() {
    n.var_boolean_a = false;
    this.var_boolean_b = false;
    this.var_r_a.var_n_a = this;
    i.var_n_a = this;
    }
    
    _init_1(t2) {
    this.var_t_a = t2;
    n.var_boolean_a = false;
    this.var_boolean_b = false;
    this.var_r_a.var_n_a = this;
    i.var_n_a = this;
    }
    
    _a_0() {
    n.var_boolean_a = true;
    GMIDlet.var_byte_a = (GMIDlet.var_byte_a | 3);
    this.var_t_a.p();
    this.var_t_a.u();
    j.a();
    if (this.var_t_a.var_a_a.var_int_a == 0) {
    j.a(3);
    this.var_int_l = 0;
    return;
    }
    j.var_int_a = 3;
    }
    
    _b_0() {
    j.a();
    n.var_boolean_a = false;
    GMIDlet.var_byte_a = (GMIDlet.var_byte_a & 0xFFFFFFFC);
    this.var_t_a.p();
    }
    
    _c_0() {
    this.var_short_a = 0;
    this.var_int_d = 0;
    this.var_boolean_h = false;
    this.var_boolean_g = false;
    }
    
    _d_0() {
    if (this.var_t_a.var_int_j != 1) {
    return;
    }
    if (this.var_boolean_c) {
    if (this.var_int_e > 0) {
    --this.var_int_e;
    }
    if (this.var_int_j < 1 || this.var_short_a != 0) {
    if (this.var_boolean_e) {
    if (this.var_int_j < 1 || this.var_short_a != 0) {
    this.var_boolean_c = false;
    this.var_boolean_e = true;
    this.var_boolean_l = false;
    this.var_r_a.f();
    this.var_t_a.d();
    this.var_t_a.e();
    }
    } else {
    if (this.var_boolean_h && this.var_int_e == 0 && (this.var_short_a & 4) != 0) {
    this.var_boolean_f = false;
    this.var_int_d += 12;
    this.var_int_e = 6;
    }
    if (this.var_boolean_g && this.var_int_e == 0 && (this.var_short_a & 1) != 0) {
    this.var_boolean_f = false;
    this.var_int_d -= 12;
    this.var_int_e = 6;
    }
    if ((this.var_short_a & 0x50) != 0) {
    this.var_boolean_c = true;
    this.var_boolean_e = true;
    this.var_boolean_l = false;
    this.var_r_a.f();
    this.var_t_a.d();
    this.var_short_a = 0;
    } else if ((this.var_short_a & 0x80) != 0) {
    this.var_boolean_c = false;
    this.var_boolean_e = true;
    this.var_boolean_l = true;
    this.var_r_a.f();
    this.var_t_a.d();
    this.var_t_a.e();
    this.var_t_a.o();
    this.var_q_a.var_boolean_l = true;
    this.var_short_a = 0;
    }
    }
    } else if (this.var_boolean_e) {
    let d2 = new d();
    let f2 = new f();
    let h2 = new h();
    let p2 = new p();
    f2.void_a(t.var_java_lang_String_arr_c[20], t.var_int_a / 2, 6);
    f2.void_a();
    let n2 = f2.a(f2.var_java_lang_String_a, this.var_t_a) + 6;
    d2.f_a = t.var_int_a / 2 - n2 / 2;
    d2.f_b = 2;
    d2.f_c = n2;
    d2.f_d = 15 + t.var_int_c + 6;
    d2.f_g = 0;
    d2.f_f = 0;
    d2.f_e = 0;
    this.a(d2, 3);
    this.a(f2, 3);
    p2.a(255, 255, 0);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b;
    p2.f_c = p2.f_a;
    p2.f_d = d2.f_b + d2.f_d;
    this.a(p2, 3);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b;
    p2.f_c = d2.f_a + d2.f_c;
    p2.f_d = p2.f_b;
    this.a(p2, 3);
    p2.f_a = d2.f_a + d2.f_c;
    p2.f_b = d2.f_b;
    p2.f_c = d2.f_a + d2.f_c;
    p2.f_d = d2.f_b + d2.f_d;
    this.a(p2, 3);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b + d2.f_d;
    p2.f_c = d2.f_a + d2.f_c;
    p2.f_d = d2.f_b + d2.f_d;
    this.a(p2, 3);
    h2.f_b = f2.f_b + 15;
    if (Math.floor(this.var_int_j / 25) == 0) {
    h2.f_c = 91;
    h2.f_a = t.var_int_a / 2 - this.var_t_a.var_int_e;
    this.a(h2, 3);
    } else if (Math.floor(this.var_int_j / 25) == 1) {
    h2.f_c = 91;
    h2.f_a = t.var_int_a / 2 - t.var_int_c;
    this.a(h2, 3);
    h2.f_c = 244;
    h2.f_a += t.var_int_c;
    this.a(h2, 3);
    } else {
    h2.f_c = 91;
    h2.f_a = t.var_int_a / 2 - t.var_int_c - this.var_t_a.var_int_e;
    this.a(h2, 3);
    h2.f_c = 244;
    h2.f_a += t.var_int_c;
    this.a(h2, 3);
    h2.f_c = 248;
    h2.f_a += t.var_int_c;
    this.a(h2, 3);
    }
    --this.var_int_j;
    }
    if (!this.var_boolean_e && !this.var_boolean_f) {
    this.e();
    this.b(this.var_int_c);
    }
    } else {
    this.f();
    ++this.var_int_i;
    if (this.var_int_i == 5) {
    this.var_r_a.h();
    }
    if (this.var_int_i > 15) {
    this.var_r_a.g();
    this.var_int_i = 0;
    }
    if (this.var_boolean_d && this.var_int_a < 719) {
    ++this.var_int_b;
    if (this.var_int_b >= 25) {
    this.var_int_b = 0;
    ++this.var_int_a;
    }
    }
    }
    this.g();
    this.i();
    this.h();
    this.var_r_a.e();
    }
    
    _a_1(n2) {
    let f2 = new f();
    let d2 = new d();
    let p2 = new p();
    if (this.var_boolean_l) {
    return;
    }
    f2.void_a(t.var_java_lang_String_arr_c[21] + " - " + this.var_q_a.var_short_a + " " + t.var_java_lang_String_arr_b[29] + " - " + this.var_t_a.var_a_a.java_lang_String_a(this.var_int_a), t.var_int_a / 2, 0);
    d2.a(t.var_int_a / 2 - 70, 0, t.var_int_a / 2 + 70, 12, 0, 0, 0);
    this.a(d2, n2);
    this.a(f2, n2);
    p2.a(255, 255, 0);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b;
    p2.f_c = p2.f_a;
    p2.f_d = d2.f_b + d2.f_d;
    this.a(p2, n2);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b;
    p2.f_c = d2.f_a + d2.f_c;
    p2.f_d = p2.f_b;
    this.a(p2, n2);
    p2.f_a = d2.f_a + d2.f_c;
    p2.f_b = d2.f_b;
    p2.f_c = d2.f_a + d2.f_c;
    p2.f_d = d2.f_b + d2.f_d;
    this.a(p2, n2);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b + d2.f_d;
    p2.f_c = d2.f_a + d2.f_c;
    p2.f_d = d2.f_b + d2.f_d;
    this.a(p2, n2);
    }
    
    e() {
    let n2 = 0;
    let d2 = new d();
    let h2 = new h();
    h2.f_c = 107;
    h2.f_d = 1;
    h2.f_e = 0;
    h2.f_b = 0 - t.var_int_c + this.var_t_a.var_int_f;
    for (n2 = 0; n2 < r.var_int_a; ++n2) {
    if (!this.var_r_a.boolean_a(n2, 0)) continue;
    h2.f_a = n2 * t.var_int_c + this.var_t_a.var_int_g;
    this.a(h2, 0);
    }
    if (r.var_int_a * t.var_int_c < t.var_int_a) {
    d2.a(r.var_int_a * t.var_int_c + this.var_t_a.var_int_g, 0, t.var_int_a, t.var_int_b, 0, 0, 0);
    this.a(d2, 3);
    }
    if (this.var_t_a.var_int_g > 0) {
    let d3 = new d();
    d3.a(0, 0, this.var_t_a.var_int_g, t.var_int_b, 0, 0, 0);
    this.a(d3, 3);
    }
    if ((n2 = this.var_t_a.var_int_f + r.var_int_b * t.var_int_c) < t.var_int_b) {
    d2.a(this.var_t_a.var_int_g, n2, r.var_int_a * t.var_int_c + this.var_t_a.var_int_g, t.var_int_b, 0, 0, 0);
    this.a(d2, 3);
    }
    if (this.var_t_a.var_int_f > 0) {
    let bl = false;
    let n3 = this.var_t_a.var_int_f - t.var_int_c;
    d2.a(0, 0, t.var_int_a, n3, 0, 0, 0);
    this.a(d2, 2);
    }
    if (!this.var_boolean_c) {
    h2.f_c = 197;
    h2.f_a = t.var_int_a - t.var_int_c;
    h2.f_b = t.var_int_b - t.var_int_c - 2;
    this.a(h2, 3);
    this.a(3);
    if (this.var_boolean_l) {
    let f2 = new f();
    let p2 = new p();
    f2.void_a(t.var_java_lang_String_arr_c[22], t.var_int_a / 2, 8);
    f2.void_a();
    d2.f_g = 0;
    d2.f_f = 0;
    d2.f_e = 0;
    d2.f_a = f2.var_int_a - f2.a(f2.var_java_lang_String_a, this.var_t_a) / 2 - 2;
    d2.f_b = f2.f_b - 3;
    d2.f_c = f2.a(f2.var_java_lang_String_a, this.var_t_a) + 4;
    d2.f_d = f2.b(f2.var_java_lang_String_a, this.var_t_a) + 4;
    this.a(d2, 3);
    this.a(f2, 3);
    p2.a(255, 255, 0);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b;
    p2.f_c = p2.f_a;
    p2.f_d = d2.f_b + d2.f_d;
    this.a(p2, 3);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b;
    p2.f_c = d2.f_a + d2.f_c;
    p2.f_d = p2.f_b;
    this.a(p2, 3);
    p2.f_a = d2.f_a + d2.f_c;
    p2.f_b = d2.f_b;
    p2.f_c = d2.f_a + d2.f_c;
    p2.f_d = d2.f_b + d2.f_d;
    this.a(p2, 3);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b + d2.f_d;
    p2.f_c = d2.f_a + d2.f_c;
    p2.f_d = d2.f_b + d2.f_d;
    this.a(p2, 3);
    }
    }
    }
    
    _b_1(n2) {
    let h2 = new h();
    let d2 = new d();
    let d3 = new d();
    d2.f_g = 0;
    d2.f_f = 0;
    d2.f_e = 0;
    d2.f_a = 3;
    d2.f_c = t.var_int_a - 6;
    let f2 = new f();
    f2.a("", t.var_int_a / 2, 6 - this.var_int_d, t.var_int_a - 14);
    switch (n2) {
    case 0: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[23];
    break;
    }
    case 3: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[24];
    break;
    }
    case 5: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[25];
    break;
    }
    case 10: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[26];
    break;
    }
    case 14: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[27];
    break;
    }
    case 15: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[28];
    break;
    }
    case 20: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[29];
    break;
    }
    case 25: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[30];
    break;
    }
    case 35: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[31];
    break;
    }
    case 39: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[32];
    break;
    }
    case 40: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[33];
    break;
    }
    case 45: {
    f2.var_java_lang_String_a = t.var_java_lang_String_arr_c[34];
    }
    }
    let n3 = this.var_t_a.var_javax_microedition_lcdui_Image_h.getHeight();
    let n4 = f.java_lang_String_arr_a(f2.var_java_lang_String_a, f2.f_c, 1).length * 12;
    d2.f_d = t.var_int_b - n3 - 8 < n4 ? t.var_int_b - n3 : n4 + 8;
    d2.f_b = t.var_int_b - n3 - d2.f_d >> 1;
    f2.f_b = d2.f_b + 4 - this.var_int_d;
    f2.f_d = d2.f_b + d2.f_d - 8 + 4;
    this.a(d2, 3);
    this.a(f2, 3);
    d3.f_b = d2.f_b;
    d3.f_c = d2.f_c;
    d3.f_a = d2.f_a;
    d3.f_d = 4;
    this.a(d3, 3);
    let p2 = new p();
    p2.a(255, 255, 0);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b;
    p2.f_c = p2.f_a;
    p2.f_d = d2.f_b + d2.f_d - 1;
    this.a(p2, 3);
    p2.f_a = d2.f_a + d2.f_c - 1;
    p2.f_b = d2.f_b;
    p2.f_c = p2.f_a;
    p2.f_d = d2.f_b + d2.f_d - 1;
    this.a(p2, 3);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b;
    p2.f_c = d2.f_a + d2.f_c - 1;
    p2.f_d = p2.f_b;
    this.a(p2, 3);
    p2.f_a = d2.f_a;
    p2.f_b = d2.f_b + d2.f_d - 1;
    p2.f_c = d2.f_a + d2.f_c - 1;
    p2.f_d = p2.f_b;
    this.a(p2, 3);
    if (this.var_int_d > 0) {
    h2.f_c = 196;
    h2.f_a = t.var_int_a - t.var_int_c;
    h2.f_b = 0;
    this.a(h2, 3);
    this.var_boolean_g = true;
    } else {
    this.var_boolean_g = false;
    }
    if (f2.f_b + n4 > f2.f_d) {
    h2.f_c = 197;
    h2.f_a = t.var_int_a - t.var_int_c;
    h2.f_b = t.var_int_b - n3 - 2 - t.var_int_c;
    this.a(h2, 3);
    this.var_boolean_h = true;
    } else {
    this.var_boolean_h = false;
    }
    this.var_t_a.var_a_a.b();
    this.var_boolean_f = true;
    }
    
    f() {
    this.var_g_a.b();
    while (this.var_g_a.boolean_a()) {
    let i2 = this.var_g_a.var_i_a;
    if (!i2.var_boolean_d) {
    i2.c();
    continue;
    }
    this.var_r_a.void_a(i2.var_int_b, i2.var_int_d, i2);
    this.var_g_a.c();
    }
    }
    
    g() {
    if (this.f_n) {
    ++this.var_int_k;
    if (this.var_int_k == 2) {
    this.var_r_a.a(0);
    } else if (this.var_int_k == 4) {
    this.var_r_a.a(1);
    } else if (this.var_int_k == 6) {
    this.var_int_k = 0;
    this.var_r_a.a(2);
    }
    }
    if (!this.var_r_a.var_boolean_a) {
    return;
    }
    this.var_g_a.b();
    while (this.var_g_a.boolean_a()) {
    let i2 = this.var_g_a.var_i_a;
    if (i2.var_boolean_d) continue;
    i2.i();
    }
    this.var_r_a.d();
    this.var_r_a.var_boolean_a = false;
    }
    
    h() {
    if (this.var_q_a.f_e == 3) {
    return;
    }
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    if (!this.var_r_a.boolean_a(i2, i3)) continue;
    this.a(i2, i3);
    }
    }
    }
    
    _a_2(n2, n3) {
    if (this.var_r_a.var_short_arr_arr_a[n2][n3] == 0 || this.var_r_a.var_short_arr_arr_a[n2][n3] == 8) {
    return;
    }
    let h2 = new h();
    h2.f_d = 1;
    h2.f_a = n2 * t.var_int_c + this.var_t_a.var_int_g;
    h2.f_b = n3 * t.var_int_c + this.var_t_a.var_int_f;
    h2.f_c = this.var_r_a.var_short_arr_arr_c[n2][n3];
    this.a(h2, 3);
    }
    
    i() {
    let h2 = new h();
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    let blArray = this.var_r_a.var_boolean_arr_arr_a[i2];
    if (!blArray[i3]) continue;
    h2.f_a = i2 * t.var_int_c + this.var_t_a.var_int_g;
    h2.f_b = i3 * t.var_int_c + this.var_t_a.var_int_f;
    h2.f_c = this.var_r_a.f_d[i2][i3];
    this.a(h2, 0);
    }
    }
    h2.f_e = 0;
    this.var_g_a.b();
    while (this.var_g_a.boolean_a()) {
    let i4 = this.var_g_a.var_i_a;
    if (!i4.var_boolean_c || i4.var_boolean_d) continue;
    this.a(i4.var_h_a, i4.var_h_a.f_e);
    i4.var_boolean_c = false;
    if (i4 != this.var_q_a || this.f_m || !this.var_q_a.var_boolean_f) continue;
    this.a(this.var_q_a.var_h_b, this.var_q_a.var_h_b.f_e);
    i4.var_boolean_c = false;
    }
    if (this.var_boolean_e) {
    this.e();
    }
    }
    
    j() {
    for (let i2 = 0; i2 < 4; ++i2) {
    let lArray = this.var_l_arr_arr_a[i2];
    for (let i3 = this.var_int_arr_a[i2] - 1; i3 >= 0; --i3) {
    lArray[i3] = null;
    }
    this.var_int_arr_a[i2] = 0;
    }
    }
    
    _a_3(l2, n2) {
    this.var_l_arr_arr_a[n2][this.var_int_arr_a[n2]] = l2.l_a();
    let n3 = n2;
    this.var_int_arr_a[n3] = this.var_int_arr_a[n3] + 1;
    }
    
    k() {
    if (this.var_g_a.var_int_a == 0) {
    return;
    }
    this.var_g_a.b();
    while (this.var_g_a.boolean_a()) {
    let i2 = this.var_g_a.var_i_a;
    if (!i2.var_boolean_d) continue;
    this.var_r_a.void_a(i2.var_int_b, i2.var_int_d, i2);
    this.var_g_a.c();
    }
    }
    
    _c_1(n2) {
    this.var_t_a.f_k = n2;
    j.a();
    this.var_t_a.b();
    /* gc */
    /* gc */
    this.j();
    this.var_r_a.a();
    /* gc */
    this.l();
    this.d(n2 * r.var_int_c);
    this.var_r_a.f();
    this.var_boolean_i = false;
    this.var_boolean_l = false;
    this.var_int_j = 75;
    let random = new Random();
    let n3 = Math.abs(random.nextInt()) % 3;
    if (this.var_int_l == -1) {
    this.var_int_l = n3;
    } else {
    if (n3 == this.var_int_l && ++n3 > 2) {
    n3 = 0;
    }
    this.var_int_l = n3;
    }
    if (t.var_int_i != 1) {
    j.a(3 + n3);
    } else {
    j.var_int_a = 3 + n3;
    }
    if (n2 == 0 || n2 == 3 || n2 == 5 || n2 == 10 || n2 == 14 || n2 == 15 || n2 == 20 || n2 == 25 || n2 == 35 || n2 == 39 || n2 == 40 || n2 == 45) {
    this.var_int_c = n2;
    this.var_boolean_e = false;
    this.var_boolean_f = false;
    this.var_t_a.var_a_a.var_java_lang_String_a = t.var_java_lang_String_arr_b[0];
    this.var_t_a.var_a_a.var_java_lang_String_b = t.var_java_lang_String_arr_c[18];
    } else {
    this.var_boolean_e = true;
    }
    this.var_int_i = 0;
    }
    
    _d_1(n2) {
    this.var_int_f = 0;
    this.var_int_g = 0;
    this.var_boolean_c = true;
    this.var_boolean_j = false;
    this.var_boolean_k = false;
    this.f_m = false;
    this.f_n = true;
    let byArray = new Int8Array(r.var_int_c);
    try {
    /* gc */
    let inputStream = ResourceManager.getResourceAsStream("/levels.mar");
    inputStream.skip(n2);
    inputStream.read(byArray, 0, r.var_int_c);
    inputStream.close();
    /* gc */
    }
    catch (exception) {}
    let random = new Random();
    let n3 = 0;
    let i2 = null;
    for (let i3 = 0; i3 < r.var_int_c; ++i3) {
    let by = byArray[i3];
    let n4 = i3 % r.var_int_a;
    let n5 = Math.floor(i3 / r.var_int_a);
    i2 = null;
    let n6 = Math.abs(random.nextInt());
    switch (by) {
    case 1: {
    i2 = new b(n4, n5, 11);
    break;
    }
    case 2: {
    i2 = new b(n4, n5, 12);
    break;
    }
    case 8: {
    i2 = new i(n4, n5, 0, n6 % 4);
    break;
    }
    case 9: {
    i2 = new i(n4, n5, 7, n6 % 4);
    break;
    }
    case 10: {
    i2 = new i(n4, n5, 14, 124, 4, 3, n3);
    ++n3;
    this.var_r_a.d(n4, n5, by);
    break;
    }
    case 11: {
    i2 = new i(n4, n5, 14, 128, 4, 3, n3);
    ++n3;
    this.var_r_a.d(n4, n5, by);
    break;
    }
    case 12: {
    i2 = new i(n4, n5, 14, 132, 4, 3, n3);
    ++n3;
    this.var_r_a.d(n4, n5, by);
    break;
    }
    case 13: {
    i2 = new i(n4, n5, 14, 136, 4, 3, n3);
    ++n3;
    this.var_r_a.d(n4, n5, by);
    break;
    }
    case 14:
    case 15:
    case 16:
    case 17: {
    i2 = new i(n4, n5, 8, by - 14);
    break;
    }
    case 18:
    case 19:
    case 20:
    case 21: {
    i2 = new i(n4, n5, 6, by - 18);
    break;
    }
    case 23:
    case 24:
    case 25:
    case 26: {
    i2 = new m(n4, n5, by - 23);
    break;
    }
    case 27: {
    i2 = new i(n4, n5, 3, 0);
    break;
    }
    case 29: {
    this.var_q_a = new q(n4, n5);
    i2 = this.var_q_a;
    break;
    }
    case 30: {
    i2 = new i(n4, n5, 1, 0);
    break;
    }
    case 31: {
    i2 = new i(n4, n5, 2, n6 % 20, Math.abs(random.nextInt()));
    break;
    }
    case 32: {
    i2 = new i(n4, n5, 4, 0);
    this.var_r_a.d(n4, n5, 32);
    break;
    }
    case 33: {
    i2 = new i(n4, n5, 5, 0);
    break;
    }
    default: {
    this.var_r_a.d(n4, n5, by);
    }
    }
    if (i2 != null) {
    this.var_g_a.i_a(i2);
    if (i2.f_q != 14 && i2.f_q != 4) {
    this.var_r_a.d(n4, n5, 0);
    }
    }
    if (n3 <= 3) continue;
    n3 = 0;
    }
    this.var_r_a.b(4);
    this.var_r_a.b(1);
    this.var_r_a.b(2);
    this.var_r_a.i();
    this.var_r_a.j();
    this.var_r_a.k();
    this.var_r_a.f();
    }
    
    l() {
    this.var_g_a.void_a();
    /* gc */
    }
    
    static {
        n.var_boolean_a = false;
    }

    constructor(...args) {
        const len = args.length;
        const fn = this[`_init_${len}`];
        if (fn) {
            fn.apply(this, args);
        }
    }

    a(...args) {
        if (args.length === 0) return n.prototype._a_0.apply(this, args);
        if (args.length === 1) return n.prototype._a_1.apply(this, args);
        if (args.length === 2) {
            if (typeof args[0] === 'number') return n.prototype._a_2.apply(this, args);
            return n.prototype._a_3.apply(this, args);
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

    c(...args) {
        const len = args.length;
        // Search available overload functions
        for (let idx = 0; idx < 12; idx++) {
            const fn = this[`_c_${idx}`];
            if (fn && fn.length === len) {
                return fn.apply(this, args);
            }
        }
        // Fallback to first overload if found
        if (this[`_c_0`]) return this[`_c_0`].apply(this, args);
    }

    d(...args) {
        const len = args.length;
        // Search available overload functions
        for (let idx = 0; idx < 12; idx++) {
            const fn = this[`_d_${idx}`];
            if (fn && fn.length === len) {
                return fn.apply(this, args);
            }
        }
        // Fallback to first overload if found
        if (this[`_d_0`]) return this[`_d_0`].apply(this, args);
    }
}
