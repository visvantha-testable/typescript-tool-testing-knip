import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ErrorFlowMetrics } from "../types/knipTypes.js";
import { applyPlatformFixup } from "./platformFixup.js";

const VITEST_FORMULA =
  "Exception paths exercised via Vitest runtime tests; branch coverage from @vitest/coverage-v8 on errorFlow.ts";

export function exportVitestBundle(
  root: string,
  base: Record<string, unknown>,
  metrics: ErrorFlowMetrics,
): void {
  const fixed = applyPlatformFixup({ ...base }, metrics, {
    tool: "Vitest + @vitest/coverage-v8",
    nativeField: "vitest_native",
    formula: VITEST_FORMULA,
  });

  const dashboard = {
    tool: "Vitest + @vitest/coverage-v8",
    strategy: "Control Flow Testing",
    classification: "Path Coverage",
    metrics: fixed.metrics,
    platform_scores: fixed.platform_scores,
  };

  const files: Record<string, unknown> = {
    "vitest.json": fixed,
    "vitest_metrics.json": {
      tool: "Vitest + @vitest/coverage-v8",
      ...metrics,
      dashboard_export: dashboard,
    },
  };

  for (const [name, payload] of Object.entries(files)) {
    writeFileSync(join(root, name), `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  }

  mkdirSync(join(root, "platform"), { recursive: true });
  mkdirSync(join(root, "artifacts", "training"), { recursive: true });
  for (const [name, payload] of Object.entries(files)) {
    writeFileSync(join(root, "platform", name), `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  }
  writeFileSync(
    join(root, "artifacts", "training", "vitest.json"),
    `${JSON.stringify(fixed, null, 2)}\n`,
    "utf-8",
  );
}
