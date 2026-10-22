import { ArrivalCount } from "@/components/atoms/ArrivalCount";
import { Badge } from "@/components/atoms/Badge";
import type { DashboardStat } from "@/lib/platform/dashboard";
import { cn } from "@/lib/utils";

export interface GlanceCardProps {
  title: string;
  stats: DashboardStat[];
  className?: string;
}

/** The phone shows the short words, tablet up the full ones; only one is displayed (and read). */
function Both({ full, short }: { full: string; short?: string }) {
  if (!short) return <>{full}</>;
  return (
    <>
      <span className="md:hidden">{short}</span>
      <span className="max-md:hidden">{full}</span>
    </>
  );
}

/**
 * One figure on its own card (DS `Stat` Theme=Card, pinned to SKO Dark by Nelson on 22 Oct
 * 2026, so the cards read as part of the dark hero): label, value, detail, then the goal as a DS
 * Badge Gray sm. The badge carries a spoken sentence; its short text is hidden from assistive tech.
 */
function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <div data-theme="dark" className="flex h-full flex-col gap-1 rounded-card-inset bg-sko-bg-page p-3 md:gap-2 md:p-4">
      <p className="sk-text-label-small-semibold whitespace-nowrap text-sko-text-muted">
        <Both full={stat.label} short={stat.shortLabel} />
      </p>
      <p className="sk-text-headline-medium-bold text-sko-text-default">
        <ArrivalCount value={stat.value} />
      </p>
      <p className="sk-text-body-small-medium text-sko-text-subtle">
        <Both full={stat.detail} short={stat.shortDetail} />
      </p>
      {stat.goal ? (
        <div className="mt-auto pt-1">
          <Badge color="gray" size="sm">
            <span aria-hidden="true">{stat.goal.label}</span>
            <span className="sr-only">{stat.goal.spoken}</span>
          </Badge>
        </div>
      ) : null}
    </div>
  );
}

/**
 * DS `LMS/Platform/Dashboard/Today-at-a-glance`: the Dashboard hero card, full width.
 * Title (label-small/Semibold, text/on-inverse) on bg/inverse, then the four figures, each on
 * its own card (bg/page in SKO Dark, Radius/card-inset) with a goal (v1.3, 22 Oct 2026).
 * Four in a row from tablet up (gap 20 / 24); on a phone the row scrolls sideways, the cards
 * 148 wide and snapping, so the card keeps one line and "Pick up where you left off" stays up.
 * Padding 24 / 20 / 16. The two circles are decoration only: bg/info (200) and bg/primary
 * (320) at 12% layer opacity, clipped by the card.
 */
export function GlanceCard({ title, stats, className }: GlanceCardProps) {
  return (
    <section
      aria-labelledby="dashboard-glance-title"
      data-glance=""
      className={cn(
        "relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-card bg-sko-bg-inverse p-4 md:gap-4 md:p-5 lg:p-6",
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
      <ul className="relative -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 lg:gap-6 [&::-webkit-scrollbar]:hidden">
        {stats.map((stat) => (
          <li key={stat.label} className="w-[148px] shrink-0 snap-start md:w-auto md:min-w-0">
            <StatCard stat={stat} />
          </li>
        ))}
      </ul>
    </section>
  );
}
