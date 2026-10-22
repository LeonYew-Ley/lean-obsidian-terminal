import { describe, it, expect, vi } from "vitest";
import { planTabCwd, resolveTabCwd } from "./tab-cwd";

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

  it("passes a padded cwd to the check untrimmed", () => {
    const isDir = vi.fn(() => true);
    expect(resolveTabCwd(" C:\\x ", vault, isDir)).toBe(" C:\\x ");
    expect(isDir).toHaveBeenCalledWith(" C:\\x ");
  });
});

describe("planTabCwd", () => {
  const vault = "C:\\vault";

  it("spawns and stores the requested cwd when it exists", () => {
    expect(planTabCwd("C:\\other", vault, () => true)).toEqual({
      spawn: "C:\\other",
      stored: "C:\\other",
      fellBack: false,
    });
  });

  it("spawns in the fallback but keeps the requested cwd stored when the folder is missing", () => {
    expect(planTabCwd("E:\\usb\\proj", vault, () => false)).toEqual({
      spawn: vault,
      stored: "E:\\usb\\proj",
      fellBack: true,
    });
  });

  it("keeps the requested cwd stored when the check throws", () => {
    const isDir = () => {
      throw new Error("EACCES");
    };
    expect(planTabCwd("\\\\nas\\share", vault, isDir)).toEqual({
      spawn: vault,
      stored: "\\\\nas\\share",
      fellBack: true,
    });
  });

  it("stores the fallback and reports no fallback for an empty or missing cwd", () => {
    const plan = { spawn: vault, stored: vault, fellBack: false };
    expect(planTabCwd(undefined, vault, () => false)).toEqual(plan);
    expect(planTabCwd("", vault, () => false)).toEqual(plan);
    expect(planTabCwd("  ", vault, () => false)).toEqual(plan);
  });
});
