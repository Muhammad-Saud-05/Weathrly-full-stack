// The Weathrly mark and wordmark. Sized for page headers: a touch smaller on phones.
export default function Logo() {
  return (
    <span className="flex items-center gap-3">
      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="size-11 shrink-0 sm:size-14">
        <rect width="32" height="32" rx="9" fill="#fff" fillOpacity="0.95" />
        <circle cx="21" cy="11.5" r="4.5" fill="#ffb938" />
        <path
          d="M10.5 24a4.5 4.5 0 01-.4-8.98A6 6 0 0121.7 16.4a3.8 3.8 0 01-.2 7.6h-11z"
          fill="#2f80e6"
        />
      </svg>
      <span className="text-[26px] font-semibold tracking-[-0.025em] sm:text-[34px]">Weathrly</span>
    </span>
  );
}
