import * as React from "react";

/**
 * The Open edX scope (Nelson, 28 Oct 2026; decision 035). Since 29 Oct 2026 it is the DEFAULT:
 * the prototype shows only what Open edX provides (its data and settings, drawn by our frontend).
 * Our improvements and extra features (the CUSTOM and learner-facing rows of the edX fit audit)
 * show only when the tester turns on "Beyond Open edX" in the profile menu's demo footer, or
 * opens a link with `?scope=full`; `?scope=edx` goes back to the default.
 *
 * The opt-in lives in the `sk-scope=full` cookie. <html> is rendered with `data-scope="edx"`
 * (app/layout) and the pre-paint script removes it when the cookie says full, so blocks tagged
 * `data-invented="<theme>: <what Open edX lacks>"` are hidden by CSS (app/globals.css) with no
 * flash. Logic that cannot be a CSS hide (a nav entry, a dialog on Next, a whole page) reads
 * useEdxScope(), which is true on the server and while hydrating, then follows <html>.
 * The switch changes the scope live with setEdxScope(): no reload, the page keeps its place so
 * the differences show in the moment (Nelson, 30 Oct 2026).
 */
export const SCOPE_COOKIE = "sk-scope";

function readScope(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-scope") === "edx";
}

/** Re-renders the hook's users when <html> data-scope changes (setEdxScope). */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scope"] });
  return () => observer.disconnect();
}

/** True when the Open edX scope is on (the default; always true on the server). */
export function useEdxScope(): boolean {
  return React.useSyncExternalStore(subscribe, readScope, () => true);
}

/** For non-React code (stores, data modules): the scope as the page loaded. */
export function isEdxScope(): boolean {
  return readScope();
}

/**
 * Turns the Open edX scope on or off in place: writes the cookie, flips <html> data-scope (CSS hides
 * and every useEdxScope() follow) and drops a `?scope=` from the address so a reload keeps the
 * choice.
 */
export function setEdxScope(edx: boolean) {
  document.cookie = edx
    ? `${SCOPE_COOKIE}=; path=/; max-age=0; samesite=lax`
    : `${SCOPE_COOKIE}=full; path=/; max-age=31536000; samesite=lax`;
  if (edx) document.documentElement.setAttribute("data-scope", "edx");
  else document.documentElement.removeAttribute("data-scope");
  const url = new URL(window.location.href);
  if (url.searchParams.has("scope")) {
    url.searchParams.delete("scope");
    window.history.replaceState(window.history.state, "", url.toString());
  }
}

/**
 * The pre-paint part, inlined in app/layout's head: `?scope=full` writes the opt-in cookie,
 * `?scope=edx` clears it, then the cookie decides whether <html> keeps `data-scope="edx"`.
 */
export const SCOPE_INIT_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get('scope');if(q==='full')document.cookie='${SCOPE_COOKIE}=full; path=/; max-age=31536000; samesite=lax';else if(q==='edx')document.cookie='${SCOPE_COOKIE}=; path=/; max-age=0; samesite=lax';if(document.cookie.split('; ').indexOf('${SCOPE_COOKIE}=full')>-1)document.documentElement.removeAttribute('data-scope');else document.documentElement.setAttribute('data-scope','edx');}catch(e){}})();`;
