import fs from 'fs';

function parseMidi(bytes) {
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

    // Header
    const magic = String.fromCharCode(readUint8(), readUint8(), readUint8(), readUint8());
    if (magic !== 'MThd') throw new Error('Not MIDI: ' + magic);
    const headerLen = readUint32();
    const format = readUint16();
    const numTracks = readUint16();
    const division = readUint16();

    const events = []; // { timeSec, type: 'noteOn' | 'noteOff', note, vel, chan, program }

    for (let t = 0; t < numTracks; t++) {
        const trkMagic = String.fromCharCode(readUint8(), readUint8(), readUint8(), readUint8());
        const trkLen = readUint32();
        const trkEnd = pos + trkLen;

        let runningStatus = 0;
        let currentTick = 0;
        let currentTimeSec = 0;
        let currentTempo = 500000; // us per quarter note
        const channelPrograms = new Uint8Array(16);

        // Keep track of active note start times to compute duration
        // activeNotes[chan][note] = { startTime, vel }
        const activeNotes = Array.from({ length: 16 }, () => ({}));

        while (pos < trkEnd) {
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
                // Meta
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
                        // If note already active, close it
                        if (activeNotes[chan][note]) {
                            const prev = activeNotes[chan][note];
                            events.push({
                                time: prev.startTime,
                                duration: Math.max(0.05, currentTimeSec - prev.startTime),
                                note,
                                vel: prev.vel,
                                chan,
                                isDrum: chan === 9,
                                program: channelPrograms[chan]
                            });
                        }
                        activeNotes[chan][note] = { startTime: currentTimeSec, vel };
                    } else {
                        // Note off
                        if (activeNotes[chan][note]) {
                            const prev = activeNotes[chan][note];
                            events.push({
                                time: prev.startTime,
                                duration: Math.max(0.05, currentTimeSec - prev.startTime),
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
                    const vel = readUint8();
                    if (activeNotes[chan][note]) {
                        const prev = activeNotes[chan][note];
                        events.push({
                            time: prev.startTime,
                            duration: Math.max(0.05, currentTimeSec - prev.startTime),
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

        // Close any remaining notes at track end
        for (let c = 0; c < 16; c++) {
            for (const n in activeNotes[c]) {
                const prev = activeNotes[c][n];
                events.push({
                    time: prev.startTime,
                    duration: Math.max(0.05, currentTimeSec - prev.startTime),
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

const file = fs.readFileSync('assets/audio/track_3.mid');
const parsed = parseMidi(new Uint8Array(file));
console.log(`Parsed Track 3: duration = ${parsed.totalDuration.toFixed(2)}s, total note events = ${parsed.notes.length}`);
console.log("First 5 notes:", parsed.notes.slice(0, 5));

