export class p extends l {
    f_a = 0;
    f_b = 0;
    f_c = 0;
    f_d = 0;
    f_e = 0;
    f_f = 0;
    f_g = 0;
    
    _init_0() {
    }
    
    _init_7(n2, n3, n4, n5, n6, n7, n8) {
    this.f_a = n2;
    this.f_b = n3;
    this.f_c = n4;
    this.f_d = n5;
    this.f_e = n6;
    this.f_f = n7;
    this.f_g = n8;
    }
    
    _a_0(graphics, t2) {
    graphics.setColor(this.f_e, this.f_f, this.f_g);
    graphics.drawLine(this.f_a, this.f_b, this.f_c, this.f_d);
    }
    
    _a_1(n2, n3, n4) {
    this.f_e = n2;
    this.f_f = n3;
    this.f_g = n4;
    }
    
    l_a() {
    return new p(this.f_a, this.f_b, this.f_c, this.f_d, this.f_e, this.f_f, this.f_g);
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
