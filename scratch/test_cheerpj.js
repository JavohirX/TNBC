const { spawn } = require('child_process');
const http = require('http');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-gpu',
    '--user-data-dir=' + __dirname + '\\chrome_profile'
]);

console.log('Chrome process spawned PID:', chromeProcess.pid);

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
    await wait(2000);
    // Connect to CDP
    http.get('http://localhost:9222/json', (res) => {
        let raw = '';
        res.on('data', c => raw += c);
        res.on('end', async () => {
            const targets = JSON.parse(raw);
            console.log('Targets:', targets.map(t => t.url));
            const page = targets.find(t => t.type === 'page');
            if (!page) {
                console.error('No page target found');
                chromeProcess.kill();
                process.exit(1);
            }

            const ws = new WebSocket(page.webSocketDebuggerUrl);
            ws.onopen = () => {
                console.log('Connected to WebSocket');
                ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
                ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
                ws.send(JSON.stringify({ id: 3, method: 'Network.enable' }));
                ws.send(JSON.stringify({ id: 4, method: 'Page.enable' }));
                ws.send(JSON.stringify({
                    id: 5,
                    method: 'Page.navigate',
                    params: { url: 'http://localhost:8080/player/index.html' }
                }));
            };

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.method === 'Runtime.consoleAPICalled') {
                    console.log('[CONSOLE]', msg.params.type, msg.params.args.map(a => a.value !== undefined ? a.value : (a.description || '')).join(' '));
                } else if (msg.method === 'Runtime.exceptionThrown') {
                    console.error('[EXCEPTION]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description || '');
                } else if (msg.method === 'Network.responseReceived') {
                    const r = msg.params.response;
                    if (r.status >= 400) {
                        console.error('[NETWORK FAIL]', r.status, r.url);
                    }
                }
            };

            // Wait 25 seconds for CheerpJ to boot
            console.log('Waiting 25s for CheerpJ execution...');
            await wait(25000);

            // Request screenshot
            ws.send(JSON.stringify({ id: 10, method: 'Page.captureScreenshot' }));
            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.id === 10) {
                    const fs = require('fs');
                    fs.writeFileSync(__dirname + '/test_cheerpj_capture.png', Buffer.from(msg.result.data, 'base64'));
                    console.log('Screenshot saved to scratch/test_cheerpj_capture.png');
                    ws.close();
                    chromeProcess.kill();
                    process.exit(0);
                } else if (msg.method === 'Runtime.consoleAPICalled') {
                    console.log('[CONSOLE]', msg.params.type, msg.params.args.map(a => a.value !== undefined ? a.value : (a.description || '')).join(' '));
                }
            };
        });
    }).on('error', (err) => {
        console.error('HTTP get error:', err);
        chromeProcess.kill();
        process.exit(1);
    });
}

run();

