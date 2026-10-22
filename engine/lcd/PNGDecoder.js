/**
 * PNGDecoder.js
 * Synchronous pure JavaScript PNG decoder for J2ME runtime.
 * Supports bitDepth 1, 2, 4, 8 for Indexed (type 3), RGB (type 2), and RGBA (type 6).
 */
import { inflate } from "./pako.js";

function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
}

export function decodePNG(bytes, offset = 0, length = null) {
    const len = length !== null ? length : bytes.length - offset;
    const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes.buffer, bytes.byteOffset || 0, bytes.byteLength || bytes.length);
    const view = new DataView(u8.buffer, u8.byteOffset + offset, len);
    
    let pos = 8; // skip 8-byte PNG signature
    let width = 0, height = 0, bitDepth = 8, colorType = 3;
    let palette = null;
    let trns = null;
    const idatChunks = [];

    while (pos < len) {
        const chunkLen = view.getUint32(pos, false);
        const type = String.fromCharCode(
            view.getUint8(pos + 4),
            view.getUint8(pos + 5),
            view.getUint8(pos + 6),
            view.getUint8(pos + 7)
        );
        const dataOffset = offset + pos + 8;

        if (type === 'IHDR') {
            width = view.getUint32(pos + 8, false);
            height = view.getUint32(pos + 12, false);
            bitDepth = view.getUint8(pos + 16);
            colorType = view.getUint8(pos + 17);
        } else if (type === 'PLTE') {
            palette = u8.subarray(dataOffset, dataOffset + chunkLen);
        } else if (type === 'tRNS') {
            trns = u8.subarray(dataOffset, dataOffset + chunkLen);
        } else if (type === 'IDAT') {
            idatChunks.push(u8.subarray(dataOffset, dataOffset + chunkLen));
        } else if (type === 'IEND') {
            break;
        }
        pos += 12 + chunkLen;
    }

    if (width === 0 || height === 0) {
        throw new Error("Invalid PNG or zero dimensions");
    }

    const totalIDAT = idatChunks.reduce((acc, c) => acc + c.length, 0);
    const combined = new Uint8Array(totalIDAT);
    let off = 0;
    for (const c of idatChunks) {
        combined.set(c, off);
        off += c.length;
    }

    const raw = inflate(combined);
    const channels = colorType === 6 ? 4 : (colorType === 2 ? 3 : 1);
    const bpp = Math.max(1, Math.ceil((channels * bitDepth) / 8));
    const stride = Math.ceil((width * channels * bitDepth) / 8);
    const out = new Uint8Array(width * height * 4);
    const scanlines = new Uint8Array(height * stride);

    let rawIdx = 0;
    for (let y = 0; y < height; y++) {
        const filter = raw[rawIdx++];
        const lineOff = y * stride;
        const prevLineOff = (y - 1) * stride;

        for (let x = 0; x < stride; x++) {
            const cur = raw[rawIdx++];
            const left = x >= bpp ? scanlines[lineOff + x - bpp] : 0;
            const up = y > 0 ? scanlines[prevLineOff + x] : 0;
            const upLeft = (y > 0 && x >= bpp) ? scanlines[prevLineOff + x - bpp] : 0;
            let val = cur;
            if (filter === 1) val = (cur + left) & 0xFF;
            else if (filter === 2) val = (cur + up) & 0xFF;
            else if (filter === 3) val = (cur + ((left + up) >> 1)) & 0xFF;
            else if (filter === 4) val = (cur + paeth(left, up, upLeft)) & 0xFF;
            scanlines[lineOff + x] = val;
        }
    }

    let pixelIdx = 0;
    for (let y = 0; y < height; y++) {
        const lineOff = y * stride;
        for (let x = 0; x < width; x++) {
            const outIdx = pixelIdx * 4;
            if (colorType === 3) { // Indexed
                let palIdx = 0;
                if (bitDepth === 8) {
                    palIdx = scanlines[lineOff + x];
                } else if (bitDepth === 4) {
                    const byteVal = scanlines[lineOff + (x >> 1)];
                    palIdx = (x & 1) === 0 ? ((byteVal >> 4) & 0x0F) : (byteVal & 0x0F);
                } else if (bitDepth === 2) {
                    const byteVal = scanlines[lineOff + (x >> 2)];
                    palIdx = (byteVal >> (6 - (x & 3) * 2)) & 0x03;
                } else if (bitDepth === 1) {
                    const byteVal = scanlines[lineOff + (x >> 3)];
                    palIdx = (byteVal >> (7 - (x & 7))) & 0x01;
                }

                if (palette) {
                    const pOff = palIdx * 3;
                    out[outIdx] = palette[pOff];
                    out[outIdx + 1] = palette[pOff + 1];
                    out[outIdx + 2] = palette[pOff + 2];
                }
                out[outIdx + 3] = trns && palIdx < trns.length && trns[palIdx] !== undefined ? trns[palIdx] : 255;
            } else if (colorType === 6) { // RGBA
                const idx = lineOff + x * 4;
                out[outIdx] = scanlines[idx];
                out[outIdx + 1] = scanlines[idx + 1];
                out[outIdx + 2] = scanlines[idx + 2];
                out[outIdx + 3] = scanlines[idx + 3];
            } else if (colorType === 2) { // RGB
                const idx = lineOff + x * 3;
                out[outIdx] = scanlines[idx];
                out[outIdx + 1] = scanlines[idx + 1];
                out[outIdx + 2] = scanlines[idx + 2];
                out[outIdx + 3] = 255;
            }
            pixelIdx++;
        }
    }

    // If running in browser with document, create canvas
    if (typeof document !== 'undefined' && document.createElement) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const imgData = new ImageData(new Uint8ClampedArray(out.buffer, out.byteOffset, out.byteLength), width, height);
        ctx.putImageData(imgData, 0, 0);
        return { width, height, canvas, rgba: out };
    }

    return { width, height, canvas: null, rgba: out };
}
