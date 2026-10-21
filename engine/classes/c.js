export class c extends l {
    f_a = 0;
    f_b = 0;
    f_c = 0;
    f_d = 0;
    f_e = 0;
    f_f = 0;
    f_g = 0;
    f_h = 0;
    f_i = 0;
    
    _init_0() {
    }
    
    _init_9(n2, n3, n4, n5, n6, n7, n8, n9, n10) {
    this.f_a = n2;
    this.f_b = n3;
    this.f_c = n4;
    this.f_d = n5;
    this.f_e = n6;
    this.f_f = n7;
    this.f_g = n8;
    this.f_h = n9;
    this.f_i = n10;
    }
    
    _a_0(graphics, t2) {
    let n2 = this.f_a - this.f_c / 2;
    let n3 = this.f_b - this.f_c / 2;
    graphics.setColor(this.f_d, this.f_e, this.f_f);
    graphics.fillArc(n2, n3, this.f_c, this.f_c, 0, 360);
    graphics.setColor(this.f_g, this.f_h, this.f_i);
    graphics.drawArc(n2, n3, this.f_c, this.f_c, 0, 360);
    }
    
    _a_1(n2, n3, n4) {
    this.f_d = n2;
    this.f_e = n3;
    this.f_f = n4;
    }
    
    b(n2, n3, n4) {
    this.f_g = n2;
    this.f_h = n3;
    this.f_i = n4;
    }
    
    l_a() {
    return new c(this.f_a, this.f_b, this.f_c, this.f_d, this.f_e, this.f_f, this.f_g, this.f_h, this.f_i);
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
}
