import SceneIcon from "../sky/SceneIcon";
import { sceneForDescription } from "../../utils/weatherScene";
import { formatTemp } from "../../utils/temperature";
import type { Weather } from "../../types";

interface Props {
  weather: Weather;
  isFavorite: boolean;
  // true while another search is replacing this one
  busy: boolean;
  onToggleFavorite: () => void;
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export default function CurrentWeather({ weather, isFavorite, busy, onToggleFavorite }: Props) {
  return (
    <section
      aria-labelledby="current-city"
      aria-busy={busy}
      className={`sky-text-in transition-opacity duration-200 [text-shadow:0_2px_28px_rgba(0,0,0,0.28)] ${
        busy ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-white/85">
            Right now &middot; {weather.country}
          </p>
          <h2
            id="current-city"
            className="mt-1 text-[clamp(2.25rem,6vw,3.5rem)] font-semibold leading-[1] tracking-[-0.035em]"
          >
            {weather.city}
          </h2>
        </div>

        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          className="flex shrink-0 items-center gap-2 rounded-full border border-white/30 bg-slate-900/40 px-4 py-2.5 text-[14px] font-medium text-white outline-none backdrop-blur-md transition duration-100 [text-shadow:none] hover:bg-slate-900/55 focus-visible:ring-4 focus-visible:ring-white/60 active:scale-[0.97] motion-reduce:active:scale-100"
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isFavorite ? "#ffd48a" : "none"}
            stroke={isFavorite ? "#ffd48a" : "currentColor"}
            strokeWidth="2"
            strokeLinejoin="round"
          >
            <path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1L3.2 9.6l6.1-.8L12 3.2z" />
          </svg>
          {isFavorite ? "Saved" : "Save"}
        </button>
      </div>

      <div className="mt-3 flex items-end gap-5 sm:gap-8">
        <p className="text-[clamp(6.5rem,20vw,11.5rem)] font-light leading-[0.82] tracking-[-0.06em]">
          {formatTemp(weather.temperature)}
        </p>

        <div className="pb-3 sm:pb-5">
          <SceneIcon id={sceneForDescription(weather.description)} size={44} />
          <p className="mt-2 text-[clamp(1.1rem,3vw,1.5rem)] font-medium tracking-[-0.01em]">
            {capitalize(weather.description)}
          </p>
        </div>
      </div>

      <dl className="mt-6 flex flex-wrap gap-3 [text-shadow:none]">
        <div className="sky-chip rounded-2xl px-4 py-2.5">
          <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/80">Feels like</dt>
          <dd className="text-[19px] font-semibold">{formatTemp(weather.feels_like)}</dd>
        </div>
        <div className="sky-chip rounded-2xl px-4 py-2.5">
          <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/80">Humidity</dt>
          <dd className="text-[19px] font-semibold">{weather.humidity}%</dd>
        </div>
      </dl>
    </section>
  );
}
