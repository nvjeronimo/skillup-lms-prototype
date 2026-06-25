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
        "flex items-center gap-4 rounded-xl border bg-sk-bg-primary px-5 py-3",
        state === "Active" ? "border-sk-border-brand" : "border-sk-border-secondary",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={cn(
            "sk-text-md-semibold truncate",
            state === "Locked" ? "text-sk-text-tertiary" : "text-sk-text-primary",
          )}
        >
          {title}
        </span>
        <DeliveryModeBadge value={deliveryMode} />
      </div>

      {state === "Active" ? (
        <div className="flex items-center gap-3">
          <div className="h-2 w-40 overflow-hidden rounded-full bg-sk-bg-tertiary">
            <div className="h-full rounded-full bg-sk-fg-progress" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="sk-text-sm-regular text-sk-text-tertiary">{progressPct}%</span>
          <Button variant="primary" size="md" onClick={onClick}>
            Resume
          </Button>
        </div>
      ) : null}

      {state === "Locked" ? (
        <div className="flex items-center gap-3">
          <span className="sk-text-xs-semibold inline-flex items-center gap-1 text-sk-text-warning-primary">
            <Icon icon={Lock} size={14} />
            {unlockLabel}
          </span>
          <Button variant="secondary" size="md" onClick={onClick}>
            Details
          </Button>
        </div>
      ) : null}

      {state === "Available" ? (
        <div className="flex items-center gap-3">
          <span className="sk-text-xs-semibold text-sk-text-success-primary">AVAILABLE NOW</span>
          <Button variant="primary" size="md" onClick={onClick}>
            Start
          </Button>
        </div>
      ) : null}
    </div>
  );
}
