import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { ArrivalCount } from "@/components/atoms/ArrivalCount";
import { Badge } from "@/components/atoms/Badge";
import type { DashboardStat } from "@/lib/platform/dashboard";
import { cn } from "@/lib/utils";

export interface GlanceCardProps {
  title: string;
  stats: DashboardStat[];
  /** Harbor: each figure carries its 30-day trend chip (sample data). */
  trends?: boolean;
  className?: string;
}

/** Harbor's trend chip (the DreamHost panel's "↓ 38%"): a soft tint, an arrow and the change. */
function TrendChip({ trend }: { trend: NonNullable<DashboardStat["trend"]> }) {
  const tone =
    trend.dir === "up"
      ? "bg-sko-bg-success-soft text-sko-text-success"
      : trend.dir === "down"
        ? "bg-sko-bg-error-soft text-sko-text-error"
        : "bg-sko-bg-muted text-sko-text-muted";
  const arrow = trend.dir === "up" ? ArrowUpRight : trend.dir === "down" ? ArrowDownRight : ArrowRight;
  return (
    <span
      data-mock="No API returns a figure's value 30 days ago"
      className={cn("sk-text-body-small-semibold inline-flex items-center gap-0.5 rounded-pill px-1.5 py-0.5", tone)}
    >
      <Icon icon={arrow} size={14} aria-hidden />
      <span aria-hidden="true">{trend.label}</span>
      <span className="sr-only">{trend.spoken}</span>
    </span>
  );
}

/**
 * One figure on its own card (DS `Stat` Theme=Card: on bg/page with Shadows/shadow-card): label,
 * then the value with the detail beside it, bottom-aligned (the bold part first: "**in progress**
 * of 22 enrolled"), then the goal as a DS Badge sm. The value is text/on-primary-soft, or
 * text/success for what is done (Completed, Certificates). The badge carries a spoken sentence;
 * its short text is hidden from assistive tech.
 * Each card is a link to the list its figure counts (Nelson, 25 Oct 2026): Courses and Programs to
 * My Learning in progress, Completed to the completed courses, Certificates to its page. The label
 * carries the link, stretched over the whole card (as the Due items); no arrow (Nelson, 22 Oct).
 * Hover: the label underlines; press: the card's .99 scale (sk-press-card); focus: the ring on the card.
 */
function StatCard({ stat, trends = false }: { stat: DashboardStat; trends?: boolean }) {
  return (
    <div className="sk-press-card relative flex h-full flex-col gap-2 rounded-card-inset bg-sko-bg-page p-3 shadow-sk-card md:p-4">
      <p className="sk-text-label-small-semibold flex items-center justify-between gap-2 whitespace-nowrap text-sko-text-muted">
        <Link
          href={stat.href}
          aria-label={`${stat.label}: ${stat.value} ${stat.detailStrong ?? ""} ${stat.detail}`.replace(/\s+/g, " ")}
          className="underline-offset-2 hover:underline focus-visible:outline-none after:absolute after:inset-0 after:rounded-card-inset after:content-[''] focus-visible:after:shadow-[0_0_0_2px_var(--color-border-focus-gap),0_0_0_4px_var(--color-border-primary)]"
        >
          {stat.label}
        </Link>
        {trends && stat.trend ? <TrendChip trend={stat.trend} /> : null}
      </p>
      <p className="flex items-end gap-2">
        <span
          className={cn(
            "sk-text-display-small-semibold shrink-0",
            stat.tone === "success" ? "text-sko-text-success" : "text-sko-text-on-primary-soft",
          )}
        >
          <ArrivalCount value={stat.value} />
        </span>
        <span className="sk-text-body-small-medium min-w-0 pb-2 text-sko-text-muted">
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
 * island (#044150 in every dark skin), one blurred glow (border/info-soft, blur 179, 80%; 23 Oct: the right one went)
 * and the two circles (bg/info 200, bg/primary 320) at 19%, all decoration and clipped by the
 * card, which keeps its 1px border/primary-muted. Title label-small/Semibold, text/on-primary.
 * Then the four figures, each on its own light card (bg/page, Radius/card-inset) with a goal.
 * Four in a row from tablet up (gap 20 / 24); on a phone the row scrolls sideways, the cards
 * 174 wide (as the DS) and snapping, so "Pick up where you left off" stays up.
 * Padding 24 / 20 / 16. Above and below the cards: Spacing/6xl, 48 / 40 / 32 (Nelson, 25 Oct 2026:
 * 3rem on desktop, or the nearest token).
 */
export function GlanceCard({ title, stats, trends = false, className }: GlanceCardProps) {
  return (
    <section
      aria-labelledby="dashboard-glance-title"
      data-glance=""
      className={cn(
        // Test (Nelson, 23 Oct 2026, prototype only): the backdrop runs the full width of the
        // window on every device; the title and the cards stay on the page's content edges.
        "relative mx-[calc(50%-50vw)] flex min-w-0 flex-col gap-3 overflow-hidden px-[calc(50vw-50%)] py-[var(--sk-space-6xl)] md:gap-4",
        className,
      )}
    >
      <div aria-hidden="true" data-theme="dark" data-glance-backdrop="" className="pointer-events-none absolute inset-0 bg-sko-bg-info-soft" />
      {/* The rings (Nelson, 26 Oct 2026: adopted in every skin from Harbor's "Remixer" glance):
          three thin concentric circles in the info blue off the top-right corner, a soft blue light
          inside the middle one, and a blurred blue haze low on the right. No gradient fill. */}
      <div
        aria-hidden="true"
        data-glow=""
        className="pointer-events-none absolute -bottom-[120px] -right-20 h-[240px] w-[520px] rounded-pill bg-sko-bg-info opacity-50 blur-[120px]"
      />
      <div
        aria-hidden="true"
        data-glow=""
        className="pointer-events-none absolute right-[14%] top-[10px] size-[300px] -translate-y-1/2 translate-x-1/2 rounded-pill border border-sko-border-info opacity-85"
      />
      <div
        aria-hidden="true"
        data-glow=""
        className="pointer-events-none absolute right-[14%] top-[10px] size-[620px] -translate-y-1/2 translate-x-1/2 rounded-pill border border-sko-border-info opacity-85 shadow-[inset_0_0_200px_color-mix(in_srgb,var(--color-border-info-soft)_33%,transparent)] after:absolute after:-inset-[230px] after:rounded-pill after:border after:border-sko-border-info after:content-['']"
      />
      <h2 id="dashboard-glance-title" data-glance-title="" className="sk-text-label-small-semibold relative text-sko-text-on-media">
        {title}
      </h2>
      {/* On a phone the row scrolls: it takes the focus so a keyboard can scroll it (WCAG 2.1.1).
          It bleeds to the card's edges; scroll-padding puts the snap point back on the content
          padding, so the first figure lines up with the title (Nelson, 22 Oct 2026). */}
      <ul
        tabIndex={0}
        aria-labelledby="dashboard-glance-title"
        className="relative -mx-[calc(50vw-50%)] flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-[calc(50vw-50%)] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 lg:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {stats.map((stat) => (
          <li key={stat.label} className="w-[156px] shrink-0 snap-start md:w-auto md:min-w-0">
            <StatCard stat={stat} trends={trends} />
          </li>
        ))}
      </ul>
    </section>
  );
}
