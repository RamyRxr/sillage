"""Sillage store, tall desktop pages: Home, Shop, Product, Our story (Halo style) for Figma capture.

Run from the project root:  python design/desktop/store_pages.py

Writes design/desktop/out/store-pages.html (preview: ?frame=home|shop|product|story, &y=900 slides the
page up) and store-pages-capture.html. All four frames are 1440x3720, side by side.
"""

from __future__ import annotations

from generate import COPY, FRAME_W, GAP, txt
from halo_page import ACCENT, CONTENT_W, ECHO_STEPS, ECHO_STEPS_LIGHT, chip, echo_rects, eyebrow, svg_at, wrap
from inner_pages import arch_echoes, atelier, hero_glow, maison_hero, notes_section, numbers, paragraphs, timeline
from store_common import (
    BUTTON_GRADIENT, OUTLINE, PANEL_GRADIENT, PRODUCTS, RULE, SHADOW_DARK, SHADOW_WARM,
    band, frame, option, product_card, rtxt, services_strip, stepper, store_footer, store_header, write_pages,
)
from warm import AMBER, COCOA, COCOA_SOFT, CREAM, LEFT, PEACH, RIGHT, ROSE, blob, box, dot, glass, image_slot, orb, pill, scroll_cue

PAGE_H = 3720
SLUGS = ("home", "shop", "product", "story")
BOARD_W = len(SLUGS) * FRAME_W + (len(SLUGS) - 1) * GAP
FOOTER_TOP = 3600
FAMILIES = (
    ("Fresh", "Salt, citrus, clean skin.", "247,201,165"), ("Floral", "Iris, rose, soft powder.", "233,154,154"),
    ("Amber", "Warm, resinous, worn close.", "240,182,107"), ("Woody", "Cedar, fig, dry warmth.", "214,170,120"),
)
STORY_PARAGRAPHS = (
    "Sillage is a small perfume house from Grasse. We began with a single question: what does a perfume leave behind once the person has gone?",
    "Everything is made in small batches, by hand, in one atelier. Each perfume is composed as much for how it fades as for how it opens.",
    "Six perfumes so far, each a different trace. Ombre Claire was the first. It is still the one we are known for.",
)
STORY_NUMBERS = (("2024", "ESTABLISHED"), ("6", "PERFUMES"), ("1", "ATELIER"))
SIZES = (("10 ml · €65", False), ("50 ml · €240", True), ("100 ml · €380", False))


# --------------------------------------------------------------------------------------------
# Home
# --------------------------------------------------------------------------------------------
def _bestsellers_card() -> str:
    rows = txt("Card title", 28, 26, "w-micro", "BESTSELLERS", COCOA_SOFT)
    for i, p in enumerate(PRODUCTS[:3]):
        y = 64 + i * 62
        rows += dot(28, y + 8, p.color) + txt(f"{p.name} name", 52, y, "w-note", p.name, COCOA)
        rows += rtxt(f"{p.name} price", 272, y + 10, "w-micro", p.price, COCOA_SOFT, 60)
        if i < 2:
            rows += box("Row rule", 28, y + 44, 244, 1, RULE)
    return glass("Bestsellers card", 1060, 170, 300, 262, 32, rows)


def _home_hero() -> str:
    ax, ay, aw, ah = 640, 150, 420, 640
    glow = (
        orb("Glow · sun", 960, 430, 1060, "247,183,127", 0.9) + orb("Glow · blush", 140, 860, 780, "233,154,154", 0.55)
        + orb("Glow · gold", 300, 90, 560, "255,226,184", 0.85)
    )
    shapes = (
        blob(880, 470, 330, 0.12, 0.4, PEACH, 0.55) + blob(1010, 570, 250, 0.16, 2.1, ROSE, 0.35)
        + blob(700, 330, 200, 0.14, 4.0, AMBER, 0.4) + arch_echoes(ax, ay, aw, ah)
    )
    slot = image_slot("Hero image slot", ax, ay, aw, ah, f"{aw // 2}px {aw // 2}px 36px 36px", ("HERO IMAGE", "EMPTY SLOT · 4:5"))
    title = txt("Headline", LEFT, 168, "w-display", f'Maison<br><span style="{ACCENT}">Sillage</span>', COCOA)
    badge = glass(
        "Count badge", 1160, 478, 156, 156, 78,
        txt("Count", 0, 44, "w-price", str(len(PRODUCTS)), COCOA, 154, "center")
        + txt("Count label", 0, 104, "w-micro", "PERFUMES", COCOA_SOFT, 154, "center"),
    )
    buttons = pill("Primary button", "Shop the collection", LEFT, 706, 250, 60, BUTTON_GRADIENT, COCOA, SHADOW_WARM) + pill(
        "Secondary button", "Our story", LEFT + 266, 706, 160, 60, "transparent", COCOA, OUTLINE
    )
    return (
        glow + svg_at("Liquid shapes and arch lines", 0, 0, FRAME_W, 900, shapes) + slot + title
        + eyebrow("Eyebrow", LEFT, 122, "PERFUME HOUSE · GRASSE, FRANCE")
        + txt("Hero lines", LEFT, 612, "w-lead", "<br>".join(COPY.lead), COCOA_SOFT)
        + buttons + _bestsellers_card() + badge + scroll_cue(LEFT, 806)
    )


def _home_collection(top: int = 980) -> str:
    liquid = svg_at(
        "Liquid shapes", 0, top, FRAME_W, 900,
        blob(300, 330, 260, 0.14, 1.2, PEACH, 0.45) + blob(1150, 560, 300, 0.15, 3.3, ROSE, 0.3),
    )
    heading = txt("Collection heading", LEFT, top + 40, "w-h2", f'Six perfumes, <span style="{ACCENT}">one house</span>', COCOA)
    link = pill("View all button", "View all perfumes", RIGHT - 220, top + 56, 220, 52, "transparent", COCOA, OUTLINE)
    cards = "".join(product_card(PRODUCTS[i], LEFT + i * 444, top + 190 + i * 48) for i in range(3))
    return (
        orb("Glow · peach", 720, top + 420, 1300, "247,183,127", 0.3) + liquid
        + eyebrow("Collection eyebrow", LEFT, top, "THE COLLECTION") + heading + link + cards
    )


def _home_spotlight(top: int = 1960) -> str:
    d, rx, ry, m = 400, 800, 100, 90
    captions = txt("Slot caption", 0, d / 2 - 20, "w-micro", "BOTTLE IMAGE", COCOA_SOFT, d - 3, "center") + txt(
        "Slot size", 0, d / 2 + 4, "w-micro", "EMPTY SLOT · ROUND", COCOA_SOFT, d - 3, "center"
    )
    text = COPY.manifesto.split("This one waits. ", 1)[1].split(" Worn close", 1)[0]
    inner = (
        orb("Panel glow", 960, 240, 820, "255,246,232", 0.9)
        + svg_at("Echo rings", rx - m, ry - m, d + 2 * m, d + 2 * m, echo_rects(d, d, m, d / 2, ECHO_STEPS_LIGHT, "#FFFFFF"))
        + box("Round image slot", rx, ry, d, d, "border-radius:50%;border:1.5px dashed rgba(255,255,255,0.9);background:rgba(255,255,255,0.18);", captions)
        + txt("Spotlight eyebrow", 72, 72, "w-micro", "THE SIGNATURE · EXTRAIT DE PARFUM", COCOA)
        + txt("Spotlight name", 72, 104, "w-note-xl", f'Ombre <span style="{ACCENT}">Claire</span>', COCOA)
        + txt("Spotlight text", 72, 232, "w-body", wrap(text, 50), COCOA)
        + txt("Spotlight price", 72, 372, "w-price", COPY.price, COCOA)
        + txt("Spotlight size", 200, 396, "w-micro", COPY.volume.upper(), COCOA)
        + pill("Primary button", "Add to cart", 72, 460, 200, 60, COCOA, CREAM, SHADOW_DARK)
        + pill("Secondary button", "View details", 288, 460, 180, 60, "transparent", COCOA, OUTLINE)
    )
    return box("Signature panel", LEFT, top, CONTENT_W, 600, f"border-radius:56px;overflow:hidden;background:{PANEL_GRADIENT};", inner)


def _home_story(top: int = 2900) -> str:
    sx, sw, sh, m = 940, 420, 500, 90
    rings = svg_at("Echo outlines", sx - m, top - m, sw + 2 * m, sh + 2 * m, echo_rects(sw, sh, m, sw / 2, ECHO_STEPS))
    return (
        orb("Glow · amber", 160, top + 300, 700, "247,183,127", 0.35) + eyebrow("Story eyebrow", LEFT, top, "OUR STORY")
        + txt("Pull quote", LEFT, top + 40, "w-quote-xl", wrap(COPY.quote, 22), COCOA)
        + pill("Story button", "Read our story", LEFT, top + 430, 200, 56, "transparent", COCOA, OUTLINE)
        + rings + image_slot("Atelier image slot", sx, top, sw, sh, f"{sw // 2}px", ("ATELIER IMAGE", "EMPTY SLOT · PORTRAIT"))
    )


def home_body() -> str:
    return (
        _home_hero() + _home_collection() + _home_spotlight() + services_strip(2640) + _home_story()
        + store_footer(FOOTER_TOP) + store_header(0)
    )


# --------------------------------------------------------------------------------------------
# Shop
# --------------------------------------------------------------------------------------------
def _shop_top() -> str:
    filters = option("Filter: All", f"All · {len(PRODUCTS)}", LEFT, 440, 120, True)
    for i, (name, _, _) in enumerate(FAMILIES):
        filters += option(f"Filter: {name}", name, LEFT + 136 + i * 136, 440, 120, False)
    return (
        hero_glow((1100, 200), (140, 600), (420, 80))
        + svg_at("Liquid shape", 880, 60, 560, 440, blob(300, 210, 190, 0.14, 2.2, PEACH, 0.45))
        + eyebrow("Eyebrow", LEFT, 140, "THE COLLECTION")
        + txt("Headline", LEFT, 176, "w-display-md", f'All <span style="{ACCENT}">perfumes</span>', COCOA)
        + txt("Intro", LEFT, 350, "w-lead2", "Six extraits de parfum, composed and bottled in Grasse.", COCOA_SOFT)
        + filters + option("Sort control", "Sort · Featured", RIGHT - 200, 440, 200, False)
    )


def _discovery(top: int = 1910) -> str:
    inner = (
        orb("Panel glow", 1000, 200, 800, "255,246,232", 0.9)
        + txt("Discovery eyebrow", 72, 64, "w-micro", "THE DISCOVERY SET", COCOA)
        + txt("Discovery heading", 72, 96, "w-h2", f'Not sure yet?<br><span style="{ACCENT}">Try all six.</span>', COCOA)
        + txt("Discovery text", 72, 276, "w-body", "Six 2 ml vials, one of each perfume.<br>€35, credited to your first bottle.", COCOA)
        + pill("Primary button", "Add the discovery set", 72, 368, 260, 60, COCOA, CREAM, SHADOW_DARK)
        + image_slot("Discovery set image slot", 800, 70, 408, 340, "40px", ("SET IMAGE", "EMPTY SLOT · 4:3"))
    )
    return box("Discovery panel", LEFT, top, CONTENT_W, 480, f"border-radius:56px;overflow:hidden;background:{PANEL_GRADIENT};", inner)


def _families(top: int = 2480) -> str:
    tiles = ""
    for i, (name, line, rgb) in enumerate(FAMILIES):
        count = sum(p.family == name for p in PRODUCTS)
        inner = (
            orb(f"{name} glow", 148, 70, 440, rgb, 0.6)
            + txt(f"{name} name", 28, 204, "w-h3", name, COCOA)
            + txt(f"{name} count", 28, 264, "w-micro", f"{count} PERFUME{'S' if count != 1 else ''}", COCOA_SOFT)
            + txt(f"{name} line", 28, 288, "w-body-sm", line, COCOA_SOFT)
        )
        tiles += glass(f"Family tile: {name}", LEFT + i * 328, top + 210, 296, 340, 40, inner)
    heading = txt("Families heading", LEFT, top + 36, "w-h2", f'Shop by <span style="{ACCENT}">family</span>', COCOA)
    return orb("Glow · rose", 1100, top + 380, 1100, "233,154,154", 0.3) + eyebrow("Families eyebrow", LEFT, top, "FIND YOUR SCENT") + heading + tiles


def shop_body() -> str:
    grid = "".join(product_card(p, LEFT + (i % 3) * 444, 560 + (i // 3) * 650) for i, p in enumerate(PRODUCTS))
    return (
        _shop_top() + grid + _discovery() + _families() + services_strip(3200)
        + store_footer(FOOTER_TOP) + store_header(1)
    )


# --------------------------------------------------------------------------------------------
# Product (Ombre Claire)
# --------------------------------------------------------------------------------------------
def _gallery() -> str:
    thumbs = ""
    for i in range(4):
        edge = f"2px solid {COCOA}" if i == 0 else "1.5px dashed rgba(59,36,32,0.32)"
        thumbs += box(f"Thumbnail {i + 1}", LEFT, 170 + i * 112, 96, 96, f"border-radius:24px;border:{edge};background:rgba(255,255,255,0.5);")
    shapes = blob(460, 420, 330, 0.12, 0.7, PEACH, 0.5) + blob(600, 560, 240, 0.16, 2.4, ROSE, 0.3)
    main = image_slot("Product image slot", 200, 170, 520, 700, "260px 260px 40px 40px", ("PRODUCT IMAGE", "EMPTY SLOT · 3:4"))
    return svg_at("Liquid shapes", 0, 0, 900, 920, shapes) + thumbs + main


def _buy_box(x: float = 800) -> str:
    sizes = "".join(option(f"Size: {text}", text, x + i * 186, 604, 170, active) for i, (text, active) in enumerate(SIZES))
    chips = "".join(chip(name, x + i * 186, 836, 170) for i, (_, name, _) in enumerate(COPY.notes))
    return (
        txt("Product tag", x, 180, "w-micro", "SIGNATURE · EXTRAIT DE PARFUM", COCOA_SOFT)
        + txt("Product name", x, 210, "w-note-xl", f'Ombre <span style="{ACCENT}">Claire</span>', COCOA)
        + txt("Translation", x, 322, "w-lead-serif", "Bright shadow", COCOA_SOFT)
        + txt("Hero lines", x, 380, "w-lead2", "<br>".join(COPY.lead), COCOA_SOFT)
        + box("Rule", x, 476, 560, 1, RULE)
        + txt("Price", x, 500, "w-price", COPY.price, COCOA)
        + txt("Price note", x + 130, 524, "w-micro", "50 ML · TAX INCLUDED", COCOA_SOFT)
        + txt("Size label", x, 580, "w-micro", "SIZE", COCOA_SOFT) + sizes
        + stepper(x, 690, 1, 140, 60)
        + pill("Primary button", f"Add to cart · {COPY.price}", x + 156, 690, 404, 60, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + txt("Service note", x, 778, "w-micro", "FREE DELIVERY OVER €150 · TWO SAMPLES INCLUDED", COCOA_SOFT)
        + box("Rule", x, 812, 560, 1, RULE) + chips
    )


def _related(top: int = 2480) -> str:
    heading = txt("Related heading", LEFT, top + 36, "w-h2", f'You may <span style="{ACCENT}">also like</span>', COCOA)
    cards = "".join(product_card(p, LEFT + i * 444, top + 200) for i, p in enumerate(PRODUCTS[1:4]))
    return orb("Glow · peach", 720, top + 480, 1200, "247,183,127", 0.3) + eyebrow("Related eyebrow", LEFT, top, "MORE FROM THE HOUSE") + heading + cards


def product_body() -> str:
    crumb = txt("Breadcrumb", LEFT, 124, "w-micro", "SHOP  /  AMBER  /  OMBRE CLAIRE", COCOA_SOFT)
    return (
        hero_glow((420, 480), (1300, 760), (1180, 90)) + _gallery() + crumb + _buy_box()
        + notes_section(980) + timeline(1960, table=False) + _related() + services_strip(3370)
        + store_footer(FOOTER_TOP) + store_header(1)
    )


# --------------------------------------------------------------------------------------------
# Our story
# --------------------------------------------------------------------------------------------
def story_body() -> str:
    closing = band(3200, f'The <span style="{ACCENT}">collection</span>', "SIX PERFUMES · MADE IN GRASSE", "Shop the collection")
    return (
        maison_hero() + paragraphs(STORY_PARAGRAPHS) + numbers(STORY_NUMBERS) + atelier() + closing
        + store_footer(FOOTER_TOP) + store_header(2)
    )


def main() -> None:
    bodies = (("Home", home_body()), ("Shop", shop_body()), ("Product", product_body()), ("Our story", story_body()))
    frames = "".join(
        frame(slug, name, i * (FRAME_W + GAP), PAGE_H, body) for i, (slug, (name, body)) in enumerate(zip(SLUGS, bodies))
    )
    write_pages("store-pages", "Sillage store — pages", frames, SLUGS, BOARD_W, PAGE_H)


if __name__ == "__main__":
    main()
