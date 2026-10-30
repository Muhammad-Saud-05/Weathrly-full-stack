import requests
import os

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
REQUEST_TIMEOUT = 10


class WeatherError(Exception):
    """Base class for weather lookup failures."""


class CityNotFoundError(WeatherError):
    pass


class WeatherUpstreamError(WeatherError):
    """OpenWeather was unreachable, errored, or rejected our API key."""


def _fetch(url: str, city: str) -> dict:
    params = {
        "q": city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
    except requests.RequestException:
        raise WeatherUpstreamError("Weather service unavailable")

    if response.status_code == 404:
        raise CityNotFoundError(city)

    if response.status_code != 200:
        # covers 401 (bad API key), 429 and 5xx; details are deliberately not passed on
        raise WeatherUpstreamError("Weather service unavailable")

    try:
        return response.json()
    except ValueError:
        raise WeatherUpstreamError("Weather service unavailable")


def get_current_weather(city: str):
    data = _fetch(BASE_URL, city)

    return {
        "city": data["name"],
        "country": data["sys"]["country"],
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "humidity": data["main"]["humidity"],
        "description": data["weather"][0]["description"]
    }

def get_forecast(city: str):
    data = _fetch(FORECAST_URL, city)

    forecast = []

    for item in data["list"]:
        forecast.append({
            "datetime": item["dt_txt"],
            "temperature": item["main"]["temp"],
            "humidity": item["main"]["humidity"],
            "description": item["weather"][0]["description"]
        })

    return forecast
