import type { Metadata } from "next";
import { Suspense } from "react";
import { WorldSwitcher } from "@/components/lab/worlds/WorldSwitcher";

export const metadata: Metadata = {
  title: { template: "%s · Worlds · Lab · SkillUp", default: "Worlds · Lab · SkillUp" },
};

/** /lab/worlds — the lab strip, then the world, which owns everything below it. */
export default function WorldsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense>
        <WorldSwitcher />
      </Suspense>
      <Suspense fallback={<div className="flex-1" aria-busy="true" />}>{children}</Suspense>
    </div>
  );
}
