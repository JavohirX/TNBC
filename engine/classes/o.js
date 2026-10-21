export class o extends l {
    var_javax_microedition_lcdui_Image_a = null;
    var_int_a = 0;
    f_b = 0;
    f_c = 0;
    f_d = 0;
    
    _init_0() {
    }
    
    _init_5(image, n2, n3, n4, n5) {
    this.var_javax_microedition_lcdui_Image_a = image;
    this.var_int_a = n2;
    this.f_b = n3;
    this.f_c = n4;
    this.f_d = n5;
    }
    
    _a_0(image, n2, n3, n4, n5) {
    this.var_javax_microedition_lcdui_Image_a = image;
    this.var_int_a = n2;
    this.f_b = n3;
    this.f_c = n4;
    this.f_d = n5;
    }
    
    int_a() {
    return this.var_javax_microedition_lcdui_Image_a.getWidth();
    }
    
    _a_1(graphics, t2) {
    switch (this.f_c) {
    case 0: {
    switch (this.f_d) {
    case 0: {
    graphics.drawImage(this.var_javax_microedition_lcdui_Image_a, this.var_int_a, this.f_b, 20);
    break;
    }
    case 1: {
    graphics.drawImage(this.var_javax_microedition_lcdui_Image_a, this.var_int_a, this.f_b, 6);
    break;
    }
    case 2: {
    graphics.drawImage(this.var_javax_microedition_lcdui_Image_a, this.var_int_a, this.f_b, 36);
    }
    }
    return;
    }
    case 1: {
    switch (this.f_d) {
    case 0: {
    graphics.drawImage(this.var_javax_microedition_lcdui_Image_a, this.var_int_a, this.f_b, 17);
    break;
    }
    case 1: {
    graphics.drawImage(this.var_javax_microedition_lcdui_Image_a, this.var_int_a, this.f_b, 3);
    break;
    }
    case 2: {
    graphics.drawImage(this.var_javax_microedition_lcdui_Image_a, this.var_int_a, this.f_b, 33);
    }
    }
    return;
    }
    case 2: {
    switch (this.f_d) {
    case 0: {
    graphics.drawImage(this.var_javax_microedition_lcdui_Image_a, this.var_int_a, this.f_b, 24);
    return;
    }
    case 1: {
    graphics.drawImage(this.var_javax_microedition_lcdui_Image_a, this.var_int_a, this.f_b, 10);
    return;
    }
    case 2: {
    graphics.drawImage(this.var_javax_microedition_lcdui_Image_a, this.var_int_a, this.f_b, 40);
    }
    }
    }
    }
    }
    
    l_a() {
    return new o(this.var_javax_microedition_lcdui_Image_a, this.var_int_a, this.f_b, this.f_c, this.f_d);
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
