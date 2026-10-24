# Reusable asset library

## Asset package contract

Every bundled character is a self-contained, editable package. A character must never be represented solely by a flattened preview image.

```text
characters/kipi/
  character.json
  source/
  poses/
  motions/
  cues/
  audio/
  previews/
  tests/
```

`character.json` includes the character name, palette, part inventory, expression list, supported motions, accessible name, source attribution, license, and package version.

## Motion requirements

All starter characters need an approved version of the following editable motions:

- Idle
- Walk left
- Walk right
- Wave
- Think
- Work
- Review
- Paint/design
- Analyze
- Sleep
- Celebrate
- Error/recover

Motion presets must expose timing and easing controls. The motion should animate the character's body or attached parts, with task cues stored as separate editable layers.

## Cues

Starter cues use generic symbols: browser, design canvas, chart, document, terminal, notification, music, and task-complete. Users can import their own licensed brand icons. Cues carry accessibility names and may include an optional original sound effect.

## Asset quality checklist

- The editable source and rendered preview match visually.
- Every asset has an origin and license note.
- Each character has an accessible name and contrast-safe palette variant.
- At least one motion preview exists for every required state.
- No preview has broken alpha, unexpected cropping, detached effects, or audio clipping.
- Asset changes update visual regression baselines.
