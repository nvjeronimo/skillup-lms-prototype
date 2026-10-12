import Link from "next/link";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { DeliveryModeBadge, type DeliveryMode } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { cn } from "@/lib/utils";

export interface ResumeRowProps {
  /** The headline: the module the learner left off in. */
  title: string;
  /** The line under it: "Course · Program". One line, cut with an ellipsis. */
  context?: string;
  deliveryMode: DeliveryMode;
  progressPct: number;
  /** Where "Resume" goes. */
  href: string;
  /** The course's page: the title becomes a link to it. */
  homeHref?: string;
  /** Weight of the action. In a list only the first row is `primary`. */
  emphasis?: "primary" | "secondary";
  className?: string;
}

/**
 * DS `LMS/Platform/Dashboard/Resume-Row`: a course to resume on a narrow screen, the
 * mobile stand-in for the DS `LMS / Course Row`, which cannot show its delivery badge under
 * ~390px. Same atoms and tokens as the DS row: title (body-large/Medium), the Delivery Mode
 * badge under it (gap 8), then the DS Progress bar with the percentage (gap 12) and the
 * button (gap 16). bg/page, 1px border/subtle, radius 12, padding 16, gap 12, no shadow
 * (327 × 136 as drawn; the DS stroke is part of the layout, so the border adds to the padding).
 * The button is drawn sm (36); it is md (44) here for the mobile touch-target minimum. It
 * opens the course, so it is a link with the button look (atoms/ButtonLink).
 * DS v1.1 (12 Oct 2026): the title is the module the learner left off in and `context`
 * (course · program, body-small Regular, text/subtle) sits 2 under it, on one line.
 */
export function ResumeRow({ title, context, deliveryMode, progressPct, href, homeHref, emphasis = "primary", className }: ResumeRowProps) {
  const subject = context ? `${title}, ${context}` : title;
  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-4",
        homeHref && "transition-colors has-[p_a:hover]:border-sko-border-default",
        className,
      )}
    >
      <div className="flex flex-col items-start gap-2">
        <div className="flex w-full min-w-0 flex-col gap-0.5">
          <p className="sk-text-body-large-medium w-full text-sko-text-default">
            {homeHref ? (
              <Link href={homeHref} className="hover:underline after:absolute after:inset-0 after:content-['']">
                {title}
              </Link>
            ) : (
              title
            )}
          </p>
          {context ? <p className="sk-text-body-small-regular truncate text-sko-text-subtle">{context}</p> : null}
        </div>
        <DeliveryModeBadge value={deliveryMode} />
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
