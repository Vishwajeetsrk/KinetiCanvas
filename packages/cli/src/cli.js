import {
  createProject,
  createScene,
  addScene,
  validateProject,
  CHARACTERS,
  getCharacterById,
} from "@kineticanvas/core";
import fs from "node:fs";
import path from "node:path";

export function runCli(args = process.argv.slice(2)) {
  const [cmd, ...subArgs] = args;

  switch (cmd) {
    case "list":
    case "characters":
      console.log("\nKinetiCanvas Companions:\n");
      for (const char of CHARACTERS) {
        console.log(`• ${char.name} (${char.role}) - ${char.species}`);
        console.log(`  Archetype: ${char.archetype}`);
        console.log(`  Working Style: ${char.workingStyle}`);
        console.log(`  Powers:`);
        for (const power of char.powers) {
          console.log(`    - ${power}`);
        }
        console.log("");
      }
      return 0;

    case "new": {
      const title = subArgs[0] || "New Animation Project";
      const project = createProject({ title });
      const scene = createScene({ name: "Scene 01", duration: 5 });
      const fullProject = addScene(project, scene);
      const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.kineti.json`;
      fs.writeFileSync(filename, JSON.stringify(fullProject, null, 2), "utf8");
      console.log(`Created new KinetiCanvas project: ${filename}`);
      return 0;
    }

    case "validate": {
      const filePath = subArgs[0];
      if (!filePath) {
        console.error("Usage: kineti validate <path-to-project.json>");
        return 1;
      }
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        const json = JSON.parse(raw);
        const report = validateProject(json);
        if (report.valid) {
          console.log(`✓ Project "${json.title}" is valid!`);
          return 0;
        } else {
          console.error(`✕ Validation errors found:\n${report.errors.join("\n")}`);
          return 1;
        }
      } catch (err) {
        console.error(`Error reading file: ${err.message}`);
        return 1;
      }
    }

    case "version":
    case "-v":
    case "--version":
      console.log("kineti v0.1.0");
      return 0;

    case "help":
    case "-h":
    case "--help":
    default:
      console.log(`
KinetiCanvas CLI (kineti)

Usage:
  kineti list                      List all 6 companion characters and their powers
  kineti new <title>               Create a new portable .kineti.json project
  kineti validate <file.json>      Validate project manifest structure
  kineti version                   Show version
  kineti help                      Show this help message
`);
      return 0;
  }
}
