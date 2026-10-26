"use client";

import { CourseRow } from "@/components/organisms/CourseRow";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSectionHeader } from "@/components/platform/PlatformSectionHeader";
import {
  dashboardDue,
  dashboardGlance,
  dashboardGreeting,
  dashboardJump,
} from "@/lib/platform/dashboard";
import type { DashboardResumeRow } from "@/lib/platform/dashboard-resume";
import { platformUser } from "@/lib/platform/user";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DueItem } from "./DueItem";
import { GlanceCard } from "./GlanceCard";
import { JumpTile } from "./JumpTile";
import { ResumeRow } from "./ResumeRow";
import { Sparkles } from "lucide-react";
import { Icon } from "@/lib/icons";
import { openAssistant } from "@/lib/assistant/bus";
import { deadlinesThisWeek } from "@/lib/platform/calendar";
import { useHarbor } from "@/lib/platform/harbor";
import { HarborPickUp } from "@/components/platform/harbor/HarborPickUp";
import { HarborStayInformed } from "@/components/platform/harbor/HarborStayInformed";

/**
 * Platform Dashboard (Figma handoff cards 01–03 of 6408:35150: desktop 6408:72361, tablet
 * 6408:72704, mobile 6418:127183).
 * Greeting, the glance card, Due this week + Pick up where you left off, Jump somewhere.
 * Page padding, the space between the blocks and between the two columns: the layout rhythm
 * (DS Layout/*, Nelson 25 Oct 2026); 80 / 64 / 48 below (desktop / tablet / mobile).
 * Desktop: Due (440) sits beside Resume (728). Tablet: Due and Resume stack, three tiles in
 * a row. Mobile: everything stacks, the resume list uses the Resume row, tiles go two a row.
 *
 * Resume list (10 Oct 2026): which row a course gets depends on the width of the list, not of
 * the window (a container query on each item). From 700px the DS Course Row, whose title
 * wraps to two lines at most there; below it the Resume row, which stacks the title over the
 * badge. That covers mobile as before and also the desktop layout between 1024 and ~1250,
 * where the list is narrower than on a tablet (472px at 1024) and the Course Row cannot hold
 * a long title, its badge, the bar and the button on one line.
 *
 * Each row says where the learner left off (12 Oct 2026): the module is the headline, the
 * course and its program the line under it. The rows come from lib/platform/dashboard-resume.
 *
 * Arrival (motion-matrix §7.9): DashboardSkeleton during the simulated load of a first visit,
 * then the greeting, the glance card, Due, Resume and Jump rise in that order (`data-arrive`;
 * Jump, usually below the fold, when it scrolls in); the glance figures count up and the
 * resume bars fill as they show.
 */
export function DashboardView({ resume }: { resume: DashboardResumeRow[] }) {
  const showToast = useLmsStore((s) => s.showToast);
  // Harbor (25 Oct 2026, after the DreamHost panel's home): a tip under the greeting, the glance's
  // trend chips, "Pick up" as a list beside a large panel with "Stay informed" next to it.
  const harbor = useHarbor();
  const notInPrototype = (name: string) => showToast(`${name} is not part of this prototype yet`);

  // Due this week: beside Pick up (panel layout, 400) or before it (440).
  const dueSection = (className: string) => (
    <section data-arrive={2} aria-labelledby="dashboard-due-title" className={className}>
      <PlatformSectionHeader
        id="dashboard-due-title"
        title="Due"
        emphasis="this week"
        action={{ label: "View calendar", href: "/platform/calendar" }}
      />
      <ul
        data-mock="Due dates come one course at a time (Dates API), and no course has them authored yet"
        className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page"
      >
        {dashboardDue.map(({ id, ...item }) => (
          <DueItem key={id} {...item} />
        ))}
      </ul>
    </section>
  );

  return (
    <PlatformPage
      current="dashboard"
      className="px-layout-page-x pb-12 pt-layout-page-top md:pb-16 lg:pb-20"
      skeleton={
        <DashboardSkeleton
          due={dashboardDue.length}
          resume={resume.length}
          jump={dashboardJump.length}
        />
      }
    >
      {/* The frames are drawn at 1280; wider windows keep the 1200 content width. */}
      <div className="sk-page-stack mx-auto flex w-full max-w-[1200px] flex-col gap-layout-section">
        {/* headline-large/Bold: 36/44, 30/38 on tablet, 24/32 on mobile. */}
        {/* Always one line (Nelson, 23 Oct 2026): a very long name is cut with an ellipsis. */}
        <div data-arrive={0} className="flex flex-col gap-2">
          <h1 className="sk-text-headline-large-bold flex items-center gap-3 truncate whitespace-nowrap text-sko-text-default">
            {harbor ? (
              <Icon
                icon={Sparkles}
                size={28}
                className="shrink-0 text-sko-icon-primary"
                aria-hidden
              />
            ) : null}
            <span className="truncate">
              {dashboardGreeting.salutation}{" "}
              <span data-heading-em="" className="text-sko-text-subtle">
                {platformUser.firstName}.
              </span>
            </span>
          </h1>
          {harbor ? (
            // The panel's greeting tip: one useful sentence and a link, from the assistant.
            <p
              data-mock="Due dates come one course at a time (Dates API), and no course has them authored yet"
              className="sk-text-body-large-regular text-sko-text-muted"
            >
              {deadlinesThisWeek === 1 ? "One deadline is" : `${deadlinesThisWeek} deadlines are`}{" "}
              coming up this week. I can help you plan them.{" "}
              <button
                type="button"
                onClick={() => openAssistant("Help me plan my deadlines this week")}
                className="sk-text-body-large-semibold text-sko-text-primary underline underline-offset-2"
              >
                Plan my week
              </button>
            </p>
          ) : null}
        </div>

        <div data-arrive={1}>
          <GlanceCard title={dashboardGlance.title} stats={dashboardGlance.stats} trends />
        </div>

        {harbor ? (
          <div className="flex flex-col gap-layout-column lg:flex-row lg:items-stretch">
            <section
              data-arrive={2}
              aria-labelledby="dashboard-pickup-title"
              className="flex min-w-0 flex-col gap-4 lg:flex-1"
            >
              <PlatformSectionHeader
                id="dashboard-pickup-title"
                title="Pick up"
                emphasis="where you left off"
                action={{ label: "My learning", href: "/platform/my-learning" }}
              />
              <HarborPickUp resume={resume} titleId="dashboard-pickup-title" />
            </section>
            {dueSection("flex flex-col gap-4 lg:w-[400px] lg:shrink-0")}
          </div>
        ) : null}

        {/* The panel layout (Harbor, Fluent; Nelson, 26 Oct 2026): Pick up beside Due this week, then
            Jump somewhere beside Stay informed. The other skins keep Due beside Pick up, Jump below. */}
        {harbor ? null : (
          <div className="flex flex-col gap-layout-column lg:flex-row lg:items-start">
            {dueSection("flex flex-col gap-4 lg:w-[440px] lg:shrink-0")}

            <section
              data-arrive={3}
              aria-labelledby="dashboard-resume-title"
              className="flex min-w-0 flex-col gap-4 lg:flex-1"
            >
              <PlatformSectionHeader
                id="dashboard-resume-title"
                title="Pick up"
                emphasis="where you left off"
                action={{ label: "My learning", href: "/platform/my-learning" }}
              />
              <ul className="flex flex-col gap-4">
                {resume.map((course) => (
                  <li key={course.id} className="[container-type:inline-size]">
                    {/* A list narrower than 700: the Resume row. From 700: the DS Course Row.
                      Resume is Secondary on every row, as the DS Course-Row and Resume-Row (Nelson, 13 Oct 2026). */}
                    <ResumeRow
                      className="[@container_(min-width:700px)]:hidden"
                      title={course.headline}
                      context={course.context}
                      next={course.next}
                      progressPct={course.progressPct}
                      href={course.href}
                      homeHref={course.homeHref}
                      imageSrc={course.imageSrc}
                      initials={course.initials}
                    />
                    <div className="hidden [@container_(min-width:700px)]:block">
                      <CourseRow
                        title={course.headline}
                        context={course.context}
                        next={course.next}
                        state="Active"
                        progressPct={course.progressPct}
                        href={course.href}
                        homeHref={course.homeHref}
                        imageSrc={course.imageSrc}
                        initials={course.initials}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        <div
          className={cn(harbor && "flex flex-col gap-layout-column lg:flex-row lg:items-stretch")}
        >
          <section
            data-arrive={4}
            aria-labelledby="dashboard-jump-title"
            className={cn("flex flex-col gap-4", harbor && "min-w-0 lg:flex-1")}
          >
            <PlatformSectionHeader id="dashboard-jump-title" title="Jump" emphasis="somewhere" />
            <ul
              data-mock="The Discussion count needs the notifications flag switched on"
              className="grid grid-cols-2 gap-4 md:grid-cols-3"
            >
              {dashboardJump.map((tile, i) => (
                <li key={tile.id} className="min-w-0">
                  <JumpTile
                    icon={tile.icon}
                    title={tile.title}
                    description={tile.description}
                    href={tile.href}
                    onClick={tile.href ? undefined : () => notInPrototype(tile.title)}
                  />
                </li>
              ))}
            </ul>
          </section>
          {harbor ? (
            <HarborStayInformed className="flex flex-col lg:w-[400px] lg:shrink-0 lg:pt-12" />
          ) : null}
        </div>
      </div>
    </PlatformPage>
  );
}
