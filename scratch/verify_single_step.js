import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

async function main() {
    console.log("=== Launching Chrome to Verify 1-Step-Per-Tap & Authentic 25 FPS ===");
    const chrome = spawn(CHROME_PATH, [
        `--remote-debugging-port=${PORT}`,
        '--headless=new',
        '--disable-gpu',
        '--disable-extensions',
        '--autoplay-policy=no-user-gesture-required',
        '--user-data-dir=C:\\Windows\\Temp\\chrome_nbc_step_verify',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=460,940',
        'http://localhost:8080/player/index.html'
    ]);

    let wsUrl = null;
    for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 250));
        try {
            const list = await new Promise((resolve, reject) => {
                http.get(`http://localhost:${PORT}/json`, res => {
                    let d = '';
                    res.on('data', c => d += c);
                    res.on('end', () => resolve(JSON.parse(d)));
                }).on('error', reject);
            });
            const target = list.find(t => t.type === 'page' && t.url.includes('8080'));
            if (target && target.webSocketDebuggerUrl) {
                wsUrl = target.webSocketDebuggerUrl;
                break;
            }
        } catch (e) {}
    }

    if (!wsUrl) {
        console.error("Could not connect to Chrome CDP");
        chrome.kill();
        process.exit(1);
    }

    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    function cdp(method, params = {}) {
        return new Promise(resolve => {
            const id = msgId++;
            const handler = (e) => {
                const msg = JSON.parse(e.data);
                if (msg.id === id) {
                    ws.removeEventListener('message', handler);
                    resolve(msg.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    await cdp("Runtime.enable");

    async function evaluate(code) {
        const res = await cdp("Runtime.evaluate", { expression: code, returnByValue: true, awaitPromise: true });
        return res?.result?.value;
    }

    // Wait for engine to boot
    for (let i = 0; i < 40; i++) {
        const ready = await evaluate(`typeof window.GMIDlet !== 'undefined' && !!window.GMIDlet?.var_t_a`);
        if (ready) break;
        await new Promise(r => setTimeout(r, 250));
    }

    console.log("Engine booted! Fast-forwarding directly into active Level 1 room...");

    // Fast-forward directly into Room 0
    await evaluate(`
        window.t.a(0); // language
        const tInst = window.GMIDlet.var_t_a;
        tInst.l();
        tInst.var_n_a.c();
        tInst.var_n_a.c(0);
        tInst.m();
        tInst.g();
        // Dismiss briefing
        tInst.keyPressed(-6); tInst.g(); tInst.keyReleased(-6);
        tInst.keyPressed(-6); tInst.g(); tInst.keyReleased(-6);
    `);

    await new Promise(r => setTimeout(r, 400));

    // 1. Measure FPS / tick rate in live browser
    console.log("Measuring live browser tick rate over 1000ms...");
    const fps = await evaluate(`
        new Promise(resolve => {
            let ticks = 0;
            const origG = window.GMIDlet.var_t_a.g;
            window.GMIDlet.var_t_a.g = function() {
                ticks++;
                return origG.apply(this, arguments);
            };
            setTimeout(() => {
                window.GMIDlet.var_t_a.g = origG;
                resolve(ticks);
            }, 1000);
        })
    `);
    console.log(`Live game tick rate: ${fps} ticks/sec (Expected: ~25 FPS)`);

    // 2. Check initial Jack position
    const startPos = await evaluate(`({
        x: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_b,
        y: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_d
    })`);
    console.log("Jack starting position:", startPos);

    // 3. Test tapping UP via Keyboard (ArrowUp, duration = 160ms)
    console.log("\n--- Testing Single Tap UP (ArrowUp Keyboard) ---");
    await evaluate(`
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));
    `);
    await new Promise(r => setTimeout(r, 160));
    await evaluate(`
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowUp', bubbles: true }));
    `);

    // Wait 400ms for movement to settle
    await new Promise(r => setTimeout(r, 400));

    const posAfterUp = await evaluate(`({
        x: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_b,
        y: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_d
    })`);
    const deltaYUp = posAfterUp.y - startPos.y;
    console.log("Jack pos after 1 tap UP:", posAfterUp, `(Delta Y = ${deltaYUp})`);

    // 4. Test tapping DOWN via on-screen 3D button (PointerEvent, duration = 160ms)
    console.log("\n--- Testing Single Tap DOWN (3D On-Screen D-Pad Button) ---");
    await evaluate(`
        const btn = document.querySelector('.dpad-cell[data-key="ArrowDown"]');
        btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1 }));
    `);
    await new Promise(r => setTimeout(r, 160));
    await evaluate(`
        const btn = document.querySelector('.dpad-cell[data-key="ArrowDown"]');
        btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
    `);

    // Wait 400ms for movement to settle
    await new Promise(r => setTimeout(r, 400));

    const posAfterDown = await evaluate(`({
        x: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_b,
        y: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_d
    })`);
    const deltaYDown = posAfterDown.y - posAfterUp.y;
    console.log("Jack pos after 1 tap DOWN:", posAfterDown, `(Delta Y = ${deltaYDown})`);

    ws.close();
    chrome.kill();

    if (deltaYUp === -1 && deltaYDown === 1) {
        console.log("\n=== SUCCESS: Each tap moves Jack EXACTLY 1 step! ===");
        process.exit(0);
    } else {
        console.error(`\n=== FAILURE: Steps were deltaYUp=${deltaYUp}, deltaYDown=${deltaYDown} ===`);
        process.exit(1);
    }
}

main().catch(err => {
    console.error("Verification error:", err);
    process.exit(1);
});

