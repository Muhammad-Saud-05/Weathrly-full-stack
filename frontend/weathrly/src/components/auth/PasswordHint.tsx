import { PASSWORD_MIN } from "../../utils/validation";

interface Props {
  id: string;
  password: string;
}

// "At least 8 characters", with a green check once the password is long enough
export default function PasswordHint({ id, password }: Props) {
  const longEnough = password.length >= PASSWORD_MIN;

  return (
    <p id={id} className="flex items-center gap-1.5 text-[13px] text-slate-600">
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={longEnough ? "text-[#1d7a3e]" : "text-slate-400"}
      >
        {longEnough ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <circle cx="12" cy="12" r="8" />}
      </svg>
      <span className={longEnough ? "text-[#1d7a3e]" : undefined}>At least {PASSWORD_MIN} characters</span>
    </p>
  );
}
