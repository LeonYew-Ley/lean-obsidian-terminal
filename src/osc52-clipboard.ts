// Write-only clipboard policy for OSC 52 (#103). Programs in the terminal may
// SET the system clipboard, but a read query ("?") is answered with an empty
// string so a remote or untrusted process can never exfiltrate clipboard
// contents. Structurally matches @xterm/addon-clipboard's IClipboardProvider.

/** Ignore pastes beyond this size so a runaway program cannot flood the clipboard. */
export const OSC52_MAX_WRITE_CHARS = 1_000_000;

export interface WriteOnlyClipboardProvider {
  readText(selection: string): Promise<string>;
  writeText(selection: string, text: string): Promise<void>;
}

export function createWriteOnlyClipboardProvider(
  write: (text: string) => Promise<void>
): WriteOnlyClipboardProvider {
  return {
    readText: () => Promise.resolve(""),
    writeText: async (_selection, text) => {
      if (text.length > OSC52_MAX_WRITE_CHARS) return;
      try {
        await write(text);
      } catch {
        // Clipboard unavailable (permissions, focus): drop silently like a normal copy failure.
      }
    },
  };
}
