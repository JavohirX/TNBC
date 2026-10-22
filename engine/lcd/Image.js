/**
 * Image.js
 * Implements javax.microedition.lcdui.Image backed by HTML5 Canvas / HTMLImageElement.
 * Synchronous decoding via PNGDecoder.
 */
import { Graphics } from "./Graphics.js";
import { decodePNG } from "./PNGDecoder.js";

export class Image {
    static _preloadedImages = new Map();

    /**
     * @param {HTMLCanvasElement | HTMLImageElement | ImageBitmap | Object} source
     * @param {number} scale
     */
    constructor(source, scale = 1) {
        this.source = source;
        this.scale = scale;
        this.pixelWidth = source.width;
        this.pixelHeight = source.height;
        this.width = scale > 1 ? Math.floor(source.width / scale) : source.width;
        this.height = scale > 1 ? Math.floor(source.height / scale) : source.height;
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
            if (typeof document !== 'undefined' && !(this.source instanceof HTMLCanvasElement)) {
                // If it's an ImageElement, convert to Canvas so it's mutable
                const canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                ctx.drawImage(this.source, 0, 0);
                this.source = canvas;
            }
            if (this.source && this.source.getContext) {
                const ctx = this.source.getContext("2d", { willReadFrequently: true });
                this._graphics = new Graphics(ctx, this.width, this.height);
            } else {
                this._graphics = new Graphics(null, this.width, this.height);
            }
        }
        return this._graphics;
    }

    getRGB(rgbData, offset, scanlength, x, y, width, height) {
        if (typeof document === 'undefined') return;
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

    static cacheImage(path, img) {
        Image._preloadedImages.set(path, img);
        if (!path.startsWith('/')) Image._preloadedImages.set('/' + path, img);
        else Image._preloadedImages.set(path.substring(1), img);
    }

    static createImage(...args) {
        if (args.length === 1 && typeof args[0] === 'string') {
            const path = args[0];
            const cached = Image._preloadedImages.get(path) || 
                           Image._preloadedImages.get('/' + path) || 
                           Image._preloadedImages.get(path.startsWith('/') ? path.substring(1) : path);
            if (cached) {
                return cached;
            }
            if (typeof ResourceManager !== 'undefined' && ResourceManager.getResourceBytes) {
                const bytes = ResourceManager.getResourceBytes(path);
                if (bytes && bytes.length > 0) {
                    const decoded = decodePNG(bytes);
                    const img = new Image(decoded.canvas || decoded, 1);
                    Image.cacheImage(path, img);
                    return img;
                }
            }
            console.warn("createImage: Image not found in cache:", path);
            return Image.createImage(32, 32);
        }

        if (args.length === 2 && typeof args[0] === 'number') {
            const [width, height] = args;
            if (typeof document !== 'undefined' && document.createElement) {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, width, height);
                return new Image(canvas);
            }
            return new Image({ width, height });
        }

        if (args[0] instanceof Uint8Array || args[0] instanceof Int8Array || Array.isArray(args[0]) || (args[0] && args[0].buffer)) {
            const rawBytes = args[0] instanceof Uint8Array ? args[0] : new Uint8Array(args[0].buffer || args[0]);
            const offset = args[1] !== undefined ? args[1] : 0;
            const length = args[2] !== undefined ? args[2] : (rawBytes.length - offset);
            const scale = typeof args[3] === 'number' ? args[3] : 1;
            const decoded = decodePNG(rawBytes, offset, length);
            return new Image(decoded.canvas || decoded, scale);
        }

        if (args.length >= 5 && args[0] instanceof Image) {
            return Image.createImageRegion(args[0], args[1], args[2], args[3], args[4], args[5] || 0);
        }

        return Image.createImage(32, 32);
    }

    /**
     * Loads an image from a URL or relative path asynchronously.
     * @param {string} url
     * @returns {Promise<Image>}
     */
    static async loadFromUrl(url) {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined') {
                resolve(new Image({ width: 32, height: 32 }));
                return;
            }
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(new Image(img));
            img.onerror = (err) => reject(new Error(`Failed to load image from ${url}: ${err}`));
            img.src = url;
        });
    }

    /**
     * Sub-region image extraction with optional transformation.
     */
    static createImageRegion(image, x, y, width, height, transform = 0) {
        if (typeof document === 'undefined') {
            return new Image({ width, height });
        }
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

        if (image.source) {
            ctx.drawImage(image.source, x, y, width, height, 0, 0, width, height);
        }
        ctx.restore();

        return new Image(canvas);
    }
}
