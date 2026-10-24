# Editor design brief

## Product character

KinetiCanvas is a friendly professional animation studio. It balances the warmth of the plush companion library with the clarity of a precise creative tool.

## Primary layout

```text
┌──────────────┬────────────────────────────────────────┬──────────────┐
│ Asset library│              Canvas / live preview       │ Inspector    │
│ Characters   │                                        │ Transform    │
│ Cues         │                                        │ Motion       │
│ Audio        │                                        │ Audio        │
├──────────────┴────────────────────────────────────────┴──────────────┤
│ Scene controls · timeline · layers · keyframes · audio · export      │
└─────────────────────────────────────────────────────────────────────┘
```

## Visual principles

- Put the live preview at the visual center of the app.
- Keep navigation and common actions obvious without covering the canvas.
- Use calm neutral surfaces with teal and coral reserved for selection, primary actions, and character-related feedback.
- Preserve a clear text label for every icon action.
- Offer light, dark, and reduced-motion modes.

## First screen to design

The first interactive screen is the project editor with the Friday analytics update example open. It proves the core loop: choose Olli, apply Analyze, edit a cue, preview, and export.

## Next visual decision

Before building the full editor UI, select the primary editor density: spacious creative studio, balanced professional editor, or compact power-user workspace. The project model and preview renderer can proceed independently.
