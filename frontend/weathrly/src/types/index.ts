export interface Weather {
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  description: string;
}

// One 3-hourly entry as returned by /weather/forecast
export interface ForecastItem {
  datetime: string;
  temperature: number;
  humidity: number;
  description: string;
}

// ForecastItems grouped by calendar date
export interface ForecastDay {
  date: string;
  min: number;
  max: number;
  description: string;
}

export interface Favorite {
  id: number;
  city_name: string;
  country: string | null;
  user_id: number;
}

export interface HistoryItem {
  id: number;
  city_name: string;
  country: string | null;
  searched_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}
