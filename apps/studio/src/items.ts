import type { ItemId } from "./engine/types";

export type ItemDefinition = {
  id: ItemId;
  label: string;
  category: "head" | "face" | "neck" | "held";
  draw: (ctx: CanvasRenderingContext2D, size: number) => void;
};

export const itemDefinitions: Record<ItemId, ItemDefinition> = {
  headphones: {
    id: "headphones",
    label: "DJ Headphones",
    category: "head",
    draw: (ctx, s) => {
      // Over-head band
      ctx.save();
      ctx.lineWidth = s * 0.045;
      ctx.strokeStyle = "#1d3848";
      ctx.beginPath();
      ctx.arc(0, -s * 0.45, s * 0.32, Math.PI, 0, false);
      ctx.stroke();

      // Left ear cup
      ctx.fillStyle = "#29c3bc";
      ctx.strokeStyle = "#ff745f";
      ctx.lineWidth = s * 0.015;
      ctx.beginPath();
      ctx.roundRect(-s * 0.38, -s * 0.48, s * 0.12, s * 0.22, s * 0.05);
      ctx.fill();
      ctx.stroke();

      // Right ear cup
      ctx.beginPath();
      ctx.roundRect(s * 0.26, -s * 0.48, s * 0.12, s * 0.22, s * 0.05);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
  },
  glasses: {
    id: "glasses",
    label: "Round Glasses",
    category: "face",
    draw: (ctx, s) => {
      ctx.save();
      ctx.lineWidth = s * 0.02;
      ctx.strokeStyle = "#1c2b2b";
      ctx.fillStyle = "rgba(216, 239, 236, 0.35)";

      // Left lens
      ctx.beginPath();
      ctx.arc(-s * 0.14, -s * 0.36, s * 0.11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Right lens
      ctx.beginPath();
      ctx.arc(s * 0.14, -s * 0.36, s * 0.11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Bridge
      ctx.beginPath();
      ctx.arc(0, -s * 0.38, s * 0.06, Math.PI * 0.8, Math.PI * 0.2, true);
      ctx.stroke();
      ctx.restore();
    },
  },
  "party-hat": {
    id: "party-hat",
    label: "Party Hat",
    category: "head",
    draw: (ctx, s) => {
      ctx.save();
      ctx.translate(s * 0.05, -s * 0.72);
      ctx.rotate(0.12);

      // Cone
      ctx.fillStyle = "#ff745f";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = s * 0.01;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.25);
      ctx.lineTo(s * 0.14, s * 0.08);
      ctx.lineTo(-s * 0.14, s * 0.08);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Stripes
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.moveTo(-s * 0.07, -s * 0.08);
      ctx.lineTo(s * 0.07, -s * 0.08);
      ctx.lineTo(s * 0.09, -s * 0.02);
      ctx.lineTo(-s * 0.09, -s * 0.02);
      ctx.closePath();
      ctx.fill();

      // Pom pom
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.arc(0, -s * 0.26, s * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  crown: {
    id: "crown",
    label: "Royal Crown",
    category: "head",
    draw: (ctx, s) => {
      ctx.save();
      ctx.translate(0, -s * 0.74);
      ctx.fillStyle = "#ffd166";
      ctx.strokeStyle = "#d49a20";
      ctx.lineWidth = s * 0.015;

      ctx.beginPath();
      ctx.moveTo(-s * 0.2, 0);
      ctx.lineTo(-s * 0.22, -s * 0.14);
      ctx.lineTo(-s * 0.1, -s * 0.06);
      ctx.lineTo(0, -s * 0.18);
      ctx.lineTo(s * 0.1, -s * 0.06);
      ctx.lineTo(s * 0.22, -s * 0.14);
      ctx.lineTo(s * 0.2, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Jewels
      ctx.fillStyle = "#e5735d";
      ctx.beginPath();
      ctx.arc(0, -s * 0.09, s * 0.025, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  bow: {
    id: "bow",
    label: "Coral Bow",
    category: "neck",
    draw: (ctx, s) => {
      ctx.save();
      ctx.translate(0, -s * 0.18);
      ctx.fillStyle = "#ff745f";
      ctx.strokeStyle = "#e5533d";
      ctx.lineWidth = s * 0.015;

      // Left wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-s * 0.15, -s * 0.08);
      ctx.lineTo(-s * 0.15, s * 0.08);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(s * 0.15, -s * 0.08);
      ctx.lineTo(s * 0.15, s * 0.08);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Center knot
      ctx.fillStyle = "#ff9182";
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  flower: {
    id: "flower",
    label: "Sakura Flower",
    category: "head",
    draw: (ctx, s) => {
      ctx.save();
      ctx.translate(-s * 0.25, -s * 0.65);
      ctx.fillStyle = "#ff85a1";
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const angle = (i * Math.PI * 2) / 5;
        ctx.arc(Math.cos(angle) * s * 0.045, Math.sin(angle) * s * 0.045, s * 0.035, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.025, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  scarf: {
    id: "scarf",
    label: "Warm Scarf",
    category: "neck",
    draw: (ctx, s) => {
      ctx.save();
      ctx.translate(0, -s * 0.22);
      ctx.fillStyle = "#2a8f88";
      ctx.strokeStyle = "#1c2b2b";
      ctx.lineWidth = s * 0.012;

      // Main wrap
      ctx.beginPath();
      ctx.roundRect(-s * 0.28, -s * 0.06, s * 0.56, s * 0.13, s * 0.06);
      ctx.fill();
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.roundRect(s * 0.08, 0, s * 0.12, s * 0.24, s * 0.04);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
  },
  star: {
    id: "star",
    label: "Cosmic Star",
    category: "held",
    draw: (ctx, s) => {
      ctx.save();
      ctx.translate(s * 0.28, -s * 0.32);
      ctx.fillStyle = "#ffd166";
      ctx.strokeStyle = "#f39c12";
      ctx.lineWidth = s * 0.015;

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outer = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const inner = outer + Math.PI / 5;
        if (i === 0) ctx.moveTo(Math.cos(outer) * s * 0.08, Math.sin(outer) * s * 0.08);
        else ctx.lineTo(Math.cos(outer) * s * 0.08, Math.sin(outer) * s * 0.08);
        ctx.lineTo(Math.cos(inner) * s * 0.035, Math.sin(inner) * s * 0.035);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
  },
  laptop: {
    id: "laptop",
    label: "Dev Laptop",
    category: "held",
    draw: (ctx, s) => {
      ctx.save();
      ctx.translate(s * 0.05, -s * 0.02);
      // Screen
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = s * 0.01;
      ctx.beginPath();
      ctx.roundRect(-s * 0.16, -s * 0.18, s * 0.32, s * 0.18, s * 0.02);
      ctx.fill();
      ctx.stroke();

      // Glowing code screen
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(-s * 0.14, -s * 0.16, s * 0.28, s * 0.14);

      // Base keyboard
      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.moveTo(-s * 0.2, 0);
      ctx.lineTo(s * 0.2, 0);
      ctx.lineTo(s * 0.18, s * 0.04);
      ctx.lineTo(-s * 0.18, s * 0.04);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
  },
  coffee: {
    id: "coffee",
    label: "Coffee Mug",
    category: "held",
    draw: (ctx, s) => {
      ctx.save();
      ctx.translate(s * 0.26, -s * 0.12);
      // Mug body
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = s * 0.01;
      ctx.beginPath();
      ctx.roundRect(-s * 0.08, -s * 0.12, s * 0.16, s * 0.18, s * 0.03);
      ctx.fill();
      ctx.stroke();

      // Handle
      ctx.lineWidth = s * 0.02;
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(s * 0.08, -s * 0.03, s * 0.05, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();

      // Steam
      ctx.strokeStyle = "rgba(100, 116, 139, 0.45)";
      ctx.lineWidth = s * 0.012;
      ctx.beginPath();
      ctx.moveTo(-s * 0.03, -s * 0.14);
      ctx.bezierCurveTo(-s * 0.05, -s * 0.2, 0, -s * 0.22, -s * 0.02, -s * 0.28);
      ctx.stroke();
      ctx.restore();
    },
  },
  brush: {
    id: "brush",
    label: "Artist Brush",
    category: "held",
    draw: (ctx, s) => {
      ctx.save();
      ctx.translate(s * 0.24, -s * 0.22);
      ctx.rotate(-0.55);

      // Handle
      ctx.fillStyle = "#c29b63";
      ctx.fillRect(-s * 0.02, -s * 0.05, s * 0.04, s * 0.32);

      // Ferrule
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(-s * 0.025, -s * 0.09, s * 0.05, s * 0.04);

      // Bristles with paint tip
      ctx.fillStyle = "#2abcb5";
      ctx.beginPath();
      ctx.moveTo(-s * 0.025, -s * 0.09);
      ctx.lineTo(0, -s * 0.19);
      ctx.lineTo(s * 0.025, -s * 0.09);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
  },
  magnifier: {
    id: "magnifier",
    label: "Magnifying Glass",
    category: "held",
    draw: (ctx, s) => {
      ctx.save();
      ctx.translate(s * 0.24, -s * 0.26);
      ctx.rotate(0.35);

      // Handle
      ctx.fillStyle = "#8a5828";
      ctx.fillRect(-s * 0.02, s * 0.08, s * 0.04, s * 0.22);

      // Rim
      ctx.strokeStyle = "#ffd166";
      ctx.fillStyle = "rgba(216, 239, 236, 0.3)";
      ctx.lineWidth = s * 0.03;
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
  },
};

export const allItemIds = Object.keys(itemDefinitions) as ItemId[];
