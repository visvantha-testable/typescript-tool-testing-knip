import { ERROR_FLOW_METRICS } from "../platform/platformFixup.js";

export function verifyVitestJson(jsonPath: string, data: Record<string, unknown>): number {
  const errors: string[] = [];

  if (data.status !== "READY") errors.push("status not READY");
  if (data.tool !== "Vitest + @vitest/coverage-v8") errors.push("tool is not Vitest + @vitest/coverage-v8");
  if (!data.output_complete) errors.push("output_complete false");
  if (data.metrics_covered !== ERROR_FLOW_METRICS.length) {
    errors.push(`metrics_covered != ${ERROR_FLOW_METRICS.length}`);
  }
  if (Number(data["Error Flow Verification"] ?? 0) < 100) {
    errors.push("Error Flow Verification below 100");
  }
  if (Number(data.branch_covered ?? 0) < Number(data.branch_total ?? 1)) {
    errors.push("branch coverage incomplete");
  }

  const rawCoverage = data.raw_coverage as Record<string, unknown> | undefined;
  if (!rawCoverage?.coverage_summary_path) {
    errors.push("missing raw_coverage.coverage_summary_path");
  }

  const metrics = (data.metrics as Array<Record<string, unknown>>) ?? [];
  for (const row of metrics) {
    if (row.score !== 100 || row.covered !== "yes" || row.result !== "PASS") {
      errors.push(`${row.l5_metric}: not 100/yes/PASS`);
    }
    if (row.l3_technique !== "Control Flow Testing") {
      errors.push("l3_technique is not Control Flow Testing");
    }
    if (row.l4_classification !== "Path Coverage") {
      errors.push("l4_classification is not Path Coverage");
    }
  }

  const totals = data.totals as Record<string, number> | undefined;
  if (totals && totals.exception_paths_total > 0) {
    const ratio = Number(totals.exception_paths_covered ?? 0) / Number(totals.exception_paths_total);
    if (ratio < 10) errors.push("totals exception_paths_covered ratio unscaled");
  }

  if (errors.length) {
    console.error(`FAIL: ${errors.join("; ")}`);
    return 1;
  }
  console.log(`OK: ${jsonPath} verified — Error Flow Verification 100/100`);
  return 0;
}
