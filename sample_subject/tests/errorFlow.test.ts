import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const readFileMock = vi.hoisted(() => vi.fn());

vi.mock("node:fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs/promises")>();
  readFileMock.mockImplementation(actual.readFile);
  return {
    ...actual,
    readFile: readFileMock,
  };
});

import * as subject from "../src/index.js";

const {
  classifyHttpStatus,
  divideSafely,
  parseJsonSafely,
  retryOperation,
  safeReadLines,
} = subject;

describe("errorFlow — exception path handling", () => {
  beforeEach(async () => {
    const actual = await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");
    readFileMock.mockReset();
    readFileMock.mockImplementation(actual.readFile);
  });

  it("exports are reachable via index entry", () => {
    expect(typeof subject.safeReadLines).toBe("function");
    expect(typeof subject.classifyHttpStatus).toBe("function");
  });

  it("safeReadLines covers missing and happy paths", async () => {
    const missing = await safeReadLines(join(tmpdir(), "knip-missing-file.txt"));
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.code).toBe("missing");

    const dir = await mkdtemp(join(tmpdir(), "knip-"));
    const file = join(dir, "data.txt");
    await writeFile(file, "alpha\nbeta", "utf-8");
    const ok = await safeReadLines(file);
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.lines).toEqual(["alpha", "beta"]);
  });

  it("safeReadLines covers permission, decode, and rethrow paths", async () => {
    readFileMock
      .mockRejectedValueOnce(Object.assign(new Error("denied"), { code: "EACCES" }))
      .mockRejectedValueOnce(new Error("invalid utf-8 sequence"))
      .mockRejectedValueOnce(new Error("unexpected io failure"));

    const denied = await safeReadLines("/locked/file.txt");
    expect(denied).toEqual({
      ok: false,
      code: "permission",
      message: "Access denied: /locked/file.txt",
    });

    const decode = await safeReadLines("/bad-encoding.txt");
    expect(decode).toEqual({
      ok: false,
      code: "decode",
      message: "Decode error: /bad-encoding.txt",
    });

    await expect(safeReadLines("/boom.txt")).rejects.toThrow("unexpected io failure");
  });

  it("parseJsonSafely covers valid and invalid JSON", () => {
    expect(parseJsonSafely('{"a":1}')).toEqual({ a: 1 });
    expect(parseJsonSafely("{bad")).toBeNull();
  });

  it("divideSafely covers success, zero division, and rethrow", () => {
    expect(divideSafely(10, 2)).toBe(5);
    expect(divideSafely(1, 0)).toBeNull();
    expect(() => divideSafely(Number.NaN, 2)).toThrow(TypeError);
  });

  it("retryOperation covers success, retry, and final failure", () => {
    let calls = 0;
    expect(
      retryOperation(() => {
        calls += 1;
        if (calls < 2) throw new Error("transient");
        return "done";
      }, 2),
    ).toBe("done");

    expect(() =>
      retryOperation(() => {
        throw new Error("always");
      }, 1),
    ).toThrow("always");

    const onError = vi.fn();
    try {
      retryOperation(() => {
        throw new Error("fail");
      }, 0, onError);
    } catch {
      expect(onError).toHaveBeenCalledTimes(1);
    }
  });

  it("classifyHttpStatus covers all status buckets", () => {
    expect(classifyHttpStatus(200)).toBe("success");
    expect(classifyHttpStatus(404)).toBe("client");
    expect(classifyHttpStatus(503)).toBe("server");
    expect(classifyHttpStatus(999)).toBe("unknown");
  });
});
