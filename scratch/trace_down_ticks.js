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
        '--user-data-dir=C:\\Windows\\Temp\\chrome_nbc_trace_down',
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
    await cdp("Network.enable");
    await cdp("Network.setCacheDisabled", { cacheDisabled: true });
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

    // Install logger in tInstance.g()
    await evaluate(`
        window.__tickLogs = [];
        const origG = window.GMIDlet.var_t_a.g;
        window.GMIDlet.var_t_a.g = function() {
            const j = this.var_n_a.var_q_a;
            window.__tickLogs.push({
                time: Math.round(performance.now()),
                short_a: this.var_n_a.var_short_a,
                pos: [j.var_int_b, j.var_int_d],
                f_e: j.f_e,
                f_g: j.f_g,
                f_o: j.f_o,
                f_v: j.f_v
            });
            return origG.apply(this, arguments);
        };
    `);

    console.log("Pressing DOWN on-screen button...");
    await evaluate(`
        const btn = document.querySelector('.dpad-cell[data-key="ArrowDown"]');
        btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1 }));
    `);
    await new Promise(r => setTimeout(r, 150));
    console.log("Releasing DOWN on-screen button...");
    await evaluate(`
        const btn = document.querySelector('.dpad-cell[data-key="ArrowDown"]');
        btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
    `);

    await new Promise(r => setTimeout(r, 500));

    const logs = await evaluate(`window.__tickLogs`);
    console.log(`Captured ${logs.length} ticks:`);
    for (const l of logs) {
        console.log(`t=${l.time} short_a=${l.short_a} pos=(${l.pos}) f_e=${l.f_e} f_g=${l.f_g} f_o=${l.f_o} f_v=${l.f_v}`);
    }

    ws.close();
    chrome.kill();
}

main().catch(console.error);

