# motion2

This repository provides utilities for working with the `static/pf` folder.

- `link_model_folders.py` will create directories listed in `models.json` under
  `static/pf`.
- `generate_index_html.py` scans `static/pf` and creates `index.html`
  listing all existing folders. The page renders each folder as a 3D icon with
  its name displayed just below in the "Outfit" font. Labels drift with their
  folders and thicken and widen when hovered. Clicking a folder shifts the label
  to the side, aligning it vertically with the folder and scaling it up like a
  page title.

## Usage

Add or remove folders inside `static/pf/` manually and run:

```bash
python generate_index_html.py
```

Open `index.html` in your browser to see the list.
