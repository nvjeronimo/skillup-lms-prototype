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
 */
export const SCOPE_COOKIE = "sk-scope";

function readScope(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-scope") === "edx";
}

const subscribe = () => () => {};

/** True when the Open edX scope is on (the default; always true on the server). */
export function useEdxScope(): boolean {
  return React.useSyncExternalStore(subscribe, readScope, () => true);
}

/** For non-React code (stores, data modules): the scope as the page loaded. */
export function isEdxScope(): boolean {
  return readScope();
}

/**
 * The pre-paint part, inlined in app/layout's head: `?scope=full` writes the opt-in cookie,
 * `?scope=edx` clears it, then the cookie decides whether <html> keeps `data-scope="edx"`.
 */
export const SCOPE_INIT_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get('scope');if(q==='full')document.cookie='${SCOPE_COOKIE}=full; path=/; max-age=31536000; samesite=lax';else if(q==='edx')document.cookie='${SCOPE_COOKIE}=; path=/; max-age=0; samesite=lax';if(document.cookie.split('; ').indexOf('${SCOPE_COOKIE}=full')>-1)document.documentElement.removeAttribute('data-scope');else document.documentElement.setAttribute('data-scope','edx');}catch(e){}})();`;
