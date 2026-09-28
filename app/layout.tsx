import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ResponsiveShell } from "@/components/views/ResponsiveShell";

// SkillUp DS (v2.0): Montserrat is the single family for body + display. Inter
// (the old UUI default) is retired.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  // Every route sets its own title (WCAG 2.4.2); the template adds the product.
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
const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement;var s={};try{var raw=localStorage.getItem('sk-lms-demo');s=(raw&&JSON.parse(raw).state)||{};}catch(e){}try{if(s.theme==='dark')document.documentElement.setAttribute('data-theme','dark');if(s.skin&&s.skin!=='teal')document.documentElement.setAttribute('data-skin',s.skin);if(s.vision==='cvd')document.documentElement.setAttribute('data-vision','cvd');if(s.textSize&&s.textSize!=='md')d.setAttribute('data-text-size',s.textSize);if(s.reduceMotion)d.setAttribute('data-reduce-motion','');if(s.underlineLinks)d.setAttribute('data-underline-links','');var lt=s.largeTargetsChoice;if(lt===undefined||lt===null)lt=s.largeTargets===true?true:(s.deviceMode==='mobile'||window.matchMedia('(max-width: 767px)').matches)?true:null;if(lt===true)d.setAttribute('data-large-targets','');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        {/* First focusable element on every page (WCAG 2.4.1). Every route
            renders <main id="main" tabIndex={-1}>. */}
        <a
          href="#main"
          className="sk-text-sm-semibold sr-only rounded-lg border border-sko-border-primary bg-sko-bg-page px-4 py-3 text-sko-text-primary shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <ResponsiveShell>{children}</ResponsiveShell>
      </body>
    </html>
  );
}
