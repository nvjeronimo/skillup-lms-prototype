"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/atoms/EmptyState";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformTabs, platformPanelId, platformTabId } from "@/components/platform/PlatformTabs";
import { SearchField } from "@/components/platform/my-learning/SearchField";
import {
  certificatesInProgress,
  earnedCertificates,
  earnedIssuedValue,
  groupCertificates,
  type CertificateProgram,
} from "@/lib/platform/certificates";
import { CertificatesByProgram } from "./CertificatesByProgram";
import { CertificatesProposal, ProposalPicker } from "./CertificatesProposals";
import { CertificatesSkeleton } from "./CertificatesSkeleton";

type CertificatesTab = "in-progress" | "earned";

const ID_BASE = "certificates";

const matches = (title: string, needle: string) => title.toLowerCase().includes(needle);

/**
 * Search, by title, within a tab. A course matches by its own title or its program's; a
 * program certificate comes along whenever its block has a match, so a block never loses its
 * program state to a search.
 */
function searchTab<T extends { kind: "course" | "program"; program?: CertificateProgram }>(
  items: T[],
  title: (item: T) => string,
  needle: string,
): T[] {
  if (!needle) return items;
  const hit = (t: T) =>
    matches(title(t), needle) || (!!t.program && matches(t.program.title, needle));
  const blocks = new Set(
    items.filter((t) => t.kind === "course" && hit(t)).map((t) => t.program?.slug),
  );
  return items.filter((t) => hit(t) || (t.kind === "program" && blocks.has(t.program?.slug)));
}

/**
 * Certificates (Nelson, 19 Oct 2026; tabs since 21 Oct, Figma 7584:94993): every certificate
 * of the learner, from the Dashboard's Certificates tile and the profile menu.
 * The title and its intro, then the Collection as on My Learning: DS Horizontal tabs
 * (Underline, a count badge) In progress and Earned, Earned selected first; under them Search
 * (by title or program, in the selected tab), full width on mobile.
 * In each tab, by program (since 29 Oct 2026, CertificatesByProgram): one Program card per
 * program the learner has a certificate in (its certificate in the body, its course
 * certificates behind a show / hide, as compact rows), then "Other courses". It replaced the
 * grid of large certificate cards with "Show all N" and the Grid / List toggle, which grew
 * confusing as certificates added up (Nelson, 29 Oct 2026). The tab counts are certificates,
 * not blocks.
 */
export function CertificatesView() {
  const [tab, setTab] = React.useState<CertificatesTab>("earned");
  const [query, setQuery] = React.useState("");
  // PROPOSALS (30 Oct 2026): 0 is the page as it is; 1–4 drop the tabs (CertificatesProposals).
  const [proposal, setProposal] = React.useState(0);
  React.useEffect(() => {
    const v = parseInt(new URLSearchParams(window.location.search).get("v") ?? "", 10);
    if (v >= 1 && v <= 5) setProposal(v - 1);
  }, []);
  const pick = React.useCallback((i: number) => {
    setProposal(i);
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(i + 1));
    window.history.replaceState(null, "", url);
  }, []);

  const needle = query.trim().toLowerCase();
  const earned = searchTab(earnedCertificates, (e) => e.certificate.title, needle);
  const inProgress = searchTab(certificatesInProgress, (c) => c.title, needle);
  const shown = tab === "earned" ? earned.length : inProgress.length;
  /** A program's certificate, earned, wherever the tab is: In progress links to it once issued. */
  const earnedProgram = (slug: string) =>
    earnedCertificates.find((e) => e.kind === "program" && e.program?.slug === slug);

  const tabs = [
    { id: "in-progress" as const, label: "In progress", count: certificatesInProgress.length },
    { id: "earned" as const, label: "Earned", count: earnedCertificates.length },
  ];
  const tabLabel = tabs.find((t) => t.id === tab)?.label ?? "";

  return (
    <PlatformPage
      current={null}
      className="px-layout-page-x pb-12 pt-layout-page-top md:pb-16 lg:pb-20"
      skeleton={<CertificatesSkeleton />}
    >
      <div className="sk-page-stack mx-auto flex w-full max-w-[1200px] flex-col gap-layout-section">
        <div data-arrive={0} className="flex flex-col gap-2">
          <h1 className="sk-text-headline-large-bold text-sko-text-default">My Certificates</h1>
          <p className="sk-text-body-large-regular text-sko-text-subtle">
            Everything you have earned, and what you are working towards.
          </p>
        </div>

        <section aria-label="My certificates" className="flex flex-col gap-layout-stack">
          {proposal === 0 ? (
            <>
              {/* The tabs on their 1px border/subtle rule, across the whole width (as My Learning). */}
              <div
                data-arrive={1}
                className="border-b border-sko-border-subtle pt-2 max-md:[&_[role=tab]]:min-h-0"
              >
                <PlatformTabs
                  tabs={tabs}
                  value={tab}
                  onChange={(id) => setTab(id as CertificatesTab)}
                  size="responsive"
                  rule="parent"
                  panels="selected"
                  idBase={ID_BASE}
                  ariaLabel="My Certificates"
                />
              </div>

              {/* Search on the right; it fills the width on mobile. */}
              <div data-arrive={2} className="flex items-center gap-2 md:justify-end">
                <SearchField
                  value={query}
                  onChange={setQuery}
                  label="Search certificates"
                  className="w-full md:w-[240px] lg:w-[320px]"
                />
              </div>

              <div
                data-arrive={3}
                role="tabpanel"
                id={platformPanelId(ID_BASE, tab)}
                aria-labelledby={platformTabId(ID_BASE, tab)}
              >
                {/* The program titles are h3 and the rows h4: this h2 keeps the outline. */}
                <h2 className="sr-only">{tabLabel}</h2>
                <p role="status" className="sr-only">
                  {needle
                    ? `${shown} ${shown === 1 ? "certificate matches" : "certificates match"} “${query.trim()}”`
                    : ""}
                </p>

                <div key={tab} className="sk-animate-fade sk-enter-only">
                  {shown === 0 ? (
                    <EmptyState
                      icon={Search}
                      title={
                        needle
                          ? `No certificates match “${query.trim()}”`
                          : `No certificates here yet`
                      }
                      description={
                        needle ? "Check the spelling or search for another title." : undefined
                      }
                    />
                  ) : (
                    <CertificatesByProgram
                      tab={tab}
                      earned={groupCertificates(earned, earnedIssuedValue)}
                      progress={groupCertificates(inProgress)}
                      earnedProgram={earnedProgram}
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 md:justify-end">
                <SearchField
                  value={query}
                  onChange={setQuery}
                  label="Search certificates"
                  className="w-full md:w-[240px] lg:w-[320px]"
                />
              </div>
              <div key={proposal}>
                <CertificatesProposal index={proposal} needle={needle} />
              </div>
            </>
          )}
        </section>
      </div>
      <ProposalPicker value={proposal} onChange={pick} />
    </PlatformPage>
  );
}
