export class GMIDlet extends MIDlet {
    static var_GMIDlet_a = null;
    static var_t_a = null;
    static var_javax_microedition_lcdui_Display_a = null;
    static var_byte_a = 0;
    
    constructor() {
        super();
    GMIDlet.var_GMIDlet_a = this;
    GMIDlet.var_t_a = new t();
    t.var_java_lang_String_a = this.getAppProperty("MIDlet-Version");
    Display.getDisplay(this);
    t.var_int_i = 0;
    }
    
    startApp() {
    if (GMIDlet.var_javax_microedition_lcdui_Display_a == null) {
    if (t.var_int_i == 0) {
    GMIDlet.var_t_a.h();
    GMIDlet.var_javax_microedition_lcdui_Display_a = Display.getDisplay(this);
    GMIDlet.var_javax_microedition_lcdui_Display_a.setCurrent(GMIDlet.var_t_a);
    return;
    }
    if (t.var_int_i == 1) {
    GMIDlet.var_t_a.j();
    }
    }
    }
    
    pauseApp() {
    if (t.var_int_i == 2) {
    GMIDlet.var_t_a.i();
    }
    }
    
    destroyApp(bl) {
    j.a();
    /* gc */
    this.notifyDestroyed();
    }
    
    static _a_0(string) {
    j.a();
    try {
    GMIDlet.var_GMIDlet_a.platformRequest(string);
    }
    catch (exception) {}
    GMIDlet.var_GMIDlet_a.destroyApp(true);
    }
    
    static _a_1(dataInputStream) {
    let n2 = dataInputStream.readShort();
    let stringArray = new Array(n2).fill("");
    for (let i2 = 0; i2 < n2; ++i2) {
    stringArray[i2] = dataInputStream.readUTF();
    }
    return stringArray;
    }
    
    static _a_2(dataInputStream, imageArray, byArray, n2, n3) {
    let image = null;
    let by = dataInputStream.readByte();
    let s2 = dataInputStream.readShort();
    let bl = false;
    if ((by & 2) == 0) {
    bl = true;
    n3 = 0;
    }
    if (s2 == 0) {
    return;
    }
    let byArray2 = new Int8Array(s2);
    dataInputStream.readFully(byArray2);
    let n4 = 1;
    if (!bl) {
    n4 = dataInputStream.readShort();
    }
    if (n3 < 0) {
    let n5 = n2;
    let byArray3 = new Int8Array(s2);
    for (let i2 = 0; i2 < n4; ++i2) {
    System.arraycopy(byArray2, 0, byArray3, 0, byArray2.length);
    if (i2 > 0) {
    let n6 = GMIDlet.a(dataInputStream.readByte());
    for (let i3 = 0; i3 < n6; ++i3) {
    byArray3[dataInputStream.readShort()] = dataInputStream.readByte();
    }
    }
    if (imageArray[n5] == null) {
    imageArray[n5] = image = Image.createImage(byArray3, 0, byArray3.length);
    try {
    Thread.sleep(50);
    }
    catch (interruptedException) {}
    }
    ++n5;
    }
    } else {
    let n7 = 0;
    if (n3 > 0) {
    let n8 = 0;
    while (++n7 < n3) {
    n8 = GMIDlet.a(dataInputStream.readByte());
    if (n8 == 0) {
    n8 = dataInputStream.readShort();
    }
    dataInputStream.skipBytes(n8 * 3);
    }
    n8 = GMIDlet.a(dataInputStream.readByte());
    if (n8 == 0) {
    n8 = dataInputStream.readShort();
    }
    for (let i4 = 0; i4 < n8; ++i4) {
    byArray2[dataInputStream.readShort()] = dataInputStream.readByte();
    }
    }
    if (imageArray[n2] == null) {
    image = Image.createImage(byArray2, 0, byArray2.length);
    try {
    Thread.sleep(50);
    }
    catch (interruptedException) {}
    imageArray[n2] = image;
    }
    while (++n7 < n4) {
    dataInputStream.skipBytes(GMIDlet.a(dataInputStream.readByte()) * 3);
    }
    }
    byArray[n2] = n4;
    if ((by & 4) != 0) {
    let n9 = n2;
    byArray[n9] = (byArray[n9] | 0x80);
    }
    }
    
    static _a_3(by) {
    if (by < 0) {
    return by + 256;
    }
    return by;
    }
    
    static {
        /* Runtime.getRuntime() */
        let byArray = new Int8Array([25, 50, 80]);
        GMIDlet.var_byte_a = 5;
    }

    static a(...args) {
        if (args.length === 1) {
            if (typeof args[0] === 'string') return GMIDlet._a_0(args[0]);
            if (typeof args[0] === 'number') return GMIDlet._a_3(args[0]);
            return GMIDlet._a_1(args[0]);
        } else if (args.length === 5) {
            return GMIDlet._a_2(args[0], args[1], args[2], args[3], args[4]);
        }
    }
}
