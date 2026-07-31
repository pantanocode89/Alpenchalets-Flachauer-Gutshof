from pathlib import Path

from PIL import Image, ImageDraw, ImageOps
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[2]
source_png = ROOT / "tmp" / "pdfs" / "lageplan-original-300.png"
styled_png = ROOT / "tmp" / "pdfs" / "lageplan-2026-alpenchalets.png"
output_pdf = ROOT / "output" / "pdf" / "Lageplan_2026_Alpenchalets_Stil.pdf"
website_map = ROOT / "assets" / "images" / "resort-map.webp"
alpenchalets_logo = ROOT / "assets" / "images" / "logo.jpg"

image = Image.open(source_png).convert("RGB")
pixels = image.load()

# Palette based on the website: warm cream, olive/sage green, muted gold,
# terracotta and restrained blue-grey. Thresholds affect only the original
# flat diagram colours; black text, fine outlines and photographic logos stay.
for y in range(image.height):
    for x in range(image.width):
        r, g, b = pixels[x, y]

        # Main bright lawn green.
        if g > 150 and r > 105 and b < 75 and g > r * 1.15:
            pixels[x, y] = (111, 124, 82)
        # Pale green areas.
        elif g > 170 and r > 150 and b < 155 and g > b * 1.18:
            pixels[x, y] = (197, 205, 178)
        # Yellow access routes.
        elif r > 190 and g > 180 and b < 80:
            pixels[x, y] = (183, 165, 107)
        # Strong icon green.
        elif g > 85 and g > r * 1.55 and g > b * 1.35:
            pixels[x, y] = (89, 97, 65)
        # Deep parking blue.
        elif b > 105 and b > r * 1.4 and g > r * 1.25:
            pixels[x, y] = (74, 99, 96)
        # Pale parking / water blue.
        elif b > 180 and g > 175 and r < 205 and b > r * 1.08:
            pixels[x, y] = (205, 216, 207)
        # Route red.
        elif r > 180 and g < 105 and b < 105:
            pixels[x, y] = (154, 83, 68)
        # Type 2 orange.
        elif r > 210 and 65 < g < 155 and b < 55:
            pixels[x, y] = (174, 105, 62)
        # Type 1 amber.
        elif r > 210 and 135 <= g < 205 and b < 75:
            pixels[x, y] = (193, 148, 75)
        # Cool grey surroundings -> warm stone grey.
        elif abs(r - g) < 20 and abs(g - b) < 28 and 175 < r < 235:
            pixels[x, y] = (218, 215, 207)
        # Pure white fields -> website cream.
        elif r > 247 and g > 247 and b > 247:
            pixels[x, y] = (250, 248, 243)

# The source artwork is sideways. Rotate 90 degrees clockwise to match the
# horizontal map presentation used by the website.
image = image.transpose(Image.Transpose.ROTATE_270)

# Replace only the large lower-left restaurant logo block with the
# Alpenchalets identity requested for the website version of the map.
scale = image.width / 3508
logo_box = tuple(round(value * scale) for value in (18, 2100, 454, 2470))
draw = ImageDraw.Draw(image)
draw.rectangle(logo_box, fill=(250, 248, 243), outline=(89, 97, 65), width=max(2, round(3 * scale)))
logo = Image.open(alpenchalets_logo).convert("RGB")
inner_w = logo_box[2] - logo_box[0] - round(16 * scale)
inner_h = logo_box[3] - logo_box[1] - round(16 * scale)
logo = ImageOps.contain(logo, (inner_w, inner_h), Image.Resampling.LANCZOS)
logo_x = logo_box[0] + (logo_box[2] - logo_box[0] - logo.width) // 2
logo_y = logo_box[1] + (logo_box[3] - logo_box[1] - logo.height) // 2
image.paste(logo, (logo_x, logo_y))
image.save(styled_png, "PNG", optimize=True)
image.save(website_map, "WEBP", quality=92, method=6)

page_w, page_h = landscape(A4)
pdf = canvas.Canvas(str(output_pdf), pagesize=(page_w, page_h))
pdf.setTitle("Lageplan 2026 - Flachauer Alpenchalets")
pdf.drawImage(
    str(styled_png),
    0,
    0,
    width=page_w,
    height=page_h,
    preserveAspectRatio=False,
    mask="auto",
)
pdf.showPage()
pdf.save()

print(output_pdf)
