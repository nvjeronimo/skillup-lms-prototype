import { PlatformStat } from "@/components/platform/PlatformStat";
import type { DashboardStat } from "@/lib/platform/dashboard";
import { cn } from "@/lib/utils";

export interface GlanceCardProps {
  title: string;
  /** Four stats in one line on every breakpoint (the phone's line uses short words). */
  stats: DashboardStat[];
  className?: string;
}

/**
 * DS `LMS/Platform/Dashboard/Today-at-a-glance`: the Dashboard hero card, full width since
 * the streak card left (7 Oct). Title (label-small/Semibold, text/on-inverse) and four
 * `Stat` · Inverse on bg/inverse. Four in a line on every breakpoint: on a phone too since
 * Nelson, 21 Oct 2026 (it was 2 × 2 and pushed "Pick up where you left off" below the fold),
 * with short labels and details there. Padding 24 / 20 / 16, title-to-stats gap 20 / 20 / 16
 * and the gap between stats 24 / 20 / 16 (desktop / tablet / mobile): 1200 × 168, 896 × 160,
 * 327 × 252. The two circles are decoration only: bg/info (200) and bg/primary (320) at
 * 12% layer opacity, clipped by the card.
 * The totals come from Learner Home (handoff map §37.4), so the card is not marked as sample
 * data; only "1 in progress" under Programs costs a call per program.
 */
export function GlanceCard({ title, stats, className }: GlanceCardProps) {
  return (
    <section
      aria-labelledby="dashboard-glance-title"
      data-glance=""
      className={cn(
        "relative flex min-w-0 flex-col gap-4 overflow-hidden rounded-card bg-sko-bg-inverse p-4 md:gap-5 md:p-5 lg:p-6",
        className,
      )}
    >
      <div
        aria-hidden="true"
        data-glow=""
        className="pointer-events-none absolute right-[18px] top-[calc(50%+146px)] size-[200px] -translate-y-1/2 rounded-pill bg-sko-bg-info opacity-[0.12]"
      />
      <div
        aria-hidden="true"
        data-glow=""
        className="pointer-events-none absolute -right-[102px] top-[calc(50%-76px)] size-[320px] -translate-y-1/2 rounded-pill bg-sko-bg-primary opacity-[0.12]"
      />
      <h2 id="dashboard-glance-title" data-glance-title="" className="sk-text-label-small-semibold relative text-sko-text-on-inverse">
        {title}
      </h2>
      <ul className="relative flex justify-between gap-2 md:grid md:grid-cols-4 md:gap-5 lg:gap-6">
        {stats.map((stat) => (
          <li key={stat.label} className="w-min md:w-auto md:min-w-0">
            <PlatformStat
              theme="inverse"
              label={stat.label}
              value={stat.value}
              detail={stat.detail}
              shortLabel={stat.shortLabel}
              shortDetail={stat.shortDetail}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
