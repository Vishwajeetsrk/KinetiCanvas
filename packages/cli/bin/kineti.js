#!/usr/bin/env node
import { runCli } from "../src/cli.js";

const code = runCli(process.argv.slice(2));
if (code !== 0 && typeof code === "number") {
  process.exit(code);
}
