import os
import tempfile

# Configure the app for tests before it is imported. Real environment variables
# win over .env, so a developer's own database is never touched.
_db_dir = tempfile.mkdtemp(prefix="weathrly-test-")
os.environ["DATABASE_URL"] = f"sqlite:///{_db_dir}/test.db"
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["OPENWEATHER_API_KEY"] = "test-openweather-key"

import pytest
from fastapi.testclient import TestClient

from app.db.database import Base, engine
from app.main import app
# import the models so their tables are registered on Base.metadata
from app.models import favorite_city, search_history, user  # noqa: F401


@pytest.fixture(autouse=True)
def fresh_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    return TestClient(app)


USER = {"username": "saud", "email": "saud@example.com", "password": "password123"}


def register_and_login(client, user=USER):
    assert client.post("/users", json=user).status_code == 201
    res = client.post(
        "/login", data={"username": user["email"], "password": user["password"]}
    )
    assert res.status_code == 200
    return {"Authorization": f"Bearer {res.json()['access_token']}"}


@pytest.fixture
def auth_headers(client):
    return register_and_login(client)


class FakeResponse:
    def __init__(self, status_code=200, payload=None):
        self.status_code = status_code
        self._payload = payload if payload is not None else {}

    def json(self):
        return self._payload


CURRENT_PAYLOAD = {
    "name": "London",
    "sys": {"country": "GB"},
    "main": {"temp": 11.5, "feels_like": 10.2, "humidity": 80},
    "weather": [{"description": "light rain"}],
}

FORECAST_PAYLOAD = {
    "list": [
        {
            "dt_txt": "2026-10-30 12:00:00",
            "main": {"temp": 12.0, "humidity": 75},
            "weather": [{"description": "clear sky"}],
        },
        {
            "dt_txt": "2026-10-30 15:00:00",
            "main": {"temp": 14.0, "humidity": 70},
            "weather": [{"description": "few clouds"}],
        },
    ]
}


@pytest.fixture
def mock_openweather(monkeypatch):
    """Route requests.get to a fake OpenWeather. Set .response to change the reply."""

    class Mock:
        def __init__(self):
            self.response = None
            self.calls = []

        def get(self, url, params=None, timeout=None):
            self.calls.append({"url": url, "params": params, "timeout": timeout})
            if isinstance(self.response, Exception):
                raise self.response
            if self.response is not None:
                return self.response
            payload = FORECAST_PAYLOAD if url.endswith("/forecast") else CURRENT_PAYLOAD
            return FakeResponse(200, payload)

    mock = Mock()
    monkeypatch.setattr("app.services.weather_service.requests.get", mock.get)
    return mock
