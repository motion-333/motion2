import json
import os

TEMPLATE = 'index_template.html'
OUTPUT = 'index.html'
PF_DIR = os.path.join('static', 'pf')


def build_index():
    folders = [d for d in os.listdir(PF_DIR) if os.path.isdir(os.path.join(PF_DIR, d))]
    folders.sort()
    with open(TEMPLATE, 'r', encoding='utf-8') as f:
        tpl = f.read()
    html = tpl.replace('__FOLDER_JSON__', json.dumps(folders))
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        f.write(html)


if __name__ == '__main__':
    build_index()
