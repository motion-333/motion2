import json
from pathlib import Path


def associate_models(models_file="models.json", static_path="static/pf"):
    static_dir = Path(static_path)
    static_dir.mkdir(parents=True, exist_ok=True)
    mapping = {}

    with open(models_file) as f:
        data = json.load(f)
        for model_name in data.get("folders", []):
            folder_path = static_dir / model_name
            folder_path.mkdir(exist_ok=True)
            mapping[model_name] = str(folder_path.resolve())
    return mapping


def main():
    mapping = associate_models()
    for model, folder in mapping.items():
        print(f"{model} -> {folder}")


if __name__ == "__main__":
    main()
