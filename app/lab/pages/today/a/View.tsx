"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, Clock, Play, Video } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { EmptyState } from "@/components/atoms/EmptyState";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { getPlan } from "@/lib/lab/training-plan";
import { GoButton, PageMock, TODAY_LABEL, kindToTopicType, liveNow, plural, stillAhead, type DatedSession } from "../shared";

/**
 * A · Focus. One session card in the middle of the page and nothing else. The rest of the week is one
 * line under it; a re-plan or a live-now session is one more quiet line, never a second card.
 */
export function TodayFocus() {
  const plan = getPlan(useSearchParams().get("persona"));
  const s = plan.today;
  const live = liveNow(plan);
  const ahead = stillAhead(plan);
  const notStarted = plan.status.tone === "not-started";

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[640px] flex-1 px-4 pb-16 pt-10 outline-none md:px-8 md:pt-20">
      <h1 className="sk-text-display-xs-semibold text-center text-sko-text-default">Today</h1>
      <p className="sk-text-md-regular mt-1 text-center text-sko-text-muted">{TODAY_LABEL}</p>

      {s ? (
        <section aria-labelledby="focus-h" className="mt-8 rounded-2xl border border-sko-border-subtle bg-sko-bg-page p-6 shadow-sk-card md:p-10">
          <Badge color="yellow" variant="soft" size="md" leftIcon={Clock}>
            Today · {s.minutes} min
          </Badge>
          <h2 id="focus-h" className="sk-text-display-xs-semibold mt-4 text-sko-text-default">
            {s.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="sk-text-sm-regular text-sko-text-muted">{s.course}</span>
            <TopicTypeBadge type={kindToTopicType(s.kind)} />
          </div>
          {notStarted ? <p className="sk-text-sm-regular mt-4 text-sko-text-muted">{plan.status.line}</p> : null}
          <GoButton href={s.href} size="lg" leftIcon={Play} className="mt-8 w-full sm:w-auto" aria-label={`Start ${s.title}`}>
            {notStarted ? "Start your plan" : "Start session"}
          </GoButton>
        </section>
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title="Nothing planned today"
          description="Your next session is below."
          className="mt-8 bg-sko-bg-page"
        />
      )}

      <div className="mt-6 flex flex-col gap-3 px-1">
        {live ? (
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="sk-text-sm-regular flex items-center gap-2 text-sko-text-default">
              <Icon icon={Video} size={16} className="shrink-0 text-sko-icon-success" aria-hidden="true" />
              {live.title} is live now.
            </p>
            <GoButton href={live.href} hierarchy="secondary" size="md" aria-label={`Join ${live.title}, live now`}>
              Join
            </GoButton>
          </div>
        ) : null}
        {plan.replan ? (
          <p className="sk-text-sm-regular text-sko-text-muted">Welcome back. {plan.replan.message}</p>
        ) : null}
        <WeekLine ahead={ahead} />
      </div>

      <PageMock live={Boolean(live)} />
    </main>
  );
}

function WeekLine({ ahead }: { ahead: DatedSession[] }) {
  if (ahead.length === 0) {
    return <p className="sk-text-sm-regular text-sko-text-muted">Nothing else this week.</p>;
  }
  const next = ahead[0];
  const when = next.day.isToday ? (next.time ? `today at ${next.time}` : "later today") : next.day.short;
  return (
    <p className="sk-text-sm-regular text-sko-text-muted">
      {plural(ahead.length, "more session")} this week · next {when}: {next.title}
    </p>
  );
}
