import { pose } from "./motion";
import type { Scene } from "./scene";
import type { ImageBank } from "./useCharacterImages";
import { itemDefinitions } from "./items";

export const SCENE = 1024;
const FEET_Y = 968;
const CHAR_SIZE = 900;
const CUE_SIZE = 170;
const CUE_FADE = 0.2;

/** Cue visibility at time t: entrance from 0.96 + fade, mirrored on exit. */
export function cueState(scene: Scene, t: number) {
  const { start, end, type } = scene.cue;
  if (type === "none" || t < start || t > end) return null;
  const inP = Math.min(1, (t - start) / CUE_FADE);
  const outP = Math.min(1, (end - t) / CUE_FADE);
  const p = Math.min(inP, end >= scene.duration ? 1 : outP);
  const e = 1 - Math.pow(1 - p, 3);
  return { opacity: e, scale: 0.96 + 0.04 * e, float: Math.sin(t * 2.4) * 6 };
}

export function characterTransform(scene: Scene, t: number) {
  const p = pose(scene.motion, t, scene.intensity, scene.speed);
  return { ...p, size: CHAR_SIZE * scene.scale, feetX: SCENE / 2 + p.x, feetY: FEET_Y + p.y };
}

/** Draws one frame of the scene. Used by the live stage and every raster export. */
export function drawFrame(ctx: CanvasRenderingContext2D, px: number, scene: Scene, t: number, bank: ImageBank) {
  const k = px / SCENE;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, px, px);
  ctx.setTransform(k, 0, 0, k, 0, 0);

  // Contact shadow — stays on the floor, shrinks as the character lifts.
  const tr = characterTransform(scene, t);
  const lift = Math.max(0, -tr.y);
  ctx.save();
  ctx.fillStyle = "rgba(28, 43, 43, 0.08)";
  ctx.beginPath();
  ctx.ellipse(tr.feetX, FEET_Y - 4, 210 * scene.scale * (1 - Math.min(lift, 60) / 160), 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const img = bank.chars[scene.characterId];
  if (img) {
    ctx.save();
    ctx.translate(tr.feetX, tr.feetY);
    ctx.rotate((tr.rotate * Math.PI) / 180);
    ctx.scale(tr.scaleX, tr.scaleY);
    // Multiply lets the plush's white studio backdrop vanish into the stage and keeps the shadow visible.
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(img, -tr.size / 2, -tr.size * 0.9, tr.size, tr.size);
    ctx.restore();
  }

  // Draw equipped vector items / accessories (rendered on top of character with motion sync)
  if (scene.items && scene.items.length > 0) {
    ctx.save();
    ctx.translate(tr.feetX, tr.feetY);
    ctx.rotate((tr.rotate * Math.PI) / 180);
    ctx.scale(tr.scaleX, tr.scaleY);
    scene.items.forEach((itemId) => {
      const def = itemDefinitions[itemId];
      if (def) {
        def.draw(ctx, tr.size);
      }
    });
    ctx.restore();
  }

  // Draw Task Cue
  const cs = cueState(scene, t);
  const cueImg = bank.cues[scene.cue.type];
  if (cs && cueImg) {
    ctx.save();
    ctx.globalAlpha = cs.opacity;
    ctx.translate(scene.cue.x, scene.cue.y + cs.float);
    ctx.scale(cs.scale, cs.scale);
    ctx.drawImage(cueImg, -CUE_SIZE / 2, -CUE_SIZE / 2, CUE_SIZE, CUE_SIZE);
    ctx.restore();
  }

  // Draw Speech Bubble (if speech active)
  if (scene.speech?.enabled && scene.speech.text) {
    const speechStart = scene.speech.at;
    const speechDuration = 2.8;
    if (t >= speechStart && t <= speechStart + speechDuration) {
      const speechProg = (t - speechStart) / speechDuration;
      const alpha = Math.min(1, Math.min(speechProg / 0.15, (1 - speechProg) / 0.15));
      const bubbleX = Math.min(840, Math.max(180, tr.feetX));
      const bubbleY = tr.feetY - tr.size * 0.88 + Math.sin(t * 3) * 4;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.font = "600 24px Inter, system-ui, sans-serif";
      const textMetrics = ctx.measureText(scene.speech.text);
      const padding = 20;
      const bw = textMetrics.width + padding * 2;
      const bh = 54;

      // Bubble shadow
      ctx.fillStyle = "rgba(28, 43, 43, 0.08)";
      ctx.beginPath();
      ctx.roundRect(bubbleX - bw / 2, bubbleY - bh + 4, bw, bh, 18);
      ctx.fill();

      // Bubble background
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#e3dfd8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(bubbleX - bw / 2, bubbleY - bh, bw, bh, 18);
      ctx.fill();
      ctx.stroke();

      // Pointer tail
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(bubbleX - 10, bubbleY);
      ctx.lineTo(bubbleX, bubbleY + 12);
      ctx.lineTo(bubbleX + 10, bubbleY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#e3dfd8";
      ctx.beginPath();
      ctx.moveTo(bubbleX - 10, bubbleY);
      ctx.lineTo(bubbleX, bubbleY + 12);
      ctx.lineTo(bubbleX + 10, bubbleY);
      ctx.stroke();

      // Text
      ctx.fillStyle = "#1c2b2b";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(scene.speech.text, bubbleX, bubbleY - bh / 2);
      ctx.restore();
    }
  }
}

export { CUE_SIZE };
