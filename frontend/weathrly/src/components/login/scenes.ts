export type SceneId = "sunny" | "rain" | "wind" | "snow";

export interface Scene {
  id: SceneId;
  label: string;
  headline: string;
  blurb: string;
  caption: string;
  // CSS gradient for the sky. Every sky stays mid-to-dark so white text keeps its contrast.
  sky: string;
}

export const SCENES: Scene[] = [
  {
    id: "sunny",
    label: "Sunny",
    headline: "Clear skies ahead.",
    blurb: "Long days, golden hours and not an umbrella in sight.",
    caption: "Sunny · 24°C · Muscat",
    sky: "linear-gradient(180deg, #1b6fe0 0%, #2f80e6 42%, #7fbaf5 76%, #ffdfa0 100%)",
  },
  {
    id: "rain",
    label: "Rainy",
    headline: "Bring an umbrella.",
    blurb: "Know when the rain starts, and when it finally lets up.",
    caption: "Rain · 17°C · London",
    sky: "linear-gradient(180deg, #121a2e 0%, #26324f 50%, #44587e 100%)",
  },
  {
    id: "wind",
    label: "Windy",
    headline: "Hold on to your hat.",
    blurb: "Gusts, direction and the feels-like that actually matters.",
    caption: "Windy · 38 km/h · Chicago",
    sky: "linear-gradient(180deg, #0f5f6e 0%, #278a8a 50%, #86cdb8 100%)",
  },
  {
    id: "snow",
    label: "Snowy",
    headline: "Snow is on the way.",
    blurb: "Plan around the first flakes, and the last ones.",
    caption: "Snow · −3°C · Oslo",
    sky: "linear-gradient(180deg, #1f2c58 0%, #4e66a0 55%, #a3b6dc 100%)",
  },
];
