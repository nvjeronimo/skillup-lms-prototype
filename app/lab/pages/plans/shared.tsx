"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { DemoButton } from "@/components/lab/pages/DemoButton";
import { Icon } from "@/lib/icons";
import { getPersona, nextAction, type Enrolment, type Persona } from "@/lib/lab/dashboard-mock";
import type { TopicType } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Shared by the four Plans options: data order, the course link, the progress bar and the one action per course. */

export const PAGE_TITLE = "My learning";

export function usePlansPersona(): { persona: Persona; id: string } {
  const id = useSearchParams().get("persona") ?? "maya";
  return { persona: getPersona(id), id };
}

/** The only course with a detail page in the lab. */
export function courseHref(e: Enrolment, personaId: string): string | undefined {
  return e.id === "six-sigma" ? `/lab/pages/course/a?persona=${personaId}` : undefined;
}

export type Group = "in-progress" | "not-started" | "finished";

/** Locked courses sit with "Not started": they have not begun, they just cannot begin yet. */
export function groupOf(e: Enrolment): Group {
  if (e.status === "completed") return "finished";
  if (e.status === "in-progress") return "in-progress";
  return "not-started";
}

const RANK: Record<Enrolment["status"], number> = { "in-progress": 0, "not-started": 1, locked: 2, completed: 3 };

/** The course to continue first (most recent in progress, else the first not started), then the rest by status. */
export function orderedCourses(p: Persona): { lead?: Enrolment; all: Enrolment[] } {
  const lead = nextAction(p);
  const rest = p.enrolments.filter((e) => e !== lead).sort((a, b) => RANK[a.status] - RANK[b.status]);
  return { lead, all: lead ? [lead, ...rest] : rest };
}

/** Course title: a link when the course has a page in the lab, plain text otherwise. */
export function CourseTitle({
  e,
  personaId,
  as: Tag = "h2",
  id,
  className,
}: {
  e: Enrolment;
  personaId: string;
  as?: "h2" | "h3" | "p";
  id?: string;
  className?: string;
}) {
  const href = courseHref(e, personaId);
  return (
    <Tag id={id} className={cn("text-sko-text-default", className)}>
      {href ? (
        <Link href={href} className="rounded-sm underline-offset-4 hover:underline">
          {e.title}
        </Link>
      ) : (
        e.title
      )}
    </Tag>
  );
}

/** Thin progress bar: bg/info fill on a muted track. The visible text next to it carries the value. */
export function ProgressBar({ e, className }: { e: Enrolment; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-label={`${e.title} progress`}
      aria-valuenow={e.pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${e.pct}%, ${topicsText(e)}`}
      className={cn("h-1.5 overflow-hidden rounded-full bg-sko-bg-muted", className)}
    >
      <div className="h-full rounded-full bg-sko-bg-info" style={{ width: `${e.pct}%` }} />
    </div>
  );
}

export function topicsText(e: Enrolment): string {
  if (e.status === "completed") return `All ${e.topicsTotal} topics done`;
  if (e.topicsDone === 0) return `${e.topicsTotal} topics`;
  return `${e.topicsDone} of ${e.topicsTotal} topics`;
}

/** One short status line in words, so no state is carried by colour alone. */
export function statusText(e: Enrolment): string {
  switch (e.status) {
    case "in-progress":
      return `${e.pct}% · ${topicsText(e)}`;
    case "not-started":
      return `Not started · ${e.topicsTotal} topics`;
    case "locked":
      return `Locked · opens after ${e.lockedBy ?? "an earlier course"}`;
    case "completed":
      return "Finished";
  }
}

/** "Next: [Video] Title" — or "Starts with" for a course not begun. */
export function NextStep({ e, className }: { e: Enrolment; className?: string }) {
  if (!e.nextTopic || e.status === "completed" || e.status === "locked") return null;
  return (
    <p className={cn("flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <span className="sk-text-sm-medium shrink-0 text-sko-text-muted">
        {e.status === "not-started" ? "Starts with" : "Next"}
      </span>
      <TopicTypeBadge type={e.nextTopic.type as TopicType} />
      <span className="sk-text-sm-medium min-w-0 text-sko-text-default">{e.nextTopic.title}</span>
    </p>
  );
}

export function LockedNote({ e, className }: { e: Enrolment; className?: string }) {
  if (e.status !== "locked") return null;
  return (
    <p className={cn("sk-text-sm-regular flex items-start gap-2 text-sko-text-muted", className)}>
      <Icon icon={Lock} size={16} className="mt-0.5 shrink-0 text-sko-icon-muted" aria-hidden />
      <span>Opens when you finish {e.lockedBy ?? "an earlier course"}.</span>
    </p>
  );
}

/**
 * The single action for a course. `emphasis="primary"` is used once per page, on the course to continue first.
 * Six Sigma goes to its lab page; other destinations do not exist, so they are DemoButtons.
 * Locked courses and certificates still being generated get no button (the status text explains).
 */
export function CourseAction({
  e,
  personaId,
  emphasis = "secondary",
  size = "md",
}: {
  e: Enrolment;
  personaId: string;
  emphasis?: "primary" | "secondary" | "tertiary";
  size?: "md" | "lg";
}) {
  const router = useRouter();
  if (e.status === "locked") return null;

  if (e.status === "completed") {
    if (e.cert === "downloadable") {
      return (
        <DemoButton hierarchy="tertiary" size="md" leftIcon={Download} aria-label={`Download certificate for ${e.title}`}>
          Download certificate
        </DemoButton>
      );
    }
    if (e.cert === "generating") {
      return <span className="sk-text-sm-regular text-sko-text-muted">Certificate on its way</span>;
    }
    return (
      <DemoButton hierarchy="tertiary" size="md" aria-label={`Review ${e.title}`}>
        Review
      </DemoButton>
    );
  }

  const label = e.status === "not-started" ? "Start" : "Continue";
  const href = courseHref(e, personaId);
  if (href) {
    return (
      <Button hierarchy={emphasis} size={size} aria-label={`${label} ${e.title}`} onClick={() => router.push(href)}>
        {label}
      </Button>
    );
  }
  return (
    <DemoButton hierarchy={emphasis} size={size} aria-label={`${label} ${e.title}`}>
      {label}
    </DemoButton>
  );
}

/** Two-letter course initials for the tiles ("Six Sigma for Process Improvement" → "SS"). */
export function initials(title: string): string {
  const words = title.split(/\s+/).filter((w) => /^[A-Z]/.test(w));
  return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
}

export function PlansMain({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <main id="main" tabIndex={-1} className={cn("mx-auto w-full flex-1 px-4 py-10 outline-none md:px-8 md:py-14", className)}>
      {children}
    </main>
  );
}

export function PlansTitle() {
  return <h1 className="sk-text-display-sm-semibold text-sko-text-default">{PAGE_TITLE}</h1>;
}
