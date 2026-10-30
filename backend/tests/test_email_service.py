import logging
import smtplib

from app.services import email_service

LINK = "http://localhost:5173/reset-password?token=abc"


def test_without_smtp_the_link_goes_to_the_log(monkeypatch, caplog):
    monkeypatch.setattr(email_service, "SMTP_HOST", None)

    with caplog.at_level(logging.WARNING, logger="uvicorn.error"):
        email_service.send_password_reset_email("saud@example.com", LINK)

    assert LINK in caplog.text


def test_with_smtp_a_message_is_sent(monkeypatch):
    sent = {}

    class FakeSMTP:
        def __init__(self, host, port, timeout):
            sent["server"] = (host, port)

        def __enter__(self):
            return self

        def __exit__(self, *exc):
            return False

        def starttls(self):
            sent["tls"] = True

        def login(self, user, password):
            sent["login"] = (user, password)

        def send_message(self, message):
            sent["message"] = message

    monkeypatch.setattr(email_service, "SMTP_HOST", "smtp.example.com")
    monkeypatch.setattr(email_service, "SMTP_USER", "mailer")
    monkeypatch.setattr(email_service, "SMTP_PASSWORD", "secret")
    monkeypatch.setattr(email_service.smtplib, "SMTP", FakeSMTP)

    email_service.send_password_reset_email("saud@example.com", LINK)

    assert sent["server"] == ("smtp.example.com", email_service.SMTP_PORT)
    assert sent["tls"] and sent["login"] == ("mailer", "secret")
    message = sent["message"]
    assert message["To"] == "saud@example.com"
    assert LINK in message.get_content()


def test_a_mail_failure_does_not_raise(monkeypatch, caplog):
    def broken(*args, **kwargs):
        raise smtplib.SMTPConnectError(421, "no service")

    monkeypatch.setattr(email_service, "SMTP_HOST", "smtp.example.com")
    monkeypatch.setattr(email_service.smtplib, "SMTP", broken)

    with caplog.at_level(logging.ERROR, logger="uvicorn.error"):
        email_service.send_password_reset_email("saud@example.com", LINK)  # must not raise

    assert "Could not send" in caplog.text
