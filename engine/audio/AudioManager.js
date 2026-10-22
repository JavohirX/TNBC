/**
 * AudioManager.js
 * High-Precision Pure JavaScript Web Audio MIDI Synthesizer & Sound Engine
 * Authentically synthesizes Living Mobile 2005 J2ME Standard MIDI tracks & retro sound effects.
 */

class RetroMidiSynthesizer {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.filterNode = null;
        this.compressor = null;
        this.noiseBuffer = null;

        // Restore muted preference from localStorage
        const storedMute = typeof localStorage !== 'undefined' ? localStorage.getItem('nbc_muted') : null;
        this.muted = storedMute === 'true';

        // Volume level (0.0 to 1.0), default comfortable 0.35 (35%)
        const storedVol = typeof localStorage !== 'undefined' ? parseFloat(localStorage.getItem('nbc_volume')) : NaN;
        this.volume = (!isNaN(storedVol) && storedVol >= 0 && storedVol <= 1) ? storedVol : 0.35;

        // Current track playback state
        this.currentTrackId = -1;
        this.parsedTrackCache = new Map();
        this.schedulerTimer = null;
        this.activeVoices = new Set();
        this.isPlaying = false;
        this.loopCount = 1;
        this.trackStartTime = 0;
        this.noteIndex = 0;
        this.currentTrack = null;

        // Dedicated Gameplay Channel (for high-fidelity GBA rotation)
        this.gameplayFilter = null;
        this.gameplayTrackGain = null;
        this.currentGameplaySource = null;
        this.currentGameplayGain = null;
        this.currentGameplayIndex = -1;
        this.gameplayAudioBuffers = new Map();
        this.isGameplayPlaying = false;
        this.trackNames = [
            'Town Square Exploration',
            'Cemetery & Graveyard',
            'Title Theme (This Is Halloween)'
        ];

        this._setupAutoUnlock();
    }

    _setupAutoUnlock() {
        if (typeof window === 'undefined') return;
        const unlock = () => {
            this.unlockAudio();
            ['pointerdown', 'keydown', 'touchstart', 'mousedown'].forEach(ev => {
                window.removeEventListener(ev, unlock, true);
            });
        };
        ['pointerdown', 'keydown', 'touchstart', 'mousedown'].forEach(ev => {
            window.addEventListener(ev, unlock, { capture: true, once: false });
        });
    }

    _initContext() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();

                // Master Dynamics / Warm Retro Filter: authentic 2005 mobile speaker warmth (rolls off harsh frequencies > 2600 Hz)
                this.filterNode = this.ctx.createBiquadFilter();
                this.filterNode.type = "lowpass";
                this.filterNode.frequency.setValueAtTime(2600, this.ctx.currentTime);
                this.filterNode.Q.setValueAtTime(0.7, this.ctx.currentTime);

                // Master Dynamics Compressor: prevents 14 polyphonic voices from clipping or spiking
                this.compressor = this.ctx.createDynamicsCompressor();
                this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
                this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
                this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
                this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
                this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

                // Master Gain (comfortable gentle level)
                this.masterGain = this.ctx.createGain();
                const currentGain = this.muted ? 0 : (this.volume * 0.28);
                this.masterGain.gain.setValueAtTime(currentGain, this.ctx.currentTime);

                // Audio graph for J2ME synth: Voices -> MasterFilter -> Compressor -> MasterGain -> Destination
                this.filterNode.connect(this.compressor);

                // Dedicated Gameplay GBA Channel:
                // Warm lowpass filter at 8500 Hz: softens harsh DAC hiss while keeping orchestra crisp & vibrant
                this.gameplayFilter = this.ctx.createBiquadFilter();
                this.gameplayFilter.type = "lowpass";
                this.gameplayFilter.frequency.setValueAtTime(8500, this.ctx.currentTime);
                this.gameplayFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);

                // Gameplay Track Gain (tuned to 0.85 for seamless loudness parity with J2ME synth menu)
                this.gameplayTrackGain = this.ctx.createGain();
                this.gameplayTrackGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

                this.gameplayFilter.connect(this.gameplayTrackGain);
                this.gameplayTrackGain.connect(this.compressor);

                this.compressor.connect(this.masterGain);
                this.masterGain.connect(this.ctx.destination);

                this._buildNoiseBuffer();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    _buildNoiseBuffer() {
        if (!this.ctx) return;
        const sampleRate = this.ctx.sampleRate;
        const bufferSize = sampleRate * 1.0; // 1 second of white noise
        const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer = buffer;
    }

    getTrackUrl(filename) {
        if (typeof window !== 'undefined' && window.location) {
            const origin = window.location.origin;
            if (origin && origin !== 'null' && window.location.protocol.startsWith('http')) {
                return `${origin}/assets/audio_mp3/gba_tuned/${filename}`;
            }
            const pathname = window.location.pathname;
            if (pathname.includes('/player/')) {
                return `../assets/audio_mp3/gba_tuned/${filename}`;
            }
        }
        return `assets/audio_mp3/gba_tuned/${filename}`;
    }

    async preloadGameplayTracks() {
        if (typeof window === 'undefined') return;
        this._initContext();
        if (!this.ctx) return;
        const files = ['town_square.mp3', 'cemetery_graveyard.mp3', 'title_this_is_halloween.mp3'];
        for (let i = 0; i < files.length; i++) {
            if (this.gameplayAudioBuffers.has(i)) continue;
            try {
                const url = this.getTrackUrl(files[i]);
                const res = await fetch(url);
                if (!res.ok) continue;
                const arrayBuf = await res.arrayBuffer();
                const audioBuf = await this.ctx.decodeAudioData(arrayBuf);
                this.gameplayAudioBuffers.set(i, audioBuf);
            } catch (e) {
                // Background preloading warning non-fatal
            }
        }
    }

    unlockAudio() {
        this._initContext();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        this.preloadGameplayTracks().catch(() => {});
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (typeof localStorage !== 'undefined') {
            try { localStorage.setItem('nbc_volume', this.volume.toFixed(2)); } catch (_) {}
        }
        if (this.masterGain && this.ctx) {
            const targetGain = this.muted ? 0 : (this.volume * 0.28);
            this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.02);
        }
    }

    setMuted(muted) {
        this.muted = !!muted;
        if (typeof localStorage !== 'undefined') {
            try { localStorage.setItem('nbc_muted', this.muted ? 'true' : 'false'); } catch (_) {}
        }
        if (this.masterGain && this.ctx) {
            const targetGain = this.muted ? 0 : (this.volume * 0.28);
            this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.02);
        }
    }

    toggleMute() {
        this.setMuted(!this.muted);
        return this.muted;
    }

    /**
     * Synthesize single buzzer/tone (retro J2ME single frequency, warm mellow tone).
     */
    playTone(note, duration, volume = 50) {
        if (this.muted) return;
        this._initContext();
        if (!this.ctx) return;

        try {
            const freq = note > 0 ? 440 * Math.pow(2, (note - 69) / 12) : 220;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "triangle"; // Warm retro tone instead of harsh buzzing square
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            const vol = Math.max(0, Math.min(1, volume / 100)) * 0.10;
            const now = this.ctx.currentTime;
            const dur = Math.max(0.04, duration / 1000);

            gain.gain.setValueAtTime(vol, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

            osc.connect(gain);
            gain.connect(this.filterNode);

            osc.start(now);
            osc.stop(now + dur);
        } catch (e) {}
    }

    playClick() {
        this.playTone(72, 14, 8); // Gentle soft tick
    }

    /**
     * Parse Standard MIDI bytes into a chronological sequence of note events.
     */
    parseMidi(rawBytes) {
        let bytes = rawBytes;
        if (bytes instanceof Int8Array) {
            bytes = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        }
        // Find MThd magic if offset
        let start = 0;
        for (let i = 0; i < Math.min(bytes.length - 4, 32); i++) {
            if (bytes[i] === 0x4D && bytes[i+1] === 0x54 && bytes[i+2] === 0x68 && bytes[i+3] === 0x64) {
                start = i;
                break;
            }
        }
        if (start > 0) bytes = bytes.slice(start);

        // Strip any extra Living Mobile type indicator trailing byte based on exact MIDI header & chunk lengths
        if (bytes.length > 14) {
            const tempView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
            const numTracks = tempView.getUint16(10);
            let expectedEnd = 14;
            for (let t = 0; t < numTracks && expectedEnd + 8 <= bytes.length; t++) {
                const trkLen = tempView.getUint32(expectedEnd + 4);
                expectedEnd += 8 + trkLen;
            }
            if (expectedEnd > 14 && expectedEnd < bytes.length) {
                bytes = bytes.slice(0, expectedEnd);
            }
        }

        let pos = 0;
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

        function readUint32() {
            const v = view.getUint32(pos);
            pos += 4;
            return v;
        }
        function readUint16() {
            const v = view.getUint16(pos);
            pos += 2;
            return v;
        }
        function readUint8() {
            const v = view.getUint8(pos);
            pos += 1;
            return v;
        }
        function readVarLen() {
            let val = 0;
            let b;
            do {
                b = readUint8();
                val = (val << 7) | (b & 0x7F);
            } while (b & 0x80);
            return val;
        }

        const magic = String.fromCharCode(readUint8(), readUint8(), readUint8(), readUint8());
        if (magic !== 'MThd') {
            throw new Error('Not Standard MIDI format: ' + magic);
        }
        readUint32(); // headerLen
        readUint16(); // format
        const numTracks = readUint16();
        const division = readUint16();

        const events = [];

        for (let t = 0; t < numTracks; t++) {
            readUint8(); readUint8(); readUint8(); readUint8(); // 'MTrk'
            const trkLen = readUint32();
            const trkEnd = pos + trkLen;

            let runningStatus = 0;
            let currentTick = 0;
            let currentTimeSec = 0;
            let currentTempo = 500000; // 120 BPM default
            const channelPrograms = new Uint8Array(16);
            const activeNotes = Array.from({ length: 16 }, () => ({}));

            while (pos < trkEnd && pos < bytes.byteLength) {
                const deltaTicks = readVarLen();
                if (deltaTicks > 0) {
                    currentTick += deltaTicks;
                    const secondsPerTick = (currentTempo / 1000000) / division;
                    currentTimeSec += deltaTicks * secondsPerTick;
                }

                let status = readUint8();
                if (status < 0x80) {
                    pos--;
                    status = runningStatus;
                } else {
                    runningStatus = status;
                }

                if (status === 0xFF) {
                    const metaType = readUint8();
                    const len = readVarLen();
                    if (metaType === 0x51 && len === 3) {
                        const b0 = readUint8();
                        const b1 = readUint8();
                        const b2 = readUint8();
                        currentTempo = (b0 << 16) | (b1 << 8) | b2;
                    } else {
                        pos += len;
                    }
                } else if (status === 0xF0 || status === 0xF7) {
                    const len = readVarLen();
                    pos += len;
                } else {
                    const cmd = status & 0xF0;
                    const chan = status & 0x0F;

                    if (cmd === 0x90) { // Note On
                        const note = readUint8();
                        const vel = readUint8();
                        if (vel > 0) {
                            if (activeNotes[chan][note]) {
                                const prev = activeNotes[chan][note];
                                events.push({
                                    time: prev.startTime,
                                    duration: Math.max(0.04, currentTimeSec - prev.startTime),
                                    note,
                                    vel: prev.vel,
                                    chan,
                                    isDrum: chan === 9,
                                    program: channelPrograms[chan]
                                });
                            }
                            activeNotes[chan][note] = { startTime: currentTimeSec, vel };
                        } else {
                            if (activeNotes[chan][note]) {
                                const prev = activeNotes[chan][note];
                                events.push({
                                    time: prev.startTime,
                                    duration: Math.max(0.04, currentTimeSec - prev.startTime),
                                    note,
                                    vel: prev.vel,
                                    chan,
                                    isDrum: chan === 9,
                                    program: channelPrograms[chan]
                                });
                                delete activeNotes[chan][note];
                            }
                        }
                    } else if (cmd === 0x80) { // Note Off
                        const note = readUint8();
                        readUint8(); // vel
                        if (activeNotes[chan][note]) {
                            const prev = activeNotes[chan][note];
                            events.push({
                                time: prev.startTime,
                                duration: Math.max(0.04, currentTimeSec - prev.startTime),
                                note,
                                vel: prev.vel,
                                chan,
                                isDrum: chan === 9,
                                program: channelPrograms[chan]
                            });
                            delete activeNotes[chan][note];
                        }
                    } else if (cmd === 0xC0) { // Program Change
                        channelPrograms[chan] = readUint8();
                    } else if (cmd === 0xD0) {
                        readUint8();
                    } else {
                        readUint8();
                        readUint8();
                    }
                }
            }

            for (let c = 0; c < 16; c++) {
                for (const n in activeNotes[c]) {
                    const prev = activeNotes[c][n];
                    events.push({
                        time: prev.startTime,
                        duration: Math.max(0.04, currentTimeSec - prev.startTime),
                        note: parseInt(n, 10),
                        vel: prev.vel,
                        chan: c,
                        isDrum: c === 9,
                        program: channelPrograms[c]
                    });
                }
            }

            return {
                totalDuration: currentTimeSec,
                notes: events.sort((a, b) => a.time - b.time)
            };
        }
    }

    /**
     * Start playing a Standard MIDI track or sound effect.
     */
    playAudio(id, bytes, mime, loopCount = 1) {
        if (this.muted) return;
        this._initContext();
        if (!this.ctx) return;

        // If entering menu or playing MIDI track, smoothly fade out any gameplay music
        if (this.isGameplayPlaying) {
            this.fadeAndStopGameplayMusic(0.25);
        }

        // If same BGM track is already playing, let it loop
        if (this.isPlaying && this.currentTrackId === id && loopCount === -1) {
            return;
        }

        this.stopAudio();

        let trackData = this.parsedTrackCache.get(id);
        if (!trackData) {
            try {
                trackData = this.parseMidi(bytes);
                this.parsedTrackCache.set(id, trackData);
            } catch (err) {
                console.warn(`Failed to parse MIDI track ${id}:`, err);
                return;
            }
        }

        this.currentTrackId = id;
        this.currentTrack = trackData;
        this.loopCount = loopCount;
        this.isPlaying = true;
        this.noteIndex = 0;
        this.trackStartTime = this.ctx.currentTime + 0.05; // 50ms pre-roll

        // Start scheduler loop (every 30ms, schedules 150ms ahead)
        this.schedulerTimer = setInterval(() => this._scheduleSlice(), 30);
        this._scheduleSlice();
    }

    _scheduleSlice() {
        if (!this.isPlaying || !this.currentTrack || !this.ctx) return;

        const now = this.ctx.currentTime;
        const LOOKAHEAD = 0.25; // 250ms lookahead
        const track = this.currentTrack;

        while (this.noteIndex < track.notes.length) {
            const note = track.notes[this.noteIndex];
            const scheduleTime = this.trackStartTime + note.time;

            if (scheduleTime > now + LOOKAHEAD) {
                break; // Not yet time to schedule
            }

            if (scheduleTime >= now - 0.05) {
                this._synthesizeNote(note, scheduleTime);
            }

            this.noteIndex++;
        }

        // Check if track reached end
        if (this.noteIndex >= track.notes.length) {
            const trackEndTime = this.trackStartTime + track.totalDuration;
            if (now >= trackEndTime) {
                if (this.loopCount === -1 || this.loopCount > 1) {
                    if (this.loopCount > 1) this.loopCount--;
                    // Seamless loop
                    this.noteIndex = 0;
                    this.trackStartTime = Math.max(now, trackEndTime);
                } else {
                    this.stopAudio();
                }
            }
        }
    }

    _synthesizeNote(note, startTime) {
        if (this.muted || !this.ctx) return;

        try {
            const duration = Math.min(4.0, Math.max(0.04, note.duration));
            // Comfortable per-voice volume (prevents 14-voice polyphony from overwhelming ears)
            const baseVol = (note.vel / 127) * 0.07;
            const stopTime = startTime + duration;

            if (note.isDrum) {
                this._synthesizeDrum(note.note, startTime, baseVol);
                return;
            }

            // Melodic Voice Synthesis with warm dedicated voice filtering
            const osc = this.ctx.createOscillator();
            const voiceFilter = this.ctx.createBiquadFilter();
            voiceFilter.type = "lowpass";
            const gain = this.ctx.createGain();

            const freq = 440 * Math.pow(2, (note.note - 69) / 12);
            osc.frequency.setValueAtTime(freq, startTime);

            // Program / Instrument mapping with warm acoustic frequency shaping
            const p = note.program || 0;
            if (p >= 16 && p <= 23) {
                osc.type = "sine"; // Organ: warm, smooth
                voiceFilter.frequency.setValueAtTime(2400, startTime);
            } else if (p >= 32 && p <= 39) {
                osc.type = "triangle"; // Deep Bass: round, warm
                voiceFilter.frequency.setValueAtTime(900, startTime);
            } else if (p >= 40 && p <= 55) {
                // Orchestral Strings (Danny Elfman motif):
                // Sawtooth warmly filtered at 1500 Hz gives iconic rich orchestral character without piercing buzz!
                osc.type = "sawtooth";
                voiceFilter.frequency.setValueAtTime(1500, startTime);
                voiceFilter.Q.setValueAtTime(0.9, startTime);
            } else if (p >= 56 && p <= 71) {
                // Brass / Woodwinds:
                // Square wave filtered at 1300 Hz turns harsh buzz into warm French horn / reed
                osc.type = "square";
                voiceFilter.frequency.setValueAtTime(1300, startTime);
                voiceFilter.Q.setValueAtTime(0.7, startTime);
            } else if (p >= 72 && p <= 79) {
                osc.type = "sine"; // Flute / Whistle: soft sine
                voiceFilter.frequency.setValueAtTime(2600, startTime);
            } else {
                osc.type = "triangle"; // Default retro melodic voice: mellow triangle
                voiceFilter.frequency.setValueAtTime(1800, startTime);
            }

            // Envelope: Smooth 25ms attack to prevent ear clicks, gentle sustain & natural decay
            const attackTime = Math.min(0.025, duration * 0.25);
            gain.gain.setValueAtTime(0.0001, startTime);
            gain.gain.linearRampToValueAtTime(baseVol, startTime + attackTime);
            gain.gain.setValueAtTime(baseVol * 0.75, startTime + Math.max(attackTime + 0.01, duration * 0.65));
            gain.gain.exponentialRampToValueAtTime(0.0001, stopTime + 0.04);

            osc.connect(voiceFilter);
            voiceFilter.connect(gain);
            gain.connect(this.filterNode);

            osc.start(startTime);
            osc.stop(stopTime + 0.05);

            const voiceRef = { osc, voiceFilter, gain };
            this.activeVoices.add(voiceRef);
            osc.onended = () => {
                this.activeVoices.delete(voiceRef);
                try {
                    osc.disconnect();
                    voiceFilter.disconnect();
                    gain.disconnect();
                } catch (e) {}
            };
        } catch (e) {}
    }

    _synthesizeDrum(drumNote, startTime, baseVol) {
        if (!this.ctx) return;

        try {
            // Kick Drum (35, 36) - Soft, deep acoustic thud
            if (drumNote === 35 || drumNote === 36) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(120, startTime);
                osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.07);

                gain.gain.setValueAtTime(baseVol * 0.85, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

                osc.connect(gain);
                gain.connect(this.filterNode);
                osc.start(startTime);
                osc.stop(startTime + 0.09);

                const v = { osc, gain };
                this.activeVoices.add(v);
                osc.onended = () => {
                    this.activeVoices.delete(v);
                    try { osc.disconnect(); gain.disconnect(); } catch (e) {}
                };
                return;
            }

            // Snare / Hi-Hat / Cymbal - Soft, warm filtered noise (NOT ear-piercing static hiss)
            if (this.noiseBuffer) {
                const noise = this.ctx.createBufferSource();
                noise.buffer = this.noiseBuffer;

                const filter = this.ctx.createBiquadFilter();
                const gain = this.ctx.createGain();

                const isHiHat = (drumNote === 42 || drumNote === 44 || drumNote === 46);
                const dur = isHiHat ? 0.03 : 0.06;

                // Hi-Hat: 4500Hz gentle tick with 0.15 volume (was 7000Hz harsh hiss at 0.7)
                // Snare: 1200Hz soft tap with 0.30 volume (was 2200Hz abrasive blast at 1.2)
                filter.type = "bandpass";
                filter.frequency.setValueAtTime(isHiHat ? 4500 : 1200, startTime);
                filter.Q.setValueAtTime(isHiHat ? 2.0 : 1.4, startTime);

                const drumVol = baseVol * (isHiHat ? 0.15 : 0.30);
                gain.gain.setValueAtTime(drumVol, startTime);
                gain.gain.exponentialRampToValueAtTime(0.0005, startTime + dur);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.filterNode);

                noise.start(startTime);
                noise.stop(startTime + dur + 0.01);

                const v = { osc: noise, filter, gain };
                this.activeVoices.add(v);
                noise.onended = () => {
                    this.activeVoices.delete(v);
                    try { noise.disconnect(); filter.disconnect(); gain.disconnect(); } catch (e) {}
                };
            }
        } catch (e) {}
    }

    /**
     * Start playing high-fidelity tuned GBA gameplay theme with gapless looping.
     * Round-robin rotation across stages:
     *   0: Town Square Exploration
     *   1: Cemetery & Graveyard
     *   2: Title Theme (This Is Halloween)
     */
    async playGameplayTrack(stageTrackIndex) {
        if (this.muted) return;
        this._initContext();
        if (!this.ctx) return;

        const trackIdx = Math.abs(stageTrackIndex) % 3;

        // If this exact track is already looping, keep playing
        if (this.isGameplayPlaying && this.currentGameplayIndex === trackIdx) {
            return;
        }

        // Stop any active J2ME MIDI synth immediately (e.g. menu theme)
        this.stopMidiAudio();

        // Fade out previous gameplay track smoothly if one was running
        if (this.currentGameplaySource && this.currentGameplayGain) {
            const prevGain = this.currentGameplayGain;
            const prevSource = this.currentGameplaySource;
            const now = this.ctx.currentTime;
            try {
                prevGain.gain.cancelScheduledValues(now);
                prevGain.gain.setValueAtTime(prevGain.gain.value, now);
                prevGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
                setTimeout(() => {
                    try { prevSource.stop(); prevSource.disconnect(); prevGain.disconnect(); } catch (_) {}
                }, 260);
            } catch (_) {}
            this.currentGameplaySource = null;
            this.currentGameplayGain = null;
        }

        this.currentGameplayIndex = trackIdx;
        this.isGameplayPlaying = true;

        let buffer = this.gameplayAudioBuffers.get(trackIdx);
        if (!buffer) {
            try {
                const files = ['town_square.mp3', 'cemetery_graveyard.mp3', 'title_this_is_halloween.mp3'];
                const url = this.getTrackUrl(files[trackIdx]);
                const res = await fetch(url);
                const arrayBuf = await res.arrayBuffer();
                buffer = await this.ctx.decodeAudioData(arrayBuf);
                this.gameplayAudioBuffers.set(trackIdx, buffer);
            } catch (err) {
                console.warn(`[AudioManager] Failed to load gameplay track ${trackIdx}:`, err);
                return;
            }
        }

        if (!this.isGameplayPlaying || this.currentGameplayIndex !== trackIdx) {
            return; // State changed during async decode
        }

        try {
            const source = this.ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const gainNode = this.ctx.createGain();
            const now = this.ctx.currentTime;
            // Smooth 0.2s fade-in for velvety start
            gainNode.gain.setValueAtTime(0.0001, now);
            gainNode.gain.exponentialRampToValueAtTime(1.0, now + 0.2);

            source.connect(gainNode);
            gainNode.connect(this.gameplayFilter);

            source.start(now);
            this.currentGameplaySource = source;
            this.currentGameplayGain = gainNode;
            console.log(`[AudioManager] Playing gameplay theme #${trackIdx + 1}: ${this.trackNames[trackIdx]}`);
        } catch (playErr) {
            console.warn("[AudioManager] Error starting gameplay buffer source:", playErr);
        }
    }

    /**
     * Exponential fade-out for gameplay music (e.g. stage complete or Jack death).
     */
    fadeAndStopGameplayMusic(duration = 0.3) {
        this.isGameplayPlaying = false;
        this.currentGameplayIndex = -1;
        if (!this.currentGameplaySource || !this.currentGameplayGain || !this.ctx) return;

        const now = this.ctx.currentTime;
        const gainNode = this.currentGameplayGain;
        const source = this.currentGameplaySource;
        this.currentGameplayGain = null;
        this.currentGameplaySource = null;

        try {
            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.setValueAtTime(gainNode.gain.value, now);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            setTimeout(() => {
                try {
                    source.stop();
                    source.disconnect();
                    gainNode.disconnect();
                } catch (_) {}
            }, (duration + 0.05) * 1000);
        } catch (e) {
            try { source.stop(); } catch (_) {}
        }
    }

    /**
     * Stop currently playing MIDI track or SFX immediately and release audio nodes.
     */
    stopMidiAudio() {
        if (this.schedulerTimer) {
            clearInterval(this.schedulerTimer);
            this.schedulerTimer = null;
        }

        this.isPlaying = false;
        this.currentTrackId = -1;
        this.currentTrack = null;

        if (this.ctx) {
            const now = this.ctx.currentTime;
            for (const voice of this.activeVoices) {
                try {
                    voice.gain.gain.cancelScheduledValues(now);
                    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
                    voice.gain.gain.linearRampToValueAtTime(0.0001, now + 0.02);
                    voice.osc.stop(now + 0.025);
                    if (voice.voiceFilter) voice.voiceFilter.disconnect();
                    if (voice.filter) voice.filter.disconnect();
                } catch (e) {}
            }
        }
        this.activeVoices.clear();
    }

    /**
     * Stop all audio (MIDI synthesizer voices + active gameplay theme).
     */
    stopAudio() {
        this.stopMidiAudio();
        this.fadeAndStopGameplayMusic(0.15);
    }
}

export const AudioManager = new RetroMidiSynthesizer();
if (typeof window !== 'undefined') {
    window.AudioManager = AudioManager;
}
