from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.services.weather_service import (
    get_current_weather,
    get_forecast,
    CityNotFoundError,
    WeatherError,
)
from app.models.search_history import SearchHistory
from app.dependencies import get_current_user, get_db
from app.utils.normalizer import normalize_city

router = APIRouter(prefix="/weather", tags=["Weather"])

# non-empty (not just whitespace), at most 100 characters
CityQuery = Annotated[str, Query(min_length=1, max_length=100, pattern=r"\S")]

def raise_http_error(err: WeatherError):
    if isinstance(err, CityNotFoundError):
        raise HTTPException(status_code=404, detail="City not found")
    raise HTTPException(status_code=502, detail="Weather service unavailable")


# CURRENT WEATHER
@router.get("/current")
def current_weather(
    city: CityQuery,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # normalized only to build the lookup; history stores OpenWeather's canonical name
    city = normalize_city(city)

    try:
        result = get_current_weather(city)
    except WeatherError as err:
        raise_http_error(err)

    history = SearchHistory(
        user_id=current_user.id,
        city_name=result["city"],
        country=result["country"]
    )

    db.add(history)
    db.commit()

    return result


# FORECAST
@router.get("/forecast")
def forecast(
    city: CityQuery,
    current_user=Depends(get_current_user)
):
    city = normalize_city(city)

    try:
        return get_forecast(city)
    except WeatherError as err:
        raise_http_error(err)
