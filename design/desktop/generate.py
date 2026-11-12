"""Generate the Sillage home-hero design directions as HTML for Figma capture.

Run from the project root:  python design/desktop/generate.py

Writes, into design/desktop/out/:
  hero-directions.html          local preview (add ?frame=a|b|c to see one frame at 1:1)
  hero-directions-capture.html  same page plus the Figma capture script

Brand copy is the locked copy from IDEA.md section 3. Everything else (colours, type, layout,
dimension numbers) is design exploration and is listed as placeholders in the hand-off notes.
"""

from __future__ import annotations

import html
from collections.abc import Sequence
from dataclasses import dataclass
from pathlib import Path

FRAME_W, FRAME_H, GAP, MARGIN = 1440, 900, 120, 96
BOARD_W = 3 * FRAME_W + 2 * GAP
OUT_DIR = Path(__file__).resolve().parent / "out"

Point = tuple[float, float]
Polygon = Sequence[Point]

@dataclass(frozen=True)
class Copy:
    house: str
    name: str
    lead: tuple[str, str]
    volume: str
    concentration: str
    price: str
    origin: str
    cta: str
    nav: tuple[str, ...]
    notes: tuple[tuple[str, str, str], ...]
    note_copy: tuple[str, str, str]
    manifesto: str
    quote: str


COPY = Copy(
    house="SILLAGE",
    name="OMBRE CLAIRE",
    lead=("A perfume is not a smell.", "It is the space you leave behind."),
    volume="50 ml",
    concentration="Extrait de Parfum",
    price="€240",
    origin="Grasse, France",
    cta="REQUEST AN INVITATION",
    nav=("OMBRE CLAIRE", "FRAGRANCE", "MAISON"),
    notes=(("01", "Bergamot", "TOP"), ("02", "Iris", "HEART"), ("03", "Ambergris", "BASE")),
    note_copy=(
        "Cold, green, brief. It exists to leave.",
        "Powder and root. The part that stays in the room.",
        "Salt, skin, warmth. Not a scent so much as a presence.",
    ),
    manifesto=(
        "Most fragrances announce themselves. This one waits. Bergamot opens and withdraws within the hour; "
        "what remains for the rest of the day is iris, ambrette, and a warm salt skin of ambergris. "
        "Worn close, it reads as your own warmth. Worn at a distance, it is only a suggestion that someone was here."
    ),
    quote="We did not make a perfume to be noticed. We made one to be remembered.",
)

# --------------------------------------------------------------------------------------------
# Geometry: a rectangular flacon with chamfered shoulders and cap (straight lines only).
# Local units, origin at the centre of the base, negative y is up.
# --------------------------------------------------------------------------------------------
_RIGHT_HALF = [(100, 0), (100, -268), (78, -290), (27, -290), (27, -310), (46, -310), (46, -370), (32, -384)]
OUTLINE: Polygon = _RIGHT_HALF + [(-x, y) for x, y in reversed(_RIGHT_HALF)]
PARTS: dict[str, Polygon] = {
    "body": [(-100, 0), (100, 0), (100, -268), (78, -290), (-78, -290), (-100, -268)],
    "neck": [(-27, -290), (27, -290), (27, -310), (-27, -310)],
    "cap": [(-46, -310), (46, -310), (46, -370), (32, -384), (-32, -384), (-46, -370)],
}
BOTTLE_H = 384
NOTE_YS = (312, 460, 575)  # vertical positions of the three note leaders in direction C


def place(poly: Polygon, cx: float, base_y: float, s: float) -> list[Point]:
    return [(cx + x * s, base_y + y * s) for x, y in poly]


def cast(poly: Polygon, cx: float, base_y: float, s: float, k: float, m: float) -> list[Point]:
    """Cast shadow: every point moves left by k*height and down by m*height."""
    return [(cx + x * s + k * y * s, base_y - m * y * s) for x, y in poly]


def shift(poly: Polygon, dx: float, dy: float) -> list[Point]:
    return [(x + dx, y + dy) for x, y in poly]


def skew(poly: Polygon, base_y: float, kx: float) -> list[Point]:
    """Horizontal skew about the base line. y grows downward, so a negative kx leans the top right."""
    return [(x + kx * (y - base_y), y) for x, y in poly]


def _area(poly: Polygon) -> float:
    return sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(poly, list(poly[1:]) + [poly[0]])) / 2


def _intersect(p1: Point, p2: Point, a: Point, b: Point) -> Point:
    (x1, y1), (x2, y2), (x3, y3), (x4, y4) = p1, p2, a, b
    den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if den == 0:
        return p2
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
    return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))


def clip_polygon(subject: Polygon, clip: Polygon) -> list[Point]:
    """Sutherland-Hodgman: clip a polygon to a convex polygon."""
    if len(clip) < 3:
        return []
    sign = 1.0 if _area(clip) > 0 else -1.0

    def inside(p: Point, a: Point, b: Point) -> bool:
        return sign * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) >= 0

    output = list(subject)
    for i, a in enumerate(clip):
        b = clip[(i + 1) % len(clip)]
        if not output:
            break
        source, output = output, []
        prev = source[-1]
        for cur in source:
            if inside(cur, a, b):
                if not inside(prev, a, b):
                    output.append(_intersect(prev, cur, a, b))
                output.append(cur)
            elif inside(prev, a, b):
                output.append(_intersect(prev, cur, a, b))
            prev = cur
    return output


def rect(x0: float, y0: float, x1: float, y1: float) -> list[Point]:
    return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]


# --------------------------------------------------------------------------------------------
# Small HTML / SVG builders
# --------------------------------------------------------------------------------------------
def esc(value: str) -> str:
    return html.escape(value, quote=True)


def num(n: float) -> str:
    return f"{n:.1f}".rstrip("0").rstrip(".")


def pts(poly: Polygon) -> str:
    return " ".join(f"{num(x)},{num(y)}" for x, y in poly)


def polygon(
    poly: Polygon, fill: str, opacity: float = 1.0, stroke: str = "none", sw: float = 1.0,
    stroke_opacity: float = 1.0,
) -> str:
    if len(poly) < 3:
        return ""
    return (
        f'<polygon points="{pts(poly)}" fill="{fill}" fill-opacity="{opacity}" '
        f'stroke="{stroke}" stroke-opacity="{stroke_opacity}" stroke-width="{sw}" stroke-linejoin="miter"/>'
    )


def line(
    x1: float, y1: float, x2: float, y2: float, stroke: str, sw: float = 1.0, dash: str = "",
    opacity: float = 1.0,
) -> str:
    dash_attr = f' stroke-dasharray="{dash}"' if dash else ""
    return (
        f'<line x1="{num(x1)}" y1="{num(y1)}" x2="{num(x2)}" y2="{num(y2)}" '
        f'stroke="{stroke}" stroke-opacity="{opacity}" stroke-width="{sw}"{dash_attr}/>'
    )


def gradient(gid: str, x1: float, y1: float, x2: float, y2: float, color: str, a0: float, a1: float) -> str:
    return (
        f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{num(x1)}" y1="{num(y1)}" '
        f'x2="{num(x2)}" y2="{num(y2)}"><stop offset="0" stop-color="{color}" stop-opacity="{a0}"/>'
        f'<stop offset="1" stop-color="{color}" stop-opacity="{a1}"/></linearGradient>'
    )


def svg_layer(label: str, defs: str, shapes: str) -> str:
    return (
        f'<svg class="layer" width="{FRAME_W}" height="{FRAME_H}" viewBox="0 0 {FRAME_W} {FRAME_H}" '
        f'aria-label="{esc(label)}"><defs>{defs}</defs>{shapes}</svg>'
    )


def txt(label: str, x: float, y: float, cls: str, content: str, color: str, width: float = 0, align: str = "") -> str:
    style = f"left:{num(x)}px;top:{num(y)}px;color:{color};"
    if width:
        style += f"width:{num(width)}px;"
    if align:
        style += f"text-align:{align};"
    return f'<div class="t {cls}" style="{style}" aria-label="{esc(label)}">{content}</div>'


def block(label: str, x: float, y: float, w: float, h: float, inner: str, extra: str = "") -> str:
    style = f"left:{num(x)}px;top:{num(y)}px;width:{num(w)}px;height:{num(h)}px;{extra}"
    return f'<div class="blk" style="{style}" aria-label="{esc(label)}">{inner}</div>'


def rule(label: str, x: float, y: float, w: float, h: float, color: str) -> str:
    style = f"left:{num(x)}px;top:{num(y)}px;width:{num(w)}px;height:{num(h)}px;background:{color};"
    return f'<div class="rule" style="{style}" aria-label="{esc(label)}"></div>'


def button(label: str, x: float, y: float, w: float, bg: str, fg: str, border: str) -> str:
    style = (
        f"left:{num(x)}px;top:{num(y)}px;width:{num(w)}px;height:53px;background:{bg};color:{fg};"
        f"border:1px solid {border};"
    )
    return f'<div class="btn" style="{style}" aria-label="{esc(label)}">{COPY.cta}</div>'


def header(ink: str, muted: str, hairline: str) -> str:
    wordmark = txt("Wordmark", MARGIN, 40, "wordmark", COPY.house, ink)
    items = ""
    for i, item in enumerate(COPY.nav):
        active = i == 0
        deco = f"border-bottom:1px solid {ink};padding-bottom:6px;" if active else "padding-bottom:7px;"
        color = ink if active else muted
        items += f'<span class="micro" style="color:{color};{deco}" aria-label="Nav item: {esc(item)}">{item}</span>'
    nav = block(
        "Navigation", 924, 36, 420, 28, items,
        "display:flex;justify-content:flex-end;align-items:flex-start;gap:44px;padding-top:4px;",
    )
    return rule("Header rule", MARGIN, 84, 1248, 1, hairline) + wordmark + nav


def scroll_cue(ink: str, muted: str) -> str:
    inner = (
        txt("Scroll cue label", 0, 0, "micro", "SCROLL", muted, 100, "right")
        + rule("Scroll cue line", 99, 26, 1, 36, ink)
    )
    return block("Scroll cue", 1244, 808, 100, 70, inner)


def frame(letter: str, name: str, x0: int, bg: str, body: str) -> str:
    label = f"Direction {letter} · {name} — Home hero (1440×900)"
    return (
        f'<section class="frame f-{letter.lower()}" style="left:{x0}px;background:{bg}" '
        f'aria-label="{esc(label)}">{body}</section>'
    )


# --------------------------------------------------------------------------------------------
# Direction A - Penumbra: dark room, one hard shaft of light, the bottle exists where it lands.
# --------------------------------------------------------------------------------------------
def direction_a(x0: int) -> str:
    ink, bone, ash_text, light, glass = "#0A0A0B", "#EDE8E1", "#8A867F", "#F7F2E9", "#7E8F8C"
    cx, base, s = 1090, 770, 1.5
    outline = place(OUTLINE, cx, base, s)
    beam = [(640, -60), (940, -60), (1500, 620), (1200, 620)]
    lit = [clip_polygon(place(p, cx, base, s), beam) for p in PARTS.values()]
    caustics = [
        shift(skew(outline, base, -0.10), -40, 14),
        shift(skew(outline, base, -0.16), -88, 26),
    ]
    shapes = (
        "".join(polygon(c, glass, 0.06) for c in caustics)
        + polygon(outline, "#141416")
        + "".join(polygon(p, "url(#a-light)") for p in lit)
        + line(560, base, 1344, base, "#1E1E21")
    )
    layer = svg_layer("Bottle, light and caustics", gradient("a-light", 900, 194, 1300, 700, light, 0.96, 0), shapes)
    title = block("Headline", MARGIN, 196, 780, 330, txt("Headline text", 0, 0, "a-display", "OMBRE<br>CLAIRE", bone))
    lead = block(
        "Hero lines", MARGIN, 584, 460, 80,
        txt("Hero lines text", 0, 0, "a-lead", "<br>".join(COPY.lead), bone),
    )
    spec_text = f'{COPY.volume.upper()} · {COPY.concentration.upper()} · {COPY.price}'
    cta = block(
        "Call to action", MARGIN, 700, 900, 54,
        button("Primary button", 0, 0, 286, bone, ink, bone) + txt("Spec line", 326, 21, "micro", spec_text, ash_text),
    )
    body = layer + title + lead + cta + scroll_cue(bone, ash_text) + header(bone, ash_text, "#3A3835")
    return frame("A", "Penumbra", x0, ink, body)


# --------------------------------------------------------------------------------------------
# Direction B - Ombre: bone paper, the bottle casts a long shadow that fades like a trail.
# --------------------------------------------------------------------------------------------
def direction_b(x0: int) -> str:
    paper, ink, muted = "#EDE8E1", "#1A1815", "#5F5A53"
    cx, base, s = 1040, 610, 1.2
    outline = place(OUTLINE, cx, base, s)
    body_poly = place(PARTS["body"], cx, base, s)
    shade = clip_polygon(body_poly, rect(cx - 120, base - 400, cx - 58, base + 10))
    shadow = cast(OUTLINE, cx, base, s, 0.95, 0.55)
    shapes = (
        line(MARGIN, base, 1344, base, ink, 1.0, opacity=0.18)
        + polygon(shadow, "url(#b-shadow)")
        + polygon(outline, "#F8F4EC", 1.0, ink, 1.0, stroke_opacity=0.3)
        + polygon(shade, "#D9D1C4")
        + polygon(place(PARTS["neck"], cx, base, s), "#3A3630")
        + polygon(place(PARTS["cap"], cx, base, s), ink)
        + f'<rect x="{num(cx + 104)}" y="{num(base - 330)}" width="4" height="300" fill="#FFFFFF" fill-opacity="0.9"/>'
    )
    defs = gradient("b-shadow", cx, base, cx - 440, base + 254, ink, 0.88, 0)
    layer = svg_layer("Bottle and cast shadow", defs, shapes)
    title = block("Headline", MARGIN, 120, 700, 400, txt("Headline text", 0, 0, "b-display", "Ombre<br>Claire", ink))
    lead = block(
        "Hero lines", MARGIN, 648, 480, 90,
        txt("Hero lines text", 0, 0, "b-lead", "<br>".join(COPY.lead), ink),
    )
    spec_text = f'{COPY.volume.upper()} · {COPY.concentration.upper()} · {COPY.price}'
    cta = block(
        "Call to action", MARGIN, 766, 460, 76,
        txt("CTA label", 0, 0, "micro", COPY.cta, ink)
        + rule("CTA underline", 0, 22, 214, 1, ink)
        + txt("Spec line", 0, 50, "micro", spec_text, muted),
    )
    body = layer + title + lead + cta + scroll_cue(ink, muted) + header(ink, muted, "rgba(26,24,21,0.25)")
    return frame("B", "Ombre", x0, paper, body)


# --------------------------------------------------------------------------------------------
# Direction C - Specimen: a museum plate. Pale glass ground, technical drawing of the flacon.
# --------------------------------------------------------------------------------------------
def _c_legend(ink: str, muted: str) -> str:
    """Notes legend on the left of the plate: number, name and position for each row."""
    legend = ""
    for (index, name, position), y in zip(COPY.notes, NOTE_YS):
        legend += txt(f"Note {index} number", MARGIN, y - 12, "micro", index, muted)
        legend += txt(f"Note {index} name", MARGIN + 54, y - 26, "c-note", name, ink)
        legend += txt(f"Note {index} position", 364, y - 12, "micro", position, muted)
    return block("Notes legend", 0, 0, 500, 640, legend, "pointer-events:none;")


def _c_specs(ink: str, muted: str) -> str:
    """Specification table on the right of the plate."""
    entries = (
        ("VOLUME", COPY.volume), ("CONCENTRATION", COPY.concentration),
        ("ORIGIN", COPY.origin), ("PRICE", COPY.price),
    )
    rows = ""
    for i, (label, value) in enumerate(entries):
        y = i * 72
        rows += rule(f"{label.title()} rule", 0, y, 216, 1, "rgba(15,20,18,0.35)")
        rows += txt(f"{label.title()} label", 0, y + 16, "micro", label, muted)
        rows += txt(f"{label.title()} value", 0, y + 36, "c-value", value, ink)
    return block("Specification table", 1128, 160, 216, 300, rows)


def direction_c(x0: int) -> str:
    ground, ink, muted, glass = "#E3E8E5", "#0F1412", "#4A5A55", "#7E8F8C"
    cx, base, s = 800, 620, 1.2
    left, right = cx - 100 * s, cx + 100 * s
    outline = place(OUTLINE, cx, base, s)
    body_poly = place(PARTS["body"], cx, base, s)
    juice_y = base - 0.78 * 290 * s
    juice = clip_polygon(body_poly, rect(left - 5, juice_y, right + 5, base + 5))
    grid = "".join(line(MARGIN + 208 * n, 84, MARGIN + 208 * n, 844, "rgba(15,20,18,0.07)") for n in range(7))
    dim_x, top_y = right + 75, base - BOTTLE_H * s
    dims = (
        line(dim_x, top_y, dim_x, base, muted)
        + line(cx + 32 * s + 10, top_y, dim_x + 8, top_y, muted)
        + line(right + 10, base, dim_x + 8, base, muted)
        + line(dim_x - 6, top_y, dim_x + 6, top_y, muted)
        + line(dim_x - 6, base, dim_x + 6, base, muted)
        + line(left, base + 42, right, base + 42, muted)
        + line(left, base + 36, left, base + 48, muted)
        + line(right, base + 36, right, base + 48, muted)
    )
    leaders = ""
    for (_, _, _), y in zip(COPY.notes, NOTE_YS):
        leaders += line(470, y, left + 24, y, glass, 1, "4 5")
        leaders += f'<circle cx="{num(left + 24)}" cy="{y}" r="3.5" fill="{ink}"/>'
    shapes = (
        f'<g aria-label="Plate grid">{grid}</g>'
        + polygon(outline, "#FFFFFF", 0.45, ink, 1.25)
        + polygon(juice, glass, 0.28)
        + polygon(place(PARTS["cap"], cx, base, s), ink)
        + line(cx - 78 * s, base - 290 * s, cx + 78 * s, base - 290 * s, ink, 1.0)
        + line(cx, 120, cx, base + 30, glass, 1.0, "6 6")
        + f'<g aria-label="Dimensions">{dims}</g><g aria-label="Note leaders">{leaders}</g>'
    )
    layer = svg_layer("Technical drawing of the flacon", "", shapes)
    lead = block(
        "Hero lines", MARGIN, 128, 540, 100,
        txt("Hero lines text", 0, 0, "c-lead", "<br>".join(COPY.lead), ink),
    )
    notes = _c_legend(ink, muted)
    dim_text = (
        txt("Height label", dim_x + 14, base - BOTTLE_H * s / 2, "micro", "H 118 MM", muted)
        + txt("Width label", cx - 36, base + 54, "micro", "W 54 MM", muted)
    )
    specs = _c_specs(ink, muted)
    title = block("Headline", MARGIN, 726, 1000, 130, txt("Headline text", 0, 0, "c-display", COPY.name, ink))
    cta = block("Call to action", 1094, 790, 250, 54, button("Primary button", 0, 0, 250, ink, ground, ink))
    body = layer + lead + notes + dim_text + specs + title + cta + header(ink, muted, "rgba(15,20,18,0.3)")
    return frame("C", "Specimen", x0, ground, body)


# --------------------------------------------------------------------------------------------
# Page assembly
# --------------------------------------------------------------------------------------------
FONTS_URL = (
    "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400..900"
    "&family=Inter+Tight:wght@300..600&family=Instrument+Serif:ital@0;1"
    "&family=Newsreader:ital,opsz,wght@0,6..72,300..500;1,6..72,300..500&display=swap"
)

BASE_CSS = """
*{margin:0;padding:0;box-sizing:border-box}
html{background:#d9d9d9}
body{position:relative;width:__W__px;height:900px;overflow:hidden;background:#d9d9d9;
  font-family:'Inter Tight',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.frame{position:absolute;top:0;width:1440px;height:900px;overflow:hidden}
.t{position:absolute;white-space:nowrap}
.blk{position:absolute;overflow:hidden;background:rgba(255,255,255,.001)}
.layer{position:absolute;left:0;top:0;width:1440px;height:900px}
.rule{position:absolute}
.btn{position:absolute;display:flex;align-items:center;justify-content:center;white-space:nowrap;
  font:500 11px/1 'Inter Tight',sans-serif;letter-spacing:.35em}
.micro{font:500 11px/1 'Inter Tight',sans-serif;letter-spacing:.35em;white-space:nowrap}
.wordmark{font:500 12px/1 'Inter Tight',sans-serif;letter-spacing:.4em}
.a-display{font:500 168px/0.92 'Bodoni Moda',serif;letter-spacing:-0.03em;font-optical-sizing:auto}
.a-lead{font:300 22px/1.5 'Inter Tight',sans-serif}
.b-display{font:400 212px/0.86 'Instrument Serif',serif;letter-spacing:-0.035em}
.b-lead{font:italic 400 30px/1.3 'Instrument Serif',serif}
.c-lead{font:italic 300 34px/1.25 'Newsreader',serif}
.c-note{font:italic 400 30px/1 'Newsreader',serif}
.c-display{font:300 120px/1 'Newsreader',serif;letter-spacing:-0.02em}
.c-value{font:400 24px/1 'Newsreader',serif}
"""

PREVIEW_CSS = "html{overflow:auto}" + "".join(
    f"body.only-{k}{{width:1440px}}body.only-{k} .frame:not(.f-{k}){{display:none}}body.only-{k} .f-{k}{{left:0!important}}"
    for k in "abc"
)
PREVIEW_JS = (
    "<script>var f=new URLSearchParams(location.search).get('frame');"
    "if(f){document.body.className='only-'+f}</script>"
)
RAF_SHIM = (
    "<script>window.requestAnimationFrame=function(cb){return setTimeout(function(){cb(performance.now())},16)};"
    "window.cancelAnimationFrame=clearTimeout;</script>"
)
CAPTURE_SCRIPT = '<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>'


def page(capture: bool) -> str:
    frames = "".join(
        fn(i * (FRAME_W + GAP)) for i, fn in enumerate((direction_a, direction_b, direction_c))
    )
    css = BASE_CSS.replace("__W__", str(BOARD_W)) + ("" if capture else PREVIEW_CSS)
    head_extra = (RAF_SHIM + CAPTURE_SCRIPT) if capture else ""
    body_extra = "" if capture else PREVIEW_JS
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        "<title>Sillage — hero directions</title>"
        '<link rel="preconnect" href="https://fonts.googleapis.com">'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        f'<link rel="stylesheet" href="{FONTS_URL}">'
        f"<style>{css}</style>{head_extra}</head>"
        f'<body aria-label="Sillage — hero directions">{frames}{body_extra}</body></html>'
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "hero-directions.html").write_text(page(capture=False), encoding="utf-8")
    (OUT_DIR / "hero-directions-capture.html").write_text(page(capture=True), encoding="utf-8")
    print(f"Wrote {OUT_DIR / 'hero-directions.html'} and hero-directions-capture.html")


if __name__ == "__main__":
    main()
