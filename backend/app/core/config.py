import os

from dotenv import load_dotenv

# The only place .env is loaded; every other module imports its settings from here.
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY environment variable is not set. "
        "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(48))\""
    )

# comma-separated list of origins allowed by CORS
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
