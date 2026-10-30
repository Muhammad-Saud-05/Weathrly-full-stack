import SceneIcon from "../sky/SceneIcon";
import { sceneForDescription } from "../../utils/weatherScene";
import { formatTemp } from "../../utils/temperature";
import type { ForecastDay } from "../../types";

interface Props {
  forecast: ForecastDay[];
}

// Forecast dates are UTC days (see groupForecast), so format them in UTC too.
const weekday = (date: string, index: number) =>
  index === 0
    ? "Today"
    : new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, { weekday: "short", timeZone: "UTC" });

export default function Forecast({ forecast }: Props) {
  return (
    <section aria-labelledby="forecast-heading" className="sky-glass sky-text-in rounded-[28px] p-5 text-slate-900 sm:p-7">
      <h2 id="forecast-heading" className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-600">
        5-day forecast
      </h2>

      <ul className="mt-5 grid grid-cols-5 gap-1 sm:gap-3">
        {forecast.map((day, index) => (
          <li
            key={day.date}
            className={`flex flex-col items-center gap-2 rounded-2xl px-1 py-3 text-center sm:px-2 sm:py-4 ${
              index === 0 ? "bg-slate-900/[0.07]" : ""
            }`}
          >
            <p className="text-[13px] font-semibold sm:text-[14px]">{weekday(day.date, index)}</p>
            <div className="text-slate-800">
              <SceneIcon id={sceneForDescription(day.description)} size={26} />
            </div>
            <p className="text-[16px] font-semibold sm:text-[18px]">{formatTemp(day.max)}</p>
            <p className="text-[14px] text-slate-600 sm:text-[15px]">{formatTemp(day.min)}</p>
            <p className="hidden text-[12px] leading-tight first-letter:uppercase text-slate-600 sm:block">{day.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
