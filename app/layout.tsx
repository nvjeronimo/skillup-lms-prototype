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
  title: "SkillUp LMS — Video Lesson",
  description: "Prototype of the SkillUp LMS video lesson flow.",
};

// Applies the persisted theme/skin to <html> before first paint. Without this,
// SSR always renders the light-mode defaults and ResponsiveShell's useEffect
// only flips them post-hydration — a visible flash of light-themed chrome
// (white CC/Edit pills, white progress circles) on every load of a dark-mode
// session. Mirrors ResponsiveShell's attribute logic; must stay in sync with it.
const THEME_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem('sk-lms-demo');if(!raw)return;var s=JSON.parse(raw).state;if(!s)return;if(s.theme==='dark')document.documentElement.setAttribute('data-theme','dark');if(s.skin&&s.skin!=='teal')document.documentElement.setAttribute('data-skin',s.skin);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ResponsiveShell>{children}</ResponsiveShell>
      </body>
    </html>
  );
}
