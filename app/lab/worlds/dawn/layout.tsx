import type { Metadata } from "next";
import { Suspense } from "react";
import { Bodoni_Moda, Schibsted_Grotesk } from "next/font/google";
import "@/tokens/lab-dawn.css";
import { DawnNav } from "./_parts/DawnNav";

// A playbill Didone for names and phases: its hairline-to-stem contrast behaves like light on a cyc,
// and its italic names the phase. A sturdy, open grotesk for everything read, built for small sizes on dark.
const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  variable: "--font-dw-display",
  display: "swap",
});
const text = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-dw-text", display: "swap" });

export const metadata: Metadata = {
  title: { template: "%s · Dawn · Worlds · Lab · SkillUp", default: "Dawn · Worlds · Lab · SkillUp" },
};

/** World D · Dawn — progress is light. Outside the SKO DS on purpose; only the logo and teal are fixed. */
export default function DawnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-world="dawn" className={`${display.variable} ${text.variable} flex min-h-[100dvh] flex-1 flex-col`}>
      <Suspense fallback={<div className="dw-nav h-16" aria-hidden />}>
        <DawnNav />
      </Suspense>
      <Suspense fallback={<Standby />}>{children}</Suspense>
    </div>
  );
}

/** Until the persona is read on the client: the house at black, with the horizon already there. */
function Standby() {
  return (
    <main id="main" tabIndex={-1} aria-busy="true" className="flex-1 outline-none">
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-16 md:px-10">
        <h1 className="dw-body dw-fg-2">Bringing the lights up…</h1>
      </div>
    </main>
  );
}
