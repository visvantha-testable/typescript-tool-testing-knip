/**
 * Asynchronous exception-path scenarios for Error Flow Verification.
 * Covers: async try-catch, promise rejection handling.
 */

export type AsyncResult =
  | { ok: true; value: string }
  | { ok: false; reason: "timeout" | "rejected" | "unknown"; message: string };

/** 3. Async try-catch */
export async function asyncTryCatch(task: () => Promise<string>): Promise<AsyncResult> {
  try {
    const value = await task();
    return { ok: true, value };
  } catch (err) {
    if (err instanceof Error && err.message.includes("timeout")) {
      return { ok: false, reason: "timeout", message: err.message };
    }
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: "unknown", message };
  }
}

/** 4. Promise rejection handling */
export async function handlePromiseRejection(
  promise: Promise<number>,
): Promise<{ ok: true; value: number } | { ok: false; recovered: number }> {
  try {
    const value = await promise;
    return { ok: true, value };
  } catch {
    return { ok: false, recovered: 0 };
  }
}

export async function fetchWithRecovery(
  loader: () => Promise<string>,
  fallback: string,
): Promise<{ value: string; usedFallback: boolean }> {
  try {
    const value = await loader();
    return { value, usedFallback: false };
  } catch {
    return { value: fallback, usedFallback: true };
  }
}
