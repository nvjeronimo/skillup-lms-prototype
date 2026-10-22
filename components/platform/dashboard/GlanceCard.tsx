import { ArrivalCount } from "@/components/atoms/ArrivalCount";
import { Badge } from "@/components/atoms/Badge";
import type { DashboardStat } from "@/lib/platform/dashboard";
import { cn } from "@/lib/utils";

export interface GlanceCardProps {
  title: string;
  stats: DashboardStat[];
  className?: string;
}

/**
 * One figure on its own card (DS `Stat` Theme=Card, v1.4: on bg/page, no dark pin): label,
 * value, the detail in two lines (the first bold), then the goal as a DS Badge Gray sm. The
 * value is text/on-primary-soft, or text/success for what is done (Completed, Certificates).
 * The badge carries a spoken sentence; its short text is hidden from assistive tech.
 */
function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-card-inset bg-sko-bg-page p-4">
      <p className="sk-text-label-small-semibold whitespace-nowrap text-sko-text-muted">{stat.label}</p>
      <p
        className={cn(
          "sk-text-headline-medium-bold",
          stat.tone === "success" ? "text-sko-text-success" : "text-sko-text-on-primary-soft",
        )}
      >
        <ArrivalCount value={stat.value} />
      </p>
      <p className="sk-text-body-small-medium text-sko-text-muted">
        {stat.detailStrong ? (
          <>
            <span className="sk-text-body-small-bold block">{stat.detailStrong}</span>
            <span className="block">{stat.detail}</span>
          </>
        ) : (
          stat.detail
        )}
      </p>
      {stat.goal ? (
        <div className="mt-auto pt-1">
          <Badge color={stat.goal.color ?? "gray"} size="sm">
            <span aria-hidden="true">{stat.goal.label}</span>
            <span className="sr-only">{stat.goal.spoken}</span>
          </Badge>
        </div>
      ) : null}
    </div>
  );
}

/**
 * DS `LMS/Platform/Dashboard/Today-at-a-glance` v1.4 (Nelson, 22 Oct 2026): the Dashboard
 * hero card, full width, light. Title (label-small/Semibold, text/default) on bg/primary-soft
 * with a 1px border/primary-muted,
 * then the four figures, each on its own card (bg/page, Radius/card-inset) with a goal.
 * Four in a row from tablet up (gap 20 / 24); on a phone the row scrolls sideways, the cards
 * 174 wide (as the DS) and snapping, so "Pick up where you left off" stays up.
 * Padding 24 / 20 / 16. The two circles are decoration only: bg/info (200) and bg/primary
 * (320) at 12% layer opacity, clipped by the card.
 */
export function GlanceCard({ title, stats, className }: GlanceCardProps) {
  return (
    <section
      aria-labelledby="dashboard-glance-title"
      data-glance=""
      className={cn(
        "relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-card border border-sko-border-primary-muted bg-sko-bg-primary-soft p-4 md:gap-4 md:p-5 lg:p-6",
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
      <h2 id="dashboard-glance-title" data-glance-title="" className="sk-text-label-small-semibold relative text-sko-text-default">
        {title}
      </h2>
      {/* On a phone the row scrolls: it takes the focus so a keyboard can scroll it (WCAG 2.1.1). */}
      <ul
        tabIndex={0}
        aria-labelledby="dashboard-glance-title"
        className="relative -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 lg:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {stats.map((stat) => (
          <li key={stat.label} className="w-[174px] shrink-0 snap-start md:w-auto md:min-w-0">
            <StatCard stat={stat} />
          </li>
        ))}
      </ul>
    </section>
  );
}
