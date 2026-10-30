import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { useWeatherScene } from "../hooks/useWeatherScene";
import WeatherSky from "../components/sky/WeatherSky";
import SceneIcon from "../components/sky/SceneIcon";
import SceneSwitcher from "../components/sky/SceneSwitcher";
import SampleForecastCard from "../components/landing/SampleForecastCard";
import type { SceneId } from "../components/sky/scenes";

const FEATURES: { icon: SceneId; title: string; text: string }[] = [
  {
    icon: "sunny",
    title: "Right now",
    text: "Temperature, feels-like and humidity for any city you can type.",
  },
  {
    icon: "wind",
    title: "Five days out",
    text: "A clean daily high and low, so you know what the week looks like.",
  },
  {
    icon: "snow",
    title: "Your places",
    text: "Save favorite cities and jump back to anything you've searched.",
  },
];

const primaryButton =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0071e3] px-7 text-[16px] font-medium text-white " +
  "shadow-lg shadow-black/20 outline-none transition duration-100 ease-out hover:bg-[#0077ed] " +
  "focus-visible:ring-4 focus-visible:ring-white/60 active:scale-[0.97] motion-reduce:active:scale-100";

const secondaryButton =
  "sky-chip inline-flex h-12 items-center justify-center rounded-full px-6 text-[16px] font-medium text-white " +
  "outline-none transition duration-100 hover:bg-white/25 focus-visible:ring-4 focus-visible:ring-white/60 " +
  "active:scale-[0.97] motion-reduce:active:scale-100";

function Arrow() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Landing() {
  const { scene, index, pick, reducedMotion } = useWeatherScene();

  const signedIn = isAuthenticated();
  const destination = signedIn ? "/dashboard" : "/login";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white">
      <WeatherSky scene={scene.id} animate={!reducedMotion} className="fixed inset-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between py-6 [text-shadow:0_2px_28px_rgba(0,0,0,0.28)]">
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

          <Link
            to={destination}
            className="sky-chip rounded-full px-5 py-2.5 text-[15px] font-medium text-white outline-none transition hover:bg-white/25 focus-visible:ring-4 focus-visible:ring-white/60"
          >
            {signedIn ? "Dashboard" : "Sign in"}
          </Link>
        </header>

        <main>
          {/* Hero */}
          <section className="grid items-center gap-12 pb-20 pt-10 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16 lg:pb-12 lg:pt-0">
            <div className="[text-shadow:0_2px_28px_rgba(0,0,0,0.28)]">
              <p
                key={scene.id}
                className="sky-chip sky-text-in inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-medium [text-shadow:none]"
              >
                <SceneIcon id={scene.id} size={18} />
                {scene.caption}
              </p>

              <h1 className="mt-6 max-w-3xl text-[clamp(2.75rem,8vw,6.25rem)] font-semibold leading-[0.96] tracking-[-0.04em]">
                Know the sky before you step outside.
              </h1>

              <p key={`${scene.id}-blurb`} className="sky-text-in mt-6 max-w-lg text-[19px] leading-snug text-white/90">
                {scene.blurb}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3 [text-shadow:none]">
                <Link to={destination} className={primaryButton}>
                  {signedIn ? "Open dashboard" : "Get started"}
                  <Arrow />
                </Link>
                <a href="#features" className={secondaryButton}>
                  See what's inside
                </a>
              </div>

              <div className="mt-10">
                <SceneSwitcher index={index} onPick={pick} />
              </div>
            </div>

            <SampleForecastCard scene={scene} />
          </section>

          {/* Features */}
          <section id="features" className="scroll-mt-6 py-16 motion-safe:scroll-smooth">
            <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] [text-shadow:0_2px_28px_rgba(0,0,0,0.28)]">
              Everything you need to read the sky.
            </h2>

            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="sky-glass rounded-[24px] p-7 text-slate-900">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-900/90 text-white">
                    <SceneIcon id={feature.icon} size={24} />
                  </div>
                  <h3 className="mt-6 text-[21px] font-semibold tracking-[-0.02em]">{feature.title}</h3>
                  <p className="mt-2 text-[16px] leading-snug text-slate-700">{feature.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Closing call to action */}
          <section className="py-16">
            <div className="sky-glass flex flex-col items-start justify-between gap-6 rounded-[28px] p-8 text-slate-900 sm:p-10 md:flex-row md:items-center">
              <div>
                <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                  Ready when you are.
                </h2>
                <p className="mt-2 text-[17px] text-slate-700">
                  {signedIn ? "Your dashboard is waiting." : "Sign in and check the sky."}
                </p>
              </div>
              <Link to={destination} className={primaryButton + " shrink-0"}>
                {signedIn ? "Open dashboard" : "Get started"}
                <Arrow />
              </Link>
            </div>
          </section>
        </main>

        <footer className="pb-10 pt-4 text-center">
          <p className="inline-block rounded-full bg-slate-900/50 px-4 py-1.5 text-[13px] text-white backdrop-blur-md">
            Weathrly &middot; Weather data from OpenWeatherMap
          </p>
        </footer>
      </div>
    </div>
  );
}
