from pydantic import BaseModel


class CurrentWeatherResponse(BaseModel):
    city: str
    country: str
    temperature: float
    feels_like: float
    humidity: int
    description: str


class ForecastItemResponse(BaseModel):
    datetime: str
    temperature: float
    humidity: int
    description: str
