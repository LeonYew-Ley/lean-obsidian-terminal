/**
 * Pick the working directory for a new tab. An empty or whitespace-only string counts
 * as missing: node-pty would otherwise fall back to Obsidian's process cwd instead of
 * the view's default cwd (the vault root).
 */
export function resolveTabCwd(requested: string | undefined, fallback: string): string {
  return requested?.trim() ? requested : fallback;
}
