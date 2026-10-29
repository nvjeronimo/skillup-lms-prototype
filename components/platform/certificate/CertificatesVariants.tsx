"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseCountBadge, CourseTypeBadge, DeliveryModeBadge, DifficultyBadge, ProviderBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import { CourseThumb } from "@/components/platform/my-learning/CourseThumb";
import { CertificateCard } from "@/components/platform/program/CertificatesTab";
import { CertificateDocument, certificateLearner } from "@/components/platform/program/CertificateDocument";
import { ProgramCertificateHero } from "@/components/platform/program/ProgramCertificateHero";
import { getProgramCertificate } from "@/lib/platform/catalog";
import type {
  CertificateInProgress,
  CertificateProgram,
  EarnedCertificate,
  GroupedCertificates,
  ProgramCertificateGroup,
} from "@/lib/platform/certificates";
import { programPageHref } from "@/lib/platform/hrefs";
import { myLearningPrograms } from "@/lib/platform/my-learning";
import { cn } from "@/lib/utils";

/**
 * Certificates page, three proposals (Nelson, 29 Oct 2026: "ainda está muito confuso, e ficará
 * ainda mais quando o learner tiver muitos"). Compared live with the picker (`?certs=`), the
 * current page stays the first option. Same data, same tabs, search and grouping by program;
 * only how a program and its course certificates are drawn changes.
 * - `program`: Nelson's idea. One card per program, as the My Learning Program card (dark
 *   hero), with the program certificate in the body and a show / hide of its course
 *   certificates as compact rows.
 * - `ledger`: one dense row per certificate, under collapsible program headers. No sheets.
 * - `shelf`: the programs as a list on the left, the selected one's certificates on the right
 *   (below desktop, the list first and the program on its own screen).
 */
export type CertificatesVariant = "current" | "program" | "ledger" | "shelf";

export const CERTIFICATES_VARIANTS: { id: CertificatesVariant; label: string }[] = [
  { id: "current", label: "Current" },
  { id: "program", label: "Program card" },
  { id: "ledger", label: "Compact list" },
  { id: "shelf", label: "List + detail" },
];

type Tab = "in-progress" | "earned";
type Item = EarnedCertificate | CertificateInProgress;

export interface VariantProps {
  tab: Tab;
  earned: GroupedCertificates<EarnedCertificate>;
  progress: GroupedCertificates<CertificateInProgress>;
  /** A program's issued certificate, whatever the tab. */
  earnedProgram: (slug: string) => EarnedCertificate | undefined;
}

const PROGRAM_MOCK = "No API says whether a program certificate is earned: counted here from the course rows";
const CARD = "rounded-card border border-sko-border-subtle bg-sko-bg-page";
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const isEarned = (i: Item): i is EarnedCertificate => "certificate" in i;
const titleOf = (i: Item) => (isEarned(i) ? i.certificate.title : i.title);
const issuedOn = (e: EarnedCertificate) => e.certificate.document.issuedOn;
const courseOf = (i: Item) => (i.program?.number ? `Course ${i.program.number} of ${i.program.total}` : undefined);

/* ── Shared pieces ───────────────────────────────────────────────────────────────────── */

/** A small sheet of the certificate, for rows. */
function Sheet({ e, className }: { e: EarnedCertificate; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[1123/794] shrink-0 overflow-hidden rounded-control border border-sko-border-subtle bg-sko-bg-subtle [container-type:inline-size]",
        className,
      )}
    >
      <div className="absolute inset-0">
        <CertificateDocument
          data={e.certificate.document}
          label={`Certificate of completion: ${certificateLearner(e.certificate.document)}, ${e.certificate.title}`}
        />
      </div>
    </div>
  );
}

/** View + Share, the two actions every earned row carries. */
function EarnedActions({ e, primary = false }: { e: EarnedCertificate; primary?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <ButtonLink
        href={e.viewHref}
        hierarchy={primary ? "primary" : "secondary"}
        size="sm"
        aria-label={`View certificate: ${e.certificate.title}`}
        className="max-md:h-11"
      >
        {primary ? "View certificate" : "View"}
      </ButtonLink>
      <CertificateShare target={{ title: e.certificate.title, document: e.certificate.document }} look="icon" up />
    </div>
  );
}

/** A course certificate as a compact row: sheet, title, course n of N · date, actions. */
function EarnedRow({ e, sheet = true }: { e: EarnedCertificate; sheet?: boolean }) {
  return (
    <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
        {sheet ? <Sheet e={e} className="w-16 md:w-20" /> : null}
        <div className="flex min-w-0 flex-col gap-0.5">
          <h4 className="sk-text-body-large-semibold text-sko-text-default">{e.certificate.title}</h4>
          <p className="sk-text-body-medium-regular text-sko-text-subtle">
            {[courseOf(e), `Issued ${issuedOn(e)}`].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
      <EarnedActions e={e} />
    </div>
  );
}

/** A certificate on the way as a compact row: title, bar and what it measures, to its page. */
function ProgressRow({ c }: { c: CertificateInProgress }) {
  return (
    <Link href={c.href} className="group flex items-center gap-4 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-6">
        <div className="flex min-w-0 flex-col gap-0.5 md:flex-1">
          <h4 className="sk-text-body-large-semibold text-sko-text-default group-hover:underline">{c.title}</h4>
          {courseOf(c) ? <p className="sk-text-body-medium-regular text-sko-text-subtle">{courseOf(c)}</p> : null}
        </div>
        <div className="flex flex-col gap-1 md:w-[260px]">
          <PlatformProgressBar value={c.percent} label={`${c.title}: ${c.detail}`} />
          <p className="sk-text-body-small-regular text-sko-text-subtle">{c.detail}</p>
        </div>
      </div>
      <Icon icon={ChevronRight} size={20} aria-hidden className="shrink-0 text-sko-icon-muted" />
    </Link>
  );
}

const Row = ({ item }: { item: Item }) => (isEarned(item) ? <EarnedRow e={item} /> : <ProgressRow c={item} />);

/** The program certificate's state, in one block: earned, on the way, or what it takes. */
function ProgramCertificateStatus({
  program,
  issued,
  compact = false,
}: {
  program: CertificateProgram;
  issued?: EarnedCertificate;
  compact?: boolean;
}) {
  const state = getProgramCertificate(program.slug);
  const total = state?.courses.length ?? program.total;
  const complete = state?.complete ?? 0;
  if (issued) {
    return (
      <div data-mock={PROGRAM_MOCK} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {compact ? null : <Sheet e={issued} className="w-28 md:w-32" />}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="sk-text-title-medium-semibold text-sko-text-default">Program certificate</p>
            <Badge variant="soft" color="success" leftIcon={CheckCircle2}>
              Earned
            </Badge>
          </div>
          <p className="sk-text-body-medium-regular text-sko-text-subtle">{issued.certificate.issuedLine}</p>
        </div>
        <EarnedActions e={issued} primary />
      </div>
    );
  }
  return (
    <div data-mock={PROGRAM_MOCK} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="sk-text-title-medium-semibold text-sko-text-default">Program certificate</p>
        <p className="sk-text-body-medium-regular text-sko-text-subtle">
          {complete} of {plural(total, "course", "courses")} complete
        </p>
      </div>
      <PlatformProgressBar value={total ? Math.round((complete / total) * 100) : 0} label={`${program.title}: ${complete} of ${total} courses complete`} />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="sk-text-body-medium-regular text-sko-text-subtle">Yours when all {total} courses are complete.</p>
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
    </div>
  );
}

/** The blocks of a tab, whatever the variant: programs first, then the courses of none. */
function blocksOf(p: VariantProps) {
  const g = p.tab === "earned" ? p.earned : p.progress;
  return {
    programs: g.programs as ProgramCertificateGroup<Item>[],
    standalone: g.standalone as Item[],
  };
}

const countLine = (tab: Tab, g: ProgramCertificateGroup<Item>) =>
  tab === "earned"
    ? `${g.courses.length} of ${plural(g.program.total, "course certificate", "course certificates")}`
    : `${plural(g.courses.length, "course", "courses")} in progress`;

/** The column labels over earned rows (desktop): the row grid, its words as labels. */
function LedgerHeader({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("sk-text-label-small-medium hidden grid-cols-[minmax(0,1fr)_160px_150px_106px] gap-x-4 text-sko-text-subtle md:grid", className)}
    >
      <span>Certificate</span>
      <span>Type</span>
      <span>Issued</span>
      <span />
    </div>
  );
}

/* ── A · Program card ────────────────────────────────────────────────────────────────── */

function ProgramCertificateCard({ tab, group, issued }: { tab: Tab; group: ProgramCertificateGroup<Item>; issued?: EarnedCertificate }) {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();
  const headingId = React.useId();
  const card = myLearningPrograms.find((p) => p.id === group.program.slug);
  const n = group.courses.length;
  return (
    <article aria-labelledby={headingId} className={cn(CARD, "overflow-hidden")}>
      <div className="flex flex-col lg:flex-row">
        {/* The hero, as the My Learning Program card: dark band, type line, thumb + title, badges. */}
        <div
          data-theme="dark"
          className="relative flex flex-col justify-between gap-4 overflow-hidden bg-sko-bg-subtle p-4 md:p-5 lg:w-[42%] lg:shrink-0 lg:px-6 lg:py-6"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[170px] -left-[170px] size-[340px] rounded-pill border-[56px] border-sko-bg-primary opacity-[0.08]"
          />
          <div className="relative flex flex-col gap-3">
            <div className="flex min-h-9 items-center justify-between gap-2">
              <CourseTypeBadge value="Program" />
              {card?.partners.length ? (
                <ul aria-label="Partners" className="flex items-center gap-3">
                  {card.partners.map((p) => (
                    <li key={p.name} className="flex">
                      <ProviderBadge value={p.name} type="logo" />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className="flex items-start gap-3">
              {card ? <CourseThumb initials={card.initials} imageSrc={card.imageSrc} className="size-14" /> : null}
              <h3 id={headingId} className="sk-text-title-large-semibold min-w-0 flex-1 text-sko-text-default">
                <Link href={programPageHref(group.program.slug)} className="hover:underline">
                  {group.program.title}
                </Link>
              </h3>
            </div>
          </div>
          <div className="relative flex flex-wrap items-center gap-2">
            {card ? <DeliveryModeBadge value={card.delivery} /> : null}
            {card ? <DifficultyBadge value={card.difficulty} /> : null}
            <CourseCountBadge count={group.program.total} />
          </div>
        </div>
        {/* The body: the program certificate, then the disclosure of its course certificates. */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 md:p-5 lg:p-6">
          <ProgramCertificateStatus program={group.program} issued={issued} />
          {n ? (
            <Button
              hierarchy="secondary"
              size="sm"
              rightIcon={ChevronDown}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
              className={cn("w-full justify-between max-md:h-11 [&_svg]:transition-transform", open && "[&_svg]:rotate-180")}
            >
              {open
                ? "Hide course certificates"
                : tab === "earned"
                  ? `Show ${n} of ${plural(group.program.total, "course certificate", "course certificates")}`
                  : `Show ${plural(n, "course", "courses")} in progress`}
            </Button>
          ) : (
            <p className="sk-text-body-medium-regular text-sko-text-subtle">No course certificates here yet.</p>
          )}
        </div>
      </div>
      {n ? (
        <div id={panelId} hidden={!open} className="border-t border-sko-border-subtle px-4 md:px-5 lg:px-6">
          {tab === "earned" ? <LedgerHeader className="pb-1 pt-4" /> : null}
          <ul className="divide-y divide-sko-border-subtle">
            {group.courses.map((item) => (
              <li key={item.id}>
                <LedgerRow item={item} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function OtherCourses({ tab, items, title }: { tab: Tab; items: Item[]; title: string }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby={`certs-other-${tab}`} className={cn(CARD, "px-4 py-2 md:px-5 lg:px-6")}>
      <h3 id={`certs-other-${tab}`} className="sk-text-title-medium-semibold py-3 text-sko-text-default">
        {title} <span className="text-sko-text-subtle">· {items.length}</span>
      </h3>
      {tab === "earned" ? <LedgerHeader className="border-t border-sko-border-subtle pb-1 pt-4" /> : null}
      <ul className={cn("divide-y divide-sko-border-subtle", tab !== "earned" && "border-t border-sko-border-subtle")}>
        {items.map((item) => (
          <li key={item.id}>
            <LedgerRow item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProgramCardVariant(p: VariantProps) {
  const { programs, standalone } = blocksOf(p);
  return (
    <div className="flex flex-col gap-layout-grid">
      {programs.map((g) => (
        <ProgramCertificateCard key={g.program.slug} tab={p.tab} group={g} issued={p.earnedProgram(g.program.slug)} />
      ))}
      <OtherCourses tab={p.tab} items={standalone} title={programs.length ? "Other courses" : "Course certificates"} />
    </div>
  );
}

/* ── B · Compact list ────────────────────────────────────────────────────────────────── */

function LedgerGroup({
  tab,
  title,
  meta,
  status,
  defaultOpen,
  children,
  count,
}: {
  tab: Tab;
  title: string;
  meta: string;
  status?: React.ReactNode;
  defaultOpen: boolean;
  count: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const panelId = React.useId();
  return (
    <section className={CARD}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-14 w-full items-center gap-3 rounded-card px-4 py-3 text-left transition-colors hover:bg-sko-bg-hover md:px-5"
        >
          <Icon
            icon={ChevronRight}
            size={20}
            aria-hidden
            className={cn("shrink-0 text-sko-icon-muted transition-transform duration-200", open && "rotate-90")}
          />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:items-center md:gap-3">
            <span className="sk-text-title-medium-semibold text-sko-text-default">{title}</span>
            <span className="sk-text-body-medium-regular text-sko-text-subtle">{meta}</span>
          </span>
          {status}
          <span className="sk-text-body-medium-semibold hidden w-10 shrink-0 text-right text-sko-text-subtle md:inline" aria-label={`${count} in ${tab === "earned" ? "Earned" : "In progress"}`}>
            {count}
          </span>
        </button>
      </h3>
      <div id={panelId} hidden={!open} className="border-t border-sko-border-subtle px-4 md:px-5">
        {children}
      </div>
    </section>
  );
}

function LedgerRow({ item, program = false }: { item: Item; program?: boolean }) {
  if (!isEarned(item)) return <ProgressRow c={item} />;
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-3 md:grid-cols-[minmax(0,1fr)_160px_150px_auto]">
      <div className="flex min-w-0 items-center gap-2">
        <h4 className={cn("min-w-0 text-sko-text-default md:truncate", program ? "sk-text-body-large-semibold" : "sk-text-body-large-regular")} title={item.certificate.title}>
          {item.certificate.title}
        </h4>
        {program ? (
          <Badge variant="soft" color="success" leftIcon={CheckCircle2}>
            Program
          </Badge>
        ) : null}
      </div>
      <p className="sk-text-body-medium-regular col-start-1 text-sko-text-subtle md:col-start-auto">{program ? "Program certificate" : courseOf(item) ?? "Course"}</p>
      <p className="sk-text-body-medium-regular col-start-1 text-sko-text-subtle md:col-start-auto">{issuedOn(item)}</p>
      <div className="col-start-2 row-span-3 row-start-1 md:col-start-auto md:row-span-1 md:row-start-auto">
        <EarnedActions e={item} />
      </div>
    </div>
  );
}

export function LedgerVariant(p: VariantProps) {
  const { programs, standalone } = blocksOf(p);
  return (
    <div className="flex flex-col gap-3">
      {p.tab === "earned" ? (
<LedgerHeader className="px-[21px]" />
      ) : null}
      {programs.map((g, i) => {
        const issued = p.earnedProgram(g.program.slug);
        const state = getProgramCertificate(g.program.slug);
        return (
          <LedgerGroup
            key={g.program.slug}
            tab={p.tab}
            title={g.program.title}
            meta={countLine(p.tab, g)}
            count={g.courses.length + (g.programItem ? 1 : 0)}
            defaultOpen={i === 0}
            status={
              issued ? (
                <Badge variant="soft" color="success" leftIcon={CheckCircle2}>
                  Program earned
                </Badge>
              ) : (
                <span className="sk-text-body-small-regular hidden whitespace-nowrap text-sko-text-subtle sm:inline">
                  {state?.complete ?? 0} of {g.program.total} courses complete
                </span>
              )
            }
          >
            <ul className="divide-y divide-sko-border-subtle">
              {p.tab === "earned" && issued ? (
                <li data-mock={PROGRAM_MOCK}>
                  <LedgerRow item={issued} program />
                </li>
              ) : null}
              {p.tab === "in-progress" && g.programItem && !isEarned(g.programItem) ? (
                <li data-mock={PROGRAM_MOCK}>
                  <ProgressRow c={{ ...g.programItem, title: "Program certificate" }} />
                </li>
              ) : null}
              {g.courses.map((item) => (
                <li key={item.id}>
                  <LedgerRow item={item} />
                </li>
              ))}
            </ul>
          </LedgerGroup>
        );
      })}
      {standalone.length ? (
        <LedgerGroup
          tab={p.tab}
          title={programs.length ? "Other courses" : "Course certificates"}
          meta={plural(standalone.length, "course", "courses")}
          count={standalone.length}
          defaultOpen={!programs.length}
        >
          <ul className="divide-y divide-sko-border-subtle">
            {standalone.map((item) => (
              <li key={item.id}>
                <LedgerRow item={item} />
              </li>
            ))}
          </ul>
        </LedgerGroup>
      ) : null}
    </div>
  );
}

/* ── C · List + detail ───────────────────────────────────────────────────────────────── */

const OTHER = "__other";

export function ShelfVariant(p: VariantProps) {
  const { programs, standalone } = blocksOf(p);
  const entries = [
    ...programs.map((g) => ({ id: g.program.slug, title: g.program.title, group: g as ProgramCertificateGroup<Item> | undefined, items: g.courses })),
    ...(standalone.length ? [{ id: OTHER, title: programs.length ? "Other courses" : "Course certificates", group: undefined, items: standalone }] : []),
  ];
  // Desktop opens on the first entry; below desktop the list shows first.
  const [selected, setSelected] = React.useState<string | null>(entries[0]?.id ?? null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const current = entries.find((e) => e.id === selected) ?? entries[0];
  if (!current) return null;
  const issued = current.group ? p.earnedProgram(current.group.program.slug) : undefined;
  const heroState = issued && p.tab === "earned" ? getProgramCertificate(current.id) : undefined;

  return (
    <div className="grid gap-layout-grid lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
      <nav aria-label="Certificates by program" className={cn(CARD, "p-2 lg:sticky lg:top-24", mobileOpen && "max-lg:hidden")}>
        <ul className="flex flex-col gap-1">
          {entries.map((e) => {
            const earnedProgram = e.group ? p.earnedProgram(e.id) : undefined;
            const state = e.group ? getProgramCertificate(e.id) : undefined;
            const active = e.id === current.id;
            return (
              <li key={e.id}>
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => {
                    setSelected(e.id);
                    setMobileOpen(true);
                  }}
                  className={cn(
                    "flex min-h-14 w-full items-center gap-3 rounded-control px-3 py-2.5 text-left transition-colors hover:bg-sko-bg-hover",
                    active && "lg:bg-sko-bg-subtle",
                  )}
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="sk-text-body-large-semibold text-sko-text-default">{e.title}</span>
                    <span className="sk-text-body-small-regular inline-flex items-center gap-1.5 text-sko-text-subtle">
                      {earnedProgram ? <Icon icon={CheckCircle2} size={14} aria-hidden className="text-sko-icon-success" /> : null}
                      {e.group
                        ? earnedProgram
                          ? "Program certificate earned"
                          : `${state?.complete ?? 0} of ${e.group.program.total} courses complete`
                        : plural(e.items.length, "certificate", "certificates")}
                    </span>
                  </span>
                  <span className="sk-text-body-medium-semibold shrink-0 text-sko-text-subtle">{e.items.length}</span>
                  <Icon icon={ChevronRight} size={18} aria-hidden className="shrink-0 text-sko-icon-muted lg:hidden" />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <section aria-labelledby="certs-shelf-title" className={cn("flex min-w-0 flex-col gap-layout-stack", !mobileOpen && "max-lg:hidden")}>
        <Button hierarchy="link" size="sm" leftIcon={ChevronLeft} onClick={() => setMobileOpen(false)} className="self-start max-md:h-11 lg:hidden">
          All programs
        </Button>
        {heroState ? (
          <ProgramCertificateHero state={heroState} titleAs="h3" titleId="certs-shelf-title" />
        ) : (
          <div className="flex flex-col gap-4">
            <h3 id="certs-shelf-title" className="sk-text-title-large-semibold text-sko-text-default">
              {current.group ? (
                <Link href={programPageHref(current.id)} className="hover:underline">
                  {current.title}
                </Link>
              ) : (
                current.title
              )}
            </h3>
            {current.group ? (
              <div className={cn(CARD, "p-4 md:p-5")}>
                <ProgramCertificateStatus program={current.group.program} issued={issued} compact />
              </div>
            ) : null}
          </div>
        )}
        {current.group ? (
          <p className="sk-text-body-medium-regular text-sko-text-subtle">{countLine(p.tab, current.group)}</p>
        ) : null}
        {current.items.length ? (
          p.tab === "earned" ? (
            <ul className="grid grid-cols-1 gap-layout-grid md:grid-cols-2">
              {(current.items as EarnedCertificate[]).map((e) => (
                <li key={e.id} className="flex">
                  <CertificateCard
                    certificate={{ ...e.certificate, viewHref: e.viewHref, issuedLine: [courseOf(e), `Issued ${issuedOn(e)}`].filter(Boolean).join(" · ") }}
                    label="Course certificate"
                    labelAs="p"
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <ul className={cn(CARD, "divide-y divide-sko-border-subtle px-4 md:px-5")}>
              {current.items.map((item) => (
                <li key={item.id}>
                  <Row item={item} />
                </li>
              ))}
            </ul>
          )
        ) : null}
      </section>
    </div>
  );
}
