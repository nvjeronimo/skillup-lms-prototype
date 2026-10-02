import type { Metadata } from "next";
import { Suspense } from "react";
import { Archivo, Instrument_Serif } from "next/font/google";
import "@/tokens/lab-exhibition.css";
import { ExNav } from "./_parts/ExNav";

// Archivo, a grotesk with a width axis: stretched to 125% it is exhibition-poster type, at 100% it is
// the plain signage of labels and wayfinding. Instrument Serif italic sets the titles of works, the way
// every museum label italicises a title.
const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-ex-sans", display: "swap" });
const work = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic"], variable: "--font-ex-work", display: "swap" });

export const metadata: Metadata = {
  title: { template: "%s · Exhibition · Worlds · Lab · SkillUp", default: "Exhibition · Worlds · Lab · SkillUp" },
};

/** World A · Exhibition. Each course is an exhibition: modules are rooms, topics are wall labels. */
export default function ExhibitionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-world="exhibition" className={`${sans.variable} ${work.variable} flex min-h-[100dvh] flex-1 flex-col`}>
      <Suspense fallback={<div className="ex-plaster ex-rule-b h-16" aria-hidden />}>
        <ExNav />
      </Suspense>
      <Suspense fallback={<Hanging />}>{children}</Suspense>
    </div>
  );
}

/** Until the persona is read on the client: the wall, already painted, never a blank page. */
function Hanging() {
  return (
    <main id="main" tabIndex={-1} aria-busy="true" className="ex-wall flex-1 outline-none">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-12 md:px-10">
        <h1 className="ex-lead ex-c-onwall2">Hanging the exhibition…</h1>
      </div>
    </main>
  );
}
