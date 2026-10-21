export class j {
    static var_j_a = null;
    static var_java_lang_Object_arr_a = null;
    static var_java_lang_String_arr_a = null;
    static var_javax_microedition_media_Player_a = null;
    static var_int_a = 0;
    
    static _a_0() {
    if (j.var_int_a >= 0 && j.var_javax_microedition_media_Player_a != null) {
    try {
    j.var_javax_microedition_media_Player_a.stop();
    }
    catch (exception) {}
    try {
    j.var_javax_microedition_media_Player_a.deallocate();
    }
    catch (exception) {}
    try {
    j.var_javax_microedition_media_Player_a.close();
    }
    catch (exception) {}
    j.var_javax_microedition_media_Player_a = null;
    }
    j.var_int_a = -1;
    }
    

    static _a_1(n2) {
        if ((GMIDlet.var_byte_a & 3) === 0) return;
        try {
            if (!j.var_java_lang_Object_arr_a || n2 < 0 || n2 >= j.var_java_lang_Object_arr_a.length || !j.var_java_lang_Object_arr_a[n2]) {
                if ((n2 === 3 || n2 === 4 || n2 === 5) && j.var_int_a >= 0) {
                    j.a();
                }
                return;
            }
            if (j.var_int_a >= 0 && j.var_javax_microedition_media_Player_a) {
                if (j.var_int_a === n2 && (n2 === 3 || n2 === 4 || n2 === 5)) {
                    return;
                }
                j.a();
            }

            const item = j.var_java_lang_Object_arr_a[n2];
            if (item instanceof Int8Array || item instanceof Uint8Array || Array.isArray(item)) {
                const byArray = item;
                const typeCode = byArray[byArray.length - 1];
                const mime = "audio/" + j.var_java_lang_String_arr_a[typeCode];
                let loopCount = (n2 === 3 || n2 === 4 || n2 === 5) ? -1 : 1;
                if (typeof AudioManager !== 'undefined') {
                    AudioManager.playAudio(n2, byArray, mime, loopCount);
                }
                j.var_int_a = n2;
            } else {
                const sArray = item;
                if (typeof AudioManager !== 'undefined') {
                    AudioManager.playTone(sArray[0], sArray[1], sArray[2]);
                }
            }
        } catch (e) {
            console.warn("Audio playback error:", n2, e);
        }
    }
    static _a_2(dataInputStream) {
    j.var_java_lang_Object_arr_a = new Array(6).fill(null);
    let objectArray = null;
    let n2 = dataInputStream.readShort();
    while (n2-- > 0) {
    try {
    let n3 = 0;
    let by = dataInputStream.readByte();
    switch (by) {
    case 4: {
    n3 = dataInputStream.readShort();
    objectArray = new Int8Array(n3 + 1);
    dataInputStream.readFully(objectArray);
    break;
    }
    case 5: {
    let sArray = new Int16Array(3);
    let sArray2 = sArray;
    sArray[0] = dataInputStream.readByte();
    sArray2[1] = dataInputStream.readShort();
    sArray2[2] = dataInputStream.readByte();
    objectArray = sArray2;
    break;
    }
    default: {
    return;
    }
    }
    n3 = dataInputStream.readShort();
    while (n3-- > 0) {
    j.var_java_lang_Object_arr_a[dataInputStream.readByte()] = objectArray;
    }
    dataInputStream.readShort();
    }
    catch (exception) {}
    }
    }
    
    playerUpdate(player, string, object) {
    }
    
    static {
        j.var_j_a = new j();
        j.var_java_lang_String_arr_a = ["midi", "x-wav", "mpeg", "basic", "x-tone-seq", "x-mid", "x-smaf", "amr", "amr-wb"];
        j.var_int_a = -1;
    }

    static a(...args) {
        if (args.length === 0) {
            return j._a_0();
        } else if (typeof args[0] === 'number') {
            return j._a_1(args[0]);
        } else {
            return j._a_2(args[0]);
        }
    }
}
