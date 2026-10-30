import { useEffect, useState } from "react";
import { SCENES } from "../components/sky/scenes";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const SCENE_CYCLE_MS = 9000;

// The weather of the moment: changes on its own until the visitor picks one.
export function useWeatherScene() {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || reducedMotion) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SCENES.length);
    }, SCENE_CYCLE_MS);

    return () => clearInterval(timer);
  }, [auto, reducedMotion]);

  const pick = (next: number) => {
    setIndex(next);
    setAuto(false);
  };

  return { scene: SCENES[index], index, pick, reducedMotion };
}
