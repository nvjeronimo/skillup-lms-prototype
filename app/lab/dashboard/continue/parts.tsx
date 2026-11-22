import * as React from "react";
import Link from "@/lib/router";
import { cn } from "@/lib/utils";
import type { CertStatus, DueItem, Enrolment, LiveSession } from "@/lib/lab/dashboard-mock";
import styles from "./parts.module.css";

/* Links styled as DS Button (Brand). Button.tsx renders a <button>; navigation needs <a>. */
export const linkPrimary = cn(styles.primary, "sk-text-body-large-semibold");

export const linkSecondary = cn(styles.secondary, "sk-text-body-medium-semibold");

export const linkText = styles.text;

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
    <div className={cn(styles.progress, className)}>
      <div
        role="progressbar"
        aria-label={`${title} progress`}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={label}
        className={cn(styles.bar, size === "md" ? styles.barMd : styles.barSm)}
      >
        {/* DS rule: progress bars fill with bg/info. */}
        <div className={cn(styles.fill, pct >= 100 ? styles.fillDone : styles.fillInfo)} style={{ width: `${pct}%` }} />
      </div>
      <p className={cn(size === "md" ? "sk-text-body-medium-medium" : "sk-text-body-small-medium", styles.label)}>{label}</p>
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
