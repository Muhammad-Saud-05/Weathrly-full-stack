export type SceneId = "sunny" | "rain" | "wind" | "snow" | "cloudy";

export interface SampleDay {
  day: string;
  icon: SceneId;
  high: number;
  low: number;
}

// Illustrative numbers for the landing page preview; not live data
export interface SampleForecast {
  city: string;
  temp: number;
  description: string;
  stats: { label: string; value: string }[];
  week: SampleDay[];
}

export interface Scene {
  id: SceneId;
  label: string;
  headline: string;
  blurb: string;
  caption: string;
  sample: SampleForecast;
  // CSS gradient for the sky. Every sky stays mid-to-dark so white text keeps its contrast.
  sky: string;
}

// Every sky stays mid-to-dark so white text keeps its contrast
const SKY = {
  sunny: "linear-gradient(180deg, #1b6fe0 0%, #2f80e6 42%, #7fbaf5 76%, #ffdfa0 100%)",
  rain: "linear-gradient(180deg, #121a2e 0%, #26324f 50%, #44587e 100%)",
  wind: "linear-gradient(180deg, #0f5f6e 0%, #278a8a 50%, #86cdb8 100%)",
  snow: "linear-gradient(180deg, #1f2c58 0%, #4e66a0 55%, #a3b6dc 100%)",
  cloudy: "linear-gradient(180deg, #34425c 0%, #5b6d8a 52%, #98a9c2 100%)",
};

/** Sky gradient for every scene, including ones that aren't part of the landing showcase. */
export const SKY_GRADIENTS: Record<SceneId, string> = SKY;

/** The four scenes shown on the landing and login pages. */
export const SCENES: Scene[] = [
  {
    id: "sunny",
    label: "Sunny",
    headline: "Clear skies ahead.",
    blurb: "Long days, golden hours and not an umbrella in sight.",
    caption: "Sunny · 24°C · Muscat",
    sample: {
      city: "Muscat",
      temp: 24,
      description: "Clear and bright",
      stats: [{ label: "Feels like", value: "26°" }, { label: "Humidity", value: "38%" }],
      week: [
        { day: "Mon", icon: "sunny", high: 27, low: 19 },
        { day: "Tue", icon: "sunny", high: 28, low: 20 },
        { day: "Wed", icon: "wind", high: 26, low: 19 },
        { day: "Thu", icon: "sunny", high: 27, low: 18 },
        { day: "Fri", icon: "sunny", high: 29, low: 20 },
      ],
    },
    sky: SKY.sunny,
  },
  {
    id: "rain",
    label: "Rainy",
    headline: "Bring an umbrella.",
    blurb: "Know when the rain starts, and when it finally lets up.",
    caption: "Rain · 17°C · London",
    sample: {
      city: "London",
      temp: 17,
      description: "Steady rain",
      stats: [{ label: "Feels like", value: "15°" }, { label: "Humidity", value: "86%" }],
      week: [
        { day: "Mon", icon: "rain", high: 18, low: 12 },
        { day: "Tue", icon: "rain", high: 16, low: 11 },
        { day: "Wed", icon: "wind", high: 15, low: 10 },
        { day: "Thu", icon: "sunny", high: 17, low: 9 },
        { day: "Fri", icon: "rain", high: 16, low: 11 },
      ],
    },
    sky: SKY.rain,
  },
  {
    id: "wind",
    label: "Windy",
    headline: "Hold on to your hat.",
    blurb: "Gusts, direction and the feels-like that actually matters.",
    caption: "Windy · 38 km/h · Chicago",
    sample: {
      city: "Chicago",
      temp: 12,
      description: "Strong gusts",
      stats: [{ label: "Wind", value: "38 km/h" }, { label: "Humidity", value: "54%" }],
      week: [
        { day: "Mon", icon: "wind", high: 13, low: 5 },
        { day: "Tue", icon: "wind", high: 11, low: 4 },
        { day: "Wed", icon: "sunny", high: 14, low: 6 },
        { day: "Thu", icon: "rain", high: 10, low: 5 },
        { day: "Fri", icon: "wind", high: 12, low: 4 },
      ],
    },
    sky: SKY.wind,
  },
  {
    id: "snow",
    label: "Snowy",
    headline: "Snow is on the way.",
    blurb: "Plan around the first flakes, and the last ones.",
    caption: "Snow · −3°C · Oslo",
    sample: {
      city: "Oslo",
      temp: -3,
      description: "Light snow",
      stats: [{ label: "Feels like", value: "−7°" }, { label: "Humidity", value: "81%" }],
      week: [
        { day: "Mon", icon: "snow", high: -1, low: -6 },
        { day: "Tue", icon: "snow", high: -2, low: -8 },
        { day: "Wed", icon: "wind", high: 0, low: -5 },
        { day: "Thu", icon: "sunny", high: 1, low: -7 },
        { day: "Fri", icon: "snow", high: -1, low: -6 },
      ],
    },
    sky: SKY.snow,
  },
];
