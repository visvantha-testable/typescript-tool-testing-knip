/**
 * Synchronous exception-path scenarios for Error Flow Verification.
 * Covers: simple try-catch, nested try-catch, custom errors, fallback,
 * rethrow, finally, multiple error conditions, graceful recovery.
 */

export class AppValidationError extends Error {
  readonly code: string;

  constructor(message: string, code = "VALIDATION_ERROR") {
    super(message);
    this.name = "AppValidationError";
    this.code = code;
  }
}

/** 1. Simple try-catch */
export function simpleTryCatch(value: number): number {
  try {
    if (value < 0) {
      throw new Error("negative value");
    }
    return value * 2;
  } catch {
    return 0;
  }
}

/** 2. Nested try-catch */
export function nestedTryCatch(outer: number, inner: number): string {
  try {
    if (outer === 0) {
      throw new Error("outer failure");
    }
    try {
      if (inner === 0) {
        throw new Error("inner failure");
      }
      return "both-ok";
    } catch {
      return "inner-recovered";
    }
  } catch {
    return "outer-recovered";
  }
}

/** 5. Custom Error class */
export function throwCustomError(input: string): string {
  if (input.trim().length === 0) {
    throw new AppValidationError("input must not be empty");
  }
  return input.toUpperCase();
}

/** 6. Fallback value handling */
export function withFallback<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

/** 7. Error rethrow */
export function parseOrRethrow(raw: string): number {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "number") {
      throw new TypeError("expected number");
    }
    return parsed;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new AppValidationError("invalid json", "PARSE_ERROR");
    }
    throw err;
  }
}

export type FinallyAudit = { result: string; finallyRan: boolean };

/** 8. Finally block execution */
export function runWithFinally(shouldFail: boolean): FinallyAudit {
  let finallyRan = false;
  let result: FinallyAudit["result"] = "success";
  try {
    if (shouldFail) {
      throw new Error("forced failure");
    }
  } catch {
    result = "caught";
  } finally {
    finallyRan = true;
  }
  return { result, finallyRan };
}

/** 9. Multiple error conditions */
export function classifyError(err: unknown): string {
  try {
    if (err instanceof AppValidationError) {
      return `validation:${err.code}`;
    }
    if (err instanceof TypeError) {
      return "type-error";
    }
    if (err instanceof Error) {
      return `generic:${err.message}`;
    }
    throw new Error("unknown error shape");
  } catch (nested) {
    return `nested:${(nested as Error).message}`;
  }
}

/** 10. Graceful recovery after exception */
export function recoverFromFailure(steps: Array<() => number>): {
  recovered: boolean;
  value: number;
  attempts: number;
} {
  let attempts = 0;
  for (const step of steps) {
    attempts += 1;
    try {
      const value = step();
      return { recovered: true, value, attempts };
    } catch {
      // continue to next recovery step
    }
  }
  return { recovered: false, value: -1, attempts };
}
