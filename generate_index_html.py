from pathlib import Path
import json
from link_model_folders import associate_models

TEMPLATE_FILE = Path('index_template.html')
INDEX_FILE = Path('index.html')


def generate_index():
    mapping = associate_models()
    folders = sorted(mapping.keys())
    folder_files = {}
    for name in folders:
        pf_dir = Path('static/pf') / name
        files = []
        if pf_dir.exists():
            for p in pf_dir.iterdir():
                if p.is_file() and not p.name.startswith('.'):
                    files.append(p.name)
        folder_files[name] = files

    template = TEMPLATE_FILE.read_text()
    html = template.replace('FOLDER_NAMES_PLACEHOLDER', json.dumps(folders))
    html = html.replace('FOLDER_FILES_PLACEHOLDER', json.dumps(folder_files))
    INDEX_FILE.write_text(html)

    print(f"Wrote {INDEX_FILE} with {len(folders)} folders.")


if __name__ == '__main__':
    generate_index()
