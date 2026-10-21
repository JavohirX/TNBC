const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

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
                ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
                ws.send(JSON.stringify({
                    id: 5,
                    method: 'Page.navigate',
                    params: { url: 'http://localhost:8080/player/index.html' }
                }));
            };

            let shotIdx = 0;

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.method === 'Runtime.consoleAPICalled') {
                    const txt = msg.params.args.map(a => a.value !== undefined ? a.value : (a.description || '')).join(' ');
                    if (txt.includes('setCanvasSize') || txt.includes('FreeJ2ME') || txt.includes('GMIDlet') || txt.includes('Error') || txt.includes('Exception') || txt.includes('paint')) {
                        console.log('[GAME LOG]', txt);
                    }
                } else if (msg.method === 'Runtime.exceptionThrown') {
                    console.error('[UNCAUGHT EXCEPTION]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description || '');
                } else if (msg.id && msg.id >= 100) {
                    shotIdx++;
                    fs.writeFileSync(__dirname + `/capture_${msg.id}.png`, Buffer.from(msg.result.data, 'base64'));
                    console.log(`Saved capture_${msg.id}.png`);
                }
            };

            // Capture at 75s, 85s, 95s
            await wait(75000);
            console.log('Taking screenshot @ 75s...');
            ws.send(JSON.stringify({ id: 101, method: 'Page.captureScreenshot' }));

            await wait(10000);
            console.log('Taking screenshot @ 85s...');
            ws.send(JSON.stringify({ id: 102, method: 'Page.captureScreenshot' }));

            await wait(10000);
            console.log('Taking screenshot @ 95s...');
            ws.send(JSON.stringify({ id: 103, method: 'Page.captureScreenshot' }));

            await wait(2000);
            ws.close();
            chromeProcess.kill();
            process.exit(0);
        });
    });
}

run();

