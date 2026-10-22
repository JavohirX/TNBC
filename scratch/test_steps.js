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
        case -1: case 50: case 38: return 1; // UP
        case -2: case 56: case 40: return 6; // DOWN
        case -3: case 52: case 37: return 2; // LEFT
        case -4: case 54: case 39: return 5; // RIGHT
        case -5: case 53: case 13: case 32: return 8; // FIRE
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
console.log("Jack starting at:", jack.var_int_b, jack.var_int_d);

// Test pressing UP (-1)
console.log("\n--- Pressing UP (-1) ---");
tInst.keyPressed(-1);
for (let i = 0; i < 20; i++) {
    tInst.g();
    if (i === 5) {
        console.log("Releasing UP at tick 5");
        tInst.keyReleased(-1);
    }
    console.log(`Tick ${i+1}: pos=(${jack.var_int_b}, ${jack.var_int_d}), f_e=${jack.f_e}, f_g=${jack.f_g}, f_v=${jack.f_v}`);
}
console.log("Jack after UP pos:", jack.var_int_b, jack.var_int_d);

// Now from (3, 1), can Jack walk DOWN (-2)?
console.log("\n--- Pressing DOWN (-2) ---");
tInst.keyPressed(-2);
for (let i = 0; i < 20; i++) {
    tInst.g();
    if (i === 5) {
        console.log("Releasing DOWN at tick 5");
        tInst.keyReleased(-2);
    }
    console.log(`Tick ${i+1}: pos=(${jack.var_int_b}, ${jack.var_int_d}), f_e=${jack.f_e}, f_g=${jack.f_g}, f_v=${jack.f_v}`);
}
console.log("Jack after DOWN pos:", jack.var_int_b, jack.var_int_d);

