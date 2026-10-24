# Test plan

## Automated testing

| Area | Required coverage |
| --- | --- |
| Project model | JSON schema validation, migrations, import/export round trips, corruption recovery. |
| Timeline | Keyframes, easing, duration, looping, marker timing, undo/redo, preset application. |
| Canvas | Selection, layer ordering, transforms, keyboard control, cue placement, responsive sizing. |
| Audio | Trim, fade, loop, mute, volume, marker synchronization, invalid media handling. |
| Exports | Dimensions, duration, alpha, frame rate, audio inclusion, generated-file metadata. |
| Asset library | Package structure, source attribution, declared motions, accessibility fields, visual baselines. |
| MCP and CLI | Explicit-path policy, schema validation, additive edits, confirmation-required actions, error messages. |
| Performance | Editor frame rate, cold start, thumbnail cache, memory consumption, render duration. |
| Security | No arbitrary file access, no secret material in project packages, SVG and import sanitization. |

## Manual release checks

1. Create a project without an account.
2. Add one starter character and one user-created character.
3. Edit a timeline motion and immediately preview the change.
4. Add a browser/design/analytics/music cue and confirm it is editable.
5. Add an audio loop, fade it, mute it, and export with and without sound.
6. Close and reopen the project with no lost edits.
7. Export PNG, GIF, WebM, `.kineti`, and React/JSON code.
8. Verify SVG export explains any unsupported raster layers.
9. Use MCP to add a scene and render a preview without access beyond the approved project.
10. Verify all six starter assets on Windows, macOS, web, and Linux where released.

## Quality bars

- 30 FPS or higher on the reference 1080p editing scene.
- Typical local project opens in under 3 seconds on the reference machine.
- A ten-second 1080p, 30 FPS preview renders in under 30 seconds on the reference machine.
- No high-severity accessibility, security, data-loss, or export-corruption defect is open at release.
