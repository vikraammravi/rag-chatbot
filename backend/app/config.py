"""App settings from environment variables."""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

RESTAURANT_PHONE = "+1 416-439-0909"


class Settings:
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    CLAUDE_MODEL: str = os.getenv("CLAUDE_MODEL", "claude-haiku-4-5-20251001")
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_SUCCESS_URL: str = os.getenv("STRIPE_SUCCESS_URL", "http://localhost:3000?payment=success")
    STRIPE_CANCEL_URL: str = os.getenv("STRIPE_CANCEL_URL", "http://localhost:3000?payment=cancelled")
    DATA_DIR: Path = Path(__file__).parent / "data"
    # Comma-separated list of allowed origins — add your Vercel URL here in production
    CORS_ORIGINS: list = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,https://aahatrulysouth.com",
    ).split(",")
    FAQ_CACHE: dict = {
        # Hours & location
        "are you open":   f"We're open daily! Scarborough: 1177 Brimley Rd | Downtown: 250 Dundas St W. Call {RESTAURANT_PHONE} for current hours.",
        "hours":          f"Call {RESTAURANT_PHONE} or visit us — Scarborough: 1177 Brimley Rd | Downtown: 250 Dundas St W.",
        "what time":      f"Call {RESTAURANT_PHONE} for today's hours. We're at Scarborough (1177 Brimley Rd) and Downtown (250 Dundas St W).",
        "address":        f"Scarborough: 1177 Brimley Rd | Downtown: 250 Dundas St W. Call {RESTAURANT_PHONE} for directions.",
        "where are you":  f"Two locations — Scarborough: 1177 Brimley Rd | Downtown: 250 Dundas St W.",
        "location":       f"We have two locations — Scarborough: 1177 Brimley Rd | Downtown: 250 Dundas St W.",
        # Food & dietary
        "vegetarian":     "Yes! We're 100% pure vegetarian — no meat, no eggs.",
        "is the food veg":"Yes! We're 100% pure vegetarian — no meat, no eggs.",
        "vegan":          "Most of our dishes are vegan-friendly. Ask about specific items and we'll confirm.",
        "gluten":         f"Please call {RESTAURANT_PHONE} to discuss gluten or allergen requirements.",
        "allerg":         f"Please call {RESTAURANT_PHONE} to discuss any allergy concerns before visiting.",
        "halal":          "We are 100% pure vegetarian — no meat or animal products are served.",
        # Contact & services
        "phone number":   f"Call us at {RESTAURANT_PHONE}.",
        "contact":        f"Reach us at {RESTAURANT_PHONE}.",
        "do you deliver": "We offer pickup. Scarborough via TBDine, Downtown via GoSnappy.",
        "delivery":       "We offer pickup. Scarborough via TBDine, Downtown via GoSnappy.",
        "catering":       f"Yes, we offer catering! Call {RESTAURANT_PHONE} to discuss your event.",
        "parking":        "Both locations have street parking nearby.",
        "wifi":           f"Call {RESTAURANT_PHONE} to ask about WiFi at a specific location.",
    }
    # Menu is NOT injected here — Claude uses the search_menu tool at runtime.
    # This keeps the prompt small (~200 tokens vs ~2500), cutting latency and cost.
    SYSTEM_PROMPT_TEMPLATE: str = """You are the friendly AI assistant for {restaurant_name}, an authentic South Indian vegetarian breakfast restaurant in Toronto.

LOCATIONS:
{locations_text}
Phone: {phone}

RULES:
- ALWAYS use the search_menu tool before recommending or describing any menu item
- Use get_cart before summarising the cart
- Only state prices and items returned by search_menu — never guess
- Prices are in CAD
- Collect name + phone via collect_customer_info before calling create_checkout
- When create_checkout returns a URL, paste the full URL on its own line — do not add lead-in text like "click here" or "complete payment here" before it
- Keep responses SHORT — 2 to 3 sentences max
- Warm, friendly tone — no greetings like "Vanakkam", no emojis
- Pure vegetarian restaurant — no meat, no eggs
- If unsure about anything, suggest calling {phone}"""


settings = Settings()

if not settings.ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY is not set. Add it to your .env file.")
