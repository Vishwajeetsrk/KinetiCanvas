import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, Code, HardDrive, Music, Sparkles, Upload } from "lucide-react";
import type { Scene } from "./scene";
import type { ImageBank } from "./useCharacterImages";
import { ExportMenu } from "./ExportMenu";

type Props = {
  scene: Scene;
  onRename: (name: string) => void;
  images: ImageBank;
  time: number;
  onOpenVision: () => void;
  onOpenCreator: () => void;
  onToggleMusic: () => void;
};

export function TopBar({
  scene,
  onRename,
  images,
  time,
  onOpenVision,
  onOpenCreator,
  onToggleMusic,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-12 shrink-0 flex items-center gap-3 px-4 border-b border-line bg-panel">
      <div className="flex items-center gap-2 w-[180px]">
        <Mark />
        <span className="font-semibold tracking-tight text-ink text-sm">KinetiCanvas</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs min-w-0">
        <span className="text-faint">Project</span>
        <span className="text-faint">/</span>
        <input
          value={scene.name}
          onChange={(e) => onRename(e.target.value)}
          aria-label="Project name"
          className="bg-transparent font-medium rounded-md px-1.5 py-1 -mx-1.5 w-56 outline-none hover:bg-shell focus:bg-white focus:ring-1 focus:ring-line text-ink"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Ambient Music Toggle */}
        <button
          onClick={onToggleMusic}
          aria-pressed={scene.music?.enabled}
          aria-label="Toggle ambient music"
          className={`h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            scene.music?.enabled
              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
              : "bg-white text-muted border-line hover:bg-shell hover:text-ink"
          }`}
        >
          <Music size={13} className={scene.music?.enabled ? "animate-pulse" : ""} />
          <span className="hidden sm:inline">Lo-Fi Beat</span>
        </button>

        {/* Vision to Code Button */}
        <button
          onClick={onOpenVision}
          className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg bg-white border border-line text-ink text-xs font-medium hover:bg-shell transition-colors cursor-pointer shadow-2xs"
        >
          <Code size={13} className="text-teal" />
          <span>Vision to Code</span>
        </button>

        {/* New Companion Creator Button */}
        <button
          onClick={onOpenCreator}
          className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg bg-white border border-line text-ink text-xs font-medium hover:bg-shell transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles size={13} className="text-coral" />
          <span>New Companion</span>
        </button>

        <span className="flex items-center gap-1 text-[11px] text-muted whitespace-nowrap ml-1">
          <HardDrive size={12} /> Local
        </span>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Export scene"
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-ink text-white text-xs font-semibold whitespace-nowrap transition-[background-color,transform] duration-150 ease-out hover:bg-[#2c4241] active:scale-[0.97] cursor-pointer shadow-xs"
          >
            <Upload size={13} /> Export <ChevronDown size={13} className="opacity-70" />
          </button>
          <AnimatePresence>
            {open && <ExportMenu scene={scene} images={images} time={time} onClose={() => setOpen(false)} />}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <rect width="22" height="22" rx="6" fill="#1c2b2b" />
      <circle cx="9" cy="11" r="4.5" fill="#2a8f88" />
      <path d="M13 6.5l4 4.5-4 4.5" stroke="#e5735d" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
