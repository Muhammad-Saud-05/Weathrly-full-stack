from tests.conftest import register_and_login

OTHER_USER = {"username": "other", "email": "other@example.com", "password": "password123"}


def test_favorites_require_auth(client):
    assert client.get("/favorites/").status_code == 401


def test_add_and_list_favorite(client, auth_headers):
    res = client.post("/favorites/", json={"city_name": "London", "country": "GB"}, headers=auth_headers)

    assert res.status_code == 200
    assert res.json()["city_name"] == "London"

    listed = client.get("/favorites/", headers=auth_headers).json()
    assert [f["city_name"] for f in listed] == ["London"]


def test_duplicate_favorite_rejected_case_insensitively(client, auth_headers):
    client.post("/favorites/", json={"city_name": "London"}, headers=auth_headers)

    res = client.post("/favorites/", json={"city_name": "london"}, headers=auth_headers)

    assert res.status_code == 400
    assert len(client.get("/favorites/", headers=auth_headers).json()) == 1


def test_delete_favorite(client, auth_headers):
    fav_id = client.post("/favorites/", json={"city_name": "London"}, headers=auth_headers).json()["id"]

    assert client.delete(f"/favorites/{fav_id}", headers=auth_headers).status_code == 200
    assert client.get("/favorites/", headers=auth_headers).json() == []
    assert client.delete(f"/favorites/{fav_id}", headers=auth_headers).status_code == 404


def test_cannot_delete_another_users_favorite(client, auth_headers):
    fav_id = client.post("/favorites/", json={"city_name": "London"}, headers=auth_headers).json()["id"]
    other_headers = register_and_login(client, OTHER_USER)

    assert client.delete(f"/favorites/{fav_id}", headers=other_headers).status_code == 404
    assert len(client.get("/favorites/", headers=auth_headers).json()) == 1
