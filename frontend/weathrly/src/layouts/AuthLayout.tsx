import { Link } from "react-router-dom";
import { useWeatherScene } from "../hooks/useWeatherScene";
import WeatherSky from "../components/sky/WeatherSky";
import SceneIcon from "../components/sky/SceneIcon";
import SceneSwitcher from "../components/sky/SceneSwitcher";

interface Props {
  // the form card's content
  children: React.ReactNode;
}

// Frame for the sign-in and sign-up pages: the living sky, the brand and weather of the
// moment on the left, and the form card on the right.
export default function AuthLayout({ children }: Props) {
  const { scene, index, pick, reducedMotion } = useWeatherScene();

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <WeatherSky scene={scene.id} animate={!reducedMotion} />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 lg:px-10">
        <section className="[text-shadow:0_2px_28px_rgba(0,0,0,0.28)]">
          <Link
            to="/"
            aria-label="Weathrly home"
            className="flex w-fit items-center gap-2.5 rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-white/60"
          >
            <svg aria-hidden="true" width="34" height="34" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#fff" fillOpacity="0.95" />
              <circle cx="21" cy="11.5" r="4.5" fill="#ffb938" />
              <path
                d="M10.5 24a4.5 4.5 0 01-.4-8.98A6 6 0 0121.7 16.4a3.8 3.8 0 01-.2 7.6h-11z"
                fill="#2f80e6"
              />
            </svg>
            <span className="text-[19px] font-semibold tracking-[-0.01em]">Weathrly</span>
          </Link>

          <div key={scene.id} className="sky-text-in mt-10 lg:mt-24">
            <p className="sky-chip inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-medium text-white [text-shadow:none]">
              <SceneIcon id={scene.id} size={18} />
              {scene.caption}
            </p>
            <p className="mt-5 text-[clamp(2.5rem,7vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
              {scene.headline}
            </p>
            <p className="mt-5 max-w-md text-[17px] leading-snug text-white/90">{scene.blurb}</p>
          </div>

          <div className="mt-8 lg:mt-12">
            <SceneSwitcher index={index} onPick={pick} />
          </div>
        </section>

        <main className="sky-rise w-full">
          <div className="sky-glass rounded-[28px] px-7 py-9 text-slate-900 sm:px-9 sm:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
