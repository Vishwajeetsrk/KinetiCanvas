import type { CharacterSpec } from "./types";
import { itemDefinitions } from "../items";

/**
 * Draws a procedural, customizable 2D vector avatar from a CharacterSpec.
 * Works seamlessly in offline local mode and supports unlimited customization combinations.
 */
export function drawAvatar(ctx: CanvasRenderingContext2D, spec: CharacterSpec, size = 512) {
  const s = size;
  ctx.save();
  ctx.clearRect(0, 0, s, s);
  ctx.translate(s / 2, s * 0.85);

  const colors = spec.colors || {
    body: "#2abcb5",
    belly: "#fdf8ec",
    accent: "#ff745f",
    cheek: "#ff8572",
    feet: "#1d3848",
    iris: "#1f7f79",
  };

  // 1. Shadow
  ctx.save();
  ctx.fillStyle = "rgba(28, 43, 43, 0.08)";
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.28, s * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Tail (if any)
  if (spec.tail && spec.tail !== "none") {
    ctx.save();
    ctx.fillStyle = colors.body;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = s * 0.015;
    ctx.beginPath();
    if (spec.tail === "fox") {
      ctx.moveTo(s * 0.15, -s * 0.15);
      ctx.quadraticCurveTo(s * 0.45, -s * 0.35, s * 0.32, -s * 0.55);
      ctx.quadraticCurveTo(s * 0.2, -s * 0.35, s * 0.1, -s * 0.2);
    } else if (spec.tail === "dragon") {
      ctx.moveTo(s * 0.12, -s * 0.12);
      ctx.quadraticCurveTo(s * 0.35, -s * 0.18, s * 0.4, -s * 0.28);
      ctx.lineTo(s * 0.44, -s * 0.24);
      ctx.quadraticCurveTo(s * 0.32, -s * 0.08, s * 0.08, -s * 0.08);
    } else {
      ctx.arc(s * 0.22, -s * 0.18, s * 0.08, 0, Math.PI * 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // 3. Wings (if any)
  if (spec.wings && spec.wings !== "none") {
    ctx.save();
    ctx.fillStyle = colors.accent;
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(dir * s * 0.18, -s * 0.35);
      ctx.quadraticCurveTo(dir * s * 0.45, -s * 0.5, dir * s * 0.4, -s * 0.25);
      ctx.quadraticCurveTo(dir * s * 0.28, -s * 0.22, dir * s * 0.15, -s * 0.25);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  }

  // 4. Feet
  ctx.save();
  ctx.fillStyle = colors.feet;
  [-s * 0.12, s * 0.12].forEach((x) => {
    ctx.beginPath();
    ctx.ellipse(x, -s * 0.03, s * 0.07, s * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 5. Main Body
  ctx.save();
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  if (spec.form === "blob") {
    ctx.ellipse(0, -s * 0.32, s * 0.3, s * 0.26, 0, 0, Math.PI * 2);
  } else if (spec.body === "pear") {
    ctx.moveTo(-s * 0.22, -s * 0.12);
    ctx.bezierCurveTo(-s * 0.28, -s * 0.32, -s * 0.2, -s * 0.55, 0, -s * 0.55);
    ctx.bezierCurveTo(s * 0.2, -s * 0.55, s * 0.28, -s * 0.32, s * 0.22, -s * 0.12);
    ctx.closePath();
  } else {
    ctx.ellipse(0, -s * 0.36, s * 0.28, s * 0.32, 0, 0, Math.PI * 2);
  }
  ctx.fill();

  // Belly patch
  ctx.fillStyle = colors.belly;
  ctx.beginPath();
  ctx.ellipse(0, -s * 0.28, s * 0.18, s * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Head Features (Ears, Horns, Gills)
  ctx.save();
  ctx.fillStyle = colors.body;
  if (spec.head === "bunny") {
    [-s * 0.12, s * 0.12].forEach((x) => {
      ctx.beginPath();
      ctx.ellipse(x, -s * 0.72, s * 0.06, s * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.ellipse(x, -s * 0.72, s * 0.03, s * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.body;
    });
  } else if (spec.head === "fox") {
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(dir * s * 0.1, -s * 0.58);
      ctx.lineTo(dir * s * 0.25, -s * 0.78);
      ctx.lineTo(dir * s * 0.28, -s * 0.52);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.moveTo(dir * s * 0.14, -s * 0.58);
      ctx.lineTo(dir * s * 0.24, -s * 0.72);
      ctx.lineTo(dir * s * 0.24, -s * 0.54);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = colors.body;
    });
  } else if (spec.head === "horns") {
    ctx.fillStyle = colors.accent;
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(dir * s * 0.14, -s * 0.6);
      ctx.quadraticCurveTo(dir * s * 0.28, -s * 0.75, dir * s * 0.24, -s * 0.82);
      ctx.quadraticCurveTo(dir * s * 0.2, -s * 0.72, dir * s * 0.08, -s * 0.62);
      ctx.closePath();
      ctx.fill();
    });
  } else if (spec.head === "gills") {
    ctx.fillStyle = colors.accent;
    [-1, 1].forEach((dir) => {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(dir * (s * 0.28 + i * 8), -s * 0.44 + i * 14, s * 0.06, s * 0.025, dir * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
  ctx.restore();

  // 7. Topper
  if (spec.topper && spec.topper !== "none") {
    ctx.save();
    ctx.strokeStyle = colors.accent;
    ctx.fillStyle = colors.accent;
    ctx.lineWidth = s * 0.015;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.62);
    ctx.lineTo(0, -s * 0.76);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -s * 0.78, s * 0.035, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 8. Cheeks
  ctx.save();
  ctx.fillStyle = colors.cheek;
  [-s * 0.18, s * 0.18].forEach((x) => {
    ctx.beginPath();
    ctx.ellipse(x, -s * 0.32, s * 0.05, s * 0.03, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 9. Eyes
  ctx.save();
  ctx.fillStyle = colors.iris || "#1c2b2b";
  [-s * 0.11, s * 0.11].forEach((x) => {
    ctx.beginPath();
    if (spec.expression === "wink" && x < 0) {
      ctx.lineWidth = s * 0.018;
      ctx.strokeStyle = colors.iris || "#1c2b2b";
      ctx.arc(x, -s * 0.38, s * 0.04, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
    } else {
      ctx.arc(x, -s * 0.38, s * 0.045, 0, Math.PI * 2);
      ctx.fill();
      // Eye reflection highlight
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x + s * 0.015, -s * 0.395, s * 0.016, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.iris || "#1c2b2b";
    }
  });
  ctx.restore();

  // 10. Mouth
  ctx.save();
  ctx.strokeStyle = "#1c2b2b";
  ctx.fillStyle = "#ff745f";
  ctx.lineWidth = s * 0.015;
  ctx.beginPath();
  if (spec.mouth === "open" || spec.expression === "joy") {
    ctx.arc(0, -s * 0.3, s * 0.05, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (spec.mouth === "cat") {
    ctx.arc(-s * 0.03, -s * 0.3, s * 0.03, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.03, -s * 0.3, s * 0.03, 0, Math.PI);
    ctx.stroke();
  } else {
    ctx.arc(0, -s * 0.32, s * 0.04, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();

  // 11. Equipped Items
  if (spec.items && spec.items.length > 0) {
    spec.items.forEach((itemId) => {
      const def = itemDefinitions[itemId];
      if (def) {
        def.draw(ctx, s * 0.9);
      }
    });
  }

  ctx.restore();
}
