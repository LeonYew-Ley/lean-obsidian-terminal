import { describe, it, expect } from "vitest";
import { resolveTabCwd } from "./tab-cwd";

describe("resolveTabCwd", () => {
  const vault = "C:\\vault";

  it("uses the requested cwd when it is non-empty", () => {
    expect(resolveTabCwd("C:\\other", vault)).toBe("C:\\other");
  });

  it("falls back to the vault root when the cwd is undefined", () => {
    expect(resolveTabCwd(undefined, vault)).toBe(vault);
  });

  it("falls back to the vault root when the cwd is an empty string", () => {
    expect(resolveTabCwd("", vault)).toBe(vault);
  });

  it("falls back to the vault root when the cwd is only whitespace", () => {
    expect(resolveTabCwd("  ", vault)).toBe(vault);
  });
});
