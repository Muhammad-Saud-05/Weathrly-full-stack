from tests.conftest import USER, register_and_login


def test_register_returns_201(client):
    res = client.post("/users", json=USER)

    assert res.status_code == 201
    body = res.json()
    assert body["email"] == USER["email"]
    assert "password" not in body and "hashed_password" not in body


def test_register_duplicate_email_returns_409(client):
    client.post("/users", json=USER)

    res = client.post("/users", json={**USER, "username": "someone_else"})

    assert res.status_code == 409


def test_register_duplicate_username_returns_409(client):
    client.post("/users", json=USER)

    res = client.post("/users", json={**USER, "email": "other@example.com"})

    assert res.status_code == 409


def test_register_rejects_bad_input(client):
    assert client.post("/users", json={**USER, "email": "not-an-email"}).status_code == 422
    assert client.post("/users", json={**USER, "password": "short"}).status_code == 422
    assert client.post("/users", json={**USER, "username": "ab"}).status_code == 422


def test_login_success_returns_token(client):
    client.post("/users", json=USER)

    res = client.post("/login", data={"username": USER["email"], "password": USER["password"]})

    assert res.status_code == 200
    assert res.json()["token_type"] == "bearer"
    assert res.json()["access_token"]


def test_login_wrong_password_returns_401(client):
    client.post("/users", json=USER)

    res = client.post("/login", data={"username": USER["email"], "password": "wrong-password"})

    assert res.status_code == 401


def test_login_unknown_user_returns_401(client):
    res = client.post("/login", data={"username": "nobody@example.com", "password": "password123"})

    assert res.status_code == 401


def test_me_without_token_returns_401(client):
    assert client.get("/me").status_code == 401


def test_me_with_token_returns_user(client):
    headers = register_and_login(client)

    res = client.get("/me", headers=headers)

    assert res.status_code == 200
    assert res.json()["email"] == USER["email"]
