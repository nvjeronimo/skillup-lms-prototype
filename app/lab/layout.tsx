import type { Metadata } from "@/lib/router";
import { Suspense } from "react";
import { LabTopbar } from "@/components/lab/LabTopbar";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: { template: "%s · Lab · SkillUp", default: "Lab · SkillUp" },
};

/** /lab — design explorations. Not the build target; nothing here ships as-is. */
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Suspense>
        <LabTopbar />
      </Suspense>
      <p
        role="note"
        className={`sk-text-body-medium-regular ${styles.note}`}
      >
        <span className="sk-text-body-medium-semibold">Lab exploration — not the build target.</span> Values tagged MOCK have
        no API today; each tag says why.
      </p>
      <Suspense>{children}</Suspense>
    </div>
  );
}
