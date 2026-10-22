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
globalThis.System = window.System;
window.Random = JavaRandom;
globalThis.Random = JavaRandom;

window.StringBuffer = class StringBuffer {
    constructor(capacity = 16) { this.s = ""; }
    append(c) { this.s += (typeof c === 'number' ? String.fromCharCode(c) : c); return this; }
    get length() { return this.s.length; }
    toString() { return this.s; }
    setLength(n) { this.s = this.s.substring(0, n); }
};
globalThis.StringBuffer = window.StringBuffer;

// 2. J2ME Canvas & LCDEUI Shims
import { Graphics } from "./lcd/Graphics.js";
import { Image } from "./lcd/Image.js?v=v20261022_b7";
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
        // Game ticks are exclusively and smoothly driven by the requestAnimationFrame gameLoop
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

async function loadGameClasses(versionHash = "") {
    const vParam = versionHash ? `?v=${versionHash}` : "";
    for (const c of CLASS_NAMES) {
        const mod = await import(`./classes/${c}.js${vParam}`);
        window[c] = mod[c];
    }
    console.log("All 21 classes loaded into browser window scope!");
}

// 5. Asset Preloader
const REQUIRED_ASSETS = [
    "levels.mar", "levels.dat", "font", "font__ru", "lang", "m",
    "text.dat", "text.png", "textLarge.png",
    "text__en.txt", "text__ru.txt", "text__de.txt", "text__fr.txt", "text__it.txt",
    "sp__en", "sp__ru", "sp__de", "sp__fr", "sp__it",
    "lp__en", "lp__ru", "lp__de", "lp__fr", "lp__it", "lpok",
    "16x16TileSet.png", "32x32TileSet.png",
    "levelSelect.png", "menuBottom.png",
    "splash.png", "mDisneyLogo.png", "softKeys.png",
    "replay0.rpl", "replay3.rpl", "replay5.rpl", "replay10.rpl",
    "replay14.rpl", "replay15.rpl", "replay20.rpl", "replay25.rpl",
    "replay35.rpl", "replay39.rpl", "replay40.rpl", "replay45.rpl"
];

async function preloadAssets(basePath = "assets/", versionHash = "v20261022_orig") {
    const total = REQUIRED_ASSETS.length;
    let loaded = 0;

    const fill = document.getElementById("progress-bar-fill");
    const txt = document.getElementById("loading-text");
    const timerTxt = document.getElementById("loading-timer");

    const promises = REQUIRED_ASSETS.map(async (filename) => {
        try {
            const url = `${basePath}${filename}?v=${versionHash}`;
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const buf = await res.arrayBuffer();
            const u8 = new Uint8Array(buf);
            assetCache.set('/' + filename, u8);
            assetCache.set(filename, u8);

            // Pre-decode PNGs into Image cache
            if (filename.endsWith('.png') || filename === 'm') {
                try {
                    const img = Image.createImage(u8, 0, u8.length, 1);
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
    if (fill) fill.style.width = "100%";
    if (txt) txt.textContent = "Booting Pure Native Engine...";
    if (timerTxt) timerTxt.textContent = "Ready (0.0s)";
}

// 6. Game Bootstrapper
export async function startNativeEngine(assetBase = "assets/", versionHash = "v20261022_b9") {
    console.log("=== Nightmare Before Christmas Pure Native Engine Booting ===");
    const t0 = performance.now();

    await preloadAssets(assetBase, versionHash);
    await loadGameClasses(versionHash);

    // Instantiate MIDlet
    const midlet = new GMIDlet();
    midlet.startApp();

    const tInstance = GMIDlet.var_t_a;
    if (!tInstance) {
        throw new Error("Game Canvas instance (t) failed to initialize");
    }

    // Connect Canvas & Graphics (480x640 native canvas with 2x scale for crisp 2x textures & fonts)
    const canvas = document.getElementById("display");
    if (!canvas) {
        throw new Error("Display canvas element #display not found in DOM");
    }

    canvas.width = 480;
    canvas.height = 640;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    ctx.imageSmoothingEnabled = false;

    const graphics = new Graphics(ctx, 240, 320, 2);

    // Directional Input Manager for Authentic 1-Step-Per-Tap & Auto-Repeat
    const dirManager = new DirectionInputManager(tInstance);
    window.__dirManager = dirManager;

    // Render initial frame into canvas so graphics are ready before veil lifts
    try {
        tInstance.paint(graphics);
    } catch (_) {}

    // Smoothly dismiss full-screen splash veil
    const splash = document.getElementById("splash-screen");
    if (splash) {
        splash.classList.add("fade-out");
        setTimeout(() => {
            try { splash.remove(); } catch (_) {}
        }, 360);
    }
    canvas.focus();

    // Setup High-Precision Game Render Loop (Authentic 25 FPS = 40ms per tick)
    let lastTick = performance.now();
    const TICK_INTERVAL = 40; // Authentic Living Mobile 2005 rate (this.var_int_h in t.js)

    function gameLoop(now) {
        requestAnimationFrame(gameLoop);

        const elapsed = now - lastTick;
        if (elapsed >= TICK_INTERVAL) {
            lastTick = now - (elapsed % TICK_INTERVAL);
            try {
                tInstance.g();
                dirManager.onGameTick();
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
    setupInputControls(tInstance, dirManager);

    const bootTime = Math.round(performance.now() - t0);
    console.log(`Native Engine booted successfully in ${bootTime}ms! Instant 0s launch.`);
}

const DIRECTION_KEYS = new Set([-1, -2, -3, -4, 50, 52, 54, 56]);

class DirectionInputManager {
    constructor(tInstance) {
        this.t = tInstance;
        // Physical state: set of direction keys currently physically held by user
        this.heldKeys = new Set();
        // Chronological order of physical direction presses (last element = newest press)
        this.heldOrder = [];
        // The direction key currently asserted into the engine (t.keyPressed)
        this.engineKey = null;
    }

    // Get the user's current physically requested direction (most recent held key)
    getDesiredKey() {
        for (let i = this.heldOrder.length - 1; i >= 0; i--) {
            const key = this.heldOrder[i];
            if (this.heldKeys.has(key)) return key;
        }
        return null;
    }

    handlePress(j2meKey) {
        if (!DIRECTION_KEYS.has(j2meKey)) {
            this.t.keyPressed(j2meKey);
            return;
        }

        this.heldKeys.add(j2meKey);
        this.heldOrder = this.heldOrder.filter(k => k !== j2meKey);
        this.heldOrder.push(j2meKey);

        const jack = this.t?.var_n_a?.var_q_a;
        const isMoving = jack ? (jack.f_e === 1 || jack.f_e === 4) : false;

        // If Jack is NOT currently moving (sync lock is OPEN), start freshly right away!
        if (!isMoving) {
            this.applyEngineKey(j2meKey);
        } else {
            // Jack is currently busy completing a step in some direction.
            // If the old direction in engine is no longer physically held, release it now
            // so Jack will not auto-repeat the old direction when his current step finishes.
            if (this.engineKey !== null && !this.heldKeys.has(this.engineKey)) {
                this.t.keyReleased(this.engineKey);
                this.engineKey = null;
            }
            // The new key is recorded in this.heldKeys / heldOrder.
            // It will be actioned upon ONLY when the sync lock opens (in onGameTick),
            // provided the user is STILL holding it at that moment.
        }
    }

    handleRelease(j2meKey) {
        if (!DIRECTION_KEYS.has(j2meKey)) {
            this.t.keyReleased(j2meKey);
            return;
        }

        this.heldKeys.delete(j2meKey);
        this.heldOrder = this.heldOrder.filter(k => k !== j2meKey);

        const desiredKey = this.getDesiredKey();

        // Hardest rule: if user stopped touching any control button, even for a brief moment,
        // current objective should be to stop.
        if (desiredKey === null) {
            const jack = this.t?.var_n_a?.var_q_a;
            const isMoving = jack ? (jack.f_e === 1 || jack.f_e === 4) : false;

            // If Jack is already in motion, release key immediately so he stops after this tile.
            // If Jack has finished turning (f_v <= 0), release immediately.
            // Otherwise, keep asserted until step initiates or turning finishes.
            if (this.engineKey !== null) {
                if (isMoving || (jack && jack.f_v <= 0)) {
                    this.t.keyReleased(this.engineKey);
                    this.engineKey = null;
                }
            }
            return;
        }

        // Another direction key is still physically held
        const jack = this.t?.var_n_a?.var_q_a;
        const isMoving = jack ? (jack.f_e === 1 || jack.f_e === 4) : false;
        if (!isMoving) {
            this.applyEngineKey(desiredKey);
        }
    }

    applyEngineKey(key) {
        if (this.engineKey === key) return;

        if (this.engineKey !== null) {
            this.t.keyReleased(this.engineKey);
        }
        this.engineKey = key;
        if (key !== null) {
            this.t.keyPressed(key);
        }
    }

    releaseAll() {
        this.heldKeys.clear();
        this.heldOrder = [];
        if (this.engineKey !== null) {
            this.t.keyReleased(this.engineKey);
            this.engineKey = null;
        }
        for (const k of DIRECTION_KEYS) {
            this.t.keyReleased(k);
        }
    }

    onGameTick() {
        const jack = this.t?.var_n_a?.var_q_a;
        if (!jack) return;

        const isMoving = (jack.f_e === 1 || jack.f_e === 4);
        const desiredKey = this.getDesiredKey();

        // 1. If user is touching NO direction buttons:
        // Current objective is strictly to STOP.
        if (desiredKey === null) {
            if (this.engineKey !== null) {
                if (isMoving || jack.f_v <= 0) {
                    this.t.keyReleased(this.engineKey);
                    this.engineKey = null;
                }
            }
            return;
        }

        // 2. User IS holding a direction button (desiredKey !== null):
        if (isMoving) {
            // Jack is currently in mid-stride (sync lock is CLOSED).
            // If the key currently active in the engine is NOT what the user wants,
            // release it so the previous direction doesn't repeat after this tile.
            if (this.engineKey !== null && this.engineKey !== desiredKey) {
                this.t.keyReleased(this.engineKey);
                this.engineKey = null;
            }
            return;
        }

        // 3. Jack is NOT moving (sync lock is OPEN! jack.f_e !== 1 && jack.f_e !== 4):
        // Check if user is STILL pressing desiredKey right now:
        if (this.heldKeys.has(desiredKey)) {
            if (this.engineKey !== desiredKey) {
                // "start freshly, just like if user pressed going left right one it was ok"
                this.applyEngineKey(desiredKey);
            } else {
                // Keep asserting key in engine so Jack takes step after step smoothly without stopping!
                this.t.keyPressed(desiredKey);
            }
        }
    }
}

function setupInputControls(tInstance, dirManager) {
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

    // Toolbar Buttons & Sound Controls
    const btnMute = document.getElementById("btn-mute");

    function updateMuteButtonUI(muted) {
        if (btnMute) {
            btnMute.textContent = muted ? "🔇" : "🔊";
            btnMute.classList.toggle("muted", muted);
            btnMute.title = muted ? "Unmute Sound (or press M)" : "Mute Sound (or press M)";
        }
    }

    if (btnMute) {
        updateMuteButtonUI(AudioManager.muted);
        btnMute.addEventListener("click", () => {
            const muted = AudioManager.toggleMute();
            updateMuteButtonUI(muted);
        });
    }

    const btnReset = document.getElementById("btn-reset");
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            location.reload();
        });
    }

    const btnFullscreen = document.getElementById("btn-fullscreen");
    if (btnFullscreen) {
        btnFullscreen.addEventListener("click", () => {
            if (window.Telegram?.WebApp) {
                const tg = window.Telegram.WebApp;
                if (typeof tg.requestFullscreen === 'function') {
                    try {
                        if (tg.isFullscreen) {
                            if (typeof tg.exitFullscreen === 'function') tg.exitFullscreen();
                        } else {
                            tg.requestFullscreen();
                        }
                        return;
                    } catch (_) {}
                }
            }
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });
    }

    window.addEventListener("keydown", (e) => {
        if (e.code === "KeyM") {
            const muted = AudioManager.toggleMute();
            updateMuteButtonUI(muted);
            e.preventDefault();
            return;
        }
        const j2meKey = KEY_MAP[e.code];
        if (j2meKey !== undefined) {
            e.preventDefault();
            dirManager.handlePress(j2meKey);
            triggerButtonActive(e.code, true);
        }
    });

    window.addEventListener("keyup", (e) => {
        const j2meKey = KEY_MAP[e.code];
        if (j2meKey !== undefined) {
            e.preventDefault();
            dirManager.handleRelease(j2meKey);
            triggerButtonActive(e.code, false);
        }
    });

    // --- 1. D-PAD SLIDING FINGER CONTROLLER ---
    // Allows seamless slide-to-move across all 8 directions and diagonals
    const dpadGrid = document.getElementById("dpad-grid") || document.querySelector(".dpad-8way-grid");
    if (dpadGrid) {
        let currentDir = null;
        let dpadPointerId = null;

        const dirButtons = {
            "up": dpadGrid.querySelector('[data-dir="up"]'),
            "down": dpadGrid.querySelector('[data-dir="down"]'),
            "left": dpadGrid.querySelector('[data-dir="left"]'),
            "right": dpadGrid.querySelector('[data-dir="right"]'),
            "up-left": dpadGrid.querySelector('[data-dir="up-left"]'),
            "up-right": dpadGrid.querySelector('[data-dir="up-right"]'),
            "down-left": dpadGrid.querySelector('[data-dir="down-left"]'),
            "down-right": dpadGrid.querySelector('[data-dir="down-right"]')
        };

        const DIR_KEYS = {
            "up": [-1],
            "down": [-2],
            "left": [-3],
            "right": [-4],
            "up-left": [-1, -3],
            "up-right": [-1, -4],
            "down-left": [-2, -3],
            "down-right": [-2, -4]
        };

        function getDirectionAtPoint(clientX, clientY) {
            // First check direct element under the finger
            const el = document.elementFromPoint(clientX, clientY);
            if (el) {
                const btn = el.closest(".dpad-cell[data-dir]");
                if (btn) return btn.getAttribute("data-dir");
                if (el.closest(".dpad-center-hub")) return null;
            }

            // Fallback: 360-degree radial vector geometry from D-pad center
            const rect = dpadGrid.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = clientX - cx;
            const dy = clientY - cy;
            const dist = Math.hypot(dx, dy);

            // Neutral center dead-zone (approx radius of center hub)
            const deadZone = rect.width * 0.16;
            // Outer release boundary
            const maxRadius = rect.width * 0.95;

            if (dist < deadZone || dist > maxRadius) {
                return null;
            }

            let deg = Math.atan2(dy, dx) * (180 / Math.PI);
            if (deg < 0) deg += 360;

            const sector = Math.floor(((deg + 22.5) % 360) / 45);
            const SECTORS = [
                "right",       // 0: [337.5°, 22.5°)
                "down-right",  // 1: [22.5°, 67.5°)
                "down",        // 2: [67.5°, 112.5°)
                "down-left",   // 3: [112.5°, 157.5°)
                "left",        // 4: [157.5°, 202.5°)
                "up-left",     // 5: [202.5°, 247.5°)
                "up",          // 6: [247.5°, 292.5°)
                "up-right"     // 7: [292.5°, 337.5°)
            ];
            return SECTORS[sector] || null;
        }

        function setDpadDirection(newDir) {
            if (newDir === currentDir) return;

            // Release previous direction
            if (currentDir) {
                const oldBtn = dirButtons[currentDir];
                if (oldBtn) oldBtn.classList.remove("active");
                const oldKeys = DIR_KEYS[currentDir];
                if (oldKeys) {
                    oldKeys.forEach(k => dirManager.handleRelease(k));
                }
            }

            currentDir = newDir;

            // Press new direction
            if (currentDir) {
                const newBtn = dirButtons[currentDir];
                if (newBtn) newBtn.classList.add("active");
                const newKeys = DIR_KEYS[currentDir];
                if (newKeys) {
                    newKeys.forEach(k => dirManager.handlePress(k));
                }
                if (navigator.vibrate) navigator.vibrate(8);
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    try { window.Telegram.WebApp.HapticFeedback.impactOccurred("light"); } catch (_) {}
                }
                AudioManager.playClick();
            }
        }

        function releaseDpad() {
            if (currentDir) {
                const oldBtn = dirButtons[currentDir];
                if (oldBtn) oldBtn.classList.remove("active");
                const oldKeys = DIR_KEYS[currentDir];
                if (oldKeys) {
                    oldKeys.forEach(k => dirManager.handleRelease(k));
                }
                currentDir = null;
            }
            dirManager.releaseAll();
        }

        dpadGrid.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            dpadPointerId = e.pointerId;
            try { dpadGrid.setPointerCapture(e.pointerId); } catch (_) {}
            const dir = getDirectionAtPoint(e.clientX, e.clientY);
            setDpadDirection(dir);
        });

        dpadGrid.addEventListener("pointermove", (e) => {
            if (dpadPointerId === null || e.pointerId !== dpadPointerId) return;
            e.preventDefault();
            const dir = getDirectionAtPoint(e.clientX, e.clientY);
            setDpadDirection(dir);
        });

        const onPointerEnd = (e) => {
            if (dpadPointerId === null || e.pointerId !== dpadPointerId) return;
            e.preventDefault();
            try { dpadGrid.releasePointerCapture(e.pointerId); } catch (_) {}
            dpadPointerId = null;
            releaseDpad();
        };

        dpadGrid.addEventListener("pointerup", onPointerEnd);
        dpadGrid.addEventListener("pointercancel", onPointerEnd);
    }

    // --- 2. INDEPENDENT ACTION & UTILITY BUTTONS (OK, *, 0, #, LSK, RSK) ---
    const actionButtons = document.querySelectorAll(".ctrl-btn:not(.dpad-cell)");
    actionButtons.forEach((btn) => {
        const keyData = btn.getAttribute("data-key");
        if (!keyData) return;

        const keys = keyData.split(",");

        const handlePress = (e) => {
            e.preventDefault();
            btn.classList.add("active");
            try { btn.setPointerCapture(e.pointerId); } catch (_) {}
            if (navigator.vibrate) navigator.vibrate(12);
            if (window.Telegram?.WebApp?.HapticFeedback) {
                try { window.Telegram.WebApp.HapticFeedback.impactOccurred("light"); } catch (_) {}
            }
            AudioManager.playClick();

            keys.forEach((k) => {
                const j2meKey = KEY_MAP[k.trim()];
                if (j2meKey !== undefined) dirManager.handlePress(j2meKey);
            });
        };

        const handleRelease = (e) => {
            e.preventDefault();
            btn.classList.remove("active");
            try { btn.releasePointerCapture(e.pointerId); } catch (_) {}

            keys.forEach((k) => {
                const j2meKey = KEY_MAP[k.trim()];
                if (j2meKey !== undefined) dirManager.handleRelease(j2meKey);
            });
        };

        btn.addEventListener("pointerdown", handlePress);
        btn.addEventListener("pointerup", handleRelease);
        btn.addEventListener("pointercancel", handleRelease);
    });

    // Global fail-safe release for non-D-Pad buttons
    const releaseAllActionButtons = () => {
        actionButtons.forEach((btn) => {
            if (btn.classList.contains("active")) {
                btn.classList.remove("active");
                const keyData = btn.getAttribute("data-key");
                if (keyData) {
                    keyData.split(",").forEach(k => {
                        const j2meKey = KEY_MAP[k.trim()];
                        if (j2meKey !== undefined) dirManager.handleRelease(j2meKey);
                    });
                }
            }
        });
    };

    const handleGlobalRelease = (e) => {
        if (e.touches && e.touches.length > 0) return;
        if (e.target && e.target.classList && e.target.classList.contains("ctrl-btn")) return;
        releaseAllActionButtons();
    };

    window.addEventListener("pointerup", handleGlobalRelease);
    window.addEventListener("pointercancel", handleGlobalRelease);
    window.addEventListener("blur", () => {
        releaseAllActionButtons();
        dirManager.releaseAll();
    });
}

function triggerButtonActive(code, isActive) {
    const btns = document.querySelectorAll(`[data-key*="${code}"]`);
    btns.forEach(b => {
        if (isActive) b.classList.add("active");
        else b.classList.remove("active");
    });
}
