import * as React from "react";
import Link from "@/lib/router";
import { Award, ChevronDown, ChevronRight, Search } from "lucide-react";
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
import styles from "./CertificatesLedger.module.css";

/**
 * The Certificates ledger (Nelson, 30 Oct 2026; chosen from the proposals of PR 437: the Ledger,
 * with One list's grouping of a program's courses). It replaced the Earned / In progress tabs,
 * which split a program whose course certificates are issued while its own is not, and the
 * Programs-then-Other-courses split.
 *
 * Two DS Button groups filter it: Programs | Single courses, then All | In progress | Earned.
 * One row per certificate, earned or on the way, under the column labels Certificate and
 * Status. A program is one card: its own certificate leads (on the card's white), then a bar ("5 of 5
 * course certificates earned") shows or hides its course rows, one step in on a rail, every
 * course of the program, not started included. The single courses are one card, earned first.
 * Below md the course rows start folded, and a row with no certificate is a link to its page.
 */
const MOCK =
  "No API says whether a program certificate is earned: counted here from the course rows";
const CARD = styles.card;
/* Inner corners: card radius minus the 1 px border (concentric radius rule). */
const INNER_TOP = styles.innerTop;
const INNER_BOTTOM = styles.innerBottom;
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
        styles.sheet,
        className,
      )}
    >
      <div className={styles.sheetFill}>
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
    <div className={styles.earnedActions}>
      <ButtonLink
        href={e.viewHref}
        hierarchy={primary ? "primary" : "secondary"}
        size="sm"
        aria-label={`View certificate: ${e.certificate.title}`}
        className={styles.view}
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
    <div className={styles.emptySheet}>
      <Icon icon={Award} size={20} aria-hidden className={styles.mutedIcon} />
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
      className={styles.row}
    >
      {/* The thumb opens the course or program page too, as the title does (Nelson, 30 Oct
          2026); out of the tab order and hidden from readers, since the title link says it. */}
      <Link
        href={r.href}
        tabIndex={-1}
        aria-hidden="true"
        className={cn(styles.thumbLink, !r.earned && styles.thumbLinkEmpty)}
      >
        {r.earned ? <Sheet e={r.earned} className={styles.thumbSize} /> : <EmptySheet />}
      </Link>
      <div className={styles.titleBlock}>
        {lead ? <CourseTypeBadge value="Program" /> : null}
        <h4
          className={cn(
            lead ? "sk-text-title-medium-semibold" : "sk-text-body-large-regular",
            styles.textDefault,
          )}
        >
          <Link
            href={r.href}
            className={cn(
              styles.titleLink,
              linkRow && styles.rowLink,
            )}
          >
            {r.title}
          </Link>
        </h4>
        <p className={`sk-text-body-medium-regular ${styles.textSubtle}`}>{r.context}</p>
      </div>
      {linkRow ? (
        <Icon
          icon={ChevronRight}
          size={20}
          aria-hidden
          className={cn(styles.chevron, styles.mobileOnly)}
        />
      ) : (
        <span className={styles.mobileOnly} />
      )}
      <div className={styles.status}>
        {r.earned ? (
          <div className={styles.earned}>
            <Badge variant="soft" color="success" leftIcon={Award}>
              Earned
            </Badge>
            <span className={`sk-text-body-medium-regular ${styles.textSubtle}`}>
              {issuedOn(r.earned)}
            </span>
          </div>
        ) : r.state === "not-started" ? (
          <span className={`sk-text-body-medium-regular ${styles.textSubtle}`}>Not started</span>
        ) : (
          <>
            <PlatformProgressBar value={r.percent} label={`${r.title}: ${r.progress}`} />
            <span className={`sk-text-body-small-regular ${styles.textSubtle}`}>{r.progress}</span>
          </>
        )}
      </div>
      <div
        className={cn(
          styles.actionsCell,
          linkRow ? styles.actionsHidden : styles.actionsShown,
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

function ProgramGroup({ g, rows }: { g: Group; rows: GroupRow[] }) {
  // The course rows start folded on every screen: the page reads as one card per program first
  // (Nelson, 2 Nov 2026; until then only phones started folded).
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();
  const earned = g.rows.filter((r) => r.earned).length;
  return (
    // No overflow-hidden: it cut the Share menus off (31 Oct 2026). The header and the toggle round
    // their own corners instead (card radius minus the 1px border). The program row sits on the card's
    // own white like the rest, no bg/subtle band (Nelson, 2 Nov 2026).
    <section aria-label={g.title} data-mock={MOCK} className={CARD}>
      <div className={cn(styles.programHead, INNER_TOP, !rows.length && INNER_BOTTOM)}>
        {g.header ? <CertificateRow r={g.header} lead /> : null}
      </div>
      {rows.length ? (
        <>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "sk-text-body-medium-medium",
              styles.toggle,
              !open && INNER_BOTTOM,
            )}
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
              className={cn(styles.toggleIcon, open && styles.toggleIconOpen)}
            />
          </button>
          {/* The course rows sit one step in, on a rail: they belong to the program above. */}
          <ul
            id={panelId}
            hidden={!open}
            className={styles.courses}
          >
            {rows.map((r) => (
              <li key={r.id} className={styles.course}>
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
    <div className={styles.ledger}>
      {/* Two DS Button groups: what (programs or single courses), then which (all, in progress, earned). */}
      <div className={styles.filters}>
        <PlatformSegmented
          label="Type"
          options={[
            { id: "program", label: "Programs" },
            { id: "single", label: "Single courses" },
          ]}
          value={type}
          onChange={setType}
          className={styles.segmented}
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
          className={styles.segmented}
        />
      </div>
      {shown.length ? (
        <>
          <div
            aria-hidden="true"
            className={`sk-text-label-small-medium ${styles.columns}`}
          >
            <span />
            <span>Certificate</span>
            <span>Status</span>
            <span />
          </div>
          <div className={styles.groups}>
            {shown.map(({ g, rows }) =>
              g.kind === "program" ? (
                <ProgramGroup key={g.id} g={g} rows={rows} />
              ) : (
                <ul
                  key={g.id}
                  aria-label={g.title}
                  className={cn(CARD, styles.single)}
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
