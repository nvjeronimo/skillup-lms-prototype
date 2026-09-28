import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CertStatus, DueItem, Enrolment, LiveSession } from "@/lib/lab/dashboard-mock";

/* Links styled as DS Button V2 (Brand). Button.tsx renders a <button>; navigation needs <a>. */
const FOCUS =
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-border-focus-gap),0_0_0_4px_var(--color-border-primary)]";

export const linkPrimary = cn(
  "inline-flex min-h-[44px] h-12 items-center justify-center gap-1.5 rounded-md px-5 transition-colors",
  "sk-text-md-semibold bg-sko-bg-primary text-sko-text-on-primary hover:bg-sko-bg-primary-hover hover:text-sko-text-on-primary-hover",
  FOCUS,
);

export const linkSecondary = cn(
  "inline-flex min-h-[44px] items-center justify-center gap-1 rounded-md px-4 transition-colors",
  "sk-text-sm-semibold bg-sko-bg-page text-sko-text-primary ring-1 ring-inset ring-sko-border-primary hover:bg-sko-bg-faint",
  "forced-colors:border forced-colors:border-solid forced-colors:border-sko-border-primary",
  FOCUS,
);

export const linkText = cn(
  "inline-flex min-h-[44px] items-center gap-1 rounded-md text-sko-text-primary underline underline-offset-4 hover:bg-sko-bg-faint",
  FOCUS,
);

export { Link };

/** Topic-count progress: a bar plus the visible "16 of 42 topics · 38%". */
export function TopicProgress({
  enrolment,
  size = "md",
  className,
}: {
  enrolment: Enrolment;
  size?: "md" | "sm";
  className?: string;
}) {
  const { pct, topicsDone, topicsTotal, title } = enrolment;
  const label = `${topicsDone} of ${topicsTotal} topics · ${pct}%`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        role="progressbar"
        aria-label={`${title} progress`}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={label}
        className={cn("overflow-hidden rounded-full bg-sko-bg-muted", size === "md" ? "h-2.5" : "h-1.5")}
      >
        {/* DS rule: progress bars fill with bg/info. */}
        <div className="h-full rounded-full bg-sko-bg-info" style={{ width: `${pct}%` }} />
      </div>
      <p className={cn(size === "md" ? "sk-text-sm-medium" : "sk-text-xs-medium", "text-sko-text-muted")}>{label}</p>
    </div>
  );
}

/** Days since last activity, parsed from the relative label ("19 days ago", "14 months ago"). */
export function daysAway(lastActive: string): number {
  const m = /(\d+)\s+(day|week|month|year)s?\s+ago/i.exec(lastActive);
  if (!m) return 0;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  return unit === "day" ? n : unit === "week" ? n * 7 : unit === "month" ? n * 30 : n * 365;
}

/** Certificate status in non-anxious language (REAL `cert_status`). */
export function certCopy(status: CertStatus, notStarted: boolean): { title: string; detail: string } {
  switch (status) {
    case "downloadable":
      return { title: "Certificate ready", detail: "You passed this course. Your certificate is ready to download." };
    case "generating":
      return { title: "Certificate on its way", detail: "You passed. Your certificate is being prepared." };
    case "audit_passing":
      return {
        title: "Pass mark reached",
        detail: "You are passing. A certificate needs the verified track for this course.",
      };
    case "notpassing":
    default:
      return notStarted
        ? { title: "Certificate available", detail: "Pass the course to earn its certificate. Start whenever you are ready." }
        : { title: "Keep going", detail: "Pass mark not reached yet. Each graded topic you finish counts toward it." };
  }
}

const LIVE_ORDER: LiveSession["state"][] = ["live", "today", "upcoming", "recording"];
const DUE_ORDER: DueItem["state"][] = ["overdue", "due-soon", "upcoming"];

export function pickLive(list: LiveSession[]): LiveSession | undefined {
  return [...list].sort((a, b) => LIVE_ORDER.indexOf(a.state) - LIVE_ORDER.indexOf(b.state))[0];
}

export function pickDue(list: DueItem[]): DueItem | undefined {
  return [...list].sort((a, b) => DUE_ORDER.indexOf(a.state) - DUE_ORDER.indexOf(b.state))[0];
}
