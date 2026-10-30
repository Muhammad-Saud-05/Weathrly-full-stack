import hashlib

from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone

from app.core.config import SECRET_KEY

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
RESET_TOKEN_EXPIRE_MINUTES = 30
RESET_PURPOSE = "password-reset"

def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verify_access_token(token: str):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload


def password_fingerprint(hashed_password: str) -> str:
    # Ties a reset token to the password it was issued for, so it stops working once used
    return hashlib.sha256(hashed_password.encode()).hexdigest()[:16]


def create_password_reset_token(user_id: int, hashed_password: str) -> str:
    # Deliberately has no "user_id" claim, so it can never be accepted as an access token
    expire = datetime.now(timezone.utc) + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    claims = {
        "purpose": RESET_PURPOSE,
        "uid": user_id,
        "fp": password_fingerprint(hashed_password),
        "exp": expire,
    }
    return jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)


def verify_password_reset_token(token: str) -> dict:
    """Raises jose.JWTError if the token is invalid, expired, or not a reset token."""
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    if payload.get("purpose") != RESET_PURPOSE:
        raise JWTError("not a password reset token")

    return payload
