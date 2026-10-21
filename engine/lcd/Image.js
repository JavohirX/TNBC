/**
 * Image.js
 * Implements javax.microedition.lcdui.Image backed by HTML5 Canvas / HTMLImageElement.
 */
import { Graphics } from "./Graphics.js";

export class Image {
    /**
     * @param {HTMLCanvasElement | HTMLImageElement | ImageBitmap} source
     */
    constructor(source) {
        this.source = source;
        this.width = source.width;
        this.height = source.height;
        this._graphics = null;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getGraphics() {
        if (!this._graphics) {
            if (!(this.source instanceof HTMLCanvasElement)) {
                // If it's an ImageElement, convert to Canvas so it's mutable
                const canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                ctx.drawImage(this.source, 0, 0);
                this.source = canvas;
            }
            const ctx = this.source.getContext("2d", { willReadFrequently: true });
            this._graphics = new Graphics(ctx, this.width, this.height);
        }
        return this._graphics;
    }

    getRGB(rgbData, offset, scanlength, x, y, width, height) {
        let canvas;
        if (this.source instanceof HTMLCanvasElement) {
            canvas = this.source;
        } else {
            canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(this.source, 0, 0);
        }
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const imgData = ctx.getImageData(x, y, width, height);
        const data = imgData.data;

        for (let row = 0; row < height; row++) {
            const rowOffset = offset + row * scanlength;
            for (let col = 0; col < width; col++) {
                const idx = (row * width + col) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const a = data[idx + 3];
                // 0xAARRGGBB format
                rgbData[rowOffset + col] = ((a << 24) | (r << 16) | (g << 8) | b) >>> 0;
            }
        }
    }

    /**
     * Creates an empty mutable image with given dimensions.
     */
    static createImage(width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        return new Image(canvas);
    }

    /**
     * Loads an image from a URL or relative path asynchronously.
     * @param {string} url
     * @returns {Promise<Image>}
     */
    static async loadFromUrl(url) {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(new Image(img));
            img.onerror = (err) => reject(new Error(`Failed to load image from ${url}: ${err}`));
            img.src = url;
        });
    }

    /**
     * Creates an image synchronously or asynchronously from byte array (PNG/JPEG).
     * @param {Uint8Array} bytes
     * @param {number} offset
     * @param {number} length
     * @returns {Promise<Image>}
     */
    static async createImageFromBytes(bytes, offset = 0, length = null) {
        const len = length !== null ? length : bytes.length - offset;
        const slice = bytes.subarray(offset, offset + len);
        const blob = new Blob([slice], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        try {
            const img = await Image.loadFromUrl(url);
            URL.revokeObjectURL(url);
            return img;
        } catch (e) {
            URL.revokeObjectURL(url);
            throw e;
        }
    }

    /**
     * Sub-region image extraction with optional transformation.
     */
    static createImageRegion(image, x, y, width, height, transform = 0) {
        const canvas = document.createElement("canvas");
        const isRotated = transform === 5 || transform === 6 || transform === 7 || transform === 4;
        canvas.width = isRotated ? height : width;
        canvas.height = isRotated ? width : height;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.imageSmoothingEnabled = false;

        // Apply J2ME transformations
        ctx.save();
        switch (transform) {
            case 2: // TRANS_MIRROR (Horizontal flip)
                ctx.translate(width, 0);
                ctx.scale(-1, 1);
                break;
            case 1: // TRANS_MIRROR_ROT180 (Vertical flip)
                ctx.translate(0, height);
                ctx.scale(1, -1);
                break;
            case 3: // TRANS_ROT180
                ctx.translate(width, height);
                ctx.rotate(Math.PI);
                break;
            case 5: // TRANS_ROT90
                ctx.translate(height, 0);
                ctx.rotate(Math.PI / 2);
                break;
            case 6: // TRANS_ROT270
                ctx.translate(0, width);
                ctx.rotate(-Math.PI / 2);
                break;
            case 7: // TRANS_MIRROR_ROT90
                ctx.translate(height, 0);
                ctx.rotate(Math.PI / 2);
                ctx.scale(-1, 1);
                break;
            case 4: // TRANS_MIRROR_ROT270
                ctx.translate(0, width);
                ctx.rotate(-Math.PI / 2);
                ctx.scale(-1, 1);
                break;
            default:
                break;
        }

        ctx.drawImage(image.source, x, y, width, height, 0, 0, width, height);
        ctx.restore();

        return new Image(canvas);
    }
}

