import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildBaseOutput,
  computeMetrics,
  runCoverage,
  runKnip,
} from "./metrics/knipMetrics.js";
import { exportPlatformBundle } from "./platform/exportPlatformBundle.js";
import { verifyKnipJson } from "./verify/verifyKnipJson.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = join(ROOT, "knip.json");

export async function runTrigger(skipVerify = false): Promise<number> {
  console.log("Starting knip platform trigger (Error Flow Verification)");
  mkdirSync(join(ROOT, "artifacts", "training"), { recursive: true });

  const knipReport = runKnip(ROOT);
  const coverage = runCoverage(ROOT);
  const metrics = computeMetrics(knipReport, coverage);
  const base = buildBaseOutput(metrics, knipReport);

  exportPlatformBundle(ROOT, base, metrics);
  console.log(`Wrote ${OUTPUT}`);

  if (!skipVerify) {
    const data = JSON.parse(readFileSync(OUTPUT, "utf-8")) as Record<string, unknown>;
    const code = verifyKnipJson(OUTPUT, data);
    if (code !== 0) return code;
  }

  const final = JSON.parse(readFileSync(OUTPUT, "utf-8")) as {
    metrics: Array<{ score: number; covered: string }>;
  };
  const ok = final.metrics.every((m) => m.score === 100 && m.covered === "yes");
  console.log(`\nTRIGGER COMPLETE: knip.json — Error Flow Verification 100/100=${ok}`);
  return ok ? 0 : 1;
}

const skip = process.argv.includes("--skip-verify");
runTrigger(skip).then((code) => process.exit(code));
