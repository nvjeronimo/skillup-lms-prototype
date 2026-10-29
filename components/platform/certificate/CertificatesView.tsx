"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, Search } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
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
  earnedIssuedValue,
  groupCertificates,
  type CertificateInProgress,
  type CertificateProgram,
  type EarnedCertificate,
  type ProgramCertificateGroup,
} from "@/lib/platform/certificates";
import { programPageHref } from "@/lib/platform/hrefs";
import type { MyLearningView } from "@/lib/platform/my-learning";
import { cn } from "@/lib/utils";
import { CertificatesSkeleton } from "./CertificatesSkeleton";
import {
  CERTIFICATES_VARIANTS,
  LedgerVariant,
  ProgramCardVariant,
  ShelfVariant,
  type CertificatesVariant,
} from "./CertificatesVariants";
import { ProposalPicker } from "./ProposalPicker";

type CertificatesTab = "in-progress" | "earned";

const ID_BASE = "certificates";

/* Grid: 3 columns on desktop, 2 on tablet, 1 on mobile, grid-gap apart (as My Learning). */
export const CERTIFICATES_GRID = "grid grid-cols-1 gap-layout-grid md:grid-cols-2 lg:grid-cols-3";
/* List: one column, grid-gap apart. Desktop only. */
const LIST = "hidden flex-col gap-layout-grid lg:flex";
/* A program block shows the first row of its course certificates, then "Show all N" (Nelson,
   27 Oct 2026; it was four). The grid is 1 / 2 / 3 columns, so the row is 1 card on a phone, 2
   from md and 3 from lg (the list view, lg only, shows 3 rows too). Collapsed, the cards past
   the row are hidden by breakpoint; the button shows only where something is hidden. */
const ROW_HIDE = ["", "max-md:hidden", "max-lg:hidden"];
const rowHide = (i: number) => ROW_HIDE[i] ?? "hidden";
const MORE_SHOWN = ["hidden", "hidden", "md:hidden", "lg:hidden"];
const moreShown = (n: number) => MORE_SHOWN[n] ?? "";
/* The card shell every row of the page shares. */
const ROW =
  "sk-press-card flex items-center gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4 transition-colors hover:border-sko-border-default md:px-5";
const PROGRAM_MOCK = "No API says whether a program certificate is earned: counted here from the course rows";

const kindLabel = (kind: "course" | "program") => (kind === "program" ? "Program certificate" : "Course certificate");
const matches = (title: string, needle: string) => title.toLowerCase().includes(needle);
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The issue line of an earned card: a course of a program says which, after the date. */
const issuedLine = (e: EarnedCertificate) =>
  e.kind === "course" && e.program?.number
    ? `${e.certificate.issuedLine} Course ${e.program.number} of ${e.program.total}.`
    : e.certificate.issuedLine;

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
  const hit = (t: T) => matches(title(t), needle) || (!!t.program && matches(t.program.title, needle));
  const blocks = new Set(items.filter((t) => t.kind === "course" && hit(t)).map((t) => t.program?.slug));
  return items.filter((t) => hit(t) || (t.kind === "program" && blocks.has(t.program?.slug)));
}

/**
 * One block of a tab: its heading (title-medium/Semibold) and what goes under it. Here: the
 * courses of no program, after the program blocks.
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

/**
 * The program certificate inside its program's block: a row like the others, "Program
 * certificate" as its title (the program's name is the block heading just above; assistive
 * tech hears both). Earned: the Earned badge (icon and word, never colour alone) and the issue
 * line, to the certificate's page. On the way: the bar (bg/info) and "N of M courses complete",
 * to the page that says what is missing.
 */
function ProgramCertificateRow({
  program,
  earned,
  progress,
}: {
  program: CertificateProgram;
  earned?: EarnedCertificate;
  progress?: CertificateInProgress;
}) {
  const href = earned?.viewHref ?? progress?.href ?? "#";
  return (
    <Link href={href} data-mock={PROGRAM_MOCK} className={ROW}>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="sk-text-body-large-semibold text-sko-text-default">
              Program certificate<span className="sr-only">: {program.title}</span>
            </h4>
            {earned ? (
              <Badge variant="soft" color="success" leftIcon={CheckCircle2}>
                Earned
              </Badge>
            ) : null}
          </div>
          {earned ? (
            <p className="sk-text-body-medium-regular text-sko-text-subtle">{earned.certificate.issuedLine}</p>
          ) : null}
        </div>
        {progress ? (
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
            <PlatformProgressBar
              value={progress.percent}
              label={`${program.title}: ${progress.detail}`}
              className="md:max-w-[320px] md:flex-1"
            />
            <p className="sk-text-body-small-regular text-sko-text-subtle">{progress.detail}</p>
          </div>
        ) : null}
      </div>
      <Icon icon={ChevronRight} size={20} aria-hidden className="shrink-0 text-sko-icon-muted" />
    </Link>
  );
}

/** No program certificate in this tab yet: one quiet line, and the way to the program. */
function ProgramCertificateLine({ program }: { program: CertificateProgram }) {
  return (
    <div data-mock={PROGRAM_MOCK} className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <p className="sk-text-body-medium-regular text-sko-text-subtle">
        Program certificate when all {program.total} courses are complete.
      </p>
      <ButtonLink
        href={programPageHref(program.slug)}
        hierarchy="link"
        size="sm"
        rightIcon={ArrowRight}
        aria-label={`View program: ${program.title}`}
        className="max-md:h-11"
      >
        View program
      </ButtonLink>
    </div>
  );
}

/**
 * One program's block (Nelson, 26 Oct 2026: "group the course certificates that belonged to a
 * program"): the program as an h3 with what the tab holds of it, its certificate (a row when
 * it is in this tab, a quiet line when not), then its course certificates in course order,
 * the first row until "Show all N". An earned program certificate is the large card, as before
 * (Nelson, 26 Oct 2026: "o program certificate card podes deixar como antes"), at the top of
 * the block: its title is then the block's h3, and the meta line goes under it.
 */
function ProgramGroup<T extends EarnedCertificate | CertificateInProgress>({
  tab,
  group,
  meta,
  programRow,
  hero,
  renderGrid,
  renderList,
  listView,
}: {
  tab: CertificatesTab;
  group: ProgramCertificateGroup<T>;
  meta?: string;
  programRow?: React.ReactNode;
  /** The large card, which carries the program title (the block's h3, `headingId`). */
  hero?: (headingId: string) => React.ReactNode;
  renderGrid: (item: T) => React.ReactNode;
  renderList: (item: T) => React.ReactNode;
  listView: boolean;
}) {
  const [all, setAll] = React.useState(false);
  const headingId = `${ID_BASE}-${tab}-${group.program.slug}`;
  const coursesId = `${headingId}-courses`;
  const more = group.courses.length > 1;
  const courses = group.courses;
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      {hero ? (
        <>
          {hero(headingId)}
          {meta ? <p className="sk-text-body-medium-regular text-sko-text-subtle">{meta}</p> : null}
        </>
      ) : (
        <>
          <div className="flex flex-col gap-0.5">
            <h3 id={headingId} className="sk-text-title-medium-semibold text-sko-text-default">
              {group.program.title}
            </h3>
            {meta ? <p className="sk-text-body-medium-regular text-sko-text-subtle">{meta}</p> : null}
          </div>
          {programRow}
        </>
      )}
      {courses.length ? (
        <div id={coursesId} className="contents">
          <ul className={cn(CERTIFICATES_GRID, listView && "lg:hidden")}>
            {courses.map((item, i) => (
              <li key={item.id} className={cn("flex min-w-0 [&>a]:w-full", !all && rowHide(i))}>
                {renderGrid(item)}
              </li>
            ))}
          </ul>
          {listView ? (
            <ul className={LIST}>
              {courses.map((item, i) => (
                <li key={item.id} className={cn(!all && i >= 3 && "hidden")}>
                  {renderList(item)}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      {more ? (
        <Button
          hierarchy="link"
          size="sm"
          aria-expanded={all}
          aria-controls={coursesId}
          onClick={() => setAll((v) => !v)}
          className={cn("self-start max-md:h-11", !all && moreShown(courses.length))}
        >
          {all ? "Show fewer" : `Show all ${group.courses.length}`}
        </Button>
      ) : null}
    </section>
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
      className={cn(ROW, "h-full")}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="sk-text-label-small-medium text-sko-text-subtle">
            {kindLabel(item.kind)}
            {item.context ? ` · ${item.context}` : ""}
          </p>
          <h4 className="sk-text-body-large-semibold text-sko-text-default">{item.title}</h4>
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
    <Link href={e.viewHref} className={ROW}>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="sk-text-label-small-medium text-sko-text-subtle">{kindLabel(e.kind)}</p>
        <h4 className="sk-text-body-large-semibold text-sko-text-default">{e.certificate.title}</h4>
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
 * (by title or program, in the selected tab) and, on desktop only, the Grid / List toggle on
 * the right. Below desktop the page is Grid only and the search fills the width on mobile.
 * In each tab, by program (Nelson, 26 Oct 2026; before, programs and courses apart, 24 Oct):
 * one block per program the learner has a certificate in, the programs with their certificate
 * first, then the most recent; the program certificate row (or a quiet line until it is due),
 * then its course certificates in course order, the first row until "Show all N". Then "Other courses",
 * the courses of no program.
 * - Earned: the DS Certificate card (issued) in a grid, 3 / 2 / 1 columns, one height per row
 *   with the actions on the bottom edge. View opens the certificate's own page.
 * - In progress: one card per course on the way, in the same grid.
 * The Grid / List toggle applies to the course certificates. The tab counts are certificates,
 * not blocks.
 */
export function CertificatesView() {
  const [tab, setTab] = React.useState<CertificatesTab>("earned");
  const [view, setView] = React.useState<MyLearningView>("grid");
  const [query, setQuery] = React.useState("");
  // Proposals (Nelson, 29 Oct 2026): `?certs=program|ledger|shelf` draws the tab another way;
  // the picker shows only when the param is there.
  const [variant, setVariant] = React.useState<CertificatesVariant | null>(null);
  React.useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("certs");
    if (v !== null) setVariant(CERTIFICATES_VARIANTS.some((x) => x.id === v) ? (v as CertificatesVariant) : "current");
  }, []);
  const pickVariant = React.useCallback((v: CertificatesVariant) => {
    setVariant(v);
    const url = new URL(window.location.href);
    url.searchParams.set("certs", v);
    window.history.replaceState(null, "", url);
  }, []);

  const needle = query.trim().toLowerCase();
  const earned = searchTab(earnedCertificates, (e) => e.certificate.title, needle);
  const inProgress = searchTab(certificatesInProgress, (c) => c.title, needle);
  const shown = tab === "earned" ? earned.length : inProgress.length;
  const earnedGroups = groupCertificates(earned, earnedIssuedValue);
  const progressGroups = groupCertificates(inProgress);
  const listView = view === "list";
  /** A program's certificate, earned, wherever the tab is: In progress links to it once issued. */
  const earnedProgram = (slug: string) =>
    earnedCertificates.find((e) => e.kind === "program" && e.program?.slug === slug);

  const tabs = [
    { id: "in-progress" as const, label: "In progress", count: certificatesInProgress.length },
    { id: "earned" as const, label: "Earned", count: earnedCertificates.length },
  ];
  /** An earned program certificate: the large card, as before, its title the block's h3. */
  const heroFor = (slug: string, earnedHere: boolean) => {
    const state = earnedHere ? getProgramCertificate(slug) : undefined;
    return state ? (headingId: string) => <ProgramCertificateHero state={state} titleAs="h3" titleId={headingId} /> : undefined;
  };
  const tabLabel = tabs.find((t) => t.id === tab)?.label ?? "";
  const othersTitle = (blocks: number) => (blocks ? "Other courses" : "Course certificates");

  const earnedCard = (e: EarnedCertificate) => (
    <CertificateCard
      certificate={{ ...e.certificate, viewHref: e.viewHref, issuedLine: issuedLine(e) }}
      label={kindLabel(e.kind)}
      labelAs="p"
      className="w-full"
    />
  );
  const earnedRow = (e: EarnedCertificate) => <EarnedRow e={e} />;
  const progressCard = (c: CertificateInProgress) => <InProgressCard item={c} layout="grid" />;
  const progressRow = (c: CertificateInProgress) => <InProgressCard item={c} layout="list" />;

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
              ariaLabel="My Certificates"
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
            {variant && variant !== "current" ? null : (
              <ViewToggle view={view} onChange={setView} className="hidden shrink-0 lg:inline-flex" />
            )}
          </div>

          <div data-arrive={3} role="tabpanel" id={platformPanelId(ID_BASE, tab)} aria-labelledby={platformTabId(ID_BASE, tab)}>
            {/* The block headings are h3 and the card titles h4: this h2 keeps the outline. */}
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
              ) : variant && variant !== "current" ? (
                (() => {
                  const props = { tab, earned: earnedGroups, progress: progressGroups, earnedProgram };
                  return variant === "program" ? (
                    <ProgramCardVariant key={variant + tab} {...props} />
                  ) : variant === "ledger" ? (
                    <LedgerVariant key={variant + tab} {...props} />
                  ) : (
                    <ShelfVariant key={variant + tab + needle} {...props} />
                  );
                })()
              ) : tab === "earned" ? (
                <div className="flex flex-col gap-layout-stack">
                  {earnedGroups.programs.map((g) => (
                    <ProgramGroup
                      key={g.program.slug}
                      tab={tab}
                      group={g}
                      meta={`${g.courses.length} of ${plural(g.program.total, "course certificate", "course certificates")}`}
                      programRow={g.programItem ? undefined : <ProgramCertificateLine program={g.program} />}
                      hero={heroFor(g.program.slug, !!g.programItem)}
                      renderGrid={earnedCard}
                      renderList={earnedRow}
                      listView={listView}
                    />
                  ))}
                  {earnedGroups.standalone.length ? (
                    <Group
                      id="certificates-earned-courses"
                      title={othersTitle(earnedGroups.programs.length)}
                      count={earnedGroups.standalone.length}
                    >
                      <ul className={cn(CERTIFICATES_GRID, listView && "lg:hidden")}>
                        {earnedGroups.standalone.map((e) => (
                          <li key={e.id} className="flex">
                            {earnedCard(e)}
                          </li>
                        ))}
                      </ul>
                      {listView ? (
                        <ul className={LIST}>
                          {earnedGroups.standalone.map((e) => (
                            <li key={e.id}>{earnedRow(e)}</li>
                          ))}
                        </ul>
                      ) : null}
                    </Group>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-col gap-layout-stack">
                  {progressGroups.programs.map((g) => {
                    const issued = earnedProgram(g.program.slug);
                    return (
                      <ProgramGroup
                        key={g.program.slug}
                        tab={tab}
                        group={g}
                        meta={g.courses.length ? `${plural(g.courses.length, "course", "courses")} in progress` : undefined}
                        programRow={
                          g.programItem ? (
                            <ProgramCertificateRow program={g.program} progress={g.programItem} />
                          ) : issued ? (
                            <ProgramCertificateRow program={g.program} earned={issued} />
                          ) : (
                            <ProgramCertificateLine program={g.program} />
                          )
                        }
                        renderGrid={progressCard}
                        renderList={progressRow}
                        listView={listView}
                      />
                    );
                  })}
                  {progressGroups.standalone.length ? (
                    <Group
                      id="certificates-progress-courses"
                      title={othersTitle(progressGroups.programs.length)}
                      count={progressGroups.standalone.length}
                    >
                      <ul className={cn(CERTIFICATES_GRID, listView && "lg:hidden")}>
                        {progressGroups.standalone.map((c) => (
                          <li key={c.id} className="flex min-w-0 [&>a]:w-full">
                            {progressCard(c)}
                          </li>
                        ))}
                      </ul>
                      {listView ? (
                        <ul className={LIST}>
                          {progressGroups.standalone.map((c) => (
                            <li key={c.id}>{progressRow(c)}</li>
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
      {variant ? <ProposalPicker variants={CERTIFICATES_VARIANTS} value={variant} onChange={pickVariant} label="Certificates proposals" /> : null}
    </PlatformPage>
  );
}
