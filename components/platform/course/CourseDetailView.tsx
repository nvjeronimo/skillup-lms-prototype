"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { PlatformTabs, platformPanelId, platformTabId } from "@/components/platform/PlatformTabs";
import { SectionIntro } from "@/components/platform/program/parts";
import {
  COURSE_TABS,
  DEFAULT_COURSE_TAB,
  isCourseTab,
  type CourseDetail,
  type CourseTabId,
} from "@/lib/platform/course-detail";
import { cn } from "@/lib/utils";
import { CourseAlert } from "./CourseAlert";
import { CourseHeader } from "./CourseHeader";
import { CourseSearch } from "./CourseSearch";
import { CourseSidebar } from "./CourseSidebar";
import { DatesTab } from "./DatesTab";
import { ModuleList } from "./ModuleList";
import { ProgressTab } from "./ProgressTab";
import { QaTab } from "./QaTab";

/**
 * Course Detail, self-paced (Figma handoff 6146:10226; Course 6406:39255, Progress
 * 6406:41528, Dates 6406:42688, Mentorship Q&A 6406:44434, with a tablet and a mobile screen
 * each). Full-bleed under the platform top bar: the light Course header across the page, the
 * tab row on bg/page with the course search on its right, then the tab content inside the
 * 1280 width — side padding 40 / 24 / 16, 32 / 24 / 16 above and 80 / 48 / 32 below
 * (desktop / tablet / mobile).
 *
 * The tab lives in the URL the way Program Detail does it (`?tab=progress|dates|qa`, Course
 * when absent or unknown); `?thread=` is the open Mentorship Q&A question. The selection is
 * kept locally as well so the panel swaps at once; the URL follows through `router.replace`,
 * and Back / Forward flow back in from the URL. All four panels stay mounted (the inactive
 * ones `hidden`) so open modules and a typed reply survive a tab change.
 *
 * Mobile: the tabs are DS Size=sm on their own row and the search moves to the top of the
 * tab content, on every tab; it opens as a full screen (components/platform/course/CourseSearch). An open question shows the conversation
 * alone: the course header and the tab row are not shown for that view.
 */
export function CourseDetailView({ course }: { course: CourseDetail }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const baseId = React.useId();

  const param = searchParams.get("tab");
  const urlTab: CourseTabId = isCourseTab(param) ? param : DEFAULT_COURSE_TAB;
  const [active, setActive] = React.useState<CourseTabId>(urlTab);
  React.useEffect(() => setActive(urlTab), [urlTab]);

  const threadParam = searchParams.get("thread");
  const openThread =
    active === "qa" && course.qaTab.threads.some((t) => t.id === threadParam) ? threadParam : null;

  function selectTab(tab: CourseTabId) {
    if (tab === active) return;
    setActive(tab);
    const next = new URLSearchParams(searchParams.toString());
    if (tab === DEFAULT_COURSE_TAB) next.delete("tab");
    else next.set("tab", tab);
    next.delete("thread");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const panels: Record<CourseTabId, React.ReactNode> = {
    course: (
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8 lg:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5 lg:gap-6">
          <CourseAlert tone="brand" layout="stacked" title={course.update.title} body={course.update.body} dismissible />
          <SectionIntro title={course.intro.title} lead={course.intro.lead} />
          <ModuleList modules={course.modules} topicHref={course.progress.href} />
        </div>
        <CourseSidebar course={course} className="md:w-[320px] md:shrink-0" />
      </div>
    ),
    progress: <ProgressTab course={course} />,
    dates: <DatesTab course={course} />,
    qa: <QaTab course={course} threadId={openThread} />,
  };

  // A course hosted by a partner is the header alone: the screens (I1, I2) stop there.
  if (course.hosted) {
    return (
      <>
        <CourseHeader course={course} />
        <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6 lg:px-10 lg:pb-20 lg:pt-8">
          <div data-mock="Not designed yet: what this page shows under the header for a course hosted by a partner">
            <InlineAlert tone="info" title={course.hosted.dialog.title} description={course.hosted.dialog.body} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CourseHeader course={course} className={cn(openThread && "max-md:hidden")} />
      {/* With the header out of the mobile conversation view, the page keeps its one heading. */}
      {openThread ? <h1 className="sr-only md:hidden">{course.title}</h1> : null}

      <div className={cn("border-b border-sko-border-subtle bg-sko-bg-page", openThread && "max-md:hidden")}>
        {/* Mobile: 12 above the 32px tabs (a 44px row). With the larger-targets setting the tabs are 44 themselves. */}
        <div className="mx-auto flex w-full max-w-[1280px] items-end pl-4 pt-3 max-md:[[data-large-targets]_&]:pt-0 md:gap-5 md:px-6 md:pt-0 lg:gap-6 lg:px-10">
          {/* DS Horizontal tabs: Size=sm on mobile, md from tablet up. Their own rule sits on the row's. */}
          <PlatformTabs
            tabs={COURSE_TABS}
            value={active}
            onChange={selectTab}
            size="responsive"
            idBase={baseId}
            ariaLabel="Course sections"
            className="-mb-px min-w-0 flex-1"
          />
          <CourseSearch label={course.search.placeholder} topicHref={course.progress.href} slug={course.slug} variant="popup" className="hidden w-[320px] shrink-0 pb-[7px] pt-2 md:block" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6 lg:px-10 lg:pb-20 lg:pt-8">
        {/* Mobile: the search sits above every tab, not only Course (asked by Nelson on 8 Oct;
            the Figma screens draw it on the Course tab only). Not on an open Q&A conversation. */}
        {openThread ? null : (
          <CourseSearch
            label={course.search.placeholder}
            topicHref={course.progress.href}
            slug={course.slug}
            variant="sheet"
            className="mb-4 md:hidden"
          />
        )}
        {/* PROPOSAL (10 Oct 2026): the passed state has no Figma screen; the page says so on every
            tab, with the note of the sample certificate page. Not on an open Q&A conversation. */}
        {course.passed && !openThread ? (
          <InlineAlert
            tone="info"
            title="Proposal: the passed course is not designed yet"
            description="No Figma screen shows a completed course. The success colours of the grade, the issued certificate with View and Download, and the missing weekly goal are a proposal built from parts that already exist."
            className="mb-4 md:mb-5 lg:mb-6"
          />
        ) : null}
        {COURSE_TABS.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={platformPanelId(baseId, tab.id)}
            aria-labelledby={platformTabId(baseId, tab.id)}
            tabIndex={0}
            hidden={tab.id !== active}
          >
            {panels[tab.id]}
          </div>
        ))}
      </div>
    </>
  );
}
