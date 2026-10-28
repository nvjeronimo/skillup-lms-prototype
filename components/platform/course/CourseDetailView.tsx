"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { PlatformTabs, platformPanelId, platformTabId } from "@/components/platform/PlatformTabs";
import { SectionIntro } from "@/components/platform/program/parts";
import {
  courseTabsFor,
  DEFAULT_COURSE_TAB,
  hasDatesTab,
  isCourseTab,
  type CourseDetail,
  type CourseTabId,
} from "@/lib/platform/course-detail";
import { useHasChanged } from "@/lib/motion/useHasChanged";
import { cn } from "@/lib/utils";
import { CourseAlert } from "./CourseAlert";
import { ShiftDatesAlert } from "./ShiftDatesAlert";
import { CourseHeader } from "./CourseHeader";
import { CourseSearch } from "./CourseSearch";
import { CourseSidebar } from "./CourseSidebar";
import { topicLinks } from "@/lib/platform/topic-links";
import { DatesTab } from "./DatesTab";
import { ModuleList } from "./ModuleList";
import { ProgressTab } from "./ProgressTab";
import { QaTab } from "./QaTab";
import { NONE, useSessionAdditions } from "@/lib/platform/session-additions";

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

  // Decision 036: a self-paced course has no Dates tab, so ?tab=dates opens the Course tab.
  const tabs = courseTabsFor(course);
  const param = searchParams.get("tab");
  const urlTab: CourseTabId = isCourseTab(param) && tabs.some((t) => t.id === param) ? param : DEFAULT_COURSE_TAB;
  const [active, setActive] = React.useState<CourseTabId>(urlTab);
  React.useEffect(() => setActive(urlTab), [urlTab]);
  // After the first tab change, a panel fades in as it is shown (display: none → shown restarts
  // the animation); on the page's first paint the page entrance is the only movement.
  const fadeIn = useHasChanged(active) ? "sk-animate-fade sk-enter-only" : undefined;

  const threadParam = searchParams.get("thread");
  const asked = useSessionAdditions((s) => s.questions[course.slug] ?? NONE);
  const openThread =
    active === "qa" && [...asked, ...course.qaTab.threads].some((t) => t.id === threadParam) ? threadParam : null;

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

  const links = React.useMemo(() => topicLinks(course.slug, course.progress.href), [course.slug, course.progress.href]);

  const panels: Record<CourseTabId, React.ReactNode> = {
    course: (
      <div className="flex flex-col gap-layout-column md:flex-row md:items-start">
        <div data-arrive={2} className="flex min-w-0 flex-1 flex-col gap-layout-stack">
          {/* Open edX shows Shift due dates on the course outline as on the Dates tab. No due dates
              are configured on SkillUp courses, so only where the course has a Dates tab (decision 036). */}
          {hasDatesTab(course) && course.datesTab.missedAlert ? <ShiftDatesAlert courseSlug={course.slug} /> : null}
          <CourseAlert tone="brand" layout="stacked" title={course.update.title} body={course.update.body} dismissible />
          <SectionIntro title={course.intro.title} lead={course.intro.lead} />
          <ModuleList modules={course.modules} topicHref={links.byId} />
        </div>
        <div data-arrive={3} className="md:w-[320px] md:shrink-0">
          <CourseSidebar course={course} />
        </div>
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
        <div data-arrive={0}>
          <CourseHeader course={course} />
        </div>
        <div data-arrive={1} className="mx-auto w-full max-w-[1280px] px-layout-band-x pb-8 pt-6 md:pb-12 md:pt-8 lg:pb-20 lg:pt-10">
          <div data-mock="Not designed yet: what this page shows under the header for a course hosted by a partner">
            <InlineAlert tone="info" title={course.hosted.dialog.title} description={course.hosted.dialog.body} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div data-arrive={0}>
        <CourseHeader course={course} className={cn(openThread && "max-md:hidden")} />
      </div>
      {/* With the header out of the mobile conversation view, the page keeps its one heading. */}
      {openThread ? <h1 className="sr-only md:hidden">{course.title}</h1> : null}

      <div data-arrive={1} className={cn("border-b border-sko-border-subtle bg-sko-bg-page", openThread && "max-md:hidden")}>
        {/* The room above the tabs equals the tab's own room to its bar (Nelson, 26 Oct 2026): the band's
            edge to the label's cap height = the baseline to the bottom of the bar, about 20. Mobile: 12
            above (the tab has none of its own); from tablet up the tab's own 12 top padding is enough. */}
        <div className="mx-auto flex w-full max-w-[1280px] items-end pl-layout-band-x pt-3 md:gap-5 md:px-layout-band-x md:pt-0 lg:gap-6">
          {/* DS Horizontal tabs: Size=sm on mobile, md from tablet up. Their own rule sits on the row's. */}
          <PlatformTabs
            tabs={tabs}
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

      <div className="mx-auto w-full max-w-[1280px] px-layout-band-x pb-8 pt-6 md:pb-12 md:pt-8 lg:pb-20 lg:pt-10">
        {/* Mobile: the search sits above every tab, not only Course (asked by Nelson on 8 Oct;
            the Figma screens draw it on the Course tab only). Not on an open Q&A conversation. */}
        {openThread ? null : (
          <div data-arrive={1} className="mb-4 md:hidden">
            <CourseSearch
              label={course.search.placeholder}
              topicHref={course.progress.href}
              slug={course.slug}
              variant="sheet"
            />
          </div>
        )}
        {/* PROPOSAL (10 Oct 2026): the passed state has no Figma screen; the page says so on every
            tab, with the note of the sample certificate page. Not on an open Q&A conversation. */}
        {course.passed && !openThread ? (
          <InlineAlert
            tone="info"
            title="Proposal: the passed course is not designed yet"
            description="No Figma screen shows a completed course. The success colors of the grade, the issued certificate with View and Download, and the missing weekly goal are a proposal built from parts that already exist."
            className="mb-4 md:mb-5 lg:mb-6"
          />
        ) : null}
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={platformPanelId(baseId, tab.id)}
            aria-labelledby={platformTabId(baseId, tab.id)}
            tabIndex={0}
            hidden={tab.id !== active}
            // The Course tab's column and sidebar rise on their own (2, 3); another tab rises whole.
            data-arrive={tab.id === "course" ? undefined : 2}
            className={fadeIn}
          >
            {panels[tab.id]}
          </div>
        ))}
      </div>
    </>
  );
}
