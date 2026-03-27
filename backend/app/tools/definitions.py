"""Claude tool definitions — sent with every API call.

Rule of thumb for descriptions:
- State the exact trigger condition (when TO call)
- State what NOT to do (prevents redundant calls)
- State any prerequisite order between tools
"""

# Hard cap on tool-call iterations per user message.
# A normal order flow (search → add → location → info → checkout) needs ~5.
# 8 gives breathing room for multi-item orders without runaway loops.
MAX_TOOL_ITERATIONS = 8

TOOLS = [
    {
        "name": "search_menu",
        "description": (
            "Search the menu by keyword, category, or dietary preference. "
            "Call this when the customer asks what's available, asks for recommendations, "
            "or mentions a specific dish before adding it to the cart. "
            "Do NOT call again if the results are already in the conversation — "
            "reuse prior search results instead of making a redundant call."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "What the customer is looking for, e.g. 'dosa', 'something crispy', 'mild breakfast'",
                },
                "category": {
                    "type": "string",
                    "enum": ["idly", "vada", "dosa", "uttapam", "upma_pongal", "beverages", "desserts"],
                    "description": "Filter to a specific menu section. Omit if searching across all categories.",
                },
                "only_mild": {
                    "type": "boolean",
                    "description": "Set true only if the customer explicitly asks for non-spicy or mild options.",
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "add_to_cart",
        "description": (
            "Add a menu item to the customer's cart. "
            "Only call this after confirming the item exists (from search_menu results or prior context). "
            "Use the quantity field for multiple units — do NOT call this tool twice for the same item. "
            "Do NOT call speculatively or to 'confirm' an item; only call when the customer clearly says they want it."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "item_name": {
                    "type": "string",
                    "description": "Exact item name as returned by search_menu.",
                },
                "quantity": {
                    "type": "integer",
                    "description": "Number of units. Defaults to 1.",
                    "default": 1,
                },
                "notes": {
                    "type": "string",
                    "description": "Special instructions from the customer, e.g. 'extra chutney', 'no onion'.",
                },
            },
            "required": ["item_name", "quantity"],
        },
    },
    {
        "name": "remove_from_cart",
        "description": (
            "Remove an item from the customer's cart. "
            "Only call when the customer explicitly asks to remove or cancel a specific item. "
            "Do NOT call this to 'replace' an item — remove first, then add the new item separately."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "item_name": {
                    "type": "string",
                    "description": "Name of the item to remove.",
                },
            },
            "required": ["item_name"],
        },
    },
    {
        "name": "get_cart",
        "description": (
            "Retrieve the customer's current cart with itemised totals and tax. "
            "Call this only when the customer asks to see their cart or order summary. "
            "Do NOT call after every add/remove — the cart state is already updated automatically. "
            "Do NOT call before create_checkout — that step handles cart validation internally."
        ),
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "set_location",
        "description": (
            "Set the customer's pickup location to either 'scarborough' or 'downtown'. "
            "Call this as soon as the customer mentions which location they want. "
            "Do NOT call again if the location is already set in the conversation unless the customer changes it."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "enum": ["scarborough", "downtown"],
                    "description": "The pickup branch the customer chose.",
                },
            },
            "required": ["location"],
        },
    },
    {
        "name": "collect_customer_info",
        "description": (
            "Save the customer's name and phone number required for the pickup order. "
            "Call this once you have both pieces of information from the customer. "
            "Must be called BEFORE create_checkout — checkout will fail without it. "
            "Do NOT call more than once per session; if info is already saved, proceed directly to checkout."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_name": {
                    "type": "string",
                    "description": "Customer's full name.",
                },
                "customer_phone": {
                    "type": "string",
                    "description": "Customer's phone number for pickup notification.",
                },
            },
            "required": ["customer_name", "customer_phone"],
        },
    },
    {
        "name": "create_checkout",
        "description": (
            "Generate a Stripe payment link and finalise the order. "
            "Only call this when the customer explicitly says they are ready to pay or checkout. "
            "Prerequisites — all three must be true before calling: "
            "(1) cart is not empty, "
            "(2) pickup location is set via set_location, "
            "(3) customer name and phone are saved via collect_customer_info. "
            "Do NOT call speculatively. If any prerequisite is missing, collect it first."
        ),
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "get_restaurant_info",
        "description": (
            "Return address, hours, phone number, and parking info for a restaurant location. "
            "Call this only when the customer asks about location details, opening hours, or how to get there. "
            "Do NOT call this during the ordering flow — it is informational only."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "enum": ["scarborough", "downtown"],
                    "description": "Which branch to look up. Defaults to scarborough if not specified.",
                },
            },
        },
    },
]
