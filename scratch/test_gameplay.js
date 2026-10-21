const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=430,932', // iPhone 14 Pro Max portrait dimensions!
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
                if (msg.id && msg.id >= 200) {
                    fs.writeFileSync(__dirname + `/game_${msg.id}.png`, Buffer.from(msg.result.data, 'base64'));
                    console.log(`Saved game_${msg.id}.png`);
                }
            };

            // Wait 75 seconds for game to reach language menu
            console.log('Waiting 75s for language menu...');
            await wait(75000);

            console.log('Capturing language menu...');
            ws.send(JSON.stringify({ id: 201, method: 'Page.captureScreenshot' }));
            await wait(2000);

            // Press Enter / OK (KeyCode 13) to select language
            console.log('Sending Enter key to select language...');
            ws.send(JSON.stringify({
                id: 301,
                method: 'Input.dispatchKeyEvent',
                params: {
                    type: 'keyDown',
                    windowsVirtualKeyCode: 13,
                    code: 'Enter',
                    key: 'Enter'
                }
            }));
            await wait(100);
            ws.send(JSON.stringify({
                id: 302,
                method: 'Input.dispatchKeyEvent',
                params: {
                    type: 'keyUp',
                    windowsVirtualKeyCode: 13,
                    code: 'Enter',
                    key: 'Enter'
                }
            }));

            // Wait 5 seconds for title screen animation
            await wait(5000);
            console.log('Capturing title screen after selecting language...');
            ws.send(JSON.stringify({ id: 202, method: 'Page.captureScreenshot' }));

            // Wait another 5 seconds
            await wait(5000);
            console.log('Capturing title screen next frame...');
            ws.send(JSON.stringify({ id: 203, method: 'Page.captureScreenshot' }));

            await wait(3000);
            ws.close();
            chromeProcess.kill();
            process.exit(0);
        });
    });
}

run();

