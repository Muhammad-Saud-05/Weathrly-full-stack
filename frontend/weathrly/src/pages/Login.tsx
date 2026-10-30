import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import { getErrorMessage } from "../utils/errors";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import WeatherSky from "../components/login/WeatherSky";
import SceneIcon from "../components/login/SceneIcon";
import { SCENES } from "../components/login/scenes";

const SCENE_CYCLE_MS = 9000;

// Material, entrance and accessibility fallbacks that Tailwind utilities can't express.
const styles = `
  .login-glass {
    background: rgba(255, 255, 255, 0.84);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.75);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      0 2px 4px rgba(10, 20, 40, 0.06),
      0 32px 80px -16px rgba(5, 15, 40, 0.5);
  }
  .login-chip {
    background: rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(16px) saturate(160%);
    -webkit-backdrop-filter: blur(16px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.28);
  }
  @media (prefers-reduced-transparency: reduce) {
    .login-glass { background: #ffffff; backdrop-filter: none; -webkit-backdrop-filter: none; }
    .login-chip { background: rgba(10, 20, 40, 0.55); backdrop-filter: none; -webkit-backdrop-filter: none; }
  }
  @media (prefers-contrast: more) {
    .login-glass, .login-chip { border-color: currentColor; }
  }

  .login-rise { animation: login-rise 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
  .login-text-in { animation: login-text-in 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
  @keyframes login-rise {
    from { opacity: 0; transform: translateY(16px) scale(0.985); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes login-text-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes login-fade { from { opacity: 0; } to { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) {
    .login-rise, .login-text-in { animation: login-fade 200ms ease both; }
  }

  @keyframes login-spin { to { transform: rotate(360deg); } }
  .login-spinner { animation: login-spin 800ms linear infinite; }
  @media (prefers-reduced-motion: reduce) {
    .login-spinner { animation-duration: 2s; }
  }
`;

const inputClass =
  "h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-base text-slate-900 " +
  "placeholder:text-slate-500 outline-none transition-[border-color,box-shadow] duration-150 " +
  "focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/25 " +
  "aria-[invalid=true]:border-[#d70015] aria-[invalid=true]:focus:ring-[#d70015]/20";

const labelClass = "block text-[13px] font-medium text-slate-800";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();

  const scene = SCENES[sceneIndex];

  // Let the weather change on its own until the visitor picks one
  useEffect(() => {
    if (!auto || reducedMotion) return;

    const timer = setInterval(() => {
      setSceneIndex((i) => (i + 1) % SCENES.length);
    }, SCENE_CYCLE_MS);

    return () => clearInterval(timer);
  }, [auto, reducedMotion]);

  const pickScene = (index: number) => {
    setSceneIndex(index);
    setAuto(false);
  };

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
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <style>{styles}</style>

      <WeatherSky scene={scene.id} animate={!reducedMotion} />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 lg:px-10">
        {/* Brand and the weather of the moment */}
        <section className="[text-shadow:0_2px_28px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-2.5">
            <svg aria-hidden="true" width="34" height="34" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#fff" fillOpacity="0.95" />
              <circle cx="21" cy="11.5" r="4.5" fill="#ffb938" />
              <path
                d="M10.5 24a4.5 4.5 0 01-.4-8.98A6 6 0 0121.7 16.4a3.8 3.8 0 01-.2 7.6h-11z"
                fill="#2f80e6"
              />
            </svg>
            <span className="text-[19px] font-semibold tracking-[-0.01em]">Weathrly</span>
          </div>

          <div key={scene.id} className="login-text-in mt-10 lg:mt-24">
            <p className="login-chip inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-medium text-white [text-shadow:none]">
              <SceneIcon id={scene.id} size={18} />
              {scene.caption}
            </p>
            <p className="mt-5 text-[clamp(2.5rem,7vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
              {scene.headline}
            </p>
            <p className="mt-5 max-w-md text-[17px] leading-snug text-white/90">
              {scene.blurb}
            </p>
          </div>

          <div role="group" aria-label="Choose the sky" className="mt-8 flex gap-2.5 lg:mt-12">
            {SCENES.map((s, i) => {
              const active = i === sceneIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Show ${s.label.toLowerCase()} sky`}
                  aria-pressed={active}
                  onClick={() => pickScene(i)}
                  className={
                    "flex size-11 items-center justify-center rounded-full outline-none transition duration-150 " +
                    "focus-visible:ring-4 focus-visible:ring-white/60 active:scale-90 motion-reduce:active:scale-100 " +
                    (active
                      ? "bg-white text-slate-900 shadow-lg"
                      : "login-chip text-white hover:bg-white/25")
                  }
                >
                  <SceneIcon id={s.id} />
                </button>
              );
            })}
          </div>
        </section>

        {/* Sign in */}
        <main className="login-rise w-full">
          <div className="login-glass rounded-[28px] px-7 py-9 text-slate-900 sm:px-9 sm:py-10">
            <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.022em]">
              Sign in
            </h1>
            <p className="mt-2 text-[15px] leading-snug text-slate-700">
              Your forecast, favorites and recent searches.
            </p>

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
                    className="rounded text-[13px] text-[#0059b8] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#0071e3]/50"
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
                    className="flex items-start gap-2 rounded-xl bg-[#d70015]/10 px-3.5 py-3 text-[14px] leading-snug text-[#a30018]"
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
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0071e3] text-[16px] font-medium text-white outline-none transition duration-100 ease-out hover:bg-[#0077ed] focus-visible:ring-4 focus-visible:ring-[#0071e3]/35 active:scale-[0.98] active:bg-[#006edb] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100 motion-reduce:active:scale-100"
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

            <p className="mt-7 text-center text-[14px] text-slate-700">
              New to Weathrly?{" "}
              <Link
                to="/register"
                className="rounded font-medium text-[#0059b8] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#0071e3]/50"
              >
                Create an account
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
