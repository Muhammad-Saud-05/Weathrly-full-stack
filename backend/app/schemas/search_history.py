from pydantic import BaseModel, ConfigDict
from datetime import datetime


class SearchHistoryResponse(BaseModel):
    id: int
    city_name: str
    country: str | None
    searched_at: datetime

    model_config = ConfigDict(from_attributes=True)