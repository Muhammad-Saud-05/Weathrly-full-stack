from fastapi import FastAPI
from app.api.users import router as user_router
from app.api.weather import router as weather_router
from app.api import favorites
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import ALLOWED_ORIGINS
from app.api import search_history

app = FastAPI(
    title="Weathrly API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(weather_router)
app.include_router(favorites.router)
app.include_router(search_history.router)

@app.get("/")
def root():
    return {"message": "Weathrly backend is running "}

@app.get("/health")
def health():
    return {"status": "ok"}