export class f extends l {
    var_java_lang_String_a = null;
    var_int_a = 0;
    f_b = 0;
    f_c = 0;
    f_d = 0;
    var_boolean_a = false;
    f_e = 0;
    
    _init_0() {
    }
    
    _init_7(string, n2, n3, n4, bl, n5, n6) {
    this.var_java_lang_String_a = string;
    this.var_int_a = n2;
    this.f_b = n3;
    this.f_c = n4;
    this.f_d = -1;
    this.var_boolean_a = bl;
    this.f_e = n5;
    this.f_d = n6;
    }
    
    _void_a_0(string, n2, n3) {
    this.var_java_lang_String_a = string;
    this.var_int_a = n2;
    this.f_b = n3;
    this.f_c = -1;
    this.f_d = -1;
    this.var_boolean_a = false;
    this.f_e = 0;
    }
    
    _a_0(string, n2, n3, n4) {
    this.var_java_lang_String_a = string;
    this.var_int_a = n2;
    this.f_b = n3;
    this.f_c = n4;
    this.f_d = -1;
    this.var_boolean_a = false;
    this.f_e = 0;
    }
    
    _void_a_1() {
    this.var_boolean_a = true;
    }
    
    _a_1(graphics, t2) {
    let n2 = 1;
    if (this.var_boolean_a) {
    n2 = 0;
    }
    let stringArray = null;
    if (this.f_c < 0) {
    this.a(n2, this.var_java_lang_String_a, this.var_int_a, this.f_b, 17);
    return;
    }
    if ((this.var_java_lang_String_a === t.var_java_lang_String_c) || (this.var_java_lang_String_a === t.var_java_lang_String_b)) {
    if (a.var_java_lang_String_arr_a != null) {
    stringArray = a.var_java_lang_String_arr_a;
    } else {
    a.var_java_lang_String_arr_a = stringArray = f.java_lang_String_arr_a(this.var_java_lang_String_a, this.f_c, n2);
    }
    } else {
    stringArray = f.java_lang_String_arr_a(this.var_java_lang_String_a, this.f_c, n2);
    }
    let n3 = this.f_b;
    let n4 = this.var_boolean_a ? 15 : 12;
    for (let i2 = 0; i2 < stringArray.length; ++i2) {
    this.a(n2, stringArray[i2], this.var_int_a, n3, 17);
    n3 += n4;
    }
    }
    
    _a_2(n2, string, n3, n4, n5) {
    if (this.var_boolean_a) {
    if (n4 + 15 < 0) {
    return;
    }
    if (n4 + 15 > this.f_d && this.f_d > -1) {
    return;
    }
    } else {
    if (n4 + 12 < 0) {
    return;
    }
    if (n4 + 12 > this.f_d && this.f_d > -1) {
    return;
    }
    }
    let n6 = 1;
    if (this.var_boolean_a) {
    n6 = 0;
    }
    e.a(n6, string, n3, n4, n5);
    }
    
    _a_3(string, t2) {
    let n2 = this.var_boolean_a ? 0 : 1;
    return e.a(n2, this.var_java_lang_String_a);
    }
    
    b(string, t2) {
    let n2 = 0;
    let n3 = n2 = this.var_boolean_a ? 15 : 12;
    if (this.f_c < 0) {
    return n2;
    }
    let n4 = 1;
    if (this.var_boolean_a) {
    n4 = 0;
    }
    let stringArray = f.java_lang_String_arr_a(string, this.f_c, n4);
    return (stringArray.length + 2) * n2;
    }
    
    l_a() {
    return new f(this.var_java_lang_String_a, this.var_int_a, this.f_b, this.f_c, this.var_boolean_a, this.f_e, this.f_d);
    }
    
    static java_lang_String_arr_a(string, n2, n3) {
    let vector = [];
    let n4 = 0;
    let n5 = 0;
    let n6 = 1;
    let n7 = 0;
    let n8 = 0;
    while (n4 < string.length) {
    let bl = false;
    if (n7 < string.length) {
    let code = string.charCodeAt(n7);
    if (code === 124) {
    bl = true;
    }
    if (code === 32) {
    n6 = n7;
    }
    n8 += e.a(n3, code) + e.var_byte_arr_b[n3];
    }
    if (n8 > n2 || bl || n7 >= string.length) {
    n5 = n7;
    if (n8 > n2) {
    n5 = n6;
    }
    if (n4 > n5) {
    n5 = n4 + 2;
    }
    vector.push(string.substring(n4, n5));
    n4 = n5 + 1;
    n7 = n5;
    n8 = 0;
    }
    ++n7;
    }
    let objectArray = new Array(vector.length).fill("");
    for (let _ci = 0; _ci < vector.length; _ci++) objectArray[_ci] = vector[_ci];
    return objectArray;
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
        if (args.length === 2) {
            if (typeof args[0] === 'string') return f.prototype._a_3.apply(this, args);
            return f.prototype._a_1.apply(this, args);
        }
        if (args.length === 4) return f.prototype._a_0.apply(this, args);
        if (args.length === 5) return f.prototype._a_2.apply(this, args);
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
