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
 * One figure on its own card (DS `Stat` Theme=Card: on bg/page with Shadows/shadow-card): label,
 * then the value with the detail beside it, bottom-aligned (the bold part first: "**in progress**
 * of 22 enrolled"), then the goal as a DS Badge sm. The value is text/on-primary-soft, or
 * text/success for what is done (Completed, Certificates). The badge carries a spoken sentence;
 * its short text is hidden from assistive tech.
 */
function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-card-inset bg-sko-bg-page p-4 shadow-sk-card">
      <p className="sk-text-label-small-semibold whitespace-nowrap text-sko-text-muted">{stat.label}</p>
      <p className="flex items-end gap-2">
        <span
          className={cn(
            "sk-text-headline-large-semibold shrink-0",
            stat.tone === "success" ? "text-sko-text-success" : "text-sko-text-on-primary-soft",
          )}
        >
          <ArrivalCount value={stat.value} />
        </span>
        <span className="sk-text-body-small-medium min-w-0 pb-1 text-sko-text-muted">
          {stat.detailStrong ? <span className="sk-text-body-small-bold">{stat.detailStrong} </span> : null}
          {stat.detail}
        </span>
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
 * DS `LMS/Platform/Dashboard/Today-at-a-glance` v1.5 (Nelson, 22 Oct 2026, as drawn on the ICP
 * Dashboard): the Dashboard hero card, full width, dark. A backdrop on bg/info-soft in a dark
 * island (#044150 in every dark skin), two blurred glows (border/info-soft, blur 179, 37% / 80%)
 * and the two circles (bg/info 200, bg/primary 320) at 19%, all decoration and clipped by the
 * card, which keeps its 1px border/primary-muted. Title label-small/Semibold, text/on-primary.
 * Then the four figures, each on its own light card (bg/page, Radius/card-inset) with a goal.
 * Four in a row from tablet up (gap 20 / 24); on a phone the row scrolls sideways, the cards
 * 174 wide (as the DS) and snapping, so "Pick up where you left off" stays up.
 * Padding 24 / 20 / 16.
 */
export function GlanceCard({ title, stats, className }: GlanceCardProps) {
  return (
    <section
      aria-labelledby="dashboard-glance-title"
      data-glance=""
      className={cn(
        "relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-card border border-sko-border-primary-muted p-4 md:gap-4 md:p-5 lg:p-6",
        className,
      )}
    >
      <div aria-hidden="true" data-theme="dark" data-glance-backdrop="" className="pointer-events-none absolute inset-0 bg-sko-bg-info-soft" />
      <div
        aria-hidden="true"
        data-glow=""
        className="pointer-events-none absolute left-[calc(100%-121px)] top-[3px] h-[193px] w-[483px] rounded-pill bg-sko-border-info-soft opacity-[0.37] blur-[179px]"
      />
      <div
        aria-hidden="true"
        data-glow=""
        className="pointer-events-none absolute left-[29.3%] -top-[70px] h-[74px] w-[185px] rounded-pill bg-sko-border-info-soft opacity-80 blur-[179px]"
      />
      <div
        aria-hidden="true"
        data-glow=""
        className="pointer-events-none absolute right-[18px] top-[calc(50%+146px)] size-[200px] -translate-y-1/2 rounded-pill bg-sko-bg-info opacity-[0.19]"
      />
      <div
        aria-hidden="true"
        data-glow=""
        className="pointer-events-none absolute -right-[102px] top-[calc(50%-76px)] size-[320px] -translate-y-1/2 rounded-pill bg-sko-bg-primary opacity-[0.19]"
      />
      <h2 id="dashboard-glance-title" data-glance-title="" className="sk-text-label-small-semibold relative text-sko-text-on-media">
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
