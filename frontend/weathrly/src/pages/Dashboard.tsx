import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { getErrorMessage } from "../utils/errors";
import { removeToken } from "../utils/auth";
import type { Favorite, ForecastDay, ForecastItem, HistoryItem, User, Weather } from "../types";
import WeatherSearch from "../components/weather/WeatherSearch";
import Forecast from "../components/weather/Forecast";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import SearchHistory from "../components/dashboard/SearchHistory";
import FavoriteList from "../components/dashboard/FavoriteList";
import CurrentWeather from "../components/weather/CurrentWeather";

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

  return Object.keys(grouped).map((date) => {
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
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [activeCity, setActiveCity] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const inFlight = useRef(false);
  const navigate = useNavigate();


  // Load current weather and forecast for a city, then refresh history
  const loadCity = async (city: string) => {
    if (!city || inFlight.current) return;

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

      await fetchHistory();
    } catch (err) {
      console.error(err);
      setWeather(null);
      setForecast([]);
      setActiveCity("");
      setError(getErrorMessage(err, "Could not fetch weather"));
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
      alert(getErrorMessage(err, "Could not add favorite"));
    }
  };


  // delete favorites
  const deleteFavorite = async (id: number) => {
    try {
      await api.delete(`/favorites/${id}`);
      await fetchFavorites();
    } catch (err) {
      console.error("Failed to delete favorite", err);
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


  const getWeatherIcon = (desc: string) => {
    const d = desc.toLowerCase();

      if (d.includes("clear")) return "☀️";
      if (d.includes("cloud")) return "☁️";
      if (d.includes("rain")) return "🌧️";
      if (d.includes("storm")) return "⛈️";
      if (d.includes("snow")) return "❄️";

      return "🌤️";
  };


  // logout
  const handleLogout = () => {
    removeToken();
    navigate("/login", { replace: true });
  };


  // user 
  const fetchUser = async () => {
    try {
      const res = await api.get<User>("/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };


  // Load history on page load
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchHistory(), fetchFavorites(), fetchUser()]);
    };

    loadInitialData();
  }, []);


  
  return (
    <div style={{ maxWidth: "600px", margin: "100px auto" }}>

      <DashboardHeader
        username={user?.username || ""}
        email={user?.email || ""}
        onLogout={handleLogout}
      />

      <WeatherSearch onSearch={loadCity} />

      {/* Loading error */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <CurrentWeather
        weather={weather}
        onFavorite={addFavorite}
      />

      <SearchHistory
        history={history}
        activeCity={activeCity}
        onSelectCity={loadCity}
        onClearHistory={clearHistory}
      />

      <Forecast
        forecast={forecast}
        getWeatherIcon={getWeatherIcon}
      />

      <FavoriteList
        favorites={favorites}
        activeCity={activeCity}
        onSelectCity={loadCity}
        onDeleteFavorite={deleteFavorite}
      />
    </div>
  );
}