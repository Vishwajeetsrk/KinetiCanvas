# Studio demo guide

The current KinetiCanvas Studio is a local browser demo of the editor workflow. It runs entirely on your computer and does not require an account or cloud service.

## Start the demo

```bash
pnpm install
pnpm --filter @kineticanvas/studio dev
```

Open the local address printed by Vite, usually `http://127.0.0.1:4173`.

## Interface map

| Area | Use it for | Current behavior |
| --- | --- | --- |
| Character library, left | Select one of six starting companions | Changes the active character in the canvas, inspector, and timeline. |
| Task cues, left | Choose a generic browser, design, analytics, document, terminal, or music cue | Select a cue, then press **Add selected cue** to place it in the demo scene. |
| Canvas, center | See the live scene | Shows the selected companion, its chosen motion label, task cue, and time. |
| Inspector, right | Choose a motion preset | Select Idle, Walk, Think, Work, Review, or Sleep. |
| Timeline, bottom | Preview and edit demo timing | Play or pause, return to the start, add a visible keyframe, and add or remove the demo audio track. |
| Download project, top right | Preserve the current demo state | Downloads a new editable `*.kineti.json` file. It never overwrites the browser's working project. |

## Five-minute editing demo

1. In **Characters**, select **Ember**.
2. In **Motion**, select **Think** or **Work**.
3. In **Task cues**, select **design**, then press **Add selected cue**.
4. Start playback with the play button and press **Keyframe** at the desired time. A diamond marker appears on Ember's track.
5. Toggle **Add audio** to show or hide the Chime track.
6. Press **Download project** to save the demo's project and editor state locally.

## Current limits

The demo presents the editor interaction model. It does not yet provide object dragging, source-art editing, audio playback or trimming, GIF/video rendering, `.kineti` packaging, reference import, MCP, CLI, desktop packaging, or cloud sharing. Those capabilities are scheduled in the roadmap.

## Release and installer rule

GitHub Releases remain empty until the project produces and verifies signed installer artifacts. The planned release set is Windows, macOS, Linux, the PWA, CLI packages, and local MCP distribution. A release must include checksums, installation instructions, supported-platform notes, and a smoke-test report.
