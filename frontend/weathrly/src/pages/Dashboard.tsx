import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../api/axios";
import { getErrorMessage } from "../utils/errors";
import { sceneForDescription } from "../utils/weatherScene";
import type { ShellContext } from "../layouts/AppShell";
import type { Favorite, ForecastDay, ForecastItem, HistoryItem, Weather } from "../types";
import WeatherSearch from "../components/weather/WeatherSearch";
import Forecast from "../components/weather/Forecast";
import SearchHistory from "../components/dashboard/SearchHistory";
import FavoriteList from "../components/dashboard/FavoriteList";
import EmptyState from "../components/dashboard/EmptyState";
import CurrentWeather from "../components/weather/CurrentWeather";

// Shown as quick picks on a fresh dashboard, after the user's own favorites
const DEFAULT_SUGGESTIONS = ["London", "Tokyo", "Muscat", "New York"];

function groupForecast(list: ForecastItem[]): ForecastDay[] {
  if (!Array.isArray(list)) return [];

  const grouped: Record<string, { temps: number[]; descriptions: string[] }> = {};

  list.forEach((item) => {
    const date = item.datetime.split(" ")[0];

    if (!grouped[date]) {
      grouped[date] = {
        temps: [],
        descriptions: [],
      };
    }

    grouped[date].temps.push(item.temperature);
    grouped[date].descriptions.push(item.description);
  });

  // dt_txt is UTC, so these dates are UTC days and can differ from the city's local day.
  // The 3-hourly data can span six dates; keep the first five to match the "5-Day Forecast" heading.
  return Object.keys(grouped).slice(0, 5).map((date) => {
    const temps = grouped[date].temps;

    return {
      date,
      min: Math.min(...temps),
      max: Math.max(...temps),
      description: grouped[date].descriptions[0],
    };
  });
}

export default function Dashboard() {
  const { setScene } = useOutletContext<ShellContext>();

  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [activeCity, setActiveCity] = useState<string>("");
  const inFlight = useRef(false);


  // Load current weather and forecast for a city, then refresh history.
  // Resolves true on success so the search box knows when to clear itself.
  const loadCity = async (city: string): Promise<boolean> => {
    if (!city || inFlight.current) return false;

    inFlight.current = true;
    setLoading(true);
    setError("");

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        api.get<Weather>("/weather/current", { params: { city } }),
        api.get<ForecastItem[]>("/weather/forecast", { params: { city } }),
      ]);

      setWeather(weatherRes.data);
      setForecast(groupForecast(forecastRes.data));
      // use the API's canonical name so it matches favorites and history
      setActiveCity(weatherRes.data.city);
      // the sky follows the weather of the city on screen
      setScene(sceneForDescription(weatherRes.data.description));

      await fetchHistory();
      return true;
    } catch (err) {
      console.error(err);
      setWeather(null);
      setForecast([]);
      setActiveCity("");
      setScene("sunny");
      setError(getErrorMessage(err, "Could not fetch weather"));
      return false;
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  };


  // Fetch history
  const fetchHistory = async () => {
    try {
      const res = await api.get<HistoryItem[]>("/history/");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };


  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      const res = await api.get<Favorite[]>("/favorites/");
      setFavorites(res.data);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };


  // Add favorites
  const addFavorite = async () => {
    if (!weather) return;

    try {
      await api.post("/favorites/", {
        city_name: weather.city,
        country: weather.country,
      });

      await fetchFavorites();
    } catch (err) {
      console.error("Failed to add favorite", err);
      setError(getErrorMessage(err, "Could not add favorite"));
    }
  };


  // delete favorites
  const deleteFavorite = async (id: number) => {
    try {
      await api.delete(`/favorites/${id}`);
      await fetchFavorites();
    } catch (err) {
      console.error("Failed to delete favorite", err);
      setError(getErrorMessage(err, "Could not remove favorite"));
    }
  };


  const clearHistory = async () => {
    try {
      await api.delete("/history/");
      await fetchHistory();
    } catch (err) {
      console.error("Failed to clear history", err);
    }
  };


  // The Save button toggles: saved cities are matched case-insensitively, like the backend does
  const savedFavorite = weather
    ? favorites.find((f) => f.city_name.toLowerCase() === weather.city.toLowerCase())
    : undefined;

  const toggleFavorite = () => {
    setError("");

    if (savedFavorite) deleteFavorite(savedFavorite.id);
    else addFavorite();
  };


  // Load history and favorites on page load
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchHistory(), fetchFavorites()]);
    };

    loadInitialData();
  }, []);


  const suggestions = [
    ...favorites.map((f) => f.city_name),
    ...DEFAULT_SUGGESTIONS,
  ]
    .filter((city, i, all) => all.findIndex((c) => c.toLowerCase() === city.toLowerCase()) === i)
    .slice(0, 4);

  return (
    <main className="grid gap-8 pb-16 pt-2 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10">
      <h1 className="sr-only">Weather dashboard</h1>

      <div className="min-w-0 space-y-8">
        <WeatherSearch onSearch={loadCity} busy={loading} />

        {error && (
          <p
            role="alert"
            className="sky-glass flex items-start gap-2.5 rounded-2xl px-4 py-3.5 text-[15px] leading-snug text-[#a30018]"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mt-px shrink-0">
              <path d="M10 1.8a8.2 8.2 0 100 16.4 8.2 8.2 0 000-16.4zM9.1 6a.9.9 0 011.8 0v4.6a.9.9 0 01-1.8 0V6zm.9 8.9a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" />
            </svg>
            <span>{error}</span>
          </p>
        )}

        {weather ? (
          <>
            <CurrentWeather
              weather={weather}
              isFavorite={!!savedFavorite}
              busy={loading}
              onToggleFavorite={toggleFavorite}
            />
            <Forecast forecast={forecast} />
          </>
        ) : (
          <EmptyState suggestions={suggestions} onPick={loadCity} loading={loading} />
        )}
      </div>

      <aside aria-label="Your cities" className="space-y-6">
        <FavoriteList
          favorites={favorites}
          activeCity={activeCity}
          onSelectCity={loadCity}
          onDeleteFavorite={deleteFavorite}
        />

        <SearchHistory
          history={history}
          activeCity={activeCity}
          onSelectCity={loadCity}
          onClearHistory={clearHistory}
        />
      </aside>
    </main>
  );
}
