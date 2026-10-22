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
        '--user-data-dir=C:\\Windows\\Temp\\chrome_nbc_trace_reload',
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

    // Now navigate to the player page with cache disabled!
    await cdp("Page.navigate", { url: 'http://localhost:8080/player/index.html' });

    async function evaluate(code) {
        const res = await cdp("Runtime.evaluate", { expression: code, returnByValue: true, awaitPromise: true });
        return res?.result?.value;
    }

    // Wait for engine
    for (let i = 0; i < 40; i++) {
        const ready = await evaluate(`typeof window.GMIDlet !== 'undefined' && !!window.GMIDlet?.var_t_a`);
        if (ready) break;
        await new Promise(r => setTimeout(r, 200));
    }

    // Trace call stacks of g()
    const trace = await evaluate(`
        new Promise(resolve => {
            const stacks = [];
            const origG = window.GMIDlet.var_t_a.g;
            let count = 0;
            window.GMIDlet.var_t_a.g = function() {
                if (count++ < 5) {
                    try { throw new Error(); } catch (e) {
                        stacks.push(e.stack.split('\\n').slice(1, 4).join(' | '));
                    }
                }
                return origG.apply(this, arguments);
            };
            setTimeout(() => {
                window.GMIDlet.var_t_a.g = origG;
                resolve({ count, stacks });
            }, 1000);
        })
    `);

    console.log("Total calls in 1s (fresh navigate):", trace.count);
    console.log("Call stacks:", trace.stacks);

    ws.close();
    chrome.kill();
}

main().catch(console.error);

