"use client";

import * as React from "react";
import Link from "next/link";
import { Award, CheckCircle2, ChevronDown } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { FilterChip } from "@/components/atoms/FilterChip";
import { CourseTypeBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { enrolments, type CourseLine, type Enrolment } from "@/lib/platform/certificate-enrolments";
import { earnedIssuedValue, type EarnedCertificate } from "@/lib/platform/certificates";
import { cn } from "@/lib/utils";
import { EarnedActions, Sheet } from "./CertificatesByProgram";

/**
 * PROPOSALS (Nelson, 30 Oct 2026): the Certificates page without the Earned / In progress tabs,
 * which split a program whose course certificates are issued while its own is not, and without
 * the Programs-then-Other-courses split. On one model (certificate-enrolments).
 *
 * Of the first four (One list, Ledger, Path, Shelf; in this branch's first commit) Nelson
 * kept the Ledger, with One list's grouping of a program's courses:
 *
 * 1 · Ledger: one row per certificate, earned or on the way; status and type are filters.
 * 2 · Ledger by program: the same rows, a program's certificate leading its course rows in one
 *     card, then the single courses in one card.
 */
export const PROPOSALS = ["Now", "Ledger", "Ledger by program"] as const;

const MOCK =
  "No API says whether a program certificate is earned: counted here from the course rows";
const CARD = "rounded-card border border-sko-border-subtle bg-sko-bg-page";
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const issuedOn = (e: EarnedCertificate) => e.certificate.document.issuedOn;

const matches = (e: Enrolment, needle: string) =>
  !needle ||
  e.title.toLowerCase().includes(needle) ||
  e.courses.some((c) => c.title.toLowerCase().includes(needle));

function NoMatch({ needle }: { needle: string }) {
  return (
    <p className="sk-text-body-large-regular py-10 text-center text-sko-text-subtle">
      {needle ? "No certificates match your search." : "No certificates here yet."}
    </p>
  );
}

/** How far an enrolment is, in its own words: courses for a program, percent for a course. */
const progressWords = (e: Enrolment) =>
  e.kind === "program"
    ? `${e.complete} of ${plural(e.courses.length, "course", "courses")} complete`
    : `${e.percent}% complete`;

/** The course to carry on with: the first started and not earned, else the first not started. */
/* ── 1 · Ledger ───────────────────────────────────────────────────────────────────── */

interface LedgerItem {
  id: string;
  title: string;
  type: "program" | "course";
  context: React.ReactNode;
  earned?: EarnedCertificate;
  percent: number;
  progress: string;
  href: string;
  action: string;
}

function ledgerItems(): LedgerItem[] {
  const items: LedgerItem[] = [];
  for (const e of enrolments) {
    if (e.kind === "program") {
      items.push({
        id: `p-${e.slug}`,
        title: e.title,
        type: "program",
        context: `Program certificate · ${plural(e.courses.length, "course", "courses")}`,
        earned: e.issued,
        percent: e.percent,
        progress: progressWords(e),
        href: e.href,
        action: "View program",
      });
    }
    for (const c of e.courses) {
      if (c.state === "not-started") continue;
      items.push({
        id: `c-${c.slug}`,
        title: c.title,
        type: "course",
        context:
          e.kind === "program" ? (
            <>
              Course {c.number} of {e.courses.length} ·{" "}
              <Link href={e.href} className="underline-offset-2 hover:underline">
                {e.title}
              </Link>
            </>
          ) : (
            "Course"
          ),
        earned: c.earned,
        percent: c.percent,
        progress: `${c.percent}% complete`,
        href: c.href,
        action: "Continue",
      });
    }
  }
  const date = (i: LedgerItem) => (i.earned ? earnedIssuedValue(i.earned) : 0);
  return items.sort(
    (a, b) => Number(!!b.earned) - Number(!!a.earned) || date(b) - date(a) || b.percent - a.percent,
  );
}

function EmptySheet() {
  return (
    <div className="flex aspect-[1123/794] w-16 shrink-0 items-center justify-center rounded-control border border-dashed border-sko-border-default bg-sko-bg-subtle md:w-20">
      <Icon icon={Award} size={20} aria-hidden className="text-sko-icon-muted" />
    </div>
  );
}

function Ledger({ needle }: { needle: string }) {
  const [status, setStatus] = React.useState<"all" | "earned" | "progress">("all");
  const [type, setType] = React.useState<"all" | "program" | "course">("all");
  const all = React.useMemo(ledgerItems, []);
  const searched = all.filter((i) => !needle || i.title.toLowerCase().includes(needle));
  const byStatus = (s: typeof status) =>
    searched.filter((i) => s === "all" || (s === "earned" ? !!i.earned : !i.earned));
  const list = byStatus(status).filter((i) => type === "all" || i.type === type);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div role="group" aria-label="Status" className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            count={searched.length}
            active={status === "all"}
            onClick={() => setStatus("all")}
          />
          <FilterChip
            label="Earned"
            count={byStatus("earned").length}
            active={status === "earned"}
            onClick={() => setStatus("earned")}
          />
          <FilterChip
            label="In progress"
            count={byStatus("progress").length}
            active={status === "progress"}
            onClick={() => setStatus("progress")}
          />
        </div>
        <div role="group" aria-label="Type" className="flex flex-wrap gap-2">
          <FilterChip
            label="Programs and courses"
            active={type === "all"}
            onClick={() => setType("all")}
          />
          <FilterChip
            label="Programs"
            active={type === "program"}
            onClick={() => setType("program")}
          />
          <FilterChip
            label="Courses"
            active={type === "course"}
            onClick={() => setType("course")}
          />
        </div>
      </div>
      {list.length ? (
        <div className={cn(CARD, "px-4 md:px-5")}>
          <div
            aria-hidden="true"
            className="sk-text-label-small-medium hidden grid-cols-[80px_minmax(0,1fr)_220px_200px] gap-x-4 border-b border-sko-border-subtle py-3 text-sko-text-subtle md:grid"
          >
            <span />
            <span>Certificate</span>
            <span>Status</span>
            <span />
          </div>
          <ul className="divide-y divide-sko-border-subtle">
            {list.map((i) => (
              <li
                key={i.id}
                data-mock={i.type === "program" ? MOCK : undefined}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-3 md:grid-cols-[80px_minmax(0,1fr)_220px_200px] md:gap-x-4"
              >
                {i.earned ? (
                  <Sheet
                    e={i.earned}
                    className="row-span-3 w-16 self-start md:row-span-1 md:w-20 md:self-center"
                  />
                ) : (
                  <div className="row-span-3 self-start md:row-span-1 md:self-center">
                    <EmptySheet />
                  </div>
                )}
                <div className="flex min-w-0 flex-col gap-0.5">
                  <h3 className="sk-text-body-large-semibold text-sko-text-default">{i.title}</h3>
                  <p className="sk-text-body-medium-regular text-sko-text-subtle">{i.context}</p>
                </div>
                <div className="col-start-2 flex flex-col gap-1 md:col-start-auto">
                  {i.earned ? (
                    <div className="flex flex-col items-start gap-1">
                      <Badge variant="soft" color="success" leftIcon={CheckCircle2}>
                        Earned
                      </Badge>
                      <span className="sk-text-body-medium-regular text-sko-text-subtle">
                        {issuedOn(i.earned)}
                      </span>
                    </div>
                  ) : (
                    <>
                      <PlatformProgressBar value={i.percent} label={`${i.title}: ${i.progress}`} />
                      <span className="sk-text-body-small-regular text-sko-text-subtle">
                        {i.progress}
                      </span>
                    </>
                  )}
                </div>
                <div className="col-start-2 flex md:col-start-auto md:justify-end">
                  {i.earned ? (
                    <EarnedActions e={i.earned} />
                  ) : (
                    <ButtonLink
                      href={i.href}
                      hierarchy="secondary"
                      size="sm"
                      className="max-md:h-11"
                    >
                      {i.action}
                    </ButtonLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <NoMatch needle={needle} />
      )}
    </div>
  );
}

/* ── 2 · Ledger by program (Nelson, 30 Oct 2026: "o Ledger mas com a One list a agrupar os
   cursos do program") ───────────────────────────────────────────────────────────────── */

type RowState = "earned" | "in-progress" | "not-started";
type StatusFilter = "all" | "earned" | "progress";
type TypeFilter = "all" | "program" | "single";

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
  kind: "program" | "single";
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
        context: `Program certificate · ${plural(e.courses.length, "course", "courses")}`,
        earned: e.issued,
        state: e.issued
          ? "earned"
          : e.complete > 0 || e.courses.some((c) => c.percent > 0)
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

/** The rows of a group that pass the filters; the program row leads whenever the group shows. */
function visibleRows(g: Group, status: StatusFilter, needle: string) {
  const groupHit = !needle || g.title.toLowerCase().includes(needle);
  const hit = (r: GroupRow) => groupHit || r.title.toLowerCase().includes(needle);
  return g.rows.filter((r) => hit(r) && stateMatches(r, status));
}

/** One certificate as a row: the sheet (or an empty one), title, status, actions. */
function CertificateRow({ r, lead = false }: { r: GroupRow; lead?: boolean }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-3 md:grid-cols-[80px_minmax(0,1fr)_220px_200px] md:gap-x-4">
      {r.earned ? (
        <Sheet
          e={r.earned}
          className="row-span-3 w-16 self-start md:row-span-1 md:w-20 md:self-center"
        />
      ) : (
        <div className="row-span-3 self-start md:row-span-1 md:self-center">
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
          <Link href={r.href} className="hover:underline">
            {r.title}
          </Link>
        </h4>
        <p className="sk-text-body-medium-regular text-sko-text-subtle">{r.context}</p>
      </div>
      <div className="col-start-2 flex flex-col gap-1 md:col-start-auto">
        {r.earned ? (
          <div className="flex flex-col items-start gap-1">
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
      <div className="col-start-2 flex md:col-start-auto md:justify-end">
        {r.earned ? (
          <EarnedActions e={r.earned} primary={lead} />
        ) : (
          <ButtonLink href={r.href} hierarchy="secondary" size="sm" className="max-md:h-11">
            {r.action}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

function ProgramGroup({ g, rows }: { g: Group; rows: GroupRow[] }) {
  const [open, setOpen] = React.useState(true);
  const panelId = React.useId();
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
            className="sk-text-body-medium-medium flex w-full items-center justify-between border-y border-sko-border-subtle px-4 py-2.5 text-sko-text-muted hover:bg-sko-bg-hover md:px-5"
          >
            <span>
              {g.rows.filter((r) => r.earned).length} of{" "}
              {plural(g.rows.length, "course certificate", "course certificates")} earned
            </span>
            <Icon
              icon={ChevronDown}
              size={20}
              aria-hidden
              className={cn("transition-transform", open && "rotate-180")}
            />
          </button>
          {/* The course rows sit one step in, on a rail: they belong to the program above. */}
          <ul
            id={panelId}
            hidden={!open}
            className="divide-y divide-sko-border-subtle py-1 pl-4 pr-4 md:pl-10 md:pr-5"
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

function GroupedLedger({ needle }: { needle: string }) {
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [type, setType] = React.useState<TypeFilter>("all");
  const groups = React.useMemo(groupsOf, []);
  const typed = groups.filter((g) => type === "all" || g.kind === type);
  const count = (s: StatusFilter) =>
    typed.reduce((n, g) => {
      const headerHit =
        g.header &&
        (!needle || g.title.toLowerCase().includes(needle)) &&
        stateMatches(g.header, s);
      return n + visibleRows(g, s, needle).length + (headerHit ? 1 : 0);
    }, 0);
  const shown = typed
    .map((g) => ({ g, rows: visibleRows(g, status, needle) }))
    .filter(
      ({ g, rows }) =>
        rows.length ||
        (g.header &&
          (!needle || g.title.toLowerCase().includes(needle)) &&
          stateMatches(g.header, status)),
    );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div role="group" aria-label="Status" className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            count={count("all")}
            active={status === "all"}
            onClick={() => setStatus("all")}
          />
          <FilterChip
            label="Earned"
            count={count("earned")}
            active={status === "earned"}
            onClick={() => setStatus("earned")}
          />
          <FilterChip
            label="In progress"
            count={count("progress")}
            active={status === "progress"}
            onClick={() => setStatus("progress")}
          />
        </div>
        <div role="group" aria-label="Type" className="flex flex-wrap gap-2">
          <FilterChip
            label="Programs and courses"
            active={type === "all"}
            onClick={() => setType("all")}
          />
          <FilterChip
            label="Programs"
            active={type === "program"}
            onClick={() => setType("program")}
          />
          <FilterChip
            label="Single courses"
            active={type === "single"}
            onClick={() => setType("single")}
          />
        </div>
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
                <section
                  key={g.id}
                  aria-labelledby="certs-single"
                  className={cn(CARD, "overflow-hidden")}
                >
                  <h3
                    id="certs-single"
                    className="sk-text-title-medium-semibold bg-sko-bg-subtle px-4 py-4 text-sko-text-default md:px-5"
                  >
                    {g.title} <span className="text-sko-text-subtle">· {rows.length}</span>
                  </h3>
                  <ul className="divide-y divide-sko-border-subtle border-t border-sko-border-subtle px-4 md:px-5">
                    {rows.map((r) => (
                      <li key={r.id}>
                        <CertificateRow r={r} />
                      </li>
                    ))}
                  </ul>
                </section>
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

export function CertificatesProposal({ index, needle }: { index: number; needle: string }) {
  return index === 1 ? <Ledger needle={needle} /> : <GroupedLedger needle={needle} />;
}

/* ── The picker (prototype harness chrome, not part of the design) ─────────────────── */

const PICKER_CSS = `
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;align-items:center;gap:2px;padding:4px;border-radius:999px;background:rgba(10,10,10,.82);-webkit-backdrop-filter:blur(12px) saturate(1.4);backdrop-filter:blur(12px) saturate(1.4);box-shadow:0 0 0 1px rgba(255,255,255,.08) inset,0 8px 24px rgba(0,0,0,.24),0 2px 6px rgba(0,0,0,.12);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;line-height:1;-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-highlight{position:absolute;top:4px;left:0;height:28px;border-radius:999px;background:rgba(255,255,255,.12);will-change:transform}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker[data-ready] .proto-picker-highlight{transition:transform 250ms cubic-bezier(.23,1,.32,1),width 250ms cubic-bezier(.23,1,.32,1)}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
@media (prefers-reduced-motion:reduce){.proto-picker[data-ready] .proto-picker-highlight{transition:none}}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-item{white-space:nowrap;position:relative;display:flex;align-items:center;height:28px;padding:0 12px;border:0;border-radius:999px;background:transparent;color:rgba(255,255,255,.55);font:inherit;cursor:pointer;transition:color 150ms ease-out}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-item:hover{color:rgba(255,255,255,.85)}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-item:active{transform:scale(.97)}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-item:focus-visible{outline:2px solid rgba(255,255,255,.4);outline-offset:2px}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-item[data-active]{color:#fff}
`;

export function ProposalPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (i: number) => void;
}) {
  const items = React.useRef<(HTMLButtonElement | null)[]>([]);
  const highlight = React.useRef<HTMLSpanElement>(null);
  const [ready, setReady] = React.useState(false);

  React.useLayoutEffect(() => {
    const move = () => {
      const el = items.current[value];
      if (!el || !highlight.current) return;
      highlight.current.style.width = `${el.offsetWidth}px`;
      highlight.current.style.transform = `translateX(${el.offsetLeft}px)`;
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [value]);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= PROPOSALS.length) onChange(n - 1);
      else if (e.key === "ArrowRight") onChange((value + 1) % PROPOSALS.length);
      else if (e.key === "ArrowLeft") onChange((value - 1 + PROPOSALS.length) % PROPOSALS.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [value, onChange]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PICKER_CSS }} />
      <nav
        className="proto-picker"
        aria-label="Prototype variants"
        data-ready={ready ? "" : undefined}
      >
        <span ref={highlight} className="proto-picker-highlight" aria-hidden="true" />
        {PROPOSALS.map((name, i) => (
          <button
            key={name}
            ref={(el) => {
              items.current[i] = el;
            }}
            type="button"
            className="proto-picker-item"
            data-active={i === value ? "" : undefined}
            aria-current={i === value ? "true" : undefined}
            onClick={() => onChange(i)}
          >
            {name}
          </button>
        ))}
      </nav>
    </>
  );
}
