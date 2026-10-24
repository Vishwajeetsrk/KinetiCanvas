import type { ReactNode } from "react";
import { MessageSquare, Music, Sparkles, Volume2 } from "lucide-react";
import { characterById } from "./characters";
import { motions } from "./motion";
import { cues } from "./cues";
import type { Scene } from "./scene";
import { itemDefinitions, allItemIds } from "./items";
import { speakText } from "./audio";
import { starters } from "./engine/starters";
import type { ItemId } from "./engine/types";

type Props = {
  scene: Scene;
  update: (p: Partial<Scene>) => void;
  onOpenCustomizer?: () => void;
};

export function Inspector({ scene, update, onOpenCustomizer }: Props) {
  const ch = characterById(scene.characterId);
  const starter = starters.find((s) => s.id === scene.characterId);
  const voice = starter?.voice || { wave: "sine", note: 520, rate: 1.0 };

  const setCue = (p: Partial<Scene["cue"]>) => update({ cue: { ...scene.cue, ...p } });
  const setAudio = (p: Partial<Scene["audio"]>) => update({ audio: { ...scene.audio, ...p } });
  const setSpeech = (p: Partial<Scene["speech"]>) => update({ speech: { ...scene.speech, ...p } });
  const setMusic = (p: Partial<Scene["music"]>) => update({ music: { ...scene.music, ...p } });

  const toggleItem = (itemId: ItemId) => {
    const current = scene.items || [];
    const next = current.includes(itemId)
      ? current.filter((id) => id !== itemId)
      : [...current, itemId];
    update({ items: next });
  };

  return (
    <aside className="min-h-0 overflow-y-auto border-l border-line bg-panel divide-y divide-line" aria-label="Properties inspector">
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold">{ch.name}</h2>
            <p className="text-xs text-muted mt-0.5">
              {ch.role} / {ch.species}
            </p>
          </div>
          {onOpenCustomizer && (
            <button
              onClick={onOpenCustomizer}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-line text-ink hover:bg-shell transition-colors cursor-pointer"
            >
              <Sparkles size={12} className="text-teal" /> Customize
            </button>
          )}
        </div>
        <p className="text-xs text-faint mt-1.5 leading-relaxed">{ch.feel}</p>
      </div>

      {/* Equipped Items & Accessories */}
      <Section title="Equipped Items">
        <div className="grid grid-cols-2 gap-1.5">
          {allItemIds.map((itemId) => {
            const def = itemDefinitions[itemId];
            const active = scene.items?.includes(itemId);
            return (
              <button
                key={itemId}
                type="button"
                onClick={() => toggleItem(itemId)}
                className={`px-2 py-1.5 rounded-md text-xs font-medium text-left truncate transition-colors cursor-pointer ${
                  active ? "bg-teal text-white shadow-xs" : "bg-white text-ink border border-line hover:bg-shell"
                }`}
              >
                {def.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Motion */}
      <Section title="Motion Pose">
        <div className="grid grid-cols-2 gap-1">
          {motions.map((m) => (
            <Chip key={m.id} active={scene.motion === m.id} onClick={() => update({ motion: m.id })}>
              {m.label}
            </Chip>
          ))}
        </div>
        <Slider label="Intensity" value={scene.intensity} min={0} max={2} step={0.05} onChange={(intensity) => update({ intensity })} suffix="x" />
        <Slider label="Speed" value={scene.speed} min={0.25} max={2} step={0.05} onChange={(speed) => update({ speed })} suffix="x" />
        <Slider label="Scale" value={scene.scale} min={0.6} max={1.1} step={0.01} onChange={(scale) => update({ scale })} suffix="x" />
      </Section>

      {/* Task Cue */}
      <Section title="Task Cue">
        <div className="grid grid-cols-3 gap-1">
          {cues.map((c) => (
            <Chip key={c.id} active={scene.cue.type === c.id} onClick={() => setCue({ type: c.id })}>
              {c.label}
            </Chip>
          ))}
        </div>
        {scene.cue.type !== "none" && (
          <div className="space-y-2 pt-1">
            <Slider label="Starts" value={scene.cue.start} min={0} max={scene.cue.end - 0.5} step={0.1} onChange={(start) => setCue({ start })} suffix="s" />
            <Slider label="Ends" value={scene.cue.end} min={scene.cue.start + 0.5} max={scene.duration} step={0.1} onChange={(end) => setCue({ end })} suffix="s" />
          </div>
        )}
      </Section>

      {/* Talking & Voice */}
      <Section
        title="Talking & Voice"
        action={
          <button
            type="button"
            role="switch"
            aria-checked={scene.speech?.enabled}
            aria-label="Toggle speech"
            onClick={() => setSpeech({ enabled: !scene.speech?.enabled })}
            className={`relative h-5 w-9 rounded-full transition-colors duration-150 ease-out cursor-pointer ${
              scene.speech?.enabled ? "bg-teal" : "bg-line"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform duration-150 ease-out ${
                scene.speech?.enabled ? "translate-x-4" : ""
              }`}
            />
          </button>
        }
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Companion Speech Bubble</span>
          <button
            type="button"
            onClick={() => speakText(scene.speech?.text || "Hello!", voice)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-teal hover:underline cursor-pointer"
          >
            <Volume2 size={12} /> Test Voice
          </button>
        </div>
        {scene.speech?.enabled && (
          <div className="space-y-2.5">
            <input
              type="text"
              value={scene.speech.text}
              onChange={(e) => setSpeech({ text: e.target.value })}
              placeholder="What does companion say?"
              aria-label="Speech bubble text"
              className="w-full text-xs font-medium px-2.5 py-1.5 rounded-md border border-line bg-white outline-none focus:ring-1 focus:ring-teal"
            />
            <Slider
              label="Speaks at"
              value={scene.speech.at}
              min={0}
              max={scene.duration - 0.5}
              step={0.1}
              onChange={(at) => setSpeech({ at })}
              suffix="s"
            />
          </div>
        )}
      </Section>

      {/* Ambient Lo-Fi Music */}
      <Section
        title="Ambient Music"
        action={
          <button
            type="button"
            role="switch"
            aria-checked={scene.music?.enabled}
            aria-label="Toggle ambient music"
            onClick={() => setMusic({ enabled: !scene.music?.enabled })}
            className={`relative h-5 w-9 rounded-full transition-colors duration-150 ease-out cursor-pointer ${
              scene.music?.enabled ? "bg-teal" : "bg-line"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform duration-150 ease-out ${
                scene.music?.enabled ? "translate-x-4" : ""
              }`}
            />
          </button>
        }
      >
        <div className="flex items-center gap-2 text-xs text-muted">
          <Music size={13} className="text-teal" />
          <span>Procedural Lo-Fi Chords & Rhythm</span>
        </div>
        {scene.music?.enabled && (
          <Slider
            label="Music Volume"
            value={scene.music.volume}
            min={0}
            max={1}
            step={0.05}
            onChange={(volume) => setMusic({ volume })}
            pct
          />
        )}
      </Section>

      {/* Notification Chime Sound */}
      <Section
        title="Notification Chime"
        action={
          <button
            type="button"
            role="switch"
            aria-checked={scene.audio.enabled}
            aria-label="Toggle notification chime sound"
            onClick={() => setAudio({ enabled: !scene.audio.enabled })}
            className={`relative h-5 w-9 rounded-full transition-colors duration-150 ease-out cursor-pointer ${
              scene.audio.enabled ? "bg-teal" : "bg-line"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform duration-150 ease-out ${
                scene.audio.enabled ? "translate-x-4" : ""
              }`}
            />
          </button>
        }
      >
        <p className="text-xs text-muted">Two-tone completion sound</p>
        {scene.audio.enabled && (
          <div className="space-y-2">
            <Slider label="Plays at" value={scene.audio.at} min={0} max={scene.duration - 0.2} step={0.1} onChange={(at) => setAudio({ at })} suffix="s" />
            <Slider label="Chime Volume" value={scene.audio.volume} min={0} max={1} step={0.05} onChange={(volume) => setAudio({ volume })} pct />
          </div>
        )}
      </Section>
    </aside>
  );
}

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="px-4 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
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
        active ? "bg-ink text-white" : "bg-white text-ink border border-line hover:bg-shell"
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
