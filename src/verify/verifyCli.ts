import { readFileSync, existsSync } from "node:fs";
import { verifyKnipJson } from "./verifyKnipJson.js";

const jsonPath = process.argv.includes("--json")
  ? process.argv[process.argv.indexOf("--json") + 1]
  : "knip.json";

if (!existsSync(jsonPath)) {
  console.error(`FAIL: ${jsonPath} not found`);
  process.exit(1);
}

const data = JSON.parse(readFileSync(jsonPath, "utf-8")) as Record<string, unknown>;
process.exit(verifyKnipJson(jsonPath, data));
