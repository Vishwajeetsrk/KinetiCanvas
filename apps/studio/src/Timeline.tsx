import { useRef, type ReactNode, type PointerEvent } from "react";
import { MessageSquare, Music, Volume2 } from "lucide-react";
import { characterById } from "./characters";
import { motions } from "./motion";
import { cues } from "./cues";
import type { Scene } from "./scene";

type Props = { scene: Scene; time: number; update: (p: Partial<Scene>) => void; onSeek: (t: number) => void };

const LABEL_W = 148;

export function Timeline({ scene, time, update, onSeek }: Props) {
  const lane = useRef<HTMLDivElement>(null);
  const D = scene.duration;
  const pct = (t: number) => `${(t / D) * 100}%`;

  const timeAt = (clientX: number) => {
    const r = lane.current!.getBoundingClientRect();
    return Math.min(D, Math.max(0, ((clientX - r.left) / r.width) * D));
  };

  const scrub = (e: PointerEvent) => {
    onSeek(timeAt(e.clientX));
    const move = (ev: globalThis.PointerEvent) => onSeek(timeAt(ev.clientX));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  /** Drag a whole cue block (or audio marker) along the lane, snapped to 0.1s. */
  const drag = (e: PointerEvent, apply: (dt: number) => void) => {
    e.stopPropagation();
    const start = timeAt(e.clientX);
    const move = (ev: globalThis.PointerEvent) => apply(Math.round((timeAt(ev.clientX) - start) * 10) / 10);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const cueLabel = cues.find((c) => c.id === scene.cue.type)?.label;
  const motionLabel = motions.find((m) => m.id === scene.motion)?.label;

  return (
    <footer className="h-[174px] shrink-0 border-t border-line bg-panel flex flex-col select-none" aria-label="Timeline editor">
      <div className="flex h-7 border-b border-line">
        <div style={{ width: LABEL_W }} className="shrink-0 px-4 flex items-center text-xs font-semibold">Timeline</div>
        <div ref={lane} onPointerDown={scrub} className="relative flex-1 mr-4 cursor-col-resize">
          {Array.from({ length: D * 2 + 1 }, (_, i) => (
            <div key={i} className="absolute top-0 bottom-0 flex flex-col" style={{ left: pct(i / 2) }}>
              <span className={`w-px ${i % 2 ? "h-1.5 bg-line" : "h-2.5 bg-faint"}`} />
              {i % 2 === 0 && <span className="text-[10px] font-mono text-faint -translate-x-1/2 mt-0.5">00:0{i / 2}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col">
        <Track label="Character" sub={characterById(scene.characterId).name}>
          <Block start={0} end={D} D={D} className="bg-teal text-white">
            {motionLabel} [0-{D}s]
          </Block>
        </Track>

        <Track label="Task Cue" sub={scene.cue.type === "none" ? "None" : cueLabel}>
          {scene.cue.type !== "none" && (
            <Block
              start={scene.cue.start}
              end={scene.cue.end}
              D={D}
              className="bg-coral-soft text-[#8a3524] ring-1 ring-coral/40 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => {
                const { start: s0, end: e0 } = scene.cue;
                drag(e, (dt) => {
                  const d = Math.max(-s0, Math.min(D - e0, dt));
                  update({ cue: { ...scene.cue, start: +(s0 + d).toFixed(1), end: +(e0 + d).toFixed(1) } });
                });
              }}
            >
              {cueLabel} [{scene.cue.start.toFixed(1)}-{scene.cue.end.toFixed(1)}s]
            </Block>
          )}
        </Track>

        <Track
          label="Audio & Voice"
          sub={scene.music?.enabled ? "Ambient Music Active" : scene.audio.enabled ? "Chime" : "Muted"}
        >
          {scene.audio.enabled && (
            <button
              aria-label="Move chime"
              onPointerDown={(e) => {
                const a0 = scene.audio.at;
                drag(e, (dt) => update({ audio: { ...scene.audio, at: +Math.max(0, Math.min(D - 0.2, a0 + dt)).toFixed(1) } }));
              }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 px-2 rounded-md bg-gold/15 text-[11px] text-[#7a5a18] ring-1 ring-gold/40 whitespace-nowrap cursor-grab active:cursor-grabbing inline-flex items-center gap-1 shadow-xs"
              style={{ left: pct(scene.audio.at) }}
            >
              <Volume2 size={12} /> {scene.audio.at.toFixed(1)}s
            </button>
          )}
          {scene.speech?.enabled && (
            <button
              aria-label="Move companion speech"
              onPointerDown={(e) => {
                const s0 = scene.speech.at;
                drag(e, (dt) => update({ speech: { ...scene.speech, at: +Math.max(0, Math.min(D - 0.5, s0 + dt)).toFixed(1) } }));
              }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 px-2 rounded-md bg-teal-soft text-[11px] text-[#1f7f79] ring-1 ring-teal/40 whitespace-nowrap cursor-grab active:cursor-grabbing inline-flex items-center gap-1 shadow-xs"
              style={{ left: pct(scene.speech.at) }}
            >
              <MessageSquare size={12} /> Talk {scene.speech.at.toFixed(1)}s
            </button>
          )}
          {scene.music?.enabled && (
            <div
              className="absolute top-1/2 -translate-y-1/2 right-2 h-5 px-1.5 rounded bg-emerald-50 text-[10px] text-emerald-700 ring-1 ring-emerald-200 inline-flex items-center gap-1"
            >
              <Music size={11} /> Lo-Fi
            </div>
          )}
        </Track>

        {/* Playhead spans all tracks */}
        <div className="pointer-events-none absolute top-0 bottom-0 right-4" style={{ left: LABEL_W }}>
          <div className="absolute top-0 bottom-0 w-px bg-coral" style={{ left: pct(time) }}>
            <span className="absolute -top-1 -left-[4px] size-[9px] rotate-45 bg-coral" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function Track({ label, sub, children }: { label: string; sub?: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 border-b border-line/60 last:border-0 min-h-[36px]">
      <div style={{ width: LABEL_W }} className="shrink-0 px-4 flex flex-col justify-center">
        <span className="text-xs font-medium leading-tight">{label}</span>
        <span className="text-[11px] text-faint leading-tight truncate">{sub}</span>
      </div>
      <div className="relative flex-1 mr-4">{children}</div>
    </div>
  );
}

function Block({ start, end, D, className, children, onPointerDown }: {
  start: number; end: number; D: number; className: string; children: ReactNode; onPointerDown?: (e: PointerEvent) => void;
}) {
  return (
    <div
      onPointerDown={onPointerDown}
      className={`absolute top-1.5 bottom-1.5 rounded-md px-2 flex items-center text-[11px] font-medium whitespace-nowrap overflow-hidden ${className}`}
      style={{ left: `${(start / D) * 100}%`, width: `${((end - start) / D) * 100}%` }}
    >
      {children}
    </div>
  );
}
