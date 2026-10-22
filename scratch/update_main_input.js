import fs from 'fs';
import path from 'path';

const file = path.resolve('engine/main.js');
let code = fs.readFileSync(file, 'utf8');

const oldDirManager = `class DirectionInputManager {
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
}`;

const newDirManager = `class DirectionInputManager {
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
                stepInitiated: false,
                repeatActive: false
            };
            this.states.set(j2meKey, state);
            this.t.keyPressed(j2meKey);
        }
    }

    handleRelease(j2meKey) {
        this.t.keyReleased(j2meKey);
        this.states.delete(j2meKey);
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

            // If user has held for less than the repeat threshold (400ms):
            // Once the step is initiated, release the key in engine so Jack stops after exactly 1 tile!
            if (holdMs < 400) {
                if (state.stepInitiated) {
                    this.t.keyReleased(key);
                }
            } else {
                // Long continuous hold (> 400ms): re-assert key for continuous smooth walking!
                this.t.keyPressed(key);
                state.repeatActive = true;
            }
        }
    }
}`;

const isCRLF = code.includes('\r\n');
code = code.replace(isCRLF ? oldDirManager.replace(/\n/g, '\r\n') : oldDirManager, isCRLF ? newDirManager.replace(/\n/g, '\r\n') : newDirManager);

fs.writeFileSync(file, code, 'utf8');
console.log("Updated DirectionInputManager in engine/main.js successfully!");

