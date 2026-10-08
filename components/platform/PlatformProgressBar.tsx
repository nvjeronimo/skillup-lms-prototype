import { cn } from "@/lib/utils";

export interface PlatformProgressBarProps {
  /** 0–100. */
  value: number;
  /** Accessible name: what the bar measures. */
  label: string;
  /**
   * `strong`: the DS Progress bar — square, on bg/strong.
   * `muted`: the bar of the DS Course Card and Course Row — fully rounded, on bg/muted.
   */
  track?: "muted" | "strong";
  /** Bar height in px. */
  height?: 4 | 8;
  /** The DS Progress bar has steps of 10: the fill goes to the nearest one. */
  stepped?: boolean;
  /** DS Label=Right: the value in body-medium/Medium text/muted, 12 from the bar. */
  showValue?: boolean;
  className?: string;
}

/**
 * DS `Progress bar` (6204:128904): an 8px track with the fill on bg/info — never bg/primary,
 * the product rule for every progress fill. One bar for the platform pages, in the two
 * shapes the DS draws (`track`). With `stepped` the fill is rounded to the nearest 10 as in
 * the DS component; assistive tech always gets the real value.
 * `className` goes on the bar, or on the bar + value row when `showValue` is set.
 */
export function PlatformProgressBar({
  value,
  label,
  track = "strong",
  height = 8,
  stepped = false,
  showValue = false,
  className,
}: PlatformProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const fill = stepped ? Math.round(pct / 10) * 10 : pct;
  const pill = track === "muted";

  const bar = (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        height === 4 ? "h-1" : "h-2",
        pill ? "overflow-hidden rounded-full bg-sko-bg-muted" : "bg-sko-bg-strong",
        showValue ? "min-w-0 flex-1" : className,
      )}
    >
      <div className={cn("h-full bg-sko-bg-info", pill && "rounded-full")} style={{ width: `${fill}%` }} />
    </div>
  );

  if (!showValue) return bar;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {bar}
      {/* The progressbar already carries the value. */}
      <span aria-hidden="true" className="sk-text-body-medium-medium shrink-0 text-sko-text-muted">
        {pct}%
      </span>
    </div>
  );
}
