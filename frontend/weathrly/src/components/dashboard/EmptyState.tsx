interface Props {
  suggestions: string[];
  onPick: (city: string) => void;
  // shown while the very first search is in flight
  loading: boolean;
}

export default function EmptyState({ suggestions, onPick, loading }: Props) {
  if (loading) {
    return (
      <section aria-busy="true" aria-label="Loading weather" className="animate-pulse space-y-5 motion-reduce:animate-none">
        <div className="h-4 w-32 rounded-full bg-white/25" />
        <div className="h-12 w-64 rounded-2xl bg-white/25" />
        <div className="h-40 w-72 rounded-3xl bg-white/20" />
        <div className="flex gap-3">
          <div className="h-16 w-28 rounded-2xl bg-white/20" />
          <div className="h-16 w-28 rounded-2xl bg-white/20" />
        </div>
      </section>
    );
  }

  return (
    <section className="sky-text-in py-6 [text-shadow:0_2px_28px_rgba(0,0,0,0.28)] sm:py-10">
      <h2 className="text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
        Where to?
      </h2>
      <p className="mt-4 max-w-md text-[18px] leading-snug text-white/90">
        Search for any city to see how the sky looks there right now, and what's coming over the next five days.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-2.5 [text-shadow:none]">
        <span className="text-[14px] text-white/85">Try</span>
        {suggestions.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => onPick(city)}
            className="sky-chip rounded-full px-4 py-2 text-[15px] font-medium text-white outline-none transition duration-100 hover:bg-white/25 focus-visible:ring-4 focus-visible:ring-white/60 active:scale-[0.97] motion-reduce:active:scale-100"
          >
            {city}
          </button>
        ))}
      </div>
    </section>
  );
}
