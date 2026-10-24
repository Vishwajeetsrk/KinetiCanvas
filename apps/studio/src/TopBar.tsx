import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, HardDrive, Upload } from "lucide-react";
import type { Scene } from "./scene";
import type { ImageBank } from "./useCharacterImages";
import { ExportMenu } from "./ExportMenu";

type Props = { scene: Scene; onRename: (name: string) => void; images: ImageBank; time: number };

export function TopBar({ scene, onRename, images, time }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <header className="h-12 shrink-0 flex items-center gap-4 px-4 border-b border-line bg-panel">
      <div className="flex items-center gap-2 w-[200px]">
        <Mark />
        <span className="font-semibold tracking-tight">KinetiCanvas</span>
      </div>

      <div className="flex items-center gap-2 text-sm min-w-0">
        <span className="text-faint">Project</span>
        <span className="text-faint">/</span>
        <input
          value={scene.name}
          onChange={(e) => onRename(e.target.value)}
          aria-label="Project name"
          className="bg-transparent font-medium rounded-md px-1.5 py-1 -mx-1.5 w-64 outline-none hover:bg-shell focus:bg-white focus:ring-1 focus:ring-line"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs text-muted whitespace-nowrap">
          <HardDrive size={13} /> Saved locally
        </span>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Export scene"
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-ink text-white text-sm font-medium whitespace-nowrap transition-[background-color,transform] duration-150 ease-out hover:bg-[#2c4241] active:scale-[0.97]"
          >
            <Upload size={14} /> Export <ChevronDown size={14} className="opacity-70" />
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
