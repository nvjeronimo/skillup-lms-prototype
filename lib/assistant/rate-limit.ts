/**
 * A fixed-window counter per key, in memory. On Vercel each serverless instance counts on its
 * own, so this slows a visitor down and no more: the real ceiling is the spend limit on the key.
 */
export function createRateLimiter(opts: {
  limit: number;
  windowMs: number;
  now?: () => number;
}): (key: string) => boolean {
  const now = opts.now ?? Date.now;
  const windows = new Map<string, { start: number; count: number }>();
  return (key) => {
    const t = now();
    const current = windows.get(key);
    if (!current || t - current.start > opts.windowMs) {
      windows.set(key, { start: t, count: 1 });
      return true;
    }
    if (current.count >= opts.limit) return false;
    current.count += 1;
    return true;
  };
}
