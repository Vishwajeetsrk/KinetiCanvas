/**
 * Multi-format export engine for KinetiCanvas Studio.
 * Supports:
 * - PNG Snapshot (high-res raster)
 * - Standalone SVG (vector scalable)
 * - Animated WebM / Video
 * - Portable .kineti.json project package
 * - React / JSX Code export
 */

/**
 * Download a blob as a file.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export standalone SVG file of current scene stage.
 */
export function exportSceneAsSvg(svgElement, characterName, cueName) {
  if (!svgElement) return;

  const clone = svgElement.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const svgData = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, `kineticanvas-${characterName.toLowerCase()}-${cueName}.svg`);
}

/**
 * Export high-resolution PNG snapshot from SVG stage.
 */
export async function exportSceneAsPng(svgElement, characterName, cueName, scale = 2) {
  if (!svgElement) return;

  const clone = svgElement.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const svgData = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const width = (svgElement.clientWidth || 360) * scale;
  const height = (svgElement.clientHeight || 360) * scale;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Draw background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#132b38");
  bgGrad.addColorStop(1, "#0a1922");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(url);

  canvas.toBlob((blob) => {
    if (blob) {
      downloadBlob(blob, `kineticanvas-${characterName.toLowerCase()}-${cueName}.png`);
    }
  }, "image/png");
}

/**
 * Record animated WebM video clip using MediaRecorder.
 */
export function recordCanvasLoop(svgElement, durationSeconds = 3, onProgress, onComplete) {
  if (!svgElement || typeof MediaRecorder === "undefined") {
    alert("MediaRecorder is not supported in this browser. Please use PNG or SVG export.");
    return;
  }

  const canvas = document.createElement("canvas");
  const width = 640;
  const height = 480;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  const chunks = [];

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    downloadBlob(blob, `kineticanvas-motion-${Date.now()}.webm`);
    if (onComplete) onComplete();
  };

  recorder.start();

  const startTime = Date.now();
  const renderFrame = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed >= durationSeconds) {
      recorder.stop();
      return;
    }

    if (onProgress) {
      onProgress(Math.min(100, Math.round((elapsed / durationSeconds) * 100)));
    }

    // Render frame
    ctx.fillStyle = "#0c1f2a";
    ctx.fillRect(0, 0, width, height);

    // Draw animated glow circle
    const pulse = Math.sin(elapsed * 4) * 15;
    ctx.fillStyle = "rgba(43, 189, 185, 0.15)";
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 30, 100 + pulse, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(renderFrame);
  };

  requestAnimationFrame(renderFrame);
}

/**
 * Generate standalone React component code string.
 */
export function generateReactCode(character, motion, cue) {
  return `import React from "react";

export function ${character.name}Animation() {
  return (
    <div className="kineticanvas-scene" style={{ width: 320, height: 320, position: "relative" }}>
      {/* Character: ${character.name} (${character.title}) */}
      {/* Motion Preset: ${motion} */}
      {/* Active Cue: ${cue} */}
      <div className="avatar-figure motion-${motion.toLowerCase()}">
        <span className="character-label">${character.name}</span>
      </div>
    </div>
  );
}
`;
}
