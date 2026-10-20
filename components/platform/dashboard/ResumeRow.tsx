import Link from "next/link";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import type { TopicType } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ResumeRowProps {
  /** The headline: the module the learner left off in. */
  title: string;
  /** The line under it: "Course · Program". One line, cut with an ellipsis. */
  context?: string;
  /** The topic Resume opens: its type badge and its length sit above the title. */
  next?: { type: TopicType; duration?: string };
  progressPct: number;
  /** Where "Resume" goes. */
  href: string;
  /** The course's page: the title becomes a link to it. */
  homeHref?: string;
  /** Weight of the action. Secondary, as the DS Resume-Row; `primary` only where a screen asks for it. */
  emphasis?: "primary" | "secondary";
  className?: string;
}

/**
 * DS `LMS/Platform/Dashboard/Resume-Row` v1.1 (12 Oct 2026): a course to resume on a narrow
 * screen, the mobile pair of the DS `LMS/Platform/Discovery/Course-Row`, with the same three
 * lines: the type of the topic Resume opens and its length (body-small Medium, text/subtle),
 * the module the learner left off in (body-large Medium, wraps), and `context`, the course and
 * its program (body-small Regular, text/subtle, one line, 2 under the title). Then the DS
 * Progress bar with the percentage and the button (gap 12 above, 16 between). bg/page, 1px
 * border/subtle, radius 12, padding 16, no shadow. No delivery badge since v1.1.
 * The button is drawn sm (36); it is md (44) here for the mobile touch-target minimum. It
 * opens the course, so it is a link with the button look (atoms/ButtonLink).
 */
export function ResumeRow({ title, context, next, progressPct, href, homeHref, emphasis = "secondary", className }: ResumeRowProps) {
  const subject = context ? `${title}, ${context}` : title;
  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4",
        homeHref && "transition-colors has-[p_a:hover]:border-sko-border-default",
        className,
      )}
    >
      <div className="flex w-full min-w-0 flex-col gap-0.5">
        <div className="flex w-full min-w-0 flex-col">
          {next ? (
            <p className="sk-text-body-small-medium flex items-center gap-2 text-sko-text-subtle">
              <TopicTypeBadge type={next.type} />
              {next.duration ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{next.duration}</span>
                </>
              ) : null}
            </p>
          ) : null}
          <p className="sk-text-body-large-medium w-full text-sko-text-default">
            {homeHref ? (
              <Link href={homeHref} className="hover:underline after:absolute after:inset-0 after:content-['']">
                {title}
              </Link>
            ) : (
              title
            )}
          </p>
        </div>
        {context ? <p className="sk-text-body-small-regular truncate text-sko-text-subtle">{context}</p> : null}
      </div>
      <div className="flex items-center gap-4">
        <PlatformProgressBar
          track="muted"
          value={progressPct}
          label={`${subject} progress`}
          showValue
          className="min-w-0 flex-1"
        />
        <ButtonLink href={href} hierarchy={emphasis} size="md" className="relative z-[1] shrink-0" aria-label={`Resume ${subject}`}>
          Resume
        </ButtonLink>
      </div>
    </div>
  );
}
