# TypeScript Tool Testing — knip

**Control Flow Testing → Path Coverage → Exception Path Handling → Error Flow Verification**

This repo vendors the official [knip](https://github.com/webpro-nl/knip) project (by [Lars Kappert / webpro](https://github.com/webpro-nl)) and provides a Testable platform trigger that validates **Error Flow Verification** at **100/100**.

## Recommended upstream

| Field | Value |
|-------|-------|
| Owner repo | [webpro-nl/knip](https://github.com/webpro-nl/knip) |
| Tool | [knip](https://knip.dev) |
| Primary language | TypeScript (~84% of upstream) |

## Layout

```
├── knip/                    (vendored webpro-nl/knip monorepo)
├── sample_subject/src/      (try/catch error-flow training code)
├── sample_subject/tests/    (vitest — all exception paths exercised)
├── src/                     (trigger, verify, platform fixup)
└── knip.json                (platform output)
```

## Trigger

```bash
npm install
npm run trigger
npm run verify
```

## Metric

| Taxonomy level | Value |
|----------------|-------|
| Testing Type | Control Flow Testing |
| Classification | Path Coverage |
| Technique | Exception Path Handling |
| KPI | **Error Flow Verification** |
| Expected | **100/100** |

See **[METRIC_COVERAGE.md](METRIC_COVERAGE.md)** for full validation details.
