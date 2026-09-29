import { Suspense } from "react";
import { Schibsted_Grotesk } from "next/font/google";
import "@/tokens/lab-field.css";
import { FieldNav } from "./_parts/FieldNav";

// A sturdy newspaper grotesque (built for Schibsted's titles): compact, sharp terminals, adult at 88px, plain at 16px.
const grotesk = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-fd", display: "swap" });

/** World C · Field. SkillUp teal owns the screen; the interface floats on it as white objects. */
export default function FieldLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-world="field" className={`${grotesk.variable} flex min-h-[100dvh] flex-1 flex-col`}>
      <Suspense fallback={<div className="h-[92px] md:h-[104px]" aria-hidden />}>
        <FieldNav />
      </Suspense>
      <Suspense
        fallback={
          <main id="main" tabIndex={-1} aria-busy="true" className="fd-wrap flex-1 pt-16">
            <p className="fd-lede fd-c-white">Loading…</p>
          </main>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
