import { PlatformStat } from "@/components/platform/PlatformStat";
import type { DashboardStat } from "@/lib/platform/dashboard";
import { cn } from "@/lib/utils";

export interface GlanceCardProps {
  title: string;
  /** Four stats, laid out 2×2. */
  stats: DashboardStat[];
  className?: string;
}

/**
 * DS `LMS / Platform / Glance card` (6384:17651): the Dashboard hero card. Title
 * (label-small/Semibold, text/on-inverse) and four `LMS / Platform / Stat` · Inverse in a
 * 2×2 grid (gap 24) on bg/inverse, radius 8. Padding 24 / 20 / 16 and gap 20 / 20 / 16
 * (desktop / tablet / mobile). The two circles are decoration only: bg/info (200) and
 * bg/primary (320) at 12% layer opacity, clipped by the card.
 */
export function GlanceCard({ title, stats, className }: GlanceCardProps) {
  return (
    <section
      aria-labelledby="dashboard-glance-title"
      data-mock="No API for lessons today, live attendance, time learned or XP"
      className={cn(
        "relative flex min-w-0 flex-col gap-4 overflow-hidden rounded-lg bg-sko-bg-inverse p-4 md:gap-5 md:p-5 lg:p-6",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[18px] top-[calc(50%+146px)] size-[200px] -translate-y-1/2 rounded-full bg-sko-bg-info opacity-[0.12]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[102px] top-[calc(50%-76px)] size-[320px] -translate-y-1/2 rounded-full bg-sko-bg-primary opacity-[0.12]"
      />
      <h2 id="dashboard-glance-title" className="sk-text-2xs-semibold relative text-sko-text-on-inverse">
        {title}
      </h2>
      <ul className="relative grid grid-cols-2 gap-6">
        {stats.map((stat) => (
          <li key={stat.label} className="min-w-0">
            <PlatformStat theme="inverse" label={stat.label} value={stat.value} detail={stat.detail} />
          </li>
        ))}
      </ul>
    </section>
  );
}
