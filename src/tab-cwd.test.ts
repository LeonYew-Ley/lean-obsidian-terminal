import { describe, it, expect, vi } from "vitest";
import { resolveTabCwd } from "./tab-cwd";

describe("resolveTabCwd", () => {
  const vault = "C:\\vault";
  const exists = () => true;

  it("uses the requested cwd when it is an existing directory", () => {
    expect(resolveTabCwd("C:\\other", vault, exists)).toBe("C:\\other");
  });

  it("falls back to the vault root when the cwd is undefined", () => {
    expect(resolveTabCwd(undefined, vault, exists)).toBe(vault);
  });

  it("falls back to the vault root when the cwd is an empty string", () => {
    expect(resolveTabCwd("", vault, exists)).toBe(vault);
  });

  it("falls back to the vault root when the cwd is only whitespace", () => {
    expect(resolveTabCwd("  ", vault, exists)).toBe(vault);
  });

  it("falls back to the vault root when the directory no longer exists", () => {
    expect(resolveTabCwd("C:\\deleted", vault, () => false)).toBe(vault);
  });

  it("falls back to the vault root when the check throws", () => {
    const isDir = () => {
      throw new Error("ENOENT");
    };
    expect(resolveTabCwd("C:\\gone", vault, isDir)).toBe(vault);
  });

  it("passes the requested path to the check unchanged", () => {
    const isDir = vi.fn(() => true);
    resolveTabCwd("C:\\other", vault, isDir);
    expect(isDir).toHaveBeenCalledWith("C:\\other");
  });

  it("does not run the check for an empty or missing cwd", () => {
    const isDir = vi.fn(() => true);
    resolveTabCwd(undefined, vault, isDir);
    resolveTabCwd("", vault, isDir);
    resolveTabCwd("  ", vault, isDir);
    expect(isDir).not.toHaveBeenCalled();
  });
});
