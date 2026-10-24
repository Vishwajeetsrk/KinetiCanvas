import test from "node:test";
import assert from "node:assert/strict";

import { handleToolCall, TOOLS } from "../src/server.js";

test("MCP server exposes all tools in contract", () => {
  const toolNames = TOOLS.map((t) => t.name);
  assert.ok(toolNames.includes("kineticanvas_list_characters"));
  assert.ok(toolNames.includes("kineticanvas_get_character"));
  assert.ok(toolNames.includes("kineticanvas_create_project"));
  assert.ok(toolNames.includes("kineticanvas_add_scene"));
  assert.ok(toolNames.includes("kineticanvas_add_task_cue"));
});

test("MCP tool calls execute properly", () => {
  const listResult = handleToolCall("kineticanvas_list_characters", {});
  assert.equal(listResult.characters.length, 6);

  const charResult = handleToolCall("kineticanvas_get_character", { characterId: "fynn" });
  assert.equal(charResult.name, "Fynn");
  assert.equal(charResult.role, "Designer & Painter");
  assert.ok(charResult.powers.length >= 3);

  const project = handleToolCall("kineticanvas_create_project", { title: "Test Project" });
  assert.equal(project.title, "Test Project");
  assert.equal(project.scenes.length, 0);

  const withScene = handleToolCall("kineticanvas_add_scene", { project, name: "Intro", duration: 5 });
  assert.equal(withScene.scenes.length, 1);
});
