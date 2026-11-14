import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import styles from "./LiveNowBanner.module.css";

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
        styles.banner,
        isLive ? styles.bannerLive : styles.bannerUpcoming,
        className,
      )}
      // A named region, not an alert: the banner is on the page when it loads, and an alert would
      // interrupt the screen reader with it on every visit.
      role="region"
      aria-label={`${isLive ? "Live now" : "Upcoming"}: ${title}`}
    >
      <div className={styles.lead}>
        {/* Status pill: role-correct on-* pairs (text/on-success, text/on-warning) keep the
            label at 4.5:1+ in every mode; the dot follows the label colour. */}
        <span
          className={cn(
            "sk-text-body-small-medium",
            styles.pill,
            isLive ? styles.pillLive : styles.pillUpcoming,
          )}
        >
          {/* Live: the dot pulses (sk-live-dot, still under reduced motion); "Live now" stays. */}
          <span className={cn(styles.dot, isLive && "sk-live-dot")} aria-hidden />
          {isLive ? "Live now" : "Upcoming"}
        </span>
        <div className={styles.text}>
          <p className={`sk-text-body-medium-regular ${styles.title}`}>{title}</p>
          {subtitle ? (
            // On the toasted yellow, text/muted drops to 4.26:1 in dark: Upcoming uses the default ink.
            <p className={cn("sk-text-body-small-regular", styles.subtitle, isLive ? styles.inkMuted : styles.inkDefault)}>{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className={styles.end}>
        <span className={cn("sk-text-body-small-medium", styles.status, isLive ? styles.inkSubtle : styles.inkDefault)}>{status}</span>
        <Button variant="primary" size="md" onClick={onAction}>
          {isLive ? "Join Live Now" : "Set reminder"}
        </Button>
      </div>
    </div>
  );
}
