# motion2

This repository provides utilities for working with the `static/pf` folder.

- `link_model_folders.py` provides `associate_models()` which simply lists all
  directories inside `static/pf`.
- `generate_index_html.py` reads those directories and creates `index.html`
  listing them. The page renders each folder as a 3D icon with
  its name displayed just below in the "Outfit" font. Labels drift with their
  folders and thicken and widen when hovered. Clicking a folder simply moves it
  toward the camera while a glassy blur covers the background.

- `manage_layout.py` is retained for older layouts but is not used by the
  current page.


## Usage

Add or remove folders inside `static/pf/` manually and run:

```bash
python generate_index_html.py
```

Open `index.html` in your browser to see the list.

