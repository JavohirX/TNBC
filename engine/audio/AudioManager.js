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
        this.noiseBuffer = null;
        this.muted = false;

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

                // Master Dynamics / Warm Retro Filter
                this.filterNode = this.ctx.createBiquadFilter();
                this.filterNode.type = "lowpass";
                this.filterNode.frequency.setValueAtTime(8000, this.ctx.currentTime); // Gentle roll-off for 2005 mobile warmth

                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.35, this.ctx.currentTime);

                this.filterNode.connect(this.masterGain);
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

    unlockAudio() {
        this._initContext();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    setMuted(muted) {
        this.muted = !!muted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.35, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.setMuted(!this.muted);
        return this.muted;
    }

    /**
     * Synthesize single buzzer/tone (retro J2ME single frequency).
     */
    playTone(note, duration, volume = 50) {
        if (this.muted) return;
        this._initContext();
        if (!this.ctx) return;

        try {
            const freq = note > 0 ? 440 * Math.pow(2, (note - 69) / 12) : 220;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "square";
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            const vol = Math.max(0, Math.min(1, volume / 100)) * 0.25;
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
        this.playTone(84, 18, 15);
    }

    /**
     * Parse Standard MIDI bytes into a chronological sequence of note events.
     */
    parseMidi(rawBytes) {
        let bytes = rawBytes;
        if (bytes instanceof Int8Array) {
            bytes = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        }
        // If last byte is Living Mobile type indicator, strip it
        if (bytes.length > 4 && String.fromCharCode(...bytes.slice(0, 4)) !== 'MThd') {
            // Find MThd magic if offset
            const str = String.fromCharCode(...bytes.slice(0, 16));
            const idx = str.indexOf('MThd');
            if (idx > 0) bytes = bytes.slice(idx);
        } else if (bytes.length > 4 && bytes[bytes.length - 1] === 0) {
            // Check if MThd starts at 0
            if (String.fromCharCode(...bytes.slice(0, 4)) === 'MThd') {
                bytes = bytes.slice(0, bytes.length - 1);
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
            const baseVol = (note.vel / 127) * 0.18; // Balanced mix
            const stopTime = startTime + duration;

            if (note.isDrum) {
                this._synthesizeDrum(note.note, startTime, baseVol);
                return;
            }

            // Melodic Voice Synthesis
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            const freq = 440 * Math.pow(2, (note.note - 69) / 12);
            osc.frequency.setValueAtTime(freq, startTime);

            // Program / Instrument mapping for retro J2ME Nokia 2005 feel
            const p = note.program || 0;
            if (p >= 16 && p <= 23) {
                osc.type = "sine"; // Organ / Warm tone
            } else if (p >= 32 && p <= 39) {
                osc.type = "triangle"; // Deep Bass
            } else if (p >= 40 && p <= 55) {
                osc.type = "sawtooth"; // Orchestral Strings (Iconic Danny Elfman!)
            } else if (p >= 56 && p <= 71) {
                osc.type = "square"; // Brass / Woodwinds
            } else if (p >= 72 && p <= 79) {
                osc.type = "sine"; // Flute / Whistle
            } else {
                osc.type = "triangle"; // Default retro melodic voice
            }

            // Envelope: Quick attack, sustain, gentle exponential release
            gain.gain.setValueAtTime(0.0001, startTime);
            gain.gain.linearRampToValueAtTime(baseVol, startTime + 0.015);
            gain.gain.setValueAtTime(baseVol * 0.85, startTime + Math.max(0.02, duration * 0.7));
            gain.gain.exponentialRampToValueAtTime(0.0001, stopTime + 0.04);

            osc.connect(gain);
            gain.connect(this.filterNode);

            osc.start(startTime);
            osc.stop(stopTime + 0.05);

            const voiceRef = { osc, gain };
            this.activeVoices.add(voiceRef);
            osc.onended = () => {
                this.activeVoices.delete(voiceRef);
                try { osc.disconnect(); gain.disconnect(); } catch (e) {}
            };
        } catch (e) {}
    }

    _synthesizeDrum(drumNote, startTime, baseVol) {
        if (!this.ctx) return;

        try {
            // Kick Drum (35, 36)
            if (drumNote === 35 || drumNote === 36) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(140, startTime);
                osc.frequency.exponentialRampToValueAtTime(38, startTime + 0.08);

                gain.gain.setValueAtTime(baseVol * 1.5, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

                osc.connect(gain);
                gain.connect(this.filterNode);
                osc.start(startTime);
                osc.stop(startTime + 0.1);

                const v = { osc, gain };
                this.activeVoices.add(v);
                osc.onended = () => { this.activeVoices.delete(v); };
                return;
            }

            // Snare / Hi-Hat / Cymbal (White Noise based)
            if (this.noiseBuffer) {
                const noise = this.ctx.createBufferSource();
                noise.buffer = this.noiseBuffer;

                const filter = this.ctx.createBiquadFilter();
                const gain = this.ctx.createGain();

                const isHiHat = (drumNote === 42 || drumNote === 44 || drumNote === 46);
                const dur = isHiHat ? 0.04 : 0.10;

                filter.type = isHiHat ? "highpass" : "bandpass";
                filter.frequency.setValueAtTime(isHiHat ? 7000 : 2200, startTime);

                gain.gain.setValueAtTime(baseVol * (isHiHat ? 0.7 : 1.2), startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.filterNode);

                noise.start(startTime);
                noise.stop(startTime + dur + 0.02);

                const v = { osc: noise, gain };
                this.activeVoices.add(v);
                noise.onended = () => { this.activeVoices.delete(v); };
            }
        } catch (e) {}
    }

    /**
     * Stop currently playing MIDI track or SFX immediately and release audio nodes.
     */
    stopAudio() {
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
                } catch (e) {}
            }
        }
        this.activeVoices.clear();
    }
}

export const AudioManager = new RetroMidiSynthesizer();
if (typeof window !== 'undefined') {
    window.AudioManager = AudioManager;
}
