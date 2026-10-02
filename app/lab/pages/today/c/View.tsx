"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Play, Video } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import type { Enrolment } from "@/lib/lab/dashboard-mock";
import { getPlan } from "@/lib/lab/training-plan";
import type { TopicType } from "@/lib/types";
import { GoButton, PageMock, liveNow } from "../shared";

/**
 * C · Resume shelf. Continue where you left off: every course in progress is one row with its next step
 * and its progress. Today's scheduled session, if any, is one line above the shelf.
 */
export function TodayResume() {
  const plan = getPlan(useSearchParams().get("persona"));
  const p = plan.persona;
  const inProgress = p.enrolments.filter((e) => e.status === "in-progress");
  // Nothing started yet (Noah): the shelf offers the courses to start instead.
  const starting = inProgress.length === 0;
  const shelf = (starting ? p.enrolments.filter((e) => e.status === "not-started") : inProgress).slice();
  // The course that owns today's session goes first, so the line above and the first row agree.
  const todayCourse = plan.today?.course;
  shelf.sort((a, b) => Number(owns(b, todayCourse)) - Number(owns(a, todayCourse)));
  const live = liveNow(plan);

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[880px] flex-1 px-4 pb-16 pt-10 outline-none md:px-8 md:pt-16">
      <h1 className="sk-text-display-xs-semibold text-sko-text-default">{starting ? "Start learning" : "Continue learning"}</h1>
      {plan.replan ? <p className="sk-text-sm-regular mt-2 text-sko-text-muted">Welcome back. {plan.replan.message}</p> : null}

      {plan.today || live ? (
        <div className="mt-8 flex flex-col gap-2">
          {plan.today ? (
            <p className="sk-text-sm-regular flex flex-wrap items-center gap-x-2 gap-y-1 text-sko-text-default">
              <Badge color="yellow" variant="soft" size="sm">
                Today
              </Badge>
              <span>
                {plan.today.title} · {plan.today.kind} · {plan.today.minutes} min, in {plan.today.course}
              </span>
            </p>
          ) : null}
          {live ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="sk-text-sm-regular flex items-center gap-2 text-sko-text-default">
                <Icon icon={Video} size={16} className="shrink-0 text-sko-icon-success" aria-hidden="true" />
                {live.title} is live now.
              </p>
              <GoButton href={live.href} hierarchy="tertiary" size="md" rightIcon={ArrowRight} aria-label={`Join ${live.title}, live now`}>
                Join
              </GoButton>
            </div>
          ) : null}
        </div>
      ) : null}

      <ul className="mt-6 divide-y divide-sko-border-subtle rounded-xl border border-sko-border-subtle bg-sko-bg-page">
        {shelf.map((e, i) => (
          <ShelfRow key={e.id} e={e} first={i === 0} starting={starting} />
        ))}
      </ul>

      <PageMock live={Boolean(live)} />
    </main>
  );
}

const lastOpened = (s: string) =>
  s === "Never opened" ? "not opened yet" : s === "Today" || s === "Yesterday" ? `last opened ${s.toLowerCase()}` : `last opened ${s}`;

const owns = (e: Enrolment, course?: string) => Boolean(course && e.title.startsWith(course));

function ShelfRow({ e, first, starting }: { e: Enrolment; first: boolean; starting: boolean }) {
  const verb = starting ? "Start" : "Continue";
  const next = e.nextTopic;
  return (
    <li className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:gap-8 md:p-6">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <h2 className="sk-text-lg-semibold text-sko-text-default">{e.title}</h2>
        {next ? (
          <p className="sk-text-sm-regular flex flex-wrap items-center gap-x-2 gap-y-1 text-sko-text-muted">
            <span>{starting ? "First:" : "Next:"}</span>
            <span className="sk-text-sm-medium text-sko-text-default">{next.title}</span>
            <TopicTypeBadge type={next.type as TopicType} />
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div
            role="progressbar"
            aria-label={`${e.title} progress`}
            aria-valuenow={e.pct}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 w-full overflow-hidden rounded-full bg-sko-bg-muted sm:w-40"
          >
            <div className="h-full rounded-full bg-sko-bg-info" style={{ width: `${e.pct}%` }} />
          </div>
          <span className="sk-text-sm-regular text-sko-text-muted">
            {e.pct === 0 ? `Not started · ${e.topicsTotal} topics` : `${e.pct}% · ${e.topicsDone} of ${e.topicsTotal} topics`} · {lastOpened(e.lastActive)}
          </span>
        </div>
      </div>
      <GoButton
        href={next?.href ?? "#"}
        hierarchy={first ? "primary" : "secondary"}
        size={first ? "lg" : "md"}
        leftIcon={first ? Play : undefined}
        className="w-full shrink-0 md:w-auto"
        aria-label={`${verb} ${e.title}`}
      >
        {verb}
      </GoButton>
    </li>
  );
}
