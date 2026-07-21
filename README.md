# TypeScript Tool Testing — knip + Vitest

**Control Flow Testing → Path Coverage → Exception Path Handling → Error Flow Verification**

This repo vendors the official [knip](https://github.com/webpro-nl/knip) project (by [Lars Kappert / webpro](https://github.com/webpro-nl)) and provides Testable platform triggers that validate **Error Flow Verification** at **100/100** using either **Knip** or **Vitest + @vitest/coverage-v8**.

## Recommended upstream

| Field | Value |
|-------|-------|
| Owner repo | [webpro-nl/knip](https://github.com/webpro-nl/knip) |
| Tool | [knip](https://knip.dev) / [Vitest](https://vitest.dev) |
| Primary language | TypeScript (~84% of upstream) |

## Layout

```
├── knip/                    (vendored webpro-nl/knip monorepo)
├── sample_subject/src/      (try/catch error-flow training code)
├── sample_subject/tests/    (vitest — all exception paths exercised)
├── src/                     (trigger, verify, platform fixup)
├── knip.json                (platform output — knip trigger)
└── vitest.json              (platform output — vitest trigger)
```

## Trigger with Vitest + @vitest/coverage-v8

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

Raw coverage artifacts are written to `artifacts/training/coverage/`:

- `coverage-summary.json`
- `coverage-final.json`
- `lcov.info`
- `index.html`

## Trigger with Knip

```bash
npm install
npm run trigger
npm run verify
```

## Metric

| Taxonomy level | Value |
|----------------|-------|
| Technique | Control Flow Testing |
| Classification | Path Coverage |
| Metric | Exception Path Handling |
| KPI | **Error Flow Verification** |
| Expected | **100/100** |

See **[METRIC_COVERAGE.md](METRIC_COVERAGE.md)** for full validation details.
