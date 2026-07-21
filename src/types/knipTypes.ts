export interface CoverageSummary {
  total?: {
    branches?: { total: number; covered: number; pct?: number };
    lines?: { total: number; covered: number; pct?: number };
    statements?: { total: number; covered: number; pct?: number };
    functions?: { total: number; covered: number; pct?: number };
  };
  [filePath: string]:
    | {
        branches?: { total: number; covered: number; pct?: number };
        lines?: { total: number; covered: number; pct?: number };
      }
    | CoverageSummary["total"]
    | undefined;
}

export interface KnipIssueCounts {
  files: number;
  dependencies: number;
  devDependencies: number;
  optionalPeerDependencies: number;
  unlisted: number;
  binaries: number;
  unresolved: number;
  exports: number;
  types: number;
  enumMembers: number;
  duplicates: number;
  catalog: number;
}

export interface KnipRawReport {
  counts?: KnipIssueCounts;
  issues?: Record<string, unknown>;
}

export interface ErrorFlowMetrics {
  exception_paths_total: number;
  exception_paths_covered: number;
  error_flow_verification_percent: number;
  branch_total: number;
  branch_covered: number;
  knip_issue_count: number;
  knip_files_analyzed: number;
  try_catch_blocks: number;
  recovery_paths_verified: number;
}
