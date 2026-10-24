# KinetiCanvas agent instructions

## Product boundaries

- KinetiCanvas is local-first. Do not add a cloud dependency or account requirement without an explicit product decision.
- Keep every project readable as `project.json` plus explicit local assets.
- Generated previews never replace editable sources.
- Agent integrations operate only on explicitly opened projects and user-approved export destinations.
- Do not embed credentials, API keys, personal file paths, or unlicensed assets in projects, examples, tests, or exports.

## Commands

```bash
pnpm test
pnpm check
```

## Implementation expectations

- Write or update a test for core project-model changes.
- Preserve backward compatibility or document a project migration.
- Add accessibility labels and reduced-motion behavior for new editor controls.
- Make export and filesystem operations explicit, cancellable, and non-destructive.
- Keep built-in task cues generic unless a user supplies a licensed brand asset.
