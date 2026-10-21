/**
 * PNGDecoder.js
 * Synchronous pure JavaScript PNG decoder for J2ME runtime.
 * Decodes PNG byte arrays synchronously into Canvas / ImageData.
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
    const view = new DataView(bytes.buffer, bytes.byteOffset + offset, len);
    
    let pos = 8; // skip 8-byte signature
    let width = 0, height = 0, bitDepth = 0, colorType = 0;
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
        const dataPos = bytes.byteOffset + offset + pos + 8;

        if (type === 'IHDR') {
            width = view.getUint32(pos + 8, false);
            height = view.getUint32(pos + 12, false);
            bitDepth = view.getUint8(pos + 16);
            colorType = view.getUint8(pos + 17);
        } else if (type === 'PLTE') {
            palette = new Uint8Array(bytes.buffer, dataPos, chunkLen);
        } else if (type === 'tRNS') {
            trns = new Uint8Array(bytes.buffer, dataPos, chunkLen);
        } else if (type === 'IDAT') {
            idatChunks.push(new Uint8Array(bytes.buffer, dataPos, chunkLen));
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
    const bpp = colorType === 6 ? 4 : (colorType === 2 ? 3 : 1);
    const stride = width * bpp;
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
                const palIdx = scanlines[lineOff + x];
                if (palette) {
                    out[outIdx] = palette[palIdx * 3];
                    out[outIdx + 1] = palette[palIdx * 3 + 1];
                    out[outIdx + 2] = palette[palIdx * 3 + 2];
                }
                out[outIdx + 3] = trns && trns[palIdx] !== undefined ? trns[palIdx] : 255;
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
