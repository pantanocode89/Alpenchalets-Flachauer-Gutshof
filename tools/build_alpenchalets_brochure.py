from pathlib import Path
from textwrap import wrap

from PIL import Image
from reportlab.graphics import renderPDF
from reportlab.graphics.barcode import qr
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "assets" / "images"
OUT = ROOT / "output" / "pdf" / "alpenchalets-prospekt-druck.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = A4
GREEN = HexColor("#596141")
GREEN_DARK = HexColor("#3f4630")
OLIVE = HexColor("#7a8260")
CREAM = HexColor("#f7f4ed")
BEIGE = HexColor("#e9e3d7")
INK = HexColor("#24251f")
MUTED = HexColor("#66695e")
LINE = HexColor("#d9d2c5")
GOLD = HexColor("#b89a5c")

pdfmetrics.registerFont(TTFont("Corbel", r"C:\Windows\Fonts\corbel.ttf"))
pdfmetrics.registerFont(TTFont("Corbel-Bold", r"C:\Windows\Fonts\corbelb.ttf"))
pdfmetrics.registerFont(TTFont("Corbel-Italic", r"C:\Windows\Fonts\corbeli.ttf"))


def image_size(path):
    with Image.open(path) as im:
        return im.size


def crop_image(c, path, x, y, w, h, focus_x=0.5, focus_y=0.5):
    path = Path(path)
    iw, ih = image_size(path)
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx = x - (dw - w) * focus_x
    dy = y - (dh - h) * focus_y
    c.saveState()
    p = c.beginPath()
    p.rect(x, y, w, h)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(ImageReader(str(path)), dx, dy, dw, dh, mask="auto")
    c.restoreState()


def contain_image(c, path, x, y, w, h, pad=0):
    path = Path(path)
    iw, ih = image_size(path)
    scale = min((w - 2 * pad) / iw, (h - 2 * pad) / ih)
    dw, dh = iw * scale, ih * scale
    c.drawImage(
        ImageReader(str(path)),
        x + (w - dw) / 2,
        y + (h - dh) / 2,
        dw,
        dh,
        mask="auto",
    )


def text(c, value, x, y, size=11, font="Corbel", color=INK, leading=None):
    c.setFillColor(color)
    c.setFont(font, size)
    if leading is None:
        leading = size * 1.35
    for line in value.split("\n"):
        c.drawString(x, y, line)
        y -= leading
    return y


def wrapped(c, value, x, y, width, size=10.5, font="Corbel", color=INK, leading=None):
    if leading is None:
        leading = size * 1.45
    c.setFont(font, size)
    c.setFillColor(color)
    words = value.split()
    lines, current = [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if c.stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def kicker(c, value, x, y, color=GREEN):
    c.setFillColor(color)
    c.setFont("Corbel-Bold", 8.2)
    c.drawString(x, y, value.upper())


def heading(c, value, x, y, size=36, color=INK, max_width=None):
    c.setFillColor(color)
    c.setFont("Corbel-Italic", size)
    lines = value.split("\n")
    if max_width:
        expanded = []
        for line in lines:
            if c.stringWidth(line, "Corbel-Italic", size) <= max_width:
                expanded.append(line)
            else:
                expanded.extend(wrap(line, max(12, int(max_width / (size * .5)))))
        lines = expanded
    for line in lines:
        c.drawString(x, y, line)
        y -= size * .93
    return y


def page_number(c, number, light=False):
    color = Color(1, 1, 1, .75) if light else MUTED
    c.setFillColor(color)
    c.setFont("Corbel", 8)
    c.drawRightString(W - 34, 24, f"{number:02d}")


def fact_row(c, items, x, y, width):
    gap = 8
    bw = (width - gap * (len(items) - 1)) / len(items)
    for i, (top, bottom) in enumerate(items):
        bx = x + i * (bw + gap)
        c.setFillColor(white)
        c.roundRect(bx, y, bw, 55, 7, fill=1, stroke=0)
        c.setFillColor(GREEN)
        c.setFont("Corbel-Bold", 8.5)
        c.drawString(bx + 11, y + 34, top)
        c.setFillColor(MUTED)
        c.setFont("Corbel", 7.7)
        c.drawString(bx + 11, y + 16, bottom)


def bullet(c, title, detail, x, y, width):
    c.setFillColor(GREEN)
    c.circle(x + 3, y + 4, 2.3, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Corbel-Bold", 10.5)
    c.drawString(x + 15, y, title)
    y -= 17
    y = wrapped(c, detail, x + 15, y, width - 15, 9.3, color=MUTED, leading=13)
    return y - 9


def draw_qr(c, url, x, y, size):
    widget = qr.QrCodeWidget(url)
    bounds = widget.getBounds()
    bw, bh = bounds[2] - bounds[0], bounds[3] - bounds[1]
    from reportlab.graphics.shapes import Drawing
    drawing = Drawing(size, size, transform=[size / bw, 0, 0, size / bh, 0, 0])
    drawing.add(widget)
    renderPDF.draw(drawing, c, x, y)


def page1(c):
    crop_image(c, IMG / "hero-option-summer.png", 0, 0, W, H, .55, .5)
    c.setFillColor(Color(0.05, .07, .04, .48))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Corbel-Bold", 9)
    c.drawString(42, H - 48, "FLACHAU · SALZBURGER LAND · ÖSTERREICH")
    c.setFillColor(Color(1, 1, 1, .94))
    c.roundRect(42, H - 172, 130, 104, 4, fill=1, stroke=0)
    contain_image(c, IMG / "logo.jpg", 48, H - 166, 118, 92)
    heading(c, "Ankommen.\nWohlfühlen.", 42, 250, 52, white)
    text(c, "Private Chalets für gemeinsame Urlaubsmomente", 45, 145, 14, color=white)
    c.setStrokeColor(Color(1, 1, 1, .7))
    c.line(45, 122, 235, 122)
    text(c, "www.alpenchalets.at", 45, 99, 10, "Corbel-Bold", white)
    page_number(c, 1, True)
    c.showPage()


def page2(c):
    c.setFillColor(CREAM); c.rect(0, 0, W, H, fill=1, stroke=0)
    crop_image(c, IMG / "hero-alpenchalets-flugbild.jpg", 0, H - 355, W, 355, .5, .56)
    c.setFillColor(Color(0, 0, 0, .2)); c.rect(0, H - 355, W, 355, fill=1, stroke=0)
    kicker(c, "Willkommen bei Alpenchalets", 42, H - 396)
    heading(c, "Viel Raum für\nZeit miteinander", 42, H - 438, 39)
    wrapped(c, "Unsere gemütlichen Chalets verbinden alpine Atmosphäre mit privatem Komfort. Sauna, Kamin, voll ausgestattete Küche und kurze Wege in Flachau schaffen ein Zuhause auf Zeit für Familien und Freundesgruppen.", 320, H - 420, 230, 11, leading=16)
    fact_row(c, [("PRIVATE SAUNA", "im eigenen Chalet"), ("KAMIN", "für gemütliche Abende"), ("ZENTRALE LAGE", "mitten in Flachau")], 42, 105, W - 84)
    page_number(c, 2)
    c.showPage()


def chalet_page(c, number, title, kicker_text, hero, floorplan, facts, description, rooms):
    c.setFillColor(CREAM); c.rect(0, 0, W, H, fill=1, stroke=0)
    crop_image(c, hero, 0, H - 335, W, 335, .5, .5)
    c.setFillColor(Color(0.04, .05, .03, .48)); c.rect(0, H - 335, W, 335, fill=1, stroke=0)
    kicker(c, kicker_text, 42, H - 85, white)
    heading(c, title, 42, H - 130, 47, white)
    fact_row(c, facts, 42, H - 373, W - 84)
    kicker(c, "Wohnen & schlafen", 42, 386)
    wrapped(c, description, 42, 358, 278, 10.5, leading=15)
    y = 265
    for room in rooms:
        y = bullet(c, room[0], room[1], 42, y, 278)
    c.setFillColor(white)
    c.roundRect(344, 92, 208, 300, 8, fill=1, stroke=0)
    contain_image(c, floorplan, 354, 122, 188, 245, 4)
    text(c, "TYPISCHER GRUNDRISS", 365, 108, 7.5, "Corbel-Bold", GREEN)
    page_number(c, number)
    c.showPage()


def page5(c):
    c.setFillColor(CREAM); c.rect(0, 0, W, H, fill=1, stroke=0)
    kicker(c, "Ausstattung & Service", 42, H - 54)
    heading(c, "Kleine Details.\nGroßer Komfort.", 42, H - 95, 41)
    tiles = [
        (IMG / "kitchen.jpg", "Voll ausgestattete Küche"),
        (IMG / "bathroom-sauna.jpg", "Private Sauna"),
        (IMG / "living.jpg", "Kamin & Wohnbereich"),
        (IMG / "bedroom-main.jpg", "Ruhige Rückzugsorte"),
    ]
    positions = [(42, 407), (303, 407), (42, 205), (303, 205)]
    for (path, label), (x, y) in zip(tiles, positions):
        crop_image(c, path, x, y, 250, 168, .5, .5)
        c.setFillColor(Color(0, 0, 0, .42)); c.rect(x, y, 250, 34, fill=1, stroke=0)
        text(c, label, x + 12, y + 12, 9.5, "Corbel-Bold", white)
    services = ["Brötchenservice bis 17:00 Uhr bestellen", "Eigener Ski- und Abstellraum", "Waschmaschine & Trockner an der Rezeption", "Parkplätze und Tiefgarage", "Take-away im Winter vom Flachauer Gutshof", "Kostenloses WLAN im Chalet"]
    x, y = 42, 156
    for i, service in enumerate(services):
        col = i % 2
        row = i // 2
        bx, by = x + col * 261, y - row * 31
        c.setFillColor(white); c.roundRect(bx, by, 250, 23, 5, fill=1, stroke=0)
        c.setFillColor(GREEN); c.circle(bx + 11, by + 11.5, 2, fill=1, stroke=0)
        text(c, service, bx + 20, by + 7, 7.7, color=INK)
    page_number(c, 5)
    c.showPage()


def page6(c):
    c.setFillColor(CREAM); c.rect(0, 0, W, H, fill=1, stroke=0)
    crop_image(c, IMG / "sommer-header-terrasse-master.png", 0, H - 430, W, 430, .56, .58)
    c.setFillColor(Color(.02, .04, .02, .28)); c.rect(0, H - 430, W, 430, fill=1, stroke=0)
    kicker(c, "Sommer in Flachau", 42, H - 72, white)
    heading(c, "Berge, Bewegung\nund Zeit draußen", 42, H - 115, 43, white)
    kicker(c, "Flachau Sommer Card inklusive", 42, 355)
    wrapped(c, "Bei einem Sommeraufenthalt ist die Flachau Sommer Card inklusive. Sie bietet geführte Aktivitäten, Familienprogramme sowie attraktive Ermäßigungen bei Ausflugszielen und Freizeiteinrichtungen in und rund um Flachau.", 42, 326, 300, 11, leading=16)
    y = 228
    y = bullet(c, "Aktivurlaub direkt vor der Haustür", "Wandern, Radfahren und gemeinsame Erlebnisse in der Salzburger Bergwelt.", 42, y, 300)
    y = bullet(c, "Digitale Gästekarte", "Die persönliche Sommer Card erhalten Gäste nach dem Check-in.", 42, y, 300)
    c.setFillColor(GREEN_DARK); c.roundRect(375, 85, 177, 250, 10, fill=1, stroke=0)
    text(c, "MEHR SOMMER", 397, 302, 8, "Corbel-Bold", BEIGE)
    heading(c, "Flachau\nentdecken", 397, 267, 27, white)
    wrapped(c, "Ausflüge, Familienzeit und alpine Natur - jeden Tag neu.", 397, 185, 128, 9.5, color=white, leading=14)
    page_number(c, 6)
    c.showPage()


def page7(c):
    c.setFillColor(CREAM); c.rect(0, 0, W, H, fill=1, stroke=0)
    crop_image(c, IMG / "winter-header-real-chalet.png", 0, H - 370, W, 370, .5, .5)
    c.setFillColor(Color(.02, .03, .03, .42)); c.rect(0, H - 370, W, 370, fill=1, stroke=0)
    kicker(c, "Winter in Flachau", 42, H - 70, white)
    heading(c, "Schneetage.\nKaminabende.", 42, H - 115, 43, white)
    crop_image(c, IMG / "restaurant-dining-plate.jpg", 318, 93, 234, 274, .5, .5)
    kicker(c, "Winterbuchung", 42, 345)
    wrapped(c, "Winteraufenthalte in den Alpenchalets werden ausschließlich über unseren Partner Sunweb gebucht. Verfügbarkeit, Reisedaten und Buchung werden dort vollständig abgewickelt.", 42, 316, 238, 10.5, leading=15)
    kicker(c, "Flachauer Gutshof", 42, 217)
    wrapped(c, "Nur wenige Schritte entfernt erwarten Sie regionale und internationale Spezialitäten, urige Räumlichkeiten und gemütliche Abende. Im Winter sind auch Take-away-Bestellungen möglich.", 42, 188, 238, 10.5, leading=15)
    c.setFillColor(GREEN); c.roundRect(42, 90, 214, 42, 21, fill=1, stroke=0)
    text(c, "WINTER ÜBER SUNWEB BUCHEN", 64, 105, 8.6, "Corbel-Bold", white)
    page_number(c, 7)
    c.showPage()


def page8(c):
    c.setFillColor(BEIGE); c.rect(0, 0, W, H, fill=1, stroke=0)
    kicker(c, "Lage & Kontakt", 42, H - 52)
    heading(c, "Ihr Urlaub beginnt\nin Flachau", 42, H - 92, 38)
    c.setFillColor(white); c.roundRect(42, 390, 300, 250, 9, fill=1, stroke=0)
    contain_image(c, IMG / "resort-map.jpg", 52, 400, 280, 230, 5)
    kicker(c, "Anreiseadresse", 374, 617)
    text(c, "Grießenkarweg 417\n5542 Flachau\nSalzburger Land · Österreich", 374, 590, 11, color=INK, leading=17)
    kicker(c, "Kontakt", 374, 510)
    text(c, "+43 6457 33971\ninfo@alpenchalets.at", 374, 483, 11, "Corbel-Bold", GREEN_DARK, leading=18)
    c.setFillColor(white); c.roundRect(374, 302, 178, 145, 9, fill=1, stroke=0)
    draw_qr(c, "https://www.alpenchalets.at/", 397, 323, 100)
    text(c, "Website öffnen", 414, 312, 8.5, "Corbel-Bold", GREEN)
    c.setStrokeColor(LINE); c.line(42, 274, W - 42, 274)
    kicker(c, "Anerkennung & Partnerschaft", 42, 248)
    c.setFillColor(white); c.roundRect(42, 63, 246, 165, 8, fill=1, stroke=0)
    contain_image(c, IMG / "award-sunweb-2017.webp", 52, 100, 226, 118, 2)
    text(c, "Sunweb Certificate of Excellence 2017", 58, 79, 8.5, "Corbel-Bold", GREEN_DARK)
    c.setFillColor(white); c.roundRect(307, 63, 246, 165, 8, fill=1, stroke=0)
    contain_image(c, IMG / "membership-top-of-the-mountains.webp", 317, 100, 226, 118, 2)
    text(c, "Top of the Mountains · VIP Member", 323, 79, 8.5, "Corbel-Bold", GREEN_DARK)
    page_number(c, 8)
    c.showPage()


def build():
    c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
    c.setTitle("Flachauer Alpenchalets - Prospekt")
    c.setAuthor("Flachauer Alpenchalets")
    c.setSubject("Prospekt für die Flachauer Alpenchalets in Flachau")
    page1(c)
    page2(c)
    chalet_page(
        c, 3, "4-Zimmer-Chalet", "Bis 12 Personen",
        IMG / "living.jpg", IMG / "floorplan-type1.jpg",
        [("12 GÄSTE", "bis zu 12 Personen"), ("3 SCHLAFZIMMER", "großzügig aufgeteilt"), ("3 BÄDER + WC", "für entspannte Morgen"), ("PRIVATE SAUNA", "Wellness im Chalet")],
        "Das großzügige Chalet erstreckt sich über zwei Ebenen. Der offene Wohn- und Essbereich mit Kamin und Küche bietet viel Platz für gemeinsame Abende, während die Schlafzimmer private Rückzugsorte schaffen.",
        [("Schlafen", "Drei Schlafzimmer sowie ein Schlafsofa für zwei Personen."), ("Wohnen", "Offener Wohn- und Essbereich mit Kamin und Terrasse."), ("Praktisch", "Eigener Ski- und Abstellraum, Garderobe und Brötchenservice.")],
    )
    chalet_page(
        c, 4, "5-Zimmer-Chalet", "Bis 10 Personen",
        IMG / "exterior-main.jpg", IMG / "floorplan-type2.jpg",
        [("10 GÄSTE", "bis zu 10 Personen"), ("4 SCHLAFZIMMER", "keine Stockbetten"), ("2 BÄDER + 2 WCs", "komfortabel aufgeteilt"), ("PRIVATE SAUNA", "Wellness im Chalet")],
        "Vier separate Schlafzimmer, eine private Sauna und ein ruhiger Wohnbereich machen diesen Chalet-Typ besonders angenehm für Familien und Freundesgruppen. Zwei gekoppelte Chalets bieten gemeinsam Platz für bis zu 20 Personen.",
        [("Schlafen", "Vier separate Schlafzimmer und Schlafsofa für zwei Personen."), ("Wohnen", "Gemütlicher Wohn- und Essbereich mit Kamin und Küche."), ("Für Gruppen", "Zwei gekoppelte Chalets für gemeinsam bis zu 20 Gäste.")],
    )
    page5(c)
    page6(c)
    page7(c)
    page8(c)
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
