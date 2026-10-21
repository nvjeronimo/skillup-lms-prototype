"use client";

import * as React from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { HeaderBandSkeleton, TabBarSkeleton } from "@/components/platform/HeaderBandSkeleton";
import { DEFAULT_PROGRAM_TAB, isProgramTab, type Program, type ProgramTabId } from "@/lib/platform/program";
import { cn } from "@/lib/utils";

/* ProgramDetailView's body column, with its paddings. */
const BODY =
  "mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 pb-8 pt-4 md:flex-row md:items-start md:gap-8 md:px-6 md:pb-12 md:pt-6 lg:gap-10 lg:px-10 lg:pb-20 lg:pt-8";
const CARD = "rounded-card border border-sko-border-subtle bg-sko-bg-page";

/** The section intro of a tab: the headline-small title and its lead, as ghost lines. */
export function IntroSkeleton({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton variant="ghost" text="headline-small-bold">{title}</Skeleton>
      {lead ? <Skeleton variant="ghost" text="body-large-regular">{lead}</Skeleton> : null}
    </div>
  );
}

/**
 * A Course-Row: the card's first lines. An open row (the course in progress opens with the
 * page) is its closed height plus its modules, ≈ 138 / 97 / 91 each (phone / tablet / desktop).
 */
function CourseRowSkeleton({ open, modules }: { open: boolean; modules: number }) {
  return (
    <div
      className={cn(
        CARD,
        "flex flex-col gap-3 p-6 [--mod:137.75px] [--row:413px] md:[--mod:96.75px] md:[--row:391px] lg:[--mod:91.25px] lg:[--row:193px]",
      )}
      style={{ height: `calc(var(--row) + ${open ? modules : 0} * var(--mod))` }}
    >
      <div className="flex items-center justify-between">
        <Skeleton text="body-small-medium" width={96} />
        <Skeleton variant="block" width={67} height={28} radius="pill" />
      </div>
      <Skeleton text="body-large-semibold" width="55%" />
      <Skeleton text="body-small-regular" width="35%" />
      <Skeleton variant="block" height={8} radius="none" className="mt-auto" />
    </div>
  );
}

/**
 * Program Detail while it loads (motion-matrix §7.9): the header band, the tab bar and the
 * first paint of the tab that opens (?tab=, Courses by default): the Courses list, or a tab's
 * intro, its blocks and the 320 sidebar.
 */
export function ProgramSkeleton({ program }: { program: Program }) {
  const [tab, setTab] = React.useState<ProgramTabId>(DEFAULT_PROGRAM_TAB);
  React.useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (isProgramTab(t)) setTab(t);
  }, []);
  const intro =
    tab === "courses"
      ? program.coursesIntro
      : tab === "certificates"
        ? program.certificatesIntro
        : tab === "faqs"
          ? program.faqsIntro
          : program.aboutIntro;
  return (
    <>
      <HeaderBandSkeleton
        kind="program"
        title={program.title}
        facts={[program.stats.courses, program.stats.duration, program.stats.org]}
        cardLines={1}
      />
      <div className="bg-sko-bg-page shadow-[inset_0_-1px_0_0_var(--color-border-subtle)]">
        <TabBarSkeleton tabs={[74, 102, 51, 59]} rule={false} />
      </div>
      <div className={BODY}>
        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5 lg:gap-6">
          <IntroSkeleton title={intro.title} lead={"lead" in intro ? (intro.lead as string) : undefined} />
          {tab === "courses" ? (
            <div className="flex flex-col gap-4">
              {program.courses.map((c) => (
                <CourseRowSkeleton key={c.id} open={Boolean(c.defaultOpen)} modules={c.modules?.length ?? 0} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} variant="block" height={i ? 64 : 160} radius="card" />
              ))}
            </div>
          )}
        </div>
        {tab === "courses" ? null : (
          <div className="flex flex-col gap-4 md:w-[320px] md:shrink-0">
            <Skeleton variant="block" height={166} radius="card" />
            <Skeleton variant="block" height={206} radius="card" />
          </div>
        )}
      </div>
    </>
  );
}
