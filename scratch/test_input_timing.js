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

// Dismiss briefing
tInst.keyPressed(-6); tInst.g(); tInst.keyReleased(-6);
tInst.keyPressed(-6); tInst.g(); tInst.keyReleased(-6);

const jack = tInst.var_n_a.var_q_a;
console.log("Jack starting pos:", jack.var_int_b, jack.var_int_d);

const DIRECTION_KEYS = new Set([-1, -2, -3, -4, 50, 52, 54, 56]);

class DirectionManager {
    constructor(t) {
        this.t = t;
        this.states = new Map();
    }

    press(key) {
        if (!DIRECTION_KEYS.has(key)) {
            this.t.keyPressed(key);
            return;
        }
        let s = this.states.get(key);
        if (!s) {
            s = {
                pressTime: Date.now(),
                releasedByUser: false,
                stepInitiated: false,
                repeatActive: false
            };
            this.states.set(key, s);
            this.t.keyPressed(key);
        } else {
            s.releasedByUser = false;
        }
    }

    release(key) {
        if (!DIRECTION_KEYS.has(key)) {
            this.t.keyReleased(key);
            return;
        }
        const s = this.states.get(key);
        if (!s) {
            this.t.keyReleased(key);
            return;
        }
        s.releasedByUser = true;
        if (s.stepInitiated) {
            this.t.keyReleased(key);
            this.states.delete(key);
        }
    }

    onGameTick(simulatedNow) {
        const now = simulatedNow || Date.now();
        const j = this.t?.var_n_a?.var_q_a;
        const isMoving = j && (j.f_e === 1 || j.f_e === 4);

        for (const [key, s] of this.states.entries()) {
            const holdMs = now - s.pressTime;

            if (isMoving) {
                s.stepInitiated = true;
            }

            if (s.releasedByUser) {
                if (s.stepInitiated || holdMs >= 80) {
                    this.t.keyReleased(key);
                    this.states.delete(key);
                }
            } else {
                if (holdMs < 280) {
                    if (s.stepInitiated) {
                        this.t.keyReleased(key);
                    }
                } else {
                    this.t.keyPressed(key);
                    s.repeatActive = true;
                }
            }
        }
    }
}

const mgr = new DirectionManager(tInst);

// Test 1: Single Tap UP (duration = 150ms)
console.log("\n=== Test 1: Single Tap UP (150ms) ===");
let simTime = 1000;
mgr.press(-1);

for (let tick = 0; tick < 15; tick++) {
    simTime += 40;
    if (tick === 3) {
        // user releases key at 160ms (tick 4)
        console.log(`[User releases UP at ${simTime - 1000}ms]`);
        mgr.release(-1);
    }
    tInst.g();
    mgr.onGameTick(simTime);
    console.log(`Tick ${tick+1}: pos=(${jack.var_int_b}, ${jack.var_int_d}), f_e=${jack.f_e}, f_g=${jack.f_g}`);
}
console.log("End pos after Tap UP:", jack.var_int_b, jack.var_int_d);

// Test 2: Single Tap DOWN (duration = 150ms)
console.log("\n=== Test 2: Single Tap DOWN (150ms) ===");
simTime = 2000;
mgr.press(-2);

for (let tick = 0; tick < 15; tick++) {
    simTime += 40;
    if (tick === 3) {
        console.log(`[User releases DOWN at ${simTime - 2000}ms]`);
        mgr.release(-2);
    }
    tInst.g();
    mgr.onGameTick(simTime);
    console.log(`Tick ${tick+1}: pos=(${jack.var_int_b}, ${jack.var_int_d}), f_e=${jack.f_e}, f_g=${jack.f_g}`);
}
console.log("End pos after Tap DOWN:", jack.var_int_b, jack.var_int_d);
// Test 3: Continuous Hold UP & DOWN
console.log("\n=== Test 3: Continuous Hold (600ms) ===");
simTime = 3000;
mgr.press(-1);

for (let tick = 0; tick < 20; tick++) {
    simTime += 40;
    if (tick === 15) {
        console.log(`[User releases UP after 640ms]`);
        mgr.release(-1);
    }
    tInst.g();
    mgr.onGameTick(simTime);
    if (tick % 2 === 0) {
        console.log(`Tick ${tick+1}: pos=(${jack.var_int_b}, ${jack.var_int_d}), f_e=${jack.f_e}`);
    }
}
console.log("End pos after long hold UP:", jack.var_int_b, jack.var_int_d);

