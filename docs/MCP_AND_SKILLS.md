# MCP and skills

## Purpose

KinetiCanvas integrates with Codex, Claude Code, Antigravity, and other compatible clients through a local MCP server. Agents help prepare projects and previews, while the user remains in control of editing and final exports.

## MCP boundary

- The server is disabled by default.
- It listens only on the local machine.
- Each operation receives an explicit project path.
- It cannot scan arbitrary folders.
- It cannot overwrite, delete, or export outside an approved destination without confirmation in the KinetiCanvas client.
- Secrets are never read from or written to project files.

## Planned tools

| Tool | Result |
| --- | --- |
| `list_projects` | Lists user-approved projects. |
| `open_project` | Returns project and scene metadata. |
| `create_character` | Adds an editable character from user-provided references. |
| `add_scene` | Adds a scene with dimensions and duration. |
| `add_motion` | Adds an editable motion preset to a character layer. |
| `add_task_cue` | Adds an icon or status cue to a timeline range. |
| `add_audio` | Adds a local audio track and timing settings. |
| `render_preview` | Produces a preview artifact for review. |
| `validate_project` | Checks schema, assets, licenses, timeline, and exports. |
| `export_project` | Runs a confirmed export to an explicit location. |

## Skills shipped with KinetiCanvas

1. `create-character`
2. `animate-character`
3. `build-task-scene`
4. `add-soundtrack`
5. `export-animation`
6. `validate-asset-library`
7. `create-pet-spritesheet`

Each skill will document its input assets, user-visible changes, resulting artifacts, validation commands, permissions, and recovery behavior.
