"""Halo Fragrance and Maison pages (desktop, full length) as HTML for Figma capture.

Run from the project root:  python design/desktop/inner_pages.py

Writes, into design/desktop/out/:
  inner-halo.html          local preview (?frame=fragrance|maison, and &y=1700 to slide the page up)
  inner-halo-capture.html  same page plus the Figma capture script

Both pages are the same size and sit side by side. Image areas are empty, labelled slots. Brand copy is
the locked copy from generate.py. The Maison paragraphs, the longevity table, the ingredients list and
the section labels are draft placeholders.
"""

from __future__ import annotations

from generate import CAPTURE_SCRIPT, COPY, FRAME_W, GAP, OUT_DIR, RAF_SHIM, esc, txt
from halo_page import (
    ACCENT, CONTENT_W, ECHO_STEPS, EXTRA_CSS, NOTE_COLORS, NOTE_RGB, chip, echo_rects, eyebrow, footer, svg_at, wrap,
)
from warm import (
    AMBER, BASE_CSS, CLAY, COCOA, COCOA_SOFT, CREAM, FONTS_URL, LEFT, PEACH, ROSE,
    arch_path, blob, box, dot, glass, halo_header, image_slot, orb, pill,
)

PAGE_H = 3720
BOARD_W = 2 * FRAME_W + GAP
RULE = "background:rgba(59,36,32,0.15);"
NOTE_DETAIL = (
    "Opens the composition and is gone within the hour.",
    "Carries the middle of the day: powder, root, a quiet cool.",
    "Settles last and stays longest: salt, skin and warmth.",
)
PARAGRAPHS = (
    "Sillage is a house of one fragrance. We began with a single question: what does a perfume leave behind once the person has gone?",
    "Everything is made in Grasse, in small batches, by hand. Twelve ingredients, chosen as much for how they fade as for how they open.",
    "Ombre Claire is the first answer. It is not a scent that announces you. It is the trace that remains.",
)
NUMBERS = (("2024", "ESTABLISHED"), ("12", "INGREDIENTS"), ("1", "ATELIER"))
TIMELINE = (
    (0, "0 H", "Bergamot opens", True, AMBER), (1, "1 H", "…and withdraws", False, AMBER),
    (4, "4 H", "Iris takes the room", True, ROSE), (8, "8 H", "Ambergris settles", False, CLAY),
    (24, "24 H", "A trace remains", True, CLAY),
)
PHASES = (
    ("Top", "0–1 h", "Bergamot opens and withdraws."),
    ("Heart", "1–8 h", "Iris and ambrette: powder and root."),
    ("Base", "8–24 h", "Ambergris: salt, skin, warmth."),
)


# --------------------------------------------------------------------------------------------
# Shared pieces
# --------------------------------------------------------------------------------------------
def hero_glow(sun: tuple[float, float], blush: tuple[float, float], gold: tuple[float, float]) -> str:
    return (
        orb("Glow · sun", sun[0], sun[1], 1000, "247,183,127", 0.75)
        + orb("Glow · blush", blush[0], blush[1], 700, "233,154,154", 0.45)
        + orb("Glow · gold", gold[0], gold[1], 520, "255,226,184", 0.8)
    )


def arch_echoes(ax: float, ay: float, aw: float, ah: float) -> str:
    return "".join(
        f'<path d="{arch_path(ax - o, ay - o, aw + 2 * o, ah + 2 * o, 36 + o)}" fill="none" '
        f'stroke="{COCOA}" stroke-opacity="{a}" stroke-width="1"/>'
        for o, a in ((26, 0.22), (52, 0.14), (78, 0.08))
    )


def cta_band(top: int = 3200) -> str:
    inner = (
        orb("Band glow", 1000, 140, 760, "255,246,232", 0.9)
        + txt("Band headline", 64, 52, "w-h2", f'Ombre <span style="{ACCENT}">Claire</span>', COCOA)
        + txt("Spec line", 64, 160, "w-micro", f"{COPY.volume.upper()} · {COPY.concentration.upper()} · {COPY.price}", COCOA)
        + txt("Concept note", 64, 200, "w-micro", "A CONCEPT PIECE · NOTHING IS SENT OR STORED", COCOA_SOFT)
        + pill(
            "Primary button", COPY.cta.capitalize(), CONTENT_W - 64 - 292, 110, 292, 60, COCOA, CREAM,
            "box-shadow:0 16px 36px rgba(59,36,32,0.25);",
        )
    )
    style = "border-radius:56px;overflow:hidden;background:linear-gradient(165deg,#FADFC8 0%,#F6B992 48%,#EE9C94 100%);"
    return box("Invitation band", LEFT, top, CONTENT_W, 280, style, inner)


# --------------------------------------------------------------------------------------------
# Fragrance
# --------------------------------------------------------------------------------------------
def _fragrance_hero() -> str:
    ax, ay, aw, ah = 900, 130, 380, 560
    shapes = (
        blob(980, 440, 300, 0.12, 0.9, PEACH, 0.5) + blob(1110, 540, 220, 0.16, 2.6, ROSE, 0.32)
        + arch_echoes(ax, ay, aw, ah)
    )
    slot = image_slot("Bottle image slot", ax, ay, aw, ah, f"{aw // 2}px {aw // 2}px 36px 36px", ("BOTTLE IMAGE", "EMPTY SLOT · 4:5"))
    title = txt("Headline", LEFT, 196, "w-display-md", f'The<br><span style="{ACCENT}">composition</span>', COCOA)
    intro_text = "Three notes, in the order they arrive. One opens, one stays, one is the trace that remains."
    intro = txt("Intro", LEFT, 520, "w-lead2", wrap(intro_text, 46), COCOA_SOFT)
    chips = "".join(chip(f"{name} · {position.title()}", LEFT + i * 226, 650, 210) for i, (_, name, position) in enumerate(COPY.notes))
    return (
        hero_glow((1040, 400), (140, 760), (320, 90)) + svg_at("Liquid shapes and arch lines", 0, 0, FRAME_W, 780, shapes)
        + slot + eyebrow("Eyebrow", LEFT, 150, "THE COMPOSITION") + title + intro + chips
    )


def _note_row(i: int, y: float) -> str:
    index, name, position = COPY.notes[i]
    return (
        box("Row rule", LEFT, y, CONTENT_W, 1, RULE)
        + orb(f"{name} glow", 1090, y + 130, 720, NOTE_RGB[i], 0.45)
        + image_slot(f"{name} texture slot", 820, y + 30, 540, 200, "100px", ("MACRO TEXTURE", f"{name.upper()} · EMPTY SLOT"))
        + txt(f"{name} number", LEFT, y + 44, "w-num", index, COCOA_SOFT)
        + txt(f"{name} position", LEFT, y + 90, "w-micro", f"{position} NOTE", COCOA_SOFT)
        + dot(LEFT, y + 120, NOTE_COLORS[i])
        + txt(f"{name} name", LEFT + 120, y + 30, "w-note-xl", name, COCOA)
        + txt(f"{name} line", LEFT + 120, y + 150, "w-lead2", COPY.note_copy[i], COCOA)
        + txt(f"{name} detail", LEFT + 120, y + 190, "w-body-sm", NOTE_DETAIL[i], COCOA_SOFT)
    )


def notes_section(top: int = 840) -> str:
    rows = "".join(_note_row(i, top + 60 + i * 290) for i in range(3))
    return eyebrow("Notes eyebrow", LEFT, top, "NOTES IN DEPTH") + rows + box("Section end rule", LEFT, top + 900, CONTENT_W, 1, RULE)


def _mark(x: float, y: float, hours: str, text: str, up: bool, color: str, last: bool) -> str:
    marker = box("Marker", x - 11, y - 11, 22, 22, f"border-radius:50%;background:#FFFFFF;border:3px solid {color};box-shadow:0 6px 16px rgba(176,92,62,0.2);")
    tick = box("Tick", x, y - 46 if up else y + 11, 1, 35, "background:rgba(59,36,32,0.25);")
    text_y, micro_y = (y - 78, y - 102) if up else (y + 54, y + 88)
    tx, width, align = (x - 14 - 220, 220, "right") if last else (x + 14, 0, "")
    label = txt(f"{hours} label", tx, text_y, "w-time", text, COCOA, width, align)
    return marker + tick + label + txt(f"{hours} hours", tx, micro_y, "w-micro", hours, COCOA_SOFT, width, align)


def timeline(top: int = 1840, table: bool = True) -> str:
    y = top + 290
    bar = (
        "border-radius:5px;background:linear-gradient(90deg,rgba(240,182,107,0.95) 0%,"
        "rgba(233,154,154,0.7) 33%,rgba(190,110,92,0.45) 66%,rgba(190,110,92,0) 100%);"
    )
    trail = box("Trail", LEFT, y - 5, CONTENT_W, 10, bar) + box("Timeline rule", LEFT, y, CONTENT_W, 1, "background:rgba(59,36,32,0.3);")
    marks = "".join(
        _mark(LEFT + hours / 24 * CONTENT_W, y, label, text, up, color, hours == 24)
        for hours, label, text, up, color in TIMELINE
    )
    heading = txt("Timeline heading", LEFT, top + 36, "w-h2", f'A day <span style="{ACCENT}">with it</span>', COCOA)
    return eyebrow("Timeline eyebrow", LEFT, top, "LONGEVITY & SILLAGE") + heading + trail + marks + (_phase_table(top + 470) if table else "")


def _phase_table(top: float) -> str:
    cols = (LEFT, LEFT + 300, LEFT + 560)
    out = "".join(txt(f"Table head {t.title()}", x, top, "w-micro", t, COCOA_SOFT) for t, x in zip(("PHASE", "HOURS", "WHAT YOU NOTICE"), cols))
    for i, (phase, hours, notice) in enumerate(PHASES):
        y = top + 36 + i * 68
        out += box("Row rule", LEFT, y, CONTENT_W, 1, RULE) + txt(f"{phase} phase", cols[0], y + 20, "w-time", phase, COCOA)
        out += txt(f"{phase} hours", cols[1], y + 20, "w-body", hours, COCOA_SOFT) + txt(f"{phase} notice", cols[2], y + 20, "w-body", notice, COCOA)
    return out + box("Table end rule", LEFT, top + 36 + 3 * 68, CONTENT_W, 1, RULE)


def _ingredients() -> str:
    top = 2620
    names = ("Bergamot", "Iris", "Ambrette", "Ambergris")
    rows = orb("Card glow", 120, 60, 480, "247,183,127", 0.4) + txt("Ingredients title", 40, 40, "w-micro", "INGREDIENTS", COCOA_SOFT)
    for i, name in enumerate(names):
        y = 92 + i * 80
        rows += box("Row rule", 40, y, 518, 1, RULE) + txt(f"{name} ingredient", 40, y + 22, "w-h3", name, COCOA)
    rows += txt("Ingredient count", 40, 428, "w-micro", "FOUR OF TWELVE", COCOA_SOFT)
    origin = (
        orb("Origin glow", 320, 80, 520, "233,154,154", 0.45)
        + image_slot("Origin image slot", 20, 20, 598, 300, "28px", ("ORIGIN IMAGE", "EMPTY SLOT · LANDSCAPE"))
        + txt("Made in", 40, 356, "w-micro", "MADE IN", COCOA_SOFT) + txt("Origin", 40, 382, "w-h3", COPY.origin, COCOA)
    )
    return glass("Ingredients card", LEFT, top, 600, 480, 40, rows) + glass("Origin card", LEFT + 640, top, 640, 480, 40, origin)


def fragrance_body() -> str:
    return _fragrance_hero() + notes_section() + timeline() + _ingredients() + cta_band() + footer() + halo_header(1)


# --------------------------------------------------------------------------------------------
# Maison
# --------------------------------------------------------------------------------------------
def maison_hero() -> str:
    sx, sy, sw, sh, m = 980, 150, 340, 520, 90
    shapes = blob(520, 430, 300, 0.13, 1.6, PEACH, 0.5) + blob(1180, 560, 230, 0.15, 3.4, ROSE, 0.3)
    rings = svg_at("Echo outlines", sx - m, sy - m, sw + 2 * m, sh + 2 * m, echo_rects(sw, sh, m, sw / 2, ECHO_STEPS))
    slot = image_slot("Atelier image slot", sx, sy, sw, sh, f"{sw // 2}px", ("ATELIER IMAGE", "EMPTY SLOT · PORTRAIT"))
    meta = box("Meta rule", LEFT, 610, 360, 1, RULE) + txt("Meta", LEFT, 634, "w-micro", "EST. 2024 · GRASSE, FRANCE", COCOA_SOFT)
    return (
        hero_glow((440, 420), (1300, 780), (1180, 90)) + svg_at("Liquid shapes", 0, 0, FRAME_W, 820, shapes)
        + rings + slot + eyebrow("Eyebrow", LEFT, 150, "THE HOUSE")
        + txt("Pull quote", LEFT, 190, "w-quote-xl", wrap(COPY.quote, 22), COCOA) + meta
    )


def paragraphs(texts: tuple[str, ...] = PARAGRAPHS) -> str:
    top = 920
    out = orb("Glow · amber", 200, top + 500, 800, "247,183,127", 0.35) + eyebrow("Paragraphs eyebrow", LEFT, top, "ABOUT THE HOUSE")
    for i, text in enumerate(texts):
        x, y = LEFT + i * 444, top + 60 + i * 48
        out += box("Column rule", x, y, 392, 1, RULE)
        out += txt(f"Paragraph {i + 1} number", x, y + 28, "w-numeral", f"0{i + 1}", NOTE_COLORS[i])
        out += txt(f"Paragraph {i + 1}", x, y + 190, "w-body", wrap(text, 38), COCOA)
    return out


def numbers(items: tuple[tuple[str, str], ...] = NUMBERS) -> str:
    top, col = 1700, CONTENT_W / 3
    inner = orb("Panel glow", 640, 100, 900, "255,226,184", 0.7) + orb("Panel blush", 1180, 340, 700, "233,154,154", 0.4)
    for i, (value, label) in enumerate(items):
        if i:
            inner += box("Divider", i * col, 60, 1, 280, "background:rgba(59,36,32,0.14);")
        inner += txt(f"{label.title()} number", i * col + 48, 80, "w-big", value, COCOA)
        inner += txt(f"{label.title()} label", i * col + 48, 290, "w-micro", label, COCOA_SOFT)
    return glass("Numbers panel", LEFT, top, CONTENT_W, 400, 56, inner)


def atelier() -> str:
    top, height = 2220, 820
    return (
        orb("Glow · rose", 720, top + height / 2, 1500, "233,154,154", 0.3)
        + eyebrow("Atelier eyebrow", LEFT, top - 40, "THE ATELIER")
        + image_slot("Atelier wide image slot", LEFT, top, CONTENT_W, height, "56px", ("ATELIER IMAGE", "EMPTY SLOT · WIDE"))
        + chip("One atelier · Grasse, France", LEFT + 40, top + height - 92, 330)
    )


def maison_body() -> str:
    return maison_hero() + paragraphs() + numbers() + atelier() + cta_band() + footer() + halo_header(2)


# --------------------------------------------------------------------------------------------
# Page assembly
# --------------------------------------------------------------------------------------------
INNER_CSS = """
.w-display-md{font:300 150px/0.95 'Fraunces',serif;letter-spacing:-0.04em}
.w-note-xl{font:300 96px/1 'Fraunces',serif;letter-spacing:-0.03em}
.w-num{font:300 28px/1 'Fraunces',serif}
.w-lead2{font:500 21px/1.6 'Manrope',sans-serif}
.w-quote-xl{font:italic 300 80px/1.12 'Fraunces',serif;letter-spacing:-0.03em}
.w-h3{font:300 44px/1 'Fraunces',serif;letter-spacing:-0.02em}
.w-big{font:300 150px/1 'Fraunces',serif;letter-spacing:-0.04em}
.w-numeral{font:300 120px/1 'Fraunces',serif;letter-spacing:-0.03em}
.w-time{font:400 24px/1.1 'Fraunces',serif}
"""
SLUGS = ("fragrance", "maison")
PREVIEW_CSS = "html{overflow:auto}" + "".join(
    f"body.only-{k}{{width:1440px}}body.only-{k} .frame:not(.f-{k}){{display:none}}body.only-{k} .f-{k}{{left:0!important}}"
    for k in SLUGS
)
PREVIEW_JS = (
    "<script>var q=new URLSearchParams(location.search),f=q.get('frame'),y=+q.get('y');"
    "if(f){document.body.className='only-'+f}"
    "if(y){document.querySelectorAll('.frame').forEach(function(e){e.style.top=-y+'px'});"
    "document.body.style.height='900px'}</script>"
)


def page_frame(slug: str, name: str, x0: int, body: str) -> str:
    label = f"{name} — Desktop (1440×{PAGE_H})"
    return (
        f'<section class="frame f-{slug}" style="left:{x0}px;background:{CREAM}" '
        f'aria-label="{esc(label)}">{body}</section>'
    )


def page(capture: bool) -> str:
    frames = page_frame("fragrance", "Halo · Fragrance", 0, fragrance_body()) + page_frame(
        "maison", "Halo · Maison", FRAME_W + GAP, maison_body()
    )
    css = BASE_CSS.replace("__W__", str(BOARD_W)).replace("__H__", str(PAGE_H)) + EXTRA_CSS + INNER_CSS
    css += "" if capture else PREVIEW_CSS
    head_extra = (RAF_SHIM + CAPTURE_SCRIPT) if capture else ""
    body_extra = "" if capture else PREVIEW_JS
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        "<title>Sillage — Halo Fragrance and Maison</title>"
        '<link rel="preconnect" href="https://fonts.googleapis.com">'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        f'<link rel="stylesheet" href="{FONTS_URL}">'
        f"<style>{css}</style>{head_extra}</head>"
        f'<body aria-label="Sillage — Halo Fragrance and Maison">{frames}{body_extra}</body></html>'
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "inner-halo.html").write_text(page(capture=False), encoding="utf-8")
    (OUT_DIR / "inner-halo-capture.html").write_text(page(capture=True), encoding="utf-8")
    print(f"Wrote {OUT_DIR / 'inner-halo.html'} and inner-halo-capture.html")


if __name__ == "__main__":
    main()
