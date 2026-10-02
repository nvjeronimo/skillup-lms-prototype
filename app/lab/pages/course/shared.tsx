"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Play } from "lucide-react";
import { Button, type ButtonProps } from "@/components/atoms/Button";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { MockTag } from "@/components/lab/MockTag";
import { Icon } from "@/lib/icons";
import { MOCK } from "@/lib/lab/dashboard-mock";
import { getPlan } from "@/lib/lab/training-plan";
import type { OptionKey } from "@/lib/lab/page-options";
import type { CompletionState, TopicType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  getCoursePlan,
  type CoursePlanModel,
  type PlanModule,
  type PlanTopic,
} from "@/app/lab/training/course/six-sigma/plan-model";

/**
 * Shared by the four Course plan options: the data, the back link, the one Continue button,
 * the topic line (state in words + icon), the progress bar and the page's single MockTag.
 */

export function useCourse() {
  const id = useSearchParams().get("persona");
  const plan = React.useMemo(() => getPlan(id), [id]);
  const model = React.useMemo(() => getCoursePlan(plan.persona.id), [plan.persona.id]);
  const started = model.done > 0;
  const replanned = plan.status.tone === "replanned" && model.moved > 0;
  const currentIndex = Math.max(
    0,
    model.modules.findIndex((m) => m.id === model.nextModuleId),
  );
  return {
    persona: plan.persona,
    plan,
    model,
    started,
    replanned,
    next: model.next,
    currentIndex,
    q: `?persona=${plan.persona.id}`,
  };
}

export type CourseData = ReturnType<typeof useCourse>;

/** "My learning", back to the Plans option with the same letter. */
export function BackLink({ option, q }: { option: OptionKey; q: string }) {
  return (
    <Link
      href={`/lab/pages/plans/${option}${q}`}
      className="sk-text-sm-semibold -ml-1 inline-flex min-h-[44px] items-center gap-1 rounded-md px-1 text-sko-text-primary hover:underline"
    >
      <Icon icon={ChevronLeft} size={20} aria-hidden="true" />
      My learning
    </Link>
  );
}

/** The page's one primary action. It navigates to the real topic route. */
export function ContinueButton({
  next,
  started,
  size = "lg",
  className,
}: {
  next: PlanTopic;
  started: boolean;
  size?: ButtonProps["size"];
  className?: string;
}) {
  const router = useRouter();
  const label = started ? "Continue" : "Start";
  return (
    <Button
      hierarchy="primary"
      size={size}
      leftIcon={Play}
      aria-label={`${label}: ${next.title}`}
      onClick={() => router.push(next.href)}
      className={className}
    >
      {label}
    </Button>
  );
}

/** "12 min", "1 h 5 min". */
export function formatMinutes(n: number): string {
  if (n < 60) return `${n} min`;
  const h = Math.floor(n / 60);
  const m = n % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** The duration as shown next to the type: whole minutes when known, else the data's own label (a live date). */
export function durationLabel(t: PlanTopic): string {
  return t.minutes != null ? `${t.minutes} min` : t.duration;
}

/** Visible state words. To-do is the quiet default and carries no word. */
export function stateWords(t: PlanTopic): string | undefined {
  switch (t.state) {
    case "done":
      return "Done";
    case "next":
      return t.movedFrom !== undefined ? "Up next · moved a week later" : "Up next";
    case "locked":
      return t.lockedBy ? `Locked · opens after “${t.lockedBy}”` : "Locked";
    default:
      return t.movedFrom !== undefined ? "Moved a week later" : undefined;
  }
}

const RING: Record<PlanTopic["state"], CompletionState> = {
  done: "Done",
  next: "Pending",
  todo: "Pending",
  locked: "Locked",
};

/** DS Completion Status, hidden from AT: the words next to it say the state. */
export function StateIcon({ t, size = 20 }: { t: PlanTopic; size?: number }) {
  return (
    <span aria-hidden className="mt-0.5 inline-flex shrink-0">
      <CompletionStatus state={RING[t.state]} size={size} />
    </span>
  );
}

/** Type badge · duration · state words, on one wrapping line. */
export function TopicMeta({ t, noState = false, className }: { t: PlanTopic; noState?: boolean; className?: string }) {
  const words = noState ? undefined : stateWords(t);
  const dur = durationLabel(t);
  return (
    <span className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-0.5", className)}>
      <TopicTypeBadge type={t.type as TopicType} />
      {dur ? (
        <>
          <span aria-hidden className="sk-text-xs-medium text-sko-icon-faint">
            ·
          </span>
          <span className="sk-text-xs-medium text-sko-text-subtle">{dur}</span>
        </>
      ) : null}
      {words ? (
        <>
          <span aria-hidden className="sk-text-xs-medium text-sko-icon-faint">
            ·
          </span>
          <span
            className={cn(
              "sk-text-xs-semibold",
              t.state === "done" ? "text-sko-text-success" : "text-sko-text-muted",
            )}
          >
            {words}
          </span>
        </>
      ) : noState ? null : (
        <span className="sr-only">, not started</span>
      )}
    </span>
  );
}

/**
 * One topic as a row: a link to the real topic route, or plain text when locked.
 * `accent` paints the SKO yellow (soft) behind the next topic — the page's single accent.
 */
export function TopicLine({
  t,
  accent = false,
  large = false,
}: {
  t: PlanTopic;
  accent?: boolean;
  large?: boolean;
}) {
  const body = (
    <>
      <StateIcon t={t} size={large ? 24 : 20} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={cn(
            large ? "sk-text-md-semibold" : "sk-text-sm-medium",
            t.state === "locked" ? "text-sko-text-muted" : "text-sko-text-default",
          )}
        >
          {t.title}
        </span>
        <TopicMeta t={t} />
      </span>
    </>
  );
  const box = cn(
    "flex min-h-[44px] items-start gap-3 rounded-lg",
    large ? "px-4 py-4" : "px-3 py-3",
    accent && t.state === "next" && "bg-sko-bg-accent-yellow-soft",
  );
  if (t.state === "locked") return <div className={box}>{body}</div>;
  return (
    <Link
      href={t.href}
      aria-current={t.state === "next" ? "step" : undefined}
      className={cn(box, !(accent && t.state === "next") && "hover:bg-sko-bg-faint")}
    >
      {body}
    </Link>
  );
}

/** The next topic, larger, with the page's one accent and its one primary button. */
export function NextTopicBlock({ t, started, large = false }: { t: PlanTopic; started: boolean; large?: boolean }) {
  return (
    <div className={`flex flex-col gap-4 rounded-lg bg-sko-bg-accent-yellow-soft ${large ? "p-5" : "p-4"} sm:flex-row sm:items-center sm:justify-between`}>
      <div className="flex min-w-0 items-start gap-3">
        <StateIcon t={t} size={24} />
        <div className="flex min-w-0 flex-col gap-1">
          <p className={`${large ? "sk-text-lg-semibold" : "sk-text-md-semibold"} text-sko-text-default`}>{t.title}</p>
          <TopicMeta t={t} />
        </div>
      </div>
      <ContinueButton next={t} started={started} className="w-full shrink-0 sm:w-auto" />
    </div>
  );
}

/** Thin progress bar: bg/info fill on a muted track, with the value in words beside it. */
export function CourseProgress({ model, className }: { model: CoursePlanModel; className?: string }) {
  const pct = Math.round((model.done / model.total) * 100);
  const words =
    model.done === 0 ? `Not started · ${model.total} topics` : `${model.done} of ${model.total} topics done`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="sk-text-sm-medium text-sko-text-muted">{words}</span>
      <div
        role="progressbar"
        aria-label="Course progress"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={words}
        className="h-1.5 overflow-hidden rounded-full bg-sko-bg-muted"
      >
        <div className="h-full rounded-full bg-sko-bg-info" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Minutes still to do in a module (topics with a known duration). */
export function minutesLeft(m: PlanModule): number {
  return m.topics.filter((t) => t.state !== "done").reduce((s, t) => s + (t.minutes ?? 0), 0);
}

/** A module's status in words: Done · In progress, 2 of 3 · Not started, 3 topics. */
export function moduleStatus(m: PlanModule, isCurrent: boolean): string {
  const total = m.topics.length;
  if (m.done === total) return `Done · all ${total} topics`;
  if (m.done > 0 || isCurrent) return `${m.done} of ${total} done`;
  const left = minutesLeft(m);
  return `Not started · ${total} topics${left ? ` · about ${formatMinutes(left)}` : ""}`;
}

/** Remaining work by kind, for the DS Module Time-Left row. */
export function timeLeftSegments(m: PlanModule): string[] {
  const left = m.topics.filter((t) => t.state !== "done");
  if (!left.length) return ["Nothing left in this module"];
  const sum = (pred: (t: PlanTopic) => boolean) =>
    left.filter((t) => pred(t) && !t.graded).reduce((s, t) => s + (t.minutes ?? 0), 0);
  const video = sum((t) => /Video|Recording|Podcast/.test(t.type));
  const reading = sum((t) => /Reading|Lesson Page/.test(t.type));
  const practice = sum((t) => !/Video|Recording|Podcast|Reading|Lesson Page/.test(t.type));
  const graded = left.filter((t) => t.graded).length;
  const out: string[] = [];
  if (video) out.push(`${formatMinutes(video)} of video left`);
  if (reading) out.push(`${formatMinutes(reading)} of reading left`);
  if (practice) out.push(`${formatMinutes(practice)} of practice left`);
  if (graded) out.push(`${graded} graded ${graded === 1 ? "piece" : "pieces"} left`);
  return out.length ? out : [`${left.length} topics left`];
}

/** Dev's re-plan, said once in plain words. */
export function ReplanNote({ data, className }: { data: CourseData; className?: string }) {
  if (!data.replanned) return null;
  return (
    <p className={cn("sk-text-sm-regular text-sko-text-muted", className)}>
      After your break we moved {data.model.moved} topics a week later. Nothing was dropped.
    </p>
  );
}

/** The certificate line: a date once started, the plan length before. */
export function certificateLine(data: CourseData): string {
  return data.started
    ? `Certificate planned for ${data.plan.raceDay}`
    : `${data.plan.weeksTotal}-week plan · it starts when you do`;
}

/** The page's one MockTag, at the bottom. */
export function PageMock() {
  return (
    <div className="mt-16">
      <MockTag
        reason={`Your progress, the re-plan, the plan length and the certificate date. ${MOCK.pace}; ${MOCK.due}. Titles, types, durations, locks and files are real.`}
      />
    </div>
  );
}
