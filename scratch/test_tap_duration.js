import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

async function main() {
    console.log("=== Launching Chrome to measure tap step count ===");
    const chrome = spawn(CHROME_PATH, [
        `--remote-debugging-port=${PORT}`,
        '--headless=new',
        '--disable-gpu',
        '--disable-extensions',
        '--autoplay-policy=no-user-gesture-required',
        '--user-data-dir=C:\\Windows\\Temp\\chrome_nbc_tap_test',
        '--no-first-run',
        '--no-default-browser-check',
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

    // Wait for engine
    for (let i = 0; i < 30; i++) {
        const ok = await evaluate(`typeof window.GMIDlet !== 'undefined' && !!window.GMIDlet?.var_t_a`);
        if (ok) break;
        await new Promise(r => setTimeout(r, 200));
    }

    // Measure tick rate in Chrome!
    const tickStats = await evaluate(`
        new Promise(resolve => {
            let gCalls = 0;
            const origG = window.GMIDlet.var_t_a.g;
            window.GMIDlet.var_t_a.g = function() {
                gCalls++;
                return origG.apply(this, arguments);
            };
            setTimeout(() => {
                window.GMIDlet.var_t_a.g = origG;
                resolve({ gCallsPerSec: gCalls });
            }, 1000);
        })
    `);
    console.log("Measured g() calls per second in Chrome:", tickStats);

    // Fast-forward to level 1 gameplay
    await evaluate(`
        window.t.a(0);
        const tInst = window.GMIDlet.var_t_a;
        tInst.l();
        tInst.var_n_a.c();
        tInst.var_n_a.c(0);
        tInst.m();
        tInst.g();
        // double dismiss briefing
        tInst.keyPressed(-6); tInst.g(); tInst.keyReleased(-6);
        tInst.keyPressed(-6); tInst.g(); tInst.keyReleased(-6);
    `);

    await new Promise(r => setTimeout(r, 300));

    const startPos = await evaluate(`({
        x: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_b,
        y: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_d
    })`);
    console.log("Start pos:", startPos);

    // Test a normal 150ms button tap on UP (-1)
    console.log("Simulating a 150ms tap of UP key...");
    await evaluate(`window.GMIDlet.var_t_a.keyPressed(-1)`);
    await new Promise(r => setTimeout(r, 150));
    await evaluate(`window.GMIDlet.var_t_a.keyReleased(-1)`);

    // Wait 500ms for motion to complete
    await new Promise(r => setTimeout(r, 500));

    const posAfterUp = await evaluate(`({
        x: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_b,
        y: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_d
    })`);
    console.log("Pos after 150ms UP tap:", posAfterUp, "Delta Y:", posAfterUp.y - startPos.y);

    // Now test clicking the on-screen button!
    console.log("Simulating a click on Down on-screen button...");
    await evaluate(`
        const downBtn = document.querySelector('.dpad-cell[data-key="ArrowDown"]');
        downBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    `);
    await new Promise(r => setTimeout(r, 200));
    await evaluate(`
        const downBtn = document.querySelector('.dpad-cell[data-key="ArrowDown"]');
        downBtn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    `);

    await new Promise(r => setTimeout(r, 500));
    const posAfterDown = await evaluate(`({
        x: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_b,
        y: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_d
    })`);
    console.log("Pos after 200ms Down button click:", posAfterDown);

    ws.close();
    chrome.kill();
}

main().catch(console.error);

