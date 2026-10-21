# The Nightmare Before Christmas - Mobile Web Adaptation

Reverse-engineered and adapted for modern vertical mobile screens with touch controls and bulletproof audio preservation.

---

## 1. Reverse Engineering Summary

- **Title**: The Nightmare Before Christmas
- **Developer / Publisher**: Living Mobile / Disney (2005)
- **Target Profile**: J2ME MIDP-1.0 / CLDC-1.0
- **Native Resolution**: **240 &times; 320** (Aspect Ratio **3:4**)
- **Audio Sound Bank**:
  - File `m` contains 6 Standard MIDI format 0 tracks (`MThd`):
    - `Track 0` (310 bytes): Sound Effect (Item pickup / Event)
    - `Track 1` (1,286 bytes): Stage Win Fanfare
    - `Track 2` (1,839 bytes): Stage Fail Fanfare
    - `Track 3` (7,370 bytes): Title & Menu Theme (*This Is Halloween*)
    - `Track 4` (8,005 bytes): Level 1 Background Music
    - `Track 5` (8,173 bytes): Level 2 Background Music
- **Key Mappings Discovered in `t.java`**:
  - `UP` (`Canvas.UP` / Key `2` / `Digit2`)
  - `DOWN` (`Canvas.DOWN` / Key `8` / `Digit8`)
  - `LEFT` (`Canvas.LEFT` / Key `4` / `Digit4`)
  - `RIGHT` (`Canvas.RIGHT` / Key `6` / `Digit6`)
  - `FIRE / OK` (`Canvas.FIRE` / Key `5` / `Digit5` / `Enter`): Primary attack (Jack's Whip / Action)
  - `SPECIAL / ACTION` (`*` or `#` / `NumpadAsterisk`): Secondary action
  - `LSK` (Key code `-6` / `F1`): Left Soft Key (Menu / Options)
  - `RSK` (Key code `-7` / `F2`): Right Soft Key (Back / Exit)

---

## 2. Vertical Mobile Screen Adaptation

- **Strict 3:4 Aspect Ratio, 100% Width Fit**:
  - The game screen fits **100% of the mobile device width** (`width: 100%`).
  - Height is calculated via `aspect-ratio: 3 / 4` (`height = width * 1.333333`), ensuring zero stretching or aspect distortion.
  - Pixel-perfect crisp graphics rendering via `image-rendering: pixelated` and `image-rendering: crisp-edges`.
- **Lower Control Buttons**:
  - **Upper Toolbar**: Left Soft Key (`LSK`), Sound Mute/Unmute, Numeric Keypad Drawer Toggle, Fullscreen, and Right Soft Key (`RSK`).
  - **Left Thumb (Virtual D-Pad)**: Ergonomic 5-way D-Pad (Up, Down, Left, Right, Center/OK) with slide-touch tracking.
  - **Right Thumb (Action Buttons)**:
    - Large circular **FIRE** button (`Enter` / Key `5`) for Jack's whip and primary actions.
    - Prominent **ACTION** button (`*` / `NumpadAsterisk`) for secondary special actions.
  - **Numeric Keypad Drawer**: An expandable 1-9, 0, *, # keypad for cheats and numeric menu inputs.
  - **Multi-Touch & Haptic Feedback**: Simultaneous thumb controls (move + whip at the same time) with subtle haptic vibration and zero delay.

---

## 3. Audio Preservation (Solving the "Damaged / Silent" Audio)

In earlier web ports and emulators, audio frequently got damaged (distorted, screeching) or went permanently silent. We identified and fixed the 3 root causes:

1. **The Single-Channel SFX/BGM Collision Bug**:
   - In Living Mobile's original bytecode (`j.java`), whenever a sound effect (Track 0, 1, or 2) played, it called `j.a()` which stopped and disposed of the active BGM player. In standard FreeJ2ME-web, only one shared `midiPlayer` existed, so the SFX completely erased the BGM sequence. Once the 1-second SFX finished, the game became permanently silent!
   - **Solution**: Implemented a **Dual-Channel Audio Manager** in [`libmidi.js`](file:///D:/source/nightmare-b4-xmas/player/libmidi/libmidi.js) and [`libmidibridge.js`](file:///D:/source/nightmare-b4-xmas/player/libjs/libmidibridge.js). BGM and SFX are handled by separate independent channels. Playing an SFX never stops BGM, stopping an SFX never silences BGM, and BGM loops smoothly without interruption.
2. **AudioWorklet `missedFrames` Buffer Overrun**:
   - In mobile browsers, when tabs lag, audio context resumes, or orientation changes, the `AudioWorklet`'s `currentFrame` jumps ahead by tens of thousands of frames. Passing raw large `missedFrames` into FluidSynth's internal sequencer caused memory corruption, audio distortion, and synth death.
   - **Solution**: Clamped `missedFrames` in [`worklet.js`](file:///D:/source/nightmare-b4-xmas/player/libmidi/worklet.js) to safe ranges (`<= 256`) and ensured WebAssembly memory buffer re-attachment on memory growth.
3. **Mobile Autoplay Policy Suspension**:
   - Mobile browsers start `AudioContext` in `'suspended'` state.
   - **Solution**: Multi-event unlocking on first user interaction (`touchstart`, `pointerdown`, `keydown`) plus visibility state resume listeners.

---

## 4. How to Run Locally

1. Open PowerShell or Terminal in this folder:
   ```powershell
   python run_server.py
   ```
2. Your default web browser will automatically open:
   - **Full Game (CheerpJ Player)**: `http://localhost:8080/player/`
   - **Pure JS Engine Runner (0ms Cold Load)**: `http://localhost:8080/engine/test_runner.html`
3. To play on your smartphone on the same Wi-Fi network:
   Open the network IP printed in the terminal (e.g. `http://192.168.x.x:8080/player/`).

---

## 5. Instant Online Deployment (GitHub Pages / Vercel)

This repository is pre-configured for automated 1-click cloud hosting:

1. **GitHub Pages (Automated CI/CD)**:
   - Push this repo to your GitHub account (`git remote add origin <url>`, `git push -u origin master`).
   - The included workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will automatically build and publish the game to GitHub Pages:
     `https://<your-username>.github.io/<repo-name>/`
   - Ensure in your GitHub Repo Settings: **Settings ➔ Pages ➔ Source** is set to **GitHub Actions**.

2. **Vercel / Cloudflare Pages**:
   - Zero-config static deployment via [`vercel.json`](vercel.json). Import the repository directly in Vercel and click Deploy.

3. **Install as Mobile App (PWA)**:
   - The game includes [`player/manifest.json`](player/manifest.json). Open the deployed URL on Safari (iOS) or Chrome (Android) and tap **"Add to Home Screen"** to play as an edge-to-edge standalone app.

---

## 6. Pure JavaScript / Canvas 2D Engine

To eliminate the 30–60s CheerpJ compile time, a native HTML5 Canvas 2D engine is being constructed under [`engine/`](engine/):
- **[`engine/lcd/Graphics.js`](engine/lcd/Graphics.js)**: 1:1 Canvas 2D implementation of Nokia/MIDP `javax.microedition.lcdui.Graphics` (clipping, blitting, anchors, region transforms).
- **[`engine/lcd/Image.js`](engine/lcd/Image.js)**: Fast bitmap cache with pixel manipulation.
- **[`engine/lcd/RecordStore.js`](engine/lcd/RecordStore.js)**: `localStorage` RMS persistent storage.
- **[`engine/io/DataInputStream.js`](engine/io/DataInputStream.js)**: Zero-copy big-endian binary decoder for `levels.mar` and font tables.
- **[`engine/test_runner.html`](engine/test_runner.html)**: Interactive room viewer & sprite animator demonstrating 60 FPS, 0ms startup time.
