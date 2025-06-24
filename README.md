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
  square portion of the frame and tilts slightly with the pointer. The bottom
  rectangle now holds a scrollable grid where you can showcase images or
  videos.

- `manage_layout.py` lets you assign images or videos to grid cells for a
  specific folder. Layout information is stored in `layouts/<folder>.json` and
  loaded when the folder is selected in the interface.

- `builder.html` offers a drag-and-drop layout builder. It lists the folders
  found in `static/pf` and, when one is chosen, shows its files. Drag any item
  onto the square grid and click **Save** to download the layout JSON which you
  can place in the `layouts/` directory.

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
