import * as React from "react";

/**
 * The Open edX scope (Nelson, 28 Oct 2026; decision 035): `?scope=edx` shows the prototype with
 * only what Open edX provides — its data and settings, drawn by our frontend — and hides what we
 * invented (the CUSTOM and learner-facing rows of the edX fit audit). `?scope=full` turns it off.
 *
 * The choice lives in the `sk-scope` cookie. The pre-paint script in app/layout sets the cookie
 * from the URL and stamps `data-scope="edx"` on <html> before the first paint, so blocks tagged
 * `data-invented="<theme>: <what Open edX lacks>"` are hidden by CSS (app/globals.css) with no
 * flash. Logic that cannot be a CSS hide (a nav entry, a dialog on Next, a whole page) reads
 * useEdxScope(), which is false on the server and while hydrating, then follows the cookie.
 */
export const SCOPE_COOKIE = "sk-scope";

function readScope(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-scope") === "edx";
}

const subscribe = () => () => {};

/** True when the Open edX scope is on (always false on the server). */
export function useEdxScope(): boolean {
  return React.useSyncExternalStore(subscribe, readScope, () => false);
}

/** For non-React code (stores, data modules): the scope as the page loaded. */
export function isEdxScope(): boolean {
  return readScope();
}

/**
 * The pre-paint part, inlined in app/layout's head: `?scope=edx|full` writes or clears the cookie,
 * then the cookie stamps <html>.
 */
export const SCOPE_INIT_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get('scope');if(q==='edx')document.cookie='${SCOPE_COOKIE}=edx; path=/; max-age=31536000; samesite=lax';else if(q==='full')document.cookie='${SCOPE_COOKIE}=; path=/; max-age=0; samesite=lax';if(document.cookie.split('; ').indexOf('${SCOPE_COOKIE}=edx')>-1)document.documentElement.setAttribute('data-scope','edx');}catch(e){}})();`;
