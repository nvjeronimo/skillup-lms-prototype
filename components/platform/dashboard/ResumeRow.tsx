import Link from "@/lib/router";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { CourseThumb } from "@/components/platform/my-learning/CourseThumb";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import type { TopicType } from "@/lib/types";
import { cn } from "@/lib/utils";
import styles from "./ResumeRow.module.css";

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
  /** The course's picture, across the top of the row (22 Oct 2026); the initials until it loads. */
  imageSrc?: string;
  initials?: string;
  className?: string;
}

/**
 * DS `LMS/Platform/Dashboard/Resume-Row` v1.1 (12 Oct 2026): a course to resume on a narrow
 * screen, the mobile pair of the DS `LMS/Platform/Discovery/Course-Row`, with the same three
 * lines: the type of the topic Resume opens and its length (body-small Medium, text/subtle),
 * the module the learner left off in (body-large Medium, wraps), and `context`, the course and
 * its program (body-small Regular, text/subtle, one line, 2 under the title). Then the DS
 * Progress bar with the percentage and the button (gap 12 above, 16 between). bg/page, 1px
 * border/subtle, radius 12, no shadow. No delivery badge since v1.1. The cover (Nelson, 23 Oct
 * 2026): 140 tall across the top, the content 16 under it (padding top 140 + 16), 20 on the
 * sides and 16 at the bottom.
 * The button is drawn sm (36); it is md (44) here for the mobile touch-target minimum. It
 * opens the course, so it is a link with the button look (atoms/ButtonLink).
 */
export function ResumeRow({ title, context, next, progressPct, href, homeHref, emphasis = "secondary", imageSrc, initials, className }: ResumeRowProps) {
  const subject = context ? `${title}, ${context}` : title;
  return (
    <div
      className={cn(
        "sk-press-card",
        styles.row,
        homeHref && styles.rowLinked,
        className,
      )}
    >
      {initials ? (
        <CourseThumb shape="cover" initials={initials} imageSrc={imageSrc} className={styles.cover} />
      ) : null}
      <div className={styles.text}>
        <div className={styles.lines}>
          {next ? (
            <p className={cn("sk-text-body-small-medium", styles.next)}>
              <TopicTypeBadge type={next.type} />
              {next.duration ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{next.duration}</span>
                </>
              ) : null}
            </p>
          ) : null}
          <p className={cn("sk-text-body-large-medium", styles.title)}>
            {homeHref ? (
              <Link href={homeHref} className={styles.link}>
                {title}
              </Link>
            ) : (
              title
            )}
          </p>
        </div>
        {context ? <p className={cn("sk-text-body-small-regular", styles.context)}>{context}</p> : null}
      </div>
      <div className={styles.progress}>
        <PlatformProgressBar
          track="muted"
          value={progressPct}
          label={`${subject} progress`}
          showValue
          className={styles.bar}
        />
        <ButtonLink href={href} hierarchy={emphasis} size="md" className={styles.resume} aria-label={`Resume ${subject}`}>
          Resume
        </ButtonLink>
      </div>
    </div>
  );
}
