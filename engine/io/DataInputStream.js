/**
 * DataInputStream.js
 * Implements Java's java.io.DataInputStream over an ArrayBuffer / Uint8Array.
 * Handles big-endian binary reading and Modified UTF-8 decoding.
 */
export class DataInputStream {
    /**
     * @param {ArrayBuffer | Uint8Array} buffer
     * @param {number} [byteOffset=0]
     * @param {number} [byteLength]
     */
    constructor(buffer, byteOffset = 0, byteLength) {
        if (buffer instanceof Uint8Array) {
            this.buffer = buffer.buffer;
            this.byteOffset = buffer.byteOffset + byteOffset;
            this.byteLength = byteLength !== undefined ? byteLength : (buffer.byteLength - byteOffset);
        } else {
            this.buffer = buffer;
            this.byteOffset = byteOffset;
            this.byteLength = byteLength !== undefined ? byteLength : (buffer.byteLength - byteOffset);
        }
        this.view = new DataView(this.buffer, this.byteOffset, this.byteLength);
        this.pos = 0;
    }

    readByte() {
        if (this.pos >= this.byteLength) throw new Error("EOF reached in readByte");
        const val = this.view.getInt8(this.pos);
        this.pos += 1;
        return val;
    }

    read(...args) {
        if (args.length === 0) {
            if (this.pos >= this.byteLength) return -1;
            return this.readUnsignedByte();
        }
        const target = args[0];
        const offset = args[1] !== undefined ? args[1] : 0;
        const length = args[2] !== undefined ? args[2] : (target.length - offset);
        const available = this.byteLength - this.pos;
        if (available <= 0) return -1;
        const toRead = Math.min(length, available);
        const src = new Uint8Array(this.buffer, this.byteOffset + this.pos, toRead);
        target.set(src, offset);
        this.pos += toRead;
        return toRead;
    }

    skip(n) {
        return this.skipBytes(Number(n));
    }

    readUnsignedByte() {
        if (this.pos >= this.byteLength) throw new Error("EOF reached in readUnsignedByte");
        const val = this.view.getUint8(this.pos);
        this.pos += 1;
        return val;
    }

    readShort() {
        if (this.pos + 2 > this.byteLength) throw new Error("EOF reached in readShort");
        const val = this.view.getInt16(this.pos, false); // big-endian
        this.pos += 2;
        return val;
    }

    readUnsignedShort() {
        if (this.pos + 2 > this.byteLength) throw new Error("EOF reached in readUnsignedShort");
        const val = this.view.getUint16(this.pos, false); // big-endian
        this.pos += 2;
        return val;
    }

    readInt() {
        if (this.pos + 4 > this.byteLength) throw new Error("EOF reached in readInt");
        const val = this.view.getInt32(this.pos, false); // big-endian
        this.pos += 4;
        return val;
    }

    skipBytes(n) {
        const toSkip = Math.min(n, this.byteLength - this.pos);
        this.pos += toSkip;
        return toSkip;
    }

    readFully(target, offset = 0, length = null) {
        const len = length !== null ? length : target.length - offset;
        if (this.pos + len > this.byteLength) throw new Error("EOF reached in readFully");
        const src = new Uint8Array(this.buffer, this.byteOffset + this.pos, len);
        target.set(src, offset);
        this.pos += len;
    }

    readUTF() {
        const utflen = this.readUnsignedShort();
        if (this.pos + utflen > this.byteLength) throw new Error("EOF reached in readUTF");
        const bytes = new Uint8Array(this.buffer, this.byteOffset + this.pos, utflen);
        this.pos += utflen;

        let str = "";
        let i = 0;
        while (i < utflen) {
            const b1 = bytes[i++];
            if ((b1 & 0x80) === 0) {
                str += String.fromCharCode(b1);
            } else if ((b1 & 0xE0) === 0xC0) {
                const b2 = bytes[i++];
                str += String.fromCharCode(((b1 & 0x1F) << 6) | (b2 & 0x3F));
            } else if ((b1 & 0xF0) === 0xE0) {
                const b2 = bytes[i++];
                const b3 = bytes[i++];
                str += String.fromCharCode(((b1 & 0x0F) << 12) | ((b2 & 0x3F) << 6) | (b3 & 0x3F));
            }
        }
        return str;
    }

    readBoolean() {
        return this.readByte() !== 0;
    }

    readChar() {
        return this.readUnsignedShort();
    }

    available() {
        return Math.max(0, this.byteLength - this.pos);
    }

    close() {}
}

