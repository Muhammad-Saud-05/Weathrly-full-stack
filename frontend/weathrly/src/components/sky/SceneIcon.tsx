import type { SceneId } from "./scenes";

interface Props {
  id: SceneId;
  size?: number;
}

export default function SceneIcon({ id, size = 22 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (id) {
    case "sunny":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path d="M7 15.5a4.5 4.5 0 01-.4-8.98A6 6 0 0118 8.5a3.5 3.5 0 01-.5 7H7z" />
          <path d="M9 18.5l-1 2.2M13 18.5l-1 2.2M17 18.5l-1 2.2" />
        </svg>
      );
    case "wind":
      return (
        <svg {...common}>
          <path d="M3 8.5h10.5a2.5 2.5 0 10-2.4-3.2" />
          <path d="M3 12.5h15a2.8 2.8 0 11-2.6 3.8" />
          <path d="M3 16.5h6.5a2.2 2.2 0 11-2.1 2.9" />
        </svg>
      );
    case "cloudy":
      return (
        <svg {...common}>
          <path d="M7 18a4.5 4.5 0 01-.4-8.98A6 6 0 0118 11a3.5 3.5 0 01-.5 7H7z" />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
          <path d="M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5" />
        </svg>
      );
  }
}
