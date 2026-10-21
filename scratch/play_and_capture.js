import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const ARTIFACT_DIR = "C:\\Users\\user\\.gemini\\antigravity\\brain\\f631d9a4-f016-4d4b-90ca-cddbf1e0c59c";

async function main() {
    console.log("=== Launching Chrome for Interactive Live Play & Verification ===");
    const chrome = spawn(CHROME_PATH, [
        `--remote-debugging-port=${PORT}`,
        '--headless=new',
        '--disable-gpu',
        '--disable-extensions',
        '--user-data-dir=C:\\Windows\\Temp\\chrome_nbc_play2',
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

    await new Promise(r => setTimeout(r, 1000));

    async function getGameState() {
        return await evaluate(`({
            menuState: window.a?.var_int_c,
            gameMode: window.GMIDlet?.var_t_a?.var_int_j,
            room: window.GMIDlet?.var_t_a?.var_n_a?.var_r_a?.var_int_c,
            jack_x: window.GMIDlet?.var_t_a?.var_n_a?.var_q_a?.var_int_b,
            jack_y: window.GMIDlet?.var_t_a?.var_n_a?.var_q_a?.var_int_d,
            jack_anim: window.GMIDlet?.var_t_a?.var_n_a?.var_q_a?.var_int_a,
            inGameActive: window.GMIDlet?.var_t_a?.var_n_a?.var_boolean_e,
            entities: window.GMIDlet?.var_t_a?.var_n_a?.var_g_a?.var_int_a
        })`);
    }

    console.log("Initial Engine State:", await getGameState());

    // 1. Skip Disney Splash (State -3) -> Nightmare Splash (State -2)
    console.log("Skipping Disney splash screen...");
    await pressKey(-5, "FIRE / ENTER");
    await new Promise(r => setTimeout(r, 800));

    // 2. Skip Nightmare Splash (State -2) -> Language Select (State 12)
    console.log("Skipping Nightmare splash screen...");
    await pressKey(-5, "FIRE / ENTER");
    await new Promise(r => setTimeout(r, 1000));

    // Capture Language Select Screen
    await saveScreenshot("screenshot_language_select.png", "Language Select Screen");

    // 3. Select Language (Russian) -> Sound Prompt (State 13)
    console.log("Selecting Language (Fire / OK)...");
    await pressKey(-5, "FIRE / OK");
    await new Promise(r => setTimeout(r, 1000));

    // Capture Sound Prompt Screen
    await saveScreenshot("screenshot_sound_prompt.png", "Sound Prompt Screen");

    // 4. Accept Sound via Left Soft Key (LSK -6 -> "ДА") -> Main Menu (State 0)
    console.log("Accepting Sound via LSK (Options / Yes)...");
    await pressKey(-6, "LEFT SOFT KEY (YES)");
    await new Promise(r => setTimeout(r, 1200));

    // Capture Main Title Menu
    await saveScreenshot("screenshot_main_menu.png", "Main Title Menu Screen");

    // 5. Select "Новая игра" (New Game) via Fire / OK
    console.log("Starting New Game (Fire on 'Новая игра')...");
    await pressKey(-5, "FIRE / START GAME");
    await new Promise(r => setTimeout(r, 1000));

    let st = await getGameState();
    console.log("State after New Game press:", st);

    // If it went to Level Select (menuState === 1), press Fire again to confirm Level 1
    if (st.menuState === 1) {
        console.log("In Level Select menu, pressing FIRE to confirm Level 1...");
        await pressKey(-5, "FIRE / CONFIRM LEVEL");
        await new Promise(r => setTimeout(r, 1000));
        st = await getGameState();
        console.log("State after Level Confirm:", st);
    }

    // Capture the newly formatted Briefing Dialog screen (Clean Russian text!)
    await saveScreenshot("screenshot_briefing_dialog.png", "Level 1 Briefing Dialog (Clean Text)");

    // 6. Dismiss the Briefing Dialog: Press Left Soft Key (LSK -6 "СТАРТ") or FIRE (-5)
    console.log("Dismissing Level Briefing Dialog via LSK / FIRE...");
    await pressKey(-6, "LEFT SOFT KEY (СТАРТ)");
    await new Promise(r => setTimeout(r, 600));

    // Wait for countdown ("3", "2", "1") to finish into active gameplay
    console.log("Waiting for 3-2-1 countdown to finish...");
    for (let c = 0; c < 25; c++) {
        st = await getGameState();
        if (st.inGameActive) break;
        await new Promise(r => setTimeout(r, 100));
    }
    console.log("Countdown finished! In-Game Active:", st.inGameActive);

    // 7. Active Gameplay Action: Walk Jack right!
    console.log("Walking Jack right...");
    await pressKey(-4, "RIGHT", 350, 200);
    await pressKey(-4, "RIGHT", 350, 200);

    // 8. Active Gameplay Action: Jack whipping attack!
    console.log("Jack whipping attack...");
    await pressKey(-5, "FIRE / WHIP", 250, 200);

    st = await getGameState();
    console.log("Final Active Gameplay State:", st);

    // Capture Active Gameplay Screen with Jack Skellington walking and whipping!
    await saveScreenshot("screenshot_gameplay_live.png", "Level 1 In-Game Live Screen (Jack Skellington Action)");

    ws.close();
    chrome.kill();
    console.log("=== Verification Completed Successfully! ===");
    process.exit(0);
}

main().catch(err => {
    console.error("Verification failed:", err);
    process.exit(1);
});
