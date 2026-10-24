export type MotionId =
  | "idle" | "walk" | "wave" | "think" | "work"
  | "review" | "paint" | "analyze" | "sleep" | "celebrate";

export type Pose = { x: number; y: number; rotate: number; scaleX: number; scaleY: number };

export const motions: { id: MotionId; label: string }[] = [
  { id: "idle", label: "Idle" },
  { id: "walk", label: "Walk" },
  { id: "wave", label: "Wave" },
  { id: "think", label: "Think" },
  { id: "work", label: "Work" },
  { id: "review", label: "Review" },
  { id: "paint", label: "Paint" },
  { id: "analyze", label: "Analyze" },
  { id: "sleep", label: "Sleep" },
  { id: "celebrate", label: "Celebrate" },
];

const TAU = Math.PI * 2;
const s = (t: number, period: number) => Math.sin((TAU * t) / period);

/**
 * Pure pose function — the single source of truth for preview AND every export.
 * Units are in the 1024px scene space; rotation is degrees around the feet.
 */
export function pose(id: MotionId, t: number, intensity = 1, speed = 1): Pose {
  const k = intensity;
  const u = t * speed;
  const base: Pose = { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 };
  switch (id) {
    case "idle":
      return { ...base, y: s(u, 2.5) * 6 * k, scaleY: 1 + s(u, 2.5) * 0.015 * k, scaleX: 1 - s(u, 2.5) * 0.008 * k };
    case "walk": {
      const step = Math.abs(s(u, 0.7));
      return { ...base, x: s(u, 5) * 90 * k, y: -step * 16 * k, rotate: s(u, 1.4) * 4 * k };
    }
    case "wave":
      return { ...base, rotate: s(u, 0.8) * 7 * k, y: Math.abs(s(u, 0.8)) * -6 * k };
    case "think":
      return { ...base, rotate: (-5 + s(u, 3) * 3) * k, y: s(u, 3) * 5 * k };
    case "work": {
      const tap = Math.abs(s(u, 0.45));
      return { ...base, y: -tap * 7 * k, scaleY: 1 - tap * 0.02 * k, scaleX: 1 + tap * 0.012 * k };
    }
    case "review": {
      const nod = Math.max(0, s(u, 1.6));
      return { ...base, rotate: nod * 4 * k, y: nod * 4 * k + s(u, 4) * 3 };
    }
    case "paint":
      return { ...base, rotate: s(u, 1.2) * 6 * k, x: s(u, 1.2) * 14 * k, y: Math.abs(s(u, 0.6)) * -5 * k };
    case "analyze": {
      // Deliberate lean left, pause, lean right — methodical scanning.
      const phase = (u % 3) / 3;
      const lean = phase < 0.35 ? -1 : phase < 0.5 ? 0 : phase < 0.85 ? 1 : 0;
      const ease = Math.sin(((u % 0.75) / 0.75) * Math.PI) * 0.15;
      return { ...base, rotate: (lean * 5 + ease) * k, scaleX: 1 + 0.02 * k, scaleY: 1 + 0.02 * k, y: s(u, 1.5) * 3 };
    }
    case "sleep":
      return { ...base, rotate: -7 * k, y: 10 + s(u, 3.5) * 4 * k, scaleY: 1 + s(u, 3.5) * 0.03 * k, scaleX: 1 - s(u, 3.5) * 0.01 * k };
    case "celebrate": {
      const hop = Math.abs(s(u, 1.1));
      const squash = hop < 0.15 ? (0.15 - hop) * 0.6 : 0;
      return { ...base, y: -hop * 46 * k, rotate: s(u, 2.2) * 6 * k, scaleY: 1 - squash * k, scaleX: 1 + squash * 0.6 * k };
    }
  }
}
