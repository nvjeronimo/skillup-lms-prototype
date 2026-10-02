"use client";

import * as React from "react";
import { Badge } from "@/components/atoms/Badge";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import type { Enrolment } from "@/lib/lab/dashboard-mock";
import { cn } from "@/lib/utils";
import {
  CourseAction,
  CourseTitle,
  LockedNote,
  PlansMain,
  PlansTitle,
  ProgressBar,
  initials,
  orderedCourses,
  topicsText,
  usePlansPersona,
} from "../shared";

/**
 * Course tile colours, in turn by position: DS accent soft fills with their accent text. Yellow is kept out — on these pages
 * the SKO yellow only marks "today/now". The colour is decoration; the title beside it names the course.
 */
const TILES = [
  "bg-sko-bg-accent-teal-soft text-sko-text-accent-teal",
  "bg-sko-bg-accent-green-soft text-sko-text-accent-green",
  "bg-sko-bg-accent-red-soft text-sko-text-accent-red",
];


/** Option B · Course cards — a two-column grid of equal cards: tile, title, progress, one action. */
export function View() {
  const { persona, id } = usePlansPersona();
  const { lead, all } = orderedCourses(persona);

  return (
    <PlansMain className="max-w-5xl">
      <PlansTitle />
      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {all.map((e, i) => (
          <li key={e.id} className="flex">
            <Card e={e} personaId={id} isLead={e === lead} tile={TILES[i % TILES.length]} />
          </li>
        ))}
      </ul>
    </PlansMain>
  );
}

function Card({ e, personaId, isLead, tile }: { e: Enrolment; personaId: string; isLead: boolean; tile: string }) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl border border-sko-border-subtle bg-sko-bg-page">
      <div
        aria-hidden
        className={cn("sk-text-display-sm-semibold flex h-28 items-center px-6", tile, e.status === "locked" && "opacity-60")}
      >
        {initials(e.title)}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <CourseTitle e={e} personaId={personaId} className="sk-text-lg-semibold" />
        <CardProgress e={e} />
        <LockedNote e={e} />
        <div className="mt-auto pt-2">
          <CourseAction e={e} personaId={personaId} emphasis={isLead ? "primary" : "secondary"} />
        </div>
      </div>
    </article>
  );
}

function CardProgress({ e }: { e: Enrolment }) {
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
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="sk-text-sm-semibold text-sko-text-default">{e.pct}%</span>
          <span className="sk-text-sm-regular text-sko-text-muted">{topicsText(e)}</span>
        </div>
        <ProgressBar e={e} />
      </div>
    );
  }
  return (
    <p className="flex flex-wrap items-center gap-2">
      <Badge color="gray">{e.status === "locked" ? "Locked" : "Not started"}</Badge>
      <span className="sk-text-sm-regular text-sko-text-muted">{topicsText(e)}</span>
    </p>
  );
}
