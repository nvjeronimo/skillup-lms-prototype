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
import { useHasChanged } from "@/lib/motion/useHasChanged";
import { cn } from "@/lib/utils";
import { SectionIntro } from "./parts";

/**
 * Program page (Figma handoff frame 6728:15050: Courses, Certificates, FAQs and About on
 * desktop 1280, tablet 960 and mobile 375). Full-bleed under the platform top bar: the dark
 * Program header across the page, then the tab bar (bg/page, on a 1px border/subtle rule)
 * and the tab content inside the 1200 content width. Side padding band-x (tokens/layout.css),
 * as the Course Detail shell.
 * Tab content: 40 / 32 / 32 above and 80 / 48 / 32 below.
 * - Courses: one full-width column, no sidebar (the course rows need the width).
 * - Certificates, FAQs, About: main column + the 320 sidebar on the right, column-gap apart;
 *   on mobile the three sidebar cards follow the content (tokens/layout.css).
 *
 * The tab lives in the URL (`?tab=courses|certificates|faqs|about`, Courses when absent or
 * unknown). The selection is kept locally as well so the panel swaps at once; the URL
 * follows through `router.replace`, and Back / Forward flow back in from the URL.
 * All four panels stay mounted (the inactive ones `hidden`) so open rows survive a tab change.
 *
 */
/* A tab's main column: its blocks are stack-gap apart (tokens/layout.css, Nelson 25 Oct 2026). */
const PANEL = "flex flex-col gap-layout-stack";

export function ProgramDetailView({ program }: { program: Program }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const baseId = React.useId();

  const param = searchParams.get("tab");
  const urlTab: ProgramTabId = isProgramTab(param) ? param : DEFAULT_PROGRAM_TAB;
  const [active, setActive] = React.useState<ProgramTabId>(urlTab);
  React.useEffect(() => setActive(urlTab), [urlTab]);
  // After the first tab change, a panel fades in as it is shown (display: none → shown restarts
  // the animation); on the page's first paint the page entrance is the only movement.
  const fadeIn = useHasChanged(active) ? "sk-animate-fade sk-enter-only" : undefined;

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
      <div data-arrive={0}>
        <ProgramHeader program={program} />
      </div>

      {/* The bar is bg/page across the page, on a 1px border/subtle rule (an inset shadow, as the
          tabs' own rule, so the bar keeps its height: 48, and 44 on mobile). */}
      <div data-arrive={1} className="bg-sko-bg-page shadow-[inset_0_-1px_0_0_var(--color-border-subtle)] forced-colors:border-b forced-colors:border-sko-border-subtle">
        {/* Mobile: 12 above the 32px tabs (44 in all). The tabs already grow their target to 44
            upwards, so the "larger targets" min-height is switched off here: it would make the bar 56. */}
        <div className="mx-auto w-full max-w-[1280px] pl-layout-band-x pt-3 max-md:[&_[role=tab]]:min-h-0 md:px-layout-band-x md:pt-0">
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

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-layout-column px-layout-band-x pb-8 pt-8 md:flex-row md:items-start md:pb-12 md:pt-8 lg:pb-20 lg:pt-10">
        <div data-arrive={2} className="min-w-0 flex-1">
          {PROGRAM_TABS.map((tab) => (
            <div
              key={tab.id}
              role="tabpanel"
              id={platformPanelId(baseId, tab.id)}
              aria-labelledby={platformTabId(baseId, tab.id)}
              tabIndex={0}
              hidden={tab.id !== active}
              className={fadeIn}
            >
              {panels[tab.id]}
            </div>
          ))}
        </div>
        {/* The Courses tab has no sidebar; the other three share it. It stays mounted (hidden on
            Courses) and fades in with the panel when it comes back. */}
        <div data-arrive={3} hidden={active === "courses"} className={cn("md:w-[320px] md:shrink-0", fadeIn)}>
          <ProgramSidebar program={program} />
        </div>
      </div>
    </>
  );
}
