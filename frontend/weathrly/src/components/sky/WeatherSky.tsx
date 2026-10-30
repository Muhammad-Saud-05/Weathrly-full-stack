import { useEffect, useRef } from "react";
import { SCENES, type SceneId } from "./scenes";
import { createSkyEngine, type SkyEngine } from "./skyEngine";

interface Props {
  scene: SceneId;
  // false renders a single still frame (reduced motion)
  animate: boolean;
  // positioning of the sky; fixed lets it stay put behind a scrolling page
  className?: string;
}

export default function WeatherSky({ scene, animate, className = "absolute inset-0" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SkyEngine | null>(null);

  // Own the engine and the frame loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createSkyEngine(canvas);
    if (!engine) return;
    engineRef.current = engine;

    const observer = new ResizeObserver(() => {
      engine.resize();
      if (!animate) engine.draw(0);
    });
    observer.observe(canvas);
    engine.resize();

    let frame = 0;
    if (animate) {
      let last = performance.now();
      const loop = (now: number) => {
        // clamp so a backgrounded tab doesn't jump the particles on return
        engine.draw(Math.min((now - last) / 1000, 0.05));
        last = now;
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      engineRef.current = null;
    };
  }, [animate]);

  // Follow the chosen scene
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.setScene(scene, !animate);
    if (!animate) engine.draw(0);
  }, [scene, animate]);

  return (
    <div aria-hidden="true" className={`${className} overflow-hidden`}>
      {SCENES.map((s) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-[1400ms] motion-reduce:duration-200"
          style={{ background: s.sky, opacity: s.id === scene ? 1 : 0 }}
        />
      ))}
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
