from dotenv import load_dotenv
import os

load_dotenv()

SCANNER_BASE_URL = os.getenv("PERSON1_API_URL", "http://localhost:8001")
AI_BASE_URL = os.getenv("PERSON2_API_URL", "http://localhost:8002")
FRONTEND_ORIGIN = os.getenv("FRONTEND_URL", "http://localhost:5173")

def get_settings():
    return {
        "scanner_url": SCANNER_BASE_URL,
        "ai_url": AI_BASE_URL,
        "frontend_url": FRONTEND_ORIGIN
    }