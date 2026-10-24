# Contributing to KinetiCanvas

KinetiCanvas is beginning as a local-first creative tool. The main goal is to keep every meaningful edit visible, editable, reversible, and exportable.

## Before you begin

1. Read the [PRD](KINETICANVAS_PRD.md) and pick a roadmap milestone.
2. Open an issue or write a short implementation note for work that changes project format, assets, export behavior, or agent permissions.
3. Keep pull requests narrow: one feature, fix, asset package, or documentation improvement at a time.

## Design principles

- Local-first: projects work without an account or cloud connection.
- Editable by default: generated previews never replace source assets.
- Fast feedback: users should preview before exporting.
- Portable projects: `.kineti` packages contain a documented manifest and explicit assets.
- Safe agent operation: agents act only on explicitly opened projects and visible user intent.
- Inclusive controls: keyboard access, reduced-motion support, and accessible names are required.

## Change requirements

- Add or update tests for changed behavior.
- Include visual baselines for changed built-in motions or starter characters.
- Run the relevant validation commands once application packages exist.
- Do not commit generated videos, previews, local databases, credentials, or third-party source assets without permission.
- Record the origin and license of every bundled visual and audio asset.

## Commit style

Use short imperative commits, for example:

```text
feat(timeline): add loop-region controls
fix(export): preserve alpha in GIF frames
docs(mcp): clarify explicit export-path rule
test(asset): cover missing motion manifests
```

## Pull request checklist

- [ ] Product and accessibility behavior are described.
- [ ] Tests and visual baselines are included where needed.
- [ ] Performance impact is noted for renderer or export work.
- [ ] Asset sources and licenses are documented.
- [ ] Agent/MCP permission impact is described.
- [ ] No secret, personal, or generated large binary file was added unintentionally.
