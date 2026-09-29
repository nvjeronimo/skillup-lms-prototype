"use client";

import { useSearchParams } from "next/navigation";
import { MockTag } from "@/components/lab/MockTag";
import { getPlan, type Session } from "@/lib/lab/training-plan";
import { nextAction } from "@/lib/lab/dashboard-mock";
import { Action } from "./Actions";
import { Horizon } from "./Horizon";
import { phaseOfPct } from "./light";

interface WeekItem extends Session {
  day: string;
}

function sessionMeta(s: Session) {
  if (s.state === "live") return `${s.time ?? ""} · live session`;
  const base = `${s.minutes} min · ${s.kind}`;
  return s.state === "moved" ? `${base} · moved here in your re-plan` : base;
}

/** Home: today's session over the horizon, at the light its course has reached. One action. */
export function HomeView() {
  const persona = useSearchParams().get("persona");
  const plan = getPlan(persona);
  const p = plan.persona;
  const today = plan.today;
  const course = (today && p.enrolments.find((e) => e.title.startsWith(today.course))) ?? nextAction(p);
  const pct = course?.pct ?? 0;
  const phase = phaseOfPct(pct);

  const title = today?.title ?? course?.nextTopic?.title ?? "Nothing planned today";
  const minutes = today?.minutes;
  const kind = today?.kind ?? course?.nextTopic?.type;
  const href = today?.href ?? course?.nextTopic?.href;
  const shortName = today?.course ?? course?.title ?? "";

  // The rest of the week, from today on: what else is lit, quietly.
  const todayIndex = plan.days.findIndex((d) => d.isToday);
  const week: WeekItem[] = plan.days
    .slice(todayIndex)
    .flatMap((d) => d.sessions.map((s) => ({ ...s, day: d.isToday ? "Later today" : d.short })))
    .filter((s) => s.state !== "today" && s.state !== "done" && s.state !== "missed")
    .slice(0, 3);

  return (
    <main id="main" tabIndex={-1} className="flex-1 outline-none">
      <Horizon
        light={pct / 100}
        phase={phase}
        size="hero"
        as="section"
        labelledBy="dw-today"
        sky={
          <div className="mx-auto w-full max-w-[1200px] px-4 pb-36 pt-12 md:px-10 md:pb-56 md:pt-20">
            <h1 id="dw-today" className="dw-display max-w-[16ch]">
              {title}
            </h1>
            <p className="dw-lede dw-fg-2 mt-5 max-w-[40ch]">
              {minutes ? <span className="dw-num">{minutes} min</span> : null}
              {minutes && kind ? " · " : null}
              {kind}
              {course ? <> — {course.title}</> : null}
            </p>
          </div>
        }
      >
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-10">
          <p id="dw-today-light" className="dw-lede max-w-[46ch]">
            {phase.key === "night" ? (
              <>
                {shortName} is still at <span className="dw-phase">night</span>: not started yet. Your first topic brings
                the first light.
              </>
            ) : (
              <>
                {shortName} is at <span className="dw-phase">{phase.word.toLowerCase()}</span>,{" "}
                <span className="dw-num">{pct}%</span> complete.
              </>
            )}
          </p>
          <Action variant="primary" label={pct === 0 ? "Start" : "Continue"} href={href} describedBy="dw-today dw-today-light" />
        </div>
      </Horizon>

      <section aria-labelledby="dw-week" className="mx-auto w-full max-w-[1200px] px-4 pb-10 pt-12 md:px-10 md:pt-16">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
          <div>
            <h2 id="dw-week" className="dw-h3">
              The rest of your week
            </h2>
            <p className="dw-body-s dw-fg-2 mt-2 max-w-[44ch]">
              <span className="dw-strong dw-fg">{plan.status.word}.</span> {plan.status.line}
            </p>
          </div>
          {week.length ? (
            <ul className="grid gap-6 sm:grid-cols-3 sm:gap-8">
              {week.map((s) => (
                <li key={s.id} className="dw-rule-t pt-4">
                  <p className="dw-day-name dw-fg-2">{s.day}</p>
                  <p className="dw-body mt-1">{s.title}</p>
                  <p className="dw-meta dw-fg-3 mt-1">{sessionMeta(s)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dw-body-s dw-fg-2">Nothing else is planned this week.</p>
          )}
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 md:px-10">
        <MockTag layout="block" reason={`Today’s session and the week: ${plan.mock}`} />
      </div>
    </main>
  );
}
