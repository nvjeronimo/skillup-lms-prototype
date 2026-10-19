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
        // DS v1.1 (14 Oct 2026): no side stripe — the whole card carries the state. Padding 16 all
        // round, 1px border. Live = bg/success-soft + border/success-soft; Upcoming = the "toasted"
        // bg/warning-muted + border/accent-yellow (ADR 012: live is green, not red).
        "flex items-center justify-between gap-4 rounded-xl border p-4",
        isLive ? "border-sko-border-success-soft bg-sko-bg-success-soft" : "border-sko-border-accent-yellow bg-sko-bg-warning-muted",
        className,
      )}
      // A named region, not an alert: the banner is on the page when it loads, and an alert would
      // interrupt the screen reader with it on every visit.
      role="region"
      aria-label={`${isLive ? "Live now" : "Upcoming"}: ${title}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Status pill: role-correct on-* pairs (text/on-success, text/on-warning) keep the
            label at 4.5:1+ in every mode; the dot follows the label colour. */}
        <span
          className={cn(
            "sk-text-body-small-medium inline-flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-2 pr-3 uppercase",
            isLive ? "bg-sko-bg-success text-sko-text-on-success" : "bg-sko-bg-warning text-sko-text-on-warning",
          )}
        >
          {/* Live: the dot pulses (sk-live-dot, still under reduced motion); "Live now" stays. */}
          <span className={cn("h-1.5 w-1.5 rounded-full bg-current", isLive && "sk-live-dot")} aria-hidden />
          {isLive ? "Live now" : "Upcoming"}
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="sk-text-body-medium-regular truncate text-sko-text-default">{title}</p>
          {subtitle ? (
            // On the toasted yellow, text/muted drops to 4.26:1 in dark: Upcoming uses the default ink.
            <p className={cn("sk-text-body-small-regular truncate", isLive ? "text-sko-text-muted" : "text-sko-text-default")}>{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <span className={cn("sk-text-body-small-medium hidden md:block", isLive ? "text-sko-text-subtle" : "text-sko-text-default")}>{status}</span>
        <Button variant="primary" size="md" onClick={onAction}>
          {isLive ? "Join Live Now" : "Set reminder"}
        </Button>
      </div>
    </div>
  );
}
