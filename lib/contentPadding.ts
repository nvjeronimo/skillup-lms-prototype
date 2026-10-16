import type { Breakpoint } from "@/lib/useBreakpoint";

/*
 * DS `Container/content-padding` (Nelson, 15 Oct 2026): the padding of a topic's content
 * section, 24 desktop / 20 tablet / 16 mobile (Spacing/3xl). Picked from useBreakpoint() so it
 * follows the forced device preview, which media queries do not.
 */
export const CONTENT_PAD: Record<Breakpoint, string> = { desktop: "p-6", tablet: "p-5", mobile: "p-4" };
export const CONTENT_PX: Record<Breakpoint, string> = { desktop: "px-6", tablet: "px-5", mobile: "px-4" };
export const CONTENT_PT: Record<Breakpoint, string> = { desktop: "pt-6", tablet: "pt-5", mobile: "pt-4" };
export const CONTENT_PB: Record<Breakpoint, string> = { desktop: "pb-6", tablet: "pb-5", mobile: "pb-4" };
/* A full-width row inside the padded section (the transcript lines, DS Transcript-Line 1.1):
   it bleeds out by the same amount and puts the padding back inside, so its highlight runs
   edge to edge and its text lines up with the rest of the content. */
export const CONTENT_BLEED: Record<Breakpoint, string> = { desktop: "-mx-6", tablet: "-mx-5", mobile: "-mx-4" };
