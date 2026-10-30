import SceneIcon from "../sky/SceneIcon";
import { formatTemp } from "../../utils/temperature";
import type { Scene } from "../sky/scenes";

interface Props {
  scene: Scene;
}

// A preview of what the dashboard shows. The numbers are illustrative, not live data.
export default function SampleForecastCard({ scene }: Props) {
  const { sample } = scene;

  return (
    <section aria-label="Sample forecast" className="sky-glass rounded-[28px] p-7 text-slate-900 sm:p-8">
      <div key={scene.id} className="sky-text-in">
        <div className="flex items-center justify-between text-[12px] font-medium uppercase tracking-[0.08em] text-slate-600">
          <span>{sample.city}</span>
          <span>Sample forecast</span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <p className="text-[84px] font-light leading-[0.9] tracking-[-0.05em]">{formatTemp(sample.temp)}</p>
          <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-900/90 text-white">
            <SceneIcon id={scene.id} size={30} />
          </div>
        </div>

        <p className="mt-3 text-[17px] font-medium tracking-[-0.01em]">{sample.description}</p>

        <dl className="mt-4 flex gap-8 text-[14px]">
          {sample.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-slate-600">{stat.label}</dt>
              <dd className="font-medium">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-6 grid grid-cols-5 gap-1 border-t border-slate-900/10 pt-5 text-center">
          {sample.week.map((day) => (
            <li key={day.day} className="space-y-1.5">
              <p className="text-[12px] font-medium text-slate-600">{day.day}</p>
              <div className="flex justify-center text-slate-800">
                <SceneIcon id={day.icon} size={20} />
              </div>
              <p className="text-[14px] font-semibold">{formatTemp(day.high)}</p>
              <p className="text-[13px] text-slate-600">{formatTemp(day.low)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
