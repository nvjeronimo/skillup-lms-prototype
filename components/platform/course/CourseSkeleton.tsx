"use client";

import * as React from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { HeaderBandSkeleton, TabBarSkeleton } from "@/components/platform/HeaderBandSkeleton";
import { IntroSkeleton } from "@/components/platform/program/ProgramSkeleton";
import { DEFAULT_COURSE_TAB, courseTabsFor, hasDatesTab, isCourseTab, type CourseDetail, type CourseModule, type CourseTabId } from "@/lib/platform/course-detail";
import { SHIFT_DATES } from "@/lib/platform/shift-dates";
import { cn } from "@/lib/utils";

const BODY = "mx-auto w-full max-w-[1280px] px-layout-band-x pb-8 pt-6 md:pb-12 md:pt-8 lg:pb-20 lg:pt-10";
/* The sidebar cards: measured from sample data (21 Oct 2026; phone / tablet and up). Seven
   different cards (team, dates, certificate, weekly goal…) not drawn line for line here. */
/** The Upcoming dates card (sixth), shown only with a Dates tab. */
const UPCOMING_DATES = "h-[315px] md:h-[299px]";
const SIDEBAR = [
  "h-[174px] md:h-[166px]",
  "h-[214px] md:h-[206px]",
  "h-[325px] md:h-[309px]",
  "h-[214px]",
  "h-[210px] md:h-[158px]",
  UPCOMING_DATES,
  "h-[274px] md:h-[312px]",
];

/** CourseAlert: the frame (radius 12, padding 16), the featured icon, ghost title and body, the action. */
function AlertSkeleton({
  title,
  body,
  stacked,
  dismissible,
  action,
}: {
  title: string;
  body: string;
  stacked: boolean;
  dismissible: boolean;
  action: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page p-[15px]", !stacked && "md:flex-row")}>
      <Skeleton variant="circle" size={20} />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
        <div className={cn("flex flex-col gap-1", dismissible && !stacked && "md:pr-8")}>
          <Skeleton variant="ghost" text="body-medium-semibold">{title}</Skeleton>
          <Skeleton variant="ghost" text="body-medium-regular">{body}</Skeleton>
        </div>
        {action ? <Skeleton variant="block" radius="control" className="h-11 w-full md:h-9 md:w-40" /> : null}
      </div>
    </div>
  );
}

/** ModuleList's row: number, ghost title and meta (and the lock reason below desktop); an open row its topics. */
function ModuleSkeleton({ mod }: { mod: CourseModule }) {
  const locked = mod.state === "locked";
  return (
    <div className="rounded-card border border-sko-border-subtle bg-sko-bg-page">
      <div className={cn("flex items-center gap-3 p-[15px]", mod.defaultOpen && "border-b border-sko-border-subtle")}>
        <Skeleton variant="circle" size={32} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Skeleton variant="ghost" text="body-large-semibold">{mod.title}</Skeleton>
          <Skeleton variant="ghost" text="body-small-regular">{`${mod.topicCount} · ${mod.duration}`}</Skeleton>
          {locked && mod.lockReason ? (
            <Skeleton variant="ghost" text="body-small-regular" className="lg:hidden">{mod.lockReason}</Skeleton>
          ) : null}
        </div>
        <Skeleton variant="block" width={locked ? 54 : 20} height={20} radius="inner" />
      </div>
      {mod.defaultOpen ? (
        <div className="px-[15px] py-1 md:px-[19px]">
          {(mod.lessons ?? []).map((lesson) => (
            <React.Fragment key={lesson.id}>
              <div className="px-3 py-2 md:pb-0 md:pr-0">
                <Skeleton variant="ghost" text="body-small-medium">{lesson.label}</Skeleton>
              </div>
              {lesson.topics.map((topic, i) => (
                <div
                  key={topic.id}
                  className={cn(
                    "flex items-start gap-2 py-3 md:items-center md:py-4",
                    i < lesson.topics.length - 1 && "border-b border-dashed border-sko-border-subtle pb-[11px] md:pb-[15px]",
                  )}
                >
                  <span className="flex h-6 shrink-0 items-center">
                    <Skeleton variant="circle" size={18} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col items-start gap-1 md:flex-row md:items-center md:gap-2">
                    <Skeleton variant="ghost" text="body-large-medium" className="min-w-0 md:flex-1">{topic.title}</Skeleton>
                    <span className="flex shrink-0 items-center gap-2">
                      <Skeleton variant="block" width={72} height={20} radius="pill" />
                      <Skeleton text="body-small-regular" width={40} />
                    </span>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Course Detail while it loads (motion-matrix §7.9): the header band, the tab bar with the
 * search, and the opening tab (?tab=, Course by default). On Course: the search on a phone, the
 * alerts, the intro and the module list as ghost lines (they wrap as the content will), and the
 * sidebar cards; the other tabs draw blocks. A course hosted by a partner is its header and the
 * note under it.
 */
export function CourseSkeleton({ course }: { course: CourseDetail }) {
  const [tab, setTab] = React.useState<CourseTabId>(DEFAULT_COURSE_TAB);
  React.useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (isCourseTab(t) && courseTabsFor(course).some((x) => x.id === t)) setTab(t);
  }, [course]);
  const dates = hasDatesTab(course);
  const header = (
    <HeaderBandSkeleton
      kind="course"
      title={course.title}
      facts={[course.stats.structure, course.stats.duration, course.stats.org]}
      cardLines={2}
    />
  );
  if (course.hosted) {
    return (
      <>
        {header}
        <div className={BODY}>
          <Skeleton variant="block" height={96} radius="none" />
        </div>
      </>
    );
  }
  return (
    <>
      {header}
      <TabBarSkeleton tabs={dates ? [56, 72, 48, 136] : [56, 72, 136]} search />
      <div className={BODY}>
        <Skeleton variant="block" radius="control" className="mb-4 h-11 md:hidden" />
        {course.passed ? <Skeleton variant="block" height={96} radius="none" className="mb-4 md:mb-5 lg:mb-6" /> : null}
        {tab === "course" ? (
          <div className="flex flex-col gap-layout-column md:flex-row md:items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-layout-stack">
              {dates && course.datesTab.missedAlert ? (
                <AlertSkeleton title={SHIFT_DATES.title} body={SHIFT_DATES.body} stacked={false} dismissible={false} action />
              ) : null}
              <AlertSkeleton title={course.update.title} body={course.update.body} stacked dismissible action={false} />
              <IntroSkeleton title={course.intro.title} lead={course.intro.lead} />
              <div className="flex flex-col gap-3">
                {course.modules.map((m) => (
                  <ModuleSkeleton key={m.id} mod={m} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 md:w-[320px] md:shrink-0">
              {/* Without a Dates tab, no Upcoming dates card (decision 036). */}
              {(dates ? SIDEBAR : SIDEBAR.filter((h) => h !== UPCOMING_DATES)).map((h, i) => (
                <Skeleton key={i} variant="block" radius="card" className={h} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-layout-stack">
            <Skeleton variant="block" height={160} radius="card" />
            <Skeleton variant="block" height={240} radius="card" />
            <Skeleton variant="block" height={240} radius="card" />
          </div>
        )}
      </div>
    </>
  );
}
