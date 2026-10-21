export class s {
    f_a = null;
    
    constructor(t2) {
    this.f_a = t2;
    }
    
    run() {
    let l2 = Date.now();
    this.f_a.g();
    l2 = Date.now() - l2;
    l2 = this.f_a.var_int_h - l2;
    if (l2 < 0) {
    l2 = 10;
    }
    if (this.f_a.var_java_util_Timer_a != null) {
    this.f_a.var_s_a = new s(this.f_a);
    this.f_a.var_java_util_Timer_a.schedule(this.f_a.var_s_a, l2);
    }
    }
}
