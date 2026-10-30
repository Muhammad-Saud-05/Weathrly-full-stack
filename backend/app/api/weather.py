from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.weather_service import (
    get_current_weather,
    get_forecast,
    CityNotFoundError,
    WeatherError,
)
from app.db.database import SessionLocal
from app.models.search_history import SearchHistory
from app.dependencies import get_current_user
from app.utils.normalizer import normalize_city

router = APIRouter(prefix="/weather", tags=["Weather"])


# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def raise_http_error(err: WeatherError):
    if isinstance(err, CityNotFoundError):
        raise HTTPException(status_code=404, detail="City not found")
    raise HTTPException(status_code=502, detail="Weather service unavailable")


# CURRENT WEATHER
@router.get("/current")
def current_weather(
    city: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    city = normalize_city(city)

    try:
        result = get_current_weather(city)
    except WeatherError as err:
        raise_http_error(err)

    history = SearchHistory(
        user_id=current_user.id,
        city_name=city,
        country=result["country"]
    )

    db.add(history)
    db.commit()

    return result


# FORECAST
@router.get("/forecast")
def forecast(city: str):
    try:
        return get_forecast(city)
    except WeatherError as err:
        raise_http_error(err)
