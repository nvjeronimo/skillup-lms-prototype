import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export type LiveBannerState = "Live" | "Upcoming";

export interface LiveNowBannerProps {
  state?: LiveBannerState;
  title: string;
  subtitle?: string;
  /** Right-side status text, e.g. "LIVE NOW · ENDS AT 4:30 PM". */
  statusLabel?: string;
  onAction?: () => void;
  className?: string;
}

/** Surfaces a live / upcoming session CTA across the LMS chrome (DS: State=Live/Upcoming). */
export function LiveNowBanner({
  state = "Live",
  title,
  subtitle,
  statusLabel,
  onAction,
  className,
}: LiveNowBannerProps) {
  const isLive = state === "Live";
  const status = statusLabel ?? (isLive ? "LIVE NOW · ENDS AT 4:30 PM" : "STARTS IN 12 MIN · 4:00 PM");

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border-l-4 bg-lms-bg-primary px-5 py-3 shadow-sm",
        isLive ? "border-lms-text-error-primary" : "border-lms-text-warning-primary",
        className,
      )}
      role="alert"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "lms-text-2xs-semibold inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-lms-fg-white",
            isLive ? "bg-lms-text-error-primary" : "bg-lms-text-warning-primary",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-lms-fg-white" aria-hidden />
          {isLive ? "Live now" : "Upcoming"}
        </span>
        <div className="min-w-0">
          <p className="lms-text-sm-semibold truncate text-lms-text-primary">{title}</p>
          {subtitle ? (
            <p className="lms-text-xs-regular truncate text-lms-text-tertiary">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <span className="lms-text-xs-medium hidden text-lms-text-tertiary md:block">{status}</span>
        <Button variant="primary" size="md" onClick={onAction}>
          {isLive ? "Join Live Now" : "Set reminder"}
        </Button>
      </div>
    </div>
  );
}
