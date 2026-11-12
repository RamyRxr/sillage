"""Halo home page, full length (desktop, 1440 wide), as HTML for Figma capture.

Run from the project root:  python design/desktop/halo_page.py

Writes, into design/desktop/out/:
  home-halo.html          local preview
  home-halo-capture.html  same page plus the Figma capture script

The hero is reused from warm.py. Image areas are empty, labelled slots. Brand copy is the locked copy
from generate.py (manifesto, notes, pull quote); the section labels are placeholders.
"""

from __future__ import annotations

import textwrap

from generate import CAPTURE_SCRIPT, COPY, FRAME_W, OUT_DIR, RAF_SHIM, esc, num, txt
from warm import (
    AMBER, BASE_CSS, CLAY, COCOA, COCOA_SOFT, CREAM, FONTS_URL, LEFT, PEACH, RIGHT, ROSE,
    blob, box, dot, glass, halo_body, image_slot, orb, pill,
)

PAGE_H = 3720
CONTENT_W = FRAME_W - 2 * LEFT
NOTE_RGB = ("240,182,107", "233,154,154", "190,110,92")
NOTE_COLORS = (AMBER, ROSE, CLAY)
ECHO_STEPS = ((24, 0.2), (48, 0.12), (72, 0.07))
ECHO_STEPS_LIGHT = ((24, 0.7), (48, 0.45), (72, 0.25))
ACCENT = f"font-style:italic;color:{CLAY}"


# --------------------------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------------------------
def wrap(text: str, width: int) -> str:
    return "<br>".join(textwrap.wrap(text, width))


def eyebrow(label: str, x: float, y: float, text: str) -> str:
    return txt(label, x, y, "w-micro", text, COCOA_SOFT)


def svg_at(label: str, x: float, y: float, w: float, h: float, shapes: str) -> str:
    return (
        f'<svg class="abs" style="left:{num(x)}px;top:{num(y)}px" width="{num(w)}" height="{num(h)}" '
        f'viewBox="0 0 {num(w)} {num(h)}" aria-label="{esc(label)}">{shapes}</svg>'
    )


def echo_rects(w: float, h: float, margin: float, radius: float, steps: tuple, stroke: str = COCOA) -> str:
    """Concentric outlines around a w x h shape, for an svg with `margin` of room on every side."""
    return "".join(
        f'<rect x="{num(margin - off)}" y="{num(margin - off)}" width="{num(w + 2 * off)}" '
        f'height="{num(h + 2 * off)}" rx="{num(radius + off)}" fill="none" stroke="{stroke}" '
        f'stroke-opacity="{alpha}" stroke-width="1"/>'
        for off, alpha in steps
    )


def chip(text: str, x: float, y: float, w: float) -> str:
    label = txt("Chip label", 0, 16, "w-chip", text, COCOA, w - 2, "center")
    return glass(f"Chip: {text}", x, y, w, 52, 26, label)


# --------------------------------------------------------------------------------------------
# Sections
# --------------------------------------------------------------------------------------------
def manifesto() -> str:
    top = 980
    rest = COPY.manifesto.split("This one waits. ", 1)[1]
    sx, sy, sw, sh, m = 900, top + 30, 420, 560, 90
    glow = (
        orb("Glow · blush", 1160, top + 320, 940, "233,154,154", 0.38)
        + orb("Glow · amber", 120, top + 600, 700, "247,183,127", 0.4)
    )
    lead = txt(
        "Manifesto lead", LEFT, top + 44, "w-statement",
        f'Most fragrances<br>announce themselves.<br><span style="{ACCENT}">This one waits.</span>', COCOA,
    )
    body = txt("Manifesto body", LEFT, top + 316, "w-body", wrap(rest, 50), COCOA_SOFT)
    rings = svg_at("Echo outlines", sx - m, sy - m, sw + 2 * m, sh + 2 * m, echo_rects(sw, sh, m, sw / 2, ECHO_STEPS))
    slot = image_slot("Atmosphere image slot", sx, sy, sw, sh, f"{sw // 2}px", ("ATMOSPHERE IMAGE", "EMPTY SLOT · PORTRAIT"))
    chips = chip("Worn close", sx - 90, sy + sh - 150, 210) + chip("Worn at a distance", sx + 190, sy + sh - 70, 270)
    return glow + eyebrow("Manifesto eyebrow", LEFT, top, "THE MANIFESTO") + lead + body + rings + slot + chips


def _note_card(i: int, x: float, y: float) -> str:
    index, name, position = COPY.notes[i]
    w, h = 392, 560
    inner = (
        orb(f"{name} glow", w / 2, 70, 480, NOTE_RGB[i], 0.5)
        + image_slot(f"{name} texture slot", 20, 20, w - 42, 300, "28px", ("MACRO TEXTURE", "EMPTY SLOT"))
        + dot(28, 354, NOTE_COLORS[i])
        + txt(f"{name} position", 50, 354, "w-micro", f"{position} · {index}", COCOA_SOFT)
        + txt(f"{name} name", 28, 386, "w-note-lg", name, COCOA)
        + txt(f"{name} copy", 28, 464, "w-body-sm", wrap(COPY.note_copy[i], 34), COCOA_SOFT)
    )
    return glass(f"Note card: {name}", x, y, w, h, 40, inner)


def notes_section() -> str:
    top = 1760
    glow = orb("Glow · peach", 720, top + 420, 1300, "247,183,127", 0.3)
    liquid = svg_at(
        "Liquid shapes", 0, top, FRAME_W, 900,
        blob(300, 330, 260, 0.14, 1.2, PEACH, 0.45) + blob(1150, 560, 300, 0.15, 3.3, ROSE, 0.3),
    )
    heading = txt("Notes heading", LEFT, top + 40, "w-h2", f'The three <span style="{ACCENT}">notes</span>', COCOA)
    cards = "".join(_note_card(i, LEFT + i * 444, top + 190 + i * 48) for i in range(3))
    return glow + liquid + eyebrow("Notes eyebrow", LEFT, top, "THE COMPOSITION") + heading + cards


def spec_strip() -> str:
    columns = (
        (COPY.volume, "VOLUME", 260), (COPY.concentration, "CONCENTRATION", 420),
        (COPY.origin, "ORIGIN", 340), (COPY.price, "PRICE", 260),
    )
    inner, x = "", 0
    for i, (value, label, w) in enumerate(columns):
        if i:
            inner += box("Divider", x, 36, 1, 108, "background:rgba(59,36,32,0.14);")
        inner += txt(f"{label.title()} value", x + 36, 44, "w-spec", value, COCOA)
        inner += txt(f"{label.title()} label", x + 36, 112, "w-micro", label, COCOA_SOFT)
        x += w
    return glass("Specification strip", LEFT, 2700, CONTENT_W, 180, 40, inner)


def cta_panel() -> str:
    d, rx, ry, m = 360, 840, 80, 90
    captions = (
        txt("Slot caption", 0, d / 2 - 20, "w-micro", "BOTTLE IMAGE", COCOA_SOFT, d - 3, "center")
        + txt("Slot size", 0, d / 2 + 4, "w-micro", "EMPTY SLOT · ROUND", COCOA_SOFT, d - 3, "center")
    )
    inner = (
        orb("Panel glow", 960, 200, 760, "255,246,232", 0.9)
        + svg_at("Echo rings", rx - m, ry - m, d + 2 * m, d + 2 * m, echo_rects(d, d, m, d / 2, ECHO_STEPS_LIGHT, "#FFFFFF"))
        + box("Round image slot", rx, ry, d, d, "border-radius:50%;border:1.5px dashed rgba(255,255,255,0.9);background:rgba(255,255,255,0.18);", captions)
        + txt("Pull quote", 72, 80, "w-quote", wrap(COPY.quote, 26), COCOA)
        + pill("Primary button", COPY.cta.capitalize(), 72, 340, 292, 60, COCOA, CREAM, "box-shadow:0 16px 36px rgba(59,36,32,0.25);")
        + txt("Concept note", 72, 432, "w-micro", "A CONCEPT PIECE · NOTHING IS SENT OR STORED", COCOA)
    )
    style = "border-radius:56px;overflow:hidden;background:linear-gradient(165deg,#FADFC8 0%,#F6B992 48%,#EE9C94 100%);"
    return box("Invitation panel", LEFT, 3000, CONTENT_W, 520, style, inner)


def footer(top: int = 3600) -> str:
    items = "".join(
        txt(f"Nav item: {item.title()}", x, top + 52, "w-nav", item.title(), COCOA_SOFT)
        for item, x in zip(COPY.nav, (540, 668, 770))
    )
    return (
        box("Footer rule", LEFT, top, CONTENT_W, 1, "background:rgba(59,36,32,0.15);")
        + txt("Wordmark", LEFT, top + 54, "w-wordmark", COPY.house, COCOA)
        + items
        + txt("Origin", RIGHT - 300, top + 54, "w-micro", COPY.origin.upper(), COCOA_SOFT, 300, "right")
    )


# --------------------------------------------------------------------------------------------
# Page assembly
# --------------------------------------------------------------------------------------------
EXTRA_CSS = """
.w-statement{font:300 64px/1.12 'Fraunces',serif;letter-spacing:-0.03em}
.w-h2{font:300 80px/1 'Fraunces',serif;letter-spacing:-0.035em}
.w-body{font:500 19px/1.75 'Manrope',sans-serif}
.w-body-sm{font:500 16px/1.65 'Manrope',sans-serif}
.w-note-lg{font:300 56px/1 'Fraunces',serif;letter-spacing:-0.025em}
.w-spec{font:300 40px/1 'Fraunces',serif;letter-spacing:-0.02em}
.w-quote{font:italic 300 54px/1.22 'Fraunces',serif;letter-spacing:-0.025em}
"""


# Preview only: ?y=1700 slides the page up so one 900px window can be checked without scrolling.
PREVIEW_JS = (
    "<script>var y=+new URLSearchParams(location.search).get('y');"
    "if(y){document.querySelector('.frame').style.top=-y+'px';document.body.style.height='900px'}</script>"
)


def page(capture: bool) -> str:
    body = halo_body() + manifesto() + notes_section() + spec_strip() + cta_panel() + footer()
    label = f"Halo · Home page — Desktop (1440×{PAGE_H})"
    frame = f'<section class="frame" style="left:0px;background:{CREAM}" aria-label="{esc(label)}">{body}</section>'
    css = BASE_CSS.replace("__W__", str(FRAME_W)).replace("__H__", str(PAGE_H)) + EXTRA_CSS
    css += "" if capture else "html{overflow:auto}"
    head_extra = (RAF_SHIM + CAPTURE_SCRIPT) if capture else ""
    preview_js = "" if capture else PREVIEW_JS
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        "<title>Sillage — Halo home page</title>"
        '<link rel="preconnect" href="https://fonts.googleapis.com">'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        f'<link rel="stylesheet" href="{FONTS_URL}">'
        f"<style>{css}</style>{head_extra}</head>"
        f'<body aria-label="Sillage — Halo home page">{frame}{preview_js}</body></html>'
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "home-halo.html").write_text(page(capture=False), encoding="utf-8")
    (OUT_DIR / "home-halo-capture.html").write_text(page(capture=True), encoding="utf-8")
    print(f"Wrote {OUT_DIR / 'home-halo.html'} and home-halo-capture.html")


if __name__ == "__main__":
    main()
