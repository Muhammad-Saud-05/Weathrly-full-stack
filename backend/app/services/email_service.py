import logging
import smtplib
from email.message import EmailMessage

from app.core.config import SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER
from app.core.jwt import RESET_TOKEN_EXPIRE_MINUTES

logger = logging.getLogger("uvicorn.error")


def send_password_reset_email(to: str, link: str) -> None:
    """Email a reset link. Never raises: a mail problem must not change the API's response."""
    if not SMTP_HOST:
        logger.warning("SMTP is not configured. Password reset link for %s: %s", to, link)
        return

    message = EmailMessage()
    message["Subject"] = "Reset your Weathrly password"
    message["From"] = SMTP_FROM
    message["To"] = to
    message.set_content(
        "Someone asked to reset the password for your Weathrly account.\n\n"
        f"Choose a new password here (the link works for {RESET_TOKEN_EXPIRE_MINUTES} minutes):\n"
        f"{link}\n\n"
        "If that wasn't you, you can ignore this email. Your password won't change."
    )

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as smtp:
            smtp.starttls()
            if SMTP_USER:
                smtp.login(SMTP_USER, SMTP_PASSWORD or "")
            smtp.send_message(message)
    except (smtplib.SMTPException, OSError):
        logger.exception("Could not send the password reset email to %s", to)
