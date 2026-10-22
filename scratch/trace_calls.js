import { spawn } from 'child_process';
import http from 'http';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

async function main() {
    const chrome = spawn(CHROME_PATH, [
        `--remote-debugging-port=${PORT}`,
        '--headless=new',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-cache',
        '--autoplay-policy=no-user-gesture-required',
        '--user-data-dir=C:\\Windows\\Temp\\chrome_nbc_trace_calls',
        '--no-first-run',
        '--no-default-browser-check',
        'about:blank'
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
            const target = list.find(t => t.type === 'page');
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
    await cdp("Page.navigate", { url: 'http://localhost:8080/player/index.html' });

    async function evaluate(code) {
        const res = await cdp("Runtime.evaluate", { expression: code, returnByValue: true, awaitPromise: true });
        return res?.result?.value;
    }

    for (let i = 0; i < 40; i++) {
        const ready = await evaluate(`typeof window.GMIDlet !== 'undefined' && !!window.GMIDlet?.var_t_a`);
        if (ready) break;
        await new Promise(r => setTimeout(r, 200));
    }

    // Direct room 0 setup
    await evaluate(`
        window.t.a(0);
        const tInst = window.GMIDlet.var_t_a;
        tInst.l();
        tInst.var_n_a.c();
        tInst.var_n_a.c(0);
        tInst.m();
        tInst.g();
        tInst.keyPressed(-6); tInst.g(); tInst.keyReleased(-6);
        tInst.keyPressed(-6); tInst.g(); tInst.keyReleased(-6);
    `);
    await new Promise(r => setTimeout(r, 300));

    // Install logger in tInstance & dirManager
    await evaluate(`
        window.__events = [];
        const log = (msg) => window.__events.push({ time: Math.round(performance.now()), msg });

        const dm = window.__dirManager;
        const origHP = dm.handlePress.bind(dm);
        const origHR = dm.handleRelease.bind(dm);
        const origGT = dm.onGameTick.bind(dm);

        dm.handlePress = function(k) {
            log('dm.handlePress(' + k + ')');
            return origHP(k);
        };
        dm.handleRelease = function(k) {
            log('dm.handleRelease(' + k + ')');
            return origHR(k);
        };
        dm.onGameTick = function() {
            const jack = this.t?.var_n_a?.var_q_a;
            log('dm.onGameTick: statesCount=' + this.states.size + ' fe=' + jack?.f_e + ' fg=' + jack?.f_g + ' short_a=' + this.t.var_n_a.var_short_a);
            return origGT();
        };

        const tInst = window.GMIDlet.var_t_a;
        const origKP = tInst.keyPressed.bind(tInst);
        const origKR = tInst.keyReleased.bind(tInst);
        tInst.keyPressed = function(k) {
            log('t.keyPressed(' + k + ')');
            return origKP(k);
        };
        tInst.keyReleased = function(k) {
            log('t.keyReleased(' + k + ')');
            return origKR(k);
        };
    `);

    console.log("Testing Button Tap...");
    await evaluate(`
        const btn = document.querySelector('.dpad-cell[data-key="ArrowDown"]');
        btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1 }));
    `);
    await new Promise(r => setTimeout(r, 150));
    await evaluate(`
        const btn = document.querySelector('.dpad-cell[data-key="ArrowDown"]');
        btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
    `);

    await new Promise(r => setTimeout(r, 600));

    const events = await evaluate(`window.__events`);
    console.log(`Captured ${events.length} events:`);
    for (const e of events) {
        console.log(`t=${e.time}: ${e.msg}`);
    }

    ws.close();
    chrome.kill();
}

main().catch(console.error);

