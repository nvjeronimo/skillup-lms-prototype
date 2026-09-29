"use client";

import * as React from "react";
import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import { MockTag } from "@/components/lab/MockTag";
import { MOCK, type Enrolment } from "@/lib/lab/dashboard-mock";
import { getPlan } from "@/lib/lab/training-plan";
import {
  CourseAction,
  CourseTitle,
  NextStep,
  PlansMain,
  PlansTitle,
  ProgressBar,
  orderedCourses,
  statusText,
  topicsText,
  usePlansPersona,
} from "../shared";

/** Option D · Up next — the course to continue first as a large block; everything else as a compact list below. */
export function View() {
  const { persona, id } = usePlansPersona();
  const { lead, all } = orderedCourses(persona);
  const today = getPlan(id).today;
  const inToday = lead && today && lead.title.startsWith(today.course) ? today : undefined;
  const others = all.filter((e) => e !== lead && e.status !== "completed");
  const finished = all.filter((e) => e.status === "completed");

  return (
    <PlansMain className="max-w-3xl">
      <PlansTitle />

      {lead ? (
        <section aria-labelledby="up-next" className="mt-8 rounded-2xl border border-sko-border-subtle bg-sko-bg-page p-6 md:p-10">
          {inToday ? (
            <Badge color="yellow" variant="outline" size="md" leftIcon={CalendarCheck} className="mb-4">
              In today&apos;s plan · {inToday.minutes} min
            </Badge>
          ) : null}
          <CourseTitle e={lead} personaId={id} id="up-next" className="sk-text-display-xs-semibold" />
          <NextStep e={lead} className="mt-4" />
          {lead.status === "in-progress" ? (
            <div className="mt-8 flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="sk-text-sm-semibold text-sko-text-default">{lead.pct}% done</span>
                <span className="sk-text-sm-regular text-sko-text-muted">{topicsText(lead)}</span>
              </div>
              <ProgressBar e={lead} className="h-2" />
            </div>
          ) : (
            <p className="sk-text-sm-regular mt-8 text-sko-text-muted">Not started · {topicsText(lead)}</p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <CourseAction e={lead} personaId={id} emphasis="primary" size="lg" />
            <span className="sk-text-sm-regular text-sko-text-muted">
              {lead.lastActive === "Never opened" ? "Never opened" : `Last opened ${lead.lastActive.toLowerCase()}`}
            </span>
          </div>
        </section>
      ) : null}

      {others.length > 0 ? (
        <section aria-labelledby="also" className="mt-12">
          <h2 id="also" className="sk-text-lg-semibold text-sko-text-default">
            Also in your plan
          </h2>
          <ul className="mt-3 divide-y divide-sko-border-subtle border-y border-sko-border-subtle">
            {others.map((e) => (
              <CompactRow key={e.id} e={e} personaId={id} />
            ))}
          </ul>
        </section>
      ) : null}

      {finished.length > 0 ? (
        <section aria-labelledby="finished" className="mt-12">
          <h2 id="finished" className="sk-text-lg-semibold text-sko-text-default">
            Finished
          </h2>
          <ul className="mt-3 divide-y divide-sko-border-subtle border-y border-sko-border-subtle">
            {finished.map((e) => (
              <CompactRow key={e.id} e={e} personaId={id} />
            ))}
          </ul>
        </section>
      ) : null}

      {inToday ? (
        <MockTag layout="block" className="mt-12" reason={`"In today's plan" comes from the training plan. ${MOCK.pace}`} />
      ) : null}
    </PlansMain>
  );
}

/** One line per course: title and its status in words, then a secondary action. */
function CompactRow({ e, personaId }: { e: Enrolment; personaId: string }) {
  return (
    <li className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
      <div className="flex min-w-0 flex-1 basis-64 items-center gap-3">
        {e.status === "completed" ? <CompletionStatus state="Done" /> : null}
        <div className="min-w-0">
          <CourseTitle e={e} personaId={personaId} as="h3" className="sk-text-md-medium" />
          {e.status !== "completed" ? <p className="sk-text-sm-regular text-sko-text-muted">{statusText(e)}</p> : null}
        </div>
      </div>
      <CourseAction e={e} personaId={personaId} emphasis="secondary" />
    </li>
  );
}
