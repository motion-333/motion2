# motion2

This repository provides utilities for working with the `static/pf` folder.

- `link_model_folders.py` will create directories listed in `models.json` under
  `static/pf`.
- `generate_index_html.py` scans `static/pf` and creates `index_checkpoint.html`
  listing all existing folders.

## Usage

Add or remove folders inside `static/pf/` manually and run:

```bash
python generate_index_html.py
```

Open `index_checkpoint.html` in your browser to see the list.
