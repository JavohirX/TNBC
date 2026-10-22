"""
Atlas Reassembler for The Nightmare Before Christmas (J2ME)
Stitches individual upscaled PNGs back into full sprite sheets at exact integer coordinates.
"""

import os
import json
from PIL import Image

def reassemble_sheet(sliced_dir, out_file, scale=2, target_width=None, target_height=None):
    manifest_path = os.path.join(sliced_dir, "manifest.json")
    if not os.path.exists(manifest_path):
        raise FileNotFoundError(f"Missing {manifest_path}")

    with open(manifest_path, "r") as f:
        manifest = json.load(f)

    cols = manifest["cols"]
    rows = manifest["rows"]
    base_tw = manifest["tile_w"]
    base_th = manifest["tile_h"]

    tw = base_tw * scale
    th = base_th * scale

    full_w = target_width if target_width is not None else (cols * tw)
    full_h = target_height if target_height is not None else (rows * th)

    sheet = Image.new("RGBA", (full_w, full_h), (0, 0, 0, 0))

    for item in manifest["items"]:
        col = item["col"]
        row = item["row"]
        filename = item["filename"]
        img_path = os.path.join(sliced_dir, filename)

        if not os.path.exists(img_path):
            continue

        cell_img = Image.open(img_path).convert("RGBA")
        if cell_img.size != (tw, th):
            cell_img = cell_img.resize((tw, th), Image.Resampling.NEAREST)

        x = col * tw
        y = row * th
        sheet.paste(cell_img, (x, y), cell_img)

    os.makedirs(os.path.dirname(os.path.abspath(out_file)), exist_ok=True)
    sheet.save(out_file, "PNG")
    print(f"Reassembled {sliced_dir} -> {out_file} ({full_w}x{full_h}, scale={scale}x)")
    return sheet

if __name__ == "__main__":
    reassemble_sheet("scratch/sliced_tiles", "scratch/test_tiles_2x.png", scale=2)
    reassemble_sheet("scratch/sliced_sprites", "scratch/test_sprites_2x.png", scale=2, target_width=888, target_height=888)
