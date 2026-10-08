"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PlatformTabs, platformPanelId, platformTabId } from "@/components/platform/PlatformTabs";
import {
  DEFAULT_PROGRAM_TAB,
  PROGRAM_TABS,
  isProgramTab,
  type Program,
  type ProgramTabId,
} from "@/lib/platform/program";
import { CertificatesTab } from "./CertificatesTab";
import { CoursesTab } from "./CoursesTab";
import { DisclosureList } from "./DisclosureList";
import { ProgramHeader } from "./ProgramHeader";
import { ProgramSidebar } from "./ProgramSidebar";
import { SectionIntro } from "./parts";

/**
 * Program page (Figma handoff frame 6728:15050: Courses, Certificates, FAQs and About on
 * desktop 1280, tablet 960 and mobile 375). Full-bleed under the platform top bar: the dark
 * Program header across the page, then the tab bar (bg/page, on a 1px border/subtle rule)
 * and the tab content inside the 1200 content width. Side padding 40 / 24 / 16
 * (desktop / tablet / mobile), as the Course Detail shell.
 * Tab content: 32 / 24 / 16 above and 80 / 48 / 32 below.
 * - Courses: one full-width column, no sidebar (the course rows need the width).
 * - Certificates, FAQs, About: main column + the 320 sidebar on the right, 40 apart on
 *   desktop and 32 on tablet; on mobile the three sidebar cards follow the content, 16 apart.
 *
 * The tab lives in the URL (`?tab=courses|certificates|faqs|about`, Courses when absent or
 * unknown). The selection is kept locally as well so the panel swaps at once; the URL
 * follows through `router.replace`, and Back / Forward flow back in from the URL.
 * All four panels stay mounted (the inactive ones `hidden`) so open rows survive a tab change.
 *
 */
/* A tab's main column: its blocks are 24 / 20 / 16 apart (desktop / tablet / mobile). */
const PANEL = "flex flex-col gap-4 md:gap-5 lg:gap-6";

export function ProgramDetailView({ program }: { program: Program }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const baseId = React.useId();

  const param = searchParams.get("tab");
  const urlTab: ProgramTabId = isProgramTab(param) ? param : DEFAULT_PROGRAM_TAB;
  const [active, setActive] = React.useState<ProgramTabId>(urlTab);
  React.useEffect(() => setActive(urlTab), [urlTab]);

  function selectTab(tab: ProgramTabId) {
    if (tab === active) return;
    setActive(tab);
    const next = new URLSearchParams(searchParams.toString());
    if (tab === DEFAULT_PROGRAM_TAB) next.delete("tab");
    else next.set("tab", tab);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const panels: Record<ProgramTabId, React.ReactNode> = {
    courses: <CoursesTab program={program} />,
    certificates: <CertificatesTab program={program} />,
    faqs: (
      <div className={PANEL}>
        <SectionIntro title={program.faqsIntro.title} />
        <DisclosureList items={program.faqs} mock="Program FAQs have no API" />
      </div>
    ),
    about: (
      <div className={PANEL}>
        <SectionIntro title={program.aboutIntro.title} lead={program.aboutIntro.lead} />
        <DisclosureList items={program.about} mock="Program About sections have no API" />
      </div>
    ),
  };

  return (
    <>
      <ProgramHeader program={program} />

      {/* The bar is bg/page across the page, on a 1px border/subtle rule (an inset shadow, as the
          tabs' own rule, so the bar keeps its height: 48, and 44 on mobile). */}
      <div className="bg-sko-bg-page shadow-[inset_0_-1px_0_0_var(--color-border-subtle)] forced-colors:border-b forced-colors:border-sko-border-subtle">
        {/* Mobile: 12 above the 32px tabs (44 in all). The tabs already grow their target to 44
            upwards, so the "larger targets" min-height is switched off here: it would make the bar 56. */}
        <div className="mx-auto w-full max-w-[1280px] pl-4 pt-3 max-md:[&_[role=tab]]:min-h-0 md:px-6 md:pt-0 lg:px-10">
          {/* DS Horizontal tabs: Size=sm on mobile, md from tablet up, on their own rule. All four panels stay mounted. */}
          <PlatformTabs
            tabs={PROGRAM_TABS}
            value={active}
            onChange={selectTab}
            size="responsive"
            idBase={baseId}
            ariaLabel="Program sections"
          />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 pb-8 pt-4 md:flex-row md:items-start md:gap-8 md:px-6 md:pb-12 md:pt-6 lg:gap-10 lg:px-10 lg:pb-20 lg:pt-8">
        <div className="min-w-0 flex-1">
          {PROGRAM_TABS.map((tab) => (
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
        {/* The Courses tab has no sidebar; the other three share it. */}
        {active === "courses" ? null : <ProgramSidebar program={program} className="md:w-[320px] md:shrink-0" />}
      </div>
    </>
  );
}
