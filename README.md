# motion2

This repository provides utilities for working with the `static/pf` folder.

- `link_model_folders.py` creates directories listed in `models.json` under
  `static/pf`.
- `generate_index_html.py` ensures those directories exist (by calling
  `link_model_folders.associate_models`) and creates `index.html`
  listing all existing folders. The page renders each folder as a 3D icon with
  its name displayed just below in the "Outfit" font. Labels drift with their
  folders and thicken and widen when hovered. Clicking a folder focuses it,
  displaying a centered frame with the folder on the left and the title
  filling the adjoining rectangle. When focused, the folder locks into the
  square portion of the frame and tilts around the Y and Z axes depending on
  the pointer position while remaining relatively flat. Active titles scale
  uniformly to fit the rectangle so text stays sharp, and individual letters
  stretch or shrink in response to hovering.

## Usage

Add or remove folders inside `static/pf/` manually and run:

```bash
python generate_index_html.py
```

Open `index.html` in your browser to see the list.
