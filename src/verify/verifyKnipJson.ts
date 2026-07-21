import { ERROR_FLOW_METRICS } from "../platform/platformFixup.js";

export function verifyKnipJson(jsonPath: string, data: Record<string, unknown>): number {
  const errors: string[] = [];

  if (data.status !== "READY") errors.push("status not READY");
  if (!data.output_complete) errors.push("output_complete false");
  if (data.metrics_covered !== ERROR_FLOW_METRICS.length) {
    errors.push(`metrics_covered != ${ERROR_FLOW_METRICS.length}`);
  }
  if (Number(data["Error Flow Verification"] ?? 0) < 100) {
    errors.push("Error Flow Verification below 100");
  }
  if (Number(data.knip_issue_count ?? 0) > 0) {
    errors.push("knip_issue_count > 0");
  }

  const metrics = (data.metrics as Array<Record<string, unknown>>) ?? [];
  for (const row of metrics) {
    if (row.score !== 100 || row.covered !== "yes" || row.result !== "PASS") {
      errors.push(`${row.l5_metric}: not 100/yes/PASS`);
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
