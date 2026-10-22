import fs from 'fs';

const buf = fs.readFileSync('assets/audio/track_3.mid');
console.log("File size:", buf.length);

class MidiReader {
    constructor(buffer) {
        this.buf = buffer;
        this.pos = 0;
    }

    readUint32() {
        const val = this.buf.readUInt32BE(this.pos);
        this.pos += 4;
        return val;
    }

    readUint16() {
        const val = this.buf.readUInt16BE(this.pos);
        this.pos += 2;
        return val;
    }

    readUint8() {
        const val = this.buf.readUInt8(this.pos);
        this.pos += 1;
        return val;
    }

    readString(len) {
        const str = this.buf.toString('ascii', this.pos, this.pos + len);
        this.pos += len;
        return str;
    }

    readVarLen() {
        let val = 0;
        let byte;
        do {
            byte = this.readUint8();
            val = (val << 7) | (byte & 0x7F);
        } while (byte & 0x80);
        return val;
    }
}

const reader = new MidiReader(buf);
const headerMagic = reader.readString(4);
const headerLen = reader.readUint32();
const format = reader.readUint16();
const numTracks = reader.readUint16();
const division = reader.readUint16();

console.log({ headerMagic, headerLen, format, numTracks, division });

for (let t = 0; t < numTracks; t++) {
    const trackMagic = reader.readString(4);
    const trackLen = reader.readUint32();
    const trackEnd = reader.pos + trackLen;
    console.log(`Track ${t}: magic=${trackMagic}, len=${trackLen}`);
    
    let runningStatus = 0;
    let totalTicks = 0;
    let noteOnCount = 0;
    let tempo = 500000; // default 120 bpm (500000 us/qn)

    while (reader.pos < trackEnd) {
        const delta = reader.readVarLen();
        totalTicks += delta;
        let status = reader.readUint8();
        if (status < 0x80) {
            // Running status
            reader.pos--;
            status = runningStatus;
        } else {
            runningStatus = status;
        }

        if (status === 0xFF) {
            // Meta event
            const metaType = reader.readUint8();
            const len = reader.readVarLen();
            if (metaType === 0x51 && len === 3) {
                const b0 = reader.readUint8();
                const b1 = reader.readUint8();
                const b2 = reader.readUint8();
                tempo = (b0 << 16) | (b1 << 8) | b2;
                console.log(`  Set Tempo: ${tempo} us/beat (${Math.round(60000000 / tempo)} BPM)`);
            } else {
                reader.pos += len;
            }
        } else if (status === 0xF0 || status === 0xF7) {
            // SysEx
            const len = reader.readVarLen();
            reader.pos += len;
        } else {
            const cmd = status & 0xF0;
            const chan = status & 0x0F;
            if (cmd === 0x90) {
                const note = reader.readUint8();
                const vel = reader.readUint8();
                if (vel > 0) noteOnCount++;
            } else if (cmd === 0x80) {
                const note = reader.readUint8();
                const vel = reader.readUint8();
            } else if (cmd === 0xC0 || cmd === 0xD0) {
                reader.readUint8();
            } else {
                reader.readUint8();
                reader.readUint8();
            }
        }
    }
    console.log(`Track ${t} finished: totalTicks=${totalTicks}, noteOnCount=${noteOnCount}`);
}

