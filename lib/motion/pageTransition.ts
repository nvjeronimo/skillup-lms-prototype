/**
 * Page transitions (motion-matrix §7.5; Nelson, 25 Oct 2026: "as transições de páginas ainda me
 * parecem muito bruscas"). A navigation used to drop the old page in one frame and fade the new
 * one in. With the View Transitions API the old page stays on screen and fades out while the new
 * one fades in, and the chrome (top bar, player sidebar and footer, tab bar, assistant) holds
 * still (globals.css). Browsers without the API, a hidden tab and reduced motion keep the old
 * entrance fade (`.sk-animate-page`).
 */

/** The longest the old page waits for the new route before the transition lets go anyway. */
export const PAGE_TRANSITION_TIMEOUT_MS = 3000;

/** Set on <html> while a page transition runs (the new page's own entrance is switched off). */
export const PAGE_TRANSITION_ATTR = "data-page-transition";

export interface ClickLike {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
}

export interface AnchorLike {
  href: string;
  target: string;
  hasAttribute(name: string): boolean;
  getAttribute(name: string): string | null;
}

/**
 * Whether a click on a link should navigate through a page transition: a plain left click on a
 * same-origin link to another path, opening in this tab. A link that only changes the query or
 * the hash (tabs, filters, a thread in the inbox) stays in place, and a link can opt out with
 * data-page-transition="off".
 */
export function shouldTransitionClick(click: ClickLike, anchor: AnchorLike, current: { origin: string; pathname: string }): boolean {
  if (click.defaultPrevented || click.button !== 0) return false;
  if (click.metaKey || click.ctrlKey || click.shiftKey || click.altKey) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  if (anchor.getAttribute("data-page-transition") === "off") return false;
  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return false;
  }
  if (url.origin !== current.origin) return false;
  return url.pathname !== current.pathname;
}

type ViewTransition = { ready: Promise<void>; finished: Promise<void>; updateCallbackDone: Promise<void> };
type DocWithTransitions = Document & { startViewTransition?: (cb: () => Promise<void>) => ViewTransition };

let settle: (() => void) | null = null;
let runs = 0;

/** Called once the new route has rendered (PageTransitions, on a pathname change). */
export function settlePageTransition() {
  const done = settle;
  settle = null;
  done?.();
}

function reducedMotion(): boolean {
  return (
    document.documentElement.hasAttribute("data-reduce-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Runs a navigation inside a page transition when the browser can; otherwise runs it as is.
 * `navigate` should start the route change (router.push); the transition holds the old page's
 * picture until settlePageTransition() says the new one is in, or the timeout passes.
 */
export function navigateWithTransition(navigate: () => void) {
  const doc = document as DocWithTransitions;
  if (typeof doc.startViewTransition !== "function" || document.visibilityState !== "visible" || reducedMotion()) {
    navigate();
    return;
  }
  settlePageTransition();
  const root = document.documentElement;
  const run = ++runs;
  root.setAttribute(PAGE_TRANSITION_ATTR, "");
  const t = doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(() => settlePageTransition(), PAGE_TRANSITION_TIMEOUT_MS);
        settle = () => {
          window.clearTimeout(timer);
          resolve();
        };
        navigate();
      }),
  );
  // A transition the browser skips (another navigation before this one painted) rejects its
  // promises; the navigation itself still happens, so the rejections are expected.
  const ignore = () => {};
  t.ready.catch(ignore);
  t.updateCallbackDone.catch(ignore);
  // Only the latest transition takes the flag down: an earlier one ending must not clear it.
  t.finished.catch(ignore).finally(() => {
    if (run === runs) root.removeAttribute(PAGE_TRANSITION_ATTR);
  });
}
