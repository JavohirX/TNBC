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
                } else if (msg.method === 'Network.requestWillBeSent') {
                    const url = msg.params.request.url;
                    if (url.includes('freej2me') || url.includes('.jar') || url.includes('cjrtnc')) {
                        console.log('[REQ]', msg.params.request.method, url);
                    }
                } else if (msg.method === 'Network.responseReceived') {
                    const r = msg.params.response;
                    if (r.status >= 400) {
                        console.error('[NET 4xx/5xx]', r.status, r.url);
                    }
                } else if (msg.id === 99) {
                    const fs = require('fs');
                    fs.writeFileSync(__dirname + '/test_cheerpj_capture_long.png', Buffer.from(msg.result.data, 'base64'));
                    console.log('Saved test_cheerpj_capture_long.png');
                    ws.close();
                    chromeProcess.kill();
                    process.exit(0);
                }
            };

            // Wait 60 seconds
            console.log('Waiting 65s...');
            await wait(65000);
            ws.send(JSON.stringify({ id: 99, method: 'Page.captureScreenshot' }));
        });
    });
}

run();

