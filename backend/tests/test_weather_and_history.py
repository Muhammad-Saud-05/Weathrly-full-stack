import requests

from tests.conftest import FakeResponse


def history(client, headers):
    return client.get("/history/", headers=headers).json()


def test_current_weather_success_saves_canonical_history(client, auth_headers, mock_openweather):
    res = client.get("/weather/current", params={"city": "  lOnDoN "}, headers=auth_headers)

    assert res.status_code == 200
    assert res.json() == {
        "city": "London",
        "country": "GB",
        "temperature": 11.5,
        "feels_like": 10.2,
        "humidity": 80,
        "description": "light rain",
    }
    # the lookup uses the normalised query, with a timeout
    assert mock_openweather.calls[0]["params"]["q"] == "london"
    assert mock_openweather.calls[0]["timeout"] == 10

    items = history(client, auth_headers)
    assert [(h["city_name"], h["country"]) for h in items] == [("London", "GB")]


def test_unknown_city_returns_404_and_saves_no_history(client, auth_headers, mock_openweather):
    mock_openweather.response = FakeResponse(404, {"cod": "404", "message": "city not found"})

    res = client.get("/weather/current", params={"city": "Atlantis"}, headers=auth_headers)

    assert res.status_code == 404
    assert res.json()["detail"] == "City not found"
    assert history(client, auth_headers) == []


def test_upstream_failure_returns_502_without_leaking_details(client, auth_headers, mock_openweather):
    mock_openweather.response = FakeResponse(401, {"cod": 401, "message": "Invalid API key test-openweather-key"})

    res = client.get("/weather/current", params={"city": "London"}, headers=auth_headers)

    assert res.status_code == 502
    assert "test-openweather-key" not in res.text
    assert history(client, auth_headers) == []


def test_network_error_returns_502(client, auth_headers, mock_openweather):
    mock_openweather.response = requests.ConnectionError("boom")

    res = client.get("/weather/current", params={"city": "London"}, headers=auth_headers)

    assert res.status_code == 502


def test_blank_city_is_rejected(client, auth_headers, mock_openweather):
    assert client.get("/weather/current", params={"city": "   "}, headers=auth_headers).status_code == 422
    assert client.get("/weather/current", params={"city": "x" * 101}, headers=auth_headers).status_code == 422
    assert mock_openweather.calls == []


def test_weather_requires_auth(client, mock_openweather):
    assert client.get("/weather/current", params={"city": "London"}).status_code == 401
    assert client.get("/weather/forecast", params={"city": "London"}).status_code == 401


def test_forecast_success(client, auth_headers, mock_openweather):
    res = client.get("/weather/forecast", params={"city": "London"}, headers=auth_headers)

    assert res.status_code == 200
    assert res.json()[0] == {
        "datetime": "2026-10-30 12:00:00",
        "temperature": 12.0,
        "humidity": 75,
        "description": "clear sky",
    }
    assert len(res.json()) == 2


def test_forecast_unknown_city_returns_404(client, auth_headers, mock_openweather):
    mock_openweather.response = FakeResponse(404, {"cod": "404"})

    res = client.get("/weather/forecast", params={"city": "Atlantis"}, headers=auth_headers)

    assert res.status_code == 404


def test_history_lists_and_clears(client, auth_headers, mock_openweather):
    client.get("/weather/current", params={"city": "London"}, headers=auth_headers)
    client.get("/weather/current", params={"city": "London"}, headers=auth_headers)
    assert len(history(client, auth_headers)) == 2

    res = client.delete("/history/", headers=auth_headers)

    assert res.status_code == 200
    assert history(client, auth_headers) == []


def test_history_requires_auth(client):
    assert client.get("/history/").status_code == 401
    assert client.delete("/history/").status_code == 401
