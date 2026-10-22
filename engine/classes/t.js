export class t extends FullCanvas {
    static var_int_a = 0;
    static var_int_b = 0;
    static var_int_c = 0;
    static var_int_d = 0;
    var_int_e = 0;
    var_int_f = 0;
    var_int_g = 0;
    var_int_h = 0;
    static var_java_lang_String_a = null;
    var_n_a = new n(this);
    var_a_a = new a(this.var_n_a, this);
    static var_int_i = 0;
    var_boolean_a = false;
    var_boolean_b = false;
    var_int_j = 0;
    f_k = 0;
    f_l = 0;
    var_boolean_arr_a = new Array(100).fill(false);
    var_short_arr_a = new Int16Array(100);
    var_short_arr_b = new Int16Array(100);
    f_m = -1;
    var_short_arr_c = new Int16Array(100);
    var_short_arr_d = new Int16Array(100);
    var_javax_microedition_lcdui_Image_a = null;
    var_javax_microedition_lcdui_Image_b = null;
    var_javax_microedition_lcdui_Image_c = null;
    var_javax_microedition_lcdui_Image_d = null;
    var_javax_microedition_lcdui_Image_e = null;
    var_javax_microedition_lcdui_Image_f = null;
    var_javax_microedition_lcdui_Image_g = null;
    var_javax_microedition_lcdui_Image_h = null;
    var_java_util_Timer_a = null;
    var_s_a = null;
    static var_java_lang_String_b = null;
    static var_java_lang_String_c = null;
    static f_n = 0;
    static var_byte_a = 0;
    static var_java_lang_String_arr_a = null;
    static var_javax_microedition_lcdui_Image_arr_a = null;
    static var_javax_microedition_lcdui_Image_i = null;
    static f_o = 0;
    static f_p = 0;
    static f_q = 0;
    static f_r = 0;
    static var_java_lang_String_d = null;
    static var_java_lang_String_e = null;
    static f_s = 0;
    static var_boolean_c = false;
    static var_boolean_d = false;
    static var_boolean_e = false;
    static var_javax_microedition_lcdui_Image_j = null;
    static var_boolean_f = false;
    var_java_lang_StringBuffer_a = new StringBuffer(3);
    var_boolean_i = false;
    static var_boolean_j = false;
    static var_java_lang_String_arr_b = null;
    static var_java_lang_String_arr_c = null;
    static var_java_lang_String_f = null;
    static var_boolean_g = false;
    static var_boolean_h = false;
    static var_java_lang_String_arr_d = null;
    
    constructor() {
        super();
    this.setFullScreenMode(true);
    try {
    Thread.sleep(500);
    }
    catch (exception) {}
    this.a();
    /* gc */
    }
    
    _a_0() {
    t.var_int_a = this.getWidth();
    t.var_int_b = this.getHeight();
    t.var_int_c = 20;
    t.var_int_d = 37;
    this.var_int_e = t.var_int_c / 2;
    this.var_int_f = (t.var_int_b - (r.var_int_b - 1) * t.var_int_c) / 2;
    this.var_int_g = t.var_int_a - r.var_int_a * t.var_int_c >> 1;
    this.var_int_h = 40;
    }
    
    keyPressed(n2) {
    let n3 = n2;
    if (t.var_boolean_j) {
    if (this.var_a_a.var_int_a != 2 && a.var_int_c != 2 && t.var_int_i == 2) {
    this.t();
    }
    t.var_boolean_j = false;
    }
    if (this.var_boolean_i) {
    this.var_java_lang_StringBuffer_a += String.fromCharCode(n2);
    if (this.var_java_lang_StringBuffer_a.length == 10 || n2 == 49) {
    let string = this.var_java_lang_StringBuffer_a.toString();
    this.a(string);
    this.var_java_lang_StringBuffer_a = "";
    this.var_boolean_i = false;
    }
    } else if (n2 == 48) {
    this.var_boolean_i = true;
    }
    if (n2 == -6) {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 0x40);
    return;
    }
    if (n2 == -7) {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 0x80);
    if (this.var_int_j == 1 && this.var_n_a.var_boolean_e) {
    this.C();
    }
    return;
    }
    let n4 = this.getGameAction(n3);
    switch (n4) {
    case 1: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 1);
    return;
    }
    case 6: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 4);
    return;
    }
    case 2: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 8);
    return;
    }
    case 5: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 2);
    return;
    }
    case 8: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 0x10);
    return;
    }
    }
    switch (n2) {
    case 50: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 1);
    return;
    }
    case 52: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 8);
    return;
    }
    case 53: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 0x10);
    return;
    }
    case 54: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 2);
    return;
    }
    case 56: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 4);
    return;
    }
    case 35:
    case 42: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a | 0x20);
    }
    }
    }
    
    keyReleased(n2) {
    let n3 = n2;
    if (n2 == -6) {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFBF);
    return;
    }
    if (n2 == -7) {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFF7F);
    return;
    }
    switch (this.getGameAction(n3)) {
    case 1: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFFE);
    return;
    }
    case 6: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFFB);
    return;
    }
    case 2: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFF7);
    return;
    }
    case 5: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFFD);
    return;
    }
    case 8: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFEF);
    return;
    }
    }
    switch (n2) {
    case 50: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFFE);
    return;
    }
    case 52: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFF7);
    return;
    }
    case 53: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFEF);
    return;
    }
    case 54: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFFD);
    return;
    }
    case 56: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFFB);
    return;
    }
    case 35:
    case 42: {
    this.var_n_a.var_short_a = (this.var_n_a.var_short_a & 0xFFFFFFDF);
    }
    }
    }
    
    b() {
    this.var_n_a.j();
    this.var_javax_microedition_lcdui_Image_c = null;
    let f2 = new f();
    let d2 = new d();
    f2.void_a(t.var_java_lang_String_arr_b[16], t.var_int_a >> 1, t.var_int_b >> 1);
    d2.a(0, 0, t.var_int_a, t.var_int_b, 0, 0, 0);
    this.var_n_a.a(d2, 3);
    f2.void_a();
    d2.a(f2.var_int_a - f2.a(f2.var_java_lang_String_a, this) / 2 - 4, f2.f_b - 8, f2.var_int_a + f2.a(f2.var_java_lang_String_a, this) / 2 + 4, f2.f_b + f2.b(f2.var_java_lang_String_a, this) + 4, 0, 0, 0);
    this.var_n_a.a(f2, 3);
    let p2 = new p();
    p2.a(255, 255, 0);
    p2.f_a = d2.f_a - 1;
    p2.f_b = d2.f_b - 1;
    p2.f_c = p2.f_a;
    p2.f_d = d2.f_b + d2.f_d;
    this.var_n_a.a(p2, 3);
    p2.f_a = d2.f_a + d2.f_c;
    p2.f_b = d2.f_b - 1;
    p2.f_c = p2.f_a;
    p2.f_d = d2.f_b + d2.f_d;
    this.var_n_a.a(p2, 3);
    p2.f_a = d2.f_a - 1;
    p2.f_b = d2.f_b - 1;
    p2.f_c = d2.f_a + d2.f_c;
    p2.f_d = p2.f_b;
    this.var_n_a.a(p2, 3);
    p2.f_a = d2.f_a - 1;
    p2.f_b = d2.f_b + d2.f_d;
    p2.f_c = d2.f_a + d2.f_c;
    p2.f_d = p2.f_b;
    this.var_n_a.a(p2, 3);
    this.c();
    }
    
    c() {
    if (t.var_int_i == 2) {
    this.repaint();
    this.serviceRepaints();
    return;
    }
    }
    
    paint(graphics) {
    let n2 = 0;
    e.var_javax_microedition_lcdui_Graphics_a = graphics;
    graphics.setClip(0, 0, t.var_int_a, t.var_int_b);
    if (t.var_boolean_h) {
    this.var_n_a.j();
    this.a(graphics);
    this.hideNotify();
    return;
    }
    if (this.var_javax_microedition_lcdui_Image_c != null) {
    graphics.setColor(255, 255, 255);
    graphics.fillRect(0, 0, t.var_int_a, t.var_int_b);
    graphics.drawImage(this.var_javax_microedition_lcdui_Image_c, t.var_int_a / 2, t.var_int_b / 2, 3);
    this.var_javax_microedition_lcdui_Image_c = null;
    }
    if (a.var_int_c == 12 && t.var_javax_microedition_lcdui_Image_arr_a != null) {
    graphics.setColor(0);
    graphics.setClip(0, 0, t.var_int_a, t.var_int_b);
    graphics.fillRect(0, 0, t.var_int_a, t.var_int_b);
    n2 = t.f_r;
    for (let i2 = 0; i2 < t.var_javax_microedition_lcdui_Image_arr_a.length; ++i2) {
    graphics.drawImage(t.var_javax_microedition_lcdui_Image_arr_a[i2], t.f_q, n2, 20);
    n2 += t.var_int_c;
    }
    graphics.drawImage(t.var_javax_microedition_lcdui_Image_i, 1, t.var_int_b - t.var_javax_microedition_lcdui_Image_i.getHeight() - 1, 20);
    }
    if (this.var_int_j == 1 && this.var_int_f > 0 && this.var_n_a.var_boolean_e) {
    graphics.setColor(0);
    graphics.fillRect(0, t.var_int_b - this.var_int_f + t.var_int_c, t.var_int_a, this.var_int_f);
    }
    for (n2 = 0; n2 < 4; ++n2) {
    let lArray = this.var_n_a.var_l_arr_arr_a[n2];
    for (let i3 = 0; i3 < this.var_n_a.var_int_arr_a[n2]; ++i3) {
    lArray[i3].a(graphics, this);
    graphics.setClip(0, 0, t.var_int_a, t.var_int_b);
    }
    }
    this.var_n_a.j();
    if (t.var_boolean_g) {
    graphics.setColor(0xFF0000);
    graphics.drawString("C", t.var_int_a, 0, 24);
    }
    }
    
    d() {
    this.var_n_a.var_boolean_d = false;
    this.var_n_a.var_int_a = 0;
    this.var_n_a.var_int_b = 0;
    }
    
    e() {
    this.var_n_a.var_boolean_d = true;
    }
    
    f() {
    this.var_n_a.var_boolean_d = false;
    }
    
    g() {
    if (t.var_int_i == 1) {
    if (this.var_java_util_Timer_a != null) {
    this.var_java_util_Timer_a.cancel();
    this.var_java_util_Timer_a = null;
    }
    return;
    }
    if (t.var_int_i == 2) {
    if (this.var_int_j == 1) {
    if (this.var_boolean_b) {
    this.C();
    }
    if (this.var_n_a.var_boolean_j) {
    this.var_int_j = 0;
    this.f();
    if (this.var_n_a.var_boolean_k) {
    this.var_a_a.void_a(3);
    if (n.var_boolean_a) {
    j.a(2);
    return;
    }
    } else {
    this.var_a_a.void_a(4);
    if (n.var_boolean_a) {
    j.a(1);
    }
    }
    return;
    }
    this.var_n_a.d();
    } else {
    this.var_a_a.c();
    }
    }
    this.repaint();
    this.serviceRepaints();
    }
    
    A() {
    try {
    let n2 = 0;
    let inputStream = ResourceManager.getResourceAsStream("/levels.dat");
    for (n2 = 0; n2 < 100; ++n2) {
    this.var_short_arr_d[n2] = inputStream.read();
    }
    for (n2 = 0; n2 < 100; ++n2) {
    this.var_short_arr_c[n2] = inputStream.read();
    }
    inputStream.close();
    return;
    }
    catch (exception) {
    console.error(exception + " : " + exception.message);
    return;
    }
    }
    
    h() {
    t.var_int_i = 2;
    this.q();
    t.y();
    this.A();
    this.D();
    this.B();
    let n2 = this.var_javax_microedition_lcdui_Image_h.getHeight();
    let n3 = t.var_int_b - n2 - 16;
    t.f_o = Math.floor(n3 / 12);
    t.f_p = 16 + t.f_o * 12;
    if (this.var_java_util_Timer_a == null) {
    this.var_java_util_Timer_a = new Timer();
    this.var_s_a = new s(this);
    this.var_java_util_Timer_a.schedule(this.var_s_a, 0);
    }
    }
    
    hideNotify() {
    this.i();
    }
    
    showNotify() {
    this.j();
    }
    
    i() {
    if (this.var_java_util_Timer_a != null) {
    this.var_java_util_Timer_a.cancel();
    this.var_java_util_Timer_a = null;
    }
    if (this.var_int_j == 1) {
    this.f();
    a.var_int_c = 2;
    }
    let n2 = j.var_int_a;
    j.a();
    j.var_int_a = n2;
    t.var_int_i = 1;
    t.var_boolean_j = true;
    }
    
    j() {
    if (this.var_int_j != 1) {
    this.var_a_a.void_a(a.var_int_c);
    } else {
    this.k();
    }
    t.var_int_i = 2;
    this.var_n_a.var_r_a.f();
    if (this.var_java_util_Timer_a == null) {
    this.var_java_util_Timer_a = new Timer();
    this.var_s_a = new s(this);
    this.var_java_util_Timer_a.schedule(this.var_s_a, 0);
    }
    }
    
    k() {
    this.var_boolean_b = true;
    }
    
    l() {
    t.a(t.var_byte_a);
    this.b();
    /* gc */
    try {
    this.var_javax_microedition_lcdui_Image_b = Image.createImage("/32x32TileSet.png");
    /* gc */
    this.var_javax_microedition_lcdui_Image_a = Image.createImage("/16x16TileSet.png");
    this.var_javax_microedition_lcdui_Image_f = Image.createImage("/levelSelect.png");
    this.var_javax_microedition_lcdui_Image_g = Image.createImage("/menuBottom.png");
    /* gc */
    }
    catch (iOException) {}
    /* gc */
    }
    
    B() {
    let n2 = 0;
    this.var_a_a.void_a(-3);
    this.f_k = 0;
    this.f_l = 5;
    for (n2 = 0; n2 < 100; ++n2) {
    if (!this.var_boolean_arr_a[n2]) continue;
    this.f_m = n2;
    }
    for (n2 = 0; n2 < 100; ++n2) {
    if (this.var_boolean_arr_a[n2]) continue;
    this.f_k = n2;
    return;
    }
    }
    
    C() {
    this.f();
    if (this.var_int_j == 1) {
    this.var_a_a.void_a(2);
    let n2 = j.var_int_a;
    j.a();
    j.var_int_a = n2;
    }
    this.var_boolean_b = false;
    }
    
    m() {
    this.var_n_a.var_r_a.f();
    this.var_n_a.var_boolean_f = this.var_n_a.var_boolean_e;
    this.var_a_a.var_java_lang_String_a = t.var_java_lang_String_arr_b[0];
    this.var_a_a.var_java_lang_String_b = t.var_java_lang_String_arr_c[18];
    this.var_int_j = 1;
    this.var_n_a.var_short_a = 0;
    if (t.var_int_i == 2) {
    this.t();
    this.e();
    }
    }
    
    n() {
    this.f_l = 5;
    let n2 = 0;
    let bl = false;
    do {
    bl = false;
    n2 = 0;
    for (let i2 = this.f_l - 5; i2 < this.f_l; ++i2) {
    if (!this.var_boolean_arr_a[i2]) continue;
    ++n2;
    }
    if (n2 <= 2 || this.f_l > 95) continue;
    this.f_l += 5;
    bl = true;
    } while (bl);
    }
    
    o() {
    try {
    let inputStream = ResourceManager.getResourceAsStream("/replay" + this.f_k + ".rpl");
    inputStream.read(this.var_n_a.var_q_a.var_byte_arr_a, 0, 600);
    inputStream.close();
    return;
    }
    catch (exception) {
    return;
    }
    }
    
    p() {
    try {
    let recordStore = RecordStore.openRecordStore("SaveData", true);
    let byArray = new Int8Array(403);
    if (recordStore.getNumRecords() < 1) {
    recordStore.addRecord(byArray, 0, byArray.length);
    }
    for (let i2 = 0; i2 < 100; ++i2) {
    if (t.var_boolean_d) {
    byArray[i2 * 4] = 0;
    byArray[i2 * 4 + 1] = 0;
    } else {
    byArray[i2 * 4] = (this.var_short_arr_a[i2] >> 8);
    byArray[i2 * 4 + 1] = this.var_short_arr_a[i2];
    }
    byArray[i2 * 4 + 2] = (this.var_short_arr_b[i2] >> 8);
    byArray[i2 * 4 + 3] = this.var_short_arr_b[i2];
    }
    byArray[byArray.length - 1] = this.var_n_a.var_boolean_b ? 1 : 0;
    byArray[byArray.length - 2] = n.var_boolean_a ? 1 : 0;
    byArray[byArray.length - 3] = t.var_byte_a;
    recordStore.setRecord(1, byArray, 0, byArray.length);
    recordStore.closeRecordStore();
    return;
    }
    catch (exception) {
    return;
    }
    }
    
    q() {
    try {
    let recordStore = RecordStore.openRecordStore("SaveData", true);
    let byArray = new Int8Array(403);
    if (recordStore.getNumRecords() < 1) {
    byArray[byArray.length - 3] = -1;
    recordStore.addRecord(byArray, 0, byArray.length);
    t.var_boolean_f = true;
    }
    byArray = recordStore.getRecord(1);
    for (let i2 = 0; i2 < 100; ++i2) {
    this.var_short_arr_a[i2] = (byArray[i2 * 4] << 8);
    let n2 = i2;
    this.var_short_arr_a[n2] = (this.var_short_arr_a[n2] | (byArray[i2 * 4 + 1] & 0xFF));
    this.var_short_arr_b[i2] = (byArray[i2 * 4 + 2] << 8);
    let n3 = i2;
    this.var_short_arr_b[n3] = (this.var_short_arr_b[n3] | (byArray[i2 * 4 + 3] & 0xFF));
    this.var_boolean_arr_a[i2] = this.var_short_arr_a[i2] != 0;
    }
    this.var_n_a.var_boolean_b = byArray[byArray.length - 1] == 1;
    n.var_boolean_a = byArray[byArray.length - 2] == 1;
    t.var_byte_a = !t.var_boolean_f ? ((byArray[byArray.length - 3] << 24) >> 24) : -1;
    if (t.var_byte_a == -1) {
    t.var_boolean_f = true;
    }
    recordStore.closeRecordStore();
    return;
    }
    catch (exception) {
    return;
    }
    }
    
    r() {
    try {
    let recordStore = RecordStore.openRecordStore("SaveData", true);
    let byArray = new Int8Array(403);
    if (recordStore.getNumRecords() < 1) {
    recordStore.addRecord(byArray, 0, byArray.length);
    }
    for (let i2 = 0; i2 < 402; ++i2) {
    byArray[i2] = 0;
    }
    byArray[402] = t.var_byte_a;
    byArray[byArray.length - 2] = (n.var_boolean_a ? 1 : 0);
    byArray[byArray.length - 1] = (this.var_n_a.var_boolean_b ? 1 : 0);
    byArray[byArray.length - 3] = t.var_byte_a;
    this.f_k = 0;
    this.f_m = -1;
    this.f_l = 5;
    recordStore.setRecord(1, byArray, 0, byArray.length);
    recordStore.closeRecordStore();
    this.q();
    return;
    }
    catch (exception) {
    return;
    }
    }
    
    s() {
    this.var_n_a.k();
    this.E();
    t.var_int_i = 1;
    this.var_int_j = 2;
    GMIDlet.var_GMIDlet_a.destroyApp(true);
    GMIDlet.var_GMIDlet_a.notifyDestroyed();
    }
    
    t() {
    if (n.var_boolean_a) {
    j.a(j.var_int_a);
    }
    }
    
    u() {
    if (this.var_boolean_a) {
    return;
    }
    this.b();
    /* gc */
    try {
    let dataInputStream = ResourceManager.getResourceAsStream("/m");
    j.a(dataInputStream);
    dataInputStream.close();
    this.var_boolean_a = true;
    return;
    }
    catch (exception) {
    return;
    }
    }
    
    v() {
    this.var_boolean_a = false;
    }
    
    D() {
    /* gc */
    try {
    this.var_javax_microedition_lcdui_Image_d = Image.createImage("/splash.png");
    this.var_javax_microedition_lcdui_Image_e = Image.createImage("/mDisneyLogo.png");
    this.var_javax_microedition_lcdui_Image_h = Image.createImage("/softKeys.png");
    /* gc */
    return;
    }
    catch (iOException) {
    return;
    }
    }
    
    w() {
    this.var_javax_microedition_lcdui_Image_d = null;
    this.var_javax_microedition_lcdui_Image_e = null;
    /* gc */
    }
    
    E() {
    this.var_javax_microedition_lcdui_Image_d = null;
    this.var_javax_microedition_lcdui_Image_e = null;
    this.var_javax_microedition_lcdui_Image_c = null;
    this.var_javax_microedition_lcdui_Image_f = null;
    this.var_javax_microedition_lcdui_Image_h = null;
    this.var_javax_microedition_lcdui_Image_a = null;
    this.var_javax_microedition_lcdui_Image_b = null;
    this.v();
    }
    
    static _a_1(n2) {
    block7: {
    if (n2 === undefined || n2 === null || isNaN(n2) || n2 < 0) {
    n2 = 0;
    t.var_byte_a = -1;
    } else {
    t.var_byte_a = n2;
    }
    if (!t.var_java_lang_String_arr_a || !t.var_java_lang_String_arr_a.length) {
    t.var_java_lang_String_arr_a = ["en", "ru"];
    }
    if (n2 >= t.var_java_lang_String_arr_a.length) {
    n2 = 0;
    }
    let lang = t.var_java_lang_String_arr_a[n2] || "en";
    let string = "/text__" + lang + ".txt";
    t.var_java_lang_String_b = null;
    t.var_java_lang_String_c = null;
    t.var_java_lang_String_arr_b = null;
    t.var_java_lang_String_arr_c = null;
    /* gc */
    try {
    let n3 = 0;
    let dataInputStream = ResourceManager.getResourceAsStream(string);
    dataInputStream.skipBytes(2);
    t.var_java_lang_String_b = dataInputStream.readUTF().toUpperCase();
    if (t.var_boolean_d) {
    t.var_java_lang_String_b = "- DEMO -||" + t.var_java_lang_String_b;
    }
    t.var_java_lang_String_b = t.var_java_lang_String_b + " " + t.var_java_lang_String_a;
    dataInputStream.skipBytes(2);
    t.var_java_lang_String_c = dataInputStream.readUTF();
    let n4 = dataInputStream.readShort();
    t.var_java_lang_String_arr_b = new Array(n4).fill("");
    for (n3 = 0; n3 < n4; ++n3) {
    t.var_java_lang_String_arr_b[n3] = dataInputStream.readUTF();
    }
    n4 = dataInputStream.readShort();
    t.var_java_lang_String_arr_c = new Array(n4).fill("");
    for (n3 = 0; n3 < n4; ++n3) {
    t.var_java_lang_String_arr_c[n3] = dataInputStream.readUTF();
    }
    dataInputStream.close();
    t.var_java_lang_String_arr_b[32] = t.var_java_lang_String_arr_c[19];
    t.x();
    }
    catch (exception) {
    if (n2 == 0) break block7;
    t.a(0);
    }
    }
    e.a(((GMIDlet.var_GMIDlet_a)).getClass());
    }
    
    static x() {
    try {
    let by = t.var_byte_a;
    if (by === undefined || by == -1 || !t.var_java_lang_String_arr_a || by >= t.var_java_lang_String_arr_a.length) {
    by = 0;
    }
    if (!t.var_java_lang_String_arr_a || !t.var_java_lang_String_arr_a.length) {
    t.var_java_lang_String_arr_a = ["en", "ru"];
    }
    let lang = t.var_java_lang_String_arr_a[by] || "en";
    let string = "/sp__" + lang;
    let dataInputStream = ResourceManager.getResourceAsStream(string);
    let s2 = dataInputStream.readShort();
    let byArray = new Int8Array(s2);
    dataInputStream.readFully(byArray);
    dataInputStream.close();
    t.var_javax_microedition_lcdui_Image_j = Image.createImage(byArray, 0, s2);
    return;
    }
    catch (exception) {
    return;
    }
    }
    
    static y() {
    try {
    let dataInputStream = ResourceManager.getResourceAsStream("/lang");
    t.var_java_lang_String_arr_a = GMIDlet.a(dataInputStream);
    t.f_n = t.var_java_lang_String_arr_a.length;
    try {
    let by = t.var_byte_a;
    if (by == -1) {
    by = 0;
    }
    let string = "demoMsg__" + t.var_java_lang_String_arr_a[by].toLowerCase();
    let string2 = "demoURL__" + t.var_java_lang_String_arr_a[by].toLowerCase();
    while (true) {
    let string3 = 0;
    if ("portalURL".equals(string3 = dataInputStream.readUTF()) && (t.var_java_lang_String_f = dataInputStream.readUTF()) != null && !(t.var_java_lang_String_f === "")) {
    t.var_boolean_c = true;
    }
    if ((string === string3)) {
    t.var_java_lang_String_d = dataInputStream.readUTF();
    if (t.var_java_lang_String_d == null || (t.var_java_lang_String_d === "")) continue;
    t.var_boolean_d = true;
    continue;
    }
    if (!(string2 === string3) || (t.var_java_lang_String_e = dataInputStream.readUTF()) == null || (t.var_java_lang_String_e === "")) continue;
    t.var_boolean_d = true;
    t.var_boolean_e = true;
    }
    }
    catch (exception) {
    dataInputStream.close();
    return;
    }
    }
    catch (exception) {
    return;
    }
    }
    
    static z() {
    let n2 = 0;
    if (t.f_n <= 1) {
    return;
    }
    let imageArray = new Array(t.var_java_lang_String_arr_a.length).fill(null);
    try {
    for (let i2 = 0; i2 < imageArray.length; ++i2) {
    let dataInputStream = ResourceManager.getResourceAsStream("/lp__" + t.var_java_lang_String_arr_a[i2]);
    let s2 = dataInputStream.readShort();
    let byArray = new Int8Array(s2);
    dataInputStream.readFully(byArray);
    dataInputStream.close();
    imageArray[i2] = Image.createImage(byArray, 0, byArray.length);
    }
    let dataInputStream = ResourceManager.getResourceAsStream("/lpok");
    let s3 = dataInputStream.readShort();
    n2 = s3;
    let byArray = new Int8Array(s3);
    dataInputStream.readFully(byArray);
    dataInputStream.close();
    t.var_javax_microedition_lcdui_Image_i = Image.createImage(byArray, 0, byArray.length);
    t.var_javax_microedition_lcdui_Image_arr_a = imageArray;
    }
    catch (exception) {}
    let n3 = t.f_n * t.var_int_c;
    n2 = 0;
    for (let i3 = 0; i3 < t.var_javax_microedition_lcdui_Image_arr_a.length; ++i3) {
    if (t.var_javax_microedition_lcdui_Image_arr_a[i3].getWidth() <= n2) continue;
    n2 = t.var_javax_microedition_lcdui_Image_arr_a[i3].getWidth();
    }
    t.f_q = t.var_int_a - n2 >> 1;
    t.f_r = t.var_int_b - n3 >> 1;
    }
    
    _a_2(string) {
    if ((string === "0001")) {
    t.var_boolean_g = !t.var_boolean_g;
    return;
    }
    if (t.var_boolean_g) {
    if ((string === "561")) {
    this.var_n_a.var_boolean_k = true;
    this.var_n_a.var_boolean_j = true;
    return;
    }
    if ((string === "2551")) {
    for (let i2 = 0; i2 < this.var_short_arr_a.length; ++i2) {
    this.var_boolean_arr_a[i2] = true;
    if (this.var_short_arr_a[i2] == 0) {
    this.var_short_arr_a[i2] = 999;
    }
    if (this.var_short_arr_b[i2] != 0) continue;
    this.var_short_arr_b[i2] = 5940;
    }
    this.p();
    return;
    }
    if ((string === "2561")) {
    for (let i3 = 0; i3 < this.var_short_arr_a.length; ++i3) {
    this.var_boolean_arr_a[i3] = true;
    this.var_short_arr_a[i3] = (this.var_short_arr_c[i3] - 1);
    this.var_short_arr_b[i3] = (this.var_short_arr_d[i3] - 1);
    }
    this.p();
    return;
    }
    if ((string === "721")) {
    if (t.var_boolean_h) {
    this.sizeChanged(240, 320);
    return;
    }
    this.sizeChanged(320, 240);
    }
    }
    }
    
    sizeChanged(n2, n3) {
    if (n2 == 320 && n3 == 240) {
    t.var_boolean_h = true;
    let string = t.var_java_lang_String_arr_b != null && t.var_java_lang_String_arr_b[33] != null ? t.var_java_lang_String_arr_b[33] : "Please close the slide to continue the game - it may not work properly in landscape view";
    t.var_java_lang_String_arr_d = f.java_lang_String_arr_a(string, this.getWidth() - 16, 0);
    return;
    }
    t.var_boolean_h = false;
    this.showNotify();
    }
    
    _a_3(graphics) {
    let n2 = this.getWidth();
    let n3 = this.getHeight();
    graphics.setClip(0, 0, n2, n3);
    graphics.setColor(0);
    graphics.fillRect(0, 0, n2, n3);
    let n4 = n3 - e.a(0) * t.var_java_lang_String_arr_d.length >> 1;
    for (let i2 = 0; i2 < t.var_java_lang_String_arr_d.length; ++i2) {
    e.a(0, t.var_java_lang_String_arr_d[i2], n2 >> 1, n4, 17);
    n4 += e.a(0);
    }
    }
    
    static {
        t.var_java_lang_String_b = new String();
        t.var_java_lang_String_c = new String();
        t.f_n = 1;
        t.var_byte_a = -1;
        t.f_s = 5;
        t.var_boolean_c = false;
        t.var_boolean_d = false;
        t.var_boolean_e = false;
        t.var_boolean_f = false;
        t.var_boolean_j = false;
        t.var_java_lang_String_f = "";
        t.var_boolean_g = false;
        t.var_boolean_h = false;
    }

    static a(...args) {
        return t._a_1(...args);
    }
    a(...args) {
        if (args.length === 0) return t.prototype._a_0.apply(this, args);
        if (args.length === 1) {
            if (typeof args[0] === 'number') return t._a_1(args[0]);
            if (typeof args[0] === 'string') return t.prototype._a_2.apply(this, args);
            return t.prototype._a_3.apply(this, args);
        }
        return t.prototype._a_0.apply(this, args);
    }
}
