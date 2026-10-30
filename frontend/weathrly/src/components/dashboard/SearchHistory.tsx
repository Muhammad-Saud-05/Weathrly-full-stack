import { timeAgo } from "../../utils/time";
import type { HistoryItem } from "../../types";

interface SearchHistoryProps {
  history: HistoryItem[];
  activeCity: string;
  onSelectCity: (city: string) => void;
  onClearHistory: () => void;
}

// The API returns every lookup, newest first. The panel is for getting back to places,
// so show each city once (its latest search) and only the most recent few.
const VISIBLE = 8;

function latestPerCity(history: HistoryItem[]): HistoryItem[] {
  const seen = new Set<string>();

  return history
    .filter((item) => {
      const key = item.city_name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, VISIBLE);
}

export default function SearchHistory({
  history,
  activeCity,
  onSelectCity,
  onClearHistory,
}: SearchHistoryProps) {
  return (
    <section aria-labelledby="history-heading" className="sky-glass sky-text-in rounded-[28px] p-5 text-slate-900 sm:p-6">
      <div className="flex items-baseline justify-between">
        <h2 id="history-heading" className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-600">
          Recent searches
        </h2>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="rounded text-[13px] font-medium text-[#0059b8] outline-none hover:underline focus-visible:ring-4 focus-visible:ring-[#0071e3]/35"
          >
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="mt-4 text-[15px] leading-snug text-slate-700">Cities you look up will appear here.</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {latestPerCity(history).map((item) => {
            const active = activeCity === item.city_name;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelectCity(item.city_name)}
                  aria-current={active ? "true" : undefined}
                  className={`flex w-full items-baseline justify-between gap-3 rounded-2xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-4 focus-visible:ring-[#0071e3]/35 ${
                    active ? "bg-[#0071e3]/12" : "hover:bg-slate-900/[0.05]"
                  }`}
                >
                  <span className={`truncate text-[16px] ${active ? "font-semibold text-[#0059b8]" : "font-medium"}`}>
                    {item.city_name}
                    {item.country && <span className="font-normal text-slate-600">, {item.country}</span>}
                  </span>
                  <span className="shrink-0 text-[12px] text-slate-600">{timeAgo(item.searched_at)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
