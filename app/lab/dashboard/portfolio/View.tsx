import * as React from "react";
import Link from "@/lib/router";
import { ArrowRight, Award, Check, CheckCircle2, Circle, Clock, Download, Hourglass, Lock, PlayCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, type BadgeColor } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { MockTag } from "@/components/lab/MockTag";
import { usePersona } from "@/components/lab/usePersona";
import { nextAction, type Enrolment, type EnrolmentStatus } from "@/lib/lab/dashboard-mock";
import type { TopicType } from "@/lib/types";
import styles from "./View.module.css";

/* ── Helpers ───────────────────────────────────────────────────────────────────────── */

type Filter = "all" | "in-progress" | "not-started" | "completed";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In progress" },
  { id: "not-started", label: "Not started" },
  { id: "completed", label: "Completed" },
];

/** Locked courses have not started either, so they sit under "Not started". */
function bucket(s: EnrolmentStatus): Exclude<Filter, "all"> {
  return s === "locked" ? "not-started" : s;
}

/** Grid order: what you are doing, what you could start, what waits, what is done. */
const ORDER: Record<EnrolmentStatus, number> = { "in-progress": 0, "not-started": 1, locked: 2, completed: 3 };

const STATUS: Record<EnrolmentStatus, { label: string; color: BadgeColor; icon: LucideIcon }> = {
  "in-progress": { label: "In progress", color: "brand", icon: PlayCircle },
  "not-started": { label: "Not started", color: "gray", icon: Circle },
  locked: { label: "Locked", color: "gray", icon: Lock },
  completed: { label: "Completed", color: "success", icon: CheckCircle2 },
};

/** Stale = an in-progress course untouched for a week or more (from the REAL `last_visited`). */
function isStale(e: Enrolment): boolean {
  if (e.status !== "in-progress") return false;
  if (/month|year/.test(e.lastActive)) return true;
  const days = /(\d+)\s+days?\s+ago/.exec(e.lastActive);
  if (days) return Number(days[1]) >= 7;
  const weeks = /(\d+)\s+weeks?\s+ago/.exec(e.lastActive);
  return weeks !== null;
}

function activityLine(e: Enrolment): string {
  if (e.lastActive === "—") return "Not opened yet";
  if (e.lastActive === "Never opened") return "Not opened yet";
  return `Last activity: ${e.lastActive.charAt(0).toLowerCase()}${e.lastActive.slice(1)}`;
}

/** A link dressed as DS Button Brand (md, 44px). Button renders a <button>, so links get this. */
function linkButton(hierarchy: "primary" | "secondary") {
  return cn(
    "sk-text-body-medium-semibold",
    styles.linkButton,
    hierarchy === "primary" ? styles.linkPrimary : styles.linkSecondary,
  );
}

/* ── Pick up strip ─────────────────────────────────────────────────────────────────── */

function PickUp({ e }: { e: Enrolment }) {
  const starting = e.status === "not-started";
  const stale = isStale(e);
  return (
    <section
      aria-labelledby="pickup-h"
      className={styles.pickUp}
    >
      <div className={styles.pickUpMain}>
        <h2 id="pickup-h" className={`sk-text-body-small-semibold ${styles.eyebrow}`}>
          {starting ? "Start here" : "Pick up"}
        </h2>
        <p className={`sk-text-body-large-semibold ${styles.heading}`}>{e.title}</p>
        {e.nextTopic ? (
          <p className={styles.nextLine}>
            <span className={`sk-text-body-medium-regular ${styles.muted}`}>{starting ? "First topic:" : "Next:"}</span>
            <TopicTypeBadge type={e.nextTopic.type as TopicType} />
            <span className={`sk-text-body-medium-medium ${styles.nextTitle}`}>{e.nextTopic.title}</span>
          </p>
        ) : null}
        {stale ? (
          <p className={`sk-text-body-medium-medium ${styles.iconLine} ${styles.warning}`}>
            <Icon icon={Clock} size={16} className={`${styles.lineIcon} ${styles.iconWarning}`} aria-hidden="true" />
            Last activity {e.lastActive} — pick up with one topic.
          </p>
        ) : !starting ? (
          <p className={`sk-text-body-medium-regular ${styles.subtle}`}>{activityLine(e)}</p>
        ) : null}
      </div>
      {e.nextTopic ? (
        <Link href={e.nextTopic.href} className={cn(linkButton("primary"), styles.pickUpCta)}>
          <span className={styles.label}>{starting ? "Start course" : "Continue"}</span>
          <Icon icon={ArrowRight} size={20} aria-hidden="true" />
          <span className="sk-sr-only">: {e.title}</span>
        </Link>
      ) : null}
    </section>
  );
}

/* ── Summary row ───────────────────────────────────────────────────────────────────── */

function Summary({ enrolments }: { enrolments: Enrolment[] }) {
  const inProgress = enrolments.filter((e) => e.status === "in-progress").length;
  const completed = enrolments.filter((e) => e.status === "completed").length;
  const ready = enrolments.filter((e) => e.cert === "downloadable").length;
  const preparing = enrolments.filter((e) => e.cert === "generating").length;
  const earned = ready + preparing;
  const notStarted = enrolments.length - inProgress - completed;

  // Nothing begun yet: a sentence instead of a row of zeros.
  if (inProgress === 0 && completed === 0) {
    return (
      <section aria-labelledby="summary-h" className={styles.stack}>
        <h2 id="summary-h" className="sk-sr-only">
          Where you stand
        </h2>
        <p className={`sk-text-body-large-regular ${styles.muted}`}>
          You have {notStarted === 1 ? "one course" : `${notStarted} courses`} ready to start, and
          nothing here is timed — begin with one topic whenever you are ready.
        </p>
      </section>
    );
  }

  const items = [
    { label: "In progress", value: inProgress },
    { label: "Completed", value: completed },
    { label: "Certificates earned", value: earned, note: preparing ? `${preparing} being prepared` : undefined },
  ];
  return (
    <section aria-labelledby="summary-h">
      <h2 id="summary-h" className="sk-sr-only">
        Where you stand
      </h2>
      <dl className={styles.summary}>
        {items.map((it) => (
          <div key={it.label} className={styles.figure}>
            <dt className={`sk-text-body-medium-regular ${styles.muted}`}>
              {it.label}
              {it.note ? <span className={styles.subtle}> · {it.note}</span> : null}
            </dt>
            <dd className={`sk-text-headline-small-semibold ${styles.heading}`}>{it.value}</dd>
          </div>
        ))}
        <div className={styles.figure}>
          <dt className={`sk-text-body-medium-regular ${styles.muted}`}>Enrolled</dt>
          <dd className={`sk-text-headline-small-semibold ${styles.subtle}`}>{enrolments.length}</dd>
        </div>
      </dl>
    </section>
  );
}

/* ── Enrolment card ────────────────────────────────────────────────────────────────── */

function CertLine({ e }: { e: Enrolment }) {
  switch (e.cert) {
    case "downloadable":
      return (
        <Button hierarchy="secondary" size="md" leftIcon={Download} className={styles.selfStart}>
          Download certificate<span className="sk-sr-only">: {e.title}</span>
        </Button>
      );
    case "generating":
      return (
        <p className={`sk-text-body-medium-medium ${styles.iconLine} ${styles.heading}`}>
          <Icon icon={Hourglass} size={16} className={`${styles.lineIcon} ${styles.iconPrimary}`} aria-hidden="true" />
          Certificate being prepared
        </p>
      );
    case "audit_passing":
      return (
        <p className={`sk-text-body-medium-medium ${styles.iconLine} ${styles.success}`}>
          <Icon icon={Award} size={16} className={`${styles.lineIcon} ${styles.iconSuccess}`} aria-hidden="true" />
          Passing — finish to earn it
        </p>
      );
    default:
      return (
        <p className={`sk-text-body-medium-regular ${styles.iconLine} ${styles.subtle}`}>
          <Icon icon={Award} size={16} className={`${styles.lineIcon} ${styles.iconMuted}`} aria-hidden="true" />
          Certificate on completion
        </p>
      );
  }
}

function EnrolmentCard({ e }: { e: Enrolment }) {
  const s = STATUS[e.status];
  const showProgress = e.status === "in-progress" || e.status === "completed";
  const stale = isStale(e);
  const headingId = `card-${e.id}`;

  return (
    <li className={styles.cardItem}>
      <article
        aria-labelledby={headingId}
        className={styles.card}
      >
        <div className={styles.cardHead}>
          <div className={styles.badges}>
            <Badge color={s.color} variant="soft" leftIcon={s.icon}>
              {s.label}
            </Badge>
            {e.program ? (
              <span className={`sk-text-body-small-medium ${styles.subtle}`}>Program · {e.program.value}</span>
            ) : null}
          </div>
          {e.program?.mock ? <MockTag reason={e.program.mock} /> : null}
          <h3 id={headingId} className={`sk-text-body-large-semibold ${styles.heading}`}>
            {e.title}
          </h3>
          <p className={`sk-text-body-small-regular ${styles.subtle}`}>
            {e.provider} · {e.selfPaced ? "Self-paced" : "Instructor-paced"}
          </p>
        </div>

        {showProgress ? (
          <div className={styles.progress}>
            <div className={styles.progressHead}>
              <span className={`sk-text-body-medium-semibold ${styles.heading}`}>{e.pct}% complete</span>
              <span className={`sk-text-body-small-regular ${styles.subtle}`}>
                {e.topicsDone} of {e.topicsTotal} topics
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`${e.title} progress`}
              aria-valuenow={e.pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`${e.pct}% complete, ${e.topicsDone} of ${e.topicsTotal} topics`}
              className={styles.bar}
            >
              <div className={cn(styles.fill, e.pct >= 100 ? styles.fillDone : styles.fillInfo)} style={{ width: `${e.pct}%` }} />
            </div>
          </div>
        ) : null}

        {e.status === "locked" && e.lockedBy ? (
          <div className={styles.locked}>
            <Icon icon={Lock} size={16} className={styles.lockIcon} aria-hidden="true" />
            <p className={`sk-text-body-medium-regular ${styles.muted}`}>
              <span className={`sk-text-body-medium-semibold ${styles.heading}`}>Unlocks after {e.lockedBy}.</span> Finish that
              course and this one opens.
            </p>
          </div>
        ) : e.nextTopic && e.status !== "completed" ? (
          <div className={styles.upNext}>
            <span className={`sk-text-body-small-semibold ${styles.subtle}`}>
              {e.status === "not-started" ? "First topic" : "Up next"}
            </span>
            <span className={`sk-text-body-medium-medium ${styles.upNextTitle}`}>{e.nextTopic.title}</span>
            <TopicTypeBadge type={e.nextTopic.type as TopicType} />
          </div>
        ) : null}

        <div className={styles.cardFoot}>
          {stale ? (
            <p className={`sk-text-body-medium-medium ${styles.iconLine} ${styles.warning}`}>
              <Icon icon={Clock} size={16} className={`${styles.lineIcon} ${styles.iconWarning}`} aria-hidden="true" />
              {activityLine(e)}
            </p>
          ) : e.status !== "locked" ? (
            <p className={`sk-text-body-small-regular ${styles.subtle}`}>{activityLine(e)}</p>
          ) : null}
          <CertLine e={e} />
          {e.nextTopic && (e.status === "in-progress" || e.status === "not-started") ? (
            <Link href={e.nextTopic.href} className={cn(linkButton("secondary"), styles.selfStart)}>
              <span className={styles.label}>{e.status === "not-started" ? "Start course" : "Continue"}</span>
              <span className="sk-sr-only">: {e.title}</span>
            </Link>
          ) : null}
        </div>
      </article>
    </li>
  );
}

/* ── Certificates shelf ────────────────────────────────────────────────────────────── */

function Certificates({ enrolments }: { enrolments: Enrolment[] }) {
  const earned = enrolments.filter((e) => e.cert === "downloadable" || e.cert === "generating");
  const passing = enrolments.filter((e) => e.cert === "audit_passing");

  return (
    <section aria-labelledby="certs-h" className={styles.section}>
      <h2 id="certs-h" className={`sk-text-title-medium-semibold ${styles.heading}`}>
        Certificates
      </h2>
      {earned.length === 0 ? (
        <p className={`sk-text-body-medium-regular ${styles.muted}`}>
          No certificates yet. Each course gives you one when you pass it, and it will wait for you here.
        </p>
      ) : (
        <ul className={styles.certGrid}>
          {earned.map((e) => (
            <li
              key={e.id}
              className={styles.cert}
            >
              <span className={styles.certIcon}>
                <Icon icon={Award} size={20} aria-hidden="true" />
              </span>
              <div className={styles.certBody}>
                <p className={`sk-text-body-medium-semibold ${styles.heading}`}>{e.title}</p>
                {e.cert === "downloadable" ? (
                  <Button hierarchy="secondary" size="md" leftIcon={Download}>
                    Download<span className="sk-sr-only"> certificate: {e.title}</span>
                  </Button>
                ) : (
                  <p className={`sk-text-body-medium-regular ${styles.iconLine} ${styles.muted}`}>
                    <Icon icon={Hourglass} size={16} className={`${styles.lineIcon} ${styles.iconMuted}`} aria-hidden="true" />
                    Being prepared — it will be ready to download here.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {passing.length > 0 ? (
        <p className={`sk-text-body-medium-regular ${styles.muted}`}>
          On the way:{" "}
          {passing.map((e, i) => (
            <React.Fragment key={e.id}>
              {i > 0 ? ", " : null}
              <span className={`sk-text-body-medium-semibold ${styles.heading}`}>{e.title}</span>
            </React.Fragment>
          ))}{" "}
          — you are passing; finish the course to earn the certificate.
        </p>
      ) : null}
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────────────── */

export function View() {
  const persona = usePersona();
  const [filter, setFilter] = React.useState<Filter>("all");
  // A new persona starts from "All".
  React.useEffect(() => setFilter("all"), [persona.id]);

  const all = React.useMemo(
    () => [...persona.enrolments].sort((a, b) => ORDER[a.status] - ORDER[b.status]),
    [persona.enrolments],
  );
  const counts: Record<Filter, number> = {
    all: all.length,
    "in-progress": all.filter((e) => bucket(e.status) === "in-progress").length,
    "not-started": all.filter((e) => bucket(e.status) === "not-started").length,
    completed: all.filter((e) => bucket(e.status) === "completed").length,
  };
  const shown = filter === "all" ? all : all.filter((e) => bucket(e.status) === filter);
  const filterLabel = FILTERS.find((f) => f.id === filter)?.label ?? "All";
  const next = nextAction(persona);
  const nothingStarted = counts["in-progress"] === 0 && counts.completed === 0;

  return (
    <main id="main" tabIndex={-1} className={styles.main}>
      <header className={styles.stack}>
        <h1 className={`sk-text-headline-medium-semibold ${styles.heading}`}>
          {nothingStarted ? `Welcome, ${persona.firstName}` : `Your learning, ${persona.firstName}`}
        </h1>
        <p className={`sk-text-body-large-regular ${styles.muted}`}>
          {nothingStarted
            ? "Everything you are enrolled in, in one place."
            : `Where you stand across ${all.length} ${all.length === 1 ? "course" : "courses"}.`}
        </p>
      </header>

      {next ? <PickUp e={next} /> : null}

      <Summary enrolments={all} />

      <section aria-labelledby="courses-h" className={styles.section}>
        <h2 id="courses-h" className={`sk-text-title-medium-semibold ${styles.heading}`}>
          Your courses
        </h2>

        {all.length > 1 ? (
          <div role="group" aria-label="Show courses by status" className={styles.filters}>
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "sk-text-body-medium-semibold",
                    styles.filterPill,
                    on ? styles.filterOn : styles.filterOff,
                  )}
                >
                  {on ? <Icon icon={Check} size={16} aria-hidden="true" /> : null}
                  {f.label}
                  <span className={on ? "sk-text-body-medium-regular" : `sk-text-body-medium-regular ${styles.subtle}`}>
                    {counts[f.id]}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        <p role="status" aria-live="polite" className={`sk-text-body-medium-regular ${styles.muted}`}>
          Showing {shown.length} {shown.length === 1 ? "course" : "courses"}
          {filter === "all" ? "" : ` · ${filterLabel}`}
          {filter === "not-started" && all.some((e) => e.status === "locked") ? " (includes locked courses)" : ""}
        </p>

        {shown.length > 0 ? (
          <ul className={styles.courseGrid}>
            {shown.map((e) => (
              <EnrolmentCard key={e.id} e={e} />
            ))}
          </ul>
        ) : (
          <div className={styles.noMatch}>
            <p className={`sk-text-body-large-medium ${styles.heading}`}>No {filterLabel.toLowerCase()} courses right now.</p>
            <Button hierarchy="secondary" size="md" onClick={() => setFilter("all")}>
              Show all courses
            </Button>
          </div>
        )}
      </section>

      <Certificates enrolments={all} />
    </main>
  );
}
