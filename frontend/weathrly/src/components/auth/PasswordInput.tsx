import { useState } from "react";
import { inputClass } from "./authStyles";

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  autoComplete: "current-password" | "new-password";
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
}

// A password field with an eye button that reveals or hides what's typed
export default function PasswordInput({
  id,
  value,
  onChange,
  onBlur,
  autoComplete,
  placeholder = "Password",
  invalid,
  describedBy,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        autoCapitalize="none"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required
        placeholder={placeholder}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputClass} pr-12`}
      />

      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        // keep focus (and the caret) in the field when clicking with a mouse
        onMouseDown={(e) => e.preventDefault()}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        aria-controls={id}
        className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 outline-none transition-colors hover:bg-slate-900/[0.06] hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-[#0071e3]/35"
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="M4 4l16 16" />}
        </svg>
      </button>
    </div>
  );
}
