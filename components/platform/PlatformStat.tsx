import { cn } from "@/lib/utils";

export interface PlatformStatProps {
  label: string;
  value: string;
  detail: string;
  /**
   * `default`: label on top, on light surfaces (My Learning header).
   * `inverse`: value first, on bg/inverse (the Dashboard glance card).
   */
  theme?: "default" | "inverse";
  /** 1px border/subtle rule on the left, between stats in a row. */
  divider?: boolean;
  className?: string;
}

/**
 * DS `LMS / Platform / Stat` (6378:3299): one figure — a label, the value, a detail line.
 * Default: label-small/Semibold text/muted · headline-medium/Bold text/default ·
 * body-small/Medium text/muted, gap 8, padding 16.
 * Inverse: value · label · detail, gap 4, all text/on-inverse; the label sits at 80% and
 * the detail at 60% layer opacity (the DS has no translucent text token). In Dark, bg/inverse
 * turns light and the detail fails AA at 60%, so it sits at 70% there.
 */
export function PlatformStat({ label, value, detail, theme = "default", divider = false, className }: PlatformStatProps) {
  if (theme === "inverse") {
    return (
      <div className={cn("flex min-w-0 flex-col justify-end gap-1 text-sko-text-on-inverse", className)}>
        <p className="sk-text-headline-medium-bold">{value}</p>
        <p className="sk-text-label-small-semibold opacity-80">{label}</p>
        <p className="sk-text-body-small-medium opacity-60 [[data-theme=dark]_&]:opacity-70">{detail}</p>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-col justify-end gap-2 p-4",
        divider && "border-l border-sko-border-subtle",
        className,
      )}
    >
      <p className="sk-text-label-small-semibold text-sko-text-muted">{label}</p>
      <p className="sk-text-headline-medium-bold text-sko-text-default">{value}</p>
      <p className="sk-text-body-small-medium text-sko-text-muted">{detail}</p>
    </div>
  );
}
