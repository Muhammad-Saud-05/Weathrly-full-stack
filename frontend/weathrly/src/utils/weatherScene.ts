import type { SceneId } from "../components/sky/scenes";

// Map OpenWeather's description ("light rain", "overcast clouds", ...) onto one of the sky scenes.
export function sceneForDescription(description: string): SceneId {
  const d = description.toLowerCase();

  if (/(thunder|storm|rain|drizzle|shower)/.test(d)) return "rain";
  if (/(snow|sleet|blizzard)/.test(d)) return "snow";
  if (/(clear|sun)/.test(d)) return "sunny";

  // clouds, mist, fog, haze, smoke, dust ...
  return "cloudy";
}
