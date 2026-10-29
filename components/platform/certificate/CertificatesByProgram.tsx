"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseCountBadge, CourseTypeBadge, DeliveryModeBadge, DifficultyBadge, ProviderBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import { CourseThumb } from "@/components/platform/my-learning/CourseThumb";
import { CertificateDocument, certificateLearner } from "@/components/platform/program/CertificateDocument";
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
 * Certificates by program (Nelson, 29 Oct 2026, chosen from three proposals in PR 428: "ainda
 * está muito confuso, e ficará ainda mais quando o learner tiver muitos"). One card per program,
 * as the My Learning Program card: the dark hero (type, partners, thumb + title, badges) and a
 * body with the program certificate (earned: sheet, Earned, View certificate + Share; not yet:
 * the courses complete over a bar and View program). Under it a full-width button shows or
 * hides the program's course certificates as compact rows (sheet, title, type, issue date,
 * View + Share; column labels on desktop). The courses of no program follow in one card,
 * "Other courses". In progress uses the same cards with progress rows.
 */
type Tab = "in-progress" | "earned";
type Item = EarnedCertificate | CertificateInProgress;

export interface CertificatesByProgramProps {
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
function blocksOf(p: CertificatesByProgramProps) {
  const g = p.tab === "earned" ? p.earned : p.progress;
  return {
    programs: g.programs as ProgramCertificateGroup<Item>[],
    standalone: g.standalone as Item[],
  };
}

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

/* ── Program card ────────────────────────────────────────────────────────────────── */

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

export function CertificatesByProgram(p: CertificatesByProgramProps) {
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


/**
 * A course certificate as a row: the sheet, the title, its type ("Course 1 of 5"), the issue
 * date and View + Share. Desktop: one line under the column labels (LedgerHeader). Mobile: the
 * sheet on the left, the words and then the actions beside it.
 */
function LedgerRow({ item }: { item: Item }) {
  if (!isEarned(item)) return <ProgressRow c={item} />;
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1 py-3 md:grid-cols-[auto_minmax(0,1fr)_160px_150px_auto] md:gap-x-4">
      {/* The sheet, as the earlier rows (Nelson, 29 Oct 2026): beside the title, across the row's lines on mobile. */}
      <Sheet e={item} className="row-span-4 w-16 self-start md:row-span-1 md:w-20 md:self-center" />
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <h4 className="sk-text-body-large-regular min-w-0 text-sko-text-default md:truncate" title={item.certificate.title}>
          {item.certificate.title}
        </h4>
      </div>
      <p className="sk-text-body-medium-regular col-start-2 text-sko-text-subtle md:col-start-auto">{courseOf(item) ?? "Course"}</p>
      <p className="sk-text-body-medium-regular col-start-2 text-sko-text-subtle md:col-start-auto">{issuedOn(item)}</p>
      <div className="col-start-2 pt-1 md:col-start-auto md:pt-0">
        <EarnedActions e={item} />
      </div>
    </div>
  );
}
