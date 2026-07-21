import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ErrorFlowMetrics } from "../types/knipTypes.js";
import { applyPlatformFixup } from "./platformFixup.js";

export function exportPlatformBundle(
  root: string,
  base: Record<string, unknown>,
  metrics: ErrorFlowMetrics,
): void {
  const fixed = applyPlatformFixup({ ...base }, metrics);
  const dashboard = {
    tool: "knip",
    strategy: "Control Flow Testing",
    classification: "Path Coverage",
    metrics: fixed.metrics,
    platform_scores: fixed.platform_scores,
  };

  const files: Record<string, unknown> = {
    "knip.json": fixed,
    "knip_report.json": {
      tool: "knip",
      status: fixed.status,
      totals: fixed.totals,
      metrics: fixed.metrics,
      knip_report: fixed.knip_report,
    },
    "knip_metrics.json": { ...metrics, dashboard_export: dashboard },
    "metrics.json": {
      tool: "knip",
      "Error Flow Verification": fixed["Error Flow Verification"],
      "Exception Path Handling": fixed["Exception Path Handling"],
    },
    "platform_metrics.json": fixed.platform_metrics,
    "testable_dashboard.json": dashboard,
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
    join(root, "artifacts", "training", "knip.json"),
    `${JSON.stringify(fixed, null, 2)}\n`,
    "utf-8",
  );
}
