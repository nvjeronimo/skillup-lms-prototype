"use client";

import * as React from "react";
import { Award, BookOpen, PlayCircle } from "lucide-react";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import { EmptyState } from "@/components/atoms/EmptyState";
import { PanelTabs } from "@/components/molecules/PanelTabs";
import type { Enrolment } from "@/lib/lab/dashboard-mock";
import {
  CourseAction,
  CourseTitle,
  LockedNote,
  NextStep,
  PlansMain,
  PlansTitle,
  ProgressBar,
  groupOf,
  orderedCourses,
  topicsText,
  usePlansPersona,
  type Group,
} from "../shared";

const TABS: { value: Group; label: string }[] = [
  { value: "in-progress", label: "In progress" },
  { value: "not-started", label: "Not started" },
  { value: "finished", label: "Finished" },
];

const EMPTY: Record<Group, { icon: typeof Award; title: string; description: string }> = {
  "in-progress": { icon: PlayCircle, title: "Nothing in progress", description: "Start a course and it moves here." },
  "not-started": { icon: BookOpen, title: "Every course has begun", description: "Courses you have not opened yet show here." },
  finished: { icon: Award, title: "No finished courses yet", description: "Finished courses and their certificates show here." },
};

/** Option C · Tabs — In progress / Not started / Finished, so only one short list is on screen. */
export function View() {
  const { persona, id } = usePlansPersona();
  const { lead, all } = orderedCourses(persona);
  const defaultTab: Group = lead ? groupOf(lead) : "finished";
  const [tab, setTab] = React.useState<Group>(defaultTab);

  // A persona switch keeps the page mounted: go back to the tab that holds the course to continue.
  React.useEffect(() => setTab(defaultTab), [id, defaultTab]);

  const shown = all.filter((e) => groupOf(e) === tab);
  const current = TABS.find((t) => t.value === tab)!;

  return (
    <PlansMain className="max-w-3xl">
      <PlansTitle />
      {/* Edge to edge below sm so the three tabs fit a 390px screen; the tab strip scrolls rather than
          widening the page if a larger text size still does not fit. */}
      <div className="-mx-4 mt-8 overflow-hidden border-y border-sko-border-subtle bg-sko-bg-page sm:mx-0 sm:rounded-xl sm:border-x">
        <div className="overflow-x-auto">
          <PanelTabs
            ariaLabel="Courses by status"
            active={tab}
            onChange={(v) => setTab(v as Group)}
            tabs={TABS.map((t) => ({ ...t, count: all.filter((e) => groupOf(e) === t.value).length }))}
            className="min-w-max"
          />
        </div>
        <section role="tabpanel" aria-label={current.label} tabIndex={0} className="px-5 py-2 md:px-6">
          {shown.length === 0 ? (
            <EmptyState {...EMPTY[tab]} className="my-4 !border-0" />
          ) : (
            <ul className="divide-y divide-sko-border-subtle">
              {shown.map((e) => (
                <Row key={e.id} e={e} personaId={id} isLead={e === lead} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </PlansMain>
  );
}

function Row({ e, personaId, isLead }: { e: Enrolment; personaId: string; isLead: boolean }) {
  return (
    <li className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <CourseTitle e={e} personaId={personaId} className="sk-text-md-semibold" />
        {e.status === "in-progress" ? (
          <div className="flex items-center gap-3">
            <ProgressBar e={e} className="w-full max-w-60 flex-1" />
            <span className="sk-text-sm-medium shrink-0 text-sko-text-muted">{topicsText(e)}</span>
          </div>
        ) : null}
        {e.status === "completed" ? (
          <p className="flex items-center gap-2">
            <CompletionStatus state="Done" />
            <span className="sk-text-sm-regular text-sko-text-muted">{topicsText(e)}</span>
          </p>
        ) : null}
        {e.status === "not-started" ? <p className="sk-text-sm-regular text-sko-text-muted">{topicsText(e)}</p> : null}
        <NextStep e={e} />
        <LockedNote e={e} />
      </div>
      <div className="shrink-0">
        <CourseAction e={e} personaId={personaId} emphasis={isLead ? "primary" : "secondary"} />
      </div>
    </li>
  );
}
