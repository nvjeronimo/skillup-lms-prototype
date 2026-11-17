import * as React from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { HeaderBandSkeleton, TabBarSkeleton } from "@/components/platform/HeaderBandSkeleton";
import { DEFAULT_PROGRAM_TAB, isProgramTab, type Program, type ProgramTabId } from "@/lib/platform/program";
import styles from "./ProgramSkeleton.module.css";


/** The section intro of a tab: the headline-small title and its lead, as ghost lines. */
export function IntroSkeleton({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className={styles.intro}>
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
      className={styles.courseRow}
      style={{ height: `calc(var(--row) + ${open ? modules : 0} * var(--mod))` }}
    >
      <div className={styles.courseRowTop}>
        <Skeleton text="body-small-medium" width={96} />
        <Skeleton variant="block" width={67} height={28} radius="pill" />
      </div>
      <Skeleton text="body-large-semibold" width="55%" />
      <Skeleton text="body-small-regular" width="35%" />
      <Skeleton variant="block" height={8} radius="none" className={styles.courseRowBar} />
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
      <div className={styles.bar}>
        <TabBarSkeleton tabs={[74, 102, 51, 59]} rule={false} />
      </div>
      <div className={styles.body}>
        <div className={styles.main}>
          <IntroSkeleton title={intro.title} lead={"lead" in intro ? (intro.lead as string) : undefined} />
          {tab === "courses" ? (
            <div className={styles.stack}>
              {program.courses.map((c) => (
                <CourseRowSkeleton key={c.id} open={Boolean(c.defaultOpen)} modules={c.modules?.length ?? 0} />
              ))}
            </div>
          ) : (
            <div className={styles.stack}>
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} variant="block" height={i ? 64 : 160} radius="card" />
              ))}
            </div>
          )}
        </div>
        {tab === "courses" ? null : (
          <div className={styles.aside}>
            <Skeleton variant="block" height={166} radius="card" />
            <Skeleton variant="block" height={206} radius="card" />
          </div>
        )}
      </div>
    </>
  );
}
