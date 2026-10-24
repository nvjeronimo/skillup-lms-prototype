"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { Icon } from "@/lib/icons";
import { EmptyState } from "@/components/atoms/EmptyState";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { PlatformTabs, platformPanelId, platformTabId } from "@/components/platform/PlatformTabs";
import { SearchField } from "@/components/platform/my-learning/SearchField";
import { ViewToggle } from "@/components/platform/my-learning/ViewToggle";
import { CertificateCard } from "@/components/platform/program/CertificatesTab";
import { ProgramCertificateHero } from "@/components/platform/program/ProgramCertificateHero";
import { getProgramCertificate } from "@/lib/platform/catalog";
import {
  certificatesInProgress,
  earnedCertificates,
  type CertificateInProgress,
  type EarnedCertificate,
} from "@/lib/platform/certificates";
import type { MyLearningView } from "@/lib/platform/my-learning";
import { cn } from "@/lib/utils";
import { CertificatesSkeleton } from "./CertificatesSkeleton";

type CertificatesTab = "in-progress" | "earned";

const ID_BASE = "certificates";

/* Grid: 3 columns / 24 on desktop, 2 columns / 20 on tablet, 1 column / 16 on mobile (as My Learning). */
export const CERTIFICATES_GRID = "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6";
/* List: one column, 24 apart. Desktop only. */
const LIST = "hidden flex-col gap-6 lg:flex";

const kindLabel = (kind: "course" | "program") => (kind === "program" ? "Program certificate" : "Course certificate");
const matches = (title: string, needle: string) => title.toLowerCase().includes(needle);

/** The issue line of an earned card: a course of a program says which, after the date. */
const issuedLine = (e: EarnedCertificate) =>
  e.program
    ? `${e.certificate.issuedLine} Course ${e.program.number} of ${e.program.total}, ${e.program.title}.`
    : e.certificate.issuedLine;

/** A program's slug from its row id (`program-<slug>`). */
const programSlug = (id: string) => id.replace(/^program-/, "");

/**
 * One block of a tab: its heading (title-medium/Semibold) and what goes under it. Programs and
 * courses are two blocks (Nelson, 24 Oct 2026: tell program certificates from course ones).
 */
function Group({ id, title, count, children }: { id: string; title: string; count: number; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h3 id={id} className="sk-text-title-medium-semibold text-sko-text-default">
        {title} <span className="text-sko-text-subtle">· {count}</span>
      </h3>
      {children}
    </section>
  );
}

/** The program certificates of a tab: one large card each (the Program page's), stacked. */
function ProgramBlock({ ids }: { ids: string[] }) {
  return (
    <ul className="flex flex-col gap-6">
      {ids.map((id) => {
        const state = getProgramCertificate(programSlug(id));
        return state ? (
          <li key={id}>
            <ProgramCertificateHero state={state} titleAs="h4" />
          </li>
        ) : null;
      })}
    </ul>
  );
}

/**
 * A certificate on the way (Figma 05b, 7587:245385): a card linking to the course page, or to
 * the program certificate page that says what is missing. The eyebrow (kind · context), the
 * title, the bar (bg/info, never green before it is complete) and what it measures, a chevron.
 * `layout="list"` puts the bar beside its detail on one line, as the list rows do.
 */
function InProgressCard({ item, layout }: { item: CertificateInProgress; layout: "grid" | "list" }) {
  return (
    <Link
      href={item.href}
      className="sk-press-card flex h-full items-center gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4 transition-colors hover:border-sko-border-default md:px-5"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="sk-text-label-small-medium text-sko-text-subtle">
            {kindLabel(item.kind)}
            {item.context ? ` · ${item.context}` : ""}
          </p>
          <h3 className="sk-text-body-large-semibold text-sko-text-default">{item.title}</h3>
        </div>
        <div className={cn("flex flex-col gap-1", layout === "list" && "md:flex-row md:items-center md:gap-3")}>
          <PlatformProgressBar
            value={item.percent}
            label={`${item.title}: ${item.detail}`}
            className={layout === "list" ? "md:max-w-[320px] md:flex-1" : undefined}
          />
          <p className="sk-text-body-small-regular text-sko-text-subtle">{item.detail}</p>
        </div>
      </div>
      <Icon icon={ChevronRight} size={20} aria-hidden className="shrink-0 text-sko-icon-muted" />
    </Link>
  );
}

/** An earned certificate in the list view: no sheet, the title and issue line, a link to its page. */
function EarnedRow({ e }: { e: EarnedCertificate }) {
  return (
    <Link
      href={e.viewHref}
      className="sk-press-card flex items-center gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4 transition-colors hover:border-sko-border-default md:px-5"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="sk-text-label-small-medium text-sko-text-subtle">{kindLabel(e.kind)}</p>
        <h3 className="sk-text-body-large-semibold text-sko-text-default">{e.certificate.title}</h3>
        <p className="sk-text-body-medium-regular text-sko-text-subtle">{issuedLine(e)}</p>
      </div>
      <Icon icon={ChevronRight} size={20} aria-hidden className="shrink-0 text-sko-icon-muted" />
    </Link>
  );
}

/**
 * Certificates (Nelson, 19 Oct 2026; tabs since 21 Oct, Figma 7584:94993): every certificate
 * of the learner, from the Dashboard's Certificates tile and the profile menu.
 * The title and its intro, then the Collection as on My Learning: DS Horizontal tabs
 * (Underline, a count badge) In progress and Earned, Earned selected first; under them Search
 * (by title, in the selected tab) and, on desktop only, the Grid / List toggle on the right.
 * Below desktop the page is Grid only and the search fills the width on mobile.
 * In each tab, programs and courses apart (Nelson, 24 Oct 2026): "Program certificates" first,
 * one large card each (ProgramCertificateHero, as on the Program page: the sheet, the course
 * segments, the course in progress), then "Course certificates":
 * - Earned: the DS Certificate card (issued) in a grid, 3 / 2 / 1 columns, one height per row
 *   with the actions on the bottom edge. View opens the certificate's own page.
 * - In progress: one card per course on the way, in the same grid.
 * The Grid / List toggle applies to the course certificates.
 */
export function CertificatesView() {
  const [tab, setTab] = React.useState<CertificatesTab>("earned");
  const [view, setView] = React.useState<MyLearningView>("grid");
  const [query, setQuery] = React.useState("");

  const needle = query.trim().toLowerCase();
  const earned = earnedCertificates.filter((e) => matches(e.certificate.title, needle));
  const inProgress = certificatesInProgress.filter((c) => matches(c.title, needle));
  const shown = tab === "earned" ? earned.length : inProgress.length;
  // Programs and courses apart (Nelson, 24 Oct 2026): the program certificate is the goal.
  const earnedPrograms = earned.filter((e) => e.kind === "program");
  const earnedCourses = earned.filter((e) => e.kind === "course");
  const progressPrograms = inProgress.filter((c) => c.kind === "program");
  const progressCourses = inProgress.filter((c) => c.kind === "course");
  const listView = view === "list";

  const tabs = [
    { id: "in-progress" as const, label: "In progress", count: certificatesInProgress.length },
    { id: "earned" as const, label: "Earned", count: earnedCertificates.length },
  ];
  const tabLabel = tabs.find((t) => t.id === tab)?.label ?? "";

  return (
    <PlatformPage
      current={null}
      className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10"
      skeleton={<CertificatesSkeleton />}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 lg:gap-10">
        <div data-arrive={0} className="flex flex-col gap-2">
          <h1 className="sk-text-headline-large-bold text-sko-text-default">Certificates</h1>
          <p className="sk-text-body-large-regular text-sko-text-subtle">
            Everything you have earned, and what you are working towards.
          </p>
        </div>

        <section aria-label="My certificates" className="flex flex-col gap-6">
          {/* The tabs on their 1px border/subtle rule, across the whole width (as My Learning). */}
          <div data-arrive={1} className="border-b border-sko-border-subtle pt-2 max-md:[&_[role=tab]]:min-h-0">
            <PlatformTabs
              tabs={tabs}
              value={tab}
              onChange={(id) => setTab(id as CertificatesTab)}
              size="responsive"
              rule="parent"
              panels="selected"
              idBase={ID_BASE}
              ariaLabel="Certificates"
            />
          </div>

          {/* Search and the Grid / List toggle on the right; the search fills the width on mobile. */}
          <div data-arrive={2} className="flex items-center gap-2 md:justify-end">
            <SearchField
              value={query}
              onChange={setQuery}
              label="Search certificates"
              className="w-full md:w-[240px] lg:w-[320px]"
            />
            <ViewToggle view={view} onChange={setView} className="hidden shrink-0 lg:inline-flex" />
          </div>

          <div data-arrive={3} role="tabpanel" id={platformPanelId(ID_BASE, tab)} aria-labelledby={platformTabId(ID_BASE, tab)}>
            {/* The card titles are h3: this h2 keeps the outline h1 → h2 → h3. */}
            <h2 className="sr-only">{tabLabel}</h2>
            <p role="status" className="sr-only">
              {needle ? `${shown} ${shown === 1 ? "certificate matches" : "certificates match"} “${query.trim()}”` : ""}
            </p>

            <div key={tab} className="sk-animate-fade sk-enter-only">
              {shown === 0 ? (
                <EmptyState
                  icon={Search}
                  title={needle ? `No certificates match “${query.trim()}”` : `No certificates here yet`}
                  description={needle ? "Check the spelling or search for another title." : undefined}
                />
              ) : tab === "earned" ? (
                <div className="flex flex-col gap-8 lg:gap-10">
                  {earnedPrograms.length ? (
                    <Group id="certificates-earned-programs" title="Program certificates" count={earnedPrograms.length}>
                      <ProgramBlock ids={earnedPrograms.map((e) => e.id)} />
                    </Group>
                  ) : null}
                  {earnedCourses.length ? (
                    <Group id="certificates-earned-courses" title="Course certificates" count={earnedCourses.length}>
                      <ul className={cn(CERTIFICATES_GRID, listView && "lg:hidden")}>
                        {earnedCourses.map((e) => (
                          <li key={e.id} className="flex">
                            <CertificateCard
                              certificate={{ ...e.certificate, viewHref: e.viewHref, issuedLine: issuedLine(e) }}
                              label={kindLabel(e.kind)}
                              labelAs="p"
                              className="w-full"
                            />
                          </li>
                        ))}
                      </ul>
                      {listView ? (
                        <ul className={LIST}>
                          {earnedCourses.map((e) => (
                            <li key={e.id}>
                              <EarnedRow e={e} />
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </Group>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-col gap-8 lg:gap-10">
                  {progressPrograms.length ? (
                    <Group id="certificates-progress-programs" title="Program certificates" count={progressPrograms.length}>
                      <ProgramBlock ids={progressPrograms.map((c) => c.id)} />
                    </Group>
                  ) : null}
                  {progressCourses.length ? (
                    <Group id="certificates-progress-courses" title="Course certificates" count={progressCourses.length}>
                      <ul className={cn(CERTIFICATES_GRID, listView && "lg:hidden")}>
                        {progressCourses.map((c) => (
                          <li key={c.id} className="flex min-w-0 [&>a]:w-full">
                            <InProgressCard item={c} layout="grid" />
                          </li>
                        ))}
                      </ul>
                      {listView ? (
                        <ul className={LIST}>
                          {progressCourses.map((c) => (
                            <li key={c.id}>
                              <InProgressCard item={c} layout="list" />
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </Group>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </PlatformPage>
  );
}
