import { spawn } from 'child_process';
import http from 'http';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

async function main() {
    console.log("=== Testing Single Step Movement in Browser ===");
    const chrome = spawn(CHROME_PATH, [
        `--remote-debugging-port=${PORT}`,
        '--headless=new',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-cache',
        '--autoplay-policy=no-user-gesture-required',
        '--user-data-dir=C:\\Windows\\Temp\\chrome_nbc_step_test',
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

    // Wait for engine to boot
    for (let i = 0; i < 40; i++) {
        const ready = await evaluate(`typeof window.GMIDlet !== 'undefined' && !!window.GMIDlet?.var_t_a`);
        if (ready) break;
        await new Promise(r => setTimeout(r, 200));
    }

    // Unlock audio and start directly in room 0
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

    await new Promise(r => setTimeout(r, 400));

    const getJack = async () => await evaluate(`({
        x: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_b,
        y: window.GMIDlet.var_t_a.var_n_a.var_q_a.var_int_d,
        f_e: window.GMIDlet.var_t_a.var_n_a.var_q_a.f_e,
        f_g: window.GMIDlet.var_t_a.var_n_a.var_q_a.f_g
    })`);

    const p0 = await getJack();
    console.log("Initial Jack pos:", p0);

    // Test 1: Tap UP (150ms press)
    console.log("\n--- Tapping UP key for 150ms ---");
    await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }))`);
    await new Promise(r => setTimeout(r, 150));
    await evaluate(`window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowUp', bubbles: true }))`);

    // Sample Jack over next 500ms
    const samplesUp = [];
    for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 50));
        samplesUp.push(await getJack());
    }
    const p1 = samplesUp[samplesUp.length - 1];
    console.log("Positions after tap UP:", samplesUp.map(s => `(${s.x},${s.y},f_e=${s.f_e})`));
    console.log("Final pos after 1 tap UP:", p1, "Delta Y:", p1.y - p0.y);

    // Test 2: Tap DOWN using Keyboard (150ms press)
    console.log("\n--- Tapping DOWN key for 150ms ---");
    await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true }))`);
    await new Promise(r => setTimeout(r, 150));
    await evaluate(`window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowDown', bubbles: true }))`);

    const samplesDown = [];
    for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 50));
        samplesDown.push(await getJack());
    }
    const p2 = samplesDown[samplesDown.length - 1];
    console.log("Positions after tap DOWN:", samplesDown.map(s => `(${s.x},${s.y},f_e=${s.f_e})`));
    console.log("Final pos after 1 tap DOWN:", p2, "Delta Y:", p2.y - p1.y);

    // Test 3: Tap UP using on-screen button (150ms press)
    console.log("\n--- Tapping UP on-screen button for 150ms ---");
    await evaluate(`
        const btn = document.querySelector('.dpad-cell[data-key="ArrowUp"]');
        btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1 }));
    `);
    await new Promise(r => setTimeout(r, 150));
    await evaluate(`
        const btn = document.querySelector('.dpad-cell[data-key="ArrowUp"]');
        btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
    `);

    const samplesUpBtn = [];
    for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 50));
        samplesUpBtn.push(await getJack());
    }
    const p3 = samplesUpBtn[samplesUpBtn.length - 1];
    console.log("Positions after on-screen button tap UP:", samplesUpBtn.map(s => `(${s.x},${s.y},f_e=${s.f_e})`));
    console.log("Final pos after on-screen button tap UP:", p3, "Delta Y:", p3.y - p2.y);

    ws.close();
    chrome.kill();

    if (p1.y - p0.y === -1 && p2.y - p1.y === 1 && p3.y - p2.y === -1) {
        console.log("\n=== SUCCESS: Each tap moves Jack EXACTLY 1 step! ===");
        process.exit(0);
    } else {
        console.error(`\n=== FAILED: p0=${JSON.stringify(p0)}, p1=${JSON.stringify(p1)}, p2=${JSON.stringify(p2)}, p3=${JSON.stringify(p3)} ===`);
        process.exit(1);
    }
}

main().catch(console.error);

