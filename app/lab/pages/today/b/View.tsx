"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Play, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { getPlan, type PlanDay, type Session, type TrainingPlan } from "@/lib/lab/training-plan";
import { cn } from "@/lib/utils";
import { FOCUS, GoButton, PageMock, dayDate, dayLong, isLiveNow, kindToTopicType, movedTo, plural, sessionMeta } from "../shared";

/**
 * B · Agenda. The week as a calm day-by-day list. Today is open with its Start button; every other day is
 * folded to one line that says what it holds, in words, and opens on demand.
 */
export function TodayAgenda() {
  const plan = getPlan(useSearchParams().get("persona"));
  const [open, setOpen] = React.useState<Set<string>>(() => new Set(plan.days.filter((d) => d.isToday).map((d) => d.key)));
  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[720px] flex-1 px-4 pb-16 pt-10 outline-none md:px-8 md:pt-16">
      <h1 className="sk-text-display-xs-semibold text-sko-text-default">This week</h1>
      <p className="sk-text-md-regular mt-1 text-sko-text-muted">{plan.weekOf}</p>
      {plan.replan || plan.status.tone === "not-started" ? (
        <p className="sk-text-sm-regular mt-4 max-w-prose text-sko-text-muted">
          {plan.replan ? `Welcome back. ${plan.replan.message}` : plan.status.line}
        </p>
      ) : null}

      <ol className="mt-8 divide-y divide-sko-border-subtle rounded-xl border border-sko-border-subtle bg-sko-bg-page">
        {plan.days.map((d) => (
          <DayRow key={d.key} plan={plan} day={d} open={open.has(d.key)} onToggle={() => toggle(d.key)} />
        ))}
      </ol>

      <PageMock live={plan.days.some((d) => d.sessions.some((s) => s.state === "live"))} />
    </main>
  );
}

/** The folded line: what the day holds, said in words. Past days say done / not done. */
function summary(day: PlanDay): { text: string; done?: boolean } {
  const n = day.sessions.length;
  if (n === 0) return { text: "Rest day" };
  if (day.isPast) {
    const done = day.sessions.filter((s) => s.state === "done").length;
    if (done === n) return { text: n === 1 ? "1 session · done" : `${n} sessions · all done`, done: true };
    if (done === 0) return { text: n === 1 ? "1 session · not done" : `${n} sessions · not done`, done: false };
    return { text: `${done} of ${n} sessions done`, done: false };
  }
  return { text: plural(n, "session") };
}

function DayRow({ plan, day, open, onToggle }: { plan: TrainingPlan; day: PlanDay; open: boolean; onToggle: () => void }) {
  const sum = summary(day);
  const panelId = `day-${day.key}`;
  const empty = day.sessions.length === 0;
  const label = (
    <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
      <span className="sk-text-md-semibold w-28 shrink-0 text-sko-text-default">
        <span className="sm:hidden">{day.short} {day.date}</span>
        <span className="hidden sm:inline">{dayLong(day)} {day.date}</span>
      </span>
      {day.isToday ? (
        <Badge color="yellow" variant="soft" size="sm">
          Today
        </Badge>
      ) : null}
      <span className="sk-text-sm-regular flex items-center gap-1.5 text-sko-text-muted">
        {sum.done === true ? <CompletionStatus state="Done" size={16} /> : null}
        {sum.done === false ? (
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-sko-bg-muted text-sko-icon-muted" aria-hidden="true">
            <Icon icon={X} size={12} />
          </span>
        ) : null}
        {sum.text}
      </span>
    </span>
  );

  return (
    <li aria-current={day.isToday ? "date" : undefined}>
      <h2 className="sk-text-md-semibold">
        {empty ? (
          <span className="flex min-h-[56px] items-center gap-3 px-4 py-3 md:px-6">{label}</span>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            className={cn("flex min-h-[56px] w-full items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-sko-bg-faint md:px-6", FOCUS)}
          >
            {label}
            <Icon
              icon={ChevronDown}
              size={20}
              aria-hidden="true"
              className={cn("shrink-0 text-sko-icon-subtle transition-transform duration-200", open && "rotate-180")}
            />
          </button>
        )}
      </h2>
      {!empty ? (
        <div id={panelId} hidden={!open} className="px-4 pb-5 md:px-6">
          <ul className="flex flex-col gap-4 md:pl-[124px]">
            {day.sessions.map((s) => (
              <SessionLine key={s.id} plan={plan} s={s} />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function SessionLine({ plan, s }: { plan: TrainingPlan; s: Session }) {
  const isMain = s.state === "today";
  const now = isLiveNow(s);
  let note: string | null = null;
  if (s.state === "done") note = "Done";
  if (s.state === "missed") {
    const to = movedTo(plan, s);
    note = to ? `Not done · moved to ${to}` : "Not done";
  }
  if (s.state === "moved") note = `Moved from ${plan.replan?.from ?? "last week"}`;

  return (
    <li className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className={cn(isMain ? "sk-text-lg-semibold" : "sk-text-md-medium", "text-sko-text-default")}>{s.title}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <TopicTypeBadge type={kindToTopicType(s.kind)} />
          <span className="sk-text-sm-regular text-sko-text-muted">
            {s.course} · {s.state === "live" ? sessionMeta(s) : `${s.minutes} min`}
          </span>
          {note ? <span className="sk-text-sm-medium text-sko-text-muted">{note}</span> : null}
        </div>
      </div>
      {isMain ? (
        <GoButton href={s.href} size="lg" leftIcon={Play} className="w-full sm:w-auto" aria-label={`Start ${s.title}`}>
          {plan.status.tone === "not-started" ? "Start your plan" : "Start session"}
        </GoButton>
      ) : null}
      {now ? (
        <GoButton href={s.href} hierarchy="secondary" size="md" className="w-full sm:w-auto" aria-label={`Join ${s.title}, live now`}>
          Join live session
        </GoButton>
      ) : null}
    </li>
  );
}

