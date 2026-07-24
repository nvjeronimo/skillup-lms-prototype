import { clsx, type ClassValue } from "clsx";

/** Tailwind-friendly className combiner. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Icon stroke-weight rule (handoff critical rule):
 * icons rendered at < 24px use stroke-width 1.5; icons >= 24px use 2.
 */
export function iconStroke(size: number): number {
  return size >= 24 ? 2 : 1.5;
}

/** Parse a "m:ss" or "h:mm:ss" timestamp string into seconds. */
export function tsToSeconds(ts: string): number {
  const parts = ts.split(":").map(Number);
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}

/** Format seconds back into "m:ss". */
export function secondsToTs(total: number): string {
  const s = Math.max(0, Math.floor(total));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

/**
 * Duration "approx." rule. The estimated topic types require an "approx." prefix;
 * Video/Recording/Live/timed Quiz never do. Source data already encodes the prefix,
 * this helper is the canonical predicate used by stories + components.
 */
const ESTIMATED_TYPES = new Set([
  "Reading",
  "Lab",
  "Activity",
  "Project",
  "Practice Assignment",
  "Graded Assignment",
  "Peer-graded",
  "Peer Review",
]);

export function isEstimatedDuration(type: string): boolean {
  return ESTIMATED_TYPES.has(type);
}

/** Short type label shown inline in Topic Rows + Saved items (matches Figma). */
const SHORT_LABELS: Record<string, string> = {
  "VILT-Live Session": "Live Session",
  "VILT-Recording": "Recording",
  "Practice Assignment": "Practice",
  "Graded Assignment": "Graded",
  "Discussion Prompt": "Discussion",
  "Lesson Page": "Lesson",
};

export function topicTypeShortLabel(type: string): string {
  return SHORT_LABELS[type] ?? type;
}

/**
 * Parse a human duration label ("58 min", "19m 04s", "1h 05m", "approx. 45 min")
 * into seconds, for feeding the VideoPlayer scrubber. Falls back to 200s.
 */
export function durationToSeconds(label: string | undefined): number {
  if (!label) return 200;
  const h = /(\d+)\s*h/.exec(label);
  const m = /(\d+)\s*m/.exec(label);
  const s = /(\d+)\s*s/.exec(label);
  const total =
    (h ? +h[1] * 3600 : 0) + (m ? +m[1] * 60 : 0) + (s ? +s[1] : 0);
  return total || 200;
}
