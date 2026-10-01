"use client";

import { useRouter } from "next/navigation";
import { CourseRow } from "@/components/organisms/CourseRow";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSectionHeader } from "@/components/platform/PlatformSectionHeader";
import {
  dashboardDue,
  dashboardGlance,
  dashboardGreeting,
  dashboardJump,
  dashboardResume,
  dashboardStreak,
} from "@/lib/platform/dashboard";
import { platformUser } from "@/lib/platform/user";
import { useLmsStore } from "@/lib/store";
import { DueItem } from "./DueItem";
import { GlanceCard } from "./GlanceCard";
import { JumpTile } from "./JumpTile";
import { ResumeRow } from "./ResumeRow";
import { StreakCard } from "./StreakCard";

/**
 * Platform Dashboard (Figma: Desktop 6374:16006, Tablet 6397:16635, Mobile 6400:29528).
 * Greeting, Overview (Glance card + Streak card), Due this week + Pick up where you left
 * off, Jump somewhere. Page padding 40 / 32 / 24, 80 / 64 / 48 below, 32 / 24 / 20 between
 * the blocks (desktop / tablet / mobile).
 * Desktop: Overview is a row (Streak 360 wide) and Due (460) sits beside Resume.
 * Tablet: Overview stays a row (Streak 352), Due and Resume stack, four tiles in a row.
 * Mobile: everything stacks, the resume list uses the Resume row, tiles go 2 × 2.
 */
export function DashboardView() {
  const router = useRouter();
  const showToast = useLmsStore((s) => s.showToast);
  const notInPrototype = (name: string) => showToast(`${name} is not part of this prototype yet`);

  return (
    <PlatformPage current="dashboard" className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
      {/* The frames are drawn at 1280; wider windows keep the 1200 content width. */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
        {/* headline-large/Bold: 36/44, 30/38 on tablet, 24/32 on mobile. */}
        <h1 className="sk-text-display-md-bold text-sko-text-default">
          {dashboardGreeting.salutation}{" "}
          <br />
          <span className="text-sko-text-subtle">{platformUser.firstName}.</span>
        </h1>

        <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-6 lg:gap-8">
          <GlanceCard title={dashboardGlance.title} stats={dashboardGlance.stats} className="md:flex-1" />
          <StreakCard {...dashboardStreak} className="md:w-[352px] md:shrink-0 lg:w-[360px]" />
        </div>

        <div className="flex flex-col gap-5 md:gap-6 lg:flex-row lg:items-start lg:gap-8">
          <section aria-labelledby="dashboard-due-title" className="flex flex-col gap-4 lg:w-[460px] lg:shrink-0">
            <PlatformSectionHeader
              id="dashboard-due-title"
              title="Due"
              emphasis="this week"
              action={{ label: "View calendar", onClick: () => notInPrototype("Calendar") }}
            />
            <ul className="overflow-hidden rounded-lg border border-sko-border-subtle bg-sko-bg-page">
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
              {dashboardResume.map((course) => (
                <li key={course.id}>
                  {/* Mobile: the Resume row. Tablet and desktop: the DS Course Row. */}
                  <ResumeRow
                    className="md:hidden"
                    title={course.title}
                    deliveryMode={course.deliveryMode}
                    progressPct={course.progressPct}
                    onResume={() => router.push(course.href)}
                  />
                  <div className="hidden md:block">
                    <CourseRow
                      title={course.title}
                      deliveryMode={course.deliveryMode}
                      state="Active"
                      progressPct={course.progressPct}
                      onClick={() => router.push(course.href)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="dashboard-jump-title" className="flex flex-col gap-4">
          <PlatformSectionHeader id="dashboard-jump-title" title="Jump" emphasis="somewhere" />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
