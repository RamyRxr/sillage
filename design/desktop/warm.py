"""Warm and sensual home-hero designs (round 2) as HTML for Figma capture.

Run from the project root:  python design/desktop/warm.py

Writes, into design/desktop/out/:
  hero-warm.html          local preview (add ?frame=halo|drift to see one frame at 1:1)
  hero-warm-capture.html  same page plus the Figma capture script

Image areas are deliberately empty, labelled slots so the focus stays on the UI. Brand copy is the
locked copy imported from generate.py; everything else is design exploration.
"""

from __future__ import annotations

import math

from generate import CAPTURE_SCRIPT, COPY, FRAME_H, FRAME_W, GAP, OUT_DIR, RAF_SHIM, esc, num, svg_layer, txt

LEFT = 80
RIGHT = FRAME_W - LEFT
BOARD_W = 2 * FRAME_W + GAP

CREAM, PEACH, ROSE, AMBER = "#FBF4EC", "#F7C9A5", "#E99A9A", "#F0B66B"
CLAY, COCOA, COCOA_SOFT = "#A4483C", "#3B2420", "#7A5A52"
GLASS = "rgba(255,255,255,0.42)"
GLASS_EDGE = "rgba(255,255,255,0.9)"
GLASS_SHADOW = "0 24px 60px rgba(176,92,62,0.16)"


# --------------------------------------------------------------------------------------------
# Building blocks
# --------------------------------------------------------------------------------------------
def box(label: str, x: float, y: float, w: float, h: float, style: str = "", inner: str = "") -> str:
    base = f"left:{num(x)}px;top:{num(y)}px;width:{num(w)}px;height:{num(h)}px;"
    return f'<div class="abs" style="{base}{style}" aria-label="{esc(label)}">{inner}</div>'


def orb(label: str, cx: float, cy: float, d: float, rgb: str, alpha: float) -> str:
    """Soft glowing circle: a radial gradient that fades to transparent at its edge."""
    fade = (
        f"radial-gradient(closest-side,rgba({rgb},{alpha}) 0%,"
        f"rgba({rgb},{alpha * 0.5}) 45%,rgba({rgb},0) 100%)"
    )
    return box(label, cx - d / 2, cy - d / 2, d, d, f"border-radius:50%;background:{fade};")


def glass(label: str, x: float, y: float, w: float, h: float, radius: float, inner: str = "") -> str:
    style = (
        f"border-radius:{num(radius)}px;background:{GLASS};border:1px solid {GLASS_EDGE};"
        f"box-shadow:{GLASS_SHADOW};overflow:hidden;"
    )
    return box(label, x, y, w, h, style, inner)


def pill(label: str, text: str, x: float, y: float, w: float, h: float, bg: str, fg: str, extra: str = "") -> str:
    style = (
        f"border-radius:{num(h / 2)}px;background:{bg};color:{fg};display:flex;"
        f"align-items:center;justify-content:center;{extra}"
    )
    return box(label, x, y, w, h, style, f'<span class="w-btn">{esc(text)}</span>')


def blob(cx: float, cy: float, r: float, wobble: float, phase: float, fill: str, opacity: float) -> str:
    """A smooth, organic closed shape (Catmull-Rom spline through 8 wobbling points)."""
    n = 8
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        rr = r * (1 + wobble * math.sin(3 * a + phase) + 0.6 * wobble * math.cos(2 * a + phase * 1.7))
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d = f"M{num(pts[0][0])},{num(pts[0][1])}"
    for i in range(n):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C{num(c1[0])},{num(c1[1])} {num(c2[0])},{num(c2[1])} {num(p2[0])},{num(p2[1])}"
    return f'<path d="{d} Z" fill="{fill}" fill-opacity="{opacity}"/>'


def arch_path(x: float, y: float, w: float, h: float, rb: float) -> str:
    """An arch: a semicircular top and slightly rounded bottom corners."""
    r = w / 2
    return (
        f"M{num(x)},{num(y + r)} A{num(r)},{num(r)} 0 0 1 {num(x + w)},{num(y + r)} "
        f"L{num(x + w)},{num(y + h - rb)} Q{num(x + w)},{num(y + h)} {num(x + w - rb)},{num(y + h)} "
        f"L{num(x + rb)},{num(y + h)} Q{num(x)},{num(y + h)} {num(x)},{num(y + h - rb)} Z"
    )


def image_slot(label: str, x: float, y: float, w: float, h: float, radius: str, caption: tuple[str, str]) -> str:
    """An intentionally empty image area with a small caption, ready for a photo."""
    style = (
        f"border-radius:{radius};border:1.5px dashed rgba(59,36,32,0.32);"
        "background:linear-gradient(180deg,rgba(255,255,255,0.55) 0%,rgba(255,232,214,0.3) 100%);"
    )
    inner = (
        txt(f"{label} caption", 0, h / 2 - 20, "w-micro", caption[0], COCOA_SOFT, w, "center")
        + txt(f"{label} size", 0, h / 2 + 4, "w-micro", caption[1], COCOA_SOFT, w, "center")
    )
    return box(label, x, y, w, h, style, inner)


def scroll_cue(x: float, y: float) -> str:
    arrow = (
        '<svg class="abs" style="left:0;top:0" width="56" height="56" viewBox="0 0 56 56" aria-label="Arrow">'
        f'<path d="M28 18V38M20 31L28 39L36 31" fill="none" stroke="{COCOA}" stroke-width="1.6" '
        'stroke-linecap="round" stroke-linejoin="round"/></svg>'
    )
    return glass("Scroll cue", x, y, 56, 56, 28, arrow) + txt("Scroll label", x + 76, y + 25, "w-micro", "SCROLL", COCOA_SOFT)


def nav_pill(x: float, y: float, w: float = 420, h: float = 52, current: int = 0) -> str:
    cell = (w - 12) / 3
    inner = ""
    for i, item in enumerate(COPY.nav):
        active = i == current
        chip = "background:rgba(255,255,255,0.92);box-shadow:0 6px 18px rgba(176,92,62,0.14);" if active else ""
        style = (
            "display:flex;align-items:center;justify-content:center;border-radius:20px;"
            f"color:{COCOA if active else COCOA_SOFT};{chip}"
        )
        inner += box(f"Nav item: {item.title()}", 6 + i * cell, 6, cell, h - 12, style, f'<span class="w-nav">{item.title()}</span>')
    return glass("Navigation", x, y, w, h, h / 2, inner)


def dot(x: float, y: float, color: str) -> str:
    return box("Note colour", x, y, 12, 12, f"border-radius:50%;background:{color};")


def warm_frame(slug: str, name: str, x0: int, body: str) -> str:
    label = f"Warm · {name} — Home hero (1440×900)"
    return (
        f'<section class="frame f-{slug}" style="left:{x0}px;background:{CREAM}" '
        f'aria-label="{esc(label)}">{body}</section>'
    )


# --------------------------------------------------------------------------------------------
# Layout 1 - Halo: a glowing sun behind an arch window, liquid shapes and echoing arch lines.
# --------------------------------------------------------------------------------------------
def _halo_notes_card() -> str:
    rows = txt("Notes title", 28, 26, "w-micro", "THE THREE NOTES", COCOA_SOFT)
    for i, ((_, name, position), color) in enumerate(zip(COPY.notes, (AMBER, ROSE, CLAY))):
        y = 64 + i * 62
        rows += dot(28, y + 8, color) + txt(f"{name} name", 52, y, "w-note", name, COCOA)
        rows += txt(f"{name} position", 28, y + 10, "w-micro", position, COCOA_SOFT, 216, "right")
        if i < 2:
            rows += box("Row rule", 28, y + 44, 216, 1, "background:rgba(59,36,32,0.12);")
    return glass("Notes card", 1088, 170, 272, 262, 32, rows)


def _halo_price_badge() -> str:
    inner = (
        txt("Price", 0, 50, "w-price", COPY.price, COCOA, 154, "center")
        + txt("Volume", 0, 108, "w-micro", COPY.volume.upper(), COCOA_SOFT, 154, "center")
    )
    return glass("Price badge", 1160, 478, 156, 156, 78, inner)


def halo_header(current: int = 0) -> str:
    invite = pill("Invitation link", "Invitation", RIGHT - 150, 30, 150, 48, "transparent", COCOA, "border:1px solid rgba(59,36,32,0.35);")
    return txt("Wordmark", LEFT, 46, "w-wordmark", COPY.house, COCOA) + nav_pill((FRAME_W - 420) / 2, 28, current=current) + invite


def halo_body() -> str:
    """Everything inside the Halo hero frame, so the full home page can reuse it."""
    ax, ay, aw, ah = 640, 150, 420, 640
    glow = (
        orb("Glow · sun", 960, 430, 1060, "247,183,127", 0.9)
        + orb("Glow · blush", 140, 860, 780, "233,154,154", 0.55)
        + orb("Glow · gold", 300, 90, 560, "255,226,184", 0.85)
    )
    shapes = (
        blob(880, 470, 330, 0.12, 0.4, PEACH, 0.55)
        + blob(1010, 570, 250, 0.16, 2.1, ROSE, 0.35)
        + blob(700, 330, 200, 0.14, 4.0, AMBER, 0.4)
        + "".join(
            f'<path d="{arch_path(ax - o, ay - o, aw + 2 * o, ah + 2 * o, 36 + o)}" fill="none" '
            f'stroke="{COCOA}" stroke-opacity="{a}" stroke-width="1"/>'
            for o, a in ((26, 0.22), (52, 0.14), (78, 0.08))
        )
    )
    slot = image_slot("Bottle image slot", ax, ay, aw, ah, f"{aw // 2}px {aw // 2}px 36px 36px", ("BOTTLE IMAGE", "EMPTY SLOT · 4:5"))
    title = txt("Headline", LEFT, 168, "w-display", f'Ombre<br><span style="font-style:italic;color:{CLAY}">Claire</span>', COCOA)
    eyebrow = txt("Eyebrow", LEFT, 122, "w-micro", "BRIGHT SHADOW · EXTRAIT DE PARFUM", COCOA_SOFT)
    lead = txt("Hero lines", LEFT, 612, "w-lead", "<br>".join(COPY.lead), COCOA_SOFT)
    cta = pill(
        "Primary button", COPY.cta.capitalize(), LEFT, 706, 292, 60,
        "linear-gradient(100deg,#F8C39A 0%,#F2A08F 100%)", COCOA, "box-shadow:0 14px 34px rgba(224,128,96,0.35);",
    )
    body = (
        glow + svg_layer("Liquid shapes and arch lines", "", shapes) + slot + title + eyebrow + lead + cta
        + _halo_notes_card() + _halo_price_badge() + scroll_cue(LEFT, 806) + halo_header()
    )
    return body


def halo(x0: int) -> str:
    return warm_frame("halo", "Halo", x0, halo_body())


# --------------------------------------------------------------------------------------------
# Layout 2 - Drift: a tall rounded image panel, a headline that crosses its edge, floating glass.
# --------------------------------------------------------------------------------------------
def _drift_panel() -> str:
    pw, ph = 636, 844
    inner = (
        orb("Panel glow", 440, 220, 640, "255,246,232", 0.9)
        + box(
            "Inset frame", 28, 28, pw - 56, ph - 56,
            "border-radius:36px;border:1.5px dashed rgba(255,255,255,0.85);",
            txt("Slot caption", 0, ph / 2 - 48, "w-micro", "BOTTLE IMAGE", COCOA_SOFT, pw - 56, "center")
            + txt("Slot size", 0, ph / 2 - 24, "w-micro", "EMPTY SLOT · PORTRAIT", COCOA_SOFT, pw - 56, "center"),
        )
    )
    style = (
        "border-radius:56px;overflow:hidden;"
        "background:linear-gradient(165deg,#FADFC8 0%,#F6B992 48%,#EE9C94 100%);"
    )
    return box("Image panel", 776, 28, pw, ph, style, inner)


def _drift_chip(name: str, position: str, color: str, x: float, y: float) -> str:
    inner = (
        dot(22, 22, color)
        + txt(f"{name} name", 44, 17, "w-chip", name, COCOA)
        + txt(f"{name} position", 0, 23, "w-micro", position, COCOA_SOFT, 222, "right")
    )
    return glass(f"Note chip: {name}", x, y, 244, 56, 28, inner)


def _drift_price_card() -> str:
    inner = (
        txt("Concentration", 24, 24, "w-micro", COPY.concentration.upper(), COCOA_SOFT)
        + txt("Price", 24, 52, "w-price", COPY.price, COCOA)
        + txt("Volume", 24, 100, "w-micro", f"{COPY.volume.upper()} · {COPY.origin.upper()}", COCOA_SOFT)
    )
    return glass("Price card", 640, 520, 270, 140, 30, inner)


def _drift_header() -> str:
    items = ""
    for i, item in enumerate(COPY.nav):
        color = COCOA if i == 0 else COCOA_SOFT
        x = (420, 560, 672)[i]
        items += txt(f"Nav item: {item.title()}", x, 50, "w-nav", item.title(), color)
    marker = box("Active marker", 420, 76, 6, 6, f"border-radius:50%;background:{CLAY};")
    invite = pill("Invitation link", "Invitation", 1218, 52, 150, 48, GLASS, COCOA, f"border:1px solid {GLASS_EDGE};")
    return txt("Wordmark", LEFT, 52, "w-wordmark", COPY.house, COCOA) + items + marker + invite


def drift(x0: int) -> str:
    glow = orb("Glow · amber", 220, 150, 760, "247,183,127", 0.55) + orb("Glow · blush", 520, 930, 860, "233,154,154", 0.4)
    title = txt("Headline", LEFT, 262, "w-display-one", f'Ombre <span style="font-style:italic;color:{CLAY}">Claire</span>', COCOA)
    eyebrow = txt("Eyebrow", LEFT, 222, "w-micro", "BRIGHT SHADOW · EXTRAIT DE PARFUM", COCOA_SOFT)
    lead = txt("Hero lines", LEFT, 540, "w-lead-serif", "<br>".join(COPY.lead), COCOA)
    cta = pill(
        "Primary button", COPY.cta.capitalize(), LEFT, 684, 292, 60, COCOA, CREAM,
        "box-shadow:0 16px 36px rgba(59,36,32,0.25);",
    )
    chips = "".join(
        _drift_chip(name, position, color, x, y)
        for (_, name, position), color, (x, y) in zip(
            COPY.notes, (AMBER, ROSE, CLAY), ((830, 700), (1070, 752), (868, 804))
        )
    )
    body = (
        glow + _drift_panel() + title + eyebrow + lead + cta + _drift_price_card() + chips
        + scroll_cue(LEFT, 790) + _drift_header()
    )
    return warm_frame("drift", "Drift", x0, body)


# --------------------------------------------------------------------------------------------
# Page assembly
# --------------------------------------------------------------------------------------------
FONTS_URL = (
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600"
    "&family=Manrope:wght@300..800&display=swap"
)

BASE_CSS = """
*{margin:0;padding:0;box-sizing:border-box}
html{background:#d9d9d9}
body{position:relative;width:__W__px;height:__H__px;overflow:hidden;background:#d9d9d9;
  font-family:'Manrope',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.frame{position:absolute;top:0;width:1440px;height:__H__px;overflow:hidden}
.abs{position:absolute}
.t{position:absolute;white-space:nowrap}
.layer{position:absolute;left:0;top:0;width:1440px;height:900px}
.w-wordmark{font:800 13px/1 'Manrope',sans-serif;letter-spacing:.42em}
.w-nav{font:600 14px/1 'Manrope',sans-serif;letter-spacing:.01em}
.w-micro{font:700 11px/1 'Manrope',sans-serif;letter-spacing:.2em}
.w-btn{font:700 15px/1 'Manrope',sans-serif;letter-spacing:.02em;white-space:nowrap}
.w-display{font:300 224px/0.86 'Fraunces',serif;letter-spacing:-0.045em}
.w-display-one{font:300 190px/1 'Fraunces',serif;letter-spacing:-0.04em}
.w-lead{font:500 21px/1.55 'Manrope',sans-serif}
.w-lead-serif{font:italic 300 32px/1.3 'Fraunces',serif}
.w-note{font:400 26px/1 'Fraunces',serif}
.w-chip{font:400 22px/1 'Fraunces',serif}
.w-price{font:300 46px/1 'Fraunces',serif;letter-spacing:-0.02em}
"""

SLUGS = ("halo", "drift")
PREVIEW_CSS = "html{overflow:auto}" + "".join(
    f"body.only-{k}{{width:1440px}}body.only-{k} .frame:not(.f-{k}){{display:none}}body.only-{k} .f-{k}{{left:0!important}}"
    for k in SLUGS
)
PREVIEW_JS = (
    "<script>var f=new URLSearchParams(location.search).get('frame');"
    "if(f){document.body.className='only-'+f}</script>"
)


def page(capture: bool) -> str:
    frames = halo(0) + drift(FRAME_W + GAP)
    css = BASE_CSS.replace("__W__", str(BOARD_W)).replace("__H__", str(FRAME_H)) + ("" if capture else PREVIEW_CSS)
    head_extra = (RAF_SHIM + CAPTURE_SCRIPT) if capture else ""
    body_extra = "" if capture else PREVIEW_JS
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        "<title>Sillage — warm hero</title>"
        '<link rel="preconnect" href="https://fonts.googleapis.com">'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        f'<link rel="stylesheet" href="{FONTS_URL}">'
        f"<style>{css}</style>{head_extra}</head>"
        f'<body aria-label="Sillage — warm hero">{frames}{body_extra}</body></html>'
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "hero-warm.html").write_text(page(capture=False), encoding="utf-8")
    (OUT_DIR / "hero-warm-capture.html").write_text(page(capture=True), encoding="utf-8")
    print(f"Wrote {OUT_DIR / 'hero-warm.html'} and hero-warm-capture.html")


if __name__ == "__main__":
    main()
