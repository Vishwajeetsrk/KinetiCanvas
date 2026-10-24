import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { characterById } from "./characters";
import { cueInner } from "./cues";
import { pose } from "./motion";
import { SCENE, CUE_SIZE, characterTransform, cueState, drawFrame } from "./render";
import type { Scene } from "./scene";
import type { ImageBank } from "./useCharacterImages";
import { scheduleChime } from "./audio";

export type ExportFormat = "png" | "svg" | "gif" | "webm" | "mp4" | "sprite" | "kineti" | "json" | "react";
type Progress = (p: number) => void;

const slug = (s: Scene) => s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "scene";

function save(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function canvas(px: number, h = px): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = px;
  c.height = h;
  return c;
}

function assertClean(bank: ImageBank) {
  if (bank.tainted) throw new Error("The image host blocked pixel access, so raster exports are unavailable here. SVG, .kineti and code still work.");
}

const toBlob = (c: HTMLCanvasElement, type = "image/png") =>
  new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("Encoding failed"))), type));

export async function exportScene(format: ExportFormat, scene: Scene, bank: ImageBank, t: number, onProgress: Progress) {
  const name = slug(scene);
  switch (format) {
    case "png": {
      assertClean(bank);
      const c = canvas(1024);
      drawFrame(c.getContext("2d")!, 1024, scene, t, bank);
      return save(await toBlob(c), `${name}.png`);
    }
    case "svg":
      return save(new Blob([await frameSvg(scene, t, bank)], { type: "image/svg+xml" }), `${name}.svg`);
    case "gif":
      return save(await renderGif(scene, bank, onProgress), `${name}.gif`);
    case "webm":
    case "mp4":
      return save(await recordVideo(scene, bank, format, onProgress), `${name}.${format}`);
    case "sprite":
      return save(await renderSprite(scene, bank), `${name}-sprite.png`);
    case "kineti":
      return save(new Blob([JSON.stringify({ format: "kineti", ...scene }, null, 2)], { type: "application/json" }), `${name}.kineti`);
    case "json":
      return save(new Blob([JSON.stringify(animationJson(scene), null, 2)], { type: "application/json" }), `${name}.animation.json`);
    case "react":
      await navigator.clipboard.writeText(reactPlayer(scene));
      return;
  }
}

/* ---------- GIF ---------- */
async function renderGif(scene: Scene, bank: ImageBank, onProgress: Progress) {
  assertClean(bank);
  const px = 480;
  const fps = 15;
  const frames = Math.round(scene.duration * fps);
  const c = canvas(px);
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  const gif = GIFEncoder();
  for (let i = 0; i < frames; i++) {
    drawFrame(ctx, px, scene, i / fps, bank);
    const { data } = ctx.getImageData(0, 0, px, px);
    const palette = quantize(data, 256);
    gif.writeFrame(applyPalette(data, palette), px, px, { palette, delay: Math.round(1000 / fps) });
    onProgress((i + 1) / frames);
    if (i % 5 === 0) await new Promise((r) => setTimeout(r, 0));
  }
  gif.finish();
  return new Blob([gif.bytes() as Uint8Array], { type: "image/gif" });
}

/* ---------- WebM / MP4 (real-time capture, includes the chime) ---------- */
function pickMime(kind: "webm" | "mp4") {
  if (typeof MediaRecorder === "undefined") return undefined;
  const list = kind === "mp4"
    ? ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4;codecs=avc1", "video/mp4"]
    : ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  return list.find((m) => MediaRecorder.isTypeSupported(m));
}

async function recordVideo(scene: Scene, bank: ImageBank, kind: "webm" | "mp4", onProgress: Progress) {
  assertClean(bank);
  if (typeof MediaRecorder === "undefined") throw new Error("This browser can't record video.");
  const mime = pickMime(kind);
  if (!mime) throw new Error(kind === "mp4" ? "This browser can't encode MP4. Export WebM instead, or use Safari / recent Chrome." : "This browser can't encode WebM.");

  const px = 1080;
  const c = canvas(px);
  const ctx = c.getContext("2d")!;
  drawFrame(ctx, px, scene, 0, bank);
  const stream: MediaStream = (c as unknown as { captureStream(fps: number): MediaStream }).captureStream(30);

  let ac: AudioContext | null = null;
  if (scene.audio.enabled) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      ac = new AudioCtx();
      const dest = ac.createMediaStreamDestination();
      scheduleChime(ac, dest, ac.currentTime + scene.audio.at, scene.audio.volume);
      dest.stream.getAudioTracks().forEach((tr) => stream.addTrack(tr));
    }
  }

  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  const chunks: BlobPart[] = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise<void>((r) => (rec.onstop = () => r()));
  rec.start();

  const t0 = performance.now();
  await new Promise<void>((resolve) => {
    const loop = () => {
      const t = (performance.now() - t0) / 1000;
      if (t >= scene.duration) return resolve();
      drawFrame(ctx, px, scene, t, bank);
      onProgress(t / scene.duration);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  rec.stop();
  await done;
  void ac?.close();
  onProgress(1);
  return new Blob(chunks, { type: mime.split(";")[0] });
}

/* ---------- Sprite sheet ---------- */
async function renderSprite(scene: Scene, bank: ImageBank) {
  assertClean(bank);
  const cell = 256;
  const cols = 8;
  const fps = 12;
  const frames = Math.round(scene.duration * fps);
  const rows = Math.ceil(frames / cols);
  const sheet = canvas(cell * cols, cell * rows);
  const sctx = sheet.getContext("2d")!;
  const cellC = canvas(cell);
  const cctx = cellC.getContext("2d")!;
  for (let i = 0; i < frames; i++) {
    drawFrame(cctx, cell, scene, i / fps, bank);
    sctx.drawImage(cellC, (i % cols) * cell, Math.floor(i / cols) * cell);
  }
  return toBlob(sheet);
}

/* ---------- Vector-aware SVG: transforms and cue are true vectors, plush is embedded ---------- */
async function frameSvg(scene: Scene, t: number, bank: ImageBank) {
  const ch = characterById(scene.characterId);
  let href = ch.url;

  // If the character image is already loaded in memory, convert to base64 Data URL offline
  const img = bank.chars[scene.characterId];
  if (img && img.naturalWidth) {
    try {
      const c = canvas(img.naturalWidth, img.naturalHeight);
      c.getContext("2d")!.drawImage(img, 0, 0);
      href = c.toDataURL("image/jpeg", 0.95);
    } catch {
      /* fall back to URL */
    }
  } else {
    try {
      const blob = await (await fetch(ch.url)).blob();
      href = await new Promise<string>((r) => {
        const fr = new FileReader();
        fr.onload = () => r(fr.result as string);
        fr.readAsDataURL(blob);
      });
    } catch {
      /* fall back to linking the CDN image */
      href = ch.cdnUrl;
    }
  }

  const tr = characterTransform(scene, t);
  const cs = cueState(scene, t);
  const cue = cs
    ? `<g opacity="${cs.opacity.toFixed(3)}" transform="translate(${scene.cue.x} ${scene.cue.y + cs.float}) scale(${cs.scale}) translate(${-CUE_SIZE / 2} ${-CUE_SIZE / 2}) scale(${CUE_SIZE / 200})">${cueInner(scene.cue.type)}</g>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SCENE}" height="${SCENE}" viewBox="0 0 ${SCENE} ${SCENE}">
  <title>${scene.name} — ${ch.name}</title>
  <rect width="100%" height="100%" fill="#ffffff"/>
  <g transform="translate(${tr.feetX} ${tr.feetY}) rotate(${tr.rotate}) scale(${tr.scaleX} ${tr.scaleY})" style="mix-blend-mode:multiply">
    <image href="${href}" x="${-tr.size / 2}" y="${-tr.size * 0.9}" width="${tr.size}" height="${tr.size}"/>
  </g>
  ${cue}
</svg>`;
}

/* ---------- JSON animation + React player ---------- */
function animationJson(scene: Scene) {
  const fps = 24;
  const n = Math.round(scene.duration * fps);
  return {
    character: characterById(scene.characterId).url,
    fps,
    size: SCENE,
    frames: Array.from({ length: n }, (_, i) => {
      const p = pose(scene.motion, i / fps, scene.intensity, scene.speed);
      return [+p.x.toFixed(2), +p.y.toFixed(2), +p.rotate.toFixed(2), +p.scaleX.toFixed(4), +p.scaleY.toFixed(4)];
    }),
    cue: scene.cue,
    audio: scene.audio,
  };
}

function reactPlayer(scene: Scene) {
  const ch = characterById(scene.characterId);
  return `// ${ch.name} · ${scene.motion} — generated by KinetiCanvas
// Pair with ${slug(scene)}.animation.json (export "JSON animation").
import { useEffect, useState } from "react";
import anim from "./${slug(scene)}.animation.json";

export function ${ch.name}${scene.motion[0].toUpperCase() + scene.motion.slice(1)}({ size = 256 }: { size?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % anim.frames.length), 1000 / anim.fps);
    return () => clearInterval(id);
  }, []);
  const [x, y, r, sx, sy] = anim.frames[i];
  const k = size / anim.size;
  return (
    <div style={{ width: size, height: size, position: "relative", overflow: "hidden", background: "#fff" }}>
      <img
        src={anim.character}
        alt="${ch.name}"
        style={{
          position: "absolute", width: ${Math.round(900 * scene.scale)} * k, left: (512 + x) * k - ${Math.round(450 * scene.scale)} * k,
          top: (968 + y) * k - ${Math.round(810 * scene.scale)} * k, transformOrigin: "50% 90%",
          transform: \`rotate(\${r}deg) scale(\${sx}, \${sy})\`, mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
`;
}
