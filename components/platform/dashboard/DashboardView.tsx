"use client";

import { CourseRow } from "@/components/organisms/CourseRow";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSectionHeader } from "@/components/platform/PlatformSectionHeader";
import {
  dashboardDue,
  dashboardGlance,
  dashboardGreeting,
  dashboardJump,
  dashboardResume,
} from "@/lib/platform/dashboard";
import { platformUser } from "@/lib/platform/user";
import { useLmsStore } from "@/lib/store";
import { DueItem } from "./DueItem";
import { GlanceCard } from "./GlanceCard";
import { JumpTile } from "./JumpTile";
import { ResumeRow } from "./ResumeRow";

/**
 * Platform Dashboard (Figma handoff cards 01–03 of 6408:35150: desktop 6408:72361, tablet
 * 6408:72704, mobile 6418:127183).
 * Greeting, the glance card, Due this week + Pick up where you left off, Jump somewhere.
 * Page padding 40 / 32 / 24, 80 / 64 / 48 below, 32 / 24 / 20 between the blocks
 * (desktop / tablet / mobile).
 * Desktop: Due (440) sits beside Resume (728). Tablet: Due and Resume stack, three tiles in
 * a row. Mobile: everything stacks, the resume list uses the Resume row, tiles go two a row.
 *
 * Resume list (10 Oct 2026): which row a course gets depends on the width of the list, not of
 * the window (a container query on each item). From 700px the DS Course Row, whose title
 * wraps to two lines at most there; below it the Resume row, which stacks the title over the
 * badge. That covers mobile as before and also the desktop layout between 1024 and ~1250,
 * where the list is narrower than on a tablet (472px at 1024) and the Course Row cannot hold
 * a long title, its badge, the bar and the button on one line.
 */
export function DashboardView() {
  const showToast = useLmsStore((s) => s.showToast);
  const notInPrototype = (name: string) => showToast(`${name} is not part of this prototype yet`);

  return (
    <PlatformPage current="dashboard" className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
      {/* The frames are drawn at 1280; wider windows keep the 1200 content width. */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
        {/* headline-large/Bold: 36/44, 30/38 on tablet, 24/32 on mobile. */}
        <h1 className="sk-text-headline-large-bold text-sko-text-default">
          {dashboardGreeting.salutation}{" "}
          {/* One line from tablet up; on mobile the name takes the second line, as drawn. */}
          <br className="md:hidden" />
          <span className="text-sko-text-subtle">{platformUser.firstName}.</span>
        </h1>

        <GlanceCard title={dashboardGlance.title} stats={dashboardGlance.stats} />

        <div className="flex flex-col gap-5 md:gap-6 lg:flex-row lg:items-start lg:gap-8">
          <section aria-labelledby="dashboard-due-title" className="flex flex-col gap-4 lg:w-[440px] lg:shrink-0">
            <PlatformSectionHeader
              id="dashboard-due-title"
              title="Due"
              emphasis="this week"
              action={{ label: "View calendar", onClick: () => notInPrototype("Calendar") }}
            />
            <ul
              data-mock="Due dates come one course at a time (Dates API), and no course has them authored yet"
              className="overflow-hidden rounded-lg border border-sko-border-subtle bg-sko-bg-page"
            >
              {dashboardDue.map(({ id, ...item }) => (
                <DueItem key={id} {...item} />
              ))}
            </ul>
          </section>

          <section aria-labelledby="dashboard-resume-title" className="flex min-w-0 flex-col gap-4 lg:flex-1">
            <PlatformSectionHeader
              id="dashboard-resume-title"
              title="Pick up"
              emphasis="where you left off"
              action={{ label: "My learning", href: "/platform/my-learning" }}
            />
            <ul className="flex flex-col gap-4">
              {dashboardResume.map((course, index) => (
                <li key={course.id} className="[container-type:inline-size]">
                  {/* A list narrower than 700: the Resume row. From 700: the DS Course Row.
                      One primary action in the list: the course touched last; the rest are Secondary. */}
                  <ResumeRow
                    className="[@container_(min-width:700px)]:hidden"
                    title={course.title}
                    deliveryMode={course.deliveryMode}
                    progressPct={course.progressPct}
                    href={course.href}
                    homeHref={course.homeHref}
                    emphasis={index === 0 ? "primary" : "secondary"}
                  />
                  <div className="hidden [@container_(min-width:700px)]:block">
                    <CourseRow
                      title={course.title}
                      deliveryMode={course.deliveryMode}
                      state="Active"
                      progressPct={course.progressPct}
                      href={course.href}
                    homeHref={course.homeHref}
                      emphasis={index === 0 ? "primary" : "secondary"}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="dashboard-jump-title" className="flex flex-col gap-4">
          <PlatformSectionHeader id="dashboard-jump-title" title="Jump" emphasis="somewhere" />
          <ul
            data-mock="The Discussion count needs the notifications flag switched on"
            className="grid grid-cols-2 gap-4 md:grid-cols-3"
          >
            {dashboardJump.map((tile) => (
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
      </div>
    </PlatformPage>
  );
}
