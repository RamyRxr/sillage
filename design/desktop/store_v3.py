"""Sillage store, version 3: the version 2 desktop pages at 73% size, in the same 1440 px frame.

Why: on a 1920x1080 laptop with 125% Windows scaling, a browser at 110% zoom shows a page about
1396x680 px, but version 2 was drawn for 1440x900. Shrinking every size by 80/110 makes the page at
110% look the way version 2 looks at 80% zoom. Small labels stop shrinking at MIN_FONT px.

How: each page is laid out by its version 2 builder on a wider virtual frame (1440 / SCALE = 1980 px,
content edges at SIDE / SCALE), so components keep their version 2 size and the spare width goes into
the gaps. Then every size is multiplied by SCALE, which brings the frame back to 1440 with SIDE px of
empty space left and right.

Run from this folder:  python store_v3.py
Writes out/v3-pages.html (preview: ?frame=home|shop|product|story|cart|checkout|done) and
out/v3-pages-capture.html, all seven 1440-wide desktop pages side by side.
"""

from __future__ import annotations

import re

from collections.abc import Callable

import store_checkout
import store_pages
from generate import COPY, FRAME_W, GAP, num
from halo_page import EXTRA_CSS
from inner_pages import INNER_CSS
from store_common import STORE_CSS, frame, write_pages
from warm import BASE_CSS

SCALE = 80 / 110
SIDE = 120  # px of empty space left and right of the content, in the final 1440 frame
MIN_FONT = 11  # px: text already this small keeps its size, larger text never shrinks below it
KEEP_AT_OR_BELOW = 2  # px: borders and hairlines keep their width

VIRTUAL_W = FRAME_W / SCALE
VIRTUAL_LEFT = SIDE / SCALE
VIRTUAL_RIGHT = VIRTUAL_W - VIRTUAL_LEFT

PX = re.compile(r"(-?\d+(?:\.\d+)?)px")
STYLE = re.compile(r'style="([^"]*)"')
SVG_SIZE = re.compile(r'(<svg\b[^>]*?)width="([\d.]+)" height="([\d.]+)"')
FONT_SIZE = re.compile(r"\.([\w-]+)\{font:(?:italic )?\d+ (\d+(?:\.\d+)?)px/")


def _scaled_px(match: re.Match[str]) -> str:
    value = float(match.group(1))
    return match.group(0) if abs(value) <= KEEP_AT_OR_BELOW else f"{num(value * SCALE)}px"


def _scaled_style(match: re.Match[str]) -> str:
    return f'style="{PX.sub(_scaled_px, match.group(1))}"'


def _scaled_svg(match: re.Match[str]) -> str:
    w, h = float(match.group(2)) * SCALE, float(match.group(3)) * SCALE
    return f'{match.group(1)}width="{num(w)}" height="{num(h)}"'


def compact(body: str) -> str:
    """Every px size in the body times SCALE; svgs are resized and their viewBox scales the drawing."""
    return SVG_SIZE.sub(_scaled_svg, STYLE.sub(_scaled_style, body))


def font_overrides() -> str:
    """One font-size rule per text class, shrunk the same way but never below MIN_FONT."""
    rules = []
    for cls, size in FONT_SIZE.findall(BASE_CSS + EXTRA_CSS + INNER_CSS + STORE_CSS):
        old = float(size)
        rules.append(f".{cls}{{font-size:{num(max(old * SCALE, min(old, MIN_FONT)))}px}}")
    return "".join(rules) + SPACING_FIXES


# Small labels keep their 11 px floor while what sits beside them shrinks, so two spots need room:
# the longest bestseller name would touch its price, and "HEART NOTE" would touch the note name.
NOTE_TEXT = ",".join(
    f'.f-product [aria-label="{name} {part}"]' for _, name, _ in COPY.notes for part in ("name", "line", "detail")
)
SPACING_FIXES = '[aria-label="Bestsellers card"] .w-note{font-size:17px}' + NOTE_TEXT + "{margin-left:24px}"


L, R, W = VIRTUAL_LEFT, VIRTUAL_RIGHT, VIRTUAL_W
TALL_H, SHORT_H = round(store_pages.PAGE_H * SCALE), round(store_checkout.PAGE_H * SCALE)
PAGES: tuple[tuple[str, str, int, Callable[[], str]], ...] = (
    ("home", "Home", TALL_H, lambda: store_pages.home_body(L, R, W)),
    ("shop", "Shop", TALL_H, lambda: store_pages.shop_body(L, R)),
    ("product", "Product", TALL_H, lambda: store_pages.product_body(L, R)),
    ("story", "Our story", TALL_H, lambda: store_pages.story_body(L, R, W)),
    ("cart", "Cart", SHORT_H, lambda: store_checkout.cart_body(L, R)),
    ("checkout", "Checkout", SHORT_H, lambda: store_checkout.checkout_body(L, R)),
    ("done", "Order confirmed", SHORT_H, lambda: store_checkout.done_body(L, R, W)),
)


def main() -> None:
    """All seven desktop pages side by side in one board, so Figma gets a single "version 3" layer."""
    frames = "".join(
        frame(slug, name, i * (FRAME_W + GAP), page_h, compact(build()), "Desktop", FRAME_W)
        for i, (slug, name, page_h, build) in enumerate(PAGES)
    )
    short = "".join(f".f-{slug}{{height:{page_h}px}}" for slug, _, page_h, _ in PAGES if page_h != TALL_H)
    board_w = len(PAGES) * FRAME_W + (len(PAGES) - 1) * GAP
    slugs = tuple(slug for slug, *_ in PAGES)
    write_pages("v3-pages", "version 3", frames, slugs, board_w, TALL_H, font_overrides() + short)


if __name__ == "__main__":
    main()
