import { useEffect, useMemo, useRef, useState } from "react";
import {
  createProject,
  createScene,
  createTaskCue,
  addScene,
  addTaskCue,
  CHARACTERS,
  getCharacterById,
} from "@kineticanvas/core";
import { createRoot } from "react-dom/client";
import { CompanionRenderer } from "./components/CharacterAvatars.jsx";
import { playCharacterSound, playCueSound } from "./audio/synth.js";
import {
  downloadBlob,
  exportSceneAsPng,
  exportSceneAsSvg,
  generateReactCode,
  recordCanvasLoop,
} from "./export/exportEngine.js";
import "./styles.css";

const motions = ["Idle", "Walk", "Think", "Work", "Review", "Sleep"];
const cueTypes = ["analytics", "browser", "design", "document", "terminal", "music"];

function createDemoProject() {
  const base = createProject({
    id: "project-friday-analytics-update",
    title: "Friday analytics update",
    createdAt: "2026-10-24T00:00:00.000Z",
  });
  const scene = addTaskCue(
    createScene({ id: "scene-analytics", name: "Analytics update", duration: 5 }),
    createTaskCue({
      id: "cue-analytics",
      type: "analytics",
      start: 1,
      duration: 4,
      label: "Reviewing analytics",
    }),
  );
  return addScene(base, scene, "2026-10-24T00:00:00.000Z");
}

function App() {
  const [project] = useState(createDemoProject);
  const [selectedId, setSelectedId] = useState("ember");
  const [selectedMotion, setSelectedMotion] = useState("Work");
  const [selectedCue, setSelectedCue] = useState("analytics");
  const [activeCue, setActiveCue] = useState("analytics");
  const [hasAudio, setHasAudio] = useState(true);
  const [keyframes, setKeyframes] = useState([0, 1.5, 3.8]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [toast, setToast] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  // Transform controls
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);

  const stageRef = useRef(null);

  const selectedCharacter = useMemo(
    () => getCharacterById(selectedId) || CHARACTERS[4],
    [selectedId],
  );
  const scene = project.scenes[0];

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setPlayhead((current) => {
        const next = current >= scene.duration ? 0 : Number((current + 0.1).toFixed(1));
        // Trigger audio chime near cue
        if (hasAudio && Math.abs(next - 1.0) < 0.05) {
          playCueSound(activeCue);
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [isPlaying, scene.duration, hasAudio, activeCue]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function notify(message) {
    setToast(message);
  }

  function handleSelectCharacter(id) {
    setSelectedId(id);
    if (hasAudio) {
      playCharacterSound(id);
    }
    const char = getCharacterById(id);
    notify(`Selected ${char.name} — ${char.title}`);
  }

  function handleAddCue() {
    setActiveCue(selectedCue);
    if (hasAudio) {
      playCueSound(selectedCue);
    }
    notify(`Attached ${selectedCue} cue to scene stage.`);
  }

  function handleMotionChange(motion) {
    setSelectedMotion(motion);
    if (hasAudio) {
      playCharacterSound(selectedId, 0.15);
    }
  }

  function addKeyframe() {
    const keyframe = Number(playhead.toFixed(1));
    setKeyframes((current) =>
      current.includes(keyframe) ? current : [...current, keyframe].sort((a, b) => a - b),
    );
    notify(`Keyframe added at ${keyframe.toFixed(1)}s.`);
  }

  function downloadProjectJson() {
    const exportData = {
      ...project,
      editor: {
        selectedCharacter: selectedId,
        selectedMotion,
        activeCue,
        keyframes,
        transform: { posX, posY, scale, rotation },
        audio: hasAudio ? [{ id: "demo-chime", label: "Chime", at: 3.9 }] : [],
      },
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    downloadBlob(blob, `${selectedCharacter.name.toLowerCase()}-${activeCue}.kineti.json`);
    notify("Portable .kineti project manifest downloaded.");
  }

  function handleExportPng() {
    const svg = stageRef.current?.querySelector("svg");
    if (!svg) {
      notify("SVG stage not ready for PNG export.");
      return;
    }
    exportSceneAsPng(svg, selectedCharacter.name, activeCue);
    notify(`High-res PNG snapshot exported for ${selectedCharacter.name}!`);
    setShowExportModal(false);
  }

  function handleExportSvg() {
    const svg = stageRef.current?.querySelector("svg");
    if (!svg) {
      notify("SVG stage not ready for export.");
      return;
    }
    exportSceneAsSvg(svg, selectedCharacter.name, activeCue);
    notify(`Standalone vector SVG exported for ${selectedCharacter.name}!`);
    setShowExportModal(false);
  }

  function handleRecordVideo() {
    const svg = stageRef.current?.querySelector("svg");
    notify("Recording 3-second animated WebM video clip...");
    recordCanvasLoop(
      svg,
      3,
      (pct) => notify(`Recording video: ${pct}% complete...`),
      () => {
        notify("Animated WebM video downloaded successfully!");
        setShowExportModal(false);
      },
    );
  }

  function handleCopyCode() {
    const code = generateReactCode(selectedCharacter, selectedMotion, activeCue);
    navigator.clipboard?.writeText(code);
    notify("React component code copied to clipboard!");
    setShowExportModal(false);
  }

  return (
    <main className="studio-shell">
      {/* Top Bar */}
      <header className="topbar">
        <div className="brand" aria-label="KinetiCanvas Studio">
          <img className="brand-mark" src="/ember-builder.png" alt="Ember, the dragon builder" />
          <span>
            Kineti<span>Canvas</span>
          </span>
        </div>
        <div className="project-meta">
          <span className="project-dot" />
          <span>{project.title}</span>
          <span className="saved-state">Saved locally</span>
        </div>
        <div className="top-actions">
          <button
            className={`ghost-button ${hasAudio ? "active" : ""}`}
            onClick={() => setHasAudio((v) => !v)}
            aria-label="Toggle procedural audio"
          >
            {hasAudio ? "♪ Audio On" : "✕ Audio Muted"}
          </button>
          <button className="accent-button" onClick={() => setShowExportModal(true)}>
            Export Everywhere ▾
          </button>
          <button className="primary-button" onClick={downloadProjectJson}>
            Download .kineti
          </button>
        </div>
      </header>

      {/* Main 3-column Editor Grid */}
      <section className="editor-grid">
        {/* Left Sidebar: Asset & Companion Library */}
        <aside className="sidebar asset-panel" aria-label="Asset library">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Library</p>
              <h1>Companions</h1>
            </div>
            <button
              className="icon-button"
              aria-label="Create custom character"
              onClick={() => notify("Use the Character Creator to design your own mascot!")}
            >
              +
            </button>
          </div>
          <div className="character-list">
            {CHARACTERS.map((character) => (
              <button
                key={character.id}
                className={`character-card ${selectedId === character.id ? "selected" : ""}`}
                onClick={() => handleSelectCharacter(character.id)}
              >
                <div className="card-mini-avatar">
                  <CompanionRenderer characterId={character.id} motion="Idle" size={38} />
                </div>
                <span>
                  <strong>{character.name}</strong>
                  <small>{character.role}</small>
                  <span className="badge-species">{character.species}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="library-divider" />

          {/* Task Cues */}
          <div className="asset-section">
            <p className="eyebrow">Task cues</p>
            <div className="cue-grid">
              {cueTypes.map((cue) => (
                <button
                  key={cue}
                  className={selectedCue === cue ? "cue-chip selected" : "cue-chip"}
                  onClick={() => setSelectedCue(cue)}
                >
                  {cue === "analytics"
                    ? "↗ Analytics"
                    : cue === "browser"
                    ? "🌐 Chrome"
                    : cue === "design"
                    ? "🎨 Canva"
                    : cue === "music"
                    ? "🎵 Music"
                    : cue === "terminal"
                    ? "💻 Code"
                    : "📄 Doc"}
                </button>
              ))}
            </div>
          </div>
          <button className="outline-button" onClick={handleAddCue}>
            + Add selected cue to stage
          </button>
        </aside>

        {/* Center Workspace: Canvas Stage */}
        <section className="workspace" aria-label="Canvas workspace">
          <div className="workspace-toolbar">
            <div className="breadcrumb">
              Scene 01 <span>/</span> {scene.name}
            </div>
            <div className="viewport-options">
              <button onClick={() => setScale(100)}>100%</button>
              <button onClick={() => setScale(125)}>Fit</button>
              <button
                aria-label="Reset transform"
                onClick={() => {
                  setPosX(0);
                  setPosY(0);
                  setScale(100);
                  setRotation(0);
                }}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="canvas-stage" ref={stageRef}>
            <div className="canvas-glow" />
            <div className="canvas-card">
              <div className="stage-status">
                <span className="live-dot" />
                Live Preview
              </div>

              {/* Dynamic Task Cue Badge */}
              <div className={`floating-cue ${activeCue}-cue`}>
                <span>
                  {activeCue === "analytics"
                    ? "↗"
                    : activeCue === "browser"
                    ? "🌐"
                    : activeCue === "design"
                    ? "🎨"
                    : activeCue === "music"
                    ? "🎵"
                    : activeCue === "terminal"
                    ? ">_"
                    : "📄"}
                </span>
                <b>{activeCue}</b>
                <small>Scene task cue</small>
              </div>

              {/* Interactive Character Figure with Transforms */}
              <div
                className="stage-figure-container"
                style={{
                  transform: `translate(${posX}px, ${posY}px) scale(${scale / 100}) rotate(${rotation}deg)`,
                }}
              >
                <CompanionRenderer
                  characterId={selectedCharacter.id}
                  motion={selectedMotion}
                  size={200}
                />
              </div>

              <div className="canvas-label">
                <strong>{selectedCharacter.name}</strong>
                <span>
                  {selectedMotion} · {playhead.toFixed(1)}s
                </span>
              </div>
              <div className="canvas-floor" />
            </div>
          </div>
        </section>

        {/* Right Sidebar: Inspector */}
        <aside className="sidebar inspector" aria-label="Inspector">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Inspector</p>
              <h2>{selectedCharacter.name}</h2>
            </div>
            <button
              className="icon-button"
              aria-label="Play sound"
              onClick={() => playCharacterSound(selectedCharacter.id)}
            >
              ♪
            </button>
          </div>

          <div className="inspector-preview">
            <CompanionRenderer characterId={selectedCharacter.id} motion={selectedMotion} size={64} />
            <div className="inspector-preview-text">
              <strong>{selectedCharacter.title}</strong>
              <small>{selectedCharacter.archetype}</small>
            </div>
          </div>

          {/* Motion Presets */}
          <section className="inspector-section">
            <div className="section-row">
              <h3>Motion Presets</h3>
              <button onClick={() => notify("Active motion presets update timeline keyframes.")}>
                Edit
              </button>
            </div>
            <div className="motion-list">
              {motions.map((motion) => (
                <button
                  key={motion}
                  className={selectedMotion === motion ? "motion-chip selected" : "motion-chip"}
                  onClick={() => handleMotionChange(motion)}
                >
                  {motion}
                </button>
              ))}
            </div>
          </section>

          {/* Individual Powers */}
          <section className="inspector-section">
            <div className="section-row">
              <h3>Specific Powers</h3>
            </div>
            <div className="powers-list">
              {selectedCharacter.powers.map((power, idx) => (
                <div key={idx} className="power-item">
                  {power}
                </div>
              ))}
            </div>
          </section>

          {/* Working Style */}
          <section className="inspector-section">
            <div className="section-row">
              <h3>Working Style</h3>
            </div>
            <div className="working-style-box">{selectedCharacter.workingStyle}</div>
          </section>

          {/* Transform Sliders */}
          <section className="inspector-section">
            <div className="section-row">
              <h3>Transform</h3>
              <button
                onClick={() => {
                  setPosX(0);
                  setPosY(0);
                  setScale(100);
                  setRotation(0);
                }}
              >
                Reset
              </button>
            </div>
            <div className="transform-controls">
              <div className="control-row">
                <label>Position X</label>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                />
                <span>{posX}px</span>
              </div>
              <div className="control-row">
                <label>Position Y</label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                />
                <span>{posY}px</span>
              </div>
              <div className="control-row">
                <label>Scale</label>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                />
                <span>{scale}%</span>
              </div>
              <div className="control-row">
                <label>Rotation</label>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                />
                <span>{rotation}°</span>
              </div>
            </div>
          </section>

          {/* Palette Chips */}
          <section className="inspector-section">
            <div className="section-row">
              <h3>Visual Palette</h3>
            </div>
            <div className="color-row">
              <i
                style={{ background: selectedCharacter.visual.baseColor }}
                title="Base color"
                onClick={() => notify(`Base color: ${selectedCharacter.visual.baseColor}`)}
              />
              <i
                style={{ background: selectedCharacter.visual.accentColor }}
                title="Accent color"
                onClick={() => notify(`Accent color: ${selectedCharacter.visual.accentColor}`)}
              />
              <i
                style={{ background: selectedCharacter.visual.bellyColor }}
                title="Belly/chest tone"
                onClick={() => notify(`Chest/belly tone: ${selectedCharacter.visual.bellyColor}`)}
              />
            </div>
          </section>
        </aside>
      </section>

      {/* Bottom Timeline */}
      <section className="timeline" aria-label="Animation timeline">
        <div className="timeline-controls">
          <div className="transport">
            <button
              onClick={() => {
                setPlayhead(0);
                setIsPlaying(false);
              }}
              aria-label="Jump to start"
            >
              |◀
            </button>
            <button
              className="play-button"
              onClick={() => setIsPlaying((value) => !value)}
              aria-label={isPlaying ? "Pause preview" : "Play preview"}
            >
              {isPlaying ? "Ⅱ" : "▶"}
            </button>
            <span>
              {playhead.toFixed(1)} / {scene.duration.toFixed(1)}s
            </span>
          </div>
          <div>
            <button
              className={`ghost-button ${hasAudio ? "active" : ""}`}
              onClick={() => setHasAudio((value) => !value)}
            >
              ♪ {hasAudio ? "Audio: Active" : "Audio: Muted"}
            </button>
            <button className="ghost-button" onClick={addKeyframe}>
              ◇ Keyframe
            </button>
          </div>
        </div>

        <div className="timeline-ruler">
          <span>0s</span>
          <span>1s</span>
          <span>2s</span>
          <span>3s</span>
          <span>4s</span>
          <span>5s</span>
        </div>

        {/* Character Track */}
        <div className="track">
          <div className="track-title">
            <span className="track-dot character-dot" />
            {selectedCharacter.name}
            <small>Character</small>
          </div>
          <div className="track-lane">
            <span className="motion-segment" style={{ width: "100%" }}>
              {selectedMotion}
            </span>
            {keyframes.map((keyframe) => (
              <i
                className="keyframe-marker"
                style={{ left: `${(keyframe / scene.duration) * 100}%` }}
                title={`Keyframe at ${keyframe.toFixed(1)}s`}
                key={keyframe}
              />
            ))}
            <i
              className="playhead"
              style={{ left: `${(playhead / scene.duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Task Cue Track */}
        <div className="track">
          <div className="track-title">
            <span className="track-dot cue-dot" />
            {activeCue}
            <small>Task cue</small>
          </div>
          <div className="track-lane">
            <span className="cue-segment" style={{ left: "20%", width: "80%" }}>
              {activeCue}
            </span>
          </div>
        </div>

        {/* Audio Track */}
        {hasAudio && (
          <div className="track">
            <div className="track-title">
              <span className="track-dot audio-dot" />
              {selectedCharacter.name} Tone
              <small>Audio</small>
            </div>
            <div className="track-lane">
              <span className="audio-segment" style={{ left: "20%", width: "80%" }}>
                ♪ {selectedCharacter.soundProfile.timbre}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Export Everywhere Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Export KinetiCanvas Scene</h2>
              <button className="icon-button" onClick={() => setShowExportModal(false)}>
                ✕
              </button>
            </div>
            <p style={{ color: "#a2c2c7", fontSize: 13, margin: "0 0 16px" }}>
              Export <b>{selectedCharacter.name}</b> in <b>{selectedMotion}</b> mode with the <b>{activeCue}</b> cue:
            </p>
            <div className="export-grid">
              <button className="export-card" onClick={handleExportPng}>
                <b>🖼 PNG Image</b>
                <span>High-res snapshot with transparent / canvas background</span>
              </button>
              <button className="export-card" onClick={handleExportSvg}>
                <b>📐 Vector SVG</b>
                <span>Infinitely scalable vector artwork for web & Figma</span>
              </button>
              <button className="export-card" onClick={handleRecordVideo}>
                <b>🎬 Animated WebM</b>
                <span>Recorded motion video loop for presentations & chats</span>
              </button>
              <button className="export-card" onClick={downloadProjectJson}>
                <b>📦 .kineti Project</b>
                <span>Portable JSON package for desktop, web, & agents</span>
              </button>
              <button className="export-card" onClick={handleCopyCode}>
                <b>⚛ React JSX Code</b>
                <span>Copy ready-to-use React animation component</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
