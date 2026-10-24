export type CueId = "none" | "browser" | "design" | "analytics" | "document" | "terminal" | "music";

const T = "#2a8f88";
const M = "#9fd8d0";
const C = "#e5735d";
const P = "#f3ece0";

/** Each cue is a 200×200 vector. The same string renders in the stage and in SVG exports. */
const bodies: Record<Exclude<CueId, "none">, string> = {
  analytics: `<circle cx="22" cy="150" r="7" fill="${M}"/><circle cx="44" cy="164" r="9" fill="${M}"/>
    <rect x="66" y="112" width="30" height="64" rx="8" fill="${T}"/><rect x="108" y="78" width="30" height="98" rx="8" fill="${M}"/><rect x="150" y="34" width="30" height="142" rx="8" fill="${C}"/>`,
  browser: `<rect x="20" y="40" width="160" height="120" rx="20" fill="${P}"/><rect x="34" y="72" width="132" height="74" rx="10" fill="${M}"/>
    <circle cx="40" cy="56" r="6" fill="${C}"/><circle cx="58" cy="56" r="6" fill="${T}"/><circle cx="76" cy="56" r="6" fill="${M}"/>`,
  design: `<path d="M100 28c-44 0-78 32-78 72 0 40 34 70 70 70 14 0 18-10 12-20-6-10 0-22 14-22h18c24 0 42-14 42-42 0-34-34-58-78-58z" fill="${P}"/>
    <circle cx="66" cy="78" r="12" fill="${T}"/><circle cx="104" cy="60" r="12" fill="${C}"/><circle cx="142" cy="80" r="12" fill="${M}"/><circle cx="62" cy="120" r="12" fill="${C}"/>`,
  document: `<rect x="46" y="22" width="108" height="156" rx="16" fill="${P}"/><rect x="66" y="52" width="68" height="12" rx="6" fill="${T}"/>
    <rect x="66" y="80" width="68" height="10" rx="5" fill="${M}"/><rect x="66" y="102" width="56" height="10" rx="5" fill="${M}"/><rect x="66" y="124" width="62" height="10" rx="5" fill="${M}"/><rect x="66" y="146" width="34" height="10" rx="5" fill="${C}"/>`,
  terminal: `<path d="M34 60l42 40-42 40" stroke="${C}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="104" cy="104" r="12" fill="${P}"/><path d="M128 60l42 40-42 40" stroke="${M}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  music: `<path d="M64 150V52l52-14v94" stroke="${T}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <ellipse cx="50" cy="152" rx="20" ry="15" fill="${T}"/><ellipse cx="102" cy="134" rx="20" ry="15" fill="${T}"/>
    <path d="M150 112V62l30 10" stroke="${C}" stroke-width="10" fill="none" stroke-linecap="round"/><ellipse cx="140" cy="116" rx="15" ry="11" fill="${C}"/>`,
};

export const cues: { id: CueId; label: string }[] = [
  { id: "none", label: "None" },
  { id: "analytics", label: "Analytics" },
  { id: "browser", label: "Browser" },
  { id: "design", label: "Design" },
  { id: "document", label: "Document" },
  { id: "terminal", label: "Terminal" },
  { id: "music", label: "Music" },
];

export const cueInner = (id: CueId) => (id === "none" ? "" : bodies[id]);

export const cueSvg = (id: CueId) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">${cueInner(id)}</svg>`;

export const cueDataUrl = (id: CueId) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cueSvg(id))}`;
