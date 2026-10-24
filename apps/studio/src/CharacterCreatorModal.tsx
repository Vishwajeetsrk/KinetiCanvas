import { useEffect, useRef, useState } from "react";
import { Download, Palette, Play, Save, Sliders, Sparkles, Volume2, Wand2, X } from "lucide-react";
import type { CharacterSpec } from "./engine/types";
import { blankSpec, starters } from "./engine/starters";
import { drawAvatar } from "./engine/avatarRenderer";
import { speakText } from "./audio";
import { allItemIds, itemDefinitions } from "./items";
import type { Character } from "./characters";

type Props = {
  initialSpec?: CharacterSpec;
  onSave: (spec: CharacterSpec, avatarDataUrl: string) => void;
  onClose: () => void;
};

export function CharacterCreatorModal({ initialSpec, onSave, onClose }: Props) {
  const [spec, setSpec] = useState<CharacterSpec>(() => initialSpec || blankSpec());
  const [activeTab, setActiveTab] = useState<"anatomy" | "colors" | "items" | "voice">("anatomy");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Re-draw avatar on canvas whenever spec updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawAvatar(ctx, spec, 512);
  }, [spec]);

  const patch = (p: Partial<CharacterSpec>) => setSpec((s) => ({ ...s, ...p }));
  const patchColors = (p: Partial<CharacterSpec["colors"]>) =>
    setSpec((s) => ({ ...s, colors: { ...s.colors, ...p } }));
  const patchVoice = (p: Partial<CharacterSpec["voice"]>) =>
    setSpec((s) => ({ ...s, voice: { ...s.voice, ...p } }));

  const toggleItem = (itemId: any) => {
    const current = spec.items || [];
    const next = current.includes(itemId)
      ? current.filter((id) => id !== itemId)
      : [...current, itemId];
    patch({ items: next });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas ? canvas.toDataURL("image/png") : "";
    onSave(spec, dataUrl);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${spec.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.character.json`;
    a.click();
  };

  const loadPreset = (preset: CharacterSpec) => {
    setSpec({ ...preset, id: `char-${Math.random().toString(36).slice(2, 9)}`, starter: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-panel rounded-2xl border border-line shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="h-14 px-5 border-b border-line flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-teal/10 text-teal">
              <Sparkles size={18} />
            </span>
            <div>
              <h2 className="text-base font-semibold leading-tight text-ink">Character Creator & Engine</h2>
              <p className="text-xs text-muted leading-tight">Design, customize, and voice new companions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg hover:bg-shell text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 grid grid-cols-[340px_1fr] divide-x divide-line">
          {/* Left: Live Avatar Preview & Presets */}
          <div className="p-5 flex flex-col items-center bg-shell/50 overflow-y-auto">
            <div className="relative size-64 rounded-2xl bg-white border border-line shadow-sm flex items-center justify-center p-2 mb-4">
              <canvas ref={canvasRef} width={512} height={512} className="size-full object-contain" />
              <button
                type="button"
                onClick={() => speakText(`Hi, I'm ${spec.name}!`, spec.voice)}
                className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink text-white text-xs font-medium shadow-sm hover:bg-[#2c4241] transition-transform active:scale-95 cursor-pointer"
              >
                <Volume2 size={12} /> Test Voice
              </button>
            </div>

            <div className="w-full space-y-2 mb-4">
              <label className="block text-xs font-medium text-muted">Companion Name</label>
              <input
                type="text"
                value={spec.name}
                onChange={(e) => patch({ name: e.target.value })}
                className="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-line bg-white outline-none focus:ring-1 focus:ring-teal"
              />
            </div>

            <div className="w-full space-y-2 mb-4">
              <label className="block text-xs font-medium text-muted">Archetype Role</label>
              <input
                type="text"
                value={spec.role}
                onChange={(e) => patch({ role: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-line bg-white outline-none focus:ring-1 focus:ring-teal"
              />
            </div>

            {/* Quick Starters Presets */}
            <div className="w-full border-t border-line/80 pt-3">
              <span className="text-[11px] font-semibold text-faint uppercase tracking-wider block mb-2">
                Starter Presets
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {starters.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => loadPreset(s)}
                    className="px-2 py-1.5 rounded-md border border-line bg-white text-xs font-medium text-center hover:border-teal hover:text-teal transition-colors cursor-pointer truncate"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Save & Export Buttons */}
            <div className="mt-auto w-full pt-4 flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 h-9 inline-flex items-center justify-center gap-2 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-[#239f97] transition-transform active:scale-95 cursor-pointer shadow-xs"
              >
                <Save size={14} /> Add to Studio
              </button>
              <button
                type="button"
                onClick={handleExportJson}
                title="Export character JSON"
                className="h-9 px-3 inline-flex items-center justify-center rounded-lg border border-line bg-white text-ink text-xs font-medium hover:bg-shell transition-colors cursor-pointer"
              >
                <Download size={14} />
              </button>
            </div>
          </div>

          {/* Right: Customization Tabs */}
          <div className="flex flex-col min-h-0 bg-white">
            {/* Tabs Bar */}
            <div className="h-11 px-4 border-b border-line flex items-center gap-1 shrink-0 bg-panel">
              <TabButton
                active={activeTab === "anatomy"}
                onClick={() => setActiveTab("anatomy")}
                icon={<Sliders size={13} />}
                label="Anatomy & Shape"
              />
              <TabButton
                active={activeTab === "colors"}
                onClick={() => setActiveTab("colors")}
                icon={<Palette size={13} />}
                label="Palette"
              />
              <TabButton
                active={activeTab === "items"}
                onClick={() => setActiveTab("items")}
                icon={<Wand2 size={13} />}
                label="Accessories"
              />
              <TabButton
                active={activeTab === "voice"}
                onClick={() => setActiveTab("voice")}
                icon={<Volume2 size={13} />}
                label="Voice & Specs"
              />
            </div>

            {/* Tab Contents */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
              {activeTab === "anatomy" && (
                <div className="space-y-4">
                  <SelectGroup
                    label="Body Form"
                    value={spec.form}
                    options={["chibi", "blob"]}
                    onChange={(form) => patch({ form: form as any })}
                  />
                  <SelectGroup
                    label="Head Features"
                    value={spec.head}
                    options={["none", "bunny", "fox", "horns", "gills", "tufts"]}
                    onChange={(head) => patch({ head: head as any })}
                  />
                  <SelectGroup
                    label="Head Topper"
                    value={spec.topper}
                    options={["none", "antenna", "tuft", "crest"]}
                    onChange={(topper) => patch({ topper: topper as any })}
                  />
                  <SelectGroup
                    label="Facial Expression"
                    value={spec.expression}
                    options={["happy", "joy", "calm", "surprised", "sleepy", "wink"]}
                    onChange={(expression) => patch({ expression: expression as any })}
                  />
                  <SelectGroup
                    label="Mouth Style"
                    value={spec.mouth}
                    options={["smile", "open", "cat", "fang"]}
                    onChange={(mouth) => patch({ mouth: mouth as any })}
                  />
                  <SelectGroup
                    label="Wings"
                    value={spec.wings}
                    options={["none", "feather", "bat"]}
                    onChange={(wings) => patch({ wings: wings as any })}
                  />
                  <SelectGroup
                    label="Tail"
                    value={spec.tail}
                    options={["none", "fox", "dragon", "axolotl", "pom"]}
                    onChange={(tail) => patch({ tail: tail as any })}
                  />
                </div>
              )}

              {activeTab === "colors" && (
                <div className="space-y-4">
                  <ColorRow
                    label="Primary Body Color"
                    value={spec.colors.body}
                    onChange={(body) => patchColors({ body })}
                  />
                  <ColorRow
                    label="Belly Color"
                    value={spec.colors.belly}
                    onChange={(belly) => patchColors({ belly })}
                  />
                  <ColorRow
                    label="Accent Color"
                    value={spec.colors.accent}
                    onChange={(accent) => patchColors({ accent })}
                  />
                  <ColorRow
                    label="Cheek Blush Color"
                    value={spec.colors.cheek}
                    onChange={(cheek) => patchColors({ cheek })}
                  />
                  <ColorRow
                    label="Feet Color"
                    value={spec.colors.feet}
                    onChange={(feet) => patchColors({ feet })}
                  />
                  <ColorRow
                    label="Iris Eye Color"
                    value={spec.colors.iris}
                    onChange={(iris) => patchColors({ iris })}
                  />
                </div>
              )}

              {activeTab === "items" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted">
                    Equip props and accessories directly onto your companion:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {allItemIds.map((itemId) => {
                      const def = itemDefinitions[itemId];
                      const active = spec.items?.includes(itemId);
                      return (
                        <button
                          key={itemId}
                          type="button"
                          onClick={() => toggleItem(itemId)}
                          className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between ${
                            active
                              ? "bg-teal/10 border-teal text-teal font-semibold"
                              : "bg-white border-line text-ink hover:bg-shell"
                          }`}
                        >
                          <span className="text-xs">{def.label}</span>
                          <span className="text-[10px] uppercase tracking-wider text-faint">
                            {def.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "voice" && (
                <div className="space-y-4">
                  <SelectGroup
                    label="Voice Waveform"
                    value={spec.voice.wave}
                    options={["sine", "triangle", "square", "sawtooth"]}
                    onChange={(wave) => patchVoice({ wave: wave as any })}
                  />
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Pitch Frequency</span>
                      <span className="font-mono tabular-nums">{Math.round(spec.voice.note)} Hz</span>
                    </div>
                    <input
                      type="range"
                      min={220}
                      max={980}
                      step={10}
                      value={spec.voice.note}
                      onChange={(e) => patchVoice({ note: +e.target.value })}
                      className="w-full cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Speech Chatter Rate</span>
                      <span className="font-mono tabular-nums">{spec.voice.rate.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.0}
                      step={0.05}
                      value={spec.voice.rate}
                      onChange={(e) => patchVoice({ rate: +e.target.value })}
                      className="w-full cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
        active ? "bg-white text-ink shadow-xs border border-line" : "text-muted hover:text-ink hover:bg-white/60"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SelectGroup({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-muted tracking-tight">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors cursor-pointer ${
              value === opt
                ? "bg-ink text-white"
                : "bg-white border border-line text-ink hover:bg-shell"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg border border-line bg-shell/30">
      <span className="text-xs font-medium text-ink">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-muted uppercase">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-7 rounded border border-line cursor-pointer bg-transparent"
        />
      </div>
    </div>
  );
}
