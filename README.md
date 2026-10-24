# KinetiCanvas

> Create characters. Direct the motion. Export everywhere.

KinetiCanvas is a local-first character animation studio for the web, desktop, and AI agent automation. Create and customize original companion mascots, animate them with interactive motion presets, attach task cues, generate procedural audio, preview every change in real time, and export directly to PNG, SVG, WebM video, React code, or portable `.kineti` project packages.

![KinetiCanvas six-character reference](Kipi-pet-run/six-character-task-and-sound-reference.png)

## Core Capabilities

- **6 Signature Companions:** Each with distinct visual morphology, unique powers, working styles, and audio profiles.
- **Interactive Canvas & Inspector:** Position, scale, rotation, and appearance controls with live visual transforms.
- **6 Motion States:** Idle (subtle breathing), Walk (bouncing stride), Think (floating idea bubbles), Work (animated tool execution), Review (scanning aura), and Sleep (peaceful resting).
- **Task Cues:** Generic, configurable cues for Analytics (↗), Browser (🌐 Chrome), Design (🎨 Canva/Figma), Music (🎵), Terminal (💻 Code), and Document (📄).
- **Procedural Web Audio Engine:** Synthesizes character power tones and cue chimes directly in the browser with zero external dependencies.
- **Multi-Format Export Engine:**
  - **PNG Snapshot:** High-resolution image export with transparent or canvas background.
  - **Standalone Vector SVG:** Infinitely scalable vector artwork for web, Figma, or design tools.
  - **Animated WebM Video:** In-browser canvas recording for presentations, chat, and demos.
  - **Portable `.kineti` Manifest:** Complete portable JSON project format for cross-platform sharing.
  - **React JSX Code:** Instant component code export to drop directly into React applications.
- **Local MCP Server:** Connect AI agents (Antigravity, Claude Code, Codex) to programmatically direct animations, scenes, and exports.
- **Command-Line Interface (CLI):** Manage projects, inspect scenes, and validate project manifests via `kineti`.
- **Local-First Privacy:** Runs 100% offline; no mandatory accounts or cloud dependencies.

---

## The Six Companions: Individual Powers & Profiles

Every companion in KinetiCanvas is crafted with an individual power matrix, personality, and signature working style grounded in the reference artwork:

| Companion | Archetype & Species | Signature Powers | Working Style & Visual Elements | Audio Signature |
| :--- | :--- | :--- | :--- | :--- |
| **Pomo** | **Mind & Strategy**<br>*(Sprout Blob)* | • Mind Bubble Matrix<br>• Zen Focus & Ideation Shield<br>• Clustering & Organization | Calm contemplation, floating idea bubbles, dome teal plush silhouette with coral pom-pom antenna and ivory belly. | 432 Hz Meditative bubble pop (Sine wave) |
| **Fynn** | **Design & Aesthetics**<br>*(Plush Fox)* | • Chromatic Realization<br>• Vector Transmutation<br>• Design Intelligence | Dynamic brushstrokes, color layering, Canva/Figma design styling, pointed fox ears with coral inner fur, chest ruff, palette & brush. | 587 Hz Creative woodblock & canvas brush chime (Triangle wave) |
| **Olli** | **Intelligence & Analytics**<br>*(Feathered Owl)* | • Predictive Telemetry<br>• Multi-Metric Synthesis<br>• Clairvoyant Audit | Methodical observation, telemetry scanning, mint owl silhouette, scalloped chest feathers, peach-coral wings, rising 3D bar chart. | 659 Hz Crystal glass data chime (Sine wave) |
| **Nixi** | **Exploration & Systems**<br>*(Coral-Gilled Axolotl)* | • Web Teleportation<br>• API Deep-Diving<br>• Playful Resiliency | Joyful exploration, rapid browser traversal (Chrome & web apps), 6 branching coral external gill frills, retro handheld console. | 523 Hz 8-bit retro arcade blip (Square wave) |
| **Ember** | **Architecture & Music**<br>*(Teal Baby Dragon)* | • Code Ignition<br>• Harmonic Audio Synthesis<br>• Tenacious Resilience | Energetic construction, compiling scalable builds, ivory horns, coral dorsal crest & dragon wings, floating musical notes. | 440 Hz Warm analog synth power chord (Sawtooth wave) |
| **Kipi** | **Orchestration & Multi-Agent**<br>*(Cosmic Plush Maker)* | • Agent Telepathy (Codex/Claude/Antigravity)<br>• Audio Spectrum Equalization<br>• Omni-Tool Synthesis | Universal multi-agent orchestration, hooded plush maker, glowing coral spherical antenna, floppy ears, equalizer waveform. | 880 Hz High-tech frequency sweep & agent chirp (Sine wave) |

---

## Quickstart & Local Studio

### 1. Install Dependencies
```bash
git clone https://github.com/Vishwajeetsrk/KinetiCanvas.git
cd KinetiCanvas
pnpm install
```

### 2. Launch KinetiCanvas Studio
```bash
pnpm --filter @kineticanvas/studio dev
```
Open **[http://127.0.0.1:4173/](http://127.0.0.1:4173/)** in your browser.

- Select any of the 6 companions to view their powers and working styles.
- Switch motions: **Walk**, **Think**, **Work**, **Review**, **Sleep**.
- Add task cues: **Analytics**, **Browser**, **Design**, **Music**, **Terminal**, **Doc**.
- Adjust **Transform** sliders (Position X/Y, Scale, Rotation) in real time.
- Click **Export Everywhere ▾** to export PNG, SVG, WebM video, React code, or `.kineti` project JSON.

### 3. Run Automated Tests
```bash
pnpm test
pnpm check
```
Runs the full automated test suite across `@kineticanvas/core`, `@kineticanvas/mcp`, and `@kineticanvas/cli`.

---

## Command Line Interface (`kineti`)

Manage and validate projects directly from your terminal:

```bash
# List all 6 companions and their individual powers
pnpm cli list

# Create a new local .kineti project
pnpm cli new "My Animation Scene"

# Validate a project file
pnpm cli validate "my-animation-scene.kineti.json"
```

---

## Local MCP Server (`@kineticanvas/mcp`)

KinetiCanvas includes a Model Context Protocol (MCP) server so AI agents such as **Google Antigravity**, **Claude Code**, and **Codex** can direct scenes programmatically:

```bash
pnpm mcp
```

### Available Tools:
- `kineticanvas_list_characters`: Returns all 6 companions with archetypes, powers, and visual specs.
- `kineticanvas_get_character`: Fetches deep character profile, powers, and audio specs.
- `kineticanvas_create_project`: Initializes a `.kineti` project manifest.
- `kineticanvas_add_scene`: Appends a timeline scene.
- `kineticanvas_add_task_cue`: Attaches task cues (analytics, browser, design, music, terminal, doc).

---

## GitHub Releases & Multi-Platform Packaging

The repository includes a GitHub Actions release pipeline (`.github/workflows/release.yml`).

To trigger an official release with multi-platform packages (Web bundle, CLI, MCP tools, and Checksums):

```bash
git tag v0.1.0
git push origin v0.1.0
```

The workflow will run verification tests, build the studio production bundle, generate SHA256 checksums, and publish the release to GitHub automatically under [Releases](https://github.com/Vishwajeetsrk/KinetiCanvas/releases).

---

## Repository Structure

```text
.
├── .github/workflows/release.yml # Multi-platform automated release workflow
├── apps/
│   └── studio/                   # React/Vite interactive studio editor
│       ├── src/components/       # High-fidelity SVG companion avatars & animators
│       ├── src/audio/            # Web Audio procedural synthesizer engine
│       ├── src/export/           # PNG, SVG, WebM, and React code export engine
│       └── src/main.jsx          # Main studio workspace & timeline interface
├── packages/
│   ├── core/                     # Tested project model & companion catalog
│   ├── mcp/                      # Local Model Context Protocol (MCP) server
│   └── cli/                      # Command-line interface (`kineti`)
├── docs/
│   ├── STUDIO_DEMO.md            # Interactive walkthrough guide
│   ├── ARCHITECTURE.md           # Architecture specifications
│   ├── BRAND_REFERENCE.md        # Ember & companion visual criteria
│   └── ROADMAP.md                # Product milestones
└── Kipi-pet-run/                 # Original six-character reference artwork
```

## Local-First Privacy Guarantee

- 100% offline-first execution with local file storage.
- No mandatory accounts, telemetry, or remote API requirements.
- Safe, non-destructive file operations.

## License

Reserved to contributors. All character designs and concept artwork are protected.
