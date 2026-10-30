from urllib.parse import quote

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from jose import JWTError
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import FRONTEND_URL
from app.core.jwt import (
    create_password_reset_token,
    password_fingerprint,
    verify_password_reset_token,
)
from app.core.security import hash_password
from app.dependencies import get_db
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.user import ForgotPasswordRequest, ResetPasswordRequest
from app.services.email_service import send_password_reset_email

router = APIRouter(tags=["Password reset"])


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(
    data: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(func.lower(User.email) == data.email.lower()).first()

    if user:
        token = create_password_reset_token(user.id, user.hashed_password)
        link = f"{FRONTEND_URL}/reset-password?token={quote(token)}"
        # sent after the response, so it takes the same time whether or not the account exists
        background_tasks.add_task(send_password_reset_email, user.email, link)

    # The same answer either way, so this can't be used to find out who has an account
    return {"message": "If an account exists for that email, a reset link is on its way."}


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    invalid = HTTPException(status_code=400, detail="This reset link is invalid or has expired.")

    try:
        payload = verify_password_reset_token(data.token)
    except JWTError:
        raise invalid

    user = db.query(User).filter(User.id == payload.get("uid")).first()

    # a token only works while the password is still the one it was issued for
    if user is None or payload.get("fp") != password_fingerprint(user.hashed_password):
        raise invalid

    user.hashed_password = hash_password(data.password)
    db.commit()

    return {"message": "Your password has been updated."}
