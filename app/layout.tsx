import type { Metadata } from "next";
import { Figtree, Inter_Tight, Montserrat, Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ResponsiveShell } from "@/components/views/ResponsiveShell";
import { ARRIVAL_INIT_SCRIPT } from "@/lib/arrival/prepaint";
import { SCOPE_INIT_SCRIPT } from "@/lib/edx-scope";

// SkillUp DS (v2.0): Montserrat is the single family for body + display. Inter
// (the old UUI default) is retired.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  // Italic too: the Sea skin sets the second half of headings in Montserrat Italic (19–20 Oct 2026).
  style: ["normal", "italic"],
  display: "swap",
});

// The "Studio" direction (experimental, 22 Oct 2026) sets the interface in a neo-grotesk.
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

// The "Harbor" skin (25 Oct 2026): Plus Jakarta Sans for display, Figtree for text, the free
// stand-ins for a geometric display face and a humanist sans.
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

// The "Fluent" skin (25 Oct 2026): Open Sans stands in for Segoe UI (Nelson's choice).
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${interTight.variable} ${plusJakarta.variable} ${figtree.variable} ${openSans.variable}`} data-scope="edx" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* Open edX only by default; ?scope=full shows our extra features (lib/edx-scope). */}
        <script dangerouslySetInnerHTML={{ __html: SCOPE_INIT_SCRIPT }} />
        {/* First visit of a platform page in this session: hold the skeleton from the first
            paint (motion-matrix §7.9; lib/arrival/prepaint). */}
        <script dangerouslySetInnerHTML={{ __html: ARRIVAL_INIT_SCRIPT }} />
      </head>
      <body>
        {/* First focusable element on every page (WCAG 2.4.1). Every route
            renders <main id="main" tabIndex={-1}>. */}
        <a
          href="#main"
          className="sk-text-body-medium-semibold sr-only rounded-control border border-sko-border-primary bg-sko-bg-page px-4 py-3 text-sko-text-primary shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:min-h-[44px] focus:items-center focus:px-4 focus:py-3"
        >
          Skip to content
        </a>
        <ResponsiveShell>{children}</ResponsiveShell>
      </body>
    </html>
  );
}
