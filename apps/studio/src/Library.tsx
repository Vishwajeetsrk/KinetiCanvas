import type { ReactNode } from "react";
import { MessageSquare, Music, Plus, Shapes, User, Wand2 } from "lucide-react";
import { characters, characterById, type CharacterId, type Character } from "./characters";
import { cues } from "./cues";
import type { Scene } from "./scene";

type Props = {
  scene: Scene;
  customCharacters?: Character[];
  onPick: (id: CharacterId) => void;
  onOpenCreator: () => void;
};

export function Library({ scene, customCharacters = [], onPick, onOpenCreator }: Props) {
  const allChars = [...characters, ...customCharacters.filter((cc) => !characters.some((c) => c.id === cc.id))];
  const ch = allChars.find((c) => c.id === scene.characterId) || characters[0];
  const cueLabel = cues.find((c) => c.id === scene.cue.type)?.label;

  return (
    <aside className="min-h-0 flex flex-col border-r border-line bg-panel select-none" aria-label="Companions and layers">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-semibold text-ink">Companions</h2>
          <span className="text-xs text-faint font-mono">({allChars.length})</span>
        </div>
        <button
          onClick={onOpenCreator}
          title="Create or customize companion"
          className="p-1 rounded-md hover:bg-white text-muted hover:text-ink border border-transparent hover:border-line transition-colors cursor-pointer"
        >
          <Plus size={14} />
        </button>
      </div>

      <ul className="px-2 space-y-0.5 overflow-y-auto max-h-[48vh]" role="list">
        {allChars.map((c) => {
          const active = c.id === scene.characterId;
          return (
            <li key={c.id}>
              <button
                onClick={() => onPick(c.id as CharacterId)}
                aria-pressed={active}
                className={`w-full flex items-center gap-3 rounded-lg p-1.5 text-left transition-colors duration-150 ease-out cursor-pointer ${
                  active ? "bg-white ring-1 ring-line shadow-xs" : "hover:bg-shell"
                }`}
              >
                <img src={c.url} alt={c.name} className="size-10 rounded-md object-cover bg-white border border-line/60" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium leading-tight text-ink">{c.name}</span>
                  <span className="block text-xs text-muted truncate">{c.role}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto px-4 pb-2 flex items-center gap-1.5 border-t border-line pt-3">
        <Wand2 size={13} className="text-muted" />
        <h2 className="text-xs font-semibold text-ink uppercase tracking-wider">Active Layers</h2>
      </div>
      <ul className="px-2 pb-4 text-xs space-y-0.5" role="list">
        {scene.music?.enabled && <LayerRow icon={<Music size={13} />} label="Lo-Fi Soundscape" active />}
        {scene.audio.enabled && <LayerRow icon={<Music size={13} />} label="Notification Chime" />}
        {scene.speech?.enabled && <LayerRow icon={<MessageSquare size={13} />} label="Speech Bubble" active />}
        {scene.cue.type !== "none" && <LayerRow icon={<Shapes size={13} />} label={`${cueLabel} Cue`} />}
        <LayerRow icon={<User size={13} />} label={`${ch.name} Companion`} active />
      </ul>
    </aside>
  );
}

function LayerRow({ icon, label, active }: { icon: ReactNode; label: string; active?: boolean }) {
  return (
    <li className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${active ? "bg-teal-soft/80 text-ink font-medium" : "text-muted"}`}>
      {icon}
      <span className="truncate">{label}</span>
    </li>
  );
}
