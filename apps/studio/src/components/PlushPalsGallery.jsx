import { useState } from "react";
import { ArrowRight, Check, Code, Download, Sparkles } from "lucide-react";
import { downloadPng, downloadSvg, reactSnippet } from "../export/exporters.js";

export const PLUSH_PALS = [
  {
    id: "pomo",
    name: "Pomo",
    species: "Sprout Blob",
    role: "Organizer & Thinker",
    powers: "Mind Bubble Matrix / Zen Focus",
    src: "/assets/characters/pomo-hd.jpg",
    bg: "#eef8f6",
  },
  {
    id: "fynn",
    name: "Fynn",
    species: "Plush Fox",
    role: "Designer & Painter",
    powers: "Chromatic Realization / Vector Transmutation",
    src: "/assets/characters/fynn-hd.jpg",
    bg: "#fdf8ee",
  },
  {
    id: "olli",
    name: "Olli",
    species: "Feathered Owl",
    role: "Analyst & Strategist",
    powers: "Predictive Telemetry / 3D Multi-Metric",
    src: "/assets/characters/olli-hd.jpg",
    bg: "#edf7f9",
  },
  {
    id: "nixi",
    name: "Nixi",
    species: "Coral-Gilled Axolotl",
    role: "Explorer & Systems",
    powers: "Web Teleportation / API Deep-Diving",
    src: "/assets/characters/nixi-hd.jpg",
    bg: "#f3f8f9",
  },
  {
    id: "ember",
    name: "Ember",
    species: "Teal Baby Dragon",
    role: "Builder & Architect",
    powers: "Code Ignition / Harmonic Audio Synthesis",
    src: "/assets/characters/ember-hd.jpg",
    bg: "#edf8f7",
  },
  {
    id: "kipi",
    name: "Kipi",
    species: "Cosmic Plush Maker",
    role: "Maker & Orchestrator",
    powers: "Agent Telepathy / Equalizer Balancing",
    src: "/assets/characters/kipi-hd.jpg",
    bg: "#edf8f7",
  },
];

function PalCard({ pal, onSelectForStudio }) {
  const [busy, setBusy] = useState(null);
  const [copied, setCopied] = useState(false);

  async function run(type) {
    setBusy(type);
    try {
      if (type === "png") await downloadPng(pal.id);
      if (type === "svg") await downloadSvg(pal.id);
    } finally {
      setBusy(null);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(reactSnippet(pal.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="pal-card">
      <div className="pal-image-wrap" style={{ background: pal.bg }}>
        <img
          src={pal.src}
          alt={pal.name}
          className="pal-image"
          loading="lazy"
        />
        <span className="pal-tag">{pal.species}</span>
      </div>

      <div className="pal-info">
        <div className="pal-header-line">
          <h3 className="pal-title">{pal.name}</h3>
          <span className="pal-role">{pal.role}</span>
        </div>
        <p className="pal-powers">{pal.powers}</p>
      </div>

      <div className="pal-action-grid">
        <button
          onClick={() => run("png")}
          className="pal-btn pal-btn-primary inline-flex items-center justify-center gap-1.5"
          title="Download 1024x1024 lossless PNG"
        >
          <Download size={13} /> {busy === "png" ? "Saving..." : "PNG"}
        </button>
        <button
          onClick={() => run("svg")}
          className="pal-btn inline-flex items-center justify-center gap-1.5"
          title="Download vector SVG with embedded image"
        >
          <Download size={13} /> {busy === "svg" ? "Saving..." : "SVG"}
        </button>
        <button
          onClick={copy}
          className="pal-btn inline-flex items-center justify-center gap-1.5"
          title="Copy React JSX component snippet"
        >
          {copied ? <Check size={13} className="text-teal" /> : <Code size={13} />}
          <span>{copied ? "Copied" : "Code"}</span>
        </button>
      </div>

      <button
        onClick={() => onSelectForStudio(pal.id)}
        className="pal-animate-btn inline-flex items-center justify-center gap-2"
      >
        <Sparkles size={14} /> Direct & Animate in Studio <ArrowRight size={14} />
      </button>
    </article>
  );
}

export function PlushPalsGallery({ onSelectCharacter, onClose }) {
  return (
    <div className="gallery-view">
      <header className="gallery-header">
        <div>
          <h2>Plush Pals Export Kit</h2>
          <p>
            The six characters, unchanged from the canvas scan. Download each as PNG or self-contained SVG, copy ready-to-paste code, or open directly into the interactive animation studio.
          </p>
        </div>
        <div className="gallery-meta">
          <span>6 characters / 1024 x 1024</span>
          {onClose && (
            <button className="primary-button" onClick={onClose} style={{ marginLeft: 16 }}>
              Back to Studio Editor
            </button>
          )}
        </div>
      </header>

      <main className="gallery-grid">
        {PLUSH_PALS.map((pal) => (
          <PalCard
            key={pal.id}
            pal={pal}
            onSelectForStudio={(id) => onSelectCharacter?.(id)}
          />
        ))}
      </main>
    </div>
  );
}
