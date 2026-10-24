import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { runCli } from "../src/cli.js";

test("CLI list command runs successfully", () => {
  const code = runCli(["list"]);
  assert.equal(code, 0);
});

test("CLI new creates a project file and validate checks it", () => {
  const testTitle = "CLI Automated Test Project";
  const expectedFile = "cli-automated-test-project.kineti.json";

  try {
    const newCode = runCli(["new", testTitle]);
    assert.equal(newCode, 0);
    assert.ok(fs.existsSync(expectedFile));

    const valCode = runCli(["validate", expectedFile]);
    assert.equal(valCode, 0);
  } finally {
    if (fs.existsSync(expectedFile)) {
      fs.unlinkSync(expectedFile);
    }
  }
});
