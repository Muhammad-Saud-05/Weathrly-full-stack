interface Props {
  submitting: boolean;
  label: string;
  busyLabel: string;
}

export default function SubmitButton({ submitting, label, busyLabel }: Props) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0071e3] text-[16px] font-medium text-white outline-none transition duration-100 ease-out hover:bg-[#0077ed] focus-visible:ring-4 focus-visible:ring-[#0071e3]/35 active:scale-[0.98] active:bg-[#006edb] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100 motion-reduce:active:scale-100"
    >
      {submitting && (
        <svg aria-hidden="true" className="sky-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
          <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {submitting ? busyLabel : label}
    </button>
  );
}
