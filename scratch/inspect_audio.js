import fs from 'fs';
import path from 'path';

const assetCache = new Map();
const assetDir = 'assets';
for (const file of fs.readdirSync(assetDir)) {
    const full = path.join(assetDir, file);
    if (fs.statSync(full).isFile()) {
        const buf = fs.readFileSync(full);
        assetCache.set('/' + file, buf);
        assetCache.set(file, buf);
    }
}

import { DataInputStream } from '../engine/io/DataInputStream.js';
global.DataInputStream = DataInputStream;
global.ResourceManager = {
    getResourceAsStream: (resPath) => {
        let clean = resPath.startsWith('/') ? resPath : '/' + resPath;
        let buf = assetCache.get(clean) || assetCache.get(resPath) || new Uint8Array(0);
        return new DataInputStream(buf.buffer, buf.byteOffset, buf.byteLength);
    }
};

const jMod = await import('../engine/classes/j.js');
const j = jMod.j;

// Read audio resource /m
const stream = global.ResourceManager.getResourceAsStream("/m");
j.a(stream);

console.log("Audio objects loaded in j:", j.var_java_lang_Object_arr_a.length);
for (let i = 0; i < j.var_java_lang_Object_arr_a.length; i++) {
    const obj = j.var_java_lang_Object_arr_a[i];
    if (!obj) {
        console.log(`Track ${i}: null`);
        continue;
    }
    if (obj instanceof Int8Array || obj instanceof Uint8Array) {
        const bytes = new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength);
        const typeCode = bytes[bytes.length - 1];
        const magic = String.fromCharCode(...bytes.slice(0, 4));
        console.log(`Track ${i}: Byte array length ${bytes.length}, typeCode ${typeCode} ("${j.var_java_lang_String_arr_a[typeCode]}"), magic: "${magic}"`);
    } else {
        console.log(`Track ${i}: Tone [note=${obj[0]}, dur=${obj[1]}, vol=${obj[2]}]`);
    }
}

