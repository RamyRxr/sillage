"""Shared pieces for the Sillage store pages (Halo style): products, header, footer, cards, form bits.

Only Ombre Claire and its copy are locked brand content. The other five perfumes, every price except
Ombre Claire's, the service promises and the discovery set are placeholders for the demo.
"""

from __future__ import annotations

from dataclasses import dataclass

from generate import CAPTURE_SCRIPT, COPY, FRAME_W, OUT_DIR, RAF_SHIM, esc, txt
from halo_page import CONTENT_W, EXTRA_CSS
from inner_pages import INNER_CSS, PREVIEW_JS
from warm import (
    AMBER, BASE_CSS, CLAY, COCOA, COCOA_SOFT, CREAM, FONTS_URL, GLASS, GLASS_EDGE, LEFT, PEACH, RIGHT, ROSE,
    box, glass, image_slot, orb, pill,
)

RULE = "background:rgba(59,36,32,0.15);"
PANEL_GRADIENT = "linear-gradient(165deg,#FADFC8 0%,#F6B992 48%,#EE9C94 100%)"
BUTTON_GRADIENT = "linear-gradient(100deg,#F8C39A 0%,#F2A08F 100%)"
SHADOW_WARM = "box-shadow:0 14px 34px rgba(224,128,96,0.35);"
SHADOW_DARK = "box-shadow:0 16px 36px rgba(59,36,32,0.25);"
OUTLINE = "border:1px solid rgba(59,36,32,0.35);"
NAV = ("Home", "Shop", "Our story")
FOOTER_LINKS = (("Shop", 470), ("Our story", 546), ("Delivery & returns", 652), ("Contact", 817))
SERVICES = (
    ("Made in Grasse", "SMALL BATCHES, BY HAND"), ("Free delivery", "ON ORDERS OVER €150"),
    ("Two samples", "WITH EVERY ORDER"), ("30-day returns", "ON UNOPENED BOTTLES"),
)
SEARCH_ICON = (
    '<svg class="abs" style="left:0;top:0" width="46" height="46" viewBox="0 0 46 46" aria-label="Search icon">'
    f'<circle cx="21" cy="21" r="7" fill="none" stroke="{COCOA}" stroke-width="1.6"/>'
    f'<path d="M26.5 26.5L32 32" fill="none" stroke="{COCOA}" stroke-width="1.6" stroke-linecap="round"/></svg>'
)


@dataclass(frozen=True)
class Product:
    name: str
    family: str
    notes: str
    price: str
    rgb: str
    color: str
    tag: str = ""


PRODUCTS = (
    Product("Ombre Claire", "Amber", "Bergamot · Iris · Ambergris", COPY.price, "240,182,107", AMBER, "Signature"),
    Product("Peau de Sel", "Fresh", "Sea salt · Neroli · White musk", "€210", "247,201,165", PEACH, "New"),
    Product("Iris Blanc", "Floral", "Iris · Violet leaf · Cashmere", "€225", "233,154,154", ROSE),
    Product("Nuit Ambrée", "Amber", "Amber · Vanilla · Tonka", "€240", "226,140,110", CLAY),
    Product("Bois Tendre", "Woody", "Cedar · Sandalwood · Fig", "€215", "214,170,120", AMBER),
    Product("Fleur d'Ombre", "Floral", "Rose · Peony · Soft suede", "€230", "238,160,170", ROSE),
)


# --------------------------------------------------------------------------------------------
# Small pieces
# --------------------------------------------------------------------------------------------
def rtxt(label: str, right: float, y: float, cls: str, content: str, color: str, w: float = 160) -> str:
    """Right-aligned text whose right edge sits at `right`."""
    return txt(label, right - w, y, cls, content, color, w, "right")


def option(label: str, text: str, x: float, y: float, w: float, active: bool, h: float = 52) -> str:
    """A selectable pill: filled when active, glass when not."""
    if active:
        return pill(label, text, x, y, w, h, COCOA, CREAM)
    return pill(label, text, x, y, w, h, GLASS, COCOA, f"border:1px solid {GLASS_EDGE};box-shadow:0 10px 26px rgba(176,92,62,0.12);")


def stepper(x: float, y: float, qty: int = 1, w: float = 132, h: float = 48) -> str:
    ty = h / 2 - 9
    inner = (
        txt("Minus", 22, ty, "w-btn", "−", COCOA)
        + txt("Quantity", w / 2 - 16, ty, "w-btn", str(qty), COCOA, 30, "center")
        + txt("Plus", w - 34, ty, "w-btn", "+", COCOA)
    )
    return glass("Quantity stepper", x, y, w, h, h / 2, inner)


def field(label: str, value: str, x: float, y: float, w: float) -> str:
    style = "border-radius:20px;background:rgba(255,255,255,0.62);border:1px solid rgba(59,36,32,0.14);overflow:hidden;"
    inner = (
        txt(f"{label} label", 20, 13, "w-micro", label.upper(), COCOA_SOFT)
        + txt(f"{label} value", 20, 35, "w-field", value, COCOA)
    )
    return box(f"Field: {label}", x, y, w, 64, style, inner)


# --------------------------------------------------------------------------------------------
# Header, footer, shared sections
# --------------------------------------------------------------------------------------------
def nav_bar(current: int) -> str:
    w, h = 420, 52
    cell = (w - 12) / len(NAV)
    inner = ""
    for i, item in enumerate(NAV):
        active = i == current
        lifted = "background:rgba(255,255,255,0.92);box-shadow:0 6px 18px rgba(176,92,62,0.14);" if active else ""
        style = (
            "display:flex;align-items:center;justify-content:center;border-radius:20px;"
            f"color:{COCOA if active else COCOA_SOFT};{lifted}"
        )
        inner += box(f"Nav item: {item}", 6 + i * cell, 6, cell, h - 12, style, f'<span class="w-nav">{item}</span>')
    return glass("Navigation", (FRAME_W - w) / 2, 28, w, h, h / 2, inner)


def store_header(current: int, cart_count: int = 2) -> str:
    """Wordmark, nav, search and cart. Pass current=-1 when no nav item is active."""
    search = glass("Search button", RIGHT - 214, 30, 48, 48, 24, SEARCH_ICON)
    cart = pill("Cart button", f"Cart · {cart_count}", RIGHT - 150, 30, 150, 48, "transparent", COCOA, OUTLINE)
    return txt("Wordmark", LEFT, 46, "w-wordmark", COPY.house, COCOA) + nav_bar(current) + search + cart


def store_footer(top: int) -> str:
    links = "".join(txt(f"Footer link: {name}", x, top + 52, "w-nav", esc(name), COCOA_SOFT) for name, x in FOOTER_LINKS)
    return (
        box("Footer rule", LEFT, top, CONTENT_W, 1, RULE)
        + txt("Wordmark", LEFT, top + 54, "w-wordmark", COPY.house, COCOA)
        + links
        + rtxt("Origin", RIGHT, top + 54, "w-micro", COPY.origin.upper(), COCOA_SOFT, 300)
    )


def services_strip(top: int) -> str:
    inner, col = "", CONTENT_W / len(SERVICES)
    for i, (title, note) in enumerate(SERVICES):
        if i:
            inner += box("Divider", i * col, 32, 1, 86, "background:rgba(59,36,32,0.14);")
        inner += txt(f"Service: {title}", i * col + 36, 46, "w-time", title, COCOA)
        inner += txt(f"Service note: {title}", i * col + 36, 90, "w-micro", note, COCOA_SOFT)
    return glass("Services strip", LEFT, top, CONTENT_W, 150, 40, inner)


def band(top: int, heading: str, note: str, button: str) -> str:
    """Closing call-to-action panel."""
    inner = (
        orb("Band glow", 1000, 140, 760, "255,246,232", 0.9)
        + txt("Band headline", 64, 60, "w-h2", heading, COCOA)
        + txt("Band note", 64, 180, "w-micro", note, COCOA)
        + pill("Primary button", button, CONTENT_W - 64 - 292, 110, 292, 60, COCOA, CREAM, SHADOW_DARK)
    )
    return box("Call to action band", LEFT, top, CONTENT_W, 280, f"border-radius:56px;overflow:hidden;background:{PANEL_GRADIENT};", inner)


def product_card(p: Product, x: float, y: float) -> str:
    w, h = 392, 600
    tag = pill("Tag", p.tag, 36, 36, 112, 34, "rgba(255,255,255,0.92)", COCOA) if p.tag else ""
    inner = (
        orb(f"{p.name} glow", w / 2, 90, 520, p.rgb, 0.5)
        + image_slot(f"{p.name} image slot", 20, 20, w - 42, 330, "28px", ("PRODUCT IMAGE", "EMPTY SLOT · 1:1"))
        + tag
        + txt(f"{p.name} family", 28, 378, "w-micro", f"{p.family.upper()} · 50 ML", COCOA_SOFT)
        + txt(f"{p.name} name", 28, 404, "w-card-name", p.name, COCOA)
        + txt(f"{p.name} notes", 28, 460, "w-body-sm", p.notes, COCOA_SOFT)
        + box("Card rule", 28, 508, w - 58, 1, RULE)
        + txt(f"{p.name} price", 28, 534, "w-price-sm", p.price, COCOA)
        + pill("Add to cart button", "Add to cart", w - 180, 524, 150, 48, COCOA, CREAM)
    )
    return glass(f"Product card: {p.name}", x, y, w, h, 40, inner)


# --------------------------------------------------------------------------------------------
# Page assembly
# --------------------------------------------------------------------------------------------
STORE_CSS = """
.w-card-name{font:300 40px/1 'Fraunces',serif;letter-spacing:-0.02em}
.w-price-sm{font:400 28px/1 'Fraunces',serif}
.w-field{font:500 16px/1 'Manrope',sans-serif}
"""


def frame(slug: str, name: str, x0: int, page_h: int, body: str, device: str = "Desktop", width: int = FRAME_W) -> str:
    label = f"Store · {name} — {device} ({width}×{page_h})"
    return (
        f'<section class="frame f-{slug}" style="left:{x0}px;background:{CREAM}" '
        f'aria-label="{esc(label)}">{body}</section>'
    )


def document(
    title: str, frames: str, slugs: tuple[str, ...], board_w: int, page_h: int, capture: bool,
    extra_css: str = "", preview_js: str = PREVIEW_JS,
) -> str:
    preview_css = "html{overflow:auto}" + "".join(
        f"body.only-{k}{{width:1440px}}body.only-{k} .frame:not(.f-{k}){{display:none}}body.only-{k} .f-{k}{{left:0!important}}"
        for k in slugs
    )
    css = BASE_CSS.replace("__W__", str(board_w)).replace("__H__", str(page_h)) + EXTRA_CSS + INNER_CSS + STORE_CSS + extra_css
    css += "" if capture else preview_css
    head_extra = (RAF_SHIM + CAPTURE_SCRIPT) if capture else ""
    body_extra = "" if capture else preview_js
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f"<title>{esc(title)}</title>"
        '<link rel="preconnect" href="https://fonts.googleapis.com">'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        f'<link rel="stylesheet" href="{FONTS_URL}">'
        f"<style>{css}</style>{head_extra}</head>"
        f'<body aria-label="{esc(title)}">{frames}{body_extra}</body></html>'
    )


def write_pages(
    stem: str, title: str, frames: str, slugs: tuple[str, ...], board_w: int, page_h: int,
    extra_css: str = "", preview_js: str = PREVIEW_JS,
) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / f"{stem}.html").write_text(document(title, frames, slugs, board_w, page_h, False, extra_css, preview_js), encoding="utf-8")
    (OUT_DIR / f"{stem}-capture.html").write_text(document(title, frames, slugs, board_w, page_h, True, extra_css, preview_js), encoding="utf-8")
    print(f"Wrote {OUT_DIR / stem}.html and {stem}-capture.html")
