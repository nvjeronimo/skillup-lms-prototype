import type { Metadata } from "next";
import { Suspense } from "react";
import { LabTopbar } from "@/components/lab/LabTopbar";

export const metadata: Metadata = {
  title: { template: "%s · Lab · SkillUp", default: "Lab · SkillUp" },
};

/** /lab — design explorations. Not the build target; nothing here ships as-is. */
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-sko-bg-subtle">
      <Suspense>
        <LabTopbar />
      </Suspense>
      <p
        role="note"
        className="sk-text-sm-regular border-b border-dashed border-sko-border-warning bg-sko-bg-warning-soft px-4 py-2 text-sko-text-warning md:px-6"
      >
        <span className="sk-text-sm-semibold">Lab exploration — not the build target.</span> Values tagged MOCK have
        no API today; each tag says why.
      </p>
      <Suspense>{children}</Suspense>
    </div>
  );
}
