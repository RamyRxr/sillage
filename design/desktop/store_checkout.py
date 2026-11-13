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
from warm import COCOA, COCOA_SOFT, LEFT, RIGHT, box, glass, image_slot, orb, pill

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


# Every page takes the content edges; the defaults give the 1440 layout. The main column takes the width
# the summary card leaves, and the summary card sits on the right edge.
SUMMARY_W, SUMMARY_GAP = 440, 40


def _glow(left: float = LEFT, right: float = RIGHT) -> str:
    return (
        orb("Glow · sun", right - 210, 260, 1000, "247,183,127", 0.6) + orb("Glow · blush", left + 40, 1000, 760, "233,154,154", 0.4)
        + orb("Glow · gold", left + 280, 90, 520, "255,226,184", 0.75)
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
def _line_item(p: Product, y: float, left: float = LEFT, width: float = 800) -> str:
    inner = (
        image_slot(f"{p.name} image slot", 20, 20, 138, 138, "24px", ("IMAGE", "EMPTY SLOT"))
        + txt(f"{p.name} name", 188, 30, "w-h3", p.name, COCOA)
        + txt(f"{p.name} details", 188, 88, "w-micro", f"{p.family.upper()} · 50 ML · EXTRAIT DE PARFUM", COCOA_SOFT)
        + stepper(188, 114, 1, 124, 44)
        + rtxt(f"{p.name} price", width - 30, 38, "w-price-sm", p.price, COCOA, 120)
        + rtxt(f"{p.name} remove", width - 30, 132, "w-micro", "REMOVE", COCOA_SOFT, 120)
    )
    return glass(f"Cart item: {p.name}", left, y, width, 180, 36, inner)


def _samples(y: float, left: float = LEFT, width: float = 800) -> str:
    inner = txt("Samples title", 32, 30, "w-micro", "CHOOSE YOUR TWO FREE SAMPLES", COCOA_SOFT)
    for i, p in enumerate(PRODUCTS[2:]):
        inner += option(f"Sample: {p.name}", p.name, 32 + i * 186, 68, 170, i < 2)
    return glass("Samples card", left, y, width, 160, 36, inner)


def _cart_summary(x: float = 920) -> str:
    inner = (
        txt("Summary title", 32, 32, "w-micro", "ORDER SUMMARY", COCOA_SOFT)
        + _summary_rows((("Subtotal", TOTAL), ("Delivery", "Free"), ("Samples", "2 included")), 72)
        + _total(204)
        + pill("Primary button", "Go to checkout", 32, 300, 374, 60, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + txt("Tax note", 32, 388, "w-micro", "TAXES INCLUDED", COCOA_SOFT)
        + txt("Demo note", 32, 410, "w-micro", DEMO_NOTE, COCOA_SOFT)
    )
    return glass("Order summary", x, 400, SUMMARY_W, 460, 40, inner)


def cart_body(left: float = LEFT, right: float = RIGHT) -> str:
    list_w = right - left - SUMMARY_W - SUMMARY_GAP
    items = "".join(_line_item(p, 400 + i * 200, left, list_w) for i, p in enumerate(ITEMS))
    return (
        _glow(left, right) + eyebrow("Eyebrow", left, 140, "YOUR SELECTION · 2 ITEMS")
        + txt("Headline", left, 176, "w-display-md", f'Your <span style="{ACCENT}">cart</span>', COCOA)
        + items + _samples(820, left, list_w) + _cart_summary(right - SUMMARY_W)
        + txt("Continue link", left, 1030, "w-micro", "←  CONTINUE SHOPPING", COCOA)
        + store_footer(FOOTER_TOP, left, right) + store_header(-1, left=left, right=right)
    )


# --------------------------------------------------------------------------------------------
# Checkout
# --------------------------------------------------------------------------------------------
def _form(left: float = LEFT, width: float = 760) -> str:
    half = (width - 16) / 2
    x2 = left + half + 16
    return (
        txt("Contact label", left, 330, "w-micro", "CONTACT", COCOA_SOFT)
        + field("Email", "claire@example.com", left, 356, width)
        + txt("Delivery label", left, 456, "w-micro", "DELIVERY", COCOA_SOFT)
        + field("First name", "Claire", left, 482, half) + field("Last name", "Martin", x2, 482, half)
        + field("Address", "12 rue des Fleurs", left, 562, width)
        + field("City", "Grasse", left, 642, half) + field("Postcode", "06130", x2, 642, half)
        + field("Country", "France", left, 722, width)
        + txt("Payment label", left, 822, "w-micro", "PAYMENT", COCOA_SOFT)
        + field("Card number", "0000 0000 0000 0000", left, 848, width)
        + field("Expiry", "MM / YY", left, 928, half) + field("Security code", "CVC", x2, 928, half)
        + txt("Form note", left, 1024, "w-micro", "DEMO STORE · THIS FORM DOES NOT SEND OR STORE ANYTHING", COCOA_SOFT)
    )


def _mini_item(p: Product, y: float) -> str:
    return (
        box(f"{p.name} image slot", 32, y, 64, 64, "border-radius:18px;border:1.5px dashed rgba(59,36,32,0.32);background:rgba(255,255,255,0.5);")
        + txt(f"{p.name} name", 112, y + 8, "w-time", p.name, COCOA)
        + txt(f"{p.name} details", 112, y + 42, "w-micro", "50 ML · QTY 1", COCOA_SOFT)
        + rtxt(f"{p.name} price", 406, y + 12, "w-time", p.price, COCOA, 90)
    )


def _checkout_summary(x: float = 920) -> str:
    inner = (
        txt("Summary title", 32, 32, "w-micro", "YOUR ORDER", COCOA_SOFT)
        + "".join(_mini_item(p, 64 + i * 84) for i, p in enumerate(ITEMS))
        + box("Summary rule", 32, 240, 374, 1, RULE)
        + _summary_rows((("Subtotal", TOTAL), ("Delivery", "Free")), 262)
        + _total(346)
        + pill("Primary button", f"Place order · {TOTAL}", 32, 442, 374, 60, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + txt("Demo note", 32, 530, "w-micro", DEMO_NOTE, COCOA_SOFT)
    )
    return glass("Order summary", x, 330, SUMMARY_W, 580, 40, inner)


def checkout_body(left: float = LEFT, right: float = RIGHT) -> str:
    steps = (
        option("Step: Cart", "1 · Cart", left, 136, 130, False, 44)
        + option("Step: Details", "2 · Details and payment", left + 146, 136, 250, True, 44)
        + option("Step: Done", "3 · Done", left + 412, 136, 130, False, 44)
    )
    form_w = right - left - SUMMARY_W - 2 * SUMMARY_GAP
    return (
        _glow(left, right) + steps + txt("Headline", left, 212, "w-h2", f'Check<span style="{ACCENT}">out</span>', COCOA)
        + _form(left, form_w) + _checkout_summary(right - SUMMARY_W)
        + store_footer(FOOTER_TOP, left, right) + store_header(-1, left=left, right=right)
    )


# --------------------------------------------------------------------------------------------
# Order confirmed
# --------------------------------------------------------------------------------------------
def done_body(left: float = LEFT, right: float = RIGHT, frame_w: float = FRAME_W) -> str:
    cx = frame_w / 2
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
        orb("Glow · sun", cx, 420, 1200, "247,183,127", 0.7) + orb("Glow · blush", left + 120, 1000, 760, "233,154,154", 0.4)
        + orb("Glow · gold", right - 160, 120, 560, "255,226,184", 0.8)
        + glass("Check badge", cx - 48, 170, 96, 96, 48, CHECK_ICON)
        + txt("Eyebrow", cx - 300, 300, "w-micro", "ORDER CONFIRMED", COCOA_SOFT, 600, "center")
        + txt("Headline", cx - 500, 330, "w-display-md", f'Thank <span style="{ACCENT}">you</span>', COCOA, 1000, "center")
        + txt("Lead", cx - 400, 500, "w-lead2", lead, COCOA_SOFT, 800, "center")
        + glass("Order card", cx - 300, 620, 600, 260, 40, card)
        + pill("Primary button", "Continue shopping", cx - 140, 930, 280, 60, BUTTON_GRADIENT, COCOA, SHADOW_WARM)
        + txt("Demo note", cx - 300, 1024, "w-micro", "DEMO STORE · NO ORDER WAS PLACED", COCOA_SOFT, 600, "center")
        + store_footer(FOOTER_TOP, left, right) + store_header(-1, cart_count=0, left=left, right=right)
    )


def main() -> None:
    bodies = (("Cart", cart_body()), ("Checkout", checkout_body()), ("Order confirmed", done_body()))
    frames = "".join(
        frame(slug, name, i * (FRAME_W + GAP), PAGE_H, body) for i, (slug, (name, body)) in enumerate(zip(SLUGS, bodies))
    )
    write_pages("store-checkout", "Sillage store — cart and checkout", frames, SLUGS, BOARD_W, PAGE_H)


if __name__ == "__main__":
    main()
