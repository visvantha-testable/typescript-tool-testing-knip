/**
 * Error-flow training subject — try/catch paths for Exception Path Handling / Error Flow Verification.
 */
import { readFile } from "node:fs/promises";

export type ReadResult =
  | { ok: true; lines: string[] }
  | { ok: false; code: "missing" | "permission" | "decode"; message: string };

export async function safeReadLines(path: string): Promise<ReadResult> {
  try {
    const text = await readFile(path, "utf-8");
    return { ok: true, lines: text.split(/\r?\n/) };
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return { ok: false, code: "missing", message: `File not found: ${path}` };
    }
    if (code === "EACCES") {
      return { ok: false, code: "permission", message: `Access denied: ${path}` };
    }
    if (err instanceof Error && err.message.includes("invalid utf-8")) {
      return { ok: false, code: "decode", message: `Decode error: ${path}` };
    }
    throw err;
  }
}

export function parseJsonSafely(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function divideSafely(a: number, b: number): number | null {
  try {
    if (b === 0) {
      throw new RangeError("division by zero");
    }
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      throw new TypeError("invalid operand");
    }
    return a / b;
  } catch (err) {
    if (err instanceof RangeError) {
      return null;
    }
    throw err;
  }
}

export function retryOperation<T>(
  fn: () => T,
  retries: number,
  onError?: (attempt: number, err: unknown) => void,
): T {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return fn();
    } catch (err) {
      lastError = err;
      onError?.(attempt, err);
      if (attempt === retries) {
        break;
      }
    }
  }
  throw lastError;
}

export function classifyHttpStatus(status: number): "success" | "client" | "server" | "unknown" {
  if (status >= 200 && status < 300) {
    return "success";
  }
  if (status >= 400 && status < 500) {
    return "client";
  }
  if (status >= 500 && status < 600) {
    return "server";
  }
  return "unknown";
}
