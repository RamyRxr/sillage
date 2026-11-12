"""Shared pieces for the Sillage store mobile screens (390 wide, Halo style).

A page is a list of sections. Each section is a function that takes the y where the previous one
ended and returns (html, bottom), so sections stack without hand-placed page coordinates.
"""

from __future__ import annotations

from collections.abc import Callable, Sequence

from generate import COPY, GAP, esc, txt
from store_common import OUTLINE, PANEL_GRADIENT, RULE, SERVICES, Product, frame, write_pages
from warm import COCOA, COCOA_SOFT, CREAM, arch_path, box, glass, image_slot, orb, pill

MW, MX, MCW = 390, 20, 350  # frame width, side margin, content width
FOOTER_H = 190
CARD_W, CARD_H, CARD_PITCH = 167, 312, 328
Section = Callable[[int], tuple[str, int]]

MENU_ICON = (
    '<svg class="abs" style="left:0;top:0" width="42" height="42" viewBox="0 0 42 42" aria-label="Menu icon">'
    f'<path d="M13 17H29M13 25H29" fill="none" stroke="{COCOA}" stroke-width="1.6" stroke-linecap="round"/></svg>'
)
CLOSE_ICON = (
    '<svg class="abs" style="left:0;top:0" width="42" height="42" viewBox="0 0 42 42" aria-label="Close icon">'
    f'<path d="M15 15L27 27M27 15L15 27" fill="none" stroke="{COCOA}" stroke-width="1.6" stroke-linecap="round"/></svg>'
)


def stack(sections: Sequence[Section], start: int = 0) -> tuple[str, int]:
    """Run sections top to bottom; return all the html and the y where the last one ended."""
    html, y = "", start
    for section in sections:
        part, y = section(y)
        html += part
    return html, y


def gap(section: Section, space: int) -> Section:
    """Wrap a section so it starts `space` pixels below the previous one."""
    return lambda top: section(top + space)


# --------------------------------------------------------------------------------------------
# Header, footer, shared sections
# --------------------------------------------------------------------------------------------
def m_header(cart_count: int = 2, icon: str = MENU_ICON, label: str = "Menu button") -> str:
    button = glass(label, MW - MX - 44, 14, 44, 44, 22, icon)
    cart = pill("Cart button", f"Cart · {cart_count}", 224, 14, 92, 44, "transparent", COCOA, OUTLINE)
    return txt("Wordmark", MX, 30, "w-wordmark", COPY.house, COCOA) + cart + button


def m_footer(top: int) -> str:
    links = (("Shop", MX, 76), ("Our story", MX, 108), ("Delivery & returns", 190, 76), ("Contact", 190, 108))
    out = box("Footer rule", MX, top, MCW, 1, RULE) + txt("Wordmark", MX, top + 30, "w-wordmark", COPY.house, COCOA)
    out += "".join(txt(f"Footer link: {name}", x, top + dy, "w-nav", esc(name), COCOA_SOFT) for name, x, dy in links)
    return out + txt("Origin", MX, top + 152, "w-micro", COPY.origin.upper(), COCOA_SOFT)


def finish(html: str, page_h: int, cart_count: int = 2) -> str:
    """Add the footer at the bottom of the frame and the header on top."""
    return html + m_footer(page_h - FOOTER_H) + m_header(cart_count)


def common_height(bottoms: Sequence[int]) -> int:
    """One frame height for a set of pages: the longest page plus room for the footer."""
    return max(bottoms) + 50 + FOOTER_H


def m_heading(top: int, eyebrow_text: str, heading: str, lines: int = 1) -> tuple[str, int]:
    html = txt("Section eyebrow", MX, top, "w-micro", eyebrow_text, COCOA_SOFT) + txt("Section heading", MX, top + 24, "m-h2", heading, COCOA)
    return html, top + 24 + lines * 42


def m_card(p: Product, x: float, y: float) -> str:
    tag = ""
    if p.tag:
        tw = 30 + len(p.tag) * 8
        label = txt("Tag label", 0, 7, "w-micro", p.tag.upper(), COCOA, tw, "center")
        tag = box("Tag", 16, 16, tw, 24, "border-radius:12px;background:rgba(255,255,255,0.92);", label)
    plus = txt("Plus", 0, 12, "w-btn", "+", CREAM, 40, "center")
    inner = (
        orb(f"{p.name} glow", CARD_W / 2, 60, 300, p.rgb, 0.5)
        + image_slot(f"{p.name} image slot", 10, 10, CARD_W - 22, 150, "20px", ("IMAGE", "EMPTY SLOT"))
        + tag
        + txt(f"{p.name} family", 14, 178, "w-micro", p.family.upper(), COCOA_SOFT)
        + txt(f"{p.name} name", 14, 198, "m-card-name", p.name, COCOA)
        + txt(f"{p.name} price", 14, 266, "m-price", p.price, COCOA)
        + box("Add to cart button", CARD_W - 54, 254, 40, 40, f"border-radius:50%;background:{COCOA};", plus)
    )
    return glass(f"Product card: {p.name}", x, y, CARD_W, CARD_H, 28, inner)


def m_grid(products: Sequence[Product], top: int) -> tuple[str, int]:
    """Two-column grid of compact product cards."""
    html = "".join(m_card(p, MX + (i % 2) * 183, top + (i // 2) * CARD_PITCH) for i, p in enumerate(products))
    rows = (len(products) + 1) // 2
    return html, top + rows * CARD_PITCH - (CARD_PITCH - CARD_H)


def m_services(top: int) -> tuple[str, int]:
    inner = ""
    for i, (title, note) in enumerate(SERVICES):
        y = 20 + i * 64
        if i:
            inner += box("Divider", 24, y - 8, MCW - 50, 1, RULE)
        inner += txt(f"Service: {title}", 24, y + 4, "m-serif", title, COCOA)
        inner += txt(f"Service note: {title}", 24, y + 32, "w-micro", note, COCOA_SOFT)
    height = 20 + len(SERVICES) * 64 + 8
    return glass("Services card", MX, top, MCW, height, 32, inner), top + height


def m_panel(label: str, top: float, height: float, inner: str, radius: int = 40) -> str:
    style = f"border-radius:{radius}px;overflow:hidden;background:{PANEL_GRADIENT};"
    return box(label, MX, top, MCW, height, style, inner)


def m_arch_echoes(ax: float, ay: float, aw: float, ah: float) -> str:
    return "".join(
        f'<path d="{arch_path(ax - o, ay - o, aw + 2 * o, ah + 2 * o, 28 + o)}" fill="none" '
        f'stroke="{COCOA}" stroke-opacity="{a}" stroke-width="1"/>'
        for o, a in ((14, 0.22), (28, 0.14), (42, 0.08))
    )


# --------------------------------------------------------------------------------------------
# Page assembly
# --------------------------------------------------------------------------------------------
MOBILE_CSS = """
.frame{width:390px}
.m-display{font:300 100px/0.88 'Fraunces',serif;letter-spacing:-0.045em}
.m-h1{font:300 64px/1 'Fraunces',serif;letter-spacing:-0.04em}
.m-h2{font:300 40px/1.05 'Fraunces',serif;letter-spacing:-0.03em}
.m-name{font:300 56px/1 'Fraunces',serif;letter-spacing:-0.03em}
.m-quote{font:italic 300 36px/1.15 'Fraunces',serif;letter-spacing:-0.02em}
.m-quote-lg{font:italic 300 44px/1.14 'Fraunces',serif;letter-spacing:-0.025em}
.m-italic{font:italic 300 24px/1.2 'Fraunces',serif}
.m-lead{font:500 17px/1.55 'Manrope',sans-serif}
.m-serif{font:400 20px/1.1 'Fraunces',serif}
.m-card-name{font:400 21px/1.1 'Fraunces',serif;letter-spacing:-0.01em}
.m-price{font:400 22px/1 'Fraunces',serif}
.m-price-lg{font:300 36px/1 'Fraunces',serif;letter-spacing:-0.02em}
.m-numeral{font:300 64px/1 'Fraunces',serif;letter-spacing:-0.03em}
"""
# Preview only: ?x=1020&y=1200 slides the board so any 960x1200 window can be checked.
M_PREVIEW_JS = (
    "<script>var q=new URLSearchParams(location.search),x=+q.get('x'),y=+q.get('y');"
    "if(x||y){document.querySelectorAll('.frame').forEach(function(e){"
    "e.style.left=(parseFloat(e.style.left)-x)+'px';e.style.top=-y+'px'});"
    "document.body.style.height='1200px'}</script>"
)


def m_write(stem: str, title: str, pages: Sequence[tuple[str, str, str]], page_h: int) -> None:
    """Write preview and capture files for a row of mobile frames. pages = (slug, name, body)."""
    frames = "".join(
        frame(slug, name, i * (MW + GAP), page_h, body, "Mobile", MW) for i, (slug, name, body) in enumerate(pages)
    )
    board_w = len(pages) * MW + (len(pages) - 1) * GAP
    write_pages(stem, title, frames, tuple(p[0] for p in pages), board_w, page_h, MOBILE_CSS, M_PREVIEW_JS)
