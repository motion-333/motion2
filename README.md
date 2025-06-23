# motion2

This repository provides utilities for working with the `static/pf` folder.

- `link_model_folders.py` will create directories listed in `models.json` under
  `static/pf`.
- `generate_index_html.py` scans `static/pf` and creates `index.html`
  listing all existing folders. The page renders each folder as a 3D icon with
  its name displayed just below in the "Outfit" font. Labels drift with their
  folders and thicken and widen when hovered. Clicking a folder focuses it,
  displaying a centered frame with the folder on the left and the title
  stretched to fill an adjoining rectangle. When focused, the folder locks
  into the square portion of the frame and tilts slightly with cursor movement
  while the title letters expand or contract based on the pointer position.

## Usage

Add or remove folders inside `static/pf/` manually and run:

```bash
python generate_index_html.py
```

Open `index.html` in your browser to see the list.
