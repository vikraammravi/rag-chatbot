"""Ingestion pipeline — runs on app startup. Loads menu.json → chunks → builds prompt."""

from pathlib import Path

from app.config import settings
from app.ingestion.loader import MenuStore, load_json, chunk_menu

# Global store — populated by run_pipeline(), used by services
store = MenuStore()


def run_pipeline(data_dir: Path) -> None:
    """Load menu data, chunk items, build system prompt."""
    global store

    raw = load_json(data_dir / "menu.json")

    store.restaurant = raw["restaurant"]
    store.locations = raw["locations"]
    store.menu = raw["menu"]
    store.chunks = chunk_menu(store.menu)
    store.system_prompt = _build_prompt(store)

    print(f"  ✅ Loaded {len(store.chunks)} menu items")


def _build_prompt(s: MenuStore) -> str:
    locations_text = "\n".join(
        f"- {name.title()}: {loc['address']}"
        for name, loc in s.locations.items()
    )
    return settings.SYSTEM_PROMPT_TEMPLATE.format(
        restaurant_name=s.restaurant["name"],
        locations_text=locations_text,
        phone=s.restaurant["phone"],
    )


def get_store() -> MenuStore:
    """Access the loaded store from anywhere."""
    return store
