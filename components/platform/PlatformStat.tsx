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
 * Inverse: value · label · detail, gap 4, all text/on-inverse; the label sits at 60% and
 * the detail at 50% layer opacity (the DS has no translucent text token).
 */
export function PlatformStat({ label, value, detail, theme = "default", divider = false, className }: PlatformStatProps) {
  if (theme === "inverse") {
    return (
      <div className={cn("flex min-w-0 flex-col justify-end gap-1 text-sko-text-on-inverse", className)}>
        <p className="sk-text-display-sm-bold">{value}</p>
        <p className="sk-text-2xs-semibold opacity-60">{label}</p>
        <p className="sk-text-xs-medium opacity-50">{detail}</p>
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
      <p className="sk-text-2xs-semibold text-sko-text-muted">{label}</p>
      <p className="sk-text-display-sm-bold text-sko-text-default">{value}</p>
      <p className="sk-text-xs-medium text-sko-text-muted">{detail}</p>
    </div>
  );
}
