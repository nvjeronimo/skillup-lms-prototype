"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Play } from "lucide-react";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import { getPlan, type TrainingPlan } from "@/lib/lab/training-plan";
import { cn } from "@/lib/utils";
import { GoButton, PageMock, isLiveNow, liveNow, movedTo, type DatedSession } from "../shared";

/**
 * D · Checklist. A short brief written from the data, then this week's sessions as a read-only checklist.
 * Done items are ticked; today's item carries the page's one accent and the Start button.
 */
export function TodayChecklist() {
  const plan = getPlan(useSearchParams().get("persona"));
  const items: DatedSession[] = plan.days.flatMap((d) => d.sessions.map((s) => ({ ...s, day: d })));
  const counted = items.filter((s) => s.state !== "live");
  const done = counted.filter((s) => s.state === "done").length;
  const live = liveNow(plan);

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[680px] flex-1 px-4 pb-16 pt-10 outline-none md:px-8 md:pt-16">
      <h1 className="sk-text-display-xs-semibold text-sko-text-default">Good morning, {plan.persona.firstName}.</h1>
      <p className="sk-text-md-regular mt-3 max-w-prose text-sko-text-default">{brief(plan)}</p>

      <section aria-labelledby="week-h" className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="week-h" className="sk-text-lg-semibold text-sko-text-default">
            This week
          </h2>
          <p className="sk-text-sm-regular text-sko-text-muted">
            {plan.weekOf} · {done} of {counted.length} done
          </p>
        </div>
        <ul className="mt-4 flex flex-col gap-1">
          {items.map((s) => (
            <CheckItem key={s.id} plan={plan} s={s} />
          ))}
        </ul>
      </section>

      <PageMock live={Boolean(live) || items.some((s) => s.state === "live")} />
    </main>
  );
}

/** Two or three plain sentences, generated from the plan. */
function brief(plan: TrainingPlan): string {
  const out: string[] = [];
  const t = plan.today;
  const todays = plan.days.find((d) => d.isToday)?.sessions ?? [];
  const now = todays.find(isLiveNow);
  const later = todays.find((s) => s.state === "live" && !isLiveNow(s));
  if (now) out.push(`${now.title} is live now.`);
  if (t) {
    const first = plan.status.tone === "not-started" ? " It is your first session." : "";
    out.push(`You have ${t.minutes} minutes planned today: ${t.title}.${first}`);
  } else {
    out.push("Nothing is planned today.");
  }
  if (later) out.push(`${later.title} is live at ${later.time}.`);
  out.push(plan.status.line);
  return out.join(" ");
}

function CheckItem({ plan, s }: { plan: TrainingPlan; s: DatedSession }) {
  const isToday = s.state === "today";
  const now = isLiveNow(s);
  const state = (() => {
    switch (s.state) {
      case "done":
        return "Done";
      case "missed": {
        const to = movedTo(plan, s);
        return to ? `Not done · moved to ${to}` : "Not done";
      }
      case "moved":
        return `Moved from ${plan.replan?.from ?? "last week"}`;
      case "today":
        return "Today";
      case "live":
        return now ? "Live now" : `Live at ${s.time}`;
      default:
        return null;
    }
  })();
  const meta = [s.kind === "Live session" ? "Live session" : `${s.kind} · ${s.minutes} min`, s.course, state].filter(Boolean).join(" · ");

  return (
    <li
      aria-current={isToday ? "date" : undefined}
      className={cn(
        "flex flex-col gap-4 rounded-lg px-3 py-4 sm:flex-row sm:items-center md:px-4",
        isToday && "bg-sko-bg-accent-yellow-soft",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span aria-hidden="true" className="mt-0.5 flex">
          <CompletionStatus state={s.state === "done" ? "Done" : "Pending"} size={20} />
        </span>
        <span className="sk-text-sm-medium w-10 shrink-0 pt-0.5 text-sko-text-muted">{s.day.short}</span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className={cn(isToday ? "sk-text-md-semibold" : "sk-text-md-medium", s.state === "done" ? "text-sko-text-muted" : "text-sko-text-default")}>
            {s.title}
          </p>
          <p className={cn("sk-text-sm-regular", isToday ? "text-sko-text-default" : "text-sko-text-muted")}>{meta}</p>
        </div>
      </div>
      {isToday ? (
        <GoButton href={s.href} size="lg" leftIcon={Play} className="w-full shrink-0 sm:w-auto" aria-label={`Start ${s.title}`}>
          Start
        </GoButton>
      ) : null}
      {now ? (
        <GoButton href={s.href} hierarchy="secondary" size="md" className="w-full shrink-0 sm:w-auto" aria-label={`Join ${s.title}, live now`}>
          Join
        </GoButton>
      ) : null}
    </li>
  );
}
