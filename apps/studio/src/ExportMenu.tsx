import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { Scene } from "./scene";
import type { ImageBank } from "./useCharacterImages";
import { exportScene, type ExportFormat } from "./exporters";

type Item = { id: ExportFormat; label: string; detail: string };

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Motion",
    items: [
      { id: "gif", label: "GIF", detail: "480px · 15fps · loops" },
      { id: "webm", label: "WebM", detail: "1080px · 30fps · with sound" },
      { id: "mp4", label: "MP4", detail: "1080px · 30fps · with sound" },
      { id: "sprite", label: "Sprite sheet", detail: "PNG · 8 columns · 12fps" },
    ],
  },
  {
    title: "Current frame",
    items: [
      { id: "png", label: "PNG", detail: "1024px" },
      { id: "svg", label: "SVG", detail: "Vector transforms + cue" },
    ],
  },
  {
    title: "Project & code",
    items: [
      { id: "kineti", label: ".kineti project", detail: "Editable scene file" },
      { id: "json", label: "JSON animation", detail: "Sampled at 24fps" },
      { id: "react", label: "React player", detail: "Copies to clipboard" },
    ],
  },
];

type Props = { scene: Scene; images: ImageBank; time: number; onClose: () => void };

export function ExportMenu({ scene, images, time, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<ExportFormat | null>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!busy && ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [busy, onClose]);

  const run = async (id: ExportFormat) => {
    if (busy) return;
    setBusy(id);
    setError(null);
    setDone(null);
    setProgress(0);
    try {
      await exportScene(id, scene, images, time, setProgress);
      setDone(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
      style={{ transformOrigin: "top right" }}
      className="absolute right-0 top-10 z-30 w-[320px] rounded-xl border border-line bg-white shadow-[0_12px_40px_-12px_rgba(28,43,43,0.25)] p-1.5"
    >
      {groups.map((g) => (
        <div key={g.title} className="py-1">
          <p className="px-2.5 pt-1.5 pb-1 text-xs text-faint">{g.title}</p>
          {g.items.map((it) => {
            const active = busy === it.id;
            return (
              <button
                key={it.id}
                onClick={() => run(it.id)}
                disabled={!!busy && !active}
                className="relative w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg text-left overflow-hidden transition-colors duration-150 ease-out hover:bg-shell disabled:opacity-40 cursor-pointer"
              >
                {active && (
                  <span
                    className="absolute inset-y-0 left-0 bg-teal-soft transition-[width] duration-150 ease-out"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                )}
                <span className="relative text-sm font-medium whitespace-nowrap">{it.label}</span>
                <span className="relative flex items-center gap-1.5 text-xs text-muted whitespace-nowrap">
                  {active ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> {Math.round(progress * 100)}%
                    </>
                  ) : done === it.id ? (
                    <>
                      <Check size={12} className="text-teal" /> {it.id === "react" ? "Copied" : "Saved"}
                    </>
                  ) : (
                    it.detail
                  )}
                </span>
              </button>
            );
          })}
        </div>
      ))}
      {error && <p className="mx-1 mb-1 mt-0.5 rounded-lg bg-coral-soft px-2.5 py-2 text-xs text-[#8a3524]">{error}</p>}
      {busy && (busy === "webm" || busy === "mp4") && (
        <p className="px-2.5 pb-2 text-xs text-muted">Recording in real time — keep this tab open.</p>
      )}
    </motion.div>
  );
}
