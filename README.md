# motion2

This repository provides utilities for working with the `static/pf` folder.

- `link_model_folders.py` provides `associate_models()` which simply lists all
  directories inside `static/pf`.
- `generate_index_html.py` reads those directories and creates `index.html`
  listing them. The page renders each folder as a 3D icon with
  its name displayed just below in the "Outfit" font. Labels drift with their
  folders and thicken and widen when hovered. When one letter grows, the others
  shrink so the word keeps a constant width. Clicking a folder focuses it,
  displaying a centered frame with the folder on the left and the title
  filling the adjoining rectangle. When focused, the folder locks into the
  square portion of the frame and tilts slightly with the pointer. The bottom
  rectangle reveals a grid four times its own size. Moving the cursor near an
  edge pans the grid to show hidden squares so you can showcase images or
  videos beyond the initial view.

- `manage_layout.py` lets you assign images or videos to grid cells for a
  specific folder. Layout information is stored in `layouts/<folder>.json` as a
  fallback, but the pages now read layouts from the browser's `localStorage`
  so updates made in the builder appear immediately.

- `builder.html` offers a drag-and-drop layout builder. It lists the folders
  found in `static/pf` and, when one is chosen, shows its files. Drag any item
  onto the 32×32 grid and it snaps to these small cells while keeping the item's
  aspect ratio. The grid is visibly drawn with blue lines so alignment is easy.
  Items remain draggable and may overlap. The layout is stored in
  `localStorage` under `layout_<folder>` so `index.html` updates live when it
  changes.

## Usage

Add or remove folders inside `static/pf/` manually and run:

```bash
python generate_index_html.py
```

Open `index.html` in your browser to see the list.

To populate the grid for a folder run:

```bash
python manage_layout.py <folder>
```
Follow the prompts to assign images or videos to grid cells. The page will load
your layout when that folder is selected.

Alternatively open `builder.html` in your browser to arrange items visually.
When using the builder, make sure both `builder.html` and `index.html` are
served from the same origin so they share the browser's `localStorage`. The
easiest way is to start a simple HTTP server from the repository root:

```bash
python -m http.server
```

Then visit `http://localhost:8000/index.html` and `builder.html` in your
browser. Layout changes saved in the builder will immediately appear on the
main page.
