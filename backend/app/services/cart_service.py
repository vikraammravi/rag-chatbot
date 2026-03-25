"""Cart operations — add, remove, view, checkout."""

import uuid
from app.ingestion.loader import MenuStore
from app.services.menu_search import find_by_name

TAX_RATE = 0.13


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

    total = get_total(session)
    tax = round(total * TAX_RATE, 2)
    grand = round(total + tax, 2)
    order_id = str(uuid.uuid4())[:6].upper()
    items_summary = ", ".join(f"{i['quantity']}x {i['name']}" for i in session["cart"])

    return (
        f"Order #{order_id} ready!\n"
        f"Customer: {session['customer_name']} ({session['customer_phone']})\n"
        f"Items: {items_summary}\n"
        f"Total: ${grand:.2f} CAD\n"
        f"Pickup: {session['location'].title()}\n\n"
        f"[Stripe payment link generated here in production]"
    )
