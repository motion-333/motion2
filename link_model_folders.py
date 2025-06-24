from pathlib import Path


def associate_models(static_path="static/pf"):
    """Return a mapping of folder names to paths inside ``static/pf``.

    Any directories already present inside ``static/pf`` are returned.  The
    function no longer creates folders from ``models.json`` but simply lists
    what exists so newly added folders are picked up automatically.
    """

    static_dir = Path(static_path)
    static_dir.mkdir(parents=True, exist_ok=True)

    mapping = {}
    for item in static_dir.iterdir():
        if item.is_dir():
            mapping[item.name] = str(item.resolve())

    return mapping


def main():
    mapping = associate_models()
    for model, folder in mapping.items():
        print(f"{model} -> {folder}")


if __name__ == "__main__":
    main()
