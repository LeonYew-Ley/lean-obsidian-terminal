/**
 * Pick the working directory for a new tab. An empty string counts as missing:
 * node-pty would otherwise fall back to Obsidian's process cwd instead of the vault.
 */
export function resolveTabCwd(requested: string | undefined, fallback: string): string {
  return requested || fallback;
}
