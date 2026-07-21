import { describe, expect, it } from "vitest";
import {
  AppValidationError,
  classifyError,
  nestedTryCatch,
  parseOrRethrow,
  recoverFromFailure,
  runWithFinally,
  simpleTryCatch,
  throwCustomError,
  withFallback,
} from "../src/exceptionSync.js";

describe("exceptionSync — Error Flow Verification runtime evidence", () => {
  it("simple try-catch: normal execution and exception caught", () => {
    expect(simpleTryCatch(5)).toBe(10);
    expect(simpleTryCatch(-1)).toBe(0);
  });

  it("nested try-catch: success, inner recovery, and outer recovery", () => {
    expect(nestedTryCatch(1, 1)).toBe("both-ok");
    expect(nestedTryCatch(1, 0)).toBe("inner-recovered");
    expect(nestedTryCatch(0, 1)).toBe("outer-recovered");
  });

  it("custom error: success path and custom error thrown", () => {
    expect(throwCustomError("hello")).toBe("HELLO");
    expect(() => throwCustomError("   ")).toThrow(AppValidationError);
  });

  it("fallback value: success path and fallback returned on failure", () => {
    expect(withFallback(() => 42, -1)).toBe(42);
    expect(
      withFallback(() => {
        throw new Error("boom");
      }, -1),
    ).toBe(-1);
  });

  it("error rethrow: valid parse, validation rethrow, and type rethrow", () => {
    expect(parseOrRethrow("12")).toBe(12);
    expect(() => parseOrRethrow("{")).toThrow(AppValidationError);
    expect(() => parseOrRethrow('"text"')).toThrow(TypeError);
  });

  it("finally block: executes on success and on failure", () => {
    expect(runWithFinally(false)).toEqual({ result: "success", finallyRan: true });
    expect(runWithFinally(true)).toEqual({ result: "caught", finallyRan: true });
  });

  it("multiple error conditions: validation, type, generic, and nested", () => {
    expect(classifyError(new AppValidationError("bad", "E1"))).toBe("validation:E1");
    expect(classifyError(new TypeError("nope"))).toBe("type-error");
    expect(classifyError(new Error("plain"))).toBe("generic:plain");
    expect(classifyError(null)).toBe("nested:unknown error shape");
    expect(classifyError(123)).toBe("nested:unknown error shape");
  });

  it("graceful recovery: succeeds on first attempt and after failures", () => {
    expect(recoverFromFailure([() => 5])).toEqual({
      recovered: true,
      value: 5,
      attempts: 1,
    });

    const result = recoverFromFailure([
      () => {
        throw new Error("first");
      },
      () => {
        throw new Error("second");
      },
      () => 99,
    ]);
    expect(result).toEqual({ recovered: true, value: 99, attempts: 3 });

    const exhausted = recoverFromFailure([
      () => {
        throw new Error("always");
      },
    ]);
    expect(exhausted.recovered).toBe(false);
    expect(exhausted.value).toBe(-1);
    expect(exhausted.attempts).toBe(1);
  });
});
