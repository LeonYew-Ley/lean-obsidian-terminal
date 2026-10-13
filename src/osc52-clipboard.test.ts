import { describe, it, expect, vi } from "vitest";
import { createWriteOnlyClipboardProvider, OSC52_MAX_WRITE_CHARS } from "./osc52-clipboard";

describe("createWriteOnlyClipboardProvider", () => {
  it("forwards an OSC 52 write to the supplied writer", async () => {
    const write = vi.fn(() => Promise.resolve());
    const provider = createWriteOnlyClipboardProvider(write);

    await provider.writeText("c", "hello");

    expect(write).toHaveBeenCalledWith("hello");
  });

  it("answers an OSC 52 read query with an empty string so the clipboard is never exposed", async () => {
    const write = vi.fn(() => Promise.resolve());
    const provider = createWriteOnlyClipboardProvider(write);

    expect(await provider.readText("c")).toBe("");
    expect(write).not.toHaveBeenCalled();
  });

  it("ignores writes larger than the size cap", async () => {
    const write = vi.fn(() => Promise.resolve());
    const provider = createWriteOnlyClipboardProvider(write);

    await provider.writeText("c", "x".repeat(OSC52_MAX_WRITE_CHARS + 1));

    expect(write).not.toHaveBeenCalled();
  });

  it("does not throw when the writer rejects (clipboard unavailable)", async () => {
    const provider = createWriteOnlyClipboardProvider(() => Promise.reject(new Error("denied")));

    await expect(provider.writeText("c", "hello")).resolves.toBeUndefined();
  });
});
