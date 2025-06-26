#!/usr/bin/env python3
"""
Script to auto-generate folders.json and files.json manifests under /static/pf.
- folders.json: list of subfolder names inside /static/pf
- files.json: for each subfolder, list of media files with metadata for the grid
"""
import os
import json
import struct
from math import gcd

# Configuration
BASE_REL_PATH = 'static/pf'
IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.gif'}
VIDEO_EXTS = {'.mp4', '.webm'}

def read_png_size(path):
    with open(path, 'rb') as f:
        data = f.read(24)
        if data.startswith(b'\x89PNG'):
            w = int.from_bytes(data[16:20], 'big')
            h = int.from_bytes(data[20:24], 'big')
            return w, h
    return None

def read_gif_size(path):
    with open(path, 'rb') as f:
        data = f.read(10)
        if data[:6] in (b'GIF87a', b'GIF89a'):
            w = int.from_bytes(data[6:8], 'little')
            h = int.from_bytes(data[8:10], 'little')
            return w, h
    return None

def read_jpeg_size(path):
    try:
        with open(path, 'rb') as f:
            data = f.read()
        idx = 0
        while idx < len(data):
            if data[idx] == 0xFF:
                marker = data[idx+1]
                if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
                    h = int.from_bytes(data[idx+5:idx+7], 'big')
                    w = int.from_bytes(data[idx+7:idx+9], 'big')
                    return w, h
                else:
                    length = int.from_bytes(data[idx+2:idx+4], 'big')
                    idx += 2 + length
            else:
                idx += 1
    except Exception:
        pass
    return None

def read_video_size(path):
    # simple mp4 tkhd parser
    try:
        with open(path, 'rb') as f:
            data = f.read()
        i = 0
        while i < len(data)-8:
            size = int.from_bytes(data[i:i+4], 'big')
            typ = data[i+4:i+8]
            if typ == b'tkhd':
                version = data[i+8]
                if version == 0:
                    w = int.from_bytes(data[i+76:i+80], 'big') >> 16
                    h = int.from_bytes(data[i+80:i+84], 'big') >> 16
                    return w, h
            i += size if size else 8
    except Exception:
        pass
    return None

def get_media_size(path, ext):
    if ext == '.png':
        return read_png_size(path)
    if ext == '.gif':
        return read_gif_size(path)
    if ext in ('.jpg', '.jpeg'):
        return read_jpeg_size(path)
    if ext in VIDEO_EXTS:
        return read_video_size(path)
    return None

def aspect_cells(width, height):
    g = gcd(width, height)
    cols = width // g
    rows = height // g
    if max(cols, rows) < 8:
        cols *= 2
        rows *= 2
    return cols, rows

# Resolve absolute path to /static/pf
BASE_DIR = os.path.abspath(os.path.join(os.getcwd(), BASE_REL_PATH))
if not os.path.isdir(BASE_DIR):
    raise RuntimeError(f"Directory '{BASE_DIR}' does not exist.")

# Gather subfolders
folders = [d for d in sorted(os.listdir(BASE_DIR))
           if os.path.isdir(os.path.join(BASE_DIR, d))]

# Write folders.json
folders_manifest = os.path.join(BASE_DIR, 'folders.json')
with open(folders_manifest, 'w') as f:
    json.dump(folders, f, indent=2)
print(f"Wrote {folders_manifest} with {len(folders)} folders.")

# Generate files.json for each folder
for folder in folders:
    folder_path = os.path.join(BASE_DIR, folder)
    files = []
    for fname in sorted(os.listdir(folder_path)):
        _, ext = os.path.splitext(fname)
        ext = ext.lower()
        if ext in IMAGE_EXTS or ext in VIDEO_EXTS:
            fpath = os.path.join(folder_path, fname)
            size = get_media_size(fpath, ext)
            if size:
                w, h = size
                cols, rows = aspect_cells(w, h)
            else:
                cols = rows = 8
            ftype = 'video' if ext in VIDEO_EXTS else 'image'
            files.append({
                'name': fname,
                'type': ftype,
                'src': f"/static/pf/{folder}/{fname}",
                'cols': cols,
                'rows': rows
            })
    manifest_path = os.path.join(folder_path, 'files.json')
    with open(manifest_path, 'w') as mf:
        json.dump(files, mf, indent=2)
    print(f"Wrote {manifest_path} with {len(files)} media files.")

# Generate index.html from template if present
TEMPLATE = 'index_template.html'
OUTPUT = 'index.html'
if os.path.exists(TEMPLATE):
    with open(TEMPLATE, 'r') as tf:
        template = tf.read()
    filled = template.replace('{{FOLDERS}}', json.dumps(folders))
    with open(OUTPUT, 'w') as out:
        out.write(filled)
    print(f"Wrote {OUTPUT} with {len(folders)} folders.")
