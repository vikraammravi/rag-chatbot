"""Menu search — keyword/tag matching against chunked items."""

import json
from typing import Optional
from app.ingestion.loader import MenuStore


def search(store: MenuStore, query: str, category: Optional[str] = None, only_mild: bool = False, limit: int = 8) -> str:
    query_lower = query.lower()
    results = []

    for chunk in store.chunks:
        if category and chunk["category"] != category:
            continue
        if only_mild and chunk["spicy"]:
            continue
        if query_lower in chunk["searchable"] or any(tag in query_lower for tag in chunk["tags"]):
            results.append({
                "name": chunk["name"],
                "price": chunk["price"],
                "description": chunk["desc"],
                "spicy": chunk["spicy"],
                "category": chunk["category"],
            })

    if not results and category:
        results = [
            {"name": c["name"], "price": c["price"], "description": c["desc"],
             "spicy": c["spicy"], "category": c["category"]}
            for c in store.chunks if c["category"] == category
        ]

    if not results:
        return "No items found. Try 'dosa', 'idly', 'beverages', or 'desserts'."

    return json.dumps(results[:limit], indent=2)


def find_by_name(store: MenuStore, item_name: str) -> Optional[dict]:
    name_lower = item_name.lower()
    for chunk in store.chunks:
        if chunk["name"].lower() == name_lower or name_lower in chunk["name"].lower():
            return chunk
    return None
