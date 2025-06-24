import argparse
import json
import os
from pathlib import Path

PF_DIR = Path('static/pf')
LAYOUT_DIR = Path('layouts')
LAYOUT_DIR.mkdir(exist_ok=True)


def list_folders():
    return [f.name for f in PF_DIR.iterdir() if f.is_dir()]


def edit_layout(folder):
    if folder not in list_folders():
        raise ValueError(f"Folder '{folder}' does not exist in {PF_DIR}")
    layout_file = LAYOUT_DIR / f"{folder}.json"
    if layout_file.exists():
        layout = json.loads(layout_file.read_text())
    else:
        layout = []
    print(f"Editing layout for {folder}. Enter blank path to finish.")
    while True:
        for i, item in enumerate(layout):
            print(i, item)
        path = input('Path to image/video within folder: ').strip()
        if not path:
            break
        x = int(input('grid x: '))
        y = int(input('grid y: '))
        w = int(input('width (cells): '))
        h = int(input('height (cells): '))
        layout.append({"path": path, "x": x, "y": y, "w": w, "h": h})
    layout_file.write_text(json.dumps(layout, indent=2))
    print('Saved', layout_file)


def main():
    parser = argparse.ArgumentParser(description='Edit folder grid layout')
    parser.add_argument('folder', help='Folder name inside static/pf to edit')
    args = parser.parse_args()
    edit_layout(args.folder)


if __name__ == '__main__':
    main()
