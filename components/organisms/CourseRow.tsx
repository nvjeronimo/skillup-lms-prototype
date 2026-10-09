import * as React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { DeliveryModeBadge, type DeliveryMode } from "@/components/atoms/MetaBadges";
import { cn } from "@/lib/utils";

export type CourseRowState = "Active" | "Locked" | "Available";

export interface CourseRowProps {
  title: string;
  deliveryMode?: DeliveryMode;
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
  /** Weight of the Resume action (Active). In a list only the first row is `primary`. Defaults to the DS look. */
  emphasis?: "primary" | "secondary";
  className?: string;
}

/**
 * Course row in program lists — Active / Locked / Available states (matches DS).
 *
 * A long title wraps instead of being cut (10 Oct 2026, as fixed in Figma: the row grows from
 * 68 to 80 with a two-line title, and the delivery badge keeps its full width beside it).
 * Nothing is truncated; a row too narrow for two lines is the caller's to replace (the
 * Dashboard switches to the Resume row below 700px of row width).
 */
export function CourseRow({
  title,
  deliveryMode = "Live Sessions",
  state = "Active",
  progressPct = 0,
  unlockLabel = "UNLOCKS MAY 18",
  href,
  homeHref,
  onClick,
  emphasis = "primary",
  className,
}: CourseRowProps) {
  return (
    <div
      className={cn(
        // The DS stroke is inside the 68px row and the CSS border is outside the padding:
        // 19 / 15 + 1 border = the DS 20 / 16.
        // Every state has the same 1px border/subtle stroke in the DS (read 8 Oct 2026).
        "flex items-center gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card px-[19px] py-[15px]",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={cn(
            "sk-text-body-large-medium min-w-0",
            state === "Locked" ? "text-sko-text-muted" : "text-sko-text-default",
          )}
        >
          {homeHref && state !== "Locked" ? (
            <Link href={homeHref} className="hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </span>
        <span className="flex shrink-0">
          <DeliveryModeBadge value={deliveryMode} />
        </span>
      </div>

      {state === "Active" ? (
        <div className="flex shrink-0 items-center gap-4">
          {/* DS Progress bar, Label=Right: 140 wide, bar + label gap 12. */}
          <PlatformProgressBar
            value={progressPct}
            label={`${title} progress`}
            track="muted"
            showValue
            className="w-[140px]"
          />
          {href ? (
            <ButtonLink href={href} hierarchy={emphasis} size="sm" aria-label={`Resume ${title}`}>
              Resume
            </ButtonLink>
          ) : (
            <Button hierarchy={emphasis} size="sm" onClick={onClick}>
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
            <ButtonLink href={href} hierarchy="primary" size="sm" aria-label={`Start ${title}`}>
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
