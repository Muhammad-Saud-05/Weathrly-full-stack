from datetime import datetime, timedelta, timezone
from urllib.parse import parse_qs, urlparse

import pytest
from jose import jwt

from app.core import jwt as jwt_module
from tests.conftest import USER, register_and_login

NEW_PASSWORD = "a-brand-new-password"


@pytest.fixture
def sent_emails(monkeypatch):
    """Capture reset emails instead of sending them: a list of (to, link)."""
    sent = []
    monkeypatch.setattr(
        "app.api.password_reset.send_password_reset_email",
        lambda to, link: sent.append((to, link)),
    )
    return sent


def token_from(link: str) -> str:
    return parse_qs(urlparse(link).query)["token"][0]


def request_reset(client, sent_emails, email=USER["email"]):
    res = client.post("/forgot-password", json={"email": email})
    assert res.status_code == 200
    return token_from(sent_emails[-1][1])


def login(client, password):
    return client.post("/login", data={"username": USER["email"], "password": password})


def test_forgot_password_emails_a_link_for_a_known_account(client, sent_emails):
    client.post("/users", json=USER)

    res = client.post("/forgot-password", json={"email": USER["email"]})

    assert res.status_code == 200
    assert len(sent_emails) == 1
    to, link = sent_emails[0]
    assert to == USER["email"]
    assert "/reset-password?token=" in link


def test_forgot_password_looks_the_same_for_an_unknown_account(client, sent_emails):
    client.post("/users", json=USER)

    known = client.post("/forgot-password", json={"email": USER["email"]})
    unknown = client.post("/forgot-password", json={"email": "nobody@example.com"})

    assert unknown.status_code == known.status_code == 200
    assert unknown.json() == known.json()
    assert len(sent_emails) == 1  # nothing was sent for the unknown address


def test_forgot_password_matches_email_case_insensitively(client, sent_emails):
    client.post("/users", json=USER)

    client.post("/forgot-password", json={"email": "SAUD@EXAMPLE.COM"})

    assert len(sent_emails) == 1


def test_forgot_password_rejects_a_malformed_email(client, sent_emails):
    assert client.post("/forgot-password", json={"email": "nope"}).status_code == 422
    assert sent_emails == []


def test_reset_password_changes_the_password(client, sent_emails):
    client.post("/users", json=USER)
    token = request_reset(client, sent_emails)

    res = client.post("/reset-password", json={"token": token, "password": NEW_PASSWORD})

    assert res.status_code == 200
    assert login(client, NEW_PASSWORD).status_code == 200
    assert login(client, USER["password"]).status_code == 401


def test_reset_link_only_works_once(client, sent_emails):
    client.post("/users", json=USER)
    token = request_reset(client, sent_emails)
    client.post("/reset-password", json={"token": token, "password": NEW_PASSWORD})

    again = client.post("/reset-password", json={"token": token, "password": "another-password"})

    assert again.status_code == 400
    assert login(client, NEW_PASSWORD).status_code == 200


def test_reset_rejects_garbage_and_expired_tokens(client, sent_emails):
    client.post("/users", json=USER)

    garbage = client.post("/reset-password", json={"token": "not-a-token", "password": NEW_PASSWORD})
    assert garbage.status_code == 400

    expired = jwt.encode(
        {
            "purpose": "password-reset",
            "uid": 1,
            "fp": "x",
            "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
        },
        jwt_module.SECRET_KEY,
        algorithm=jwt_module.ALGORITHM,
    )
    assert client.post("/reset-password", json={"token": expired, "password": NEW_PASSWORD}).status_code == 400
    assert login(client, USER["password"]).status_code == 200


def test_an_access_token_cannot_reset_a_password(client):
    headers = register_and_login(client)
    access_token = headers["Authorization"].split(" ", 1)[1]

    res = client.post("/reset-password", json={"token": access_token, "password": NEW_PASSWORD})

    assert res.status_code == 400
    assert login(client, USER["password"]).status_code == 200


def test_a_reset_token_cannot_be_used_to_sign_in(client, sent_emails):
    client.post("/users", json=USER)
    token = request_reset(client, sent_emails)

    res = client.get("/me", headers={"Authorization": f"Bearer {token}"})

    assert res.status_code == 401


def test_reset_enforces_password_length(client, sent_emails):
    client.post("/users", json=USER)
    token = request_reset(client, sent_emails)

    assert client.post("/reset-password", json={"token": token, "password": "short"}).status_code == 422
    # a rejected attempt doesn't use up the link
    assert client.post("/reset-password", json={"token": token, "password": NEW_PASSWORD}).status_code == 200
