import type { CharacterId } from "./characters";
import type { MotionId } from "./motion";
import type { CueId } from "./cues";

export type Scene = {
  version: 1;
  name: string;
  characterId: CharacterId;
  motion: MotionId;
  intensity: number;
  speed: number;
  scale: number;
  duration: number;
  cue: { type: CueId; start: number; end: number; x: number; y: number };
  audio: { enabled: boolean; asset: "notification-chime"; at: number; volume: number };
};

export const defaultScene: Scene = {
  version: 1,
  name: "Friday analytics update",
  characterId: "olli",
  motion: "analyze",
  intensity: 1,
  speed: 1,
  scale: 1,
  duration: 5,
  cue: { type: "analytics", start: 1, end: 5, x: 790, y: 210 },
  audio: { enabled: true, asset: "notification-chime", at: 4, volume: 0.6 },
};

export const fmt = (t: number) => {
  const sec = Math.floor(t);
  const fr = Math.floor((t - sec) * 24);
  return `00:${String(sec).padStart(2, "0")}:${String(fr).padStart(2, "0")}`;
};
