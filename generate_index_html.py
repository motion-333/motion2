from pathlib import Path

STATIC_DIR = Path('static/pf')
INDEX_FILE = Path('index_checkpoint.html')

def generate_index():
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    folders = [p.name for p in STATIC_DIR.iterdir() if p.is_dir()]
    html_lines = ["<html>", "<body>", "<h1>Available Folders</h1>", "<ul>"]
    for name in sorted(folders):
        html_lines.append(f"  <li>{name}</li>")
    html_lines.extend(["</ul>", "</body>", "</html>"])
    INDEX_FILE.write_text('\n'.join(html_lines))
    print(f'Wrote {INDEX_FILE} with {len(folders)} entries.')

if __name__ == '__main__':
    generate_index()
