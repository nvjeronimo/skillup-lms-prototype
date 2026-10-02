import type { Metadata } from "next";
import { Suspense } from "react";
import { OptionSwitcher, OptionsNav } from "@/components/lab/pages/OptionsShell";

export const metadata: Metadata = {
  title: { template: "%s · Page options · Lab · SkillUp", default: "Page options · Lab · SkillUp" },
};

/** /lab/pages — 3–4 options per learner page, in the SkillUp DS. The switcher is lab-only chrome. */
export default function PageOptionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-sko-bg-subtle">
      <Suspense fallback={<div className="h-16 border-b border-sko-border-subtle bg-sko-bg-page" aria-hidden />}>
        <OptionsNav />
        <OptionSwitcher />
      </Suspense>
      <Suspense
        fallback={
          <main id="main" tabIndex={-1} aria-busy="true" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 outline-none md:px-8">
            <p className="sk-text-sm-regular text-sko-text-muted">Loading…</p>
          </main>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
