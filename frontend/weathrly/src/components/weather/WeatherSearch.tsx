import { useState } from "react";

interface Props {
  // resolves true when the search succeeded, so the box only clears on success
  onSearch: (city: string) => Promise<boolean>;
  busy: boolean;
}

export default function WeatherSearch({ onSearch, busy }: Props) {
  const [city, setCity] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const query = city.trim();
    if (!query || busy) return;

    if (await onSearch(query)) setCity("");
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="sky-glass flex items-center gap-2 rounded-full p-1.5 pl-5 transition-shadow focus-within:ring-4 focus-within:ring-white/50"
    >
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="shrink-0 text-slate-500"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        aria-label="Search for a city"
        placeholder="Search for a city"
        autoComplete="off"
        spellCheck={false}
        maxLength={100}
        className="h-11 min-w-0 flex-1 bg-transparent text-[17px] text-slate-900 outline-none placeholder:text-slate-500"
      />

      <button
        type="submit"
        disabled={busy}
        className="flex h-11 items-center justify-center rounded-full bg-[#0071e3] px-6 text-[16px] font-medium text-white outline-none transition duration-100 hover:bg-[#0077ed] focus-visible:ring-4 focus-visible:ring-[#0071e3]/35 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 disabled:active:scale-100 motion-reduce:active:scale-100"
      >
        {busy ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
