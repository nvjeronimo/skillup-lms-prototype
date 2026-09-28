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
        // DS: pad 16/16/16/24 with a 4px inside stroke on the left (4 + 20 = 24), no effect.
        "flex items-center justify-between gap-4 rounded-xl border-l-4 bg-sko-bg-page py-4 pl-5 pr-4",
        isLive ? "border-sko-border-error" : "border-sko-border-warning",
        className,
      )}
      role="alert"
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Status pill: role-correct on-* pairs (text/on-error, text/on-warning) keep the
            label at 4.5:1+ in every mode; the dot follows the label colour. */}
        <span
          className={cn(
            "sk-text-xs-medium inline-flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-2 pr-3 uppercase",
            isLive ? "bg-sko-bg-error text-sko-text-on-error" : "bg-sko-bg-warning text-sko-text-on-warning",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
          {isLive ? "Live now" : "Upcoming"}
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="sk-text-sm-regular truncate text-sko-text-default">{title}</p>
          {subtitle ? (
            <p className="sk-text-xs-regular truncate text-sko-text-muted">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <span className="sk-text-xs-medium hidden text-sko-text-subtle md:block">{status}</span>
        <Button variant="primary" size="md" onClick={onAction}>
          {isLive ? "Join Live Now" : "Set reminder"}
        </Button>
      </div>
    </div>
  );
}
