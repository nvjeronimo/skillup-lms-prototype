import { scrollBehavior } from "./utils";

/**
 * Brings `el` into view: a glide, or a jump under reduced motion (the OS setting or the
 * Accessibility panel's switch, `data-reduce-motion` on <html>).
 */
export function scrollToElement(el: Element | null, block?: ScrollLogicalPosition): void {
  el?.scrollIntoView({ block, behavior: scrollBehavior() });
}
