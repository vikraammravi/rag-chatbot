"""Reads menu.json → parses → chunks into searchable records."""

import json
from pathlib import Path
from dataclasses import dataclass, field


@dataclass
class MenuStore:
    """In-memory store populated from menu.json at startup."""
    restaurant: dict = field(default_factory=dict)
    locations: dict = field(default_factory=dict)
    menu: dict = field(default_factory=dict)
    chunks: list = field(default_factory=list)
    system_prompt: str = ""


def load_json(file_path: Path) -> dict:
    """Read and parse menu.json."""
    if not file_path.exists():
        raise FileNotFoundError(f"Menu file not found: {file_path}")
    return json.loads(file_path.read_text(encoding="utf-8"))


def chunk_menu(menu: dict) -> list[dict]:
    """Flatten nested menu into searchable chunks. One chunk per item."""
    chunks = []
    for category, items in menu.items():
        for item in items:
            chunks.append({
                "name": item["name"],
                "price": item["price"],
                "desc": item["desc"],
                "spicy": item["spicy"],
                "tags": item.get("tags", []),
                "category": category,
                "searchable": (
                    f"{item['name']} {item['desc']} "
                    f"{' '.join(item.get('tags', []))} {category}"
                ).lower(),
            })
    return chunks
