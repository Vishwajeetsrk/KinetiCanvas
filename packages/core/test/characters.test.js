import test from "node:test";
import assert from "node:assert/strict";

import { CHARACTERS, getCharacterById, listCharacterIds } from "../src/characters.js";

test("exports all six individual companions with powers and profiles", () => {
  const ids = listCharacterIds();
  assert.equal(ids.length, 6);
  assert.deepEqual(ids, ["pomo", "fynn", "olli", "nixi", "ember", "kipi"]);

  for (const char of CHARACTERS) {
    assert.ok(char.id, "has id");
    assert.ok(char.name, "has name");
    assert.ok(char.title, "has title");
    assert.ok(char.role, "has role");
    assert.ok(char.powers.length >= 3, "has at least 3 unique powers");
    assert.ok(char.workingStyle, "has workingStyle");
    assert.ok(char.visual.baseColor, "has base color");
    assert.ok(char.soundProfile.freq > 0, "has sound profile");
    assert.ok(char.supportedMotions.includes("Idle"));
    assert.ok(char.supportedMotions.includes("Walk"));
    assert.ok(char.supportedMotions.includes("Think"));
    assert.ok(char.supportedMotions.includes("Work"));
    assert.ok(char.supportedMotions.includes("Sleep"));
  }
});

test("retrieves character by id", () => {
  const ember = getCharacterById("ember");
  assert.ok(ember);
  assert.equal(ember.name, "Ember");
  assert.equal(ember.species, "Teal Baby Dragon");
  assert.equal(ember.visual.hornColor, "#f8f3df");

  const unknown = getCharacterById("nonexistent");
  assert.equal(unknown, undefined);
});
