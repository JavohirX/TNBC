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
        '--user-data-dir=C:\\Windows\\Temp\\chrome_nbc_check_release',
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

    for (let i = 0; i < 30; i++) {
        const ready = await evaluate(`typeof window.GMIDlet !== 'undefined' && !!window.GMIDlet?.var_t_a`);
        if (ready) break;
        await new Promise(r => setTimeout(r, 200));
    }

    // Check what listeners are on .dpad-cell[data-key="ArrowDown"]
    const check = await evaluate(`
        (() => {
            const btn = document.querySelector('.dpad-cell[data-key="ArrowDown"]');
            let downFired = false;
            let upFired = false;
            btn.addEventListener('pointerdown', () => { downFired = true; });
            btn.addEventListener('pointerup', () => { upFired = true; });

            btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1 }));
            btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));

            return { downFired, upFired };
        })()
    `);

    console.log("Check result:", check);
    ws.close();
    chrome.kill();
}

main().catch(console.error);

