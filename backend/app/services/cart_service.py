
"""Cart operations — add, remove, view, checkout."""

import uuid
import logging
import stripe

from app.config import settings, RESTAURANT_PHONE
from app.ingestion.loader import MenuStore
from app.services.menu_search import find_by_name

TAX_RATE = 0.13

logger = logging.getLogger(__name__)

stripe.api_key = settings.STRIPE_SECRET_KEY


def add_item(session: dict, store: MenuStore, item_name: str, quantity: int = 1, notes: str = "") -> str:
    found = find_by_name(store, item_name)
    if not found:
        return f"'{item_name}' not on menu. Use search_menu to find items."

    for existing in session["cart"]:
        if existing["name"].lower() == found["name"].lower():
            existing["quantity"] += quantity
            existing["subtotal"] = round(existing["price"] * existing["quantity"], 2)
            return f"Updated {found['name']} to {existing['quantity']}x. Cart: ${get_total(session):.2f}"

    cart_item = {
        "name": found["name"],
        "price": found["price"],
        "quantity": quantity,
        "notes": notes,
        "subtotal": round(found["price"] * quantity, 2),
    }
    session["cart"].append(cart_item)
    return f"Added {quantity}x {found['name']} (${cart_item['subtotal']:.2f}). Cart: ${get_total(session):.2f}"


def remove_item(session: dict, item_name: str) -> str:
    for i, item in enumerate(session["cart"]):
        if item_name.lower() in item["name"].lower():
            removed = session["cart"].pop(i)
            return f"Removed {removed['name']}. Cart: ${get_total(session):.2f}"
    return f"'{item_name}' not in cart."


def get_summary(session: dict) -> str:
    if not session["cart"]:
        return "Cart is empty."

    lines = []
    for i in session["cart"]:
        line = f"  {i['quantity']}x {i['name']} — ${i['subtotal']:.2f}"
        if i.get("notes"):
            line += f" ({i['notes']})"
        lines.append(line)

    total = get_total(session)
    tax = round(total * TAX_RATE, 2)
    grand = round(total + tax, 2)

    return (
        "Cart:\n" + "\n".join(lines)
        + f"\n\nSubtotal: ${total:.2f}"
        + f"\nHST (13%): ${tax:.2f}"
        + f"\nTotal: ${grand:.2f}"
        + f"\nLocation: {(session.get('location') or 'not set').title()}"
    )


def get_total(session: dict) -> float:
    return sum(i["subtotal"] for i in session["cart"])


def create_checkout(session: dict) -> str:
    if not session["cart"]:
        return "Cart is empty."
    if not session.get("location"):
        return "Set a pickup location first (Scarborough or Downtown)."
    if not session.get("customer_name") or not session.get("customer_phone"):
        return "Collect customer name and phone first."
    if not settings.STRIPE_SECRET_KEY:
        return f"Online payment is not configured yet. Please call {RESTAURANT_PHONE} to complete your order."

    order_id = str(uuid.uuid4())[:6].upper()

    # Build Stripe line items — prices converted to cents
    line_items = [
        {
            "price_data": {
                "currency": "cad",
                "product_data": {
                    "name": item["name"],
                    **({"description": item["notes"]} if item.get("notes") else {}),
                },
                "unit_amount": round(item["price"] * 100),
            },
            "quantity": item["quantity"],
        }
        for item in session["cart"]
    ]

    # HST as a separate line item
    tax_cents = round(get_total(session) * TAX_RATE * 100)
    line_items.append({
        "price_data": {
            "currency": "cad",
            "product_data": {"name": "HST (13%)"},
            "unit_amount": tax_cents,
        },
        "quantity": 1,
    })

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=settings.STRIPE_SUCCESS_URL,
            cancel_url=settings.STRIPE_CANCEL_URL,
            metadata={
                "order_id": order_id,
                "customer_name": session.get("customer_name"),
                "customer_phone": session.get("customer_phone"),
                "location": session.get("location"),
            },
        )
    except stripe.StripeError as e:
        logger.error("Stripe error during checkout: %s", e)
        return f"Payment could not be created. Please call {RESTAURANT_PHONE} to place your order."

    return (
        f"Order #{order_id} is ready!\n"
        f"Complete your payment here: {checkout_session.url}\n"
        f"Pickup at: {session['location'].title()} once payment is confirmed."
    )
