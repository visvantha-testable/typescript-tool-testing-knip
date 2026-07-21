import { describe, expect, it } from "vitest";
import {
  asyncTryCatch,
  fetchWithRecovery,
  handlePromiseRejection,
} from "../src/exceptionAsync.js";

describe("exceptionAsync — Error Flow Verification runtime evidence", () => {
  it("async try-catch: success path and async exception handled", async () => {
    await expect(asyncTryCatch(async () => "ok")).resolves.toEqual({
      ok: true,
      value: "ok",
    });

    await expect(
      asyncTryCatch(async () => {
        throw new Error("timeout exceeded");
      }),
    ).resolves.toEqual({
      ok: false,
      reason: "timeout",
      message: "timeout exceeded",
    });

    await expect(
      asyncTryCatch(async () => {
        throw new Error("other failure");
      }),
    ).resolves.toEqual({
      ok: false,
      reason: "unknown",
      message: "other failure",
    });

    await expect(
      asyncTryCatch(async () => {
        throw "plain rejection";
      }),
    ).resolves.toEqual({
      ok: false,
      reason: "unknown",
      message: "plain rejection",
    });
  });

  it("promise rejection: resolved value and recovered fallback", async () => {
    await expect(handlePromiseRejection(Promise.resolve(7))).resolves.toEqual({
      ok: true,
      value: 7,
    });

    await expect(handlePromiseRejection(Promise.reject(new Error("reject")))).resolves.toEqual({
      ok: false,
      recovered: 0,
    });
  });

  it("fetchWithRecovery: continues after async failure using fallback", async () => {
    await expect(
      fetchWithRecovery(async () => "live-data", "fallback-data"),
    ).resolves.toEqual({
      value: "live-data",
      usedFallback: false,
    });

    await expect(
      fetchWithRecovery(async () => {
        throw new Error("network down");
      }, "fallback-data"),
    ).resolves.toEqual({
      value: "fallback-data",
      usedFallback: true,
    });
  });
});
