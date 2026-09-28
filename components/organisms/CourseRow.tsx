import * as React from "react";
import { Lock } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
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
  onClick?: () => void;
  className?: string;
}

/** Course row in program lists — Active / Locked / Available states (matches DS). */
export function CourseRow({
  title,
  deliveryMode = "Live Sessions",
  state = "Active",
  progressPct = 0,
  unlockLabel = "UNLOCKS MAY 18",
  onClick,
  className,
}: CourseRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-sko-bg-page shadow-sk-card px-5 py-4",
        // DS Active: border/primary at 2px inside. 1px border + 1px inset ring = 2px, no layout shift.
        state === "Active"
          ? "border-sko-border-primary ring-1 ring-inset ring-sko-border-primary"
          : "border-sko-border-subtle",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={cn(
            "sk-text-md-medium truncate",
            state === "Locked" ? "text-sko-text-muted" : "text-sko-text-default",
          )}
        >
          {title}
        </span>
        <DeliveryModeBadge value={deliveryMode} />
      </div>

      {state === "Active" ? (
        <div className="flex items-center gap-4">
          {/* DS Progress bar, Label=Right: 140 wide, bar + label gap 12. */}
          <div className="flex w-[140px] items-center gap-3">
            <div
              role="progressbar"
              aria-label={`${title} progress`}
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 flex-1 overflow-hidden rounded-full bg-sko-bg-muted"
            >
              <div className="h-full rounded-full bg-sko-bg-info" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="sk-text-sm-medium text-sko-text-muted">{progressPct}%</span>
          </div>
          <Button variant="primary" size="sm" onClick={onClick}>
            Resume
          </Button>
        </div>
      ) : null}

      {state === "Locked" ? (
        <div className="flex items-center gap-4">
          <span className="sk-text-xs-medium inline-flex items-center gap-1.5 text-sko-text-warning">
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
          <Button variant="primary" size="sm" onClick={onClick}>
            Start
          </Button>
        </div>
      ) : null}
    </div>
  );
}
