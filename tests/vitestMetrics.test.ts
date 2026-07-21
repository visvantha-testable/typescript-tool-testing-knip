import { describe, expect, it } from "vitest";
import { computeVitestMetrics } from "../src/metrics/vitestMetrics.js";
import type { CoverageSummary } from "../src/types/knipTypes.js";

const coverage: CoverageSummary = {
  total: {
    branches: { total: 29, covered: 29, pct: 100 },
  },
  "sample_subject/src/errorFlow.ts": {
    branches: { total: 29, covered: 29, pct: 100 },
  },
};

describe("vitestMetrics", () => {
  it("derives Error Flow Verification at 100/100 from branch coverage", () => {
    const metrics = computeVitestMetrics(coverage);
    expect(metrics.error_flow_verification_percent).toBe(100);
    expect(metrics.exception_paths_total).toBe(29);
    expect(metrics.exception_paths_covered).toBe(29);
    expect(metrics.try_catch_blocks).toBe(4);
  });
});
