import { useEffect, useRef } from "react";
import { Pause, Play } from "lucide-react";
import { characterById } from "./characters";
import { motions } from "./motion";
import { drawFrame } from "./render";
import { fmt, type Scene } from "./scene";
import type { ImageBank } from "./useCharacterImages";

type Props = { scene: Scene; time: number; images: ImageBank; playing: boolean; onTogglePlay: () => void };

export function Stage({ scene, time, images, playing, onTogglePlay }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const ch = characterById(scene.characterId);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const px = c.width;
    drawFrame(c.getContext("2d")!, px, scene, time, images);
  }, [scene, time, images]);

  return (
    <section className="min-h-0 min-w-0 flex flex-col bg-shell" aria-label="Animation stage">
      <div className="flex-1 min-h-0 flex items-center justify-center p-6">
        <div className="relative h-full aspect-square max-w-full">
          <canvas
            ref={ref}
            width={1024}
            height={1024}
            className="w-full h-full rounded-2xl bg-white shadow-[0_1px_0_rgba(28,43,43,0.04),0_8px_30px_-16px_rgba(28,43,43,0.25)]"
          />
          {!images.chars[scene.characterId] && (
            <div className="absolute inset-0 grid place-items-center text-sm text-muted">
              Loading {ch.name}...
            </div>
          )}
          <div className="absolute left-4 top-4 rounded-md bg-white/95 px-2.5 py-1 text-xs text-muted backdrop-blur-sm shadow-xs border border-line">
            <span className="font-semibold text-ink">{ch.name}</span> / {motions.find((m) => m.id === scene.motion)?.label}
          </div>
        </div>
      </div>
      <div className="h-11 shrink-0 flex items-center justify-center gap-3 border-t border-line bg-panel">
        <button
          onClick={onTogglePlay}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="size-8 grid place-items-center rounded-full bg-ink text-white transition-transform duration-150 ease-out hover:bg-[#2c4241] active:scale-[0.94] cursor-pointer"
        >
          {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </button>
        <span className="font-mono text-xs tabular-nums text-muted w-36">
          {fmt(time)} <span className="text-faint">/ {fmt(scene.duration)}</span>
        </span>
      </div>
    </section>
  );
}
