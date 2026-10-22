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
        '--user-data-dir=C:\\Windows\\Temp\\chrome_nbc_all_levels',
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

    // Initialize game
    await evaluate(`
        window.t.a(0);
        const tInst = window.GMIDlet.var_t_a;
        tInst.l();
    `);

    // Test loading rooms 0 to 49
    const roomResults = await evaluate(`(() => {
        const tInst = window.GMIDlet.var_t_a;
        const results = [];
        for (let lvl = 0; lvl < 50; lvl++) {
            try {
                tInst.var_n_a.c();
                tInst.var_n_a.c(lvl);
                tInst.m();
                const jack = tInst.var_n_a.var_q_a;
                results.push({
                    level: lvl,
                    success: true,
                    jackPos: jack ? [jack.var_int_b, jack.var_int_d] : null,
                    levelName: window.t.var_java_lang_String_arr_c ? window.t.var_java_lang_String_arr_c[35 + lvl] : null,
                    entities: tInst.var_n_a.var_g_a ? tInst.var_n_a.var_g_a.var_int_a : 0
                });
            } catch (err) {
                results.push({
                    level: lvl,
                    success: false,
                    error: err.message
                });
            }
        }
        return results;
    })()`);

    const failed = roomResults.filter(r => !r.success);
    const passed = roomResults.filter(r => r.success);
    console.log(`Passed: ${passed.length}/50 levels!`);
    if (failed.length > 0) {
        console.error("Failed levels:", JSON.stringify(failed, null, 2));
        process.exit(1);
    } else {
        console.log("ALL 50 LEVELS LOAD AND INITIALIZE FLAWLESSLY!");
        process.exit(0);
    }

    ws.close();
    chrome.kill();
}

main().catch(console.error);
