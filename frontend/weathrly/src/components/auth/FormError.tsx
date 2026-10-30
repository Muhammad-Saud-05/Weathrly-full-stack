interface Props {
  id: string;
  message: string;
}

// Announced to screen readers when it appears
export default function FormError({ id, message }: Props) {
  return (
    <div aria-live="polite">
      {message && (
        <p
          id={id}
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-[#d70015]/10 px-3.5 py-3 text-[14px] leading-snug text-[#a30018]"
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="currentColor" className="mt-px shrink-0">
            <path d="M10 1.8a8.2 8.2 0 100 16.4 8.2 8.2 0 000-16.4zM9.1 6a.9.9 0 011.8 0v4.6a.9.9 0 01-1.8 0V6zm.9 8.9a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" />
          </svg>
          <span>{message}</span>
        </p>
      )}
    </div>
  );
}
