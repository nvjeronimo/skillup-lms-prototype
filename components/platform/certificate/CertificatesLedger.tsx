"use client";

import * as React from "react";
import Link from "next/link";
import { Award, CheckCircle2, ChevronDown, ChevronRight, Search } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { EmptyState } from "@/components/atoms/EmptyState";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseTypeBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { PlatformSegmented } from "@/components/platform/PlatformSegmented";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import {
  CertificateDocument,
  certificateLearner,
} from "@/components/platform/program/CertificateDocument";
import { enrolments, type CourseLine, type Enrolment } from "@/lib/platform/certificate-enrolments";
import { earnedIssuedValue, type EarnedCertificate } from "@/lib/platform/certificates";
import { cn } from "@/lib/utils";

/**
 * The Certificates ledger (Nelson, 30 Oct 2026; chosen from the proposals of PR 437: the Ledger,
 * with One list's grouping of a program's courses). It replaced the Earned / In progress tabs,
 * which split a program whose course certificates are issued while its own is not, and the
 * Programs-then-Other-courses split.
 *
 * Two DS Button groups filter it: Programs | Single courses, then All | In progress | Earned.
 * One row per certificate, earned or on the way, under the column labels Certificate and
 * Status. A program is one card: its own certificate leads (bg/subtle), then a bar ("5 of 5
 * course certificates earned") shows or hides its course rows, one step in on a rail, every
 * course of the program, not started included. The single courses are one card, earned first.
 * Below md the course rows start folded, and a row with no certificate is a link to its page.
 */
const MOCK =
  "No API says whether a program certificate is earned: counted here from the course rows";
const CARD = "rounded-card border border-sko-border-subtle bg-sko-bg-page";
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const issuedOn = (e: EarnedCertificate) => e.certificate.document.issuedOn;

/** Nothing in the selected filters: the search's words when there is one, as before. */
function NoMatch({ needle }: { needle: string }) {
  return (
    <EmptyState
      icon={Search}
      title={needle ? `No certificates match “${needle}”` : "No certificates here yet"}
      description={
        needle ? "Check the spelling or search for another title." : "Try the other filters above."
      }
    />
  );
}

/** How far an enrolment is, in its own words: courses for a program, percent for a course. */
const progressWords = (e: Enrolment) =>
  e.kind === "program"
    ? `${e.complete} of ${plural(e.courses.length, "course", "courses")} complete`
    : `${e.percent}% complete`;

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
        {/* Every earned row says what opens (Nelson, 30 Oct 2026); only the hierarchy differs. */}
        View certificate
      </ButtonLink>
      <CertificateShare
        target={{ title: e.certificate.title, document: e.certificate.document }}
        look="icon"
        up
      />
    </div>
  );
}

function EmptySheet() {
  return (
    <div className="flex aspect-[1123/794] w-14 shrink-0 items-center justify-center rounded-control border border-dashed border-sko-border-default bg-sko-bg-subtle md:w-20">
      <Icon icon={Award} size={20} aria-hidden className="text-sko-icon-muted" />
    </div>
  );
}

type RowState = "earned" | "in-progress" | "not-started";
type StatusFilter = "all" | "progress" | "earned";
type TypeFilter = "program" | "single";

interface GroupRow {
  id: string;
  title: string;
  context: React.ReactNode;
  earned?: EarnedCertificate;
  state: RowState;
  percent: number;
  progress: string;
  href: string;
  action: string;
}

interface Group {
  id: string;
  kind: TypeFilter;
  /** A program: its own certificate, the group's first row. */
  header?: GroupRow;
  title: string;
  rows: GroupRow[];
}

const rowFor = (c: CourseLine, context: React.ReactNode): GroupRow => ({
  id: `c-${c.slug}`,
  title: c.title,
  context,
  earned: c.earned,
  state: c.state,
  percent: c.percent,
  progress: c.state === "not-started" ? "Not started" : `${c.percent}% complete`,
  href: c.href,
  action: c.state === "not-started" ? "View course" : "Continue",
});

function groupsOf(): Group[] {
  const programs: Group[] = enrolments
    .filter((e) => e.kind === "program")
    .map((e) => ({
      id: e.slug,
      kind: "program",
      title: e.title,
      header: {
        id: `p-${e.slug}`,
        title: e.title,
        context: plural(e.courses.length, "course", "courses"),
        earned: e.issued,
        state: e.issued
          ? "earned"
          : e.courses.some((c) => c.percent > 0)
            ? "in-progress"
            : "not-started",
        percent: e.percent,
        progress: progressWords(e),
        href: e.href,
        action: "View program",
      },
      rows: e.courses.map((c) => rowFor(c, `Course ${c.number} of ${e.courses.length}`)),
    }));
  const singles = enrolments.filter((e) => e.kind === "course");
  const date = (r: GroupRow) => (r.earned ? earnedIssuedValue(r.earned) : 0);
  const single: Group[] = singles.length
    ? [
        {
          id: "single",
          kind: "single",
          title: "Single courses",
          rows: singles
            .map((e) => rowFor(e.courses[0], "Course"))
            .sort(
              (a, b) =>
                Number(!!b.earned) - Number(!!a.earned) ||
                date(b) - date(a) ||
                b.percent - a.percent,
            ),
        },
      ]
    : [];
  return [...programs, ...single];
}

const stateMatches = (r: GroupRow, s: StatusFilter) =>
  s === "all" || (s === "earned" ? r.state === "earned" : r.state === "in-progress");

/** The course rows of a group that pass the filters. */
function visibleRows(g: Group, status: StatusFilter, needle: string) {
  const groupHit = !needle || g.title.toLowerCase().includes(needle);
  return g.rows.filter(
    (r) => (groupHit || r.title.toLowerCase().includes(needle)) && stateMatches(r, status),
  );
}

const headerShows = (g: Group, status: StatusFilter, needle: string) =>
  !!g.header &&
  (!needle || g.title.toLowerCase().includes(needle)) &&
  stateMatches(g.header, status);

/**
 * One certificate as a row.
 * Desktop: sheet · title and context · status · actions, under the column labels.
 * Mobile: a small sheet, then the title, its context and its status in one column; an earned
 * row keeps View + Share under them, any other row is a link to its page (the whole row, with a
 * chevron), so it carries no button.
 */
function CertificateRow({ r, lead = false }: { r: GroupRow; lead?: boolean }) {
  const linkRow = !r.earned;
  return (
    <div
      className={cn(
        "relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1.5 py-3 md:grid-cols-[80px_minmax(0,1fr)_220px_200px] md:items-center md:gap-x-4",
      )}
    >
      {r.earned ? (
        <Sheet e={r.earned} className="row-span-3 w-14 md:row-span-1 md:w-20" />
      ) : (
        <div className="row-span-3 md:row-span-1">
          <EmptySheet />
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-0.5">
        {lead ? <CourseTypeBadge value="Program" /> : null}
        <h4
          className={cn(
            lead ? "sk-text-title-medium-semibold" : "sk-text-body-large-regular",
            "text-sko-text-default",
          )}
        >
          <Link
            href={r.href}
            className={cn(
              "hover:underline",
              linkRow && "max-md:after:absolute max-md:after:inset-0 max-md:after:content-['']",
            )}
          >
            {r.title}
          </Link>
        </h4>
        <p className="sk-text-body-medium-regular text-sko-text-subtle">{r.context}</p>
      </div>
      {linkRow ? (
        <Icon
          icon={ChevronRight}
          size={20}
          aria-hidden
          className="row-span-2 self-center text-sko-icon-muted md:hidden"
        />
      ) : (
        <span className="md:hidden" />
      )}
      <div className="col-start-2 flex flex-col gap-1 md:col-start-auto">
        {r.earned ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:flex-col md:items-start">
            <Badge variant="soft" color="success" leftIcon={CheckCircle2}>
              Earned
            </Badge>
            <span className="sk-text-body-medium-regular text-sko-text-subtle">
              {issuedOn(r.earned)}
            </span>
          </div>
        ) : r.state === "not-started" ? (
          <span className="sk-text-body-medium-regular text-sko-text-subtle">Not started</span>
        ) : (
          <>
            <PlatformProgressBar value={r.percent} label={`${r.title}: ${r.progress}`} />
            <span className="sk-text-body-small-regular text-sko-text-subtle">{r.progress}</span>
          </>
        )}
      </div>
      <div
        className={cn(
          "col-start-2 md:col-start-auto md:flex md:justify-end",
          linkRow ? "hidden" : "flex pt-1 md:pt-0",
        )}
      >
        {r.earned ? (
          <EarnedActions e={r.earned} primary={lead} />
        ) : (
          <ButtonLink href={r.href} hierarchy="secondary" size="sm">
            {r.action}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

/** Below md the course rows start folded: a phone sees each program in one screen first. */
function useStartsOpen() {
  const [open, setOpen] = React.useState(true);
  React.useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setOpen(false);
  }, []);
  return [open, setOpen] as const;
}

function ProgramGroup({ g, rows }: { g: Group; rows: GroupRow[] }) {
  const [open, setOpen] = useStartsOpen();
  const panelId = React.useId();
  const earned = g.rows.filter((r) => r.earned).length;
  return (
    <section aria-label={g.title} data-mock={MOCK} className={cn(CARD, "overflow-hidden")}>
      <div className="bg-sko-bg-subtle px-4 md:px-5">
        {g.header ? <CertificateRow r={g.header} lead /> : null}
      </div>
      {rows.length ? (
        <>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
            className="sk-text-body-medium-medium flex min-h-11 w-full items-center justify-between gap-3 border-t border-sko-border-subtle px-4 py-2.5 text-left text-sko-text-muted hover:bg-sko-bg-hover md:min-h-0 md:px-5"
          >
            <span>
              {earned} of {plural(g.rows.length, "course certificate", "course certificates")}{" "}
              earned
              {rows.length < g.rows.length ? ` · ${rows.length} shown` : ""}
            </span>
            <Icon
              icon={ChevronDown}
              size={20}
              aria-hidden
              className={cn("shrink-0 transition-transform", open && "rotate-180")}
            />
          </button>
          {/* The course rows sit one step in, on a rail: they belong to the program above. */}
          <ul
            id={panelId}
            hidden={!open}
            className="divide-y divide-sko-border-subtle border-t border-sko-border-subtle py-1 pl-4 pr-4 md:pl-10 md:pr-5"
          >
            {rows.map((r) => (
              <li key={r.id} className="border-l-2 border-sko-border-subtle pl-3 md:pl-4">
                <CertificateRow r={r} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

export function CertificatesLedger({ needle }: { needle: string }) {
  const groups = React.useMemo(groupsOf, []);
  const hasPrograms = groups.some((g) => g.kind === "program");
  const [type, setType] = React.useState<TypeFilter>(hasPrograms ? "program" : "single");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const shown = groups
    .filter((g) => g.kind === type)
    .map((g) => ({ g, rows: visibleRows(g, status, needle) }))
    .filter(({ g, rows }) => rows.length || headerShows(g, status, needle));
  return (
    <div className="flex flex-col gap-4">
      {/* Two DS Button groups: what (programs or single courses), then which (all, in progress, earned). */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <PlatformSegmented
          label="Type"
          options={[
            { id: "program", label: "Programs" },
            { id: "single", label: "Single courses" },
          ]}
          value={type}
          onChange={setType}
          className="max-md:flex max-md:w-full max-md:[&>button]:flex-1"
        />
        <PlatformSegmented
          label="Status"
          options={[
            { id: "all", label: "All" },
            { id: "progress", label: "In progress" },
            { id: "earned", label: "Earned" },
          ]}
          value={status}
          onChange={setStatus}
          className="max-md:flex max-md:w-full max-md:[&>button]:flex-1"
        />
      </div>
      {shown.length ? (
        <>
          <div
            aria-hidden="true"
            className="sk-text-label-small-medium hidden grid-cols-[80px_minmax(0,1fr)_220px_200px] gap-x-4 px-5 text-sko-text-subtle md:grid"
          >
            <span />
            <span>Certificate</span>
            <span>Status</span>
            <span />
          </div>
          <div className="flex flex-col gap-layout-grid">
            {shown.map(({ g, rows }) =>
              g.kind === "program" ? (
                <ProgramGroup key={g.id} g={g} rows={rows} />
              ) : (
                <ul
                  key={g.id}
                  aria-label={g.title}
                  className={cn(CARD, "divide-y divide-sko-border-subtle px-4 md:px-5")}
                >
                  {rows.map((r) => (
                    <li key={r.id}>
                      <CertificateRow r={r} />
                    </li>
                  ))}
                </ul>
              ),
            )}
          </div>
        </>
      ) : (
        <NoMatch needle={needle} />
      )}
    </div>
  );
}
