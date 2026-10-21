import fs from 'fs';
import path from 'path';

String.prototype.equals = function(other) { return String(this) === String(other); };
String.prototype.equalsIgnoreCase = function(other) { return this.toLowerCase() === String(other).toLowerCase(); };
String.prototype.getChars = function(srcBegin, srcEnd, dst, dstBegin) {
    for (let i = srcBegin, j = dstBegin; i < srcEnd; i++, j++) {
        dst[j] = this.charCodeAt(i);
    }
};

// Polyfill standard J2ME / Browser globals for Node test environment
global.System = {
    currentTimeMillis: () => Date.now(),
    arraycopy: (src, sOff, dst, dOff, len) => {
        for (let i = 0; i < len; i++) {
            dst[dOff + i] = src[sOff + i];
        }
    }
};

class JavaRandom {
    constructor(seed = 12345678) {
        this.seed = BigInt(seed);
    }
    nextInt() {
        this.seed = (this.seed * 0x5DEECE66Dn + 0xBn) & ((1n << 48n) - 1n);
        let res = Number(this.seed >> 16n);
        return (res << 0); // signed 32-bit int
    }
}
global.FullCanvas = class FullCanvas {
    constructor() {
        this.width = 240;
        this.height = 320;
    }
    setFullScreenMode(mode) {}
    getWidth() { return this.width; }
    getHeight() { return this.height; }
    repaint() {}
    serviceRepaints() {}
    getGameAction(n) {
        switch(n) {
            case -1: case 50: case 38: return 1; // UP
            case -2: case 56: case 40: return 6; // DOWN
            case -3: case 52: case 37: return 2; // LEFT
            case -4: case 54: case 39: return 5; // RIGHT
            case -5: case 53: case 13: case 32: return 8; // FIRE
            default: return 0;
        }
    }
};

global.Random = JavaRandom;

global.StringBuffer = class StringBuffer {
    constructor() { this.s = ""; }
    append(c) { this.s += (typeof c === 'number' ? String.fromCharCode(c) : c); return this; }
    get length() { return this.s.length; }
    toString() { return this.s; }
    setLength(n) { this.s = this.s.substring(0, n); }
};

// Resource Manager for Node test
const ASSETS_DIR = path.resolve('assets');
const assetCache = new Map();

for (const f of fs.readdirSync(ASSETS_DIR)) {
    const fpath = path.join(ASSETS_DIR, f);
    if (fs.statSync(fpath).isFile()) {
        const buf = fs.readFileSync(fpath);
        assetCache.set('/' + f, buf);
        assetCache.set(f, buf);
    }
}

console.log("Cached assets count:", assetCache.size);

import { DataInputStream } from '../engine/io/DataInputStream.js';
global.DataInputStream = DataInputStream;

global.ResourceManager = {
    getResourceAsStream: (resPath) => {
        let clean = resPath.startsWith('/') ? resPath : '/' + resPath;
        let buf = assetCache.get(clean) || assetCache.get(resPath);
        if (!buf) {
            console.warn("Asset not found:", clean);
            buf = new Uint8Array(0);
        }
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

global.Display = {
    getDisplay: () => ({
        setCurrent: (d) => console.log("Display setCurrent called:", d ? d.constructor.name : null)
    })
};

global.Timer = class Timer {
    schedule(task, delay) {}
    cancel() {}
};

global.RecordStore = {
    openRecordStore: () => ({
        getNumRecords: () => 0,
        getRecord: () => null,
        addRecord: () => 1,
        setRecord: () => {},
        closeRecordStore: () => {}
    })
};

global.MIDlet = class {
    getAppProperty(key) { return "1.0.0"; }
    notifyDestroyed() {}
    platformRequest() {}
    getClass() { return this.constructor; }
};

// Load all 21 classes into global scope in topological inheritance order
const CLASS_NAMES = [
    "k", "l", "d", "p", "c", "o", "h", "f", "g", "s", "j", "e", "r", "i", "b", "m", "q", "n", "a", "t", "GMIDlet"
];

for (const c of CLASS_NAMES) {
    const mod = await import(`../engine/classes/${c}.js`);
    global[c] = mod[c];
}

console.log("All 21 classes loaded successfully into runtime!");

// Now test GMIDlet boot
try {
    console.log("Instantiating GMIDlet...");
    const midlet = new global.GMIDlet();
    console.log("GMIDlet instance created!");

    console.log("Starting app...");
    midlet.startApp();
    console.log("startApp finished!");

    console.log("Checking Canvas state...");
    const canvas = global.GMIDlet.var_GMIDlet_a;
    console.log("Canvas initialized! var_int_i =", global.t.var_int_i);
    console.log("Language loaded:", global.t.var_java_lang_String_arr_a);

    console.log("\n--- Testing Menu Tick t.g() ---");
    const tInstance = global.GMIDlet.var_t_a;
    tInstance.g();
    console.log("Menu tick 1 passed! a.var_int_c =", global.a.var_int_c);

    console.log("\n--- Selecting Language (Russian: 0) ---");
    global.t.a(0);
    console.log("Language text strings loaded count:", global.t.var_java_lang_String_arr_b ? global.t.var_java_lang_String_arr_b.length : 0);

    console.log("\n--- Loading TileSets t.l() ---");
    tInstance.l();
    console.log("TileSet images loaded:", tInstance.var_javax_microedition_lcdui_Image_a != null, tInstance.var_javax_microedition_lcdui_Image_b != null);

    console.log("\n--- Testing In-Game Start t.m() ---");
    tInstance.m();
    console.log("Game mode active! var_int_j =", tInstance.var_int_j);

    console.log("\n--- Testing Level Room Loader n.d(0) ---");
    tInstance.var_n_a.d(0);
    console.log("Room 0 loaded successfully!");
    console.log("Jack Skellington player entity created:", tInstance.var_n_a.var_q_a != null);
    console.log("Active entities count:", tInstance.var_n_a.var_g_a.var_int_a);

    console.log("\n--- Testing In-Game Physics Tick ---");
    for (let tick = 0; tick < 10; tick++) {
        tInstance.g();
    }
    console.log("10 Game physics ticks passed cleanly!");
    console.log("\n--- Testing In-Game Paint ---");
    let drawCount = 0;
    const testGraphics = {
        setClip: () => {},
        setColor: () => {},
        fillRect: () => { drawCount++; },
        drawRect: () => { drawCount++; },
        drawLine: () => { drawCount++; },
        drawArc: () => { drawCount++; },
        fillArc: () => { drawCount++; },
        drawRoundRect: () => { drawCount++; },
        fillRoundRect: () => { drawCount++; },
        drawImage: () => { drawCount++; },
        drawRegion: () => { drawCount++; },
        drawString: () => { drawCount++; },
        getClipX: () => 0,
        getClipY: () => 0,
        getClipWidth: () => 240,
        getClipHeight: () => 320
    };
    tInstance.paint(testGraphics);
    console.log("paint() completed! Total draw calls made:", drawCount);
} catch (err) {
    console.error("Test failed with error:", err);
}
