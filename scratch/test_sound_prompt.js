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

            function triggerButton(selector) {
                const expr = `(() => {
                    const el = document.querySelector('${selector}');
                    if (!el) { console.error('NOT FOUND: ${selector}'); return false; }
                    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    setTimeout(() => el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })), 150);
                    return true;
                })()`;
                ws.send(JSON.stringify({ id: 50, method: 'Runtime.evaluate', params: { expression: expr } }));
            }

            function takeShot(name) {
                return new Promise((resolve) => {
                    const handler = (event) => {
                        const msg = JSON.parse(event.data);
                        if (msg.result && msg.result.data) {
                            fs.writeFileSync(__dirname + '/' + name, Buffer.from(msg.result.data, 'base64'));
                            console.log('Saved screenshot:', name);
                            ws.removeEventListener('message', handler);
                            resolve();
                        }
                    };
                    ws.addEventListener('message', handler);
                    ws.send(JSON.stringify({ id: 99, method: 'Page.captureScreenshot' }));
                });
            }

            console.log('Waiting 70s for language menu...');
            await wait(70000);

            // Tap OK on language menu
            console.log('Tapping .dpad-center-ok on language...');
            triggerButton('.dpad-center-ok');
            await wait(2000);

            // Tap LSK (OPTIONS) for "ДА" (YES to Sound)
            console.log('Tapping #btn-lsk (OPTIONS / ДА)...');
            triggerButton('#btn-lsk');
            await wait(3500);

            await takeShot('screen_step5_after_sound.png');

            await wait(4000);
            await takeShot('screen_step6_title_screen.png');

            console.log('Done!');
            await wait(1000);
            ws.close();
            chromeProcess.kill();
            process.exit(0);
        });
    });
}

run();

