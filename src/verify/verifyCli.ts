import { existsSync, readFileSync } from "node:fs";
import { verifyKnipJson } from "./verifyKnipJson.js";
import { verifyVitestJson } from "./verifyVitestJson.js";

const jsonPath = process.argv.includes("--json")
  ? process.argv[process.argv.indexOf("--json") + 1]
  : "knip.json";

const tool = process.argv.includes("--tool")
  ? process.argv[process.argv.indexOf("--tool") + 1]
  : jsonPath.includes("vitest") ? "vitest" : "knip";

if (!existsSync(jsonPath)) {
  console.error(`FAIL: ${jsonPath} not found`);
  process.exit(1);
}

const data = JSON.parse(readFileSync(jsonPath, "utf-8")) as Record<string, unknown>;
const code =
  tool === "vitest" ? verifyVitestJson(jsonPath, data) : verifyKnipJson(jsonPath, data);
process.exit(code);
