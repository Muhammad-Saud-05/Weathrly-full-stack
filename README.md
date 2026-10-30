# Weathrly

A weather dashboard. Sign in, search for a city, and see its current conditions and a five-day forecast. Save favorite cities and revisit your search history.

## What it does today

- JWT sign-in (accounts are created through the API; there is no sign-up page yet)
- Current weather and five-day forecast for any city, from OpenWeatherMap
- Favorite cities (add, list, remove)
- Per-user search history (list, clear)

## Stack

| Part     | Technology                                                     |
| -------- | -------------------------------------------------------------- |
| Backend  | FastAPI, SQLAlchemy, Alembic, PostgreSQL, JWT (python-jose)    |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, axios, react-router |
| Data     | [OpenWeatherMap](https://openweathermap.org/api) API           |

## Prerequisites

- Python 3.12+
- Node.js 20+ and npm
- PostgreSQL, with an empty database for Weathrly
- A free OpenWeatherMap API key

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt   # use requirements-dev.txt to also get the test tools

cp .env.example .env              # then edit .env
```

Environment variables (`backend/.env`):

| Variable              | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `DATABASE_URL`        | PostgreSQL URL, e.g. `postgresql://user:password@localhost:5432/weathrly` |
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key                                             |
| `SECRET_KEY`          | Secret used to sign JWTs. The app refuses to start without it           |
| `ALLOWED_ORIGINS`     | Comma-separated CORS origins (default `http://localhost:5173`)          |

Generate a secret key with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Create the database tables:

```bash
alembic upgrade head
```

Run this again after pulling changes that add migrations. If your database was created by an older version of the app (which created tables on startup), either drop and recreate it, or run `alembic stamp head` to mark it as up to date. Stamping keeps the old foreign keys, which do not yet delete a user's favorites and history along with the user.

Run the API (from `backend/`):

```bash
uvicorn app.main:app --reload
```

The API is at http://127.0.0.1:8000 and interactive docs are at http://127.0.0.1:8000/docs.

### Frontend

```bash
cd frontend/weathrly
npm ci
cp .env.example .env              # optional: only needed if the API is not at http://127.0.0.1:8000
npm run dev
```

| Variable       | Description                                             |
| -------------- | ------------------------------------------------------- |
| `VITE_API_URL` | Backend base URL (default `http://127.0.0.1:8000`)      |

The app is at http://localhost:5173. The landing page is at `/`, sign-in at `/login`, and the dashboard at `/dashboard` (it redirects to `/login` when you're signed out).

### Creating your first account

There is no sign-up page yet. Open http://127.0.0.1:8000/docs, call `POST /users` with a username, email and a password of at least 8 characters, then sign in at http://localhost:5173/login with that email and password.

## Tests and checks

```bash
# backend (from backend/, with requirements-dev.txt installed)
pytest

# frontend (from frontend/weathrly)
npm run lint
npm run build
```

## API

All endpoints except `POST /users`, `POST /login`, `/` and `/health` need an `Authorization: Bearer <token>` header.

| Method | Path                        | Description                                                        |
| ------ | --------------------------- | ------------------------------------------------------------------ |
| GET    | `/`, `/health`              | Liveness checks                                                    |
| POST   | `/users`                    | Create an account. `201` on success, `409` if email or username is taken |
| POST   | `/login`                    | Form fields `username` (the email) and `password`; returns a bearer token |
| GET    | `/me`                       | The signed-in user                                                 |
| GET    | `/weather/current?city=`    | Current weather. `404` if the city is unknown, `502` if OpenWeather fails. Saves a history entry |
| GET    | `/weather/forecast?city=`   | 3-hourly forecast entries (UTC)                                    |
| GET    | `/favorites/`               | List favorite cities                                               |
| POST   | `/favorites/`               | Add a favorite (`city_name`, optional `country`)                   |
| DELETE | `/favorites/{id}`           | Remove a favorite                                                  |
| GET    | `/history/`                 | Search history, newest first                                       |
| DELETE | `/history/`                 | Clear search history                                               |

## Planned

- AI-powered weather prediction (no AI or ML code exists yet)
- Sign-up page and password reset
- Frontend redesign
