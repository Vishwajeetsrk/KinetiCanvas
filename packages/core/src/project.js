/**
 * The portable project model shared by the browser, desktop app, CLI, and MCP
 * server. It intentionally uses plain JSON-compatible data so `.kineti`
 * projects can be inspected, versioned, and repaired without a running app.
 */

export const PROJECT_SCHEMA_VERSION = 1;

export const TASK_CUE_TYPES = Object.freeze([
  "analytics",
  "browser",
  "design",
  "document",
  "music",
  "notification",
  "terminal",
]);

export const EXPORT_FORMATS = Object.freeze([
  "gif",
  "mp4",
  "png",
  "project",
  "react-json",
  "sprite-sheet",
  "svg",
  "webm",
]);

const DEFAULT_FPS = 30;
const DEFAULT_SCENE_DURATION = 5;

function assertNonEmptyString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string`);
  }
}

function assertPositiveNumber(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new TypeError(`${field} must be a positive number`);
  }
}

function createId(prefix, providedId) {
  if (providedId !== undefined) {
    assertNonEmptyString(providedId, "id");
    return providedId;
  }

  return `${prefix}-${crypto.randomUUID()}`;
}

/** Create a new local-first project manifest. */
export function createProject({ id, title, createdAt = new Date().toISOString() }) {
  assertNonEmptyString(title, "title");
  assertNonEmptyString(createdAt, "createdAt");

  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: createId("project", id),
    title: title.trim(),
    createdAt,
    updatedAt: createdAt,
    scenes: [],
    assets: [],
    exports: [],
  };
}

/** Create a scene that can be added to a project. */
export function createScene({
  id,
  name,
  width = 1920,
  height = 1080,
  fps = DEFAULT_FPS,
  duration = DEFAULT_SCENE_DURATION,
}) {
  assertNonEmptyString(name, "name");
  assertPositiveNumber(width, "width");
  assertPositiveNumber(height, "height");
  assertPositiveNumber(fps, "fps");
  assertPositiveNumber(duration, "duration");

  return {
    id: createId("scene", id),
    name: name.trim(),
    width,
    height,
    fps,
    duration,
    layers: [],
    cues: [],
    audio: [],
  };
}

/** Add a scene without mutating the existing project manifest. */
export function addScene(project, scene, updatedAt = new Date().toISOString()) {
  const report = validateProject(project);
  if (!report.valid) {
    throw new TypeError(`Cannot add a scene to an invalid project: ${report.errors.join("; ")}`);
  }

  const sceneReport = validateScene(scene);
  if (!sceneReport.valid) {
    throw new TypeError(`Cannot add an invalid scene: ${sceneReport.errors.join("; ")}`);
  }

  if (project.scenes.some((item) => item.id === scene.id)) {
    throw new Error(`A scene named ${scene.id} already exists`);
  }

  return {
    ...project,
    updatedAt,
    scenes: [...project.scenes, scene],
  };
}

/** Create an editable generic task cue. */
export function createTaskCue({ id, type, start, duration, label = null }) {
  if (!TASK_CUE_TYPES.includes(type)) {
    throw new TypeError(`type must be one of: ${TASK_CUE_TYPES.join(", ")}`);
  }
  assertPositiveNumber(duration, "duration");
  if (typeof start !== "number" || !Number.isFinite(start) || start < 0) {
    throw new TypeError("start must be a zero or positive number");
  }
  if (label !== null && typeof label !== "string") {
    throw new TypeError("label must be a string or null");
  }

  return {
    id: createId("cue", id),
    type,
    label: label?.trim() || null,
    start,
    duration,
    source: "built-in",
  };
}

/** Add a cue if it fits inside the selected scene. */
export function addTaskCue(scene, cue) {
  const sceneReport = validateScene(scene);
  if (!sceneReport.valid) {
    throw new TypeError(`Cannot add a cue to an invalid scene: ${sceneReport.errors.join("; ")}`);
  }
  if (cue.start + cue.duration > scene.duration) {
    throw new RangeError("Task cue must fit inside the scene duration");
  }
  if (scene.cues.some((item) => item.id === cue.id)) {
    throw new Error(`A cue named ${cue.id} already exists`);
  }

  return {
    ...scene,
    cues: [...scene.cues, cue],
  };
}

/** Validate a scene and return all detected structural errors. */
export function validateScene(scene) {
  const errors = [];
  if (!scene || typeof scene !== "object") {
    return { valid: false, errors: ["scene must be an object"] };
  }

  for (const key of ["id", "name"]) {
    if (typeof scene[key] !== "string" || scene[key].trim() === "") {
      errors.push(`scene.${key} must be a non-empty string`);
    }
  }

  for (const key of ["width", "height", "fps", "duration"]) {
    if (typeof scene[key] !== "number" || !Number.isFinite(scene[key]) || scene[key] <= 0) {
      errors.push(`scene.${key} must be a positive number`);
    }
  }

  if (!Array.isArray(scene.layers)) errors.push("scene.layers must be an array");
  if (!Array.isArray(scene.cues)) errors.push("scene.cues must be an array");
  if (!Array.isArray(scene.audio)) errors.push("scene.audio must be an array");

  return { valid: errors.length === 0, errors };
}

/** Validate a portable KinetiCanvas project manifest. */
export function validateProject(project) {
  const errors = [];
  if (!project || typeof project !== "object") {
    return { valid: false, errors: ["project must be an object"] };
  }
  if (project.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${PROJECT_SCHEMA_VERSION}`);
  }
  for (const key of ["id", "title", "createdAt", "updatedAt"]) {
    if (typeof project[key] !== "string" || project[key].trim() === "") {
      errors.push(`${key} must be a non-empty string`);
    }
  }
  for (const key of ["scenes", "assets", "exports"]) {
    if (!Array.isArray(project[key])) errors.push(`${key} must be an array`);
  }
  if (Array.isArray(project.scenes)) {
    const ids = new Set();
    for (const scene of project.scenes) {
      const report = validateScene(scene);
      errors.push(...report.errors.map((error) => `${scene?.id ?? "unknown"}: ${error}`));
      if (scene?.id && ids.has(scene.id)) errors.push(`duplicate scene id: ${scene.id}`);
      if (scene?.id) ids.add(scene.id);
    }
  }

  return { valid: errors.length === 0, errors };
}
