import SceneIcon from "./SceneIcon";
import { SCENES } from "./scenes";

interface Props {
  index: number;
  onPick: (index: number) => void;
}

export default function SceneSwitcher({ index, onPick }: Props) {
  return (
    <div role="group" aria-label="Choose the sky" className="flex gap-2.5">
      {SCENES.map((s, i) => {
        const active = i === index;
        return (
          <button
            key={s.id}
            type="button"
            aria-label={`Show ${s.label.toLowerCase()} sky`}
            aria-pressed={active}
            onClick={() => onPick(i)}
            className={
              "flex size-11 items-center justify-center rounded-full outline-none transition duration-150 " +
              "focus-visible:ring-4 focus-visible:ring-white/60 active:scale-90 motion-reduce:active:scale-100 " +
              (active
                ? "bg-white text-slate-900 shadow-lg"
                : "sky-chip text-white hover:bg-white/25")
            }
          >
            <SceneIcon id={s.id} />
          </button>
        );
      })}
    </div>
  );
}
