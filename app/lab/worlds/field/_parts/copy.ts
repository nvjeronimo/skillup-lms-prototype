import type { LucideIcon } from "lucide-react";
import { Award, BookOpen, Briefcase, HelpCircle, Pencil, Play, Radio, Video } from "lucide-react";

/** Keep ?persona= on every in-world link. */
export function withPersona(href: string, persona: string | null) {
  return persona ? `${href}?persona=${encodeURIComponent(persona)}` : href;
}

/** A hash or missing href means the destination is not built in this lab. */
export function isWired(href: string | undefined): href is string {
  return !!href && href !== "#";
}

/** "an 8-minute", "a 12-minute". */
export function article(n: number) {
  return /^(8|11|18)/.test(String(n)) ? "an" : "a";
}

const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
export function countWord(n: number) {
  return WORDS[n] ?? String(n);
}

/** Session kinds from the training plan, and topic types from the course data, in plain words. */
export function kindWord(kind: string) {
  const map: Record<string, string> = {
    "VILT-Live Session": "Live session",
    "VILT-Recording": "Recording",
    "Practice Assignment": "Practice",
    "Lesson Page": "Lesson",
  };
  return map[kind] ?? kind;
}

export function kindIcon(kind: string): LucideIcon {
  if (/video/i.test(kind)) return Play;
  if (/live/i.test(kind)) return Video;
  if (/record/i.test(kind)) return Radio;
  if (/quiz/i.test(kind)) return HelpCircle;
  if (/project/i.test(kind)) return Briefcase;
  if (/assignment/i.test(kind)) return Pencil;
  if (/graded|exam/i.test(kind)) return Award;
  return BookOpen;
}

export const NOT_WIRED = "Lab demo — not wired";
