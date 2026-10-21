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
                    fs.writeFileSync(__dirname + `/game_step_${msg.id}.png`, Buffer.from(msg.result.data, 'base64'));
                    console.log(`Saved game_step_${msg.id}.png`);
                }
            };

            // Wait 75 seconds for language menu
            console.log('Waiting 75s for language menu...');
            await wait(75000);

            console.log('Capturing Step 1: Language Menu...');
            ws.send(JSON.stringify({ id: 1, method: 'Page.captureScreenshot' }));
            await wait(2000);

            // Press Enter / OK (windowsVirtualKeyCode 13) to select Russian
            console.log('Selecting Language with Enter...');
            ws.send(JSON.stringify({
                id: 10,
                method: 'Input.dispatchKeyEvent',
                params: { type: 'rawKeyDown', windowsVirtualKeyCode: 13, code: 'Enter', key: 'Enter' }
            }));
            await wait(100);
            ws.send(JSON.stringify({
                id: 11,
                method: 'Input.dispatchKeyEvent',
                params: { type: 'keyUp', windowsVirtualKeyCode: 13, code: 'Enter', key: 'Enter' }
            }));

            // Wait 3 seconds
            await wait(3000);
            console.log('Capturing Step 2: After language select (Intro/Splash)...');
            ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot' }));

            // Wait 4 more seconds
            await wait(4000);
            console.log('Capturing Step 3: Game Splash/Title...');
            ws.send(JSON.stringify({ id: 3, method: 'Page.captureScreenshot' }));

            // Wait 5 more seconds
            await wait(5000);
            console.log('Capturing Step 4: Game Title screen / Menu...');
            ws.send(JSON.stringify({ id: 4, method: 'Page.captureScreenshot' }));

            await wait(2000);
            ws.close();
            chromeProcess.kill();
            process.exit(0);
        });
    });
}

run();

