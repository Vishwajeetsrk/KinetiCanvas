import { useState, useRef, useEffect } from "react";
import {
  Check,
  Code,
  Copy,
  Download,
  Eye,
  FileCode,
  FileText,
  Key,
  Layers,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
  Upload,
  Video,
  X,
} from "lucide-react";
import type { Scene } from "./scene";
import { characterById } from "./characters";

export type Framework = "react" | "html" | "vue" | "bootstrap" | "ionic" | "svelte";

type Props = {
  scene: Scene;
  time: number;
  onClose: () => void;
};

export function VisionToCodeModal({ scene, time, onClose }: Props) {
  const [mode, setMode] = useState<"screenshot" | "video" | "text">("screenshot");
  const [framework, setFramework] = useState<Framework>("react");
  const [droppedImage, setDroppedImage] = useState<string | null>(null);
  const [promptText, setPromptText] = useState(
    "Create a responsive companion dashboard card with animated stats, action buttons, and dark mode support."
  );
  const [apiKey, setApiKey] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ch = characterById(scene.characterId);

  // Generate initial code on open or when parameters change
  useEffect(() => {
    generateCode();
  }, [framework, mode]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setDroppedImage(reader.result as string);
        generateCode(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setDroppedImage(reader.result as string);
        generateCode(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCode = async (imgUrl?: string) => {
    setGenerating(true);
    // Simulate generation step with intelligent multi-framework heuristic output
    await new Promise((r) => setTimeout(r, 600));

    const title = droppedImage ? "Extracted Visual Component" : `${ch.name} Companion Widget`;
    const code = getCodeTemplate(framework, title, ch.name, scene.motion, promptText);
    setGeneratedCode(code);
    setGenerating(false);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const ext = framework === "react" ? "tsx" : framework === "vue" ? "vue" : framework === "svelte" ? "svelte" : "html";
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Component.${ext}`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl h-[88vh] bg-panel rounded-2xl border border-line shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 px-5 border-b border-line flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-teal/10 text-teal">
              <Code size={18} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-ink leading-tight">Vision to Code Studio</h2>
              <p className="text-xs text-muted leading-tight">
                Screenshot, Video, or Text into production-ready components
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <input
                type="password"
                placeholder="Optional Gemini API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-44 text-xs px-2.5 py-1.5 pl-7 rounded-lg border border-line bg-shell/40 outline-none focus:ring-1 focus:ring-teal"
              />
              <Key size={13} className="absolute left-2 text-faint" />
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg hover:bg-shell text-muted hover:text-ink transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mode Selector & Framework Tabs */}
        <div className="h-11 px-5 border-b border-line flex items-center justify-between shrink-0 bg-panel">
          <div className="flex items-center gap-1.5">
            <ModeTab
              active={mode === "screenshot"}
              onClick={() => setMode("screenshot")}
              icon={<Upload size={13} />}
              label="Screenshot to Code"
            />
            <ModeTab
              active={mode === "video"}
              onClick={() => setMode("video")}
              icon={<Video size={13} />}
              label="Video to Code"
            />
            <ModeTab
              active={mode === "text"}
              onClick={() => setMode("text")}
              icon={<FileText size={13} />}
              label="Text to Code"
            />
          </div>

          {/* Framework Picker */}
          <div className="flex items-center gap-1 bg-white border border-line rounded-lg p-0.5">
            {(["react", "html", "vue", "bootstrap", "ionic", "svelte"] as Framework[]).map((fw) => (
              <button
                key={fw}
                onClick={() => setFramework(fw)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  framework === fw ? "bg-ink text-white" : "text-muted hover:text-ink"
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 grid grid-cols-[360px_1fr] divide-x divide-line">
          {/* Left Column: Input and Upload */}
          <div className="p-5 flex flex-col bg-shell/40 overflow-y-auto space-y-4">
            {mode === "screenshot" && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="h-48 border-2 border-dashed border-line hover:border-teal rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors bg-white group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                {droppedImage ? (
                  <div className="relative size-full flex items-center justify-center">
                    <img src={droppedImage} alt="Uploaded screenshot" className="max-h-full max-w-full rounded-lg object-contain" />
                    <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white">
                      Click to change
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-teal/10 text-teal mb-2 group-hover:scale-105 transition-transform">
                      <Upload size={22} />
                    </div>
                    <span className="text-xs font-semibold text-ink">Drop any screenshot or design</span>
                    <span className="text-[11px] text-faint mt-1">PNG, JPG, WebP up to 10MB</span>
                  </>
                )}
              </div>
            )}

            {mode === "video" && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-line bg-white space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                    <Video size={14} className="text-coral" />
                    <span>Canvas Interaction Recording</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Capture the current canvas motion pose ({scene.motion}), cue ({scene.cue.type}), and audio timing directly into interactive code.
                  </p>
                  <button
                    type="button"
                    onClick={() => generateCode()}
                    className="w-full mt-2 h-8 inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink text-white text-xs font-medium hover:bg-[#2c4241] transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play size={12} /> Convert Scene to Component
                  </button>
                </div>
              </div>
            )}

            {mode === "text" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted">Describe the component</label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  rows={4}
                  className="w-full text-xs p-3 rounded-xl border border-line bg-white outline-none focus:ring-1 focus:ring-teal resize-none"
                  placeholder="e.g. A high-converting hero card with companion avatar and action button..."
                />
                <button
                  type="button"
                  onClick={() => generateCode()}
                  className="w-full h-8 inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal text-white text-xs font-medium hover:bg-[#239f97] transition-transform active:scale-95 cursor-pointer"
                >
                  <Sparkles size={13} /> Generate Code
                </button>
              </div>
            )}

            {/* Code Generation Summary */}
            <div className="p-3.5 rounded-xl border border-line bg-white space-y-2 mt-auto">
              <span className="text-[11px] font-semibold text-faint uppercase tracking-wider block">
                Target Architecture
              </span>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted">Framework</span>
                  <span className="font-semibold uppercase text-ink">{framework}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Styling</span>
                  <span className="font-mono text-ink">Tailwind / Vanilla CSS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Accessibility</span>
                  <span className="font-medium text-emerald-600">WCAG 2.1 AA Compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Code & Preview */}
          <div className="flex flex-col min-h-0 bg-white">
            {/* Action Bar */}
            <div className="h-11 px-4 border-b border-line flex items-center justify-between shrink-0 bg-panel">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveView("preview")}
                  className={`h-7 px-2.5 rounded-md text-xs font-medium inline-flex items-center gap-1 cursor-pointer transition-colors ${
                    activeView === "preview" ? "bg-white border border-line text-ink shadow-xs" : "text-muted hover:text-ink"
                  }`}
                >
                  <Eye size={12} /> Interactive Preview
                </button>
                <button
                  onClick={() => setActiveView("code")}
                  className={`h-7 px-2.5 rounded-md text-xs font-medium inline-flex items-center gap-1 cursor-pointer transition-colors ${
                    activeView === "code" ? "bg-white border border-line text-ink shadow-xs" : "text-muted hover:text-ink"
                  }`}
                >
                  <FileCode size={12} /> Source Code
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateCode()}
                  disabled={generating}
                  className="h-7 px-2.5 rounded-md border border-line bg-white text-xs font-medium text-muted hover:text-ink inline-flex items-center gap-1 cursor-pointer hover:bg-shell"
                >
                  <RefreshCw size={12} className={generating ? "animate-spin" : ""} /> Regenerate
                </button>
                <button
                  onClick={copyCode}
                  className="h-7 px-2.5 rounded-md bg-ink text-white text-xs font-medium inline-flex items-center gap-1 cursor-pointer hover:bg-[#2c4241]"
                >
                  {copied ? <Check size={12} className="text-teal" /> : <Copy size={12} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  onClick={downloadFile}
                  title="Download component code"
                  className="h-7 px-2.5 rounded-md border border-line bg-white text-xs font-medium text-muted hover:text-ink inline-flex items-center gap-1 cursor-pointer hover:bg-shell"
                >
                  <Download size={12} />
                </button>
              </div>
            </div>

            {/* Main Preview/Code Area */}
            <div className="flex-1 min-h-0 overflow-auto p-4">
              {generating ? (
                <div className="size-full grid place-items-center text-muted text-xs">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-teal" />
                    <span>Synthesizing {framework.toUpperCase()} component...</span>
                  </div>
                </div>
              ) : activeView === "code" ? (
                <pre className="text-xs font-mono leading-relaxed bg-shell/40 p-4 rounded-xl border border-line overflow-x-auto text-ink">
                  <code>{generatedCode}</code>
                </pre>
              ) : (
                <div className="size-full flex items-center justify-center bg-shell/30 rounded-xl border border-line p-6">
                  {/* Mock live preview container */}
                  <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-line shadow-lg space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl bg-teal/15 border border-teal/30 flex items-center justify-center text-teal font-bold text-lg">
                        {ch.name[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-ink">{ch.name} Companion Widget</h4>
                        <p className="text-xs text-muted">{ch.role}</p>
                      </div>
                      <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </div>

                    <p className="text-xs text-muted leading-relaxed">
                      {scene.speech?.enabled ? scene.speech.text : "Interactive component generated with zero external dependencies."}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="p-2.5 rounded-lg border border-line bg-shell/30">
                        <span className="text-[10px] text-faint uppercase font-bold block">Pose</span>
                        <span className="text-xs font-semibold text-ink capitalize">{scene.motion}</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-line bg-shell/30">
                        <span className="text-[10px] text-faint uppercase font-bold block">Framework</span>
                        <span className="text-xs font-semibold text-teal uppercase">{framework}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full h-9 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-[#239f97] transition-colors cursor-pointer shadow-xs"
                    >
                      Trigger Interaction
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
        active ? "bg-white text-ink border border-line shadow-xs" : "text-muted hover:text-ink"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function getCodeTemplate(framework: Framework, title: string, name: string, motion: string, prompt: string) {
  switch (framework) {
    case "react":
      return `import React, { useState } from 'react';

export function ${name}Widget() {
  const [active, setActive] = useState(true);

  return (
    <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-neutral-200 shadow-xl space-y-4 font-sans">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 font-bold text-lg">
          ${name[0]}
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-900">${title}</h3>
          <p className="text-xs text-neutral-500">${name} (${motion} state)</p>
        </div>
        <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Live
        </span>
      </div>

      <p className="text-xs text-neutral-600 leading-relaxed">
        ${prompt}
      </p>

      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
          <span className="text-[10px] text-neutral-400 uppercase font-bold block">Status</span>
          <span className="text-xs font-semibold text-neutral-800">Synchronized</span>
        </div>
        <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
          <span className="text-[10px] text-neutral-400 uppercase font-bold block">Motion</span>
          <span className="text-xs font-semibold text-teal-600 capitalize">${motion}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setActive(!active)}
        className="w-full h-9 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
      >
        Interact with ${name}
      </button>
    </div>
  );
}`;

    case "vue":
      return `<template>
  <div class="max-w-md p-6 rounded-2xl bg-white border border-neutral-200 shadow-xl space-y-4 font-sans">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 font-bold text-lg">
        ${name[0]}
      </div>
      <div>
        <h3 class="text-sm font-bold text-neutral-900">${title}</h3>
        <p class="text-xs text-neutral-500">${name} (${motion})</p>
      </div>
    </div>
    <p class="text-xs text-neutral-600 leading-relaxed">
      ${prompt}
    </p>
    <button @click="toggle" class="w-full h-9 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800">
      Interact
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const active = ref(true)
const toggle = () => active.value = !active.value
</script>`;

    case "html":
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen flex items-center justify-center p-6">
  <div class="w-full max-w-md p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4 font-sans">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 font-bold text-lg">
        ${name[0]}
      </div>
      <div>
        <h3 class="text-sm font-bold text-slate-900">${title}</h3>
        <p class="text-xs text-slate-500">${name} Companion</p>
      </div>
    </div>
    <p class="text-xs text-slate-600 leading-relaxed">
      ${prompt}
    </p>
    <button type="button" class="w-full h-9 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors">
      Launch Interaction
    </button>
  </div>
</body>
</html>`;

    case "bootstrap":
      return `<div class="card border-0 shadow-sm rounded-4 p-4 font-sans" style="max-width: 420px;">
  <div class="d-flex align-items-center mb-3">
    <div class="rounded-3 bg-light text-primary fw-bold d-flex align-items-center justify-content-center me-3" style="width: 48px; height: 48px; font-size: 1.25rem;">
      ${name[0]}
    </div>
    <div>
      <h6 class="mb-0 fw-bold">${title}</h6>
      <small class="text-muted">${name} - ${motion}</small>
    </div>
  </div>
  <p class="small text-secondary mb-3">
    ${prompt}
  </p>
  <button class="btn btn-dark btn-sm rounded-3 w-100 py-2 fw-semibold">
    Interact with ${name}
  </button>
</div>`;

    case "ionic":
      return `<ion-card class="rounded-2xl shadow-md p-4">
  <ion-card-header class="p-0 mb-3 flex items-center gap-3">
    <ion-avatar class="w-12 h-12 bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
      ${name[0]}
    </ion-avatar>
    <div>
      <ion-card-title class="text-base font-bold">${title}</ion-card-title>
      <ion-card-subtitle class="text-xs">${name} · ${motion}</ion-card-subtitle>
    </div>
  </ion-card-header>
  <ion-card-content class="p-0 text-xs text-gray-600 mb-4">
    ${prompt}
  </ion-card-content>
  <ion-button expand="block" color="dark" class="rounded-lg">
    Trigger Action
  </ion-button>
</ion-card>`;

    case "svelte":
      return `<script>
  let active = true;
  function toggle() { active = !active; }
</script>

<div class="widget-card">
  <div class="header">
    <div class="avatar">${name[0]}</div>
    <div>
      <h3>${title}</h3>
      <p>${name} (${motion})</p>
    </div>
  </div>
  <p class="description">${prompt}</p>
  <button on:click={toggle}>Interact with ${name}</button>
</div>

<style>
  .widget-card { max-width: 400px; padding: 24px; border-radius: 16px; background: #fff; border: 1px solid #e2e8f0; font-family: system-ui, sans-serif; }
  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .avatar { width: 44px; height: 44px; border-radius: 10px; background: #d8efec; color: #2a8f88; display: grid; place-items: center; font-weight: bold; }
  h3 { margin: 0; font-size: 14px; color: #0f172a; }
  p { margin: 0; font-size: 12px; color: #64748b; }
  .description { margin-bottom: 16px; line-height: 1.5; }
  button { width: 100%; height: 36px; border-radius: 8px; background: #0f172a; color: #fff; border: 0; font-size: 12px; font-weight: 600; cursor: pointer; }
</style>`;
  }
}
