"""App settings from environment variables."""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

RESTAURANT_PHONE = "+1 416-439-0909"


class Settings:
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    CLAUDE_MODEL: str = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-20250514")
    DATA_DIR: Path = Path(__file__).parent / "data"
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "https://aahatrulysouth.com",
    ]
    FAQ_CACHE: dict = {
        "are you open": f"We're open daily! Scarborough (1177 Brimley Rd) or Downtown (250 Dundas St W). Call {RESTAURANT_PHONE} for hours.",
        "vegetarian": "Yes! We're 100% pure vegetarian.",
        "is the food veg": "Yes! We're 100% pure vegetarian.",
        "phone number": f"Call us at {RESTAURANT_PHONE}.",
        "do you deliver": "We offer pickup. Scarborough via TBDine, Downtown via GoSnappy.",
        "parking": "Both locations have street parking nearby.",
    }
    SYSTEM_PROMPT_TEMPLATE: str = """You are the friendly AI assistant for {restaurant_name}, an authentic South Indian vegetarian breakfast restaurant in Toronto.

MENU:
{menu_json}

LOCATIONS:
{locations_text}
Phone: {phone}

RULES:
- Use search_menu tool before recommending items
- Use get_cart before summarizing cart
- Only recommend actual menu items with correct prices
- Prices in CAD
- Collect name + phone via collect_customer_info before checkout
- Keep responses SHORT (2-3 sentences)
- Warm, friendly tone
- Pure vegetarian — no non-veg
- If unsure, suggest calling {phone}"""


settings = Settings()

if not settings.ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY is not set. Add it to your .env file.")
