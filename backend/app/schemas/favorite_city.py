from pydantic import BaseModel, ConfigDict


class FavoriteCityCreate(BaseModel):
    city_name: str
    country: str | None = None


class FavoriteCityResponse(BaseModel):
    id: int
    city_name: str
    country: str | None
    user_id: int

    model_config = ConfigDict(from_attributes=True)