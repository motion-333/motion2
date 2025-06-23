from pathlib import Path
import json
from link_model_folders import associate_models

TEMPLATE_FILE = Path('index_template.html')
INDEX_FILE = Path('index.html')


def generate_index():
    mapping = associate_models()
    folders = sorted(mapping.keys())
    template = TEMPLATE_FILE.read_text()
    html = template.replace('FOLDER_NAMES_PLACEHOLDER', json.dumps(folders))
    INDEX_FILE.write_text(html)
    print(f"Wrote {INDEX_FILE} with {len(folders)} folders.")


if __name__ == '__main__':
    generate_index()
