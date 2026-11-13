import { Outlet, ScrollRestoration } from "react-router";
import type { Metadata } from "@/lib/router";
import "./globals.css";
import { ResponsiveShell } from "@/components/views/ResponsiveShell";
import { ARRIVAL_INIT_SCRIPT } from "@/lib/arrival/prepaint";
import { SCOPE_INIT_SCRIPT } from "@/lib/edx-scope";

// Fonts: Montserrat (SkillUp DS) and the skins' families (Inter Tight, Plus Jakarta Sans, Figtree,
// Open Sans) load from Google Fonts in index.html; the token CSS names each family as its fallback.

export const metadata: Metadata = {
  // Every route sets its own title (WCAG 2.4.2) through pageTitle() in lib/utils;
  // the template is only a fallback for a route that forgets.
  title: { template: "%s · SkillUp", default: "SkillUp" },
  description: "Prototype of the SkillUp LMS video lesson flow.",
};

// Applies the persisted theme/skin to <html> before first paint. Without this,
// SSR always renders the light-mode defaults and ResponsiveShell's useEffect
// only flips them post-hydration — a visible flash of light-themed chrome
// (white CC/Edit pills, white progress circles) on every load of a dark-mode
// session. Mirrors ResponsiveShell's attribute logic; must stay in sync with it.
// Large targets: the stored choice wins; with no choice they default ON at
// ≤767px (useLargeTargets in lib/store.ts).
const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement;var s={};try{var raw=localStorage.getItem('sk-lms-demo');s=(raw&&JSON.parse(raw).state)||{};}catch(e){}try{if(s.theme==='dark')document.documentElement.setAttribute('data-theme','dark');var dq0=new URLSearchParams(location.search).get('direction');if(dq0==='harbor'||dq0==='fluent')d.setAttribute('data-skin',dq0);else if(dq0!=='classic'&&dq0!=='studio'&&s.skin&&s.skin!=='teal')document.documentElement.setAttribute('data-skin',s.skin);if(s.vision==='cvd')document.documentElement.setAttribute('data-vision','cvd');if(s.textSize&&s.textSize!=='md')d.setAttribute('data-text-size',s.textSize);if(s.reduceMotion)d.setAttribute('data-reduce-motion','');if(s.underlineLinks)d.setAttribute('data-underline-links','');var dq=new URLSearchParams(location.search).get('direction');if(dq==='studio'||(dq!=='classic'&&(s.skin==='studio'||s.skin==='sea'||s.studio)))d.setAttribute('data-direction','studio');var lt=s.largeTargetsChoice;if(lt===undefined||lt===null)lt=s.largeTargets===true?true:(s.deviceMode==='mobile'||window.matchMedia('(max-width: 767px)').matches)?true:null;if(lt===true)d.setAttribute('data-large-targets','');}catch(e){}})();`;

/** Runs the pre-paint scripts once, before React renders the first route (main.tsx). */
export function runPrepaintScripts() {
  for (const script of [THEME_INIT_SCRIPT, SCOPE_INIT_SCRIPT, ARRIVAL_INIT_SCRIPT]) {
    try {
      // eslint-disable-next-line no-new-func
      new Function(script)();
    } catch {
      /* a broken script must not block the app */
    }
  }
}

/** The root route: skip link, the responsive shell and the matched page. */
export default function RootLayout() {
  return (
    <>
      {/* First focusable element on every page (WCAG 2.4.1). Every route
          renders <main id="main" tabIndex={-1}>. */}
      <a
        href="#main"
        className="sk-text-body-medium-semibold sr-only rounded-control border border-sko-border-primary bg-sko-bg-page px-4 py-3 text-sko-text-primary shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:min-h-[44px] focus:items-center focus:px-4 focus:py-3"
      >
        Skip to content
      </a>
      <ResponsiveShell>
        <Outlet />
      </ResponsiveShell>
      <ScrollRestoration />
    </>
  );
}
