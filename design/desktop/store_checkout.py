"""Sillage store, short desktop pages: Cart, Checkout, Order confirmed (Halo style) for Figma capture.

Run from the project root:  python design/desktop/store_checkout.py

Writes design/desktop/out/store-checkout.html (preview: ?frame=cart|checkout|done) and
store-checkout-capture.html. All three frames are 1440x1320, side by side. The customer details,
order number and totals are made-up demo values.
"""

from __future__ import annotations

from generate import FRAME_W, GAP, txt
from halo_page import ACCENT, eyebrow
from store_common import (
    BUTTON_GRADIENT, PRODUCTS, RULE, SHADOW_WARM, Product,
    field, frame, option, rtxt, stepper, store_footer, store_header, write_pages,
)
from warm import COCOA, COCOA_SOFT, LEFT, box, glass, image_slot, orb, pill

PAGE_H = 1320
SLUGS = ("cart", "checkout", "done")
BOARD_W = len(SLUGS) * FRAME_W + (len(SLUGS) - 1) * GAP
FOOTER_TOP = 1200
ITEMS = PRODUCTS[:2]
TOTAL = "€450"
DEMO_NOTE = "DEMO STORE · NO PAYMENT IS TAKEN"
CHECK_ICON = (
    '<svg class="abs" style="left:0;top:0" width="94" height="94" viewBox="0 0 94 94" aria-label="Check icon">'
    f'<path d="M30 48L42 60L65 35" fill="none" stroke="{COCOA}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
)


def _glow() -> str:
    return (
        orb("Glow · sun", 1150, 260, 1000, "247,183,127", 0.6) + orb("Glow · blush", 120, 1000, 760, "233,154,154", 0.4)
        + orb("Glow · gold", 360, 90, 520, "255,226,184", 0.75)
    )


def _summary_rows(rows: tuple[tuple[str, str], ...], y: float) -> str:
    out = ""
    for i, (label, value) in enumerate(rows):
        out += txt(f"{label} label", 32, y + i * 40, "w-body-sm", label, COCOA_SOFT)
        out += rtxt(f"{label} value", 406, y + i * 40, "w-body-sm", value, COCOA, 180)
    return out


def _total(y: float) -> str:
    return (
        box("Summary rule", 32, y, 374, 1, RULE) + txt("Total label", 32, y + 34, "w-time", "Total", COCOA)
        + rtxt("Total value", 406, y + 20, "w-price", TOTAL, COCOA, 200)
    )


# --------------------------------------------------------------------------------------------
# Cart
# --------------------------------------------------------------------------------------------
def _line_item(p: Product, y: float) -> str:
    inner = (
        image_slot(f"{p.name} image slot", 20, 20, 138, 138, "24px", ("IMAGE", "EMPTY SLOT"))
        + txt(f"{p.name} name", 188, 30, "w-h3", p.name, COCOA)
        + txt(f"{p.name} details", 188, 88, "w-micro", f"{p.family.upper()} · 50 ML · EXTRAIT DE PARFUM", COCOA_SOFT)
        + stepper(188, 114, 1, 124, 44)
        + rtxt(f"{p.name} price", 770, 38, "w-price-sm", p.price, COCOA, 120)
        + rtxt(f"{p.name} remove", 770, 132, "w-micro", "REMOVE", COCOA_SOFT, 120)
    )
    return glass(f"Cart item: {p.name}", LEFT, y, 800, 180, 36, inner)


def _samples(y: float) -> str:
    inner = txt("Samples title", 32, 30, "w-micro", "CHOOSE YOUR TWO FREE SAMPLES", COCOA_SOFT)
    for i, p in enumerate(PRODUCTS[2:]):
        inner += option(f"Sample: {p.name}", p.name, 32 + i * 186, 68, 170, i < 2)
    return glass("Samples card", LEFT, y, 800, 160, 36, inner)


def _cart_summary() -> str:
    inner = (
        txt("Summary title", 32, 32, "w-micro", "ORDER SUMMARY", COCOA_SOFT)
        + _summary_rows((("Subtotal", TOTAL), ("Delivery", "Free"), ("Samples", "2 included")), 72)
        + _total(204)
        + pill("Primary button", "Go to checkout", 32, 300, 374, 60, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + txt("Tax note", 32, 388, "w-micro", "TAXES INCLUDED", COCOA_SOFT)
        + txt("Demo note", 32, 410, "w-micro", DEMO_NOTE, COCOA_SOFT)
    )
    return glass("Order summary", 920, 400, 440, 460, 40, inner)


def cart_body() -> str:
    items = "".join(_line_item(p, 400 + i * 200) for i, p in enumerate(ITEMS))
    return (
        _glow() + eyebrow("Eyebrow", LEFT, 140, "YOUR SELECTION · 2 ITEMS")
        + txt("Headline", LEFT, 176, "w-display-md", f'Your <span style="{ACCENT}">cart</span>', COCOA)
        + items + _samples(820) + _cart_summary()
        + txt("Continue link", LEFT, 1030, "w-micro", "←  CONTINUE SHOPPING", COCOA)
        + store_footer(FOOTER_TOP) + store_header(-1)
    )


# --------------------------------------------------------------------------------------------
# Checkout
# --------------------------------------------------------------------------------------------
def _form() -> str:
    half, x2 = 372, LEFT + 388
    return (
        txt("Contact label", LEFT, 330, "w-micro", "CONTACT", COCOA_SOFT)
        + field("Email", "claire@example.com", LEFT, 356, 760)
        + txt("Delivery label", LEFT, 456, "w-micro", "DELIVERY", COCOA_SOFT)
        + field("First name", "Claire", LEFT, 482, half) + field("Last name", "Martin", x2, 482, half)
        + field("Address", "12 rue des Fleurs", LEFT, 562, 760)
        + field("City", "Grasse", LEFT, 642, half) + field("Postcode", "06130", x2, 642, half)
        + field("Country", "France", LEFT, 722, 760)
        + txt("Payment label", LEFT, 822, "w-micro", "PAYMENT", COCOA_SOFT)
        + field("Card number", "0000 0000 0000 0000", LEFT, 848, 760)
        + field("Expiry", "MM / YY", LEFT, 928, half) + field("Security code", "CVC", x2, 928, half)
        + txt("Form note", LEFT, 1024, "w-micro", "DEMO STORE · THIS FORM DOES NOT SEND OR STORE ANYTHING", COCOA_SOFT)
    )


def _mini_item(p: Product, y: float) -> str:
    return (
        box(f"{p.name} image slot", 32, y, 64, 64, "border-radius:18px;border:1.5px dashed rgba(59,36,32,0.32);background:rgba(255,255,255,0.5);")
        + txt(f"{p.name} name", 112, y + 8, "w-time", p.name, COCOA)
        + txt(f"{p.name} details", 112, y + 42, "w-micro", "50 ML · QTY 1", COCOA_SOFT)
        + rtxt(f"{p.name} price", 406, y + 12, "w-time", p.price, COCOA, 90)
    )


def _checkout_summary() -> str:
    inner = (
        txt("Summary title", 32, 32, "w-micro", "YOUR ORDER", COCOA_SOFT)
        + "".join(_mini_item(p, 64 + i * 84) for i, p in enumerate(ITEMS))
        + box("Summary rule", 32, 240, 374, 1, RULE)
        + _summary_rows((("Subtotal", TOTAL), ("Delivery", "Free")), 262)
        + _total(346)
        + pill("Primary button", f"Place order · {TOTAL}", 32, 442, 374, 60, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + txt("Demo note", 32, 530, "w-micro", DEMO_NOTE, COCOA_SOFT)
    )
    return glass("Order summary", 920, 330, 440, 580, 40, inner)


def checkout_body() -> str:
    steps = (
        option("Step: Cart", "1 · Cart", LEFT, 136, 130, False, 44)
        + option("Step: Details", "2 · Details and payment", LEFT + 146, 136, 250, True, 44)
        + option("Step: Done", "3 · Done", LEFT + 412, 136, 130, False, 44)
    )
    return (
        _glow() + steps + txt("Headline", LEFT, 212, "w-h2", f'Check<span style="{ACCENT}">out</span>', COCOA)
        + _form() + _checkout_summary() + store_footer(FOOTER_TOP) + store_header(-1)
    )


# --------------------------------------------------------------------------------------------
# Order confirmed
# --------------------------------------------------------------------------------------------
def done_body() -> str:
    cx = FRAME_W / 2
    card = (
        txt("Summary title", 32, 32, "w-micro", "ORDER SL-0001", COCOA_SOFT)
        + "".join(
            txt(f"{p.name} name", 32, 68 + i * 44, "w-time", p.name, COCOA) + rtxt(f"{p.name} price", 566, 68 + i * 44, "w-time", p.price, COCOA, 90)
            for i, p in enumerate(ITEMS)
        )
        + box("Summary rule", 32, 164, 534, 1, RULE)
        + txt("Total label", 32, 192, "w-time", "Total", COCOA) + rtxt("Total value", 566, 180, "w-price", TOTAL, COCOA, 200)
    )
    lead = "Your order is on its way from Grasse.<br>A confirmation was sent to claire@example.com."
    return (
        orb("Glow · sun", cx, 420, 1200, "247,183,127", 0.7) + orb("Glow · blush", 200, 1000, 760, "233,154,154", 0.4)
        + orb("Glow · gold", 1200, 120, 560, "255,226,184", 0.8)
        + glass("Check badge", cx - 48, 170, 96, 96, 48, CHECK_ICON)
        + txt("Eyebrow", cx - 300, 300, "w-micro", "ORDER CONFIRMED", COCOA_SOFT, 600, "center")
        + txt("Headline", cx - 500, 330, "w-display-md", f'Thank <span style="{ACCENT}">you</span>', COCOA, 1000, "center")
        + txt("Lead", cx - 400, 500, "w-lead2", lead, COCOA_SOFT, 800, "center")
        + glass("Order card", cx - 300, 620, 600, 260, 40, card)
        + pill("Primary button", "Continue shopping", cx - 140, 930, 280, 60, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + txt("Demo note", cx - 300, 1024, "w-micro", "DEMO STORE · NO ORDER WAS PLACED", COCOA_SOFT, 600, "center")
        + store_footer(FOOTER_TOP) + store_header(-1, cart_count=0)
    )


def main() -> None:
    bodies = (("Cart", cart_body()), ("Checkout", checkout_body()), ("Order confirmed", done_body()))
    frames = "".join(
        frame(slug, name, i * (FRAME_W + GAP), PAGE_H, body) for i, (slug, (name, body)) in enumerate(zip(SLUGS, bodies))
    )
    write_pages("store-checkout", "Sillage store — cart and checkout", frames, SLUGS, BOARD_W, PAGE_H)


if __name__ == "__main__":
    main()
