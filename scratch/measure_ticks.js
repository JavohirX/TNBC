import { spawn } from 'child_process';
import http from 'http';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

async function main() {
    const list = await new Promise((resolve, reject) => {
        http.get(`http://localhost:${PORT}/json`, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => resolve(JSON.parse(d)));
        }).on('error', reject);
    });
    const target = list.find(t => t.type === 'page' && t.url.includes('8080'));
    if (!target) {
        console.log("No page found");
        return;
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);
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

    // Measure how many times g() is called over 1000ms
    const res = await cdp("Runtime.evaluate", {
        expression: `
            new Promise(resolve => {
                let count = 0;
                const origG = window.GMIDlet.var_t_a.g;
                window.GMIDlet.var_t_a.g = function() {
                    count++;
                    return origG.apply(this, arguments);
                };
                setTimeout(() => {
                    window.GMIDlet.var_t_a.g = origG;
                    resolve(count);
                }, 1000);
            })
        `,
        awaitPromise: true,
        returnByValue: true
    });

    console.log("Ticks per second in Chrome:", res?.result?.value);
    ws.close();
}

main().catch(console.error);

