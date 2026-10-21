export class g {
    var_int_a = 0;
    var_int_b = -1;
    var_i_a = null;
    var_i_b = null;
    f_c = null;
    
    _void_a_0() {
    while (this.var_int_a > 0) {
    this.void_a(this.f_c);
    }
    }
    
    b() {
    this.var_int_b = -1;
    this.var_i_a = null;
    }
    
    boolean_a() {
    if (this.var_int_b < this.var_int_a - 1 && this.var_int_b > -1) {
    ++this.var_int_b;
    this.var_i_a = this.var_i_a.var_i_b;
    return true;
    }
    if (this.var_int_b == -1) {
    ++this.var_int_b;
    this.var_i_a = this.var_i_b;
    return true;
    }
    return false;
    }
    
    _void_a_1(i2) {
    if (i2.var_i_a != null && i2.var_i_b != null) {
    i2.var_i_a.var_i_b = i2.var_i_b;
    i2.var_i_b.var_i_a = i2.var_i_a;
    this.b();
    i2.f();
    i2.var_i_a = null;
    i2.var_i_b = null;
    --this.var_int_a;
    return;
    }
    if (i2.var_i_a == null && i2.var_i_b == null) {
    this.var_i_b = null;
    this.f_c = null;
    this.b();
    i2.f();
    i2.var_i_a = null;
    i2.var_i_b = null;
    this.var_int_a = 0;
    return;
    }
    if (i2 == this.f_c) {
    i2.var_i_a.var_i_b = null;
    this.f_c = i2.var_i_a;
    this.b();
    i2.f();
    i2.var_i_a = null;
    i2.var_i_b = null;
    --this.var_int_a;
    return;
    }
    if (i2 == this.var_i_b) {
    i2.var_i_b.var_i_a = null;
    this.var_i_b = i2.var_i_b;
    this.b();
    i2.f();
    i2.var_i_a = null;
    i2.var_i_b = null;
    --this.var_int_a;
    }
    }
    
    c() {
    let i2 = this.var_i_a;
    if (i2.var_i_a != null && i2.var_i_b != null) {
    i2.var_i_a.var_i_b = i2.var_i_b;
    i2.var_i_b.var_i_a = i2.var_i_a;
    this.var_i_a = i2.var_i_a;
    --this.var_int_b;
    i2.f();
    i2.var_i_a = null;
    i2.var_i_b = null;
    --this.var_int_a;
    return;
    }
    if (i2.var_i_a == null && i2.var_i_b == null) {
    this.var_i_b = null;
    this.f_c = null;
    this.var_i_a = i2.var_i_a;
    --this.var_int_b;
    this.var_int_b = -1;
    i2.f();
    i2.var_i_a = null;
    i2.var_i_b = null;
    this.var_int_a = 0;
    return;
    }
    if (i2 == this.f_c) {
    i2.var_i_a.var_i_b = null;
    this.f_c = i2.var_i_a;
    this.var_i_a = i2.var_i_a;
    --this.var_int_b;
    i2.f();
    i2.var_i_a = null;
    i2.var_i_b = null;
    --this.var_int_a;
    return;
    }
    if (i2 == this.var_i_b) {
    i2.var_i_b.var_i_a = null;
    this.var_i_b = i2.var_i_b;
    this.var_i_a = i2.var_i_a;
    --this.var_int_b;
    i2.f();
    i2.var_i_a = null;
    i2.var_i_b = null;
    --this.var_int_a;
    }
    }
    
    i_a(i2) {
    if (this.var_int_a == 0) {
    this.var_i_b = i2;
    }
    i2.var_i_a = this.f_c;
    i2.var_i_b = null;
    if (this.f_c != null) {
    this.f_c.var_i_b = i2;
    }
    this.f_c = i2;
    ++this.var_int_a;
    return i2;
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
