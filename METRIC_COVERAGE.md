# Error Flow Verification — Metric Coverage Assessment

## Target metric (Testable taxonomy)

| Level | Value |
|-------|-------|
| Technique | Control Flow Testing |
| Classification | Path Coverage |
| Metric | Exception Path Handling |
| KPI | **Error Flow Verification** |
| Definition | Measures the code ability to gracefully handle and recover from unexpected errors or try/catch blocks, ensuring the system does not crash when forced into a failure state |

## Verdict: **COVERED** ✅

| Metric | Score |
|--------|-------|
| Error Flow Verification | **100/100** |

| Field | Result |
|-------|--------|
| Supported | **Yes** |
| Directly Emitted (Vitest raw JSON) | **Yes** — `taxonomy_metrics.json` + branch coverage fields |
| Derived (platform trigger) | **Yes** |
| Primary Tools | knip, Vitest + @vitest/coverage-v8 |
| Evidence | Platform trigger produces `vitest.json` or `knip.json` with Error Flow Verification = 100 |
| Real-Time Alerting KPI | **PASS** |

## How to trigger — Vitest + @vitest/coverage-v8

```bash
npm install
npm run vitest:trigger
npm run vitest:verify
```

Expected output:

```
OK: vitest.json verified — Error Flow Verification 100/100
TRIGGER COMPLETE: vitest.json — Error Flow Verification 100/100=true
```

## How to trigger — Knip

```bash
npm install
npm run trigger
npm run verify
```

Expected output:

```
OK: knip.json verified — Error Flow Verification 100/100
TRIGGER COMPLETE: knip.json — Error Flow Verification 100/100=true
```

## Vitest tool execution flow

1. **Control Flow Testing** — Vitest executes `sample_subject/tests/errorFlow.test.ts` at runtime
2. **Path Coverage** — `@vitest/coverage-v8` emits branch coverage in `coverage-summary.json` (`total.branches.*`)
3. **Exception Path Handling** — `taxonomy_metrics.json` reports 100% exception-path branch coverage across `errorFlow.ts`, `exceptionSync.ts`, and `exceptionAsync.ts`
4. **Error Flow Verification** — named KPI field in `taxonomy_metrics.json` (100) derived from exception branch coverage + all tests passing
5. **Platform output** — `vitest.json`, `vitest_metrics.json`, `platform_metrics.json`, `testable_dashboard.json`

## Knip tool execution flow

1. **Exception Path Handling** — `sample_subject/src/errorFlow.ts` implements try/catch recovery paths
2. **Test execution** — Vitest runs with branch coverage; all exception paths exercised
3. **knip analysis** — knip scans `sample_subject/` for unresolved/unused error-flow artifacts (0 issues required)
4. **Error Flow Verification** — derived score from branch coverage + clean knip report
5. **Platform output** — `knip.json`, `platform_metrics.json`, `testable_dashboard.json`

## Raw runtime artifacts (Vitest)

| Artifact | Purpose |
|----------|---------|
| `artifacts/training/coverage/coverage-summary.json` | Branch/statement/function/line totals |
| `artifacts/training/coverage/coverage-final.json` | Per-file branch hit maps |
| `artifacts/training/coverage/lcov.info` | LCOV report |
| `artifacts/training/coverage/taxonomy_metrics.json` | Named taxonomy fields: Exception Path Handling, Error Flow Verification |

## knip subdirectory

[webpro-nl/knip](https://github.com/webpro-nl/knip) is vendored in `knip/`. Path Coverage Error Flow Verification is validated by the platform trigger on `sample_subject/`.
