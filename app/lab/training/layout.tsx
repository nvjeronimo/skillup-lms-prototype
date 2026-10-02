import type { Metadata } from "next";
import { Suspense } from "react";
import "@/tokens/lab-training.css";
import { TrainingNav } from "@/components/lab/training/TrainingNav";


export const metadata: Metadata = {
  title: { template: "%s · The Training Block · Lab · SkillUp", default: "The Training Block · Lab · SkillUp" },
};

/** "The Training Block" — a lab world explored outside the SKO DS. Fixed: the SkillUp logo, teal, Montserrat and the SKO accent yellow. */
export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-world="training" className="flex min-h-[100dvh] flex-1 flex-col pb-20 md:pb-0">
      <Suspense fallback={<div className="tb-bg-sheet tb-rule-b h-16" aria-hidden />}>
        <TrainingNav />
      </Suspense>
      <Suspense fallback={<PlanSkeleton />}>{children}</Suspense>
    </div>
  );
}

/** Shown until the persona is read on the client: the single column's shape, never a blank page. */
function PlanSkeleton() {
  return (
    <main id="main" tabIndex={-1} aria-busy="true" className="mx-auto w-full max-w-[880px] flex-1 px-4 pb-16 pt-10 outline-none md:px-8 md:pt-16">
      <h1 className="tb-body-s tb-c-ink2">Loading your plan…</h1>
      <div aria-hidden>
        <div className="tb-bg-sheet mt-4 h-16 w-3/4 rounded-sm" />
        <div className="tb-bg-sheet mt-8 h-[52px] w-48 rounded-sm" />
        <div className="tb-bg-sheet mt-12 h-24 rounded-sm" />
      </div>
    </main>
  );
}
