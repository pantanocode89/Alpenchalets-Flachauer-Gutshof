from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "assets" / "images"
FONT_BOLD = r"C:\Windows\Fonts\corbelb.ttf"


CONFIG = {
    "type1": {
        "source": IMAGES / "floorplan-type1.jpg",
        "title": "Grundriss - Alpenchalet",
        "subtitle": "Typ 1 (4 Zimmer)",
        # The selected chalet is the right-hand ground floor
        # and the left-hand upper floor in the original duplex plan.
        "ground": (425, 290, 820, 985),
        "upper": (850, 285, 1218, 900),
    },
    "type2": {
        "source": IMAGES / "floorplan-type2.jpg",
        "title": "Grundriss - Alpenchalet",
        "subtitle": "Typ 2 (5 Zimmer)",
        "ground": (420, 325, 805, 945),
        "upper": (850, 325, 1215, 885),
    },
}


def trim_white(image, threshold=248, padding=12):
    rgb = image.convert("RGB")
    mask = Image.new("L", rgb.size)
    pixels = []
    for r, g, b in rgb.getdata():
        pixels.append(255 if min(r, g, b) < threshold else 0)
    mask.putdata(pixels)
    bbox = mask.getbbox()
    if not bbox:
        return rgb
    left, top, right, bottom = bbox
    return rgb.crop(
        (
            max(0, left - padding),
            max(0, top - padding),
            min(rgb.width, right + padding),
            min(rgb.height, bottom + padding),
        )
    )


def paste_contain(canvas, image, box):
    x, y, width, height = box
    scale = min(width / image.width, height / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    px = x + (width - resized.width) // 2
    py = y + (height - resized.height) // 2
    canvas.paste(resized, (px, py))


def centered(draw, value, font, center_x, y, fill=(18, 18, 16)):
    box = draw.textbbox((0, 0), value, font=font)
    draw.text((center_x - (box[2] - box[0]) / 2, y), value, font=font, fill=fill)


def build(name, cfg):
    source = Image.open(cfg["source"]).convert("RGB")
    ground = trim_white(source.crop(cfg["ground"]))
    upper = trim_white(source.crop(cfg["upper"]))

    canvas = Image.new("RGB", (1600, 1080), "white")
    draw = ImageDraw.Draw(canvas)
    title_font = ImageFont.truetype(FONT_BOLD, 62)
    subtitle_font = ImageFont.truetype(FONT_BOLD, 48)
    label_font = ImageFont.truetype(FONT_BOLD, 35)

    centered(draw, cfg["title"], title_font, 800, 42)
    centered(draw, cfg["subtitle"], subtitle_font, 800, 112)

    paste_contain(canvas, ground, (65, 190, 690, 720))
    paste_contain(canvas, upper, (845, 190, 690, 720))

    centered(draw, "Erdgeschoss", label_font, 410, 950)
    centered(draw, "Obergeschoss", label_font, 1190, 950)

    png_path = IMAGES / f"floorplan-{name}-half.png"
    webp_path = IMAGES / f"floorplan-{name}-half.webp"
    canvas.save(png_path, optimize=True)
    canvas.save(webp_path, "WEBP", quality=95, method=6)
    print(png_path)
    print(webp_path)


for key, settings in CONFIG.items():
    build(key, settings)
