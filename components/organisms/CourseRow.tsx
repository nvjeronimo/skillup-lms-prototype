import * as React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { CourseThumb } from "@/components/platform/my-learning/CourseThumb";
import type { TopicType } from "@/lib/types";
import { cn } from "@/lib/utils";

export type CourseRowState = "Active" | "Locked" | "Available";

export interface CourseRowProps {
  /** The headline: the module the learner left off in (Active), the first module (Available), the course (Locked). */
  title: string;
  /** The line under it: "Course · Program", or the program alone under a Locked course. One line, cut with an ellipsis. */
  context?: string;
  /** The topic the action opens: its type badge and its length sit above the headline. */
  next?: { type: TopicType; duration?: string };
  state?: CourseRowState;
  /** Progress % (Active state). */
  progressPct?: number;
  /** Unlock label (Locked state), e.g. "UNLOCKS MAY 18". */
  unlockLabel?: string;
  /** Where Resume / Start goes. With it the action is a real link; `onClick` is for actions that stay on the page. */
  href?: string;
  /** The course's page: the title becomes a link to it. */
  homeHref?: string;
  onClick?: () => void;
  /** Weight of the Resume action (Active). Secondary, as the DS Course-Row; `primary` only where a screen asks for it. */
  emphasis?: "primary" | "secondary";
  /** The course's picture, down the left edge of the row (22 Oct 2026); the initials until it loads. */
  imageSrc?: string;
  initials?: string;
  className?: string;
}

/**
 * Course row in program lists — Active / Locked / Available states (matches DS).
 *
 * A long title wraps instead of being cut (10 Oct 2026, as fixed in Figma).
 * A row too narrow for two lines is the caller's to replace (the Dashboard switches to the
 * Resume row below 700px of row width).
 *
 * DS v2.0 (Nelson, 12 Oct 2026): the row says where the learner left off. `title` is the
 * module, `context` the course and its program on a second line (body-small Regular,
 * text/subtle, 2 under the title, one line). Above the title, `next` prints the type of the
 * topic the action opens (DS Topic-Types-Badge) and its length, 8 apart with a "·" between
 * (body-small Medium, text/subtle). The row is 96 tall with the three lines. The delivery
 * badge left the row in this version.
 */
export function CourseRow({
  title,
  context,
  next,
  state = "Active",
  progressPct = 0,
  unlockLabel = "UNLOCKS MAY 18",
  href,
  homeHref,
  onClick,
  emphasis = "secondary",
  imageSrc,
  initials,
  className,
}: CourseRowProps) {
  // What the controls name: the module and, with it, the course it belongs to.
  const subject = context ? `${title}, ${context}` : title;
  return (
    <div
      className={cn(
        // The DS stroke is inside the 68px row and the CSS border is outside the padding:
        // 19 / 15 + 1 border = the DS 20 / 16.
        // Every state has the same 1px border/subtle stroke in the DS (read 8 Oct 2026).
        "sk-press-card group relative flex items-center gap-4 overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page px-[19px] py-[15px] shadow-sk-card",
        homeHref &&
          state !== "Locked" &&
          "transition-colors has-[span_a:hover]:border-sko-border-default",
        className,
      )}
    >
      {initials ? (
        <CourseThumb shape="cover" initials={initials} imageSrc={imageSrc} className="-my-[15px] -ml-[19px] w-[118px] shrink-0 self-stretch" />
      ) : null}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex min-w-0 flex-col">
            {next ? (
              <span className="sk-text-body-small-medium flex items-center gap-2 text-sko-text-subtle">
                <TopicTypeBadge type={next.type} />
                {next.duration ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{next.duration}</span>
                  </>
                ) : null}
              </span>
            ) : null}
            <span
              className={cn(
                "sk-text-body-large-medium min-w-0",
                state === "Locked" ? "text-sko-text-muted" : "text-sko-text-default",
              )}
            >
              {homeHref && state !== "Locked" ? (
                <Link
                  href={homeHref}
                  className="after:absolute after:inset-0 after:content-[''] hover:underline"
                >
                  {title}
                </Link>
              ) : (
                title
              )}
            </span>
          </span>
          {context ? (
            <span className="sk-text-body-small-regular truncate text-sko-text-subtle">
              {context}
            </span>
          ) : null}
        </span>
      </div>

      {state === "Active" ? (
        <div className="flex shrink-0 items-center gap-4">
          {/* DS Progress bar, Label=Right: 140 wide, bar + label gap 12. */}
          <PlatformProgressBar
            value={progressPct}
            label={`${subject} progress`}
            track="muted"
            showValue
            className="w-[140px]"
          />
          {href ? (
            <ButtonLink
              href={href}
              hierarchy={emphasis}
              size="sm"
              className="relative z-[1]"
              aria-label={`Resume ${subject}`}
            >
              Resume
            </ButtonLink>
          ) : (
            <Button hierarchy={emphasis} size="sm" onClick={onClick} className="relative z-[1]">
              Resume
            </Button>
          )}
        </div>
      ) : null}

      {state === "Locked" ? (
        <div className="flex items-center gap-4">
          <span className="sk-text-body-small-medium inline-flex items-center gap-1.5 text-sko-text-warning">
            <Icon icon={Lock} size={14} className="text-sko-icon-warning" />
            {unlockLabel}
          </span>
          {/* DS Locked: grey outline (bg/page, border/default) — neutral, not the teal Secondary. */}
          <Button variant="neutral" size="sm" onClick={onClick}>
            Details
          </Button>
        </div>
      ) : null}

      {state === "Available" ? (
        /* DS Available: the "AVAILABLE NOW" status label is hidden; only Start shows. */
        <div className="flex items-center gap-4">
          {href ? (
            <ButtonLink href={href} hierarchy="primary" size="sm" aria-label={`Start ${subject}`}>
              Start
            </ButtonLink>
          ) : (
            <Button variant="primary" size="sm" onClick={onClick}>
              Start
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
