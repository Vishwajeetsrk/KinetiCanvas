import { useEffect, useMemo, useState } from "react";
import { createProject, createScene, createTaskCue, addScene, addTaskCue } from "@kineticanvas/core";
import { createRoot } from "react-dom/client";
import "./styles.css";

const characters = [
  { id: "kipi", name: "Kipi", role: "Maker", accent: "antenna", color: "#25c5bf" },
  { id: "pomo", name: "Pomo", role: "Organizer", accent: "dots", color: "#72e3dc" },
  { id: "fynn", name: "Fynn", role: "Designer", accent: "ears", color: "#2bbdb9" },
  { id: "olli", name: "Olli", role: "Analyst", accent: "wings", color: "#66d9cd" },
  { id: "nixi", name: "Nixi", role: "Explorer", accent: "gills", color: "#41c7c2" },
  { id: "ember", name: "Ember", role: "Builder", accent: "horns", color: "#20b9b3" },
];

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
    createTaskCue({ id: "cue-analytics", type: "analytics", start: 1, duration: 4, label: "Reviewing analytics" }),
  );
  return addScene(base, scene, "2026-10-24T00:00:00.000Z");
}

function Avatar({ character, size = "large" }) {
  return (
    <div className={`avatar avatar-${size} accent-${character.accent}`} style={{ "--avatar": character.color }} aria-label={`${character.name} character preview`}>
      <span className="avatar-ear avatar-ear-left" />
      <span className="avatar-ear avatar-ear-right" />
      <span className="avatar-frill avatar-frill-left" />
      <span className="avatar-frill avatar-frill-right" />
      <span className="avatar-eye avatar-eye-left" />
      <span className="avatar-eye avatar-eye-right" />
      <span className="avatar-smile" />
      <span className="avatar-cheek avatar-cheek-left" />
      <span className="avatar-cheek avatar-cheek-right" />
    </div>
  );
}

function App() {
  const [project] = useState(createDemoProject);
  const [selectedId, setSelectedId] = useState("olli");
  const [selectedMotion, setSelectedMotion] = useState("Work");
  const [selectedCue, setSelectedCue] = useState("analytics");
  const [activeCue, setActiveCue] = useState("analytics");
  const [hasAudio, setHasAudio] = useState(true);
  const [keyframes, setKeyframes] = useState([0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [toast, setToast] = useState("");
  const selectedCharacter = useMemo(() => characters.find((character) => character.id === selectedId), [selectedId]);
  const scene = project.scenes[0];

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setPlayhead((current) => (current >= scene.duration ? 0 : Number((current + 0.1).toFixed(1))));
    }, 100);
    return () => window.clearInterval(timer);
  }, [isPlaying, scene.duration]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function notify(message) {
    setToast(message);
  }

  function addCue() {
    setActiveCue(selectedCue);
    notify(`${selectedCue} cue added to this scene.`);
  }

  function addKeyframe() {
    const keyframe = Number(playhead.toFixed(1));
    setKeyframes((current) => current.includes(keyframe) ? current : [...current, keyframe].sort((a, b) => a - b));
    notify(`Keyframe added at ${keyframe.toFixed(1)}s.`);
  }

  function downloadProject() {
    const exportData = {
      ...project,
      editor: {
        selectedCharacter: selectedId,
        selectedMotion,
        activeCue,
        keyframes,
        audio: hasAudio ? [{ id: "demo-chime", label: "Chime", at: 3.9 }] : [],
      },
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "friday-analytics-update.kineti.json";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Editable project JSON downloaded. Your working project was not changed.");
  }

  return (
    <main className="studio-shell">
      <header className="topbar">
        <div className="brand" aria-label="KinetiCanvas Studio">
          <img className="brand-mark" src="/ember-builder.png" alt="Ember, the dragon builder" />
          <span>Kineti<span>Canvas</span></span>
        </div>
        <div className="project-meta">
          <span className="project-dot" />
          <span>{project.title}</span>
          <span className="saved-state">Saved locally</span>
        </div>
        <div className="top-actions">
          <button className="ghost-button" onClick={() => notify("Share links arrive with the local-cloud sync milestone.")}>Share</button>
          <button className="primary-button" onClick={downloadProject}>Download project</button>
        </div>
      </header>

      <section className="editor-grid">
        <aside className="sidebar asset-panel" aria-label="Asset library">
          <div className="panel-heading">
            <div><p className="eyebrow">Library</p><h1>Characters</h1></div>
            <button className="icon-button" aria-label="Create character" onClick={() => notify("Character creator is the next asset-library milestone.")}>+</button>
          </div>
          <div className="character-list">
            {characters.map((character) => (
              <button key={character.id} className={`character-card ${selectedId === character.id ? "selected" : ""}`} onClick={() => setSelectedId(character.id)}>
                <Avatar character={character} size="small" />
                <span><strong>{character.name}</strong><small>{character.role}</small></span>
              </button>
            ))}
          </div>
          <div className="library-divider" />
          <div className="asset-section">
            <p className="eyebrow">Task cues</p>
            <div className="cue-grid">
              {cueTypes.map((cue) => <button key={cue} className={selectedCue === cue ? "cue-chip selected" : "cue-chip"} onClick={() => setSelectedCue(cue)}>{cue}</button>)}
            </div>
          </div>
          <button className="outline-button" onClick={addCue}>+ Add selected cue</button>
        </aside>

        <section className="workspace" aria-label="Canvas workspace">
          <div className="workspace-toolbar">
            <div className="breadcrumb">Scene 01 <span>/</span> {scene.name}</div>
            <div className="viewport-options"><button>100%</button><button>Fit</button><button aria-label="Canvas settings">⋯</button></div>
          </div>
          <div className="canvas-stage">
            <div className="canvas-glow" />
            <div className="canvas-card">
              <div className="stage-status"><span className="live-dot" />Live preview</div>
              <div className={`floating-cue ${activeCue}-cue`}><span>{activeCue === "analytics" ? "↗" : activeCue === "music" ? "♪" : "+"}</span><b>{activeCue}</b><small>Scene task cue</small></div>
              <div className="thinking-bubbles"><i /><i /><i /></div>
              <Avatar character={selectedCharacter} />
              <div className="canvas-label"><strong>{selectedCharacter.name}</strong><span>{selectedMotion} · {playhead.toFixed(1)}s</span></div>
              <div className="canvas-floor" />
            </div>
          </div>
        </section>

        <aside className="sidebar inspector" aria-label="Inspector">
          <div className="panel-heading"><div><p className="eyebrow">Inspector</p><h2>{selectedCharacter.name}</h2></div><button className="icon-button" aria-label="More layer options">⋯</button></div>
          <div className="inspector-preview"><Avatar character={selectedCharacter} size="medium" /><span>{selectedCharacter.role}</span></div>
          <section className="inspector-section">
            <div className="section-row"><h3>Motion</h3><button onClick={() => notify("Motion presets remain editable as timeline keyframes.")}>Edit</button></div>
            <div className="motion-list">{motions.map((motion) => <button key={motion} className={selectedMotion === motion ? "motion-chip selected" : "motion-chip"} onClick={() => setSelectedMotion(motion)}>{motion}</button>)}</div>
          </section>
          <section className="inspector-section">
            <div className="section-row"><h3>Transform</h3><button>Reset</button></div>
            <label>Position <span>960 × 540</span></label>
            <label>Scale <span>100%</span></label>
            <label>Rotation <span>0°</span></label>
          </section>
          <section className="inspector-section"><div className="section-row"><h3>Appearance</h3><button>Customize</button></div><div className="color-row"><i style={{ background: selectedCharacter.color }} /><i style={{ background: "#ff947c" }} /><i style={{ background: "#f5f0df" }} /></div></section>
        </aside>
      </section>

      <section className="timeline" aria-label="Animation timeline">
        <div className="timeline-controls">
          <div className="transport"><button onClick={() => { setPlayhead(0); setIsPlaying(false); }} aria-label="Jump to start">|◀</button><button className="play-button" onClick={() => setIsPlaying((value) => !value)} aria-label={isPlaying ? "Pause preview" : "Play preview"}>{isPlaying ? "Ⅱ" : "▶"}</button><span>{playhead.toFixed(1)} / {scene.duration.toFixed(1)}s</span></div>
          <div><button className="ghost-button" onClick={() => setHasAudio((value) => !value)}>♪ {hasAudio ? "Remove audio" : "Add audio"}</button><button className="ghost-button" onClick={addKeyframe}>◇ Keyframe</button></div>
        </div>
        <div className="timeline-ruler"><span>0s</span><span>1s</span><span>2s</span><span>3s</span><span>4s</span><span>5s</span></div>
        <div className="track"><div className="track-title"><span className="track-dot character-dot" />{selectedCharacter.name}<small>Character</small></div><div className="track-lane"><span className="motion-segment" style={{ width: "100%" }}>{selectedMotion}</span>{keyframes.map((keyframe) => <i className="keyframe-marker" style={{ left: `${(keyframe / scene.duration) * 100}%` }} title={`Keyframe at ${keyframe.toFixed(1)} seconds`} key={keyframe} />)}<i className="playhead" style={{ left: `${(playhead / scene.duration) * 100}%` }} /></div></div>
        <div className="track"><div className="track-title"><span className="track-dot cue-dot" />{activeCue}<small>Task cue</small></div><div className="track-lane"><span className="cue-segment" style={{ left: "20%", width: "80%" }}>{activeCue}</span></div></div>
        {hasAudio && <div className="track"><div className="track-title"><span className="track-dot audio-dot" />Chime<small>Audio</small></div><div className="track-lane"><span className="audio-segment" style={{ left: "78%", width: "8%" }}>♪</span></div></div>}
      </section>

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
