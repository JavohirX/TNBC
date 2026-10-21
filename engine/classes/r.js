export class r {
    static var_int_a = 0;
    static var_int_b = 0;
    static var_int_c = 0;
    var_short_arr_arr_a = Array.from({length: r.var_int_a}, () => new Int32Array(r.var_int_b));
    var_short_arr_arr_b = Array.from({length: r.var_int_a}, () => new Int32Array(r.var_int_b));
    var_short_arr_arr_c = Array.from({length: r.var_int_a}, () => new Int32Array(r.var_int_b));
    var_boolean_a = false;
    f_d = Array.from({length: r.var_int_a}, () => new Int32Array(r.var_int_b));
    f_e = Array.from({length: r.var_int_a}, () => new Int32Array(r.var_int_b));
    var_boolean_arr_arr_a = Array.from({length: r.var_int_a}, () => new Array(r.var_int_b).fill(false));
    var_i_arr_arr_a = Array.from({length: r.var_int_a}, () => new Array(r.var_int_b).fill(null));
    var_n_a = null;
    
    constructor() {
    this.a();
    }
    
    _a_0() {
    let n2 = 0;
    let n3 = 0;
    for (n3 = 0; n3 < r.var_int_a; ++n3) {
    for (n2 = 0; n2 < r.var_int_b; ++n2) {
    this.f_e[n3][n2] = 0;
    }
    }
    for (n3 = 0; n3 < r.var_int_a; ++n3) {
    for (n2 = 0; n2 < r.var_int_b; ++n2) {
    this.var_i_arr_arr_a[n3][n2] = null;
    }
    }
    this.b();
    this.var_boolean_a = true;
    this.f();
    }
    
    _b_0() {
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    this.var_short_arr_arr_b[i2][i3] = this.var_short_arr_arr_a[i2][i3];
    this.var_short_arr_arr_a[i2][i3] = 0;
    }
    }
    }
    
    _a_1(n2) {
    let random = new Random();
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    if (this.var_short_arr_arr_a[i2][i3] == 0) continue;
    if (n2 % 3 == 0) {
    this.a(i2, i3, random.nextInt());
    }
    ++n2;
    }
    }
    }
    
    _a_2(n2, n3, n4) {
    let n5 = 0;
    switch (this.var_short_arr_arr_a[n2][n3]) {
    case 1: {
    n5 = 224 + Math.abs(n4) % 4;
    break;
    }
    case 2: {
    n5 = 228 + Math.abs(n4) % 4;
    break;
    }
    case 3: {
    n5 = 232 + Math.abs(n4) % 4;
    break;
    }
    case 4: {
    n5 = 236 + Math.abs(n4) % 2;
    break;
    }
    case 5: {
    n5 = 238 + Math.abs(n4) % 2;
    break;
    }
    case 6: {
    n5 = 240 + Math.abs(n4) % 2;
    break;
    }
    case 7: {
    n5 = 242 + Math.abs(n4) % 2;
    }
    }
    this.var_short_arr_arr_c[n2][n3] = n5;
    this.void_a(n2, n3);
    }
    
    _c_0() {
    if (!this.var_boolean_a) {
    this.var_boolean_a = true;
    this.b();
    }
    }
    
    _b_1(n2, n3, n4) {
    if (this.var_short_arr_arr_a[n2][n3] == n4) {
    return;
    }
    let sArray = this.var_short_arr_arr_a[n2];
    let n5 = n3;
    sArray[n5] = (sArray[n5] + n4);
    }
    
    _d_0() {
    let random = new Random();
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    if (this.var_short_arr_arr_a[i2][i3] == this.var_short_arr_arr_b[i2][i3]) continue;
    this.a(i2, i3, random.nextInt());
    }
    }
    }
    
    e() {
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    this.var_boolean_arr_arr_a[i2][i3] = false;
    }
    }
    }
    
    f() {
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    this.var_boolean_arr_arr_a[i2][i3] = true;
    this.void_b(i2, i3);
    }
    }
    }
    
    g() {
    let random = new Random();
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    if (this.int_a(i2, i3) != 155 || random.nextInt() % 5 != 0) continue;
    this.f_d[i2][i3] = 203;
    this.void_a(i2, i3);
    }
    }
    }
    
    h() {
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    if (this.int_a(i2, i3) != 203) continue;
    this.f_d[i2][i3] = 155;
    this.void_a(i2, i3);
    }
    }
    }
    
    _c_1(n2, n3, n4) {
    this.f_d[n2][n3] = n4;
    this.void_a(n2, n3);
    }
    
    _d_1(n2, n3, n4) {
    switch (n4) {
    case 0: {
    this.f_d[n2][n3] = 188;
    this.f_e[n2][n3] = 0;
    break;
    }
    case 3: {
    this.f_d[n2][n3] = 58;
    this.f_e[n2][n3] = 64;
    break;
    }
    case 4: {
    this.f_d[n2][n3] = 187;
    this.f_e[n2][n3] = 2;
    break;
    }
    case 5: {
    this.f_d[n2][n3] = 171;
    this.f_e[n2][n3] = 1;
    break;
    }
    case 6: {
    this.f_d[n2][n3] = 59;
    this.f_e[n2][n3] = 8;
    break;
    }
    case 7: {
    this.f_d[n2][n3] = 60;
    this.f_e[n2][n3] = 16;
    break;
    }
    case 10: {
    this.f_e[n2][n3] = 256;
    break;
    }
    case 11: {
    this.f_e[n2][n3] = 512;
    break;
    }
    case 12: {
    this.f_e[n2][n3] = 1024;
    break;
    }
    case 13: {
    this.f_e[n2][n3] = 2048;
    break;
    }
    case 22: {
    this.f_d[n2][n3] = 86;
    this.f_e[n2][n3] = 128;
    break;
    }
    case 28: {
    this.f_d[n2][n3] = 155;
    this.f_e[n2][n3] = 4;
    break;
    }
    case 32: {
    this.f_d[n2][n3] = 221;
    this.f_e[n2][n3] = 32;
    break;
    }
    default: {
    this.f_d[n2][n3] = 45;
    this.f_e[n2][n3] = 0;
    }
    }
    this.void_a(n2, n3);
    }
    
    _boolean_a_0(n2, n3, i2) {
    if (this.b(n2, n3, i2)) {
    this.var_i_arr_arr_a[n2][n3] = i2;
    return true;
    }
    return false;
    }
    
    _boolean_a_1(n2, n3, n4, n5) {
    let i2 = this.var_i_arr_arr_a[n2][n3];
    if (!this.b(n4, n5, i2)) {
    return false;
    }
    this.var_i_arr_arr_a[n2][n3] = null;
    this.var_i_arr_arr_a[n4][n5] = i2;
    return true;
    }
    
    _void_a_0(n2, n3, i2) {
    if (this.var_i_arr_arr_a[n2][n3] != i2) {
    return;
    }
    this.var_i_arr_arr_a[n2][n3] = null;
    if ((i2.var_char_a & 0x10) != 0) {
    if (n2 > 0 && this.var_short_arr_arr_a[n2 - 1][n3] != 0) {
    this.c();
    }
    if (n2 < r.var_int_a - 1 && this.var_short_arr_arr_a[n2 + 1][n3] != 0) {
    this.c();
    }
    if (n3 > 0 && this.var_short_arr_arr_a[n2][n3 - 1] != 0) {
    this.c();
    }
    if (n3 < r.var_int_b - 1 && this.var_short_arr_arr_a[n2][n3 + 1] != 0) {
    this.c();
    }
    }
    this.void_a(n2, n3);
    }
    
    _b_2(n2, n3, i2) {
    let bl = false;
    if ((this.f_e[n2][n3] & i2.var_char_c) != 0) {
    i2.var_boolean_a = false;
    return false;
    }
    if ((this.f_e[n2][n3] & 0x20) != 0 && this.var_n_a.var_int_g == this.var_n_a.var_int_f && (i2.var_char_b & 4) != 0) {
    this.var_i_arr_arr_a[n2][n3].var_boolean_d = true;
    return true;
    }
    let n4 = 0;
    if (i2.var_int_b < n2) {
    n4 = 1;
    } else if (i2.var_int_b > n2) {
    n4 = 3;
    } else if (i2.var_int_d < n3) {
    n4 = 2;
    } else if (i2.var_int_d > n3) {
    n4 = 0;
    }
    if ((i2.var_char_a & 1) != 0 || (i2.var_char_b & 4) != 0 || (i2.var_char_b & 0x40) != 0) {
    switch (n4) {
    case 0: {
    if ((this.f_e[n2][n3] & 0x400) == 0 && (this.f_e[i2.var_int_b][i2.var_int_d] & 0x400) == 0) break;
    return false;
    }
    case 1: {
    if ((this.f_e[n2][n3] & 0x800) == 0 && (this.f_e[i2.var_int_b][i2.var_int_d] & 0x800) == 0) break;
    return false;
    }
    case 2: {
    if ((this.f_e[n2][n3] & 0x100) == 0 && (this.f_e[i2.var_int_b][i2.var_int_d] & 0x100) == 0) break;
    return false;
    }
    case 3: {
    if ((this.f_e[n2][n3] & 0x200) == 0 && (this.f_e[i2.var_int_b][i2.var_int_d] & 0x200) == 0) break;
    return false;
    }
    }
    }
    if (this.var_i_arr_arr_a[n2][n3] == null || this.var_i_arr_arr_a[n2][n3] == i2) {
    i2.var_boolean_a = false;
    return true;
    }
    let bl2 = false;
    let bl3 = false;
    switch (this.var_i_arr_arr_a[n2][n3].var_char_a & i2.var_char_b) {
    case 1: {
    if (this.int_b(i2.var_int_a, i2.var_int_c) == 1024 || this.int_b(i2.var_int_a, i2.var_int_c) == 256 || this.int_b(i2.var_int_a, i2.var_int_c) == 2048 || this.int_b(i2.var_int_a, i2.var_int_c) == 512) {
    bl = true;
    }
    if (this.var_i_arr_arr_a[n2][n3].f_i <= 0 || bl) {
    let bl4 = false;
    switch (n4) {
    case 0: {
    bl4 = this.var_i_arr_arr_a[n2][n3].b(this.var_i_arr_arr_a[n2][n3].var_int_b, this.var_i_arr_arr_a[n2][n3].var_int_d - 1);
    break;
    }
    case 1: {
    bl4 = this.var_i_arr_arr_a[n2][n3].b(this.var_i_arr_arr_a[n2][n3].var_int_b + 1, this.var_i_arr_arr_a[n2][n3].var_int_d);
    break;
    }
    case 2: {
    bl4 = this.var_i_arr_arr_a[n2][n3].b(this.var_i_arr_arr_a[n2][n3].var_int_b, this.var_i_arr_arr_a[n2][n3].var_int_d + 1);
    break;
    }
    case 3: {
    bl4 = this.var_i_arr_arr_a[n2][n3].b(this.var_i_arr_arr_a[n2][n3].var_int_b - 1, this.var_i_arr_arr_a[n2][n3].var_int_d);
    }
    }
    if (bl4) {
    if (!i2.var_boolean_a && !i2.var_boolean_b) {
    i2.j();
    }
    i2.var_boolean_a = true;
    }
    return bl4;
    }
    this.var_i_arr_arr_a[n2][n3].f_j = 3;
    --this.var_i_arr_arr_a[n2][n3].f_i;
    if (!i2.var_boolean_a && !i2.var_boolean_b) {
    i2.j();
    }
    i2.var_boolean_a = true;
    return false;
    }
    case 2: {
    this.var_i_arr_arr_a[n2][n3].e();
    break;
    }
    case 4: {
    this.var_i_arr_arr_a[n2][n3].d();
    break;
    }
    case 8: {
    this.var_i_arr_arr_a[n2][n3].d();
    return true;
    }
    case 32: {
    break;
    }
    case 64: {
    this.var_i_arr_arr_a[n2][n3].k();
    }
    }
    return false;
    }
    
    _void_a_1(n2, n3) {
    if (n2 < 0) {
    n2 = 0;
    }
    if (n3 < 0) {
    n3 = 0;
    }
    if (n2 > r.var_int_a - 1) {
    n2 = r.var_int_a - 1;
    }
    if (n3 > r.var_int_b - 1) {
    n3 = r.var_int_b - 1;
    }
    this.var_boolean_arr_arr_a[n2][n3] = true;
    this.void_b(n2, n3);
    }
    
    void_b(n2, n3) {
    if (this.var_i_arr_arr_a[n2][n3] != null) {
    this.var_i_arr_arr_a[n2][n3].g();
    }
    }
    
    _boolean_a_2(n2, n3) {
    return this.var_boolean_arr_arr_a[n2][n3];
    }
    
    int_a(n2, n3) {
    return this.f_d[n2][n3];
    }
    
    i() {
    let random = new Random();
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    block8: for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    let n2 = this.int_a(i2, i3);
    switch (n2) {
    case 163: {
    if (this.int_b(i2 + 1, i3 - 1) != 1 && this.int_b(i2 + 1, i3 + 1) != 1 || this.f_d[i2 + 1][i3] == 165 || this.f_d[i2 + 1][i3] == 168) continue block8;
    this.f_d[i2][i3] = 161;
    continue block8;
    }
    case 169: {
    if (this.int_b(i2 - 1, i3 - 1) != 1 && this.int_b(i2 - 1, i3 + 1) != 1 || this.f_d[i2 - 1][i3] == 159 || this.f_d[i2 - 1][i3] == 162) continue block8;
    this.f_d[i2][i3] = 161;
    continue block8;
    }
    case 167: {
    if (this.int_b(i2 - 1, i3 - 1) != 1 && this.int_b(i2 + 1, i3 - 1) != 1 || this.f_d[i2][i3 - 1] == 162 || this.f_d[i2][i3 - 1] == 168) continue block8;
    this.f_d[i2][i3] = 166;
    continue block8;
    }
    case 170: {
    if (this.int_b(i2 - 1, i3 + 1) != 1 && this.int_b(i2 + 1, i3 + 1) != 1 || this.f_d[i2][i3 + 1] == 159 || this.f_d[i2][i3 + 1] == 165) continue block8;
    this.f_d[i2][i3] = 166;
    continue block8;
    }
    case 171: {
    this.void_a(i2, i3, random.nextInt(), random.nextInt());
    }
    }
    }
    }
    }
    
    _void_a_2(n2, n3, n4, n5) {
    let n6 = 0;
    for (let i2 = 0; i2 < 4; ++i2) {
    let n7 = 0;
    let n8 = 0;
    let n9 = 0;
    switch (i2) {
    case 0: {
    n9 = n2 - 1;
    n8 = n3 - 1;
    n7 = 1;
    break;
    }
    case 1: {
    n9 = n2 + 1;
    n8 = n3 - 1;
    n7 = 2;
    break;
    }
    case 2: {
    n9 = n2 + 1;
    n8 = n3 + 1;
    n7 = 4;
    break;
    }
    case 3: {
    n9 = n2 - 1;
    n8 = n3 + 1;
    n7 = 8;
    break;
    }
    default: {
    n7 = 0;
    n8 = 0;
    n9 = 0;
    }
    }
    if (n9 >= 0 && n9 <= r.var_int_a - 1 && n8 >= 0 && n8 <= r.var_int_b - 1 && this.int_b(n9, n8) != 1) {
    n7 = 0;
    }
    n6 += n7;
    }
    switch (n6) {
    case 0:
    case 15: {
    if (n4 % 4 == 0) {
    if (n5 % 5 == 0) {
    this.f_d[n2][n3] = 198;
    return;
    }
    if (n5 % 5 == 1) {
    this.f_d[n2][n3] = 223;
    return;
    }
    if (n5 % 5 == 2) {
    this.f_d[n2][n3] = 265;
    return;
    }
    if (n5 % 5 == 3) {
    this.f_d[n2][n3] = 266;
    return;
    }
    this.f_d[n2][n3] = 156;
    return;
    }
    this.f_d[n2][n3] = 188;
    return;
    }
    case 3: {
    this.f_d[n2][n3] = 170;
    return;
    }
    case 6: {
    this.f_d[n2][n3] = 169;
    return;
    }
    case 9: {
    this.f_d[n2][n3] = 163;
    return;
    }
    case 12: {
    this.f_d[n2][n3] = 167;
    return;
    }
    case 7: {
    this.f_d[n2][n3] = 168;
    return;
    }
    case 11: {
    this.f_d[n2][n3] = 162;
    return;
    }
    case 13: {
    this.f_d[n2][n3] = 159;
    return;
    }
    case 14: {
    this.f_d[n2][n3] = 165;
    return;
    }
    }
    this.f_d[n2][n3] = 171;
    }
    
    _b_3(n2) {
    let n3 = 0;
    let n4 = 0;
    let n5 = 0;
    let n6 = 0;
    let random = new Random();
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    block12: for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    if (this.int_b(i2, i3) != n2) continue;
    n5 = 0;
    for (let i4 = 0; i4 < 4; ++i4) {
    switch (i4) {
    case 0: {
    n3 = i2;
    n4 = i3 - 1;
    n6 = 1;
    break;
    }
    case 1: {
    n3 = i2 + 1;
    n4 = i3;
    n6 = 2;
    break;
    }
    case 2: {
    n3 = i2;
    n4 = i3 + 1;
    n6 = 4;
    break;
    }
    case 3: {
    n3 = i2 - 1;
    n4 = i3;
    n6 = 8;
    }
    }
    if (this.int_b(n3, n4) != n2) continue;
    n5 += n6;
    }
    switch (n2) {
    case 4: {
    this.f_d[i2][i3] = (140 + n5);
    continue block12;
    }
    case 2: {
    this.f_d[i2][i3] = (172 + n5);
    continue block12;
    }
    case 1: {
    if (n5 == 0) {
    if (random.nextInt() % 5 == 0) {
    this.f_d[i2][i3] = 198;
    continue block12;
    }
    if (random.nextInt() % 5 == 1) {
    this.f_d[i2][i3] = 223;
    continue block12;
    }
    if (random.nextInt() % 5 == 2) {
    this.f_d[i2][i3] = 265;
    continue block12;
    }
    if (random.nextInt() % 5 == 3) {
    this.f_d[i2][i3] = 266;
    continue block12;
    }
    this.f_d[i2][i3] = 156;
    continue block12;
    }
    this.f_d[i2][i3] = (156 + n5);
    }
    }
    }
    }
    }
    
    j() {
    let random = new Random();
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    if (this.int_b(i2, i3) != 0 || random.nextInt() % 2 != 0) continue;
    this.f_d[i2][i3] = (189 + Math.abs(random.nextInt()) % 3);
    }
    }
    }
    
    k() {
    let random = new Random();
    for (let i2 = 0; i2 < r.var_int_a; ++i2) {
    for (let i3 = 0; i3 < r.var_int_b; ++i3) {
    if (this.int_a(i2, i3) != 155 || random.nextInt() % 5 == 0) continue;
    this.f_d[i2][i3] = 98;
    }
    }
    }
    
    int_b(n2, n3) {
    if (n2 < 0 || n3 < 0 || n2 > r.var_int_a - 1 || n3 > r.var_int_b - 1) {
    return 0;
    }
    return this.f_e[n2][n3];
    }
    
    i_a(n2, n3) {
    return this.var_i_arr_arr_a[n2][n3];
    }
    
    static {
        r.var_int_a = 11;
        r.var_int_b = 12;
        r.var_int_c = r.var_int_a * r.var_int_b;
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
        if (args.length === 0) return r.prototype._b_0.apply(this, args);
        if (args.length === 1) return r.prototype._b_3.apply(this, args);
        if (args.length === 3) {
            if (typeof args[2] === 'number') return r.prototype._b_1.apply(this, args);
            return r.prototype._b_2.apply(this, args);
        }
    }

    boolean_a(...args) {
        const len = args.length;
        // Search available overload functions
        for (let idx = 0; idx < 12; idx++) {
            const fn = this[`_boolean_a_${idx}`];
            if (fn && fn.length === len) {
                return fn.apply(this, args);
            }
        }
        // Fallback to first overload if found
        if (this[`_boolean_a_0`]) return this[`_boolean_a_0`].apply(this, args);
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

    void_a(...args) {
        const len = args.length;
        // Search available overload functions
        for (let idx = 0; idx < 12; idx++) {
            const fn = this[`_void_a_${idx}`];
            if (fn && fn.length === len) {
                return fn.apply(this, args);
            }
        }
        // Fallback to first overload if found
        if (this[`_void_a_0`]) return this[`_void_a_0`].apply(this, args);
    }
}
