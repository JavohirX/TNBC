export class e {
    static var_javax_microedition_lcdui_Graphics_a = null;
    static var_int_a = 0;
    static var_javax_microedition_lcdui_Image_arr_a = null;
    static var_byte_arr_a = null;
    static var_int_b = 0;
    static var_int_c = 0;
    static var_int_d = 0;
    static var_int_e = 0;
    static var_int_f = 0;
    static var_int_g = 0;
    static var_int_h = 0;
    static var_char_arr_a = null;
    static var_char_arr_b = null;
    static var_byte_arr_c = null;
    static var_char_arr_arr_a = null;
    static var_byte_arr_d = null;
    static var_byte_arr_e = null;
    static var_byte_arr_f = null;
    static var_byte_arr_g = null;
    static var_byte_arr_h = null;
    static var_byte_arr_arr_a = null;
    static var_boolean_arr_a = null;
    static var_boolean_arr_b = null;
    static f_i = null;
    static var_byte_arr_b = null;
    static var_java_lang_String_a = null;
    static var_char_arr_c = null;
    

    static _a_init_font(clazz) {
        if (e._a_0()) {
            let dataInputStream = ResourceManager.getResourceAsStream(e.var_java_lang_String_a);
            e._a_1(dataInputStream);
            try { dataInputStream.close(); } catch (err) {}
        }
    }
    static _a_0() {
    let string = 0;
    let string2 = 0;
    let by = t.var_byte_a;
    if (by === undefined || by == -1 || !t.var_java_lang_String_arr_a || by >= t.var_java_lang_String_arr_a.length) {
    by = 0;
    }
    if (!t.var_java_lang_String_arr_a || !t.var_java_lang_String_arr_a.length) {
    t.var_java_lang_String_arr_a = ["ru", "de", "fr", "it"];
    }
    let lang = t.var_java_lang_String_arr_a[by] || "ru";
    if ((string2 = lang.toLowerCase()).equals("el")) {
    string = "/font__el";
    e.var_int_b = 913;
    e.var_int_c = 937;
    e.var_int_d = 945;
    e.var_int_e = 969;
    } else if ((string2 === "ru")) {
    string = "/font__ru";
    e.var_int_b = 1040;
    e.var_int_c = 1071;
    e.var_int_d = 1072;
    e.var_int_e = 1103;
    } else {
    string = "/font";
    e.var_int_b = 65;
    e.var_int_c = 90;
    e.var_int_d = 97;
    e.var_int_e = 122;
    }
    e.var_int_f = e.var_int_c - e.var_int_b;
    e.var_int_g = e.var_int_e - e.var_int_d;
    e.var_int_h = e.var_int_f + e.var_int_g;
    let bl = !(string === e.var_java_lang_String_a);
    if (bl && e.var_javax_microedition_lcdui_Image_arr_a != null && e.var_javax_microedition_lcdui_Image_arr_a.length > 0) {
    for (let i2 = e.var_javax_microedition_lcdui_Image_arr_a.length - 1; i2 > -1; --i2) {
    e.var_javax_microedition_lcdui_Image_arr_a[i2] = null;
    }
    }
    e.var_java_lang_String_a = string;
    return bl;
    }
    
    static _a_1(dataInputStream) {
    e.a();
    e.var_int_a = dataInputStream.readShort();
    e.var_javax_microedition_lcdui_Image_arr_a = new Array(e.var_int_a).fill(null);
    e.var_byte_arr_a = new Int8Array(e.var_int_a);
    for (let i2 = 0; i2 < e.var_int_a; i2 += e.var_byte_arr_a[i2]) {
    GMIDlet.a(dataInputStream, e.var_javax_microedition_lcdui_Image_arr_a, e.var_byte_arr_a, i2, -1);
    }
    let string = dataInputStream.readUTF();
    e.var_char_arr_a = string.split("").map(c => c.charCodeAt(0));
    let string2 = dataInputStream.readUTF();
    e.var_char_arr_b = string2.split("").map(c => c.charCodeAt(0));
    e.var_byte_arr_c = new Int8Array(dataInputStream.readShort());
    if (e.var_byte_arr_c.length > 0) {
    dataInputStream.readFully(e.var_byte_arr_c, 0, e.var_byte_arr_c.length);
    }
    dataInputStream.readShort();
    e.var_char_arr_arr_a = Array.from({length: e.var_int_a}, () => null);
    e.var_byte_arr_e = new Int8Array(e.var_int_a);
    e.var_byte_arr_d = new Int8Array(e.var_int_a);
    e.var_byte_arr_f = new Int8Array(e.var_int_a);
    e.var_byte_arr_g = new Int8Array(e.var_int_a);
    e.var_byte_arr_h = new Int8Array(e.var_int_a);
    e.var_boolean_arr_a = new Array(e.var_int_a).fill(false);
    e.var_boolean_arr_b = new Array(e.var_int_a).fill(false);
    e.var_byte_arr_arr_a = Array.from({length: e.var_int_a}, () => new Int32Array());
    e.var_byte_arr_b = new Int8Array(e.var_int_a);
    e.f_i = new Int8Array(e.var_int_a);
    dataInputStream.readShort();
    for (let i3 = 0; i3 < e.var_int_a; ++i3) {
    let n2 = i3;
    let n3 = e.var_byte_arr_a[n2];
    let string3 = dataInputStream.readUTF();
    e.var_char_arr_arr_a[i3] = string3.split("").map(c => c.charCodeAt(0));
    e.var_boolean_arr_a[i3] = false;
    e.var_byte_arr_arr_a[i3] = null;
    e.var_byte_arr_b[i3] = 0;
    let n4 = dataInputStream.readShort();
    while (--n4 >= 0) {
    switch (dataInputStream.readByte()) {
    case 0: {
    e.var_boolean_arr_a[i3] = dataInputStream.readBoolean();
    break;
    }
    case 1: {
    let s2 = dataInputStream.readShort();
    e.var_byte_arr_arr_a[i3] = new Int8Array(s2);
    if (s2 > 0) {
    dataInputStream.readFully(e.var_byte_arr_arr_a[i3]);
    }
    e.var_byte_arr_e[i3] = (e.var_byte_arr_arr_a[i3][3] + e.var_byte_arr_arr_a[i3][4]);
    break;
    }
    case 2: {
    e.var_byte_arr_b[i3] = dataInputStream.readByte();
    break;
    }
    case 3: {
    e.var_byte_arr_h[i3] = dataInputStream.readByte();
    break;
    }
    case 4: {
    e.var_byte_arr_e[i3] = dataInputStream.readByte();
    break;
    }
    case 5: {
    e.var_byte_arr_f[i3] = dataInputStream.readByte();
    break;
    }
    case 6: {
    e.var_byte_arr_g[i3] = dataInputStream.readByte();
    break;
    }
    case 7: {
    e.var_boolean_arr_b[i3] = dataInputStream.readByte() != 0;
    break;
    }
    case 8: {
    e.f_i[i3] = dataInputStream.readByte();
    }
    }
    }
    if (e.f_i[i3] <= 0) {
    e.f_i[i3] = e.var_byte_arr_arr_a[i3][2];
    }
    while (n3 > 1) {
    e.var_char_arr_arr_a[++i3] = e.var_char_arr_arr_a[i3 - 1];
    e.var_byte_arr_e[i3] = e.var_byte_arr_e[i3 - 1];
    e.var_byte_arr_d[i3] = e.var_byte_arr_d[i3 - 1];
    e.var_boolean_arr_a[i3] = e.var_boolean_arr_a[i3 - 1];
    e.var_byte_arr_arr_a[i3] = e.var_byte_arr_arr_a[i3 - 1];
    e.var_byte_arr_b[i3] = e.var_byte_arr_b[i3 - 1];
    e.f_i[i3] = e.f_i[i3 - 1];
    e.var_byte_arr_f[i3] = e.var_byte_arr_f[i3 - 1];
    e.var_byte_arr_g[i3] = e.var_byte_arr_g[i3 - 1];
    e.var_byte_arr_h[i3] = e.var_byte_arr_h[i3 - 1];
    e.var_boolean_arr_b[i3] = e.var_boolean_arr_b[i3 - 1];
    --n3;
    }
    }
    }
    
    static _a_2(n2, cArray, n3, n4, n5, n6, n7) {
    let n8 = 0;
    if (e.var_byte_arr_arr_a == null || n2 >= e.var_byte_arr_arr_a.length) {
    return;
    }
    let image = e.var_javax_microedition_lcdui_Image_arr_a[n2];
    let by = e.var_byte_arr_f[n2];
    let by2 = e.var_byte_arr_g[n2];
    let by3 = e.var_byte_arr_h[n2];
    let bl = e.var_boolean_arr_a[n2];
    let n9 = e.var_byte_arr_arr_a[n2].length / 5;
    if ((n7 & 8) != 0) {
    n5 -= e.a(n2, cArray, 0, n4);
    } else if ((n7 & 1) != 0) {
    n5 -= e.a(n2, cArray, 0, n4) >> 1;
    }
    if ((n7 & 0x20) != 0) {
    n6 -= e.var_byte_arr_e[n2];
    } else if ((n7 & 2) != 0) {
    n6 -= e.var_byte_arr_e[n2] >> 1;
    n8 = (n9 - 10 + 9) * 5;
    n6 += e.var_byte_arr_arr_a[n2][n8 + 3] - by3;
    } else if ((n7 & 0x10) != 0) {
    n8 = (n9 - 10 + 9) * 5;
    n6 += e.var_byte_arr_arr_a[n2][n8 + 3] - by3;
    }
    let n10 = 0;
    let by4 = e.f_i[n2];
    let by5 = 0;
    let by6 = 0;
    let n11 = 0;
    let by7 = e.var_byte_arr_b[n2];
    let n12 = e.var_int_h + 2;
    if (bl) {
    n12 = e.var_int_g + 1;
    }
    let n13 = n3 + n4;
    for (let i2 = n3; i2 < n13; ++i2) {
    let n14 = 0;
    let n15 = 0;
    let n16 = 0;
    let n17 = 0;
    let bl2 = 0;
    let n18 = 0;
    block30: {
    let n19 = 0;
    block31: {
    block29: {
    n19 = cArray[i2];
    if (bl && (n19 >= e.var_int_b && n19 <= e.var_int_c || n19 >= e.var_int_d && n19 <= e.var_int_e || e.var_int_d != 97 && n19 >= 97 && n19 <= 122)) {
    n19 = e.a(n19);
    } else if (e.var_int_d != 97 && n19 >= 97 && n19 <= 122) {
    n19 = e.a(n19);
    }
    n18 = 0;
    let bl3 = n19 >= e.var_int_b && n19 <= e.var_int_c;
    bl2 = false;
    if (!bl3 && !bl) {
    let bl4 = bl2 = n19 >= e.var_int_d && n19 <= e.var_int_e;
    }
    if (!bl3 && !bl2) {
    n17 = e.var_char_arr_a.length;
    for (n16 = 0; n16 < n17; ++n16) {
    if (e.var_char_arr_a[n16] != n19) continue;
    n19 = e.var_char_arr_b[n16];
    n18 = e.var_byte_arr_c[n16];
    if (!bl) break;
    n19 = e.a(n19);
    break;
    }
    bl3 = n19 >= e.var_int_b && n19 <= e.var_int_c;
    bl2 = false;
    if (!bl3 && !bl) {
    let bl5 = bl2 = n19 >= e.var_int_d && n19 <= e.var_int_e;
    }
    }
    if (!bl3) break block29;
    n11 = n19 - e.var_int_b;
    break block30;
    }
    if (!bl2) break block31;
    n11 = n19 - e.var_int_d + e.var_int_f + 1;
    if (n19 != 105 || n18 != 0) break block30;
    n18 = 10;
    break block30;
    }
    if (n19 == 32 || n19 == 160) {
    n5 += by4 + by7;
    continue;
    }
    n17 = e.var_char_arr_arr_a[n2].length;
    n16 = n19;
    if (bl) {
    if (n19 == 231) {
    n16 = 199;
    } else if (n19 == 261) {
    n16 = 260;
    } else if (n19 == 281) {
    n16 = 280;
    } else if (n19 == 322) {
    n16 = 321;
    }
    }
    let cArray2 = e.var_char_arr_arr_a[n2];
    for (n15 = 0; n15 < n17; ++n15) {
    n14 = cArray2[n15];
    if (n14 != n19 && (!bl || n14 != n16)) continue;
    n11 = n15 + n12;
    break;
    }
    }
    n17 = n11 * 5;
    let n20 = e.var_byte_arr_arr_a[n2][n17++] & 0xFF;
    n10 = e.var_byte_arr_arr_a[n2][n17++] & 0xFF;
    by5 = e.var_byte_arr_arr_a[n2][n17++];
    by6 = e.var_byte_arr_arr_a[n2][n17++];
    let n21 = e.var_byte_arr_arr_a[n2][n17];
    e.var_javax_microedition_lcdui_Graphics_a.drawRegion(image, n20, n10, by5, by6, 0, n5, n6 + n21, 20);
    if (n18 > 0) {
    n17 = (n9 - 10 + (n18 > 1 ? n18 - 1 : 1)) * 5;
    n20 = e.var_byte_arr_arr_a[n2][n17++] & 0xFF;
    n10 = e.var_byte_arr_arr_a[n2][n17++] & 0xFF;
    n16 = e.var_byte_arr_arr_a[n2][n17++];
    let by8 = e.var_byte_arr_arr_a[n2][n17];
    n14 = n21;
    n15 = n18 == 1 ? by5 - n16 + 2 >> 1 : (n18 == 2 ? by5 - n16 : by5 - n16 + 1 >> 1);
    n14 = bl2 ? (n14 += by2) : (n14 += by3);
    e.var_javax_microedition_lcdui_Graphics_a.drawRegion(image, n20, n10, n16, by8, 0, n5 + (n15 += by), n6 + n14 - by8, 20);
    }
    n5 += by5 + by7;
    }
    }
    
    static _a_3(string) {
    let n2 = string.length;
    if (e.var_char_arr_c.length < n2) {
    e.var_char_arr_c = new Uint16Array(n2);
    }
    string.getChars(0, n2, e.var_char_arr_c, 0);
    return n2;
    }
    
    static _a_4(n2, string, n3, n4, n5) {
    let n6 = e.a(string);
    e.a(n2, e.var_char_arr_c, 0, n6, n3, n4, n5);
    }
    
    static _a_5(n2, string) {
    if (e.var_byte_arr_arr_a == null || n2 >= e.var_byte_arr_arr_a.length) {
    return -1;
    }
    let n3 = 0;
    let n4 = string.length;
    for (let i2 = 0; i2 < n4; ++i2) {
    n3 += e.a(n2, string.charCodeAt(i2));
    }
    return n3 - e.var_byte_arr_b[n2];
    }
    
    static _a_6(n2, cArray, n3, n4) {
    if (n3 > cArray.length) {
    return 0;
    }
    let n5 = 0;
    for (let i2 = n3; i2 < n4; ++i2) {
    n5 += e.a(n2, cArray[i2]);
    }
    return n5 - e.var_byte_arr_b[n2];
    }
    
    static _a_7(n2, c2) {
    let n3 = 0;
    let n4 = 0;
    block9: {
    let n5 = 0;
    let bl = 0;
    block10: {
    block8: {
    if (e.var_byte_arr_arr_a == null || n2 >= e.var_byte_arr_arr_a.length) {
    return -1;
    }
    bl = e.var_boolean_arr_a[n2];
    n4 = 0;
    n3 = 0;
    let bl2 = c2 >= e.var_int_b && c2 <= e.var_int_c;
    let bl3 = false;
    if (!bl2 && !bl) {
    let bl4 = bl3 = c2 >= e.var_int_d && c2 <= e.var_int_e;
    }
    if (!bl2 && !bl3) {
    let n6 = e.var_char_arr_a.length;
    for (n5 = 0; n5 < n6; ++n5) {
    if (e.var_char_arr_a[n5] != c2) continue;
    c2 = e.var_char_arr_b[n5];
    break;
    }
    }
    if (bl && (c2 >= e.var_int_b && c2 <= e.var_int_c || c2 >= e.var_int_d && c2 <= e.var_int_e || e.var_int_d != 97 && c2 >= 'a' && c2 <= 'z')) {
    c2 = e.a(c2);
    }
    if (c2 < e.var_int_b || c2 > e.var_int_c) break block8;
    n3 = c2 - e.var_int_b;
    break block9;
    }
    if (c2 < e.var_int_d || c2 > e.var_int_e) break block10;
    n3 = c2 - e.var_int_d + e.var_int_f + 1;
    if (!bl) break block9;
    n3 -= e.var_int_f + 1;
    break block9;
    }
    if (c2 == ' ' || c2 == 160) {
    return e.f_i[n2] + e.var_byte_arr_b[n2];
    }
    let cArray = e.var_char_arr_arr_a[n2];
    n5 = cArray.length;
    for (let i2 = 0; i2 < n5; ++i2) {
    if (cArray[i2] != c2) continue;
    if (bl) {
    n3 = i2 + e.var_int_h - e.var_int_g + 1;
    break;
    }
    n3 = i2 + e.var_int_h + 2;
    break;
    }
    }
    n4 = e.var_byte_arr_arr_a[n2][n3 * 5 + 2] + e.var_byte_arr_b[n2];
    return n4;
    }
    
    static _a_8(c2) {
    if (c2 >= e.var_int_b && c2 <= e.var_int_c) {
    return c2;
    }
    if (c2 == 962) {
    return 931;
    }
    return (c2 + e.var_int_b - e.var_int_d);
    }
    
    static _a_9(n2) {
    if (e.var_byte_arr_e == null || n2 >= e.var_byte_arr_e.length) {
    return -1;
    }
    return e.var_byte_arr_e[n2];
    }
    
    static {
        e.var_int_b = 65;
        e.var_int_c = 90;
        e.var_int_d = 97;
        e.var_int_e = 122;
        e.var_int_f = e.var_int_c - e.var_int_b;
        e.var_int_g = e.var_int_e - e.var_int_d;
        e.var_int_h = e.var_int_f + e.var_int_g;
        e.var_char_arr_c = new Uint16Array(64);
    }

    static a(...args) {
        const len = args.length;
        if (len === 0) return e._a_0();
        if (len === 1) {
            const arg = args[0];
            if (typeof arg === 'string') return e._a_3(arg);
            if (typeof arg === 'number') {
                if (arg < 10) return e._a_9(arg);
                return e._a_8(arg);
            }
            if (arg && typeof arg.readByte === 'function') return e._a_1(arg);
            return e._a_init_font(arg);
        }
        if (len === 2) {
            if (typeof args[1] === 'string') return e._a_5(args[0], args[1]);
            return e._a_7(args[0], args[1]);
        }
        if (len === 4) return e._a_6(args[0], args[1], args[2], args[3]);
        if (len === 5) return e._a_4(args[0], args[1], args[2], args[3], args[4]);
        if (len === 7) return e._a_2(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        for (let idx = 0; idx < 12; idx++) {
            const fn = e[`_a_${idx}`];
            if (fn && fn.length === len) return fn.apply(e, args);
        }
    }
}
