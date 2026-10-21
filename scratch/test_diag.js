const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=430,932',
    '--no-sandbox',
    '--disable-gpu',
    '--user-data-dir=' + __dirname + '\\chrome_profile_portrait'
]);

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
    await wait(2000);
    http.get('http://localhost:9222/json', (res) => {
        let raw = '';
        res.on('data', c => raw += c);
        res.on('end', async () => {
            const targets = JSON.parse(raw);
            const page = targets.find(t => t.type === 'page');
            const ws = new WebSocket(page.webSocketDebuggerUrl);

            ws.onopen = () => {
                ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
                ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
                ws.send(JSON.stringify({
                    id: 5,
                    method: 'Page.navigate',
                    params: { url: 'http://localhost:8080/player/index.html' }
                }));
            };

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.method === 'Runtime.consoleAPICalled') {
                    const txt = msg.params.args.map(a => a.value !== undefined ? a.value : (a.description || '')).join(' ');
                    console.log('[BROWSER CONSOLE]', txt);
                } else if (msg.result && msg.result.data) {
                    fs.writeFileSync(__dirname + `/diag_${msg.id}.png`, Buffer.from(msg.result.data, 'base64'));
                    console.log(`Saved diag_${msg.id}.png`);
                }
            };

            function triggerButton(selector) {
                const expr = `(() => {
                    const el = document.querySelector('${selector}');
                    if (!el) { console.error('NOT FOUND: ${selector}'); return false; }
                    console.log('Activating button:', '${selector}', el.dataset.key);
                    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    setTimeout(() => {
                        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        console.log('Deactivated button:', '${selector}');
                    }, 200);
                    return true;
                })()`;
                ws.send(JSON.stringify({ id: 50, method: 'Runtime.evaluate', params: { expression: expr } }));
            }

            console.log('Waiting 70s for game to reach language menu...');
            await wait(70000);

            // Tap OK on language menu
            console.log('Step 1: Tapping .dpad-center-ok...');
            triggerButton('.dpad-center-ok');
            await wait(2500);

            // Tap LSK (OPTIONS) for "ДА" (YES to Sound)
            console.log('Step 2: Tapping #btn-lsk (OPTIONS)...');
            triggerButton('#btn-lsk');
            await wait(2500);

            // Tap Enter / 5 on "ДА" just in case OK confirms it
            console.log('Step 3: Tapping .dpad-center-ok again...');
            triggerButton('.dpad-center-ok');
            await wait(3000);

            ws.send(JSON.stringify({ id: 10, method: 'Page.captureScreenshot' }));
            await wait(4000);

            // Wait another 4s and capture
            ws.send(JSON.stringify({ id: 11, method: 'Page.captureScreenshot' }));
            await wait(4000);

            console.log('Diagnosis complete!');
            ws.close();
            chromeProcess.kill();
            process.exit(0);
        });
    });
}

run();

