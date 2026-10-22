"""
Generates 3 TRUE HIGH-RES PIXEL-ART Options for The Nightmare Before Christmas:
- Demo 1: 32-Bit Dark Gothic (Castlevania: SotN / Blasphemous) - Stitched teeth, pinstripes, chiseled stone
- Demo 2: 90s Capcom / Neo-Geo Arcade (Darkstalkers / Metal Slug) - Bold 1px ink outlines, punchy cell shading
- Demo 3: Modern Indie Micro-Pixel (Eastward / Sea of Stars) - 1px micro-dithering, moonlit highlights, rich texture
ALL 100% HARD-EDGED SQUARE PIXELS. ZERO CLAY. ZERO SMOOTHING. ZERO BLUR.
"""

import os
import json
import numpy as np
from PIL import Image

# -------------------------------------------------------------
# DEMO 1: 32-Bit Dark Gothic High-Res Pixel Art (SotN / Blasphemous)
# -------------------------------------------------------------
def process_tile_demo1(img_pil):
    w, h = img_pil.size
    arr = np.array(img_pil.resize((w*2, h*2), Image.Resampling.NEAREST).convert('RGBA'))
    for y in range(h*2):
        for x in range(w*2):
            p = arr[y, x]
            if p[3] == 0: continue
            lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
            # Micro-chisel highlights on stone block edges
            if (x % 4 == 0 or y % 4 == 0) and lum > 80:
                arr[y, x, :3] = np.clip(arr[y, x, :3] * 1.25, 0, 255)
            # Fine 1px mortar line fractures
            elif (x % 8 == 0 or y % 8 == 0) and lum < 120:
                arr[y, x, :3] = np.clip(arr[y, x, :3] * 0.65, 0, 255)
    return Image.fromarray(arr)

def process_sprite_demo1(img_pil):
    w, h = img_pil.size
    arr = np.array(img_pil.resize((w*2, h*2), Image.Resampling.NEAREST).convert('RGBA'))

    # 1. Stitches on mouth (for Jack's face)
    for y in range(2, h*2 - 2):
        for x in range(2, w*2 - 2):
            p = arr[y, x]
            if p[3] > 200 and (int(p[0]) + int(p[1]) + int(p[2])) < 70:
                up_white = arr[y-1, x, 0] > 160 and arr[y-1, x, 3] > 200
                dn_white = arr[y+1, x, 0] > 160 and arr[y+1, x, 3] > 200
                if up_white and dn_white:
                    if x % 2 == 0:
                        arr[y-1, x] = [15, 15, 20, 255]
                        arr[y+1, x] = [15, 15, 20, 255]

    # 2. 1px Chalk pinstripes on dark coat
    for y in range(h*2):
        for x in range(w*2):
            p = arr[y, x]
            lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
            if p[3] > 200 and lum < 45 and y > 28:
                if x % 3 == 0:
                    arr[y, x] = [58, 64, 88, 255]

    # 3. Eye socket inner shadow rim
    for y in range(4, h*2 - 4):
        for x in range(4, w*2 - 4):
            p = arr[y, x]
            if p[3] > 200 and (int(p[0]) + int(p[1]) + int(p[2])) < 35 and y < 30:
                if arr[y-1, x, 0] > 150 or arr[y+1, x, 0] > 150 or arr[y, x-1, 0] > 150 or arr[y, x+1, 0] > 150:
                    arr[y, x] = [40, 42, 58, 255]

    return Image.fromarray(arr)


# -------------------------------------------------------------
# DEMO 2: 90s Capcom / Neo-Geo Arcade High-Res Pixel Art
# -------------------------------------------------------------
def process_tile_demo2(img_pil):
    w, h = img_pil.size
    arr = np.array(img_pil.resize((w*2, h*2), Image.Resampling.NEAREST).convert('RGBA'))
    for y in range(h*2):
        for x in range(w*2):
            if arr[y, x, 3] == 0: continue
            lum = 0.299 * arr[y, x, 0] + 0.587 * arr[y, x, 1] + 0.114 * arr[y, x, 2]
            if lum > 160:
                arr[y, x, :3] = np.clip(arr[y, x, :3] * 1.15, 0, 255)
            elif lum < 80:
                arr[y, x, :3] = np.clip(arr[y, x, :3] * 0.82, 0, 255)
    return Image.fromarray(arr)

def process_sprite_demo2(img_pil):
    w, h = img_pil.size
    arr = np.array(img_pil.resize((w*2, h*2), Image.Resampling.NEAREST).convert('RGBA'))
    for y in range(h*2):
        for x in range(w*2):
            if arr[y, x, 3] == 0: continue
            is_edge = False
            for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
                ny, nx = y + dy, x + dx
                if 0 <= ny < h*2 and 0 <= nx < w*2:
                    if arr[ny, nx, 3] == 0:
                        is_edge = True
                        break
                else:
                    is_edge = True
                    break
            if is_edge:
                # 1px bold arcade ink outline
                arr[y, x] = [12, 12, 18, 255]
            else:
                lum = 0.299 * arr[y, x, 0] + 0.587 * arr[y, x, 1] + 0.114 * arr[y, x, 2]
                if lum > 170:
                    arr[y, x, :3] = np.clip(arr[y, x, :3] * 1.18, 0, 255)
                elif 50 < lum < 120:
                    arr[y, x, :3] = np.clip(arr[y, x, :3] * 0.82, 0, 255)
    return Image.fromarray(arr)


# -------------------------------------------------------------
# DEMO 3: Modern Indie Micro-Pixel Art (Eastward / Sea of Stars)
# -------------------------------------------------------------
def process_tile_demo3(img_pil):
    w, h = img_pil.size
    arr = np.array(img_pil.resize((w*2, h*2), Image.Resampling.NEAREST).convert('RGBA'))
    for y in range(h*2):
        for x in range(w*2):
            p = arr[y, x]
            if p[3] == 0: continue
            lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
            # High-res micro-dither texture on stone & grass
            if 35 < lum < 155:
                if (x + y) % 2 == 0:
                    arr[y, x, :3] = np.clip(arr[y, x, :3] * 1.14, 0, 255)
                else:
                    arr[y, x, :3] = np.clip(arr[y, x, :3] * 0.86, 0, 255)
            elif lum > 165:
                # Top stone rim highlight
                if y % 2 == 0:
                    arr[y, x, :3] = np.clip(arr[y, x, :3] * 1.15, 0, 255)
    return Image.fromarray(arr)

def process_sprite_demo3(img_pil):
    w, h = img_pil.size
    arr = np.array(img_pil.resize((w*2, h*2), Image.Resampling.NEAREST).convert('RGBA'))
    for y in range(h*2):
        for x in range(w*2):
            p = arr[y, x]
            if p[3] == 0: continue
            lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
            if 40 < lum < 150:
                # Micro-dither on cloth and skin shading
                if (x + y) % 2 == 0:
                    arr[y, x, :3] = np.clip(arr[y, x, :3] * 1.12, 0, 255)
                else:
                    arr[y, x, :3] = np.clip(arr[y, x, :3] * 0.88, 0, 255)
            elif lum > 180:
                # Specular bone micro-highlight
                if y % 2 == 0 and x % 2 == 0:
                    arr[y, x] = [255, 255, 255, 255]
    return Image.fromarray(arr)


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
