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

String.prototype.equals = function(o) { return String(this) === String(o); };
String.prototype.equalsIgnoreCase = function(o) { return this.toLowerCase() === String(o).toLowerCase(); };

import { DataInputStream } from '../engine/io/DataInputStream.js';
global.DataInputStream = DataInputStream;
global.ResourceManager = {
    getResourceAsStream: (resPath) => {
        let clean = resPath.startsWith('/') ? resPath : '/' + resPath;
        let buf = assetCache.get(clean) || assetCache.get(resPath) || new Uint8Array(0);
        return new DataInputStream(buf.buffer, buf.byteOffset, buf.byteLength);
    },
    getResourceBytes: (resPath) => {
        let clean = resPath.startsWith('/') ? resPath : '/' + resPath;
        return assetCache.get(clean) || assetCache.get(resPath);
    }
};

import { Image } from '../engine/lcd/Image.js';
global.Image = Image;
import { Graphics } from '../engine/lcd/Graphics.js';
global.Graphics = Graphics;

global.Display = { getDisplay: () => ({ setCurrent: () => {} }) };
global.FullCanvas = class { getWidth() { return 240; } getHeight() { return 320; } setFullScreenMode() {} repaint() {} serviceRepaints() {} getGameAction() { return 0; } };
global.StringBuffer = class { constructor() { this.s = ""; } toString() { return this.s; } };
global.Timer = class { schedule() {} cancel() {} };
global.RecordStore = { openRecordStore: () => ({ getNumRecords: () => 0, getRecord: () => null, addRecord: () => 1, setRecord: () => {}, closeRecordStore: () => {} }) };
global.MIDlet = class { getAppProperty() { return "1.0.0"; } notifyDestroyed() {} platformRequest() {} getClass() { return this.constructor; } };

const CLASS_NAMES = [
    "k", "l", "d", "p", "c", "o", "h", "f", "g", "s", "j", "e", "r", "i", "b", "m", "q", "n", "a", "t", "GMIDlet"
];

for (const c of CLASS_NAMES) {
    const mod = await import(`../engine/classes/${c}.js`);
    global[c] = mod[c];
}

const midlet = new global.GMIDlet();
midlet.startApp();
global.t.a(0); // russian

function wrapFixed(string, n2, n3) {
    let vector = [];
    let n4 = 0;
    let n5 = 0;
    let n6 = 1;
    let n7 = 0;
    let n8 = 0;
    while (n4 < string.length) {
        let bl = false;
        if (n7 < string.length) {
            let code = string.charCodeAt(n7);
            if (code === 124) { // '|'
                bl = true;
            }
            if (code === 32) { // ' '
                n6 = n7;
            }
            n8 += global.e.a(n3, code) + global.e.var_byte_arr_b[n3];
        }
        if (n8 > n2 || bl || n7 >= string.length) {
            n5 = n7;
            if (n8 > n2) {
                n5 = n6;
            }
            if (n4 > n5) {
                n5 = n4 + 2;
            }
            vector.push(string.substring(n4, n5));
            n4 = n5 + 1;
            n7 = n5;
            n8 = 0;
        }
        ++n7;
    }
    return vector;
}

// Also test dialogue intro string from t.var_java_lang_String_arr_c
console.log("t.var_java_lang_String_arr_c[0]:", JSON.stringify(global.t.var_java_lang_String_arr_c[0]));
const dialogueText = global.t.var_java_lang_String_arr_c[0];
const wrapped = wrapFixed(dialogueText, 180, 0);
console.log("Wrapped fixed dialogue lines count:", wrapped.length);
console.log("Wrapped fixed dialogue lines:\n" + wrapped.join("\n"));

