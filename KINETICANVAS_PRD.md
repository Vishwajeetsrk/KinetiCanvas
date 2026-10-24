# KinetiCanvas PRD

## Product

**Name:** KinetiCanvas  
**Tagline:** Create characters. Direct the motion. Export everywhere.  
**Product type:** Local-first character animation studio for web and desktop.

KinetiCanvas lets people create a custom animated companion or mascot from a sketch, image, GIF, video, website, or Figma reference; edit it on a visual canvas; add motion, task cues, sound, and music; preview the result; and export it as reusable media or code. It will run as a browser app and as native desktop apps for Windows, macOS, and Linux.

The first built-in library contains six plush companions. Users can begin with one of these, remix it, or create an original character from their own references.

## Why This Exists

Animation tools often make users choose between fast templates and detailed editing. KinetiCanvas combines both:

- Start from a character, task, or reference instead of a blank canvas.
- Use presets for common motions, then edit the timing, layers, pose, app cue, and audio.
- Keep project files on the user's device by default.
- Give coding agents a safe, documented way to prepare scenes, generate exports, and show previews without taking over the editing experience.

## Product Goals

1. Create a polished, editable short animation in under five minutes from a starter character or reference.
2. Keep every scene editable after generation or import.
3. Support usable outputs for social posts, product demos, websites, presentations, and ChatGPT Pet sprite sheets.
4. Run smoothly on everyday Windows and Mac laptops, with a capable browser version.
5. Work offline after installation for editing, preview, local projects, and installed assets.
6. Let Codex, Claude Code, Antigravity, and compatible agents operate through the same local project API.

## Non-Goals For Version 1

- Cloud collaboration, shared workspaces, accounts, and remote storage.
- A full 3D modeling or rigging package.
- Automatic control of Chrome, Canva, Figma, or another installed application.
- Unlicensed copying of logos, artwork, music, or characters from a reference.

## Target Users

- Creators who need animated mascot content without learning a complex animation suite.
- Designers who want quickly editable motion studies, product walkthroughs, or presentation visuals.
- Developers and agent users who need structured animation projects and repeatable exports.
- Teams that want a local-first asset library before they introduce cloud collaboration.

## Platforms And Delivery

| Surface | Version 1 behavior |
| --- | --- |
| Web | Progressive web app. Runs in Chrome, Edge, Safari, and Firefox. Projects live in browser storage and can be exported or imported as project files. |
| Windows | Installable desktop application with local file access and hardware-accelerated preview. |
| macOS | Installable Apple Silicon and Intel desktop builds with local file access and hardware-accelerated preview. |
| Linux | Installable desktop build where the desktop runtime supports it. |
| Local API | A loopback-only MCP server and CLI that operate on explicit project directories. |

## The Core Experience

### 1. Create or import a character

The user chooses one of the six built-in companions or starts with a reference:

- Image: PNG, JPG, WebP, SVG.
- Video: MP4, WebM, MOV; use selected frames as visual reference.
- GIF: use selected frames as visual reference.
- Website: import a URL screenshot and its user-selected visual elements; do not copy protected brand material automatically.
- Figma: import user-selected frames, SVGs, and image exports through an authenticated adapter.

The app creates a non-destructive character record containing source references, palette, layers, expressions, tags, and editable motion-ready parts. Raster source artwork remains raster; SVG output is available only for vector-native or vectorized editable assets.

### 2. Build a scene on the canvas

The canvas has a stage, timeline, layer panel, asset panel, inspector, preview controls, and export panel. A user can drag a character, background, icon cue, text, chart, frame, sound effect, or music track into the scene.

### 3. Apply and edit motion

Motion presets create editable timeline keyframes. Users can adjust timing, position, scale, rotation, expression, cue visibility, audio volume, easing, and loop length.

Required presets:

- Idle: breathing, blink, soft sway.
- Walk left and right.
- Wave and greet.
- Think: small head tilt, eye movement, thought cue.
- Work: type, scan, tap, focused movement.
- Review: inspect, check, approve.
- Paint and design: brush or canvas task cue.
- Analyze: charts or data cue.
- Sleep: resting loop with calm audio option.
- Celebrate and recover from an error.

### 4. Add task and app cues

A cue is a small editable overlay tied to a timeline range. It can represent a generic browser, design canvas, analytics dashboard, music player, document, terminal, or workflow status. Cues support icon, label, color, animation, and sound effect.

Use generic symbols by default. Users may import their own licensed brand icons. A cue only visualizes a task; it does not claim to control or open the external app.

### 5. Preview and export

The preview always renders from the current project state. Export supports still images, animated media, editable source, and an optional validated Pet sprite sheet.

## Default Asset Library

The six initial built-in companions are editable starting points. Their source files must be versioned as reusable assets, not only as one flattened concept board.

| Name | Base form | Suggested role | Default motion personality |
| --- | --- | --- | --- |
| Kipi | Maker creature with antenna | Main creative assistant | Curious, energetic, focused |
| Pomo | Round blob | Gentle organizer | Calm, cheerful, steady |
| Fynn | Fox | Designer | Nimble, playful, precise |
| Olli | Owl | Analyst | Thoughtful, observant, methodical |
| Nixi | Axolotl | Explorer | Friendly, expressive, experimental |
| Ember | Small dragon | Builder | Bold, enthusiastic, resilient |

Each asset package contains:

- `character.json`: identity, palette, parts, expressions, accessibility name, licenses, tags.
- `source/`: editable SVG or layered raster source.
- `poses/`: base pose, expression variations, and approved state parts.
- `motions/`: keyframe presets for all supported states.
- `cues/`: generic task cue variants.
- `audio/`: optional original or properly licensed sound effects only.
- `previews/`: poster PNG, GIF loop, and MP4/WebM preview.
- `tests/`: visual baselines and motion assertions.

The current six-character visual board is a concept reference and can seed the library, but each character needs separate source art and motion assets before it is a production asset.

## Functional Requirements

### Character Editor

- Create, duplicate, rename, tag, archive, and delete locally stored characters.
- Adjust palette, body parts, expression, accessories, and task cues.
- Keep all edits non-destructive and undoable.
- Attach multiple references and retain their attribution and license notes.
- Preserve an editable source package alongside generated previews.

### Canvas And Timeline

- Multi-layer scenes with characters, backgrounds, shapes, text, cues, audio, and groups.
- Timeline tracks, markers, keyframes, loop region, frame stepping, and easing controls.
- Undo/redo for at least 100 local actions.
- Autosave local projects and recover the last consistent state after a restart.
- Preview at 24, 30, and 60 frames per second.
- Use keyboard shortcuts for playback, frame step, duplicate, delete, grouping, and export.

### Audio

- Import WAV, MP3, AAC, OGG, and M4A where supported by the platform.
- Trim, fade, loop, mute, and change volume per track.
- Synchronize sound effects to markers and animations.
- Include a small original, royalty-cleared starter sound pack: pop, chime, brush, tap, notification, and ambient sleep loop.
- Show source/license information for every bundled or imported audio item.

### Export

| Export | Requirement |
| --- | --- |
| PNG | Current frame or a transparent image sequence. |
| SVG | Vector-only scenes and vector-capable layers. Raster layers are embedded or rejected with a clear choice. |
| GIF | Short looping animation with user-selectable resolution and frame rate. |
| WebM | Browser-friendly video, optional audio. |
| MP4 | H.264 video with optional audio on desktop where codec support is installed. |
| Project package | A `.kineti` zip package containing `project.json`, copied local assets, and source metadata. |
| Code | A portable React animation component plus a JSON scene manifest. Exported code must have no secret values. |
| Sprite sheet | PNG atlas and JSON metadata. A ChatGPT Pet option validates the required grid before it can be used. |

### Local Project Model

Projects save in an explicit user-selected directory on desktop. Web projects save in browser storage until the user downloads a `.kineti` package.

```text
my-animation.kineti/
  project.json
  assets/
  characters/
  audio/
  exports/
  thumbnails/
  history/
```

`project.json` records scene state, references, timeline, export settings, and schema version. It must never store API keys or credentials.

## Agent, MCP, And Skill Requirements

### Local MCP Server

KinetiCanvas exposes a local-only MCP server after the user enables it. The server receives project paths explicitly and does not scan arbitrary user folders.

Required tools:

| Tool | Purpose |
| --- | --- |
| `list_projects` | List user-approved KinetiCanvas projects. |
| `open_project` | Open one project and return editable scene metadata. |
| `create_character` | Create a character record from user-provided references and settings. |
| `add_scene` | Add a scene with dimensions and duration. |
| `add_motion` | Apply an editable motion preset to a character layer. |
| `add_task_cue` | Add a generic or user-imported cue to a selected timeline range. |
| `add_audio` | Add an audio asset and timeline settings. |
| `render_preview` | Render a local preview and return its path. |
| `export_project` | Export an approved format to an explicit directory. |
| `validate_project` | Check asset links, schema, timeline, licenses, and export readiness. |

Actions that overwrite a project, remove assets, call a remote service, or export outside the open project directory require clear user confirmation in the client. Preview, inspection, and additive local edits can proceed without a separate confirmation.

### Skills

Ship these reusable skills with the project:

1. **create-character**: builds an editable character from user-owned or licensed references.
2. **animate-character**: creates or updates timeline motion while preserving character identity.
3. **build-task-scene**: creates a scene for design, painting, analytics, browser, document, terminal, or music work.
4. **add-soundtrack**: adds licensed audio, timing, fades, and loop behavior.
5. **export-animation**: validates and exports PNG, SVG, GIF, video, project package, code, or sprite sheet.
6. **validate-asset-library**: checks packages for missing references, broken layers, licenses, and motion baselines.
7. **create-pet-spritesheet**: creates and validates a Pets-compatible sprite sheet from supported motion states.

Each skill must state its inputs, created files, permissions, visual QA requirements, and rollback behavior.

### Compatible Agent Clients

The same MCP interface will work with Codex, Claude Code, Antigravity, and other MCP-compatible clients. Add a lightweight CLI for agent environments that cannot use MCP directly.

Example workflow: an agent creates a scene, applies `think` and `work` motions, adds an analytics cue and a chime, renders a preview, then presents that preview for user editing before final export.

## Recommended Technical Architecture

| Layer | Choice | Reason |
| --- | --- | --- |
| Shared UI | React + TypeScript | One component model for web and desktop. |
| Desktop shell | Tauri | Small native desktop package, local file access, Windows/macOS/Linux target. |
| Web delivery | PWA | Browser access with offline-capable local work. |
| Renderer | WebGL/Canvas scene renderer plus SVG layer support | Smooth interactive preview and editable vector assets. |
| Timeline | Internal JSON timeline model | Portable, agent-readable, stable across surfaces. |
| Video rendering | Remotion-compatible renderer and FFmpeg-backed desktop export | Deterministic preview and export pipeline. |
| Audio | Web Audio for preview; native renderer for final mix | Responsive editing and reliable media export. |
| Local data | SQLite on desktop; IndexedDB in web | Local-first persistence without accounts. |
| Project format | JSON manifest plus files | Easy backup, versioning, agent operations, and repair. |
| Agent interface | MCP server plus CLI | Works with multiple coding agents. |

## Performance Requirements

- Launch a typical local project in under 3 seconds on a modern laptop.
- Maintain at least 30 FPS while editing a 1080p scene with two characters, 20 visual layers, two audio tracks, and standard effects.
- Keep the editor responsive while previews or exports run in a background worker.
- Render a 10-second 1080p 30 FPS preview in under 30 seconds on the reference development machine.
- Avoid loading unused character and media assets until their scene needs them.
- Cache thumbnails and preview frames; invalidate cache when source inputs change.

## Accessibility Requirements

- Keyboard-operable canvas, timeline, inspector, and export flow.
- Text labels and accessible names for every icon, layer, and timeline track.
- Reduced-motion preview mode.
- Color-independent status indicators and contrast-compliant controls.
- Captions or transcript fields for exported audio/video where text is present.

## Privacy And Safety Requirements

- Local files remain local unless the user explicitly invokes an import/export or remote integration.
- No account is required for Version 1.
- Imported content stores origin, attribution, and license notes when the user provides them.
- Credentials stay in the operating system credential store, never project files or source control.
- MCP runs on loopback only and requires explicit user enablement.
- The app warns before replacing an existing export or external file.

## Testing And Quality Gates

### Automated Tests

| Test level | Coverage |
| --- | --- |
| Unit | Timeline interpolation, easing, project schema migrations, asset validation, cue placement, audio trim/fade calculations, and export option validation. |
| Component | Canvas controls, keyboard actions, layer inspector, timeline editing, undo/redo, and export dialogs. |
| Integration | Create character → animate → add cue/audio → preview → save → reopen → export. |
| MCP/CLI | Tool schema validation, explicit-path permissions, additive edits, failed actions, and confirmation boundaries. |
| Export | Compare rendered PNG/SVG/GIF/WebM/MP4 output against expected metadata, dimensions, duration, frame rate, alpha, and audio presence. |
| Visual regression | Screenshot and animation-frame comparison for each default character and motion preset. |
| Performance | Launch time, frame rate, memory use, and export duration against baseline scenes. |
| Security | No arbitrary file access from MCP, no credentials in project packages, input sanitization for SVG and imported media metadata. |

### Manual Acceptance Checklist

1. A user can create a local project without an account.
2. A user can start with Kipi or create a new character from an image reference.
3. A user can place a character on the canvas and edit a motion preset on the timeline.
4. A user can add a generic browser, design, analytics, or music cue and see it in preview.
5. A user can add an audio loop, adjust its timing, and mute it.
6. Closing and reopening the app restores the latest saved local project.
7. The project exports successfully as PNG, GIF, WebM, project package, and React/JSON code. SVG export is offered only when the scene supports it.
8. An MCP client can make additive scene changes, render a preview, and export only to an explicit user-approved path.
9. The six starter assets pass identity, motion, licensing, and accessibility checks.
10. A Pets-compatible sprite sheet passes its required preflight before upload is offered.

## Milestones

| Milestone | Deliverable |
| --- | --- |
| 0. Foundation | Repository, project schema, design tokens, local storage, asset package rules, test harness. |
| 1. Editor MVP | Canvas, layers, timeline, local save/open, Kipi starter character, idle/walk/think/work/sleep motions. |
| 2. Asset Library | Six editable starter characters, cues, reusable templates, preview assets, motion tests. |
| 3. Media | Audio editor, GIF/WebM/MP4/PNG exports, project packages, renderer worker. |
| 4. Agent Integration | MCP server, CLI, skill packages, preview and export tools. |
| 5. Import And Pets | Reference imports, Figma adapter, sprite-sheet exporter, quality gates. |
| 6. Cross-platform Release | Windows/macOS/Linux installers, PWA, accessibility/performance hardening, documentation. |

## Design Direction

The interface should feel like a friendly creative studio: clear, quick, and spacious. The six plush characters bring warmth, while the editing surfaces stay precise and professional. Use a dark or light theme, compact toolbars, a visually prominent preview, and always-visible timeline controls.

The default layout:

```text
Asset library | Canvas and live preview | Inspector
--------------+-------------------------+----------
              | Timeline, audio, cues, exports      
```

Default interactions prioritize direct manipulation: drag to stage, click to select, drag keyframes, press Space to preview, and use preset chips for the most common motions.

## Open Decisions For The Repository Kickoff

- Confirm the final name after a domain and trademark availability check.
- Choose whether the first release includes Linux installers or begins with Windows and macOS.
- Choose the licensed starter icon and audio packs.
- Decide whether AI-assisted asset generation is fully local, uses a user-provided API key, or is deferred.
- Provide the GitHub repository URL, desired visibility, and any branch or contribution rules.
