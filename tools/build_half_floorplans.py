"""The supplied EG + OG floor plans are complete and must not be cropped."""

from pathlib import Path


IMAGES = Path(__file__).resolve().parents[1] / "assets" / "images"

for number in (1, 2):
    source = IMAGES / f"Grundriss-Alpenschalet-Typ{number}-EG+OG.jpg"
    if not source.is_file():
        raise FileNotFoundError(source)
    print(f"Use the complete image unchanged: {source}")
