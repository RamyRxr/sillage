"""Sillage store, mobile cart flow: Cart, Checkout, then Menu and Order confirmed (390 wide, Halo style).

Run from the project root:  python design/desktop/mobile_flow.py

Writes, into design/desktop/out/:
  mobile-flow.html / mobile-flow-capture.html        Cart and Checkout, one shared height
  mobile-screens.html / mobile-screens-capture.html  Menu and Order confirmed, 390x844

The customer details, order number and totals are made-up demo values.
"""

from __future__ import annotations

from generate import COPY, txt
from halo_page import ACCENT
from mobile_common import CLOSE_ICON, MCW, MW, MX, common_height, finish, m_header, m_panel, m_write, stack
from store_checkout import CHECK_ICON
from store_common import BUTTON_GRADIENT, NAV, PRODUCTS, RULE, SHADOW_WARM, Product, field, option, rtxt, stepper
from warm import COCOA, COCOA_SOFT, CREAM, box, glass, image_slot, orb, pill

ITEMS = PRODUCTS[:2]
TOTAL = "€450"
DEMO_NOTE = "DEMO STORE · NO PAYMENT TAKEN"
VIEW_H = 844
MENU_LINKS = ("CART · 2", "DELIVERY &amp; RETURNS", "CONTACT")


def _glow() -> str:
    return (
        orb("Glow · sun", 330, 200, 560, "247,183,127", 0.6) + orb("Glow · blush", 20, 900, 420, "233,154,154", 0.4)
        + orb("Glow · gold", 100, 60, 300, "255,226,184", 0.75)
    )


def _rows(rows: tuple[tuple[str, str], ...], y: float) -> str:
    out = ""
    for i, (label, value) in enumerate(rows):
        out += txt(f"{label} label", 24, y + i * 36, "w-body-sm", label, COCOA_SOFT)
        out += rtxt(f"{label} value", 326, y + i * 36, "w-body-sm", value, COCOA, 150)
    return out


def _total(y: float) -> str:
    return (
        box("Summary rule", 24, y, 302, 1, RULE) + txt("Total label", 24, y + 30, "w-time", "Total", COCOA)
        + rtxt("Total value", 326, y + 20, "m-price-lg", TOTAL, COCOA, 150)
    )


# --------------------------------------------------------------------------------------------
# Cart
# --------------------------------------------------------------------------------------------
def _cart_top(_top: int) -> tuple[str, int]:
    html = (
        _glow() + txt("Eyebrow", MX, 100, "w-micro", "YOUR SELECTION · 2 ITEMS", COCOA_SOFT)
        + txt("Headline", MX, 122, "m-h1", f'Your <span style="{ACCENT}">cart</span>', COCOA)
    )
    return html, 186


def _line_item(p: Product, y: float) -> str:
    inner = (
        image_slot(f"{p.name} image slot", 12, 12, 104, 104, "20px", ("IMAGE", "EMPTY SLOT"))
        + txt(f"{p.name} name", 132, 16, "w-note", p.name, COCOA)
        + txt(f"{p.name} details", 132, 50, "w-micro", f"{p.family.upper()} · 50 ML", COCOA_SOFT)
        + stepper(132, 74, 1, 104, 40)
        + rtxt(f"{p.name} price", 334, 84, "m-price", p.price, COCOA, 70)
        + txt(f"{p.name} remove", 318, 14, "w-btn", "×", COCOA_SOFT)
    )
    return glass(f"Cart item: {p.name}", MX, y, MCW, 132, 28, inner)


def _cart_items(top: int) -> tuple[str, int]:
    y = top + 34
    return "".join(_line_item(p, y + i * 148) for i, p in enumerate(ITEMS)), y + len(ITEMS) * 148 - 16


def _samples(top: int) -> tuple[str, int]:
    y = top + 20
    inner = txt("Samples title", 20, 22, "w-micro", "CHOOSE YOUR TWO FREE SAMPLES", COCOA_SOFT)
    for i, p in enumerate(PRODUCTS[2:]):
        inner += option(f"Sample: {p.name}", p.name, 20 + (i % 2) * 163, 52 + (i // 2) * 56, 147, i < 2, 44)
    return glass("Samples card", MX, y, MCW, 172, 28, inner), y + 172


def _cart_summary(top: int) -> tuple[str, int]:
    y = top + 20
    inner = (
        txt("Summary title", 24, 24, "w-micro", "ORDER SUMMARY", COCOA_SOFT)
        + _rows((("Subtotal", TOTAL), ("Delivery", "Free"), ("Samples", "2 included")), 60)
        + _total(176)
        + pill("Primary button", "Go to checkout", 24, 252, 302, 56, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + txt("Tax note", 24, 328, "w-micro", "TAXES INCLUDED", COCOA_SOFT)
        + txt("Demo note", 24, 348, "w-micro", DEMO_NOTE, COCOA_SOFT)
    )
    return glass("Order summary", MX, y, MCW, 384, 32, inner), y + 384


def _cart_extra(top: int) -> tuple[str, int]:
    y = top + 20
    inner = (
        orb("Panel glow", 280, 60, 360, "255,246,232", 0.9)
        + txt("Extra eyebrow", 24, 26, "w-micro", "THE DISCOVERY SET", COCOA)
        + txt("Extra text", 24, 50, "m-serif", "Try all six for €35", COCOA)
        + pill("Extra button", "Add the set", 24, 88, 150, 44, COCOA, CREAM)
    )
    link = txt("Continue link", MX, y + 186, "w-micro", "←  CONTINUE SHOPPING", COCOA)
    return m_panel("Discovery strip", y, 156, inner, 32) + link, y + 200


# --------------------------------------------------------------------------------------------
# Checkout
# --------------------------------------------------------------------------------------------
def _checkout_top(_top: int) -> tuple[str, int]:
    steps = (
        option("Step: Cart", "1 · Cart", MX, 92, 88, False, 38)
        + option("Step: Details", "2 · Details", MX + 96, 92, 112, True, 38)
        + option("Step: Done", "3 · Done", MX + 216, 92, 92, False, 38)
    )
    return _glow() + steps + txt("Headline", MX, 150, "m-h1", f'Check<span style="{ACCENT}">out</span>', COCOA), 214


def _form(top: int) -> tuple[str, int]:
    y, half, x2 = top + 30, 169, 201
    html = (
        txt("Contact label", MX, y, "w-micro", "CONTACT", COCOA_SOFT)
        + field("Email", "claire@example.com", MX, y + 22, MCW)
        + txt("Delivery label", MX, y + 112, "w-micro", "DELIVERY", COCOA_SOFT)
        + field("First name", "Claire", MX, y + 134, half) + field("Last name", "Martin", x2, y + 134, half)
        + field("Address", "12 rue des Fleurs", MX, y + 210, MCW)
        + field("City", "Grasse", MX, y + 286, half) + field("Postcode", "06130", x2, y + 286, half)
        + field("Country", "France", MX, y + 362, MCW)
        + txt("Payment label", MX, y + 452, "w-micro", "PAYMENT", COCOA_SOFT)
        + field("Card number", "0000 0000 0000 0000", MX, y + 474, MCW)
        + field("Expiry", "MM / YY", MX, y + 550, half) + field("Security code", "CVC", x2, y + 550, half)
    )
    return html, y + 614


def _mini_item(p: Product, y: float) -> str:
    return (
        box(f"{p.name} image slot", 24, y, 56, 56, "border-radius:16px;border:1.5px dashed rgba(59,36,32,0.32);background:rgba(255,255,255,0.5);")
        + txt(f"{p.name} name", 92, y + 6, "m-serif", p.name, COCOA)
        + txt(f"{p.name} details", 92, y + 34, "w-micro", "50 ML · QTY 1", COCOA_SOFT)
        + rtxt(f"{p.name} price", 326, y + 10, "m-serif", p.price, COCOA, 70)
    )


def _checkout_summary(top: int) -> tuple[str, int]:
    y = top + 32
    inner = (
        txt("Summary title", 24, 24, "w-micro", "YOUR ORDER", COCOA_SOFT)
        + "".join(_mini_item(p, 56 + i * 72) for i, p in enumerate(ITEMS))
        + box("Summary rule", 24, 204, 302, 1, RULE)
        + _rows((("Subtotal", TOTAL), ("Delivery", "Free")), 224)
        + _total(304)
        + pill("Primary button", f"Place order · {TOTAL}", 24, 384, 302, 56, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + txt("Demo note", 24, 462, "w-micro", DEMO_NOTE, COCOA_SOFT)
    )
    return glass("Order summary", MX, y, MCW, 492, 32, inner), y + 492


# --------------------------------------------------------------------------------------------
# Menu overlay and Order confirmed (one phone screen each)
# --------------------------------------------------------------------------------------------
def menu_body() -> str:
    items = ""
    for i, name in enumerate(NAV):
        y = 132 + i * 96
        style = ACCENT if i == 0 else ""
        items += txt(f"Menu item: {name}", MX, y, "m-h1", f'<span style="{style}">{name}</span>', COCOA)
        items += rtxt(f"Menu index {i + 1}", MW - MX, y + 34, "w-micro", f"0{i + 1}", COCOA_SOFT, 40)
        items += box("Menu rule", MX, y + 80, MCW, 1, RULE)
    links = "".join(txt(f"Menu link {i + 1}", MX, 448 + i * 34, "w-micro", text, COCOA) for i, text in enumerate(MENU_LINKS))
    feature = (
        orb("Panel glow", 280, 60, 380, "255,246,232", 0.9)
        + txt("Feature eyebrow", 24, 26, "w-micro", "THE SIGNATURE", COCOA)
        + txt("Feature name", 24, 48, "m-h2", f'Ombre <span style="{ACCENT}">Claire</span>', COCOA)
        + txt("Feature price", 24, 112, "w-micro", f"{COPY.price} · {COPY.volume.upper()}", COCOA)
        + pill("Feature button", "Shop now", MCW - 24 - 120, 98, 120, 44, COCOA, CREAM)
    )
    return (
        orb("Glow · sun", 300, 240, 620, "247,183,127", 0.75) + orb("Glow · blush", 40, 760, 460, "233,154,154", 0.5)
        + orb("Glow · gold", 90, 60, 300, "255,226,184", 0.85)
        + items + links + m_panel("Feature card", 566, 170, feature, 32)
        + txt("Origin", MX, 790, "w-micro", COPY.origin.upper(), COCOA_SOFT)
        + m_header(2, CLOSE_ICON, "Close button")
    )


def done_body() -> str:
    card = txt("Summary title", 24, 24, "w-micro", "ORDER SL-0001", COCOA_SOFT)
    for i, p in enumerate(ITEMS):
        card += txt(f"{p.name} name", 24, 54 + i * 36, "m-serif", p.name, COCOA)
        card += rtxt(f"{p.name} price", 326, 54 + i * 36, "m-serif", p.price, COCOA, 70)
    card += box("Summary rule", 24, 134, 302, 1, RULE) + txt("Total label", 24, 160, "w-time", "Total", COCOA)
    card += rtxt("Total value", 326, 150, "m-price-lg", TOTAL, COCOA, 150)
    lead = "Your order is on its way from Grasse.<br>A confirmation was sent to<br>claire@example.com."
    return (
        orb("Glow · sun", MW / 2, 300, 700, "247,183,127", 0.7) + orb("Glow · blush", 40, 780, 460, "233,154,154", 0.4)
        + orb("Glow · gold", 330, 70, 320, "255,226,184", 0.8)
        + glass("Check badge", MW / 2 - 48, 104, 96, 96, 48, CHECK_ICON)
        + txt("Eyebrow", MX, 224, "w-micro", "ORDER CONFIRMED", COCOA_SOFT, MCW, "center")
        + txt("Headline", MX, 246, "m-h1", f'Thank <span style="{ACCENT}">you</span>', COCOA, MCW, "center")
        + txt("Lead", MX, 330, "w-body-sm", lead, COCOA_SOFT, MCW, "center")
        + glass("Order card", MX, 436, MCW, 214, 32, card)
        + pill("Primary button", "Continue shopping", MX, 680, MCW, 56, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + txt("Demo note", MX, 764, "w-micro", "DEMO STORE · NO ORDER WAS PLACED", COCOA_SOFT, MCW, "center")
        + m_header(0)
    )


def main() -> None:
    plans = (
        ("cart", "Cart", (_cart_top, _cart_items, _samples, _cart_summary, _cart_extra)),
        ("checkout", "Checkout", (_checkout_top, _form, _checkout_summary)),
    )
    built = [(slug, name, *stack(sections)) for slug, name, sections in plans]
    page_h = common_height([bottom for _, _, _, bottom in built])
    print("content bottoms:", {slug: bottom for slug, _, _, bottom in built}, "frame height:", page_h)
    m_write("mobile-flow", "Sillage store — mobile cart and checkout", [(slug, name, finish(html, page_h)) for slug, name, html, _ in built], page_h)
    screens = [("menu", "Menu", menu_body()), ("done", "Order confirmed", done_body())]
    m_write("mobile-screens", "Sillage store — mobile menu and confirmation", screens, VIEW_H)


if __name__ == "__main__":
    main()
