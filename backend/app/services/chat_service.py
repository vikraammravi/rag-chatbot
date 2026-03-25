"""Chat service — Claude tool-use loop + streaming. The brain of the chatbot."""

import json
import logging
import anthropic

from app.config import settings, RESTAURANT_PHONE
from app.ingestion.loader import MenuStore
from app.ingestion.pipeline import get_store
from app.tools.definitions import TOOLS
from app.services import menu_search, cart_service

logger = logging.getLogger(__name__)

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

FALLBACK_MSG = f"Something went wrong. Please call {RESTAURANT_PHONE}."


def _execute_tool(tool_name: str, tool_input: dict, session: dict, store: MenuStore) -> str:
    if tool_name == "search_menu":
        return menu_search.search(
            store,
            tool_input.get("query", ""),
            tool_input.get("category"),
            tool_input.get("only_mild", False),
        )

    if tool_name == "add_to_cart":
        item_name = tool_input.get("item_name")
        if not item_name:
            return "Missing item_name. Please specify which item to add."
        return cart_service.add_item(
            session, store, item_name,
            tool_input.get("quantity", 1),
            tool_input.get("notes", ""),
        )

    if tool_name == "remove_from_cart":
        item_name = tool_input.get("item_name")
        if not item_name:
            return "Missing item_name. Please specify which item to remove."
        return cart_service.remove_item(session, item_name)

    if tool_name == "get_cart":
        return cart_service.get_summary(session)

    if tool_name == "set_location":
        location = tool_input.get("location")
        if not location:
            return "Missing location. Please specify 'scarborough' or 'downtown'."
        loc = store.locations.get(location)
        if not loc:
            return f"Unknown location '{location}'. Choose 'scarborough' or 'downtown'."
        session["location"] = location
        return f"Location set to {location.title()}: {loc['address']}"

    if tool_name == "collect_customer_info":
        name = tool_input.get("customer_name")
        phone = tool_input.get("customer_phone")
        if not name or not phone:
            return "Missing customer_name or customer_phone."
        session["customer_name"] = name
        session["customer_phone"] = phone
        return f"Saved: {name}, {phone}"

    if tool_name == "create_checkout":
        return cart_service.create_checkout(session)

    if tool_name == "get_restaurant_info":
        loc_key = tool_input.get("location", "scarborough")
        loc = store.locations.get(loc_key, next(iter(store.locations.values())))
        return json.dumps({"name": store.restaurant["name"], "location": loc_key.title(), **loc})

    logger.warning("Unknown tool called: %s", tool_name)
    return f"Unknown tool: {tool_name}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NON-STREAMING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def get_response(message: str, session: dict) -> str:
    store = get_store()
    session["conversation_history"].append({"role": "user", "content": message})
    messages = session["conversation_history"]

    for _ in range(10):
        response = client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=1024,
            system=store.system_prompt,
            tools=TOOLS,
            messages=messages,
        )

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            tool_results = [
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": _execute_tool(block.name, block.input, session, store),
                }
                for block in response.content
                if block.type == "tool_use"
            ]
            messages.append({"role": "user", "content": tool_results})
            continue

        if response.stop_reason == "end_turn":
            bot_text = "".join(b.text for b in response.content if hasattr(b, "text"))
            messages.append({"role": "assistant", "content": bot_text})
            session["conversation_history"] = messages
            return bot_text

        logger.warning("Unexpected stop_reason: %s", response.stop_reason)
        break

    return FALLBACK_MSG


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STREAMING (yields chunks for SSE)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def get_response_stream(message: str, session: dict):
    """True token streaming — text appears as Claude generates it."""
    store = get_store()
    session["conversation_history"].append({"role": "user", "content": message})
    messages = session["conversation_history"]

    for _ in range(10):
        streamed_text = ""

        with client.messages.stream(
            model=settings.CLAUDE_MODEL,
            max_tokens=1024,
            system=store.system_prompt,
            tools=TOOLS,
            messages=messages,
        ) as stream:
            for text in stream.text_stream:
                streamed_text += text
                yield {"type": "token", "text": text}

            final = stream.get_final_message()

        if final.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": final.content})
            yield {"type": "status", "text": "Looking up menu..."}

            tool_results = [
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": _execute_tool(block.name, block.input, session, store),
                }
                for block in final.content
                if block.type == "tool_use"
            ]
            messages.append({"role": "user", "content": tool_results})
            continue

        if final.stop_reason == "end_turn":
            messages.append({"role": "assistant", "content": streamed_text})
            session["conversation_history"] = messages
            return

        logger.warning("Unexpected stop_reason: %s", final.stop_reason)
        break

    yield {"type": "token", "text": FALLBACK_MSG}
