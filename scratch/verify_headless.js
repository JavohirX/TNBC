import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

async function run() {
    console.log("Launching Headless Chrome on port 9222...");
    const chrome = spawn(CHROME_PATH, [
        `--remote-debugging-port=${PORT}`,
        '--headless=new',
        '--disable-gpu',
        '--disable-extensions',
        '--user-data-dir=C:\\Windows\\Temp\\chrome_nbc_test',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=460,940',
        'http://localhost:8080/player/index.html'
    ]);

    // Wait for Chrome CDP port to open
    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 300));
        try {
            const list = await new Promise((resolve, reject) => {
                http.get(`http://localhost:${PORT}/json`, res => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => resolve(JSON.parse(data)));
                }).on('error', reject);
            });
            const target = list.find(t => t.type === 'page' && t.url.includes('8080'));
            if (target && target.webSocketDebuggerUrl) {
                wsUrl = target.webSocketDebuggerUrl;
                break;
            }
        } catch (e) {}
    }

    if (!wsUrl) {
        console.error("Failed to connect to Chrome CDP");
        chrome.kill();
        process.exit(1);
    }

    console.log("Connected to Chrome via CDP:", wsUrl);

    const ws = new WebSocket(wsUrl);
    let id = 1;
    const callbacks = new Map();

    function send(method, params = {}) {
        return new Promise((resolve) => {
            const msgId = id++;
            callbacks.set(msgId, resolve);
            ws.send(JSON.stringify({ id: msgId, method, params }));
        });
    }

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === "Runtime.consoleAPICalled") {
            const args = msg.params.args.map(a => a.value || a.description).join(" ");
            console.log(`[Browser Console ${msg.params.type}]:`, args);
        } else if (msg.method === "Runtime.exceptionThrown") {
            console.error(`[Browser Error]:`, msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
        } else if (msg.id && callbacks.has(msg.id)) {
            const cb = callbacks.get(msg.id);
            callbacks.delete(msg.id);
            cb(msg.result);
        }
    };

    await new Promise(r => ws.onopen = r);
    await send("Runtime.enable");
    await send("Page.enable");

    console.log("Reloading page to capture all lifecycle logs...");
    await send("Page.reload");

    console.log("Waiting 3 seconds for boot & asset caching...");
    await new Promise(r => setTimeout(r, 3000));

    const engineTest = await send("Runtime.evaluate", {
        expression: `(async () => {
            try {
                const { startNativeEngine } = await import('../engine/main.js');
                await startNativeEngine('../assets/');
                return "startNativeEngine succeeded! Canvas display: " + document.getElementById('display')?.style.display;
            } catch (e) {
                return "Engine Start Error: " + e.message + "\\n" + e.stack;
            }
        })()`,
        awaitPromise: true,
        returnByValue: true
    });
    console.log("Engine Execution Test:", engineTest?.result?.value);

    // Capture initial screenshot
    console.log("Capturing boot screenshot...");
    const snap1 = await send("Page.captureScreenshot", { format: "png" });
    if (snap1 && snap1.data) {
        fs.writeFileSync("scratch/screenshot_boot.png", Buffer.from(snap1.data, "base64"));
        console.log("Saved scratch/screenshot_boot.png!");
    }

    // Now press Enter (Fire) to select language or proceed through splash
    console.log("Dispatching Enter / Fire key...");
    await send("Input.dispatchKeyEvent", { type: "keyDown", windowsVirtualKeyCode: 13, code: "Enter", key: "Enter" });
    await new Promise(r => setTimeout(r, 100));
    await send("Input.dispatchKeyEvent", { type: "keyUp", windowsVirtualKeyCode: 13, code: "Enter", key: "Enter" });

    await new Promise(r => setTimeout(r, 2000));

    console.log("Capturing title screen screenshot...");
    const snap2 = await send("Page.captureScreenshot", { format: "png" });
    if (snap2 && snap2.data) {
        fs.writeFileSync("scratch/screenshot_title.png", Buffer.from(snap2.data, "base64"));
        console.log("Saved scratch/screenshot_title.png!");
    }

    ws.close();
    chrome.kill();
    console.log("Verification finished cleanly!");
    process.exit(0);
}

run().catch(err => {
    console.error("Verification failed:", err);
    process.exit(1);
});
