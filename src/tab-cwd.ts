/**
 * Pick the working directory for a new tab. An empty or whitespace-only string counts
 * as missing: node-pty would otherwise fall back to Obsidian's process cwd instead of
 * the view's default cwd (the vault root). A requested cwd that is not an existing
 * directory (a restored tab whose folder was moved or deleted) also falls back,
 * because spawning into it fails outright. `isDir` is injected so this stays pure.
 */
export function resolveTabCwd(
  requested: string | undefined,
  fallback: string,
  isDir: (path: string) => boolean
): string {
  if (!requested?.trim()) return fallback;
  try {
    return isDir(requested) ? requested : fallback;
  } catch {
    return fallback;
  }
}
