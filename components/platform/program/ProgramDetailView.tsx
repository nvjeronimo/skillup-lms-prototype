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
 * Program Detail (Figma 6443:18721; Courses 6443:18722, Certificates 6449:21234, FAQs
 * 6448:20247, About 6448:24409). Full-bleed under the platform top bar: the dark Course
 * header across the page, then the tab bar and the tab content inside the 1200 content
 * width (40 side padding on desktop, 32 on tablet, 24 on mobile).
 * Tab content: main column + 320 sidebar, 40 apart, 32 above and 80 below.
 *
 * The tab lives in the URL (`?tab=courses|certificates|faqs|about`, Courses when absent or
 * unknown). The selection is kept locally as well so the panel swaps at once; the URL
 * follows through `router.replace`, and Back / Forward flow back in from the URL.
 * All four panels stay mounted (the inactive ones `hidden`) so open rows survive a tab change.
 *
 * Only the desktop frame is drawn. Tablet and mobile are a reflow of the same content: the
 * header stacks (progress card under the title), the sidebar cards move under the main column.
 */
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
      <div className="flex flex-col gap-6">
        <SectionIntro title={program.faqsIntro.title} />
        <DisclosureList items={program.faqs} mock="Program FAQs have no API" />
      </div>
    ),
    about: (
      <div className="flex flex-col gap-6">
        <SectionIntro title={program.aboutIntro.title} lead={program.aboutIntro.lead} />
        <DisclosureList items={program.about} mock="Program About sections have no API" />
      </div>
    ),
  };

  return (
    <>
      <ProgramHeader program={program} />

      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 lg:px-10">
        {/* DS Horizontal tabs, Size=md on every breakpoint, on their own rule. All four panels stay mounted. */}
        <PlatformTabs
          tabs={PROGRAM_TABS}
          value={active}
          onChange={selectTab}
          idBase={baseId}
          ariaLabel="Program sections"
        />
      </div>

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-6 pb-20 pt-8 md:px-8 lg:flex-row lg:items-start lg:px-10">
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
        <ProgramSidebar program={program} className="lg:w-[320px] lg:shrink-0" />
      </div>
    </>
  );
}
