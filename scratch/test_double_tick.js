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
global.FullCanvas = class { getWidth() { return 240; } getHeight() { return 320; } setFullScreenMode() {} repaint() {} serviceRepaints() {} getGameAction(n) { return 0; } };
global.StringBuffer = class { constructor() { this.s = ""; } toString() { return this.s; } };
global.Random = class { nextInt(n) { return Math.floor(Math.random() * (n || 100)); } };

let timerSchedules = 0;
global.Timer = class Timer {
    constructor() { this._t = null; }
    schedule(task, delay) {
        timerSchedules++;
        this._t = setTimeout(() => {
            task.run();
        }, delay);
    }
    cancel() {
        if (this._t) clearTimeout(this._t);
    }
};

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

// Start game
tInst.h();

console.log("t.var_java_util_Timer_a exists:", tInst.var_java_util_Timer_a != null);
console.log("Timer schedules after t.h():", timerSchedules);

await new Promise(r => setTimeout(r, 200));
console.log("Timer schedules after 200ms:", timerSchedules);

tInst.var_java_util_Timer_a.cancel();
process.exit(0);

