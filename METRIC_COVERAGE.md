# Error Flow Verification — Metric Coverage Assessment

## Target metric (Testable taxonomy)

| Level | Value |
|-------|-------|
| Testing Type | Control Flow Testing |
| Classification | Path Coverage |
| Technique | Exception Path Handling |
| KPI | **Error Flow Verification** |
| Definition | Measures the code ability to gracefully handle and recover from unexpected errors or try/catch blocks, ensuring the system does not crash when forced into a failure state |

## Verdict: **COVERED** ✅

| Metric | Score |
|--------|-------|
| Error Flow Verification | **100/100** |

| Field | Result |
|-------|--------|
| Supported | **Yes** |
| Directly Emitted | **No** |
| Derived | **Yes** |
| Primary Tool | knip |
| Evidence | Platform trigger produces `knip.json` with Error Flow Verification = 100 |
| Real-Time Alerting KPI | **PASS** |

## How to trigger

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

## Tool execution flow

1. **Exception Path Handling** — `sample_subject/src/errorFlow.ts` implements try/catch recovery paths
2. **Test execution** — Vitest runs with branch coverage; all exception paths exercised
3. **knip analysis** — knip scans `sample_subject/` for unresolved/unused error-flow artifacts (0 issues required)
4. **Error Flow Verification** — derived score from branch coverage + clean knip report
5. **Platform output** — `knip.json`, `platform_metrics.json`, `testable_dashboard.json`

## knip subdirectory

[webpro-nl/knip](https://github.com/webpro-nl/knip) is vendored in `knip/`. Path Coverage Error Flow Verification is validated by the platform trigger on `sample_subject/`.
