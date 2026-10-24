import test from "node:test";
import assert from "node:assert/strict";

import {
  addScene,
  addTaskCue,
  createProject,
  createScene,
  createTaskCue,
  validateProject,
} from "../src/project.js";

test("creates a valid portable project", () => {
  const project = createProject({
    id: "project-friday-update",
    title: "Friday analytics update",
    createdAt: "2026-10-24T00:00:00.000Z",
  });

  assert.deepEqual(validateProject(project), { valid: true, errors: [] });
  assert.equal(project.schemaVersion, 1);
  assert.equal(project.scenes.length, 0);
});

test("adds a scene and task cue without mutating the original project", () => {
  const original = createProject({ id: "project-demo", title: "Demo", createdAt: "2026-10-24T00:00:00.000Z" });
  const scene = createScene({ id: "scene-main", name: "Main scene", duration: 5 });
  const withCue = addTaskCue(
    scene,
    createTaskCue({ id: "cue-analytics", type: "analytics", start: 1, duration: 4 }),
  );
  const updated = addScene(original, withCue, "2026-10-24T01:00:00.000Z");

  assert.equal(original.scenes.length, 0);
  assert.equal(updated.scenes.length, 1);
  assert.equal(updated.scenes[0].cues[0].type, "analytics");
  assert.deepEqual(validateProject(updated), { valid: true, errors: [] });
});

test("rejects a task cue that exceeds scene duration", () => {
  const scene = createScene({ id: "scene-short", name: "Short", duration: 2 });
  const cue = createTaskCue({ id: "cue-long", type: "music", start: 1, duration: 2 });

  assert.throws(() => addTaskCue(scene, cue), /fit inside the scene duration/);
});

test("reports a duplicate scene id", () => {
  const project = createProject({ id: "project-duplicate", title: "Duplicate", createdAt: "2026-10-24T00:00:00.000Z" });
  const scene = createScene({ id: "scene-shared", name: "One" });
  const invalid = { ...project, scenes: [scene, { ...scene, name: "Two" }] };

  assert.equal(validateProject(invalid).valid, false);
  assert.match(validateProject(invalid).errors.join("\n"), /duplicate scene id/);
});
