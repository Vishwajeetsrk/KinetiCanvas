import type { ReactNode } from "react";
import { ImagePlus, Layers, Music2, Shapes, User } from "lucide-react";
import { characters, characterById, type CharacterId } from "./characters";
import { cues } from "./cues";
import type { Scene } from "./scene";

type Props = { scene: Scene; onPick: (id: CharacterId) => void };

export function Library({ scene, onPick }: Props) {
  const ch = characterById(scene.characterId);
  const cueLabel = cues.find((c) => c.id === scene.cue.type)?.label;
  return (
    <aside className="min-h-0 flex flex-col border-r border-line bg-panel" aria-label="Companions and layers">
      <div className="px-4 pt-4 pb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">Companions</h2>
        <span className="text-xs text-faint">6</span>
      </div>
      <ul className="px-2 space-y-0.5" role="list">
        {characters.map((c) => {
          const active = c.id === scene.characterId;
          return (
            <li key={c.id}>
              <button
                onClick={() => onPick(c.id)}
                aria-pressed={active}
                className={`w-full flex items-center gap-3 rounded-lg p-1.5 text-left transition-colors duration-150 ease-out cursor-pointer ${
                  active ? "bg-white ring-1 ring-line shadow-xs" : "hover:bg-shell"
                }`}
              >
                <img src={c.url} alt={c.name} className="size-10 rounded-md object-cover bg-white" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium leading-tight">{c.name}</span>
                  <span className="block text-xs text-muted truncate">{c.role}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <button
        disabled
        title="Planned: image, video, GIF, website and Figma references"
        className="mx-3 mt-2 flex items-center gap-2 rounded-lg border border-dashed border-line px-3 py-2 text-xs text-muted cursor-not-allowed opacity-75"
      >
        <ImagePlus size={14} /> Import reference
        <span className="ml-auto text-faint">Planned</span>
      </button>

      <div className="mt-6 px-4 pb-2 flex items-center gap-1.5 border-t border-line pt-4">
        <Layers size={14} className="text-muted" />
        <h2 className="text-sm font-semibold">Layers</h2>
      </div>
      <ul className="px-2 pb-4 text-sm" role="list">
        {scene.audio.enabled && <LayerRow icon={<Music2 size={14} />} label="Notification chime" />}
        {scene.cue.type !== "none" && <LayerRow icon={<Shapes size={14} />} label={`${cueLabel} cue`} />}
        <LayerRow icon={<User size={14} />} label={`${ch.name} character`} active />
      </ul>
    </aside>
  );
}

function LayerRow({ icon, label, active }: { icon: ReactNode; label: string; active?: boolean }) {
  return (
    <li className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${active ? "bg-teal-soft text-ink" : "text-muted"}`}>
      {icon}
      <span className="truncate">{label}</span>
    </li>
  );
}
