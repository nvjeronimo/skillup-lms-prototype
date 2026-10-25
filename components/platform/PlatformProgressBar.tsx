"use client";

import { Badge } from "@/components/atoms/Badge";
import { ArrivalCountFrom } from "@/components/atoms/ArrivalCount";
import { useArrivalValue } from "@/lib/arrival/useArrival";
import { cn } from "@/lib/utils";

export interface PlatformProgressBarProps {
  /** 0–100. */
  value: number;
  /** Accessible name: what the bar measures. */
  label: string;
  /**
   * @deprecated Every track is bg/track (alias of bg/muted) since 20 Oct 2026 (Bruno, WCAG 1.4.11: the bg/info fill
   * on bg/strong was 2.26:1; on bg/muted it is 3.21:1, 3.06:1 in dark). Kept so call sites compile.
   */
  track?: "muted" | "strong";
  /** Bar height in px. */
  height?: 4 | 8;
  /**
   * `complete` paints the fill in bg/success: only for a finished course or program, and
   * always beside a check icon and the word (colour is never the only sign).
   */
  tone?: "progress" | "complete";
  /** The DS Progress bar has steps of 10: the fill goes to the nearest one. */
  stepped?: boolean;
  /** DS Label=Right: the value in body-medium/Medium text/muted, 12 from the bar. */
  showValue?: boolean;
  className?: string;
}

/**
 * DS `Progress bar` (6204:128904): an 8px track with the fill on bg/info — never bg/primary,
 * the product rule for every progress fill while it runs; green (bg/success) only once the
 * course or program is complete (`tone`, 13 Oct 2026). A progress bar ends straight, track and fill
 * (Nelson, 13 Oct 2026; the Course Card bar was rounded until then). One bar for the
 * platform pages, on a bg/track track (alias of bg/muted; 20 Oct 2026, contrast). With `stepped` the fill is rounded to the nearest 10 as in
 * the DS component; assistive tech always gets the real value.
 * `className` goes on the bar, or on the bar + value row when `showValue` is set.
 * On a page's first visit in the session the fill grows from empty when the bar first shows
 * (a scaleX transform, long2, standard-decelerate) and the value counts up with it
 * from the bar's own trigger (motion-matrix §7.9); on a revisit or under reduced motion it is drawn full at once.
 */
export function PlatformProgressBar({
  value,
  label,
  height = 8,
  stepped = false,
  tone = "progress",
  showValue = false,
  className,
}: PlatformProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const fill = stepped ? Math.round(pct / 10) * 10 : pct;
  const arrival = useArrivalValue<HTMLDivElement>(fill);

  const bar = (
    <div
      ref={arrival.ref}
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        height === 4 ? "h-1" : "h-2",
        "bg-sko-bg-track",
        showValue ? "min-w-0 flex-1" : className,
      )}
    >
      <div
        className={cn(
          "h-full origin-left transition-transform duration-long2 ease-standard-decelerate",
          tone === "complete" ? "bg-sko-bg-success" : "bg-sko-bg-info",
        )}
        style={{ width: `${fill}%`, transform: arrival.armed ? "scaleX(0)" : undefined }}
      />
    </div>
  );

  if (!showValue) return bar;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {bar}
      {/* The progressbar already carries the value. */}
      <span aria-hidden="true" className="sk-text-body-medium-medium shrink-0 text-sko-text-muted">
        <ArrivalCountFrom value={`${pct}%`} trigger={arrival.trigger} />
      </span>
    </div>
  );
}

/**
 * The right-hand label of a header Progress card (program and course pages): what the bar measures
 * while it runs, and the soft success Badge "Completed" once it reaches 100, as on the cards (the
 * green bar is never the only sign; Nelson, 16 Oct 2026; the badge since 25 Oct 2026).
 */
export function ProgressCardLabel({ complete, label }: { complete: boolean; label: string }) {
  return complete ? (
    <Badge variant="soft" color="success">
      Completed
    </Badge>
  ) : (
    <p className="sk-text-body-small-regular text-sko-text-subtle">{label}</p>
  );
}
