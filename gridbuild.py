import os

def build_index():
    pf_dir = os.path.join('static', 'pf')
    folders = [d for d in os.listdir(pf_dir) if os.path.isdir(os.path.join(pf_dir, d))]
    folder_html = []
    for d in sorted(folders):
        folder_html.append(f"<div class='folder' data-name='{d}'><div class='icon'>📁</div><div class='label'>{d}</div></div>")
    folders_markup = "\n".join(folder_html)
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Folder Grid</title>
    <link rel='stylesheet' href='static/style.css'>
</head>
<body>
    <div id='grid'>
    {folders_markup}
    </div>
    <div id='overlay' class='hidden'>
        <div id='square'>
            <div id='folder-container'></div>
        </div>
        <div id='text-rectangle'>
            <div id='folder-name'></div>
            <button id='close'>Close</button>
        </div>
    </div>
<script src='static/script.js'></script>
</body>
</html>"""
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    build_index()
