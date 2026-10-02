"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Play } from "lucide-react";
import { Icon } from "@/lib/icons";
import { MockTag } from "@/components/lab/MockTag";
import { getPlan, type PlanDay, type TrainingPlan } from "@/lib/lab/training-plan";
import { MOCK } from "@/lib/lab/dashboard-mock";
import { cn } from "@/lib/utils";

/**
 * Today, distilled: one session and one button; the week as seven marks; the next three things.
 * Three marks only (done, today, planned). Moved and live sessions are said in words.
 */
export function TrainingToday() {
  const params = useSearchParams();
  const plan = getPlan(params.get("persona"));

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[880px] flex-1 px-4 pb-16 pt-10 outline-none md:px-8 md:pt-16">
      <h1 className="sr-only">Today</h1>

      <section aria-labelledby="today-h">
        <p className="tb-body-s tb-c-ink2">Tuesday 30 September</p>
        {plan.today ? (
          <>
            <h2 id="today-h" className="tb-display mt-3">
              {plan.today.title}
            </h2>
            <p className="tb-body tb-c-ink2 mt-3">
              {plan.today.course} · {plan.today.kind} · {plan.today.minutes} min
            </p>
            <Link href={plan.today.href} className="tb-btn tb-btn-primary mt-8 w-full sm:w-auto">
              <Icon icon={Play} size={18} aria-hidden="true" />
              {plan.status.tone === "not-started" ? "Start your plan" : "Start session"}
            </Link>
          </>
        ) : (
          <h2 id="today-h" className="tb-display mt-3">
            Rest day
          </h2>
        )}
        <StatusLine plan={plan} />
      </section>

      <section aria-labelledby="week-h" className="tb-rule-t mt-12 pt-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="week-h" className="tb-h2">
            This week
          </h2>
          <p className="tb-meta tb-c-ink2">{plan.weekOf}</p>
        </div>
        <WeekMarks days={plan.days} />
      </section>

      {plan.then.length > 0 ? (
        <section aria-labelledby="next-h" className="tb-rule-t mt-10 pt-8">
          <h2 id="next-h" className="tb-h2">
            Coming up
          </h2>
          <ul className="mt-3">
            {plan.then.map((s) => (
              <li key={s.id} className="tb-rule-b flex items-baseline gap-4 py-3 last:border-b-0">
                <span className="tb-body-s tb-c-ink2 w-10 flex-none">{(s as typeof s & { day?: string }).day}</span>
                <span className="min-w-0 flex-1">
                  <span className="tb-body tb-strong block">{s.title}</span>
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

      <div className="mt-12">
        <MockTag reason={`Week plan, sessions and dates — ${MOCK.pace}`} />
      </div>
    </main>
  );
}

/** One sentence on how the plan stands. After a break, it says what moved and offers to change the days. */
function StatusLine({ plan }: { plan: TrainingPlan }) {
  if (plan.status.tone !== "replanned" || !plan.replan) {
    return <p className="tb-body tb-c-ink2 mt-8">{plan.status.line}</p>;
  }
  return (
    <div className="mt-8">
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

/** Seven days, one mark each. The only accent yellow on the page is today. */
function WeekMarks({ days }: { days: PlanDay[] }) {
  return (
    <ol className="mt-5 grid grid-cols-7 gap-1" aria-label="This week, day by day">
      {days.map((d) => {
        const st = dayState(d);
        const n = d.sessions.filter((x) => x.state !== "missed").length;
        return (
          <li key={d.key} aria-current={d.isToday ? "date" : undefined} className="flex flex-col items-center gap-2">
            <span className={cn("tb-body-s", d.isToday ? "tb-strong tb-c-ink" : "tb-c-ink2")}>{d.short}</span>
            <span
              aria-hidden
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                st === "today" && "tb-mark-today",
                st === "done" && "tb-bg-ink",
                st === "planned" && "tb-mark-plan",
              )}
            >
              {st === "done" ? <Icon icon={Check} size={18} aria-hidden="true" /> : null}
              {st === "rest" ? <span className="h-1 w-1 rounded-full" style={{ background: "var(--tb-ink-3)" }} /> : null}
            </span>
            <span className="sr-only">
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
        <div id={panelId} className="tb-sheet mt-2 p-4">
          <p className="tb-body-s tb-c-ink2" id={`${panelId}-l`}>
            Which days can you study this week?
          </p>
          <ul className="mt-3 grid grid-cols-7 gap-1" aria-labelledby={`${panelId}-l`}>
            {PICK_DAYS.map((d) => {
              const on = days.includes(d);
              return (
                <li key={d}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(d)}
                    className={cn("tb-label flex min-h-[44px] w-full items-center justify-center rounded-sm", on ? "tb-bg-ink" : "tb-mark-plan")}
                  >
                    {d}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-3">
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
