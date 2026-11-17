import type { Breakpoint } from "@/lib/useBreakpoint";
import styles from "./contentPadding.module.css";

/*
 * DS `Container/content-padding` (Nelson, 15 Oct 2026): the padding of a topic's content
 * section, 24 desktop / 20 tablet / 16 mobile (Spacing/3xl). Picked from useBreakpoint() so it
 * follows the forced device preview, which media queries do not.
 * CSS Modules version of lib/contentPadding.ts (same names), for the course player views.
 */
export const CONTENT_PAD: Record<Breakpoint, string> = { desktop: styles.padDesktop, tablet: styles.padTablet, mobile: styles.padMobile };
export const CONTENT_PX: Record<Breakpoint, string> = { desktop: styles.pxDesktop, tablet: styles.pxTablet, mobile: styles.pxMobile };
export const CONTENT_PT: Record<Breakpoint, string> = { desktop: styles.ptDesktop, tablet: styles.ptTablet, mobile: styles.ptMobile };
export const CONTENT_PB: Record<Breakpoint, string> = { desktop: styles.pbDesktop, tablet: styles.pbTablet, mobile: styles.pbMobile };
/* A full-width row inside the padded section (the transcript lines, DS Transcript-Line 1.1):
   it bleeds out by the same amount and puts the padding back inside, so its highlight runs
   edge to edge and its text lines up with the rest of the content. */
export const CONTENT_BLEED: Record<Breakpoint, string> = { desktop: styles.bleedDesktop, tablet: styles.bleedTablet, mobile: styles.bleedMobile };
/* The measure of a topic's content (Nelson, 22 Oct 2026; DS `Container/content-max-width`):
   the text, tabs and blocks stop at 1200 and centre in the panel; the padding sits outside it
   (content-box). The video player is the one thing that keeps the full panel width. */
export const CONTENT_MEASURE = styles.measure;
