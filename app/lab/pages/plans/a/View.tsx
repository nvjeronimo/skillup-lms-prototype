"use client";

import * as React from "react";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import type { Enrolment } from "@/lib/lab/dashboard-mock";
import {
  CourseAction,
  CourseTitle,
  LockedNote,
  NextStep,
  PlansMain,
  PlansTitle,
  ProgressBar,
  orderedCourses,
  topicsText,
  usePlansPersona,
} from "../shared";

/** Option A · Progress list — one list, one row per course: title, progress, next step, one button. No groups. */
export function View() {
  const { persona, id } = usePlansPersona();
  const { lead, all } = orderedCourses(persona);

  return (
    <PlansMain className="max-w-3xl">
      <PlansTitle />
      <ul className="mt-8 divide-y divide-sko-border-subtle rounded-xl border border-sko-border-subtle bg-sko-bg-page">
        {all.map((e) => (
          <Row key={e.id} e={e} personaId={id} isLead={e === lead} />
        ))}
      </ul>
    </PlansMain>
  );
}

function Row({ e, personaId, isLead }: { e: Enrolment; personaId: string; isLead: boolean }) {
  return (
    <li className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:gap-8 md:px-6">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <CourseTitle e={e} personaId={personaId} className="sk-text-md-semibold" />
        <Progress e={e} />
        <NextStep e={e} />
        <LockedNote e={e} />
      </div>
      <div className="shrink-0">
        <CourseAction e={e} personaId={personaId} emphasis={isLead ? "primary" : "secondary"} />
      </div>
    </li>
  );
}

/** The progress line in words and a thin bar. Finished and not-started courses say so instead of showing a bar. */
function Progress({ e }: { e: Enrolment }) {
  if (e.status === "completed") {
    return (
      <p className="flex items-center gap-2">
        <CompletionStatus state="Done" />
        <span className="sk-text-sm-medium text-sko-text-default">Finished</span>
        <span className="sk-text-sm-regular text-sko-text-muted">· {topicsText(e)}</span>
      </p>
    );
  }
  if (e.status === "in-progress") {
    return (
      <div className="flex items-center gap-3">
        <ProgressBar e={e} className="w-full max-w-60 flex-1" />
        <span className="sk-text-sm-medium shrink-0 text-sko-text-muted">{topicsText(e)}</span>
      </div>
    );
  }
  return (
    <p className="sk-text-sm-medium text-sko-text-muted">
      {e.status === "locked" ? "Locked" : "Not started"} · {topicsText(e)}
    </p>
  );
}
