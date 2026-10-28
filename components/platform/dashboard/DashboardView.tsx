"use client";

import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSectionHeader } from "@/components/platform/PlatformSectionHeader";
import {
  dashboardDue,
  dashboardGlance,
  dashboardJump,
} from "@/lib/platform/dashboard";
import type { DashboardResumeRow } from "@/lib/platform/dashboard-resume";
import { AssistantGlyph } from "@/components/assistant/AssistantGlyph";
import { useSalutation } from "@/lib/platform/greeting";
import { platformUser } from "@/lib/platform/user";
import { useLmsStore } from "@/lib/store";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DueItem } from "./DueItem";
import { GlanceCard } from "./GlanceCard";
import { JumpTile } from "./JumpTile";
import { PickUp } from "./PickUp";
import { StayInformed } from "./StayInformed";
import { openAssistant } from "@/lib/assistant/bus";
import { deadlinesThisWeek } from "@/lib/platform/calendar";

/**
 * Platform Dashboard (Figma handoff cards 01–03 of 6408:35150: desktop 6408:72361, tablet
 * 6408:72704, mobile 6418:127183), in the panel layout (Harbor and Fluent first, 25–26 Oct 2026;
 * every skin since 26 Oct 2026, Nelson: "the same layout and sections as Harbor and Fluent").
 * The greeting with the assistant's tip under it, the glance with its trend chips, then two rows:
 * Pick up where you left off (a list beside the chosen course, large) beside Stay informed (400),
 * and Due this week beside Jump somewhere (400, one tile a row). Below desktop each row stacks.
 * Each skin keeps its own colours, radius, type and motion (tokens/*.css); the glance tray inside
 * the page column (Harbor, Fluent) follows their left rail and stays theirs.
 * Page padding, the space between the blocks and between the two columns: the layout rhythm
 * (DS Layout/*, Nelson 25 Oct 2026); 80 / 64 / 48 below (desktop / tablet / mobile).
 *
 * Arrival (motion-matrix §7.9): DashboardSkeleton during the simulated load of a first visit,
 * then the greeting, the glance card, Pick up, Due and Jump rise in that order (`data-arrive`);
 * the glance figures count up and the progress bar fills as it shows.
 */
export function DashboardView({ resume }: { resume: DashboardResumeRow[] }) {
  const salutation = useSalutation();
  const showToast = useLmsStore((s) => s.showToast);
  const notInPrototype = (name: string) => showToast(`${name} is not part of this prototype yet`);

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
          {/* No icon before the greeting (Nelson, 27 Oct 2026). */}
          <h1 className="sk-text-headline-large-bold flex items-center truncate whitespace-nowrap text-sko-text-default">
            <span className="truncate">
              {/* Good morning / afternoon / evening, by the learner's local time (26 Oct 2026). */}
              {salutation}{" "}
              <span data-heading-em="" className="text-sko-text-subtle">
                {platformUser.firstName}.
              </span>
            </span>
          </h1>
          {/* The greeting tip: one useful sentence and a link, from the assistant. */}
          <p
            data-mock="Example: SkillUp courses have no due dates configured, only start and end (meeting 28 Oct 2026, decision 036)"
            className="sk-text-body-large-regular text-sko-text-muted"
          >
            {deadlinesThisWeek === 1 ? "One deadline is" : `${deadlinesThisWeek} deadlines are`} coming
            up this week. I can help you plan them.{" "}
            <button
              type="button"
              onClick={() => openAssistant("Help me plan my deadlines this week")}
              className="sk-text-body-large-semibold inline-flex items-center gap-1 align-bottom text-sko-text-primary"
            >
              {/* The assistant's mark after the words (Nelson, 27 Oct 2026): this link opens the assistant. */}
              <span className="underline underline-offset-2">Plan my week</span>
              <AssistantGlyph size={20} />
            </button>
          </p>
        </div>

        <div data-arrive={1}>
          <GlanceCard title={dashboardGlance.title} stats={dashboardGlance.stats} trends />
        </div>

        {/* Pick up beside Stay informed. */}
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
            <PickUp resume={resume} titleId="dashboard-pickup-title" />
          </section>
          <StayInformed className="flex flex-col lg:w-[400px] lg:shrink-0 lg:pt-12" />
        </div>

        {/* Due this week beside Jump somewhere (one tile a row there). */}
        <div className="flex flex-col gap-layout-column lg:flex-row lg:items-start">
          <section
            data-arrive={3}
            aria-labelledby="dashboard-due-title"
            className="flex min-w-0 flex-col gap-4 lg:flex-1"
          >
            <PlatformSectionHeader
              id="dashboard-due-title"
              title="Due"
              emphasis="this week"
              action={{ label: "View calendar", href: "/platform/calendar" }}
            />
            <ul
              data-mock="Example: SkillUp courses have no due dates configured, only start and end (meeting 28 Oct 2026, decision 036)"
              className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page"
            >
              {dashboardDue.map(({ id, ...item }) => (
                <DueItem key={id} {...item} />
              ))}
            </ul>
          </section>
          <section
            data-arrive={4}
            aria-labelledby="dashboard-jump-title"
            className="flex flex-col gap-4 lg:w-[400px] lg:shrink-0"
          >
            <PlatformSectionHeader id="dashboard-jump-title" title="Jump" emphasis="somewhere" />
            <ul
              data-mock="The Discussion count needs the notifications flag switched on"
              className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-1"
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
      </div>
    </PlatformPage>
  );
}
