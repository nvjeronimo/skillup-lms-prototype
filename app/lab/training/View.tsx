"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Play, Radio } from "lucide-react";
import { Icon } from "@/lib/icons";
import { MockTag } from "@/components/lab/MockTag";
import { getPlan, type PlanDay, type Session, type TrainingPlan } from "@/lib/lab/training-plan";
import { MOCK } from "@/lib/lab/dashboard-mock";
import { cn } from "@/lib/utils";
import { WEEKS, WeekStrip, planWeek } from "./plans/parts";

const STATE_WORD: Record<Session["state"], string> = {
  done: "done",
  planned: "planned",
  today: "today",
  moved: "moved here by your re-plan",
  live: "live session",
  missed: "not done",
};

/** Pixel height of a session block: a pure function of its minutes (its load), clamped so short ones stay readable. */
const blockHeight = (m: number) => Math.round(Math.min(132, Math.max(48, 36 + m * 1.6)));

export function TrainingToday() {
  const params = useSearchParams();
  const plan = getPlan(params.get("persona"));
  const [replanKept, setReplanKept] = React.useState(false);

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 pt-8 outline-none md:px-8 md:pt-12">
      <h1 className="sr-only">Today</h1>

      {/* ---------- first viewport: today's one session | the week ---------- */}
      <div className="grid gap-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-10">
        <section aria-labelledby="today-h" className="lg:col-span-5 lg:row-start-1">
          <p className="tb-label tb-c-ink2">
            Tuesday 30 September · <span className="tb-num">Week {Math.max(plan.weekIndex, 1)}</span>
            <span className="tb-c-ink3"> of {plan.weeksTotal}</span>
          </p>

          {plan.today ? (
            <>
              <h2 id="today-h" className="tb-display mt-6">
                {plan.today.title}
              </h2>
              <p className="tb-body tb-c-ink2 mt-4">
                {plan.status.tone === "not-started" ? "Your first session" : "Today's session"} · {plan.today.course} · {plan.today.kind} ·{" "}
                <span className="tb-num tb-num-m tb-c-ink">{plan.today.minutes}</span> min
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={plan.today.href} className="tb-btn tb-btn-primary w-full sm:w-auto">
                  <Icon icon={Play} size={18} aria-hidden="true" />
                  {plan.status.tone === "not-started" ? "Start your plan" : "Start session"}
                </Link>
                {plan.status.tone === "replanned" ? (
                  <p className="tb-body-s tb-c-ink2">Last visit 19 days ago — picking up is the whole job today.</p>
                ) : null}
              </div>
            </>
          ) : (
            <h2 id="today-h" className="tb-display mt-6">Rest day</h2>
          )}

        </section>

        <section aria-labelledby="week-h" className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="week-h" className="tb-h2">This week</h2>
            <p className="tb-meta tb-c-ink2">{plan.weekOf}</p>
          </div>
          <WeekBlock days={plan.days} animateMoved={!replanKept} />
          <PlanStatus plan={plan} kept={replanKept} onKeep={() => setReplanKept(true)} />
          <div className="mt-3">
            <MockTag reason={`Weekly plan and cohort position — ${MOCK.pace}`} />
          </div>
        </section>

        {plan.then.length > 0 ? (
          <section aria-labelledby="then-h" className="lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start">
              <h2 id="then-h" className="tb-label tb-c-ink2">Then</h2>
              <ul className="mt-3">
                {plan.then.map((s) => (
                  <li key={s.id} className="tb-rule-t flex items-baseline gap-3 py-3">
                    <span className={cn("tb-mark", markClass(s))} aria-hidden />
                    <span className="tb-body-s flex-1">
                      <span className="tb-strong">{s.title}</span>
                      <span className="tb-c-ink2"> · {s.kind}</span>
                      <span className="sr-only">, {STATE_WORD[s.state]}</span>
                    </span>
                    <span className="tb-meta tb-c-ink2">
                      {(s as Session & { day?: string }).day}
                      {s.time ? ` ${s.time}` : ` · ${s.minutes} min`}
                    </span>
                  </li>
                ))}
              </ul>
          </section>
        ) : null}
      </div>

      {/* ---------- road to race day ---------- */}
      <RoadToRaceDay plan={plan} />

      {/* ---------- your plans ---------- */}
      <YourPlans plan={plan} />
    </main>
  );
}

function markClass(s: Session) {
  return s.state === "done"
    ? "tb-mark-done"
    : s.state === "today"
      ? "tb-mark-today"
      : s.state === "moved"
        ? "tb-mark-moved"
        : s.state === "live"
          ? "tb-mark-live"
          : "tb-mark-plan";
}

/** Where a missed session went: the moved block with the same title, if the re-plan placed one. */
function movedTo(days: PlanDay[], s: Session) {
  return days.find((d) => d.sessions.some((x) => x.state === "moved" && x.title === s.title))?.short;
}

function WeekBlock({ days, animateMoved }: { days: PlanDay[]; animateMoved: boolean }) {
  let movedIndex = 0;
  return (
    <ol className="tb-sheet mt-4 grid grid-cols-7 overflow-hidden" aria-label="This week, day by day">
      {days.map((d) => (
        <li
          key={d.key}
          aria-current={d.isToday ? "date" : undefined}
          className={cn("flex min-h-[260px] flex-col border-r last:border-r-0 md:min-h-[320px]", d.isToday ? "tb-today-col" : "")}
          style={{ borderColor: "var(--tb-rule)" }}
        >
          <div className={cn("px-1.5 pb-2 pt-3 text-center md:px-2", !d.isToday && "tb-rule-b")}>
            <span className="tb-label block">{d.short}</span>
            <span className={cn("tb-num tb-num-m block", d.isPast && !d.isToday ? "tb-c-ink3" : "")}>{d.date}</span>
            {d.isToday ? <span className="sr-only">(today)</span> : null}
          </div>
          <ul className="flex flex-1 flex-col gap-1.5 p-1 md:p-1.5">
            {d.sessions.length === 0 ? (
              <li className="tb-meta tb-c-ink3 px-1 pt-1">
                <span aria-hidden>—</span>
                <span className="sr-only">Nothing planned</span>
              </li>
            ) : null}
            {d.sessions.map((s) => {
              const delay = s.state === "moved" ? movedIndex++ * 90 : 0;
              return (
                <li
                  key={s.id}
                  className={cn(
                    "flex flex-col justify-between overflow-hidden px-1.5 py-1.5 md:px-2",
                    s.state === "done" ? "tb-block tb-block-done" : s.state === "moved" ? "tb-block tb-block-moved" : s.state === "live" ? "tb-block tb-block-live" : s.state === "missed" ? "tb-block tb-block-missed" : "tb-block",
                    s.state === "moved" && animateMoved && "tb-replan-in",
                    s.state === "today" && "tb-bg-sheet",
                  )}
                  style={{ height: blockHeight(s.minutes), animationDelay: `${delay}ms` }}
                >
                  <span className="tb-meta tb-strong hidden whitespace-nowrap sm:block" aria-hidden>{s.kind}</span>
                  <span className="sr-only">{s.title}</span>
                  <span className="tb-meta tb-c-ink2 flex items-center gap-1">
                    {s.state === "done" ? <Icon icon={Check} size={12} aria-hidden="true" /> : null}
                    {s.state === "live" ? <Icon icon={Radio} size={12} aria-hidden="true" /> : null}
                    <span className="tb-num">{s.time ?? `${s.minutes}′`}</span>
                  </span>
                  {s.state === "missed" && movedTo(days, s) ? (
                    <span className="tb-meta tb-c-teal flex items-center gap-0.5 whitespace-nowrap" aria-hidden>
                      <Icon icon={ArrowRight} size={12} aria-hidden="true" />
                      <span className="hidden sm:inline">{movedTo(days, s)}</span>
                    </span>
                  ) : null}
                  <span className="sr-only">
                    , {s.kind}, {s.minutes} minutes, {STATE_WORD[s.state]}
                    {s.state === "missed" && movedTo(days, s) ? `, moved to ${movedTo(days, s)}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function PlanStatus({ plan, kept, onKeep }: { plan: TrainingPlan; kept: boolean; onKeep: () => void }) {
  const pct = plan.loadPlanned ? Math.round((plan.loadDone / plan.loadPlanned) * 100) : 0;
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="tb-h2 tb-c-teal">{plan.status.word}</p>
        <p className="tb-body mt-1">{plan.status.line}</p>
        {plan.replan && !kept ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="tb-body-s tb-c-ink2 w-full">
              <span className="tb-mark tb-mark-moved mr-2 align-middle" aria-hidden />
              {plan.replan.message}
            </p>
            <DayPicker keep={<button type="button" onClick={onKeep} className="tb-btn tb-btn-quiet">Keep this plan</button>} />
          </div>
        ) : null}
        {plan.replan && kept ? (
          <p role="status" className="tb-body-s tb-c-ink2 mt-3">
            Plan kept. You land back on the cohort&apos;s week by 17 October.
          </p>
        ) : null}
      </div>
      <div className="min-w-[200px]">
        <p className="tb-meta tb-c-ink2">
          Load this week <span className="tb-num tb-c-ink">{plan.loadDone}</span> / <span className="tb-num">{plan.loadPlanned}</span> min
        </p>
        <div
          className="tb-meter mt-2"
          role="progressbar"
          aria-label="Minutes done this week"
          aria-valuemin={0}
          aria-valuemax={plan.loadPlanned}
          aria-valuenow={plan.loadDone}
          aria-valuetext={`${plan.loadDone} of ${plan.loadPlanned} minutes`}
        >
          <span style={{ width: `${pct}%` }} />
        </div>
        <ul className="tb-meta tb-c-ink2 mt-3 flex flex-wrap gap-x-3 gap-y-1" aria-label="Legend">
          <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-done" aria-hidden />Done</li>
          <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-plan" aria-hidden />Planned</li>
          <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-moved" aria-hidden />Moved</li>
          <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-live" aria-hidden />Live</li>
          <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-today" aria-hidden />Today</li>
        </ul>
      </div>
    </div>
  );
}

const PICK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** "Choose my days": the learner picks the days the re-plan may use. MOCK — nothing is saved. */
function DayPicker({ keep }: { keep: React.ReactNode }) {
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
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {keep}
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)} className="tb-link min-h-[44px]">
          Choose my days
        </button>
      </div>
      {open ? (
        <div id={panelId} className="tb-sheet mt-2 p-3">
          <p className="tb-body-s tb-c-ink2" id={`${panelId}-l`}>
            Which days can you train this week?
          </p>
          <ul className="mt-2 grid grid-cols-7 gap-1" aria-labelledby={`${panelId}-l`}>
            {PICK_DAYS.map((d) => {
              const on = days.includes(d);
              return (
                <li key={d}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(d)}
                    className={cn("tb-label flex min-h-[44px] w-full items-center justify-center rounded-sm", on ? "tb-bg-ink" : "tb-block")}
                  >
                    {d}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={picked.length === 0}
              onClick={() => setDone(`Re-planned onto ${picked.join(", ")}. Lab demo — nothing is saved.`)}
              className="tb-btn tb-btn-primary"
            >
              Re-plan with these days
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

function RoadToRaceDay({ plan }: { plan: TrainingPlan }) {
  const W = plan.weeksTotal;
  const you = Math.max(plan.weekIndex, 0);
  const pos = (w: number) => `${(w / W) * 100}%`;
  return (
    <section aria-labelledby="road-h" className="tb-rule-strong-t mt-16 pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="road-h" className="tb-h2">Road to race day</h2>
        <p className="tb-body-s tb-c-ink2">
          Certificate · <span className="tb-strong tb-c-ink">{plan.raceDay}</span>
        </p>
      </div>
      <p className="tb-body mt-2">
        {plan.status.tone === "not-started"
          ? `Your cohort is in week ${plan.cohortWeek}. Starting this week still leaves ${W - plan.cohortWeek} weeks — the plan fits you in.`
          : `You are in week ${you} of ${W}; your cohort is in week ${plan.cohortWeek}.`}
      </p>
      <div className="relative mt-10 pb-10" aria-hidden>
        <div className="tb-road" />
        {Array.from({ length: W + 1 }, (_, w) => (
          <span key={w} className="absolute top-[-5px] h-3 w-px" style={{ left: pos(w), background: "var(--tb-rule-strong)" }} />
        ))}
        <div className="absolute -top-9 -translate-x-1/2 text-center" style={{ left: pos(plan.cohortWeek) }}>
          <span className="tb-label tb-c-ink2 block">Cohort</span>
          <span className="mx-auto mt-1 block h-3 w-3 rotate-45" style={{ background: "var(--tb-ink-2)" }} />
        </div>
        <div className="absolute top-3 -translate-x-1/2 text-center" style={{ left: pos(Math.max(you, 0.15)) }}>
          <span className="tb-bg-lime tb-label mt-1 inline-block rounded-sm px-2 py-1" style={{ boxShadow: "inset 0 0 0 1.5px var(--tb-ink)" }}>
            You
          </span>
        </div>
        <div className="absolute -top-9 right-0 text-right">
          <span className="tb-label block">Race day</span>
        </div>
      </div>
    </section>
  );
}

function YourPlans({ plan }: { plan: TrainingPlan }) {
  const q = `?persona=${plan.persona.id}`;
  const live = plan.persona.enrolments.filter((e) => e.status === "in-progress" || e.status === "not-started");
  const other = plan.persona.enrolments.length - live.length;
  return (
    <section aria-labelledby="plans-h" className="tb-rule-strong-t mt-12 pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="plans-h" className="tb-h2">Your plans</h2>
        <Link href={`/lab/training/plans${q}`} className="tb-link">
          All plans{other ? ` · ${other} more` : ""} <Icon icon={ArrowRight} size={16} aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-2">
        {live.map((e) => (
          <li key={e.id} className="tb-rule-b grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 py-5 md:grid-cols-[1fr_auto_140px]">
            <div>
              <h3 className="tb-body tb-strong">{e.title}</h3>
              <p className="tb-body-s tb-c-ink2">
                {e.status === "not-started" ? "Not started · first session " : "Next · "}
                {(e.id === "six-sigma" && plan.today?.course === "Six Sigma" ? plan.today.title : e.nextTopic?.title) ?? "—"}
              </p>
              {e.id === "six-sigma" ? (
                <Link href={`/lab/training/course/six-sigma${q}`} className="tb-link">
                  Open the plan
                </Link>
              ) : null}
            </div>
            <div className="order-3 col-span-2 md:order-none md:col-span-1">
              <WeekStrip week={planWeek(e, plan)} className="w-full md:w-[240px]" />
            </div>
            <p className="tb-body-s tb-c-ink2 text-right">
              {e.status === "not-started" ? (
                "Starts when you do"
              ) : (
                <>
                  Week <span className="tb-num tb-num-m tb-c-ink">{planWeek(e, plan)}</span> of {WEEKS}
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
