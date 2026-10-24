import type { ReactNode } from "react";
import { characterById } from "./characters";
import { motions } from "./motion";
import { cues } from "./cues";
import type { Scene } from "./scene";

type Props = { scene: Scene; update: (p: Partial<Scene>) => void };

export function Inspector({ scene, update }: Props) {
  const ch = characterById(scene.characterId);
  const setCue = (p: Partial<Scene["cue"]>) => update({ cue: { ...scene.cue, ...p } });
  const setAudio = (p: Partial<Scene["audio"]>) => update({ audio: { ...scene.audio, ...p } });

  return (
    <aside className="min-h-0 overflow-y-auto border-l border-line bg-panel" aria-label="Properties inspector">
      <div className="px-4 pt-4 pb-4 border-b border-line">
        <h2 className="text-base font-semibold">{ch.name}</h2>
        <p className="text-xs text-muted mt-0.5">
          {ch.role} · {ch.species}
        </p>
        <p className="text-xs text-faint mt-1">{ch.feel}</p>
      </div>

      <Section title="Motion">
        <div className="grid grid-cols-2 gap-1">
          {motions.map((m) => (
            <Chip key={m.id} active={scene.motion === m.id} onClick={() => update({ motion: m.id })}>
              {m.label}
            </Chip>
          ))}
        </div>
        <Slider label="Intensity" value={scene.intensity} min={0} max={2} step={0.05} onChange={(intensity) => update({ intensity })} suffix="×" />
        <Slider label="Speed" value={scene.speed} min={0.25} max={2} step={0.05} onChange={(speed) => update({ speed })} suffix="×" />
        <Slider label="Scale" value={scene.scale} min={0.6} max={1.1} step={0.01} onChange={(scale) => update({ scale })} suffix="×" />
      </Section>

      <Section title="Task cue">
        <div className="grid grid-cols-3 gap-1">
          {cues.map((c) => (
            <Chip key={c.id} active={scene.cue.type === c.id} onClick={() => setCue({ type: c.id })}>
              {c.label}
            </Chip>
          ))}
        </div>
        {scene.cue.type !== "none" && (
          <>
            <Slider label="Starts" value={scene.cue.start} min={0} max={scene.cue.end - 0.5} step={0.1} onChange={(start) => setCue({ start })} suffix="s" />
            <Slider label="Ends" value={scene.cue.end} min={scene.cue.start + 0.5} max={scene.duration} step={0.1} onChange={(end) => setCue({ end })} suffix="s" />
          </>
        )}
      </Section>

      <Section
        title="Sound"
        action={
          <button
            type="button"
            role="switch"
            aria-checked={scene.audio.enabled}
            aria-label="Toggle notification chime sound"
            onClick={() => setAudio({ enabled: !scene.audio.enabled })}
            className={`relative h-5 w-9 rounded-full transition-colors duration-150 ease-out cursor-pointer ${scene.audio.enabled ? "bg-teal" : "bg-line"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform duration-150 ease-out ${
                scene.audio.enabled ? "translate-x-4" : ""
              }`}
            />
          </button>
        }
      >
        <p className="text-sm">Notification chime</p>
        {scene.audio.enabled && (
          <>
            <Slider label="Plays at" value={scene.audio.at} min={0} max={scene.duration - 0.2} step={0.1} onChange={(at) => setAudio({ at })} suffix="s" />
            <Slider label="Volume" value={scene.audio.volume} min={0} max={1} step={0.05} onChange={(volume) => setAudio({ volume })} pct />
          </>
        )}
      </Section>
    </aside>
  );
}

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="px-4 py-4 border-b border-line space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode; key?: string }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 rounded-md text-sm whitespace-nowrap transition-colors duration-150 ease-out cursor-pointer ${
        active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:bg-shell"
      }`}
    >
      {children}
    </button>
  );
}

type SliderProps = {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; suffix?: string; pct?: boolean;
};

function Slider({ label, value, min, max, step, onChange, suffix, pct }: SliderProps) {
  return (
    <label className="block cursor-pointer">
      <span className="flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-mono tabular-nums">{pct ? `${Math.round(value * 100)}%` : `${value.toFixed(step < 0.1 ? 2 : 1)}${suffix ?? ""}`}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full mt-1 cursor-pointer" />
    </label>
  );
}
