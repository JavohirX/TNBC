/**
 * Graphics.js
 * Implements javax.microedition.lcdui.Graphics mapped to HTML5 CanvasRenderingContext2D.
 */
export class Graphics {
    // J2ME Anchor Constants
    static HCENTER = 1;
    static VCENTER = 2;
    static LEFT = 4;
    static RIGHT = 8;
    static TOP = 16;
    static BOTTOM = 32;
    static BASELINE = 64;

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     */
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;

        this.transX = 0;
        this.transY = 0;

        this.clipX = 0;
        this.clipY = 0;
        this.clipW = width;
        this.clipH = height;

        this.currentColor = 0x000000;
        this.ctx.imageSmoothingEnabled = false;
    }

    setColor(r, g, b) {
        if (g === undefined && b === undefined) {
            // Single integer RGB: 0xRRGGBB
            this.currentColor = r & 0xFFFFFF;
            const hex = ("000000" + this.currentColor.toString(16)).slice(-6);
            this.ctx.fillStyle = "#" + hex;
            this.ctx.strokeStyle = "#" + hex;
        } else {
            this.currentColor = ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
            this.ctx.fillStyle = `rgb(${r & 0xFF},${g & 0xFF},${b & 0xFF})`;
            this.ctx.strokeStyle = `rgb(${r & 0xFF},${g & 0xFF},${b & 0xFF})`;
        }
    }

    getColor() {
        return this.currentColor;
    }

    setClip(x, y, w, h) {
        this.clipX = x;
        this.clipY = y;
        this.clipW = w;
        this.clipH = h;

        // Reset canvas clip
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(this.transX, this.transY);
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.clip();
        this.ctx.imageSmoothingEnabled = false;
    }

    clipRect(x, y, w, h) {
        const x1 = Math.max(this.clipX, x);
        const y1 = Math.max(this.clipY, y);
        const x2 = Math.min(this.clipX + this.clipW, x + w);
        const y2 = Math.min(this.clipY + this.clipH, y + h);
        this.setClip(x1, y1, Math.max(0, x2 - x1), Math.max(0, y2 - y1));
    }

    getClipX() { return this.clipX; }
    getClipY() { return this.clipY; }
    getClipWidth() { return this.clipW; }
    getClipHeight() { return this.clipH; }

    translate(x, y) {
        this.transX += x;
        this.transY += y;
        this.ctx.translate(x, y);
    }

    getTranslateX() { return this.transX; }
    getTranslateY() { return this.transY; }

    fillRect(x, y, w, h) {
        this.ctx.fillRect(x, y, w, h);
    }

    drawRect(x, y, w, h) {
        this.ctx.strokeRect(x + 0.5, y + 0.5, w, h);
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
        this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
        this.ctx.stroke();
    }

    drawRoundRect(x, y, w, h, rx, ry) {
        this.ctx.beginPath();
        this.ctx.roundRect(x + 0.5, y + 0.5, w, h, Math.min(rx, ry));
        this.ctx.stroke();
    }

    fillRoundRect(x, y, w, h, rx, ry) {
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, w, h, Math.min(rx, ry));
        this.ctx.fill();
    }

    drawString(str, x, y, anchor = 20) {
        if (!str) return;
        this.ctx.save();
        let ax = x;
        let ay = y;

        if (anchor & Graphics.HCENTER) this.ctx.textAlign = "center";
        else if (anchor & Graphics.RIGHT) this.ctx.textAlign = "right";
        else this.ctx.textAlign = "left";

        if (anchor & Graphics.BOTTOM) this.ctx.textBaseline = "bottom";
        else if (anchor & Graphics.VCENTER) this.ctx.textBaseline = "middle";
        else this.ctx.textBaseline = "top";

        this.ctx.fillText(str, ax, ay);
        this.ctx.restore();
    }

    drawImage(image, x, y, anchor = 20) {
        if (!image || !image.source) return;
        const w = image.getWidth();
        const h = image.getHeight();
        let dx = x;
        let dy = y;

        if (anchor & Graphics.HCENTER) dx -= Math.floor(w / 2);
        else if (anchor & Graphics.RIGHT) dx -= w;

        if (anchor & Graphics.BOTTOM) dy -= h;
        else if (anchor & Graphics.VCENTER) dy -= Math.floor(h / 2);

        this.ctx.drawImage(image.source, dx, dy);
    }

    /**
     * drawRegion: Draws a sub-rectangle of an image with transform.
     */
    drawRegion(image, x_src, y_src, width, height, transform, x_dest, y_dest, anchor = 20) {
        if (!image || !image.source || width <= 0 || height <= 0) return;

        let w = width;
        let h = height;
        const isRotated = transform === 5 || transform === 6 || transform === 7 || transform === 4;
        if (isRotated) {
            w = height;
            h = width;
        }

        let dx = x_dest;
        let dy = y_dest;
        if (anchor & Graphics.HCENTER) dx -= Math.floor(w / 2);
        else if (anchor & Graphics.RIGHT) dx -= w;

        if (anchor & Graphics.BOTTOM) dy -= h;
        else if (anchor & Graphics.VCENTER) dy -= Math.floor(h / 2);

        if (transform === 0) {
            // Direct blit
            this.ctx.drawImage(image.source, x_src, y_src, width, height, dx, dy, width, height);
            return;
        }

        // Transformed blit
        this.ctx.save();
        this.ctx.translate(dx, dy);

        switch (transform) {
            case 2: // TRANS_MIRROR
                this.ctx.translate(w, 0);
                this.ctx.scale(-1, 1);
                break;
            case 1: // TRANS_MIRROR_ROT180
                this.ctx.translate(0, h);
                this.ctx.scale(1, -1);
                break;
            case 3: // TRANS_ROT180
                this.ctx.translate(w, h);
                this.ctx.rotate(Math.PI);
                break;
            case 5: // TRANS_ROT90
                this.ctx.translate(w, 0);
                this.ctx.rotate(Math.PI / 2);
                break;
            case 6: // TRANS_ROT270
                this.ctx.translate(0, h);
                this.ctx.rotate(-Math.PI / 2);
                break;
            case 7: // TRANS_MIRROR_ROT90
                this.ctx.translate(w, 0);
                this.ctx.rotate(Math.PI / 2);
                this.ctx.scale(-1, 1);
                break;
            case 4: // TRANS_MIRROR_ROT270
                this.ctx.translate(0, h);
                this.ctx.rotate(-Math.PI / 2);
                this.ctx.scale(-1, 1);
                break;
        }

        this.ctx.drawImage(image.source, x_src, y_src, width, height, 0, 0, width, height);
        this.ctx.restore();
    }
}

