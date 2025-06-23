from pathlib import Path
import json

STATIC_DIR = Path('static/pf')
TEMPLATE_FILE = Path('index_template.html')
INDEX_FILE = Path('index.html')


def generate_index():
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    folders = [p.name for p in STATIC_DIR.iterdir() if p.is_dir()]
    template = TEMPLATE_FILE.read_text()
    html = template.replace('FOLDER_NAMES_PLACEHOLDER', json.dumps(sorted(folders)))
    INDEX_FILE.write_text(html)
    print(f"Wrote {INDEX_FILE} with {len(folders)} folders.")


if __name__ == '__main__':
    generate_index()
