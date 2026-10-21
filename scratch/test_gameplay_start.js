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
                if (msg.result && msg.result.data) {
                    fs.writeFileSync(__dirname + `/gameplay_${msg.id}.png`, Buffer.from(msg.result.data, 'base64'));
                    console.log(`Saved gameplay_${msg.id}.png`);
                }
            };

            function triggerButton(selector) {
                const expr = `(() => {
                    const el = document.querySelector('${selector}');
                    if (!el) return false;
                    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    setTimeout(() => {
                        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    }, 180);
                    return true;
                })()`;
                ws.send(JSON.stringify({ id: 50, method: 'Runtime.evaluate', params: { expression: expr } }));
            }

            console.log('Waiting 70s for game boot...');
            await wait(70000);

            // Select Russian
            console.log('Tapping language OK...');
            triggerButton('.dpad-center-ok');
            await wait(2000);

            // Enable Sound (LSK / Options)
            console.log('Tapping Sound YES (#btn-lsk)...');
            triggerButton('#btn-lsk');
            await wait(3000);

            // We are on Main Menu with Zero pointing to СТАРТ!
            console.log('Tapping START (.btn-3d-fire)...');
            triggerButton('.btn-3d-fire');
            await wait(3000);

            ws.send(JSON.stringify({ id: 201, method: 'Page.captureScreenshot' }));
            await wait(4000);

            // If there is intro cutscene or dialogue, tap OK again to advance
            console.log('Advancing cutscene/dialogue...');
            triggerButton('.btn-3d-fire');
            await wait(3000);

            ws.send(JSON.stringify({ id: 202, method: 'Page.captureScreenshot' }));
            await wait(3000);

            console.log('Done gameplay test!');
            ws.close();
            chromeProcess.kill();
            process.exit(0);
        });
    });
}

run();

