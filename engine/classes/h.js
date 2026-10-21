export class h extends l {
    f_a = 0;
    f_b = 0;
    f_c = 0;
    f_d = 1;
    f_e = 1;
    
    a(graphics, t2) {
    let n2 = 0;
    let n3 = this.f_a;
    let n4 = n2 = this.f_d == 1 ? t.var_int_c : t.var_int_d;
    if (this.f_d == 1) {
    let n5 = Math.floor(t2.var_javax_microedition_lcdui_Image_a.getWidth() / t.var_int_c);
    let n6 = this.f_c % n5;
    let n7 = Math.floor(this.f_c / n5);
    graphics.setClip(n3, this.f_b, n2, t.var_int_c);
    graphics.drawImage(t2.var_javax_microedition_lcdui_Image_a, this.f_a - n6 * t.var_int_c, this.f_b - n7 * t.var_int_c, 20);
    return;
    }
    if (this.f_d == 2) {
    let n8 = Math.floor(t2.var_javax_microedition_lcdui_Image_b.getWidth() / t.var_int_d);
    let n9 = this.f_c % n8;
    let n10 = Math.floor(this.f_c / n8);
    graphics.setClip(n3, this.f_b, n2, t.var_int_d);
    graphics.drawImage(t2.var_javax_microedition_lcdui_Image_b, this.f_a - n9 * t.var_int_d, this.f_b - n10 * t.var_int_d, 20);
    }
    }
    
    l_a() {
    let h2 = new h();
    h2.f_a = this.f_a;
    h2.f_b = this.f_b;
    h2.f_c = this.f_c;
    h2.f_e = this.f_e;
    h2.f_d = this.f_d;
    return h2;
    }
}
