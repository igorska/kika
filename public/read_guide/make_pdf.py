#!/usr/bin/env python3
"""Merge all guide images into a single PDF with uniform page size."""

import os
import re
from PIL import Image

GUIDE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT = os.path.join(GUIDE_DIR, "guide.pdf")

# All pages will be normalized to this size (portrait)
PAGE_W, PAGE_H = 1080, 1920
BG_COLOR = (255, 255, 255)

def get_images():
    files = []
    for name in os.listdir(GUIDE_DIR):
        m = re.fullmatch(r'(\d+)\.(JPG|PNG)', name, re.IGNORECASE)
        if m:
            files.append((int(m.group(1)), os.path.join(GUIDE_DIR, name)))
    files.sort(key=lambda x: x[0])
    return [path for _, path in files]

def normalize(path):
    img = Image.open(path).convert("RGB")
    img.thumbnail((PAGE_W, PAGE_H), Image.LANCZOS)
    canvas = Image.new("RGB", (PAGE_W, PAGE_H), BG_COLOR)
    x = (PAGE_W - img.width) // 2
    y = (PAGE_H - img.height) // 2
    canvas.paste(img, (x, y))
    return canvas

def main():
    images = get_images()
    if not images:
        print("No images found.")
        return

    print(f"Found {len(images)} pages. Building PDF...")
    imgs = [normalize(p) for p in images]

    first, rest = imgs[0], imgs[1:]
    first.save(OUTPUT, save_all=True, append_images=rest)
    print(f"Done! Saved to: {OUTPUT}")

if __name__ == "__main__":
    main()
