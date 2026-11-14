import type { Metadata } from "@/lib/router";
import { Suspense } from "react";
import "@/tokens/lab-training.css";
import { TrainingNav } from "@/components/lab/training/TrainingNav";
import styles from "./layout.module.css";

// Timing-board condensed numerals for the plan (Big Shoulders Display 800); a plain workhorse
// grotesk for reading (Hanken Grotesk 400/600). Both load from Google Fonts in index.html.

export const metadata: Metadata = {
  title: { template: "%s · The Training Block · Lab · SkillUp", default: "The Training Block · Lab · SkillUp" },
};

/** "The Training Block" — a lab world explored outside the SKO DS. Only the SkillUp logo and teal are fixed. */
export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-world="training" className={styles.world}>
      <Suspense fallback={<div className={`tb-bg-sheet tb-rule-b ${styles.navFallback}`} aria-hidden />}>
        <TrainingNav />
      </Suspense>
      <Suspense fallback={<PlanSkeleton />}>{children}</Suspense>
    </div>
  );
}

/** Shown until the persona is read on the client: the single column's shape, never a blank page. */
function PlanSkeleton() {
  return (
    <main id="main" tabIndex={-1} aria-busy="true" className={styles.main}>
      <h1 className="tb-body-s tb-c-ink2">Loading your plan…</h1>
      <div aria-hidden>
        <div className={`tb-bg-sheet ${styles.bone} ${styles.boneTitle}`} />
        <div className={`tb-bg-sheet ${styles.bone} ${styles.boneButton}`} />
        <div className={`tb-bg-sheet ${styles.bone} ${styles.boneBlock}`} />
      </div>
    </main>
  );
}
