import Link from "@/lib/router";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { ArrivalCount } from "@/components/atoms/ArrivalCount";
import { Badge } from "@/components/atoms/Badge";
import type { DashboardStat } from "@/lib/platform/dashboard";
import { cn } from "@/lib/utils";
import styles from "./GlanceCard.module.css";

export interface GlanceCardProps {
  title: string;
  stats: DashboardStat[];
  /** Each figure carries its 30-day trend chip (sample data; Harbor first, every skin since 26 Oct 2026). */
  trends?: boolean;
  className?: string;
}

/** The trend chip (Harbor first, after the DreamHost panel's "↓ 38%"): a soft tint, an arrow and the change. */
function TrendChip({ trend }: { trend: NonNullable<DashboardStat["trend"]> }) {
  const tone =
    trend.dir === "up"
      ? styles.chipUp
      : trend.dir === "down"
        ? styles.chipDown
        : styles.chipFlat;
  const arrow = trend.dir === "up" ? ArrowUpRight : trend.dir === "down" ? ArrowDownRight : ArrowRight;
  return (
    <span
      data-mock="No API returns a figure's value 30 days ago"
      data-invented="trend: no figure from 30 days ago in Open edX"
      className={cn("sk-text-body-small-semibold", styles.chip, tone)}
    >
      <Icon icon={arrow} size={14} aria-hidden />
      <span aria-hidden="true">{trend.label}</span>
      <span className="sk-sr-only">{trend.spoken}</span>
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
    <div className={cn("sk-press-card", styles.stat)}>
      <p className={cn("sk-text-label-small-semibold", styles.label)}>
        <Link
          href={stat.href}
          aria-label={`${stat.label}: ${stat.value} ${stat.detailStrong ?? ""} ${stat.detail}`.replace(/\s+/g, " ")}
          className={styles.link}
        >
          {stat.label}
        </Link>
        {trends && stat.trend ? <TrendChip trend={stat.trend} /> : null}
      </p>
      <p className={styles.valueRow}>
        <span
          className={cn(
            "sk-text-display-small-semibold",
            styles.value,
            stat.tone === "success" ? styles.valueDone : styles.valueOpen,
          )}
        >
          <ArrivalCount value={stat.value} />
        </span>
        <span className={cn("sk-text-body-small-medium", styles.detail)}>
          {stat.detailStrong ? <span className="sk-text-body-small-bold">{stat.detailStrong} </span> : null}
          {stat.detail}
        </span>
      </p>
      {stat.goal ? (
        <div className={styles.goal}>
          <Badge color={stat.goal.color ?? "gray"} size="sm">
            <span aria-hidden="true">{stat.goal.label}</span>
            <span className="sk-sr-only">{stat.goal.spoken}</span>
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
        styles.glance,
        className,
      )}
    >
      <div aria-hidden="true" data-theme="dark" data-glance-backdrop="" className={styles.backdrop} />
      {/* The rings (Nelson, 26 Oct 2026: adopted in every skin from Harbor's "Remixer" glance):
          three thin concentric circles in the info blue off the top-right corner, a soft blue light
          inside the middle one, and a blurred blue haze low on the right. No gradient fill. */}
      <div
        aria-hidden="true"
        data-glow=""
        className={styles.haze}
      />
      <div
        aria-hidden="true"
        data-glow=""
        className={cn(styles.circle, styles.circleSmall)}
      />
      <div
        aria-hidden="true"
        data-glow=""
        className={cn(styles.circle, styles.circleLarge)}
      />
      <h2 id="dashboard-glance-title" data-glance-title="" className={cn("sk-text-label-small-semibold", styles.title)}>
        {title}
      </h2>
      {/* On a phone the row scrolls: it takes the focus so a keyboard can scroll it (WCAG 2.1.1).
          It bleeds to the card's edges; scroll-padding puts the snap point back on the content
          padding, so the first figure lines up with the title (Nelson, 22 Oct 2026). */}
      <ul
        tabIndex={0}
        aria-labelledby="dashboard-glance-title"
        className={styles.list}
      >
        {stats.map((stat) => (
          <li key={stat.label} className={styles.item}>
            <StatCard stat={stat} trends={trends} />
          </li>
        ))}
      </ul>
    </section>
  );
}
