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

# Where password reset links point (the frontend's address)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")

# Outgoing email for password resets. Without SMTP_HOST the reset link is written to the
# server log instead, which is handy in development.
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM") or SMTP_USER or "no-reply@weathrly.local"
