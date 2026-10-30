import { useState } from "react";
import { api } from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import { getErrorMessage } from "../utils/errors";

// Material, entrance and accessibility fallbacks that Tailwind utilities can't express.
const styles = `
  .login-glass {
    background: rgba(255, 255, 255, 0.68);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.8),
      0 1px 2px rgba(15, 23, 42, 0.04),
      0 24px 60px -12px rgba(30, 64, 120, 0.22);
  }
  @media (prefers-color-scheme: dark) {
    .login-glass {
      background: rgba(28, 32, 42, 0.62);
      border-color: rgba(255, 255, 255, 0.1);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        0 24px 60px -12px rgba(0, 0, 0, 0.6);
    }
  }
  @media (prefers-reduced-transparency: reduce) {
    .login-glass { background: #ffffff; backdrop-filter: none; -webkit-backdrop-filter: none; }
  }
  @media (prefers-reduced-transparency: reduce) and (prefers-color-scheme: dark) {
    .login-glass { background: #1c202a; }
  }
  @media (prefers-contrast: more) {
    .login-glass { border-color: currentColor; }
  }

  .login-rise { animation: login-rise 600ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
  @keyframes login-rise {
    from { opacity: 0; transform: translateY(14px) scale(0.985); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes login-fade { from { opacity: 0; } to { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) {
    .login-rise { animation: login-fade 200ms ease both; }
  }

  @keyframes login-spin { to { transform: rotate(360deg); } }
  .login-spinner { animation: login-spin 800ms linear infinite; }
  @media (prefers-reduced-motion: reduce) {
    .login-spinner { animation-duration: 2s; }
  }
`;

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-white/70 px-4 text-base text-slate-900 " +
  "placeholder:text-slate-500 outline-none transition-[border-color,box-shadow] duration-150 " +
  "focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/25 " +
  "aria-[invalid=true]:border-[#d70015] aria-[invalid=true]:focus:ring-[#d70015]/20 " +
  "dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400 " +
  "dark:focus:border-[#4da3ff] dark:focus:ring-[#4da3ff]/30";

const labelClass = "block text-[13px] font-medium text-slate-800 dark:text-slate-200";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = res.data?.access_token;

      if (!token) {
        throw new Error("No access token returned from backend");
      }

      setToken(token);

      // redirect to dashboard
      navigate("/", { replace: true });

    } catch (err) {
      console.error("Login failed:", err);

      setError(getErrorMessage(err, "Login failed"));
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-b from-[#d6e6fb] via-[#eaf2fc] to-[#f7fafc] px-4 py-10 text-slate-900 dark:from-[#09111f] dark:via-[#0b1830] dark:to-[#050a14] dark:text-white">
      <style>{styles}</style>

      {/* Sky: a warm sun glow and a soft cloud, both static and decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 size-[26rem] rounded-full bg-[#ffd48a]/70 blur-3xl dark:bg-[#2f6bd8]/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-[30rem] rounded-full bg-white/80 blur-3xl dark:bg-[#1c3a6e]/30"
      />

      <main className="login-rise relative w-full max-w-[26rem]">
        <div className="login-glass rounded-[28px] px-7 py-9 sm:px-9 sm:py-10">
          <div className="flex items-center gap-2.5">
            <svg
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <rect width="32" height="32" rx="9" fill="#0071e3" />
              <circle cx="21" cy="11.5" r="4.5" fill="#ffd48a" />
              <path
                d="M10.5 24a4.5 4.5 0 01-.4-8.98A6 6 0 0121.7 16.4a3.8 3.8 0 01-.2 7.6h-11z"
                fill="#fff"
              />
            </svg>
            <span className="text-[17px] font-semibold tracking-[-0.01em]">
              Weathrly
            </span>
          </div>

          <div className="mt-8">
            <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.022em]">
              Sign in
            </h1>
            <p className="mt-2 text-[15px] leading-snug text-slate-600 dark:text-slate-300">
              Your forecast, favorites and recent searches.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "login-error" : undefined}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <a
                  href="#"
                  className="rounded text-[13px] text-[#0066cc] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#0071e3]/50 dark:text-[#64a8ff]"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "login-error" : undefined}
                className={inputClass}
              />
            </div>

            <div aria-live="polite">
              {error && (
                <p
                  id="login-error"
                  role="alert"
                  className="flex items-start gap-2 rounded-xl bg-[#d70015]/8 px-3.5 py-3 text-[14px] leading-snug text-[#b3001b] dark:bg-[#ff453a]/15 dark:text-[#ff8a82]"
                >
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mt-px shrink-0"
                  >
                    <path d="M10 1.8a8.2 8.2 0 100 16.4 8.2 8.2 0 000-16.4zM9.1 6a.9.9 0 011.8 0v4.6a.9.9 0 01-1.8 0V6zm.9 8.9a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" />
                  </svg>
                  <span>{error}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0071e3] text-[16px] font-medium text-white outline-none transition duration-100 ease-out hover:bg-[#0077ed] focus-visible:ring-4 focus-visible:ring-[#0071e3]/35 active:scale-[0.98] active:bg-[#006edb] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100 motion-reduce:active:scale-100 dark:bg-[#0a84ff] dark:hover:bg-[#2b95ff]"
            >
              {submitting && (
                <svg
                  aria-hidden="true"
                  className="login-spinner"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                  <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-center text-[14px] text-slate-600 dark:text-slate-300">
            New to Weathrly?{" "}
            <Link
              to="/register"
              className="rounded font-medium text-[#0066cc] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#0071e3]/50 dark:text-[#64a8ff]"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
