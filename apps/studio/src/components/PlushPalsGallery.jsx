import React, { useState } from "react";
import { downloadPng, downloadSvg, reactSnippet } from "../export/exporters.js";

export const PLUSH_PALS = [
  {
    id: "pomo",
    name: "Pomo (Blob)",
    role: "Thinking",
    url: "/assets/characters/pomo-hd.jpg",
    powers: "Mind Bubble Matrix · Zen Focus",
  },
  {
    id: "fynn",
    name: "Fynn (Fox)",
    role: "Creating",
    url: "/assets/characters/fynn-hd.jpg",
    powers: "Chromatic Realization · Vector Transmutation",
  },
  {
    id: "olli",
    name: "Olli (Owl)",
    role: "Analyzing",
    url: "/assets/characters/olli-hd.jpg",
    powers: "Predictive Telemetry · 3D Multi-Metric",
  },
  {
    id: "nixi",
    name: "Nixi (Axolotl)",
    role: "Browsing",
    url: "/assets/characters/nixi-hd.jpg",
    powers: "Web Teleportation · API Deep-Diving",
  },
  {
    id: "ember",
    name: "Ember (Dragon)",
    role: "Coding",
    url: "/assets/characters/ember-hd.jpg",
    powers: "Code Ignition · Harmonic Audio Synthesis",
  },
  {
    id: "kipi",
    name: "Kipi (Maker Bunny)",
    role: "Listening",
    url: "/assets/characters/kipi-hd.jpg",
    powers: "Agent Telepathy · Equalizer Balancing",
  },
];

export function CharacterGalleryCard({ pal, onSelectForStudio }) {
  const [busy, setBusy] = useState(null);
  const [copied, setCopied] = useState(false);

  const run = async (kind) => {
    setBusy(kind);
    try {
      await (kind === "png" ? downloadPng(pal) : downloadSvg(pal));
    } catch {
      window.open(pal.url, "_blank");
    } finally {
      setBusy(null);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(reactSnippet(pal));
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <article className="pal-card">
      <div className="pal-image-wrapper">
        <img src={pal.url} alt={pal.name} className="pal-image" loading="lazy" />
        <span className="pal-badge">{pal.role}</span>
      </div>

      <div className="pal-info">
        <div className="pal-header">
          <h3>{pal.name}</h3>
          <span className="pal-role">{pal.role}</span>
        </div>
        <p className="pal-powers">{pal.powers}</p>
      </div>

      <div className="pal-action-grid">
        <button
          onClick={() => run("png")}
          className="pal-btn pal-btn-primary"
          title="Download 1024x1024 lossless PNG"
        >
          {busy === "png" ? "…" : "⬇ PNG"}
        </button>
        <button
          onClick={() => run("svg")}
          className="pal-btn"
          title="Download vector SVG with embedded image"
        >
          {busy === "svg" ? "…" : "⬇ SVG"}
        </button>
        <button
          onClick={copy}
          className="pal-btn"
          title="Copy React JSX component snippet"
        >
          {copied ? "✓ Copied" : "📋 Code"}
        </button>
      </div>

      <button
        onClick={() => onSelectForStudio(pal.id)}
        className="pal-animate-btn"
      >
        ✨ Direct & Animate in Canvas Studio →
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
          <span>6 characters · 1024 × 1024</span>
          {onClose && (
            <button className="primary-button" onClick={onClose} style={{ marginLeft: 16 }}>
              Back to Studio Editor
            </button>
          )}
        </div>
      </header>

      <main className="gallery-grid">
        {PLUSH_PALS.map((pal) => (
          <CharacterGalleryCard
            key={pal.id}
            pal={pal}
            onSelectForStudio={(id) => {
              onSelectCharacter(id);
              if (onClose) onClose();
            }}
          />
        ))}
      </main>
    </div>
  );
}
