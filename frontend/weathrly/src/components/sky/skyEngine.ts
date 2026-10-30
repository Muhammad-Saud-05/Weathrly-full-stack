import type { SceneId } from "./scenes";

type RGB = [number, number, number];

const IDS: SceneId[] = ["sunny", "rain", "wind", "snow"];

// Cloud tint and strength per scene
const CLOUD: Record<SceneId, { color: RGB; alpha: number }> = {
  sunny: { color: [255, 255, 255], alpha: 0.5 },
  rain: { color: [30, 40, 66], alpha: 0.62 },
  wind: { color: [255, 255, 255], alpha: 0.3 },
  snow: { color: [236, 241, 252], alpha: 0.42 },
};

const LEAF_COLORS = ["#ffd27a", "#ffa45c", "#c7e08a", "#ff8f6b"];
const RAIN_SLANT = 0.28; // horizontal px per vertical px

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface Cloud { x: number; y: number; r: number; speed: number }
interface Drop { x: number; y: number; len: number; speed: number; alpha: number; width: number }
interface Flake { x: number; y: number; r: number; vy: number; amp: number; freq: number; phase: number; alpha: number }
interface Ribbon { x: number; y: number; amp: number; freq: number; speed: number; len: number; width: number; alpha: number; phase: number }
interface Leaf { x: number; y: number; size: number; speed: number; amp: number; phase: number; rot: number; spin: number; color: string }

export interface SkyEngine {
  resize: () => void;
  setScene: (id: SceneId, snap?: boolean) => void;
  draw: (dt: number) => void;
}

/**
 * Draws the weather on a canvas. Each scene has a "level" (0..1) that eases towards
 * its target, so changing scene cross-fades instead of cutting. All sizes are CSS px.
 */
export function createSkyEngine(canvas: HTMLCanvasElement): SkyEngine | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const c = ctx;

  let w = 0;
  let h = 0;
  let t = 0;
  let flash = 0;
  let nextFlash = 5;
  let target: SceneId = "sunny";
  const level: Record<SceneId, number> = { sunny: 1, rain: 0, wind: 0, snow: 0 };

  let clouds: Cloud[] = [];
  let drops: Drop[] = [];
  let flakes: Flake[] = [];
  let ribbons: Ribbon[] = [];
  let leaves: Leaf[] = [];

  function seed() {
    const area = w * h;

    clouds = Array.from({ length: 7 }, () => ({
      x: rand(0, w),
      y: rand(h * 0.04, h * 0.5),
      r: rand(70, 150),
      speed: rand(5, 18),
    }));

    drops = Array.from({ length: Math.round(clamp(area / 5500, 80, 320)) }, () => ({
      x: rand(-RAIN_SLANT * h, w),
      y: rand(0, h),
      len: rand(14, 30),
      speed: rand(650, 1100),
      alpha: rand(0.25, 0.6),
      width: rand(1, 1.7),
    }));

    flakes = Array.from({ length: Math.round(clamp(area / 8000, 60, 220)) }, () => {
      const r = rand(1.2, 4.2);
      return {
        x: rand(-50, w),
        y: rand(0, h),
        r,
        vy: 22 + r * 14,
        amp: rand(8, 28),
        freq: rand(0.5, 1.5),
        phase: rand(0, Math.PI * 2),
        alpha: 0.5 + (r / 4.2) * 0.45,
      };
    });

    ribbons = Array.from({ length: 12 }, () => ({
      x: rand(0, w),
      y: rand(h * 0.05, h * 0.95),
      amp: rand(8, 30),
      freq: rand(0.004, 0.012),
      speed: rand(260, 620),
      len: rand(170, 420),
      width: rand(1.2, 3),
      alpha: rand(0.18, 0.5),
      phase: rand(0, Math.PI * 2),
    }));

    leaves = Array.from({ length: 9 }, () => ({
      x: rand(0, w),
      y: rand(h * 0.1, h * 0.9),
      size: rand(4, 8),
      speed: rand(170, 330),
      amp: rand(20, 60),
      phase: rand(0, Math.PI * 2),
      rot: rand(0, Math.PI * 2),
      spin: rand(-4, 4),
      color: LEAF_COLORS[Math.floor(rand(0, LEAF_COLORS.length))],
    }));
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function setScene(id: SceneId, snap = false) {
    target = id;
    if (snap) {
      for (const k of IDS) level[k] = k === id ? 1 : 0;
    }
  }

  function puff(x: number, y: number, r: number, [cr, cg, cb]: RGB, alpha: number) {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
    g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    c.fillStyle = g;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  }

  function drawSun() {
    const a = level.sunny;
    if (a < 0.01) return;

    const wide = w > 900;
    const sx = wide ? w * 0.6 : w * 0.78;
    const sy = h * (wide ? 0.18 : 0.1);
    const reach = Math.min(w, h) * 0.55;

    c.save();
    c.globalAlpha = a;

    const glow = c.createRadialGradient(sx, sy, 0, sx, sy, reach);
    glow.addColorStop(0, "rgba(255,244,200,0.95)");
    glow.addColorStop(0.18, "rgba(255,224,150,0.55)");
    glow.addColorStop(1, "rgba(255,200,120,0)");
    c.fillStyle = glow;
    c.fillRect(0, 0, w, h);

    c.translate(sx, sy);
    c.rotate(t * 0.06);
    c.lineCap = "round";
    c.strokeStyle = "rgba(255,246,214,0.24)";
    for (let i = 0; i < 14; i++) {
      c.rotate((Math.PI * 2) / 14);
      c.lineWidth = i % 2 ? 5 : 9;
      c.beginPath();
      c.moveTo(78, 0);
      c.lineTo(78 + (i % 2 ? 70 : 120), 0);
      c.stroke();
    }

    const pulse = 1 + Math.sin(t * 1.2) * 0.015;
    const disc = c.createRadialGradient(0, 0, 0, 0, 0, 54);
    disc.addColorStop(0, "#fffbe6");
    disc.addColorStop(1, "#ffe08a");
    c.fillStyle = disc;
    c.beginPath();
    c.arc(0, 0, 52 * pulse, 0, Math.PI * 2);
    c.fill();

    c.restore();
  }

  function drawClouds(dt: number) {
    for (const cl of clouds) {
      cl.x += cl.speed * (1 + level.wind * 5) * dt;
      if (cl.x - cl.r * 2 > w) cl.x = -cl.r * 2;
    }

    for (const id of IDS) {
      const a = level[id];
      if (a < 0.01) continue;

      const { color, alpha } = CLOUD[id];
      const scale = id === "rain" ? 1.35 : 1;
      const sink = id === "rain" ? h * 0.06 : 0;

      c.globalAlpha = a;
      for (const cl of clouds) {
        const r = cl.r * scale;
        const y = cl.y + sink;
        puff(cl.x, y, r, color, alpha);
        puff(cl.x + r * 0.7, y + r * 0.15, r * 0.8, color, alpha);
        puff(cl.x - r * 0.7, y + r * 0.2, r * 0.7, color, alpha);
      }
    }
    c.globalAlpha = 1;
  }

  function drawRain(dt: number) {
    const a = level.rain;
    if (a < 0.01) return;

    c.save();
    c.globalAlpha = a;
    c.lineCap = "round";

    for (const d of drops) {
      d.y += d.speed * dt;
      d.x += d.speed * RAIN_SLANT * dt;
      if (d.y - d.len > h) {
        d.y = -d.len;
        d.x = rand(-RAIN_SLANT * h, w);
      }

      c.lineWidth = d.width;
      c.strokeStyle = `rgba(190,212,255,${d.alpha})`;
      c.beginPath();
      c.moveTo(d.x, d.y);
      c.lineTo(d.x - d.len * RAIN_SLANT, d.y - d.len);
      c.stroke();
    }

    const mist = c.createLinearGradient(0, h * 0.7, 0, h);
    mist.addColorStop(0, "rgba(170,195,235,0)");
    mist.addColorStop(1, "rgba(170,195,235,0.22)");
    c.fillStyle = mist;
    c.fillRect(0, h * 0.7, w, h * 0.3);

    c.restore();
  }

  function drawWind(dt: number) {
    const a = level.wind;
    if (a < 0.01) return;

    c.save();
    c.globalAlpha = a;
    c.lineCap = "round";

    for (const r of ribbons) {
      r.x += r.speed * dt;
      if (r.x - r.len > w) {
        r.x = -20;
        r.y = rand(h * 0.05, h * 0.95);
      }

      const fade = c.createLinearGradient(r.x - r.len, 0, r.x, 0);
      fade.addColorStop(0, "rgba(255,255,255,0)");
      fade.addColorStop(1, `rgba(255,255,255,${r.alpha})`);
      c.strokeStyle = fade;
      c.lineWidth = r.width;
      c.beginPath();
      for (let i = 0; i <= 24; i++) {
        const px = r.x - r.len * (i / 24);
        const py = r.y + Math.sin(px * r.freq + r.phase + t * 1.5) * r.amp;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.stroke();
    }

    for (const l of leaves) {
      l.x += l.speed * dt;
      l.rot += l.spin * dt;
      if (l.x > w + 20) {
        l.x = -20;
        l.y = rand(h * 0.1, h * 0.9);
      }

      c.save();
      c.translate(l.x, l.y + Math.sin(l.x * 0.01 + l.phase) * l.amp);
      c.rotate(l.rot);
      c.fillStyle = l.color;
      c.beginPath();
      c.ellipse(0, 0, l.size, l.size * 0.5, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    c.restore();
  }

  function drawSnow(dt: number) {
    const a = level.snow;
    if (a < 0.01) return;

    c.save();
    c.globalAlpha = a;

    for (const f of flakes) {
      f.y += f.vy * dt;
      f.x += 9 * dt;
      if (f.y > h + f.r) {
        f.y = -f.r;
        f.x = rand(-50, w);
      }
      if (f.x > w + 50) f.x = -50;

      c.fillStyle = `rgba(255,255,255,${f.alpha})`;
      c.beginPath();
      c.arc(f.x + Math.sin(t * f.freq + f.phase) * f.amp, f.y, f.r, 0, Math.PI * 2);
      c.fill();
    }

    const haze = c.createLinearGradient(0, h * 0.75, 0, h);
    haze.addColorStop(0, "rgba(255,255,255,0)");
    haze.addColorStop(1, "rgba(255,255,255,0.32)");
    c.fillStyle = haze;
    c.fillRect(0, h * 0.75, w, h * 0.25);

    c.restore();
  }

  // A soft, low-contrast pulse rather than a hard flash
  function drawFlash(dt: number) {
    if (level.rain > 0.6 && dt > 0) {
      nextFlash -= dt;
      if (nextFlash <= 0) {
        flash = 1;
        nextFlash = rand(7, 13);
      }
    }
    flash = Math.max(0, flash - dt * 1.8);

    if (flash > 0.01) {
      c.fillStyle = `rgba(215,225,255,${flash * flash * 0.22 * level.rain})`;
      c.fillRect(0, 0, w, h);
    }
  }

  function draw(dt: number) {
    t += dt;

    const ease = 1 - Math.exp(-dt * 2.2);
    for (const id of IDS) {
      level[id] += ((id === target ? 1 : 0) - level[id]) * ease;
    }

    c.clearRect(0, 0, w, h);
    drawSun();
    drawClouds(dt);
    drawRain(dt);
    drawWind(dt);
    drawSnow(dt);
    drawFlash(dt);
  }

  return { resize, setScene, draw };
}
