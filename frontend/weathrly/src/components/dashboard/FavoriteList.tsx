import type { Favorite } from "../../types";

interface FavoriteListProps {
  favorites: Favorite[];
  activeCity: string;
  onSelectCity: (city: string) => void;
  onDeleteFavorite: (id: number) => void;
}

export default function FavoriteList({
  favorites,
  activeCity,
  onSelectCity,
  onDeleteFavorite,
}: FavoriteListProps) {
  return (
    <section aria-labelledby="favorites-heading" className="sky-glass sky-text-in rounded-[28px] p-5 text-slate-900 sm:p-6">
      <div className="flex items-baseline justify-between">
        <h2 id="favorites-heading" className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-600">
          Favorites
        </h2>
        {favorites.length > 0 && <span className="text-[13px] text-slate-600">{favorites.length}</span>}
      </div>

      {favorites.length === 0 ? (
        <p className="mt-4 text-[15px] leading-snug text-slate-700">
          Tap Save on any city and it will show up here for one-tap access.
        </p>
      ) : (
        <ul className="mt-3 space-y-1">
          {favorites.map((favorite) => {
            const active = activeCity === favorite.city_name;

            return (
              <li
                key={favorite.id}
                className={`flex items-center gap-1 rounded-2xl pr-1 transition-colors ${
                  active ? "bg-[#0071e3]/12" : "hover:bg-slate-900/[0.05]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectCity(favorite.city_name)}
                  aria-current={active ? "true" : undefined}
                  className="min-w-0 flex-1 rounded-2xl px-3 py-2.5 text-left outline-none focus-visible:ring-4 focus-visible:ring-[#0071e3]/35"
                >
                  <span className={`block truncate text-[16px] ${active ? "font-semibold text-[#0059b8]" : "font-medium"}`}>
                    {favorite.city_name}
                  </span>
                  {favorite.country && <span className="block text-[13px] text-slate-600">{favorite.country}</span>}
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteFavorite(favorite.id)}
                  aria-label={`Remove ${favorite.city_name} from favorites`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-slate-500 outline-none transition hover:bg-slate-900/10 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-[#0071e3]/35"
                >
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
