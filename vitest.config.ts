import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["sample_subject/tests/**/*.test.ts", "tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["sample_subject/src/**/*.ts"],
      exclude: ["sample_subject/src/index.ts"],
      reporter: ["json-summary", "json", "lcov", "html"],
      reportsDirectory: "artifacts/training/coverage",
      all: true,
    },
  },
});
