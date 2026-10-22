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
global.t.a(0); // russian
tInst.l(); // load tilesets

tInst.var_n_a.c();
tInst.var_n_a.c(0);
tInst.m();

// Run tick 1
tInst.g();

// Dismiss briefing dialog: LSK
tInst.keyPressed(-6);
tInst.keyReleased(-6);
tInst.g();

const jack = tInst.var_n_a.var_q_a;
console.log("Jack starting frame:", jack.var_h_a.f_c, "pos:", jack.var_int_b, jack.var_int_d);

// Let's hold RIGHT key for 16 ticks and watch jack.var_h_a.f_c
console.log("--- Walking RIGHT ---");
tInst.keyPressed(-4);
const framesRight = [];
for (let i = 0; i < 20; i++) {
    tInst.g();
    framesRight.push(jack.var_h_a.f_c);
}
tInst.keyReleased(-4);
console.log("Frames while walking RIGHT:", framesRight);
console.log("Jack pos after right:", jack.var_int_b, jack.var_int_d);

// Let's test whipping attack (FIRE -5)
console.log("--- Whipping Attack ---");
tInst.keyPressed(-5);
tInst.g();
tInst.keyReleased(-5);
const framesAttack = [];
for (let i = 0; i < 15; i++) {
    tInst.g();
    framesAttack.push(jack.var_h_a.f_c);
}
console.log("Frames while attacking:", framesAttack);

