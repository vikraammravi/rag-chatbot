"""Claude tool definitions — sent with every API call."""

TOOLS = [
    {
        "name": "search_menu",
        "description": "Search menu items by keyword, category, or preference. Use before recommending food.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "e.g. 'dosa', 'crispy', 'mild', 'kids'"},
                "category": {"type": "string", "enum": ["idly", "vada", "dosa", "uttapam", "upma_pongal", "beverages", "desserts"]},
                "only_mild": {"type": "boolean", "description": "Only non-spicy items"},
            },
            "required": ["query"],
        },
    },
    {
        "name": "add_to_cart",
        "description": "Add a menu item to customer's cart.",
        "input_schema": {
            "type": "object",
            "properties": {
                "item_name": {"type": "string"},
                "quantity": {"type": "integer", "default": 1},
                "notes": {"type": "string", "description": "Special instructions"},
            },
            "required": ["item_name", "quantity"],
        },
    },
    {
        "name": "remove_from_cart",
        "description": "Remove an item from cart.",
        "input_schema": {
            "type": "object",
            "properties": {"item_name": {"type": "string"}},
            "required": ["item_name"],
        },
    },
    {
        "name": "get_cart",
        "description": "Get current cart with total.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "set_location",
        "description": "Set pickup location.",
        "input_schema": {
            "type": "object",
            "properties": {"location": {"type": "string", "enum": ["scarborough", "downtown"]}},
            "required": ["location"],
        },
    },
    {
        "name": "collect_customer_info",
        "description": "Save customer name and phone. Call BEFORE create_checkout.",
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_name": {"type": "string"},
                "customer_phone": {"type": "string"},
            },
            "required": ["customer_name", "customer_phone"],
        },
    },
    {
        "name": "create_checkout",
        "description": "Generate order + payment. Only when customer wants to pay.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "get_restaurant_info",
        "description": "Get restaurant location, phone, info.",
        "input_schema": {
            "type": "object",
            "properties": {"location": {"type": "string", "enum": ["scarborough", "downtown"]}},
        },
    },
]
