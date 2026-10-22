import fs from 'fs';
import path from 'path';

const file = path.resolve('engine/main.js');
let code = fs.readFileSync(file, 'utf8');

// 1. Replace Timer with dummy Timer so s.run() does not run a concurrent loop
const oldTimer = `window.Timer = class Timer {
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
};`;

const newTimer = `window.Timer = class Timer {
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
};`;

// 2. Replace gameLoop and setupInputControls with single 25 FPS clock & responsive single-step input manager
const oldGameLoopAndControls = `    // Setup High-Precision Game Render Loop
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
    console.log(\`Native Engine booted successfully in \${bootTime}ms! Instant 0s launch.\`);
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
    });`;

const newGameLoopAndControls = `    // Directional Input Manager for Authentic 1-Step-Per-Tap & Auto-Repeat
    const dirManager = new DirectionInputManager(tInstance);

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
    console.log(\`Native Engine booted successfully in \${bootTime}ms! Instant 0s launch.\`);
}

const DIRECTION_KEYS = new Set([-1, -2, -3, -4, 50, 52, 54, 56]);

class DirectionInputManager {
    constructor(tInstance) {
        this.t = tInstance;
        this.states = new Map(); // j2meKey -> state
    }

    handlePress(j2meKey) {
        if (!DIRECTION_KEYS.has(j2meKey)) {
            this.t.keyPressed(j2meKey);
            return;
        }

        let state = this.states.get(j2meKey);
        if (!state) {
            state = {
                pressTime: performance.now(),
                releasedByUser: false,
                stepInitiated: false,
                repeatActive: false
            };
            this.states.set(j2meKey, state);
            this.t.keyPressed(j2meKey);
        } else {
            state.releasedByUser = false;
        }
    }

    handleRelease(j2meKey) {
        if (!DIRECTION_KEYS.has(j2meKey)) {
            this.t.keyReleased(j2meKey);
            return;
        }

        const state = this.states.get(j2meKey);
        if (!state) {
            this.t.keyReleased(j2meKey);
            return;
        }

        state.releasedByUser = true;
        // If Jack has already begun stepping, release immediately so he stops at 1 step
        if (state.stepInitiated) {
            this.t.keyReleased(j2meKey);
            this.states.delete(j2meKey);
        }
    }

    onGameTick() {
        const now = performance.now();
        const jack = this.t?.var_n_a?.var_q_a;
        const isMoving = jack && (jack.f_e === 1 || jack.f_e === 4);

        for (const [key, state] of this.states.entries()) {
            const holdMs = now - state.pressTime;

            if (isMoving) {
                state.stepInitiated = true;
            }

            if (state.releasedByUser) {
                // User already released the button/key
                if (state.stepInitiated || holdMs >= 80) {
                    this.t.keyReleased(key);
                    this.states.delete(key);
                }
            } else {
                // User is still physically holding down the key/button
                if (holdMs < 280) {
                    // Tap window (< 280ms): if step is locked in, release key in engine so Jack takes only 1 step
                    if (state.stepInitiated) {
                        this.t.keyReleased(key);
                    }
                } else {
                    // Long hold (> 280ms): continuous smooth walking!
                    this.t.keyPressed(key);
                    state.repeatActive = true;
                }
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

    window.addEventListener("keydown", (e) => {
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

    // 8-Way Tactile Controller Buttons
    const buttons = document.querySelectorAll(".ctrl-btn");
    buttons.forEach((btn) => {
        const keyData = btn.getAttribute("data-key");
        if (!keyData) return;

        const keys = keyData.split(",");

        const handlePress = (e) => {
            e.preventDefault();
            btn.classList.add("active");
            try { btn.setPointerCapture(e.pointerId); } catch (_) {}
            if (navigator.vibrate) navigator.vibrate(12);
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
        btn.addEventListener("pointerleave", handleRelease);
    });`;

const isCRLF = code.includes('\r\n');
code = code.replace(isCRLF ? oldTimer.replace(/\n/g, '\r\n') : oldTimer, isCRLF ? newTimer.replace(/\n/g, '\r\n') : newTimer);
code = code.replace(isCRLF ? oldGameLoopAndControls.replace(/\n/g, '\r\n') : oldGameLoopAndControls, isCRLF ? newGameLoopAndControls.replace(/\n/g, '\r\n') : newGameLoopAndControls);

fs.writeFileSync(file, code, 'utf8');
console.log("Successfully updated engine/main.js with single-step control & 25 FPS clock!");

