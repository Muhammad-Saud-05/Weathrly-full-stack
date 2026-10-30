import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { removeToken } from "../utils/auth";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import Logo from "../components/Logo";
import WeatherSky from "../components/sky/WeatherSky";
import type { SceneId } from "../components/sky/scenes";
import type { User } from "../types";

// What a signed-in page can ask of the shell
export interface ShellContext {
  setScene: (scene: SceneId) => void;
}

// Shared frame for every signed-in page: the living sky, the brand and the account controls.
export default function AppShell() {
  const [scene, setScene] = useState<SceneId>("sunny");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let cancelled = false;

    api
      .get<User>("/me")
      .then((res) => {
        if (!cancelled) setUser(res.data);
      })
      .catch((err) => console.error("Failed to fetch user:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate("/login", { replace: true });
  };

  const context: ShellContext = { setScene };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white">
      <WeatherSky scene={scene} animate={!reducedMotion} className="fixed inset-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4 py-5 [text-shadow:0_2px_28px_rgba(0,0,0,0.28)]">
          <Link
            to="/"
            aria-label="Weathrly home"
            className="block rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-white/60"
          >
            <Logo />
          </Link>

          <div className="flex items-center gap-2.5 [text-shadow:none]">
            {user && (
              <div className="sky-chip-dark flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4" title={user.email}>
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center rounded-full bg-white text-[14px] font-semibold uppercase text-slate-900"
                >
                  {user.username.charAt(0)}
                </span>
                <span className="hidden text-[14px] font-medium sm:inline">{user.username}</span>
                <span className="sr-only">{user.email}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="sky-chip-dark rounded-full px-4 py-2.5 text-[14px] font-medium text-white outline-none transition duration-100 focus-visible:ring-4 focus-visible:ring-white/60 active:scale-[0.97] motion-reduce:active:scale-100"
            >
              Sign out
            </button>
          </div>
        </header>

        <Outlet context={context} />
      </div>
    </div>
  );
}
