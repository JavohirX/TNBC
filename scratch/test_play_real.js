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

            function sendClick(selector) {
                const expr = `(() => {
                    const el = document.querySelector('${selector}');
                    if (!el) { console.error('Element not found: ${selector}'); return false; }
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

            console.log('Waiting 70s for game to boot into language select...');
            await wait(70000);

            await takeShot('game_lang_menu.png');

            // Tap OK button on 3D retro controller!
            console.log('Pressing center OK button on 3D controller...');
            sendClick('.dpad-center');
            await wait(2000);

            await takeShot('game_after_ok.png');

            // Wait 4 seconds for Disney / Living Mobile intro
            await wait(4000);
            await takeShot('game_intro.png');

            // Wait another 5 seconds for title screen
            await wait(5000);
            await takeShot('game_title.png');

            console.log('Done test!');
            await wait(1000);
            ws.close();
            chromeProcess.kill();
            process.exit(0);
        });
    });
}

run();

