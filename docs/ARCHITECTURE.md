# Architecture

## Product boundary

KinetiCanvas has one shared scene model and two delivery surfaces: a browser-based progressive web app and a Tauri desktop app. Both use the same React interface, timeline model, asset contract, and export validation rules.

## Project model

Every scene is represented by an explicit JSON manifest. A desktop project is a directory; a portable `.kineti` export is a zip package of that directory.

```text
project/
  project.json
  assets/
  characters/
  audio/
  thumbnails/
  history/
  exports/
```

`project.json` stores scene dimensions, layers, timeline tracks, keyframes, cues, audio settings, asset links, export settings, and schema version. It must never contain credentials.

## Execution model

1. The editor changes project state through undoable commands.
2. The renderer reads the project state and produces an interactive preview.
3. Export jobs use an immutable project snapshot.
4. Completed jobs write artifacts only to an explicit project-relative or user-selected export folder.
5. The app records output metadata and validation results without mutating editable source assets.

## Major modules

| Module | Responsibility |
| --- | --- |
| `editor` | Canvas, layer tree, inspector, selection, keyboard controls. |
| `timeline` | Tracks, keyframes, easing, markers, motion presets, undoable commands. |
| `assets` | Character packages, cue packages, source/license metadata, thumbnails. |
| `renderer` | Preview composition and frame rendering. |
| `audio` | Browser preview, track timing, fades, and final mix inputs. |
| `exporter` | PNG, SVG, GIF, video, project, code, and sprite-sheet export. |
| `storage` | Desktop SQLite/filesystem and browser IndexedDB adapters. |
| `mcp` | Loopback-only MCP server and command permission checks. |
| `cli` | Non-interactive local operations for supported agent environments. |

## Desktop and web differences

The desktop app can access user-approved folders and local native media tools. The browser app stores work in IndexedDB until download/import and may offer fewer video codecs depending on the browser. Both must preserve the same portable project format.
