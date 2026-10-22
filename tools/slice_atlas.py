"""
Atlas Slicer for The Nightmare Before Christmas (J2ME)
Slices 16x16TileSet.png and 32x32TileSet.png into individual items with clean RGBA transparency.
"""

import os
import json
from PIL import Image

def slice_sheet(sheet_path, tile_w, tile_h, out_dir, prefix):
    os.makedirs(out_dir, exist_ok=True)
    img = Image.open(sheet_path).convert('RGBA')
    width, height = img.size
    cols = width // tile_w
    rows = height // tile_h

    manifest = {
        "sheet_path": sheet_path,
        "tile_w": tile_w,
        "tile_h": tile_h,
        "cols": cols,
        "rows": rows,
        "total_cells": cols * rows,
        "items": []
    }

    print(f"Slicing {sheet_path} ({width}x{height}) into {cols}x{rows} = {cols*rows} cells ({tile_w}x{tile_h} each)...")

    saved_count = 0
    for idx in range(cols * rows):
        col = idx % cols
        row = idx // cols
        x1 = col * tile_w
        y1 = row * tile_h
        x2 = x1 + tile_w
        y2 = y1 + tile_h

        cell = img.crop((x1, y1, x2, y2))
        alpha = cell.split()[3]
        min_a, max_a = alpha.getextrema()
        is_empty = (max_a == 0)

        filename = f"{prefix}_{idx:03d}.png"
        filepath = os.path.join(out_dir, filename)

        # Always save cell so reassembly is trivial, but record empty status
        cell.save(filepath, "PNG")
        if not is_empty:
            saved_count += 1

        manifest["items"].append({
            "index": idx,
            "col": col,
            "row": row,
            "filename": filename,
            "empty": is_empty
        })

    with open(os.path.join(out_dir, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"Saved {cols*rows} cells ({saved_count} active) to {out_dir}/")
    return manifest

if __name__ == "__main__":
    slice_sheet("assets/16x16TileSet.png", 20, 20, "scratch/sliced_tiles", "tile")
    slice_sheet("assets/32x32TileSet.png", 37, 37, "scratch/sliced_sprites", "sprite")

