# motion2

This repository manages a gallery of folders under `static/pf`.

- `link_model_folders.py` returns the list of directories inside `static/pf`.
- `generate_index_html.py` reads those folders and writes `index.html` which
  renders them as 3D icons with hoverable labels.
- `gridbuild.py` scans the same directory and creates `folders.json` and a
  `files.json` manifest for each folder. These are used by `grid.html` and
  `gridbuild.html`.

`grid.html` displays a scrolling grid for a single folder. `gridbuild.html`
lets you arrange media items on that grid using drag and drop. Layout
information is stored in `localStorage` and shared with the overlay.

## Usage

1. Add or remove folders inside `static/pf/`.
2. Run `python gridbuild.py` to refresh the manifests.
3. Run `python generate_index_html.py` to rebuild `index.html`.
4. Open `index.html` in your browser. Clicking a folder moves it toward the
   camera and applies a blur effect to the background. Clicking the folder again
   returns it to its original position.
