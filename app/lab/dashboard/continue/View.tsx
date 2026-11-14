import * as React from "react";
import { AlertTriangle, ArrowRight, Award, CalendarDays, CheckCircle2, Clock, PartyPopper, PlayCircle, Radio } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { TopicType } from "@/lib/types";
import { Badge } from "@/components/atoms/Badge";
import { EmptyState } from "@/components/atoms/EmptyState";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { MockTag } from "@/components/lab/MockTag";
import { usePersona } from "@/components/lab/usePersona";
import { nextAction, type DueItem, type Enrolment, type LiveSession, type Persona } from "@/lib/lab/dashboard-mock";
import {
  Link,
  TopicProgress,
  certCopy,
  daysAway,
  linkPrimary,
  linkSecondary,
  linkText,
  pickDue,
  pickLive,
} from "./parts";
import styles from "./View.module.css";

/** A gap this long gets a kind acknowledgement on the resume card. */
const GAP_DAYS = 7;
const MY_LEARNING = "/";

/** Direction A · Continue first — one dominant resume card, everything else compact and below it. */
export function View() {
  const persona = usePersona();
  const hero = nextAction(persona);
  const away = hero ? daysAway(hero.lastActive) : 0;
  const returning = away >= GAP_DAYS;

  const alsoInProgress = persona.enrolments.filter((e) => e.status === "in-progress" && e.id !== hero?.id);
  const rest = persona.enrolments.filter((e) => e.id !== hero?.id && e.status !== "in-progress");

  return (
    <main id="main" tabIndex={-1} className={styles.main}>
      <Greeting persona={persona} hero={hero} returning={returning} />

      {hero ? (
        <ResumeCard enrolment={hero} away={returning ? hero.lastActive : undefined} />
      ) : (
        <EmptyState
          icon={PartyPopper}
          title="You are all caught up"
          description="Nothing is in progress right now. Your completed courses and certificates are in My Learning."
          action={
            <Link href={MY_LEARNING} className={linkSecondary}>
              Go to My Learning
            </Link>
          }
          className={styles.empty}
        />
      )}

      {alsoInProgress.length > 0 ? <AlsoInProgress enrolments={alsoInProgress} /> : null}

      <RestSummary rest={rest} />

      <AroundStrip persona={persona} hero={hero} />
    </main>
  );
}

/* ---------------------------------------------------------------------------------------------- */

function Greeting({ persona, hero, returning }: { persona: Persona; hero?: Enrolment; returning: boolean }) {
  const notStarted = hero?.status === "not-started";
  const title = returning ? `Welcome back, ${persona.firstName}` : `Good to see you, ${persona.firstName}`;
  const sub = !hero
    ? "Here is what is happening across your learning."
    : notStarted && returning
      ? "No catching up needed. Your first topic is ready whenever you are."
      : notStarted
        ? "Your first topic is ready whenever you are."
        : returning
          ? "Your progress is saved exactly where you left it."
          : "Here is where you left off.";
  return (
    <header className={styles.greeting}>
      <h1 className={`sk-text-headline-medium-semibold ${styles.heading}`}>{title}</h1>
      <p className={`sk-text-body-large-regular ${styles.lede}`}>{sub}</p>
    </header>
  );
}

function ResumeCard({ enrolment, away }: { enrolment: Enrolment; away?: string }) {
  const notStarted = enrolment.status === "not-started";
  const next = enrolment.nextTopic;
  const eyebrow = notStarted ? "Start here" : away ? "Pick up where you left off" : "Continue learning";
  const cta = notStarted ? "Start course" : "Resume";

  return (
    <section
      aria-labelledby="resume-heading"
      className={styles.resume}
    >
      <div className={styles.resumeLayout}>
        <div className={styles.resumeMain}>
          <div>
            <p className={`sk-text-body-small-semibold ${styles.eyebrowPrimary}`}>{eyebrow}</p>
            <h2 id="resume-heading" className={`sk-text-headline-small-semibold ${styles.stacked}`}>
              {enrolment.title}
            </h2>
            <p className={`sk-text-body-medium-regular ${styles.lede}`}>
              {enrolment.provider} · {enrolment.selfPaced ? "Self-paced" : "Instructor-paced"}
              {notStarted ? ` · ${enrolment.topicsTotal} topics` : null}
            </p>
          </div>

          {away && !notStarted ? (
            <p className={`sk-text-body-medium-medium ${styles.away}`}>
              <Icon icon={Clock} size={16} className={styles.awayIcon} aria-hidden="true" />
              <span>
                Last visit {away}. That is fine. A few minutes today is enough to get the thread back.
              </span>
            </p>
          ) : null}

          {next ? (
            <div className={styles.upNext}>
              <p className={`sk-text-body-small-semibold ${styles.eyebrow}`}>
                {notStarted ? "First topic" : "Up next"}
              </p>
              <div className={styles.upNextTopic}>
                <TopicTypeBadge type={next.type as TopicType} />
                <p className={`sk-text-title-medium-semibold ${styles.heading}`}>{next.title}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.resumeSide}>
          {notStarted ? null : <TopicProgress enrolment={enrolment} />}
          <Link href={next?.href ?? "#"} className={cn(linkPrimary, styles.fullWidth)}>
            <Icon icon={PlayCircle} size={20} aria-hidden="true" />
            <span>
              {cta}
              <span className="sk-sr-only"> {enrolment.title}</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function AlsoInProgress({ enrolments }: { enrolments: Enrolment[] }) {
  return (
    <section aria-labelledby="also-heading" className={styles.also}>
      <h2 id="also-heading" className={`sk-text-title-medium-semibold ${styles.heading}`}>
        Also in progress
      </h2>
      <ul className={styles.alsoList}>
        {enrolments.map((e) => (
          <li key={e.id} className={styles.alsoRow}>
            <div className={styles.alsoMain}>
              <h3 className={`sk-text-body-large-semibold ${styles.heading}`}>{e.title}</h3>
              {e.nextTopic ? (
                <p className={`sk-text-body-medium-regular ${styles.nextLine}`}>
                  <span>Next:</span>
                  <TopicTypeBadge type={e.nextTopic.type as TopicType} />
                  <span className={styles.heading}>{e.nextTopic.title}</span>
                </p>
              ) : null}
              <p className={`sk-text-body-small-regular ${styles.meta}`}>Last active {e.lastActive.toLowerCase()}</p>
            </div>
            <TopicProgress enrolment={e} size="sm" className={styles.alsoProgress} />
            <Link href={e.nextTopic?.href ?? "#"} className={cn(linkSecondary, styles.alsoCta)}>
              Resume<span className="sk-sr-only"> {e.title}</span>
              <Icon icon={ArrowRight} size={16} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RestSummary({ rest }: { rest: Enrolment[] }) {
  if (rest.length === 0) return null;
  const count = (s: Enrolment["status"]) => rest.filter((e) => e.status === s).length;
  const parts = [
    [count("not-started"), "not started"],
    [count("completed"), "completed"],
    [count("locked"), "locked"],
  ]
    .filter(([n]) => (n as number) > 0)
    .map(([n, label]) => `${n} ${label}`);
  return (
    <p className={`sk-text-body-medium-regular ${styles.rest}`}>
      <span>
        {rest.length === 1 ? "1 more course" : `${rest.length} more courses`}: {parts.join(", ")}.
      </span>
      <Link href={MY_LEARNING} className={linkText}>
        See all in My Learning
      </Link>
    </p>
  );
}

/* ---------------------------------------------------------------------------------------------- */

function AroundStrip({ persona, hero }: { persona: Persona; hero?: Enrolment }) {
  return (
    <section aria-labelledby="around-heading" className={styles.around}>
      <h2 id="around-heading" className={`sk-text-title-medium-semibold ${styles.heading}`}>
        Around your learning
      </h2>
      <div className={styles.cards}>
        {hero ? <CertificateCard persona={persona} hero={hero} /> : null}
        <WeeklyGoalCard persona={persona} />
        <ComingUpCard persona={persona} className={styles.comingUp} />
      </div>
    </section>
  );
}

const CARD = styles.card;

function CertificateCard({ persona, hero }: { persona: Persona; hero: Enrolment }) {
  const copy = certCopy(hero.cert, hero.status === "not-started");
  const earned = persona.certificatesEarned;
  return (
    <div className={CARD}>
      <h3 className={`sk-text-body-large-semibold ${styles.cardTitle}`}>
        <Icon icon={Award} size={20} className={styles.cardIcon} aria-hidden="true" />
        Certificate
      </h3>
      <div>
        <p className={`sk-text-body-medium-semibold ${styles.heading}`}>{copy.title}</p>
        <p className={`sk-text-body-medium-regular ${styles.detail}`}>
          {hero.title}: {copy.detail}
        </p>
      </div>
      {earned > 0 ? (
        <p className={`sk-text-body-medium-regular ${styles.earned}`}>
          <Icon icon={CheckCircle2} size={16} className={styles.earnedIcon} aria-hidden="true" />
          {earned === 1 ? "1 certificate earned so far" : `${earned} certificates earned so far`}
        </p>
      ) : null}
      {hero.cert === "downloadable" ? (
        <Link href={`/course/${hero.id}/certificate`} className={linkText}>
          View certificate
        </Link>
      ) : null}
    </div>
  );
}

function WeeklyGoalCard({ persona }: { persona: Persona }) {
  const { daysTarget, daysDone } = persona.weeklyGoal.value;
  const met = daysDone >= daysTarget;
  const left = Math.max(daysTarget - daysDone, 0);
  const note = met
    ? "Goal met this week. Nice rhythm."
    : daysDone === 0
      ? "A short session today counts toward it."
      : `${left} more ${left === 1 ? "day" : "days"} to reach it.`;
  return (
    <div className={CARD}>
      <h3 className={`sk-text-body-large-semibold ${styles.cardTitle}`}>
        <Icon icon={CalendarDays} size={20} className={styles.cardIcon} aria-hidden="true" />
        Weekly goal
      </h3>
      <div>
        <p className={`sk-text-body-medium-semibold ${styles.heading}`}>
          {daysDone} of {daysTarget} learning days this week
        </p>
        <div className={styles.goalDays} aria-hidden="true">
          {Array.from({ length: daysTarget }, (_, i) => (
            <span
              key={i}
              className={cn(styles.goalDay, i < daysDone ? styles.goalDayDone : styles.goalDayOpen)}
            />
          ))}
        </div>
        <p className={`sk-text-body-medium-regular ${styles.note}`}>{note}</p>
      </div>
      {persona.weeklyGoal.mock ? <MockTag reason={persona.weeklyGoal.mock} layout="block" /> : null}
    </div>
  );
}

function ComingUpCard({ persona, className }: { persona: Persona; className?: string }) {
  const live = pickLive(persona.live.value);
  const due = pickDue(persona.due.value);
  return (
    <div className={cn(CARD, className)}>
      <h3 className={`sk-text-body-large-semibold ${styles.cardTitle}`}>
        <Icon icon={Clock} size={20} className={styles.cardIcon} aria-hidden="true" />
        Coming up
      </h3>
      <ul className={styles.comingList}>
        <li className={styles.comingItem}>
          <p className={`sk-text-body-small-semibold ${styles.eyebrow}`}>Next live session</p>
          {live ? <LiveLine session={live} /> : <p className={`sk-text-body-medium-regular ${styles.muted}`}>No sessions scheduled.</p>}
          {persona.live.mock ? <MockTag reason={persona.live.mock} /> : null}
        </li>
        <li className={styles.comingItemRuled}>
          <p className={`sk-text-body-small-semibold ${styles.eyebrow}`}>Next due</p>
          {due ? <DueLine item={due} /> : <p className={`sk-text-body-medium-regular ${styles.muted}`}>Nothing due.</p>}
          {persona.due.mock ? <MockTag reason={persona.due.mock} /> : null}
        </li>
      </ul>
    </div>
  );
}

const LIVE_BADGE: Record<LiveSession["state"], { label: string; color: "success" | "info" | "gray"; icon?: typeof Radio }> = {
  live: { label: "Live now", color: "success", icon: Radio },
  today: { label: "Today", color: "info" },
  upcoming: { label: "Upcoming", color: "gray" },
  recording: { label: "Recording", color: "gray", icon: PlayCircle },
};

function LiveLine({ session }: { session: LiveSession }) {
  const b = LIVE_BADGE[session.state];
  return (
    <div className={styles.line}>
      <Badge color={b.color} leftIcon={b.icon}>
        {b.label}
      </Badge>
      {/* No live-session page exists in the prototype yet. */}
      <Link href="#" className={cn(linkText, "sk-text-body-medium-semibold")}>
        {session.title}
      </Link>
      <span className={`sk-text-body-small-regular ${styles.subtle}`}>
        {session.when} · {session.course}
      </span>
    </div>
  );
}

const DUE_BADGE: Record<DueItem["state"], { label: string; color: "warning" | "gray"; icon?: typeof Radio }> = {
  // Overdue is a nudge, not an error: amber, never red.
  overdue: { label: "Overdue", color: "warning", icon: AlertTriangle },
  "due-soon": { label: "Due soon", color: "warning", icon: Clock },
  upcoming: { label: "Upcoming", color: "gray" },
};

function DueLine({ item }: { item: DueItem }) {
  const b = DUE_BADGE[item.state];
  return (
    <div className={styles.line}>
      <Badge color={b.color} leftIcon={b.icon}>
        {b.label}
      </Badge>
      <Link href={item.href} className={cn(linkText, "sk-text-body-medium-semibold")}>
        {item.title}
      </Link>
      <span className={`sk-text-body-small-regular ${styles.subtle}`}>
        {item.kind} · {item.dueLabel} · {item.course}
      </span>
    </div>
  );
}
