import type { Metadata } from "next";
import { Suspense } from "react";
import { Archivo, Azeret_Mono } from "next/font/google";
import "@/tokens/lab-album.css";
import { AlbumNav } from "./_parts/AlbumNav";

// Sleeve: Archivo, a grotesque whose width axis runs from extra-condensed to expanded, set heavy and narrow at
// scale the way 1960s jazz sleeves stacked wood-type gothics, and at normal width for reading.
const sleeve = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-al-sleeve", display: "swap" });
// Counter: Azeret Mono, for track numbers and times only, like the display on a deck.
const counter = Azeret_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-al-counter", display: "swap" });

export const metadata: Metadata = {
  title: { template: "%s · Album · Worlds · Lab · SkillUp", default: "Album · Worlds · Lab · SkillUp" },
};

/** World B · Album. Each course is an album; topics are tracks; picking up where you left off is pressing play. */
export default function AlbumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-world="album" className={`${sleeve.variable} ${counter.variable} flex flex-1 flex-col`}>
      <Suspense fallback={<div className="al-rule-b h-16" aria-hidden="true" />}>
        <AlbumNav />
      </Suspense>
      <Suspense fallback={<Pressing />}>{children}</Suspense>
    </div>
  );
}

/** Shown until the persona is read on the client: the page's shape, never a blank screen. */
function Pressing() {
  return (
    <main id="main" tabIndex={-1} aria-busy="true" className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-24 pt-10 outline-none md:px-8 md:pt-16">
      <h1 className="al-body al-c-ink3">Loading…</h1>
    </main>
  );
}
