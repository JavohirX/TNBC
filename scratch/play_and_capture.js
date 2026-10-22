import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const ARTIFACT_DIR = "C:\\Users\\user\\.gemini\\antigravity\\brain\\f631d9a4-f016-4d4b-90ca-cddbf1e0c59c";

async function main() {
    console.log("=== Launching Chrome for Interactive Live Play & Audio/Animation Verification ===");
    const chrome = spawn(CHROME_PATH, [
        `--remote-debugging-port=${PORT}`,
        '--headless=new',
        '--disable-gpu',
        '--disable-extensions',
        '--autoplay-policy=no-user-gesture-required',
        '--user-data-dir=C:\\Windows\\Temp\\chrome_nbc_play3',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=460,940',
        'http://localhost:8080/player/index.html'
    ]);

    let wsUrl = null;
    for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 250));
        try {
            const list = await new Promise((resolve, reject) => {
                http.get(`http://localhost:${PORT}/json`, res => {
                    let d = '';
                    res.on('data', c => d += c);
                    res.on('end', () => resolve(JSON.parse(d)));
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
        console.error("Could not connect to Chrome CDP");
        chrome.kill();
        process.exit(1);
    }

    console.log("Connected to Chrome CDP:", wsUrl);
    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const pending = new Map();

    function cdp(method, params = {}) {
        return new Promise(resolve => {
            const id = msgId++;
            pending.set(id, resolve);
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.method === "Runtime.consoleAPICalled") {
            const txt = msg.params.args.map(a => a.value || a.description).join(" ");
            console.log(`[Browser Console]:`, txt);
        } else if (msg.method === "Runtime.exceptionThrown") {
            console.error(`[Browser Exception]:`, msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
        } else if (msg.id && pending.has(msg.id)) {
            const resolve = pending.get(msg.id);
            pending.delete(msg.id);
            resolve(msg.result);
        }
    };

    await new Promise(r => ws.onopen = r);
    await cdp("Runtime.enable");
    await cdp("Page.enable");

    async function evaluate(code) {
        const res = await cdp("Runtime.evaluate", { expression: code, returnByValue: true, awaitPromise: true });
        return res?.result?.value;
    }

    async function saveScreenshot(filename, caption) {
        console.log(`Capturing: ${caption} -> ${filename}...`);
        const snap = await cdp("Page.captureScreenshot", { format: "png" });
        if (snap && snap.data) {
            const buf = Buffer.from(snap.data, "base64");
            fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buf);
            fs.writeFileSync(path.join("scratch", filename), buf);
            console.log(`Saved ${filename} (${buf.length} bytes)!`);
        }
    }

    async function pressKey(j2meKey, name = "", holdMs = 100, waitAfter = 180) {
        console.log(`[Input] Pressing key ${name} (${j2meKey})...`);
        await evaluate(`window.GMIDlet?.var_t_a?.keyPressed(${j2meKey})`);
        await new Promise(r => setTimeout(r, holdMs));
        await evaluate(`window.GMIDlet?.var_t_a?.keyReleased(${j2meKey})`);
        await new Promise(r => setTimeout(r, waitAfter));
    }

    console.log("Waiting for engine to finish booting...");
    for (let i = 0; i < 40; i++) {
        const ready = await evaluate(`typeof window.GMIDlet !== 'undefined' && !!window.GMIDlet?.var_t_a`);
        if (ready) {
            console.log(`Engine loaded ready after ${i * 250}ms!`);
            break;
        }
        await new Promise(r => setTimeout(r, 250));
    }

    // Unlock Web Audio context explicitly
    await evaluate(`window.AudioManager?.unlockAudio()`);

    async function getAudioState() {
        return await evaluate(`({
            isPlaying: window.AudioManager?.isPlaying,
            trackId: window.AudioManager?.currentTrackId,
            ctxState: window.AudioManager?.ctx?.state,
            muted: window.AudioManager?.muted,
            activeVoices: window.AudioManager?.activeVoices?.size
        })`);
    }

    async function getJackState() {
        return await evaluate(`({
            frame: window.GMIDlet?.var_t_a?.var_n_a?.var_q_a?.var_h_a?.f_c,
            x: window.GMIDlet?.var_t_a?.var_n_a?.var_q_a?.var_int_b,
            y: window.GMIDlet?.var_t_a?.var_n_a?.var_q_a?.var_int_d,
            inGameActive: window.GMIDlet?.var_t_a?.var_n_a?.var_boolean_e,
            gameMode: window.GMIDlet?.var_t_a?.var_int_j
        })`);
    }

    // 1. Skip Disney Splash
    console.log("Skipping Disney splash screen...");
    await pressKey(-5, "FIRE / ENTER");
    await new Promise(r => setTimeout(r, 800));

    // 2. Skip Nightmare Splash
    console.log("Skipping Nightmare splash screen...");
    await pressKey(-5, "FIRE / ENTER");
    await new Promise(r => setTimeout(r, 1000));

    // 3. Select Language
    console.log("Selecting Language...");
    await pressKey(-5, "FIRE / OK");
    await new Promise(r => setTimeout(r, 1000));

    // 4. Accept Sound Prompt via Left Soft Key (LSK -6 -> "ДА")
    console.log("Accepting Sound via LSK (Options / Yes)...");
    await pressKey(-6, "LEFT SOFT KEY (YES)");
    await new Promise(r => setTimeout(r, 1200));

    console.log("Audio State after Main Menu entered:", await getAudioState());

    // 5. Select "Новая игра"
    console.log("Starting New Game...");
    await pressKey(-5, "FIRE / START GAME");
    await new Promise(r => setTimeout(r, 1000));

    // If Level Select, press Fire again
    const menuState = await evaluate(`window.a?.var_int_c`);
    if (menuState === 1) {
        console.log("Confirming Level 1 in Level Select...");
        await pressKey(-5, "FIRE / CONFIRM LEVEL");
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log("Audio State entering Level 1:", await getAudioState());

    // 6. Dismiss the Briefing Dialog
    console.log("Dismissing Level Briefing Dialog...");
    await pressKey(-6, "LSK -6 (СТАРТ)");
    await new Promise(r => setTimeout(r, 600));

    // Wait for countdown
    console.log("Waiting for countdown to finish into active gameplay...");
    for (let c = 0; c < 30; c++) {
        const js = await getJackState();
        if (js.inGameActive) break;
        await new Promise(r => setTimeout(r, 100));
    }

    console.log("Jack Initial State:", await getJackState());
    console.log("Audio State during Gameplay:", await getAudioState());

    // 7. Test Jack walking animation
    console.log("=== Testing Jack Walking Animation in Browser ===");
    // Hold right key and sample Jack's sprite frame 10 times
    await evaluate(`window.GMIDlet?.var_t_a?.keyPressed(-4)`);
    const walkFrames = [];
    for (let i = 0; i < 12; i++) {
        await new Promise(r => setTimeout(r, 60));
        const js = await getJackState();
        walkFrames.push(js.frame);
    }
    await evaluate(`window.GMIDlet?.var_t_a?.keyReleased(-4)`);
    console.log("Walk animation frames sampled during movement:", walkFrames);

    // 8. Test Jack attack animation
    console.log("=== Testing Jack Whipping Attack in Browser ===");
    await evaluate(`window.GMIDlet?.var_t_a?.keyPressed(-5)`);
    const whipFrames = [];
    for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 60));
        const js = await getJackState();
        whipFrames.push(js.frame);
    }
    await evaluate(`window.GMIDlet?.var_t_a?.keyReleased(-5)`);
    console.log("Whip attack frames sampled during attack:", whipFrames);

    // Capture screenshot of live gameplay
    await saveScreenshot("screenshot_gameplay_live.png", "Live In-Game Action Screen");

    const finalAudio = await getAudioState();
    console.log("Final Audio State:", finalAudio);

    ws.close();
    chrome.kill();
    console.log("=== Verification Completed Successfully! ===");
    process.exit(0);
}

main().catch(err => {
    console.error("Verification failed:", err);
    process.exit(1);
});
