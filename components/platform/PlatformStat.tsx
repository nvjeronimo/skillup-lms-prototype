import { cn } from "@/lib/utils";

export interface PlatformStatProps {
  label: string;
  value: string;
  detail: string;
  /** Shorter words for the phone's one-line glance card (inverse only). */
  shortLabel?: string;
  shortDetail?: string;
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
export function PlatformStat({ label, value, detail, shortLabel, shortDetail, theme = "default", divider = false, className }: PlatformStatProps) {
  if (theme === "inverse") {
    // On a phone the glance card is one line of four (Nelson, 21 Oct 2026): the short words show
    // there and the full ones from tablet up; only one of each is ever displayed (and read).
    const both = (full: string, short?: string) =>
      short ? (
        <>
          <span className="md:hidden">{short}</span>
          <span className="max-md:hidden">{full}</span>
        </>
      ) : (
        full
      );
    return (
      <div className={cn("flex min-w-0 flex-col justify-end gap-1 text-sko-text-on-inverse", className)}>
        <p data-stat-value="" className="sk-text-headline-medium-bold">{value}</p>
        <p data-stat-label="" className="sk-text-label-small-semibold opacity-80 max-md:whitespace-nowrap max-md:normal-case max-md:tracking-normal">{both(label, shortLabel)}</p>
        <p data-stat-detail="" className="sk-text-body-small-medium opacity-60 [[data-theme=dark]_&]:opacity-70">{both(detail, shortDetail)}</p>
      </div>
    );
  }
  return (
    <div
      className={cn(
        // Top-aligned: when one detail wraps to two lines (a phone), the labels and the figures of
        // the stats beside it stay on the same lines.
        "relative flex min-w-0 flex-col justify-start gap-2 p-4",
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
