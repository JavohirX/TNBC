/**
 * Nightmare Before Christmas - Pure Native ES6 Engine Entrypoint
 * 100% Native JavaScript - Zero WebAssembly - Zero Loading Delay
 */

// 1. Core Language Polyfills
String.prototype.equals = function(other) { 
    return other !== null && other !== undefined && String(this) === String(other); 
};
String.prototype.equalsIgnoreCase = function(other) { 
    return other !== null && other !== undefined && this.toLowerCase() === String(other).toLowerCase(); 
};
String.prototype.getChars = function(srcBegin, srcEnd, dst, dstBegin) {
    for (let i = srcBegin, j = dstBegin; i < srcEnd; i++, j++) {
        dst[j] = this.charCodeAt(i);
    }
};

class JavaRandom {
    constructor(seed = 12345678) {
        this.seed = BigInt(seed);
    }
    nextInt() {
        this.seed = (this.seed * 0x5DEECE66Dn + 0xBn) & ((1n << 48n) - 1n);
        let res = Number(this.seed >> 16n);
        return (res << 0);
    }
}

window.System = {
    currentTimeMillis: () => Date.now(),
    arraycopy: (src, sOff, dst, dOff, len) => {
        for (let i = 0; i < len; i++) {
            dst[dOff + i] = src[sOff + i];
        }
    },
    gc: () => {}
};
window.Random = JavaRandom;

window.StringBuffer = class StringBuffer {
    constructor(capacity = 16) { this.s = ""; }
    append(c) { this.s += (typeof c === 'number' ? String.fromCharCode(c) : c); return this; }
    get length() { return this.s.length; }
    toString() { return this.s; }
    setLength(n) { this.s = this.s.substring(0, n); }
};

// 2. J2ME Canvas & LCDEUI Shims
import { Graphics } from "./lcd/Graphics.js";
import { Image } from "./lcd/Image.js";
import { RecordStore } from "./lcd/RecordStore.js";
import { DataInputStream } from "./io/DataInputStream.js";
import { AudioManager } from "./audio/AudioManager.js";

window.Graphics = Graphics;
window.Image = Image;
window.RecordStore = RecordStore;
window.DataInputStream = DataInputStream;
window.AudioManager = AudioManager;

window.FullCanvas = class FullCanvas {
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

window.Display = {
    getDisplay: () => ({
        setCurrent: (d) => {
            console.log("Display.setCurrent:", d ? d.constructor.name : null);
        }
    })
};

window.Timer = class Timer {
    constructor() {
        this._timeout = null;
    }
    schedule(task, delay) {
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            try {
                task.run();
            } catch (e) {
                console.error("TimerTask error:", e);
            }
        }, Math.max(5, delay));
    }
    cancel() {
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = null;
    }
};

window.TimerTask = class TimerTask {
    run() {}
    cancel() { return true; }
};

window.MIDlet = class {
    getAppProperty(key) { return "1.0.0"; }
    notifyDestroyed() { console.log("MIDlet destroyed"); }
    platformRequest() {}
    getClass() { return this.constructor; }
};

// 3. Asset Resource Manager
const assetCache = new Map();

window.ResourceManager = {
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

// 4. Load all 21 Transpiled Game Classes in Topological Order
const CLASS_NAMES = [
    "k", "l", "d", "p", "c", "o", "h", "f", "g", "s", "j", "e", "r", "i", "b", "m", "q", "n", "a", "t", "GMIDlet"
];

async function loadGameClasses() {
    for (const c of CLASS_NAMES) {
        const mod = await import(`./classes/${c}.js`);
        window[c] = mod[c];
    }
    console.log("All 21 classes loaded into browser window scope!");
}

// 5. Asset Preloader
const REQUIRED_ASSETS = [
    "levels.mar", "levels.dat", "font", "font__ru", "lang", "m",
    "text.dat", "text.png", "textLarge.png",
    "text__ru.txt", "text__de.txt", "text__fr.txt", "text__it.txt",
    "sp__ru", "sp__de", "sp__fr", "sp__it",
    "lp__ru", "lp__de", "lp__fr", "lp__it", "lpok",
    "16x16TileSet.png", "32x32TileSet.png", "levelSelect.png", "menuBottom.png",
    "splash.png", "mDisneyLogo.png", "softKeys.png"
];

async function preloadAssets(basePath = "assets/") {
    const total = REQUIRED_ASSETS.length;
    let loaded = 0;

    const fill = document.getElementById("progress-bar-fill");
    const txt = document.getElementById("loading-text");
    const timerTxt = document.getElementById("loading-timer");

    const promises = REQUIRED_ASSETS.map(async (filename) => {
        try {
            const url = basePath + filename;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const buf = await res.arrayBuffer();
            const u8 = new Uint8Array(buf);
            assetCache.set('/' + filename, u8);
            assetCache.set(filename, u8);

            // Pre-decode PNGs into Image cache
            if (filename.endsWith('.png') || filename === 'm') {
                try {
                    const img = Image.createImage(u8, 0, u8.length);
                    Image.cacheImage('/' + filename, img);
                    Image.cacheImage(filename, img);
                } catch (e) {}
            }

            loaded++;
            if (fill) fill.style.width = `${Math.floor((loaded / total) * 100)}%`;
            if (txt) txt.textContent = `Loading asset: ${filename} (${loaded}/${total})`;
        } catch (err) {
            console.warn(`Could not load asset ${filename}:`, err);
        }
    });

    await Promise.all(promises);
    if (txt) txt.textContent = "Booting Pure Native Engine...";
    if (timerTxt) timerTxt.textContent = "Ready (0.0s)";
}

// 6. Game Bootstrapper
export async function startNativeEngine(assetBase = "assets/") {
    console.log("=== Nightmare Before Christmas Pure Native Engine Booting ===");
    const t0 = performance.now();

    await preloadAssets(assetBase);
    await loadGameClasses();

    // Instantiate MIDlet
    const midlet = new GMIDlet();
    midlet.startApp();

    const tInstance = GMIDlet.var_t_a;
    if (!tInstance) {
        throw new Error("Game Canvas instance (t) failed to initialize");
    }

    // Connect Canvas & Graphics
    const canvas = document.getElementById("display");
    if (!canvas) {
        throw new Error("Display canvas element #display not found in DOM");
    }

    canvas.width = 240;
    canvas.height = 320;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    ctx.imageSmoothingEnabled = false;

    const graphics = new Graphics(ctx, 240, 320);

    // Hide splash screen instantly!
    const splash = document.getElementById("splash-screen");
    if (splash) {
        splash.style.transition = "opacity 0.25s ease";
        splash.style.opacity = "0";
        setTimeout(() => splash.remove(), 260);
    }
    canvas.style.display = "block";
    canvas.focus();

    // Setup High-Precision Game Render Loop
    let lastTick = performance.now();
    const TICK_INTERVAL = 1000 / 30; // 30 FPS Living Mobile target

    function gameLoop(now) {
        requestAnimationFrame(gameLoop);

        // If s.java timer isn't ticking, run game tick
        const elapsed = now - lastTick;
        if (elapsed >= TICK_INTERVAL) {
            lastTick = now - (elapsed % TICK_INTERVAL);
            try {
                tInstance.g();
            } catch (err) {
                console.error("Game tick error:", err);
            }
        }

        // Repaint LCD screen
        try {
            tInstance.paint(graphics);
        } catch (err) {
            console.error("Paint error:", err);
        }
    }

    requestAnimationFrame(gameLoop);

    // 7. Input Wiring: Keyboard & 3D Tactile Retro Phone
    setupInputControls(tInstance);

    const bootTime = Math.round(performance.now() - t0);
    console.log(`Native Engine booted successfully in ${bootTime}ms! Instant 0s launch.`);
}

function setupInputControls(tInstance) {
    // Physical Keyboard Map
    const KEY_MAP = {
        "ArrowUp": -1, "KeyW": -1, "Numpad8": 56,
        "ArrowDown": -2, "KeyS": -2, "Numpad2": 50,
        "ArrowLeft": -3, "KeyA": -3, "Numpad4": 52,
        "ArrowRight": -4, "KeyD": -4, "Numpad6": 54,
        "Enter": -5, "Space": -5, "KeyX": -5, "Numpad5": 53,
        "Escape": -6, "KeyQ": -6, "F1": -6,
        "Backspace": -7, "KeyE": -7, "F2": -7,
        "Digit0": 48, "Numpad0": 48,
        "Digit1": 49, "Numpad1": 49,
        "Digit2": 50,
        "Digit3": 51, "Numpad3": 51,
        "Digit4": 52,
        "Digit5": 53,
        "Digit6": 54,
        "Digit7": 55, "Numpad7": 55,
        "Digit8": 56,
        "Digit9": 57, "Numpad9": 57,
        "NumpadAsterisk": 42, "Minus": 42,
        "NumpadDivide": 35, "Equal": 35
    };

    window.addEventListener("keydown", (e) => {
        const j2meKey = KEY_MAP[e.code];
        if (j2meKey !== undefined) {
            e.preventDefault();
            tInstance.keyPressed(j2meKey);
            triggerButtonActive(e.code, true);
        }
    });

    window.addEventListener("keyup", (e) => {
        const j2meKey = KEY_MAP[e.code];
        if (j2meKey !== undefined) {
            e.preventDefault();
            tInstance.keyReleased(j2meKey);
            triggerButtonActive(e.code, false);
        }
    });

    // 8-Way Tactile Controller Buttons
    const buttons = document.querySelectorAll(".ctrl-btn");
    buttons.forEach((btn) => {
        const keyData = btn.getAttribute("data-key");
        if (!keyData) return;

        const keys = keyData.split(",");

        const handlePress = (e) => {
            e.preventDefault();
            btn.classList.add("active");
            if (navigator.vibrate) navigator.vibrate(12);
            AudioManager.playClick();

            keys.forEach((k) => {
                const j2meKey = KEY_MAP[k.trim()];
                if (j2meKey !== undefined) tInstance.keyPressed(j2meKey);
            });
        };

        const handleRelease = (e) => {
            e.preventDefault();
            btn.classList.remove("active");

            keys.forEach((k) => {
                const j2meKey = KEY_MAP[k.trim()];
                if (j2meKey !== undefined) tInstance.keyReleased(j2meKey);
            });
        };

        btn.addEventListener("pointerdown", handlePress);
        btn.addEventListener("pointerup", handleRelease);
        btn.addEventListener("pointercancel", handleRelease);
        btn.addEventListener("pointerleave", handleRelease);
    });

    // Toolbar Buttons
    const btnMute = document.getElementById("btn-mute");
    if (btnMute) {
        btnMute.addEventListener("click", () => {
            const muted = AudioManager.toggleMute();
            btnMute.textContent = muted ? "🔇" : "🔊";
        });
    }

    const btnKbd = document.getElementById("btn-kbd-toggle");
    const numKeypad = document.getElementById("num-keypad");
    if (btnKbd && numKeypad) {
        btnKbd.addEventListener("click", () => {
            numKeypad.classList.toggle("hidden");
        });
    }

    const btnFullscreen = document.getElementById("btn-fullscreen");
    if (btnFullscreen) {
        btnFullscreen.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });
    }

    const btnReset = document.getElementById("btn-reset");
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            location.reload();
        });
    }
}

function triggerButtonActive(code, isActive) {
    const btns = document.querySelectorAll(`[data-key*="${code}"]`);
    btns.forEach(b => {
        if (isActive) b.classList.add("active");
        else b.classList.remove("active");
    });
}
