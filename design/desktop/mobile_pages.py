"""Sillage store, tall mobile pages: Home, Shop, Product, Our story (390 wide, Halo style).

Run from the project root:  python design/desktop/mobile_pages.py

Writes design/desktop/out/mobile-pages.html (preview: ?x=1020&y=1200 slides the board) and
mobile-pages-capture.html. The four frames share one height, set by the longest page.
"""

from __future__ import annotations

from generate import COPY, txt
from halo_page import ACCENT, NOTE_COLORS, chip, echo_rects, svg_at, wrap
from inner_pages import TIMELINE
from mobile_common import (
    MCW, MW, MX, common_height, finish, gap, m_arch_echoes, m_grid, m_heading, m_panel, m_services, m_write, stack,
)
from store_common import BUTTON_GRADIENT, OUTLINE, PRODUCTS, RULE, SHADOW_DARK, SHADOW_WARM, option, rtxt, stepper
from store_pages import FAMILIES, STORY_NUMBERS, STORY_PARAGRAPHS
from warm import COCOA, COCOA_SOFT, CREAM, PEACH, ROSE, blob, box, dot, glass, image_slot, orb, pill

RINGS = ((12, 0.2), (24, 0.12), (36, 0.07))
RINGS_LIGHT = ((12, 0.7), (24, 0.45), (36, 0.25))
SIZES = ("10 ml", "50 ml", "100 ml")
TRAIL = (
    "border-radius:3px;background:linear-gradient(180deg,rgba(240,182,107,0.95) 0%,"
    "rgba(233,154,154,0.7) 33%,rgba(190,110,92,0.45) 66%,rgba(190,110,92,0.1) 100%);"
)


def _glow(sun: tuple[float, float], blush: tuple[float, float], gold: tuple[float, float]) -> str:
    return (
        orb("Glow · sun", sun[0], sun[1], 620, "247,183,127", 0.8)
        + orb("Glow · blush", blush[0], blush[1], 420, "233,154,154", 0.5)
        + orb("Glow · gold", gold[0], gold[1], 320, "255,226,184", 0.85)
    )


# --------------------------------------------------------------------------------------------
# Home
# --------------------------------------------------------------------------------------------
def _home_hero(_top: int) -> tuple[str, int]:
    ax, ay, aw, ah = 65, 320, 260, 400
    shapes = blob(210, 520, 200, 0.12, 0.4, PEACH, 0.55) + blob(270, 610, 150, 0.16, 2.1, ROSE, 0.35) + m_arch_echoes(ax, ay, aw, ah)
    badge = glass(
        "Count badge", 262, 640, 96, 96, 48,
        txt("Count", 0, 18, "m-price-lg", str(len(PRODUCTS)), COCOA, 94, "center")
        + txt("Count label", 0, 62, "w-micro", "PERFUMES", COCOA_SOFT, 94, "center"),
    )
    html = (
        _glow((195, 500), (20, 900), (90, 60))
        + svg_at("Liquid shapes and arch lines", 0, 0, MW, 960, shapes)
        + image_slot("Hero image slot", ax, ay, aw, ah, "130px 130px 28px 28px", ("HERO IMAGE", "EMPTY SLOT · 2:3"))
        + txt("Eyebrow", MX, 96, "w-micro", "PERFUME HOUSE · GRASSE, FRANCE", COCOA_SOFT)
        + txt("Headline", MX, 130, "m-display", f'Maison<br><span style="{ACCENT}">Sillage</span>', COCOA)
        + badge
        + txt("Hero lines", MX, 764, "m-lead", "<br>".join(COPY.lead), COCOA_SOFT)
        + pill("Primary button", "Shop the collection", MX, 840, 214, 56, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + pill("Secondary button", "Our story", 246, 840, 124, 56, "transparent", COCOA, OUTLINE)
    )
    return html, 896


def _home_collection(top: int) -> tuple[str, int]:
    y = top + 70
    head, y2 = m_heading(y, "THE COLLECTION", f'Six perfumes,<br><span style="{ACCENT}">one house</span>', 2)
    grid, y3 = m_grid(PRODUCTS[:4], y2 + 28)
    button = pill("View all button", "View all perfumes", MX, y3 + 20, MCW, 52, "transparent", COCOA, OUTLINE)
    return orb("Glow · peach", 195, y + 400, 700, "247,183,127", 0.3) + head + grid + button, y3 + 72


def spotlight(top: int) -> tuple[str, int]:
    """Ombre Claire feature panel, used on Home and Shop."""
    y, d, m = top + 64, 200, 40
    captions = txt("Slot caption", 0, d / 2 - 20, "w-micro", "BOTTLE IMAGE", COCOA_SOFT, d - 3, "center") + txt(
        "Slot size", 0, d / 2 + 4, "w-micro", "EMPTY SLOT · ROUND", COCOA_SOFT, d - 3, "center"
    )
    text = wrap(COPY.manifesto.split("This one waits. ", 1)[1].split(" Worn close", 1)[0], 34)
    ty = 354 + (text.count("<br>") + 1) * 27 + 14
    inner = (
        orb("Panel glow", 175, 130, 520, "255,246,232", 0.9)
        + svg_at("Echo rings", 75 - m, 32 - m, d + 2 * m, d + 2 * m, echo_rects(d, d, m, d / 2, RINGS_LIGHT, "#FFFFFF"))
        + box("Round image slot", 75, 32, d, d, "border-radius:50%;border:1.5px dashed rgba(255,255,255,0.9);background:rgba(255,255,255,0.18);", captions)
        + txt("Spotlight eyebrow", 24, 262, "w-micro", "THE SIGNATURE", COCOA)
        + txt("Spotlight name", 24, 284, "m-name", f'Ombre <span style="{ACCENT}">Claire</span>', COCOA)
        + txt("Spotlight text", 24, 354, "w-body-sm", text, COCOA)
        + txt("Spotlight price", 24, ty, "m-price-lg", COPY.price, COCOA)
        + txt("Spotlight size", 112, ty + 16, "w-micro", COPY.volume.upper(), COCOA)
        + pill("Primary button", "Add to cart", 24, ty + 54, 150, 52, COCOA, CREAM, SHADOW_DARK)
        + pill("Secondary button", "View details", 184, ty + 54, 140, 52, "transparent", COCOA, OUTLINE)
    )
    height = ty + 54 + 52 + 28
    return m_panel("Signature panel", y, height, inner), y + height


def _home_story(top: int) -> tuple[str, int]:
    y = top + 70
    html = (
        orb("Glow · amber", 60, y + 200, 460, "247,183,127", 0.35)
        + txt("Story eyebrow", MX, y, "w-micro", "OUR STORY", COCOA_SOFT)
        + txt("Pull quote", MX, y + 24, "m-quote", wrap(COPY.quote, 22), COCOA)
        + pill("Story button", "Read our story", MX, y + 214, 180, 52, "transparent", COCOA, OUTLINE)
        + image_slot("Atelier image slot", MX, y + 296, MCW, 240, "40px", ("ATELIER IMAGE", "EMPTY SLOT · WIDE"))
    )
    return html, y + 536


# --------------------------------------------------------------------------------------------
# Shop
# --------------------------------------------------------------------------------------------
def _shop_top(_top: int) -> tuple[str, int]:
    names = [family[0] for family in FAMILIES]
    filters = option("Filter: All", f"All · {len(PRODUCTS)}", MX, 282, 80, True, 44)
    for i, name in enumerate(names[:3]):
        filters += option(f"Filter: {name}", name, MX + 88 + i * 88, 282, 80, False, 44)
    filters += option(f"Filter: {names[3]}", names[3], MX, 336, 80, False, 44)
    filters += option("Sort control", "Sort · Featured", MW - MX - 170, 336, 170, False, 44)
    html = (
        _glow((330, 160), (20, 520), (110, 50))
        + txt("Eyebrow", MX, 100, "w-micro", "THE COLLECTION", COCOA_SOFT)
        + txt("Headline", MX, 122, "m-h1", f'All <span style="{ACCENT}">perfumes</span>', COCOA)
        + txt("Intro", MX, 200, "w-body-sm", wrap("Six extraits de parfum, composed and bottled in Grasse.", 38), COCOA_SOFT)
        + filters
    )
    return html, 380


def _shop_grid(top: int) -> tuple[str, int]:
    return m_grid(PRODUCTS, top + 30)


def _discovery(top: int) -> tuple[str, int]:
    y, height = top + 40, 484
    inner = (
        orb("Panel glow", 250, 120, 480, "255,246,232", 0.9)
        + image_slot("Discovery set image slot", 24, 24, 302, 170, "28px", ("SET IMAGE", "EMPTY SLOT · 16:9"))
        + txt("Discovery eyebrow", 24, 218, "w-micro", "THE DISCOVERY SET", COCOA)
        + txt("Discovery heading", 24, 240, "m-h2", f'Not sure yet?<br><span style="{ACCENT}">Try all six.</span>', COCOA)
        + txt("Discovery text", 24, 338, "w-body-sm", "Six vials, one of each perfume.<br>€35, credited to your first bottle.", COCOA)
        + pill("Primary button", "Add the discovery set", 24, 408, 302, 52, COCOA, CREAM, SHADOW_DARK)
    )
    return m_panel("Discovery panel", y, height, inner), y + height


def _families(top: int) -> tuple[str, int]:
    head, y2 = m_heading(top + 70, "FIND YOUR SCENT", f'Shop by <span style="{ACCENT}">family</span>')
    tiles = ""
    for i, (name, _line, rgb) in enumerate(FAMILIES):
        count = sum(p.family == name for p in PRODUCTS)
        inner = (
            orb(f"{name} glow", 83, 44, 250, rgb, 0.6)
            + txt(f"{name} name", 14, 96, "w-note", name, COCOA)
            + txt(f"{name} count", 14, 134, "w-micro", f"{count} PERFUME{'S' if count != 1 else ''}", COCOA_SOFT)
        )
        tiles += glass(f"Family tile: {name}", MX + (i % 2) * 183, y2 + 28 + (i // 2) * 192, 167, 176, 28, inner)
    return head + tiles, y2 + 28 + 192 + 176


# --------------------------------------------------------------------------------------------
# Product (Ombre Claire)
# --------------------------------------------------------------------------------------------
def _product_top(_top: int) -> tuple[str, int]:
    thumbs = ""
    for i in range(4):
        edge = f"2px solid {COCOA}" if i == 0 else "1.5px dashed rgba(59,36,32,0.32)"
        thumbs += box(f"Thumbnail {i + 1}", MX + i * 76, 548, 64, 64, f"border-radius:18px;border:{edge};background:rgba(255,255,255,0.5);")
    html = (
        _glow((195, 320), (370, 700), (300, 60))
        + txt("Breadcrumb", MX, 88, "w-micro", "SHOP / AMBER / OMBRE CLAIRE", COCOA_SOFT)
        + image_slot("Product image slot", MX, 112, MCW, 420, "175px 175px 32px 32px", ("PRODUCT IMAGE", "EMPTY SLOT · 4:5"))
        + thumbs
    )
    return html, 612


def _buy(top: int) -> tuple[str, int]:
    y = top + 32
    sizes = "".join(option(f"Size: {text}", text, MX + i * 120, y + 310, 110, i == 1, 48) for i, text in enumerate(SIZES))
    html = (
        txt("Product tag", MX, y, "w-micro", "SIGNATURE · EXTRAIT DE PARFUM", COCOA_SOFT)
        + txt("Product name", MX, y + 20, "m-name", f'Ombre <span style="{ACCENT}">Claire</span>', COCOA)
        + txt("Translation", MX, y + 84, "m-italic", "Bright shadow", COCOA_SOFT)
        + txt("Hero lines", MX, y + 124, "m-lead", "<br>".join(COPY.lead), COCOA_SOFT)
        + box("Rule", MX, y + 198, MCW, 1, RULE)
        + txt("Price", MX, y + 216, "w-price", COPY.price, COCOA)
        + txt("Price note", 150, y + 240, "w-micro", "50 ML · TAX INCLUDED", COCOA_SOFT)
        + txt("Size label", MX, y + 288, "w-micro", "SIZE", COCOA_SOFT) + sizes
        + stepper(MX, y + 378, 1, 112, 56)
        + pill("Primary button", f"Add to cart · {COPY.price}", 142, y + 378, 228, 56, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + txt("Service note 1", MX, y + 456, "w-micro", "FREE DELIVERY OVER €150", COCOA_SOFT)
        + txt("Service note 2", MX, y + 476, "w-micro", "TWO SAMPLES INCLUDED", COCOA_SOFT)
    )
    return html, y + 490


def _note_block(i: int, y: float) -> str:
    index, name, position = COPY.notes[i]
    return (
        box("Row rule", MX, y, MCW, 1, RULE) + dot(MX, y + 21, NOTE_COLORS[i])
        + txt(f"{name} position", MX + 22, y + 22, "w-micro", f"{index} · {position} NOTE", COCOA_SOFT)
        + txt(f"{name} name", MX, y + 44, "m-name", name, COCOA)
        + txt(f"{name} line", MX, y + 112, "w-body-sm", wrap(COPY.note_copy[i], 38), COCOA_SOFT)
        + image_slot(f"{name} texture slot", MX, y + 180, MCW, 110, "55px", ("MACRO TEXTURE", f"{name.upper()} · EMPTY SLOT"))
    )


def _notes(top: int) -> tuple[str, int]:
    y = top + 60
    blocks = "".join(_note_block(i, y + 30 + i * 320) for i in range(3))
    return txt("Notes eyebrow", MX, y, "w-micro", "NOTES IN DEPTH", COCOA_SOFT) + blocks, y + 30 + 3 * 320 - 30


def _timeline(top: int) -> tuple[str, int]:
    head, y2 = m_heading(top + 60, "LONGEVITY &amp; SILLAGE", f'A day <span style="{ACCENT}">with it</span>')
    first, step = y2 + 54, 84
    length = (len(TIMELINE) - 1) * step
    marks = ""
    for i, (_hours, label, text, _up, color) in enumerate(TIMELINE):
        my = first + i * step
        marks += box("Marker", 20, my - 11, 22, 22, f"border-radius:50%;background:#FFFFFF;border:3px solid {color};box-shadow:0 6px 16px rgba(176,92,62,0.2);")
        marks += txt(f"{label} hours", 60, my - 20, "w-micro", label, COCOA_SOFT) + txt(f"{label} label", 60, my - 4, "m-serif", text, COCOA)
    return head + box("Trail", 28, first, 6, length, TRAIL) + marks, first + length + 30


def _related(top: int) -> tuple[str, int]:
    head, y2 = m_heading(top + 70, "MORE FROM THE HOUSE", f'You may <span style="{ACCENT}">also like</span>')
    grid, y3 = m_grid(PRODUCTS[1:3], y2 + 28)
    return head + grid, y3


# --------------------------------------------------------------------------------------------
# Our story
# --------------------------------------------------------------------------------------------
def _story_hero(_top: int) -> tuple[str, int]:
    sx, sy, sw, sh, m = 75, 470, 240, 340, 40
    rings = svg_at("Echo outlines", sx - m, sy - m, sw + 2 * m, sh + 2 * m, echo_rects(sw, sh, m, sw / 2, RINGS))
    html = (
        _glow((120, 300), (360, 760), (320, 60))
        + svg_at("Liquid shape", 0, 380, MW, 520, blob(200, 260, 190, 0.13, 1.6, PEACH, 0.45))
        + txt("Eyebrow", MX, 100, "w-micro", "THE HOUSE", COCOA_SOFT)
        + txt("Pull quote", MX, 124, "m-quote-lg", wrap(COPY.quote, 18), COCOA)
        + box("Meta rule", MX, 400, 200, 1, RULE)
        + txt("Meta", MX, 420, "w-micro", "EST. 2024 · GRASSE, FRANCE", COCOA_SOFT)
        + rings + image_slot("Atelier image slot", sx, sy, sw, sh, "120px", ("ATELIER IMAGE", "EMPTY SLOT · PORTRAIT"))
    )
    return html, sy + sh + m


def _story_paragraphs(top: int) -> tuple[str, int]:
    y = top + 60
    out = txt("Paragraphs eyebrow", MX, y, "w-micro", "ABOUT THE HOUSE", COCOA_SOFT)
    for i, text in enumerate(STORY_PARAGRAPHS):
        yb = y + 30 + i * 236
        out += txt(f"Paragraph {i + 1} number", MX, yb, "m-numeral", f"0{i + 1}", NOTE_COLORS[i])
        out += txt(f"Paragraph {i + 1}", MX, yb + 78, "w-body-sm", wrap(text, 38), COCOA)
    return out, y + 30 + 3 * 236 - 30


def _story_numbers(top: int) -> tuple[str, int]:
    y, height = top + 50, 16 + len(STORY_NUMBERS) * 104
    inner = orb("Panel glow", 175, 80, 420, "255,226,184", 0.7)
    for i, (value, label) in enumerate(STORY_NUMBERS):
        ry = 16 + i * 104
        if i:
            inner += box("Divider", 28, ry, MCW - 58, 1, RULE)
        inner += txt(f"{label.title()} number", 28, ry + 20, "m-numeral", value, COCOA)
        inner += rtxt(f"{label.title()} label", 322, ry + 62, "w-micro", label, COCOA_SOFT, 140)
    return glass("Numbers panel", MX, y, MCW, height, 40, inner), y + height


def _story_atelier(top: int) -> tuple[str, int]:
    y, height = top + 50, 420
    html = image_slot("Atelier wide image slot", MX, y, MCW, height, "40px", ("ATELIER IMAGE", "EMPTY SLOT · TALL")) + chip(
        "One atelier · Grasse", 36, y + height - 68, 250
    )
    return html, y + height


def _story_collection(top: int) -> tuple[str, int]:
    head, y2 = m_heading(top + 70, "SIX PERFUMES · MADE IN GRASSE", f'The <span style="{ACCENT}">collection</span>')
    grid, y3 = m_grid(PRODUCTS[:2], y2 + 28)
    button = pill("Primary button", "Shop the collection", MX, y3 + 20, MCW, 56, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
    return head + grid + button, y3 + 76


def main() -> None:
    services = gap(m_services, 40)
    plans = (
        ("home", "Home", (_home_hero, _home_collection, spotlight, services, _home_story)),
        ("shop", "Shop", (_shop_top, _shop_grid, _discovery, _families, spotlight, services)),
        ("product", "Product", (_product_top, _buy, _notes, _timeline, _related, services)),
        ("story", "Our story", (_story_hero, _story_paragraphs, _story_numbers, _story_atelier, _story_collection, services)),
    )
    built = [(slug, name, *stack(sections)) for slug, name, sections in plans]
    page_h = common_height([bottom for _, _, _, bottom in built])
    print("content bottoms:", {slug: bottom for slug, _, _, bottom in built}, "frame height:", page_h)
    m_write("mobile-pages", "Sillage store — mobile pages", [(slug, name, finish(html, page_h)) for slug, name, html, _ in built], page_h)


if __name__ == "__main__":
    main()
