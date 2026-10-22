"""
Generates the 3 aesthetic options for The Nightmare Before Christmas:
- Demo 1: Authentic Crisp Gothic Pixel Art (Zero-Smoothing Integer HD)
- Demo 2: Clean Edge-Vector / Algorithmic Smart Interpolation (Scale2x with Facial Protection)
- Demo 3: Tim Burton Claymation / Gothic Remaster (Deep gothic contrast, ink lines, bone highlights)
"""

import os
import json
import cv2
import numpy as np
from PIL import Image

def process_tile_demo1(img_pil):
    # Authentic 2x nearest-neighbor
    return img_pil.resize((40, 40), Image.Resampling.NEAREST)

def process_sprite_demo1(img_pil):
    # Authentic 2x nearest-neighbor
    return img_pil.resize((74, 74), Image.Resampling.NEAREST)

def scale2x_numpy(arr):
    h, w, c = arr.shape
    out = np.zeros((h*2, w*2, c), dtype=np.uint8)
    for y in range(h):
        for x in range(w):
            p = arr[y, x]
            a = arr[max(0, y-1), x]
            b = arr[y, min(w-1, x+1)]
            c_pix = arr[y, max(0, x-1)]
            d = arr[min(h-1, y+1), x]

            e0 = c_pix if (np.array_equal(c_pix, a) and not np.array_equal(c_pix, d) and not np.array_equal(a, b)) else p
            e1 = b if (np.array_equal(a, b) and not np.array_equal(a, c_pix) and not np.array_equal(b, d)) else p
            e2 = c_pix if (np.array_equal(d, c_pix) and not np.array_equal(d, b) and not np.array_equal(c_pix, a)) else p
            e3 = b if (np.array_equal(b, d) and not np.array_equal(b, a) and not np.array_equal(d, c_pix)) else p

            out[y*2, x*2] = e0
            out[y*2, x*2+1] = e1
            out[y*2+1, x*2] = e2
            out[y*2+1, x*2+1] = e3
    return out

def process_tile_demo2(img_pil):
    arr = np.array(img_pil)
    scaled = scale2x_numpy(arr)
    return Image.fromarray(scaled, 'RGBA')

def process_sprite_demo2(img_pil):
    arr = np.array(img_pil)
    scaled = scale2x_numpy(arr)
    # Face & fine-feature protection: preserve sharp pixels on high-contrast internal details
    # (prevents Jack's eyes/mouth and monster grimaces from turning into round waxy circles)
    h, w, _ = arr.shape
    for y in range(h):
        for x in range(w):
            p = arr[y, x]
            if p[3] > 0:
                lum = int(p[0]) + int(p[1]) + int(p[2])
                # If dark feature (eyes, mouth, nostril, stitch)
                if lum < 90:
                    scaled[y*2:y*2+2, x*2:x*2+2] = p
    return Image.fromarray(scaled, 'RGBA')

def process_tile_demo3(img_pil):
    # Gothic stone & wood: deepened crevices and aged gothic texture
    arr = np.array(img_pil.resize((40, 40), Image.Resampling.NEAREST)).astype(np.float32)
    alpha = arr[:, :, 3] > 0
    # Contrast curve
    for ch in range(3):
        norm = arr[:, :, ch] / 255.0
        contrast = np.where(norm > 0.45, 1.0 - (1.0 - norm)**1.3, norm**1.5)
        arr[:, :, ch] = contrast * 255.0

    # Mild edge ink shading on tiles
    gray = cv2.cvtColor(arr.astype(np.uint8), cv2.COLOR_RGBA2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    edge_mask = (edges > 0) & alpha
    for ch in range(3):
        arr[:, :, ch][edge_mask] = np.maximum(0, arr[:, :, ch][edge_mask] * 0.4)

    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGBA')

def process_sprite_demo3(img_pil):
    # Tim Burton Claymation Remaster:
    # High-contrast sunken eye sockets, bone highlights, dramatic Burton ink line accents
    arr = np.array(img_pil.resize((74, 74), Image.Resampling.NEAREST)).astype(np.float32)
    alpha = arr[:, :, 3] > 0

    # Gothic S-curve: deep blacks, accentuated bone highlights
    for ch in range(3):
        norm = arr[:, :, ch] / 255.0
        contrast = np.where(norm > 0.5, 1.0 - (1.0 - norm)**1.4, norm**1.6)
        arr[:, :, ch] = contrast * 255.0

    # Extract signature Tim Burton ink sketch outlines
    gray = cv2.cvtColor(arr.astype(np.uint8), cv2.COLOR_RGBA2GRAY)
    edges = cv2.Canny(gray, 35, 110)
    kernel = np.ones((2, 2), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=1)
    edge_mask = (edges > 0) & alpha

    # Ink lines
    for ch in range(3):
        arr[:, :, ch][edge_mask] = np.maximum(0, arr[:, :, ch][edge_mask] * 0.3)

    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGBA')


def generate_demo(demo_id, tile_fn, sprite_fn):
    print(f"\n================ GENERATING {demo_id.upper()} ================")
    tiles_in = "scratch/sliced_tiles"
    sprites_in = "scratch/sliced_sprites"

    out_tiles_dir = f"scratch/{demo_id}_tiles"
    out_sprites_dir = f"scratch/{demo_id}_sprites"
    os.makedirs(out_tiles_dir, exist_ok=True)
    os.makedirs(out_sprites_dir, exist_ok=True)

    # Copy manifest
    with open(os.path.join(tiles_in, "manifest.json")) as f:
        t_manifest = json.load(f)
    with open(os.path.join(sprites_in, "manifest.json")) as f:
        s_manifest = json.load(f)

    # Process tiles
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

    # Process sprites
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

    # Reassemble sheets
    from reassemble_atlas import reassemble_sheet
    target_tile_sheet = f"assets/16x16TileSet_{demo_id}.png"
    target_sprite_sheet = f"assets/32x32TileSet_{demo_id}.png"

    reassemble_sheet(out_tiles_dir, target_tile_sheet, scale=2)
    reassemble_sheet(out_sprites_dir, target_sprite_sheet, scale=2, target_width=888, target_height=888)
    print(f"Generated {target_tile_sheet} and {target_sprite_sheet}!")

if __name__ == "__main__":
    import sys
    sys.path.append("tools")
    generate_demo("demo1", process_tile_demo1, process_sprite_demo1)
    generate_demo("demo2", process_tile_demo2, process_sprite_demo2)
    generate_demo("demo3", process_tile_demo3, process_sprite_demo3)
