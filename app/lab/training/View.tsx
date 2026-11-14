import * as React from "react";
import Link from "@/lib/router";
import { useSearchParams } from "@/lib/router";
import { Check, Play } from "lucide-react";
import { Icon } from "@/lib/icons";
import { MockTag } from "@/components/lab/MockTag";
import { getPlan, type PlanDay, type TrainingPlan } from "@/lib/lab/training-plan";
import { MOCK } from "@/lib/lab/dashboard-mock";
import { cn } from "@/lib/utils";
import styles from "./View.module.css";

/**
 * Today, distilled: one session and one button; the week as seven marks; the next three things.
 * Three marks only (done, today, planned). Moved and live sessions are said in words.
 */
export function TrainingToday() {
  const params = useSearchParams();
  const plan = getPlan(params.get("persona"));

  return (
    <main id="main" tabIndex={-1} className={styles.main}>
      <h1 className="sk-sr-only">Today</h1>

      <section aria-labelledby="today-h">
        <p className="tb-body-s tb-c-ink2">Tuesday 30 September</p>
        {plan.today ? (
          <>
            <h2 id="today-h" className={`tb-display ${styles.title}`}>
              {plan.today.title}
            </h2>
            <p className={`tb-body tb-c-ink2 ${styles.meta}`}>
              {plan.today.course} · {plan.today.kind} · {plan.today.minutes} min
            </p>
            <Link href={plan.today.href} className={`tb-btn tb-btn-primary ${styles.start}`}>
              <Icon icon={Play} size={18} aria-hidden="true" />
              {plan.status.tone === "not-started" ? "Start your plan" : "Start session"}
            </Link>
          </>
        ) : (
          <h2 id="today-h" className={`tb-display ${styles.title}`}>
            Rest day
          </h2>
        )}
        <StatusLine plan={plan} />
      </section>

      <section aria-labelledby="week-h" className={`tb-rule-t ${styles.week}`}>
        <div className={styles.weekHead}>
          <h2 id="week-h" className="tb-h2">
            This week
          </h2>
          <p className="tb-meta tb-c-ink2">{plan.weekOf}</p>
        </div>
        <WeekMarks days={plan.days} />
      </section>

      {plan.then.length > 0 ? (
        <section aria-labelledby="next-h" className={`tb-rule-t ${styles.next}`}>
          <h2 id="next-h" className="tb-h2">
            Coming up
          </h2>
          <ul className={styles.nextList}>
            {plan.then.map((s) => (
              <li key={s.id} className={`tb-rule-b ${styles.nextItem}`}>
                <span className={`tb-body-s tb-c-ink2 ${styles.nextDay}`}>{(s as typeof s & { day?: string }).day}</span>
                <span className={styles.nextBody}>
                  <span className={`tb-body tb-strong ${styles.nextTitle}`}>{s.title}</span>
                  <span className="tb-body-s tb-c-ink2">
                    {s.state === "live" ? (s.time === "Live now" ? "Live now" : `Live session · ${s.time}`) : `${s.kind} · ${s.minutes} min`}
                    {s.state === "moved" ? " · moved from last week" : ""}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className={styles.mock}>
        <MockTag reason={`Week plan, sessions and dates — ${MOCK.pace}`} />
      </div>
    </main>
  );
}

/** One sentence on how the plan stands. After a break, it says what moved and offers to change the days. */
function StatusLine({ plan }: { plan: TrainingPlan }) {
  if (plan.status.tone !== "replanned" || !plan.replan) {
    return <p className={`tb-body tb-c-ink2 ${styles.status}`}>{plan.status.line}</p>;
  }
  return (
    <div className={styles.status}>
      <p className="tb-body tb-c-ink2">
        You were away for a while, so we moved {plan.replan.moved} sessions into this week. Nothing was dropped.
      </p>
      <DayPicker />
    </div>
  );
}

type DayState = "done" | "today" | "planned" | "rest";

function dayState(d: PlanDay): DayState {
  if (d.isToday) return "today";
  const s = d.sessions.filter((x) => x.state !== "missed");
  if (s.length === 0) return "rest";
  if (s.every((x) => x.state === "done")) return "done";
  return "planned";
}

const DAY_WORD: Record<DayState, string> = { done: "done", today: "today", planned: "planned", rest: "rest day" };

/** Seven days, one mark each. The only lime on the page is today. */
function WeekMarks({ days }: { days: PlanDay[] }) {
  return (
    <ol className={styles.marks} aria-label="This week, day by day">
      {days.map((d) => {
        const st = dayState(d);
        const n = d.sessions.filter((x) => x.state !== "missed").length;
        return (
          <li key={d.key} aria-current={d.isToday ? "date" : undefined} className={styles.markDay}>
            <span className={cn("tb-body-s", d.isToday ? "tb-strong tb-c-ink" : "tb-c-ink2")}>{d.short}</span>
            <span
              aria-hidden
              className={cn(
                styles.mark,
                st === "today" && "tb-bg-lime",
                st === "done" && "tb-bg-ink",
                st === "planned" && "tb-mark-plan",
              )}
            >
              {st === "done" ? <Icon icon={Check} size={18} aria-hidden="true" /> : null}
              {st === "rest" ? <span className={styles.restDot} style={{ background: "var(--tb-ink-3)" }} /> : null}
            </span>
            <span className="sk-sr-only">
              {d.date}, {DAY_WORD[st]}
              {st !== "rest" ? `, ${n} session${n === 1 ? "" : "s"}` : ""}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const PICK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** "Change days": the learner picks the days the re-plan may use. MOCK — nothing is saved. */
function DayPicker() {
  const [open, setOpen] = React.useState(false);
  const [days, setDays] = React.useState<string[]>(["Wed", "Thu", "Sat"]);
  const [done, setDone] = React.useState<string | null>(null);
  const panelId = React.useId();
  const toggle = (d: string) => {
    setDone(null);
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
  };
  const picked = PICK_DAYS.filter((d) => days.includes(d));
  return (
    <div>
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)} className="tb-link">
        Change days
      </button>
      {open ? (
        <div id={panelId} className={`tb-sheet ${styles.picker}`}>
          <p className="tb-body-s tb-c-ink2" id={`${panelId}-l`}>
            Which days can you study this week?
          </p>
          <ul className={styles.pickDays} aria-labelledby={`${panelId}-l`}>
            {PICK_DAYS.map((d) => {
              const on = days.includes(d);
              return (
                <li key={d}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(d)}
                    className={cn("tb-label", styles.pickDay, on ? "tb-bg-ink" : "tb-mark-plan")}
                  >
                    {d}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className={styles.pickActions}>
            <button
              type="button"
              disabled={picked.length === 0}
              onClick={() => setDone(`Moved onto ${picked.join(", ")}. Lab demo — nothing is saved.`)}
              className="tb-btn tb-btn-quiet"
            >
              Use these days
            </button>
            <p role="status" className="tb-body-s tb-c-ink2">
              {done ?? (picked.length === 0 ? "Pick at least one day." : "")}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
