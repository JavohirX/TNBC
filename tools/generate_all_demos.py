"""
Generates the 3 TRUE PIXEL-ART Focused Demos for The Nightmare Before Christmas:
- Demo 1: Authentic xBR 2x (Clean Pixel-Art Pattern Interpolator, 100% Palette Preserved, Zero Blur)
- Demo 2: 16-Bit Deluxe Pixel Art (SNES / GBA / Neo-Geo Style with 2x2 Cluster Dithering & Bone Highlights)
- Demo 3: Authentic Nokia TFT Subpixel Matrix (Physical Hardware Pixel Aperture & Tactile LCD Separation)
"""

import os
import json
import numpy as np
from PIL import Image

# -------------------------------------------------------------
# DEMO 1: Authentic xBR 2x (Pixel-Art Pattern Interpolator)
# -------------------------------------------------------------
def rgb_dist(c1, c2):
    if c1[3] == 0 and c2[3] == 0:
        return 0
    if (c1[3] == 0) != (c2[3] == 0):
        return 100000.0
    dr = int(c1[0]) - int(c2[0])
    dg = int(c1[1]) - int(c2[1])
    db = int(c1[2]) - int(c2[2])
    da = int(c1[3]) - int(c2[3])
    y = 0.299 * dr + 0.587 * dg + 0.114 * db
    u = -0.14713 * dr - 0.28886 * dg + 0.436 * db
    v = 0.615 * dr - 0.51499 * dg - 0.10001 * db
    return 48.0 * abs(y) + 7.0 * abs(u) + 6.0 * abs(v) + 48.0 * abs(da)

def xbr2x(img_pil):
    src = np.array(img_pil.convert('RGBA'))
    h, w, c = src.shape
    out = np.zeros((h * 2, w * 2, c), dtype=np.uint8)

    # Pad by 2 pixels on all sides
    pad = np.pad(src, ((2, 2), (2, 2), (0, 0)), mode='edge')

    for y in range(h):
        for x in range(w):
            py = y + 2
            px = x + 2

            A = pad[py-1, px-1]
            B = pad[py-1, px]
            C = pad[py-1, px+1]
            D = pad[py, px-1]
            E = pad[py, px]
            F = pad[py, px+1]
            G = pad[py+1, px-1]
            H = pad[py+1, px]
            I = pad[py+1, px+1]

            e0, e1, e2, e3 = E, E, E, E

            # Bottom-Right (e3)
            nl1 = rgb_dist(E, G) + rgb_dist(E, C) + rgb_dist(A, H) + rgb_dist(I, F) + 4 * rgb_dist(F, H)
            nl2 = rgb_dist(D, B) + rgb_dist(D, I) + rgb_dist(H, A) + rgb_dist(F, C) + 4 * rgb_dist(B, D)
            if nl1 < nl2 and not np.array_equal(F, H):
                if not np.array_equal(E, F) and not np.array_equal(E, H):
                    e3 = F if rgb_dist(E, F) < rgb_dist(E, H) else H

            # Top-Right (e1)
            nr1 = rgb_dist(E, A) + rgb_dist(E, I) + rgb_dist(G, B) + rgb_dist(C, F) + 4 * rgb_dist(B, F)
            nr2 = rgb_dist(D, H) + rgb_dist(D, C) + rgb_dist(B, G) + rgb_dist(F, I) + 4 * rgb_dist(D, H)
            if nr1 < nr2 and not np.array_equal(B, F):
                if not np.array_equal(E, B) and not np.array_equal(E, F):
                    e1 = B if rgb_dist(E, B) < rgb_dist(E, F) else F

            # Bottom-Left (e2)
            nb1 = rgb_dist(E, A) + rgb_dist(E, I) + rgb_dist(C, H) + rgb_dist(G, D) + 4 * rgb_dist(D, H)
            nb2 = rgb_dist(F, B) + rgb_dist(F, G) + rgb_dist(H, C) + rgb_dist(D, A) + 4 * rgb_dist(B, F)
            if nb1 < nb2 and not np.array_equal(D, H):
                if not np.array_equal(E, D) and not np.array_equal(E, H):
                    e2 = D if rgb_dist(E, D) < rgb_dist(E, H) else H

            # Top-Left (e0)
            nt1 = rgb_dist(E, G) + rgb_dist(E, C) + rgb_dist(I, B) + rgb_dist(A, D) + 4 * rgb_dist(D, B)
            nt2 = rgb_dist(F, H) + rgb_dist(F, A) + rgb_dist(B, I) + rgb_dist(D, G) + 4 * rgb_dist(F, H)
            if nt1 < nt2 and not np.array_equal(D, B):
                if not np.array_equal(E, D) and not np.array_equal(E, B):
                    e0 = D if rgb_dist(E, D) < rgb_dist(E, B) else B

            out[y*2, x*2] = e0
            out[y*2, x*2+1] = e1
            out[y*2+1, x*2] = e2
            out[y*2+1, x*2+1] = e3

    return Image.fromarray(out)

def process_tile_demo1(img):
    return xbr2x(img)

def process_sprite_demo1(img):
    return xbr2x(img)


# -------------------------------------------------------------
# DEMO 2: 16-Bit Deluxe Pixel Art (SNES / GBA / Neo-Geo Style)
# -------------------------------------------------------------
def deluxe_pixel_art(img_pil, is_sprite=True):
    src = np.array(img_pil.convert('RGBA'))
    h, w, c = src.shape
    scaled = np.array(img_pil.resize((w*2, h*2), Image.Resampling.NEAREST).convert('RGBA'))

    # Bayer 2x2 ordered dither matrix
    bayer = np.array([[0, 2], [3, 1]], dtype=np.float32) / 4.0

    for y in range(h*2):
        for x in range(w*2):
            p = scaled[y, x]
            if p[3] == 0:
                continue

            orig_y = y // 2
            orig_x = x // 2

            up = src[max(0, orig_y - 1), orig_x]
            dn = src[min(h - 1, orig_y + 1), orig_x]
            lf = src[orig_y, max(0, orig_x - 1)]
            rt = src[orig_y, min(w - 1, orig_x + 1)]

            dither_val = bayer[y % 2, x % 2]
            lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]

            # Bone specular highlight / shading on Jack & skeletons
            if lum > 175 and p[3] > 0:
                if (x % 2 == 0 and y % 2 == 0) and (orig_y > 0 and src[orig_y-1, orig_x][3] == 0 or lum > 215):
                    scaled[y, x] = [255, 255, 255, 255] # 1px specular pixel
                elif lum < 210 and dither_val > 0.5:
                    scaled[y, x] = [205, 210, 225, 255]

            # Tile cobblestone & brick shadow dithering
            elif 35 < lum < 145:
                is_boundary = not (np.array_equal(p, up) and np.array_equal(p, dn) and np.array_equal(p, lf) and np.array_equal(p, rt))
                if is_boundary and dither_val >= 0.5:
                    scaled[y, x] = [int(p[0]*0.72), int(p[1]*0.72), int(p[2]*0.78), p[3]]

    # Strict palette quantization (discrete 16-bit color ramps, zero continuous gradients)
    out_arr = scaled.copy()
    for ch in range(3):
        out_arr[:, :, ch] = (np.round(out_arr[:, :, ch] / 28.0) * 28.0).clip(0, 255).astype(np.uint8)

    return Image.fromarray(out_arr)

def process_tile_demo2(img):
    return deluxe_pixel_art(img, is_sprite=False)

def process_sprite_demo2(img):
    return deluxe_pixel_art(img, is_sprite=True)


# -------------------------------------------------------------
# DEMO 3: Authentic Nokia TFT Subpixel Matrix (Hardware Pixel Aperture)
# -------------------------------------------------------------
def nokia_lcd_pixel_matrix(img_pil):
    w, h = img_pil.size
    scaled = np.array(img_pil.resize((w*2, h*2), Image.Resampling.NEAREST).convert('RGBA')).astype(np.float32)

    for y in range(h*2):
        for x in range(w*2):
            if scaled[y, x, 3] == 0:
                continue

            # Physical LCD subpixel matrix:
            # (1,1) corner is the transistor shadow gap between physical liquid crystals
            if (x % 2 == 1 and y % 2 == 1):
                scaled[y, x, :3] *= 0.62
            elif (x % 2 == 1 or y % 2 == 1):
                scaled[y, x, :3] *= 0.86
            else:
                # Core subpixel: vibrant phosphor punch
                scaled[y, x, :3] = np.clip(scaled[y, x, :3] * 1.08, 0, 255)

    out = np.clip(scaled, 0, 255).astype(np.uint8)
    return Image.fromarray(out)

def process_tile_demo3(img):
    return nokia_lcd_pixel_matrix(img)

def process_sprite_demo3(img):
    return nokia_lcd_pixel_matrix(img)


# -------------------------------------------------------------
# PIPELINE RUNNER
# -------------------------------------------------------------
def generate_demo(demo_id, tile_fn, sprite_fn):
    print(f"\n================ GENERATING {demo_id.upper()} ================")
    tiles_in = "scratch/sliced_tiles"
    sprites_in = "scratch/sliced_sprites"

    out_tiles_dir = f"scratch/{demo_id}_tiles"
    out_sprites_dir = f"scratch/{demo_id}_sprites"
    os.makedirs(out_tiles_dir, exist_ok=True)
    os.makedirs(out_sprites_dir, exist_ok=True)

    with open(os.path.join(tiles_in, "manifest.json")) as f:
        t_manifest = json.load(f)
    with open(os.path.join(sprites_in, "manifest.json")) as f:
        s_manifest = json.load(f)

    for item in t_manifest["items"]:
        fname = item["filename"]
        inp = os.path.join(tiles_in, fname)
        outp = os.path.join(out_tiles_dir, fname)
        if os.path.exists(inp):
            im = Image.open(inp).convert("RGBA")
            proc = tile_fn(im)
            proc.save(outp, "PNG")

    with open(os.path.join(out_tiles_dir, "manifest.json"), "w") as f:
        json.dump(t_manifest, f, indent=2)

    for item in s_manifest["items"]:
        fname = item["filename"]
        inp = os.path.join(sprites_in, fname)
        outp = os.path.join(out_sprites_dir, fname)
        if os.path.exists(inp):
            im = Image.open(inp).convert("RGBA")
            proc = sprite_fn(im)
            proc.save(outp, "PNG")

    with open(os.path.join(out_sprites_dir, "manifest.json"), "w") as f:
        json.dump(s_manifest, f, indent=2)

    from reassemble_atlas import reassemble_sheet
    target_tile_sheet = f"assets/16x16TileSet_{demo_id}.png"
    target_tile_sheet_2x = f"assets/16x16TileSet_{demo_id}_2x.png"
    target_sprite_sheet = f"assets/32x32TileSet_{demo_id}.png"
    target_sprite_sheet_2x = f"assets/32x32TileSet_{demo_id}_2x.png"

    sheet_tiles = reassemble_sheet(out_tiles_dir, target_tile_sheet, scale=2)
    sheet_tiles.save(target_tile_sheet_2x, "PNG")

    sheet_sprites = reassemble_sheet(out_sprites_dir, target_sprite_sheet, scale=2, target_width=888, target_height=888)
    sheet_sprites.save(target_sprite_sheet_2x, "PNG")
    print(f"Generated {target_tile_sheet} and {target_sprite_sheet} (with _2x duplicates) successfully!")

if __name__ == "__main__":
    import sys
    sys.path.append("tools")
    generate_demo("demo1", process_tile_demo1, process_sprite_demo1)
    generate_demo("demo2", process_tile_demo2, process_sprite_demo2)
    generate_demo("demo3", process_tile_demo3, process_sprite_demo3)
