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
global.FullCanvas = class { getWidth() { return 240; } getHeight() { return 320; } setFullScreenMode() {} repaint() {} serviceRepaints() {} getGameAction(n) {
    switch(n) {
        case -1: case 50: case 38: return 1;
        case -2: case 56: case 40: return 6;
        case -3: case 52: case 37: return 2;
        case -4: case 54: case 39: return 5;
        case -5: case 53: case 13: case 32: return 8;
        default: return 0;
    }
}};
global.StringBuffer = class { constructor() { this.s = ""; } toString() { return this.s; } };
global.Random = class { nextInt(n) { return Math.floor(Math.random() * (n || 100)); } };
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
const tInst = global.GMIDlet.var_t_a;
global.t.a(0);
tInst.l();

tInst.var_n_a.c();
tInst.var_n_a.c(0);
tInst.m();
tInst.g();

// Dismiss briefing: double press -6
tInst.keyPressed(-6); tInst.g(); tInst.keyReleased(-6);
tInst.keyPressed(-6); tInst.g(); tInst.keyReleased(-6);

const jack = tInst.var_n_a.var_q_a;
const rInst = tInst.var_n_a.var_r_a;
console.log("Jack starting at:", jack.var_int_b, jack.var_int_d);

for (let y = 0; y < 6; y++) {
    let row = "";
    for (let x = 0; x < 8; x++) {
        const tile = rInst.int_b(x, y);
        const obj = rInst.i_a(x, y);
        if (x === jack.var_int_b && y === jack.var_int_d) row += " J ";
        else if (obj) row += `[${obj.f_q}]`;
        else row += ` ${tile} `.padStart(5);
    }
    console.log(`Y=${y}:`, row);
}

console.log("Can move UP (3, 1)?", rInst.boolean_a(3, 2, 3, 1));
console.log("Can move DOWN (3, 3)?", rInst.boolean_a(3, 2, 3, 3));
console.log("Can move LEFT (2, 2)?", rInst.boolean_a(3, 2, 2, 2));
console.log("Can move RIGHT (4, 2)?", rInst.boolean_a(3, 2, 4, 2));

