import * as React from "react";
import { Badge, type BadgeColor } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

/**
 * DS `LMS / Course Detail / Section intro` (5456:852): the section heading
 * (headline-small/Bold, text/default) and its lead (body-large/Regular, text/muted), gap 6.
 */
export function SectionIntro({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="sk-text-headline-small-bold text-sko-text-default">{title}</h2>
      {lead ? <p className="sk-text-body-large-regular text-sko-text-muted">{lead}</p> : null}
    </div>
  );
}

/**
 * DS `LMS / Course Detail / Card shell` (5415:327): the white card of the sidebar and of the
 * certificate — bg/page, 1px border/subtle, radius 10, padding 16. The label is the eyebrow
 * (label-small/Medium, text/default); it is the card's heading.
 */
export function CardShell({
  label,
  labelAs: Label = "h2",
  gap = "md",
  mock,
  className,
  children,
}: {
  label: string;
  /** What on this card has no API yet (shown when the sample-data marks are on). */
  mock?: string;
  /** The eyebrow is an <h2> in the sidebar (an <h3> under a tab heading) and a plain line inside a titled certificate. */
  labelAs?: "h2" | "h3" | "p";
  /** Gap between the label and the content: 8 (Card shell) or 12 (Dates, Team, Certificate). */
  gap?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-mock={mock}
      className={cn(
        // The DS stroke is inside the card and the CSS border is outside the padding: 15 + 1 = the DS 16.
        "flex flex-col rounded-[10px] border border-sko-border-subtle bg-sko-bg-page p-[15px]",
        gap === "lg" ? "gap-3" : "gap-2",
        className,
      )}
    >
      <Label className="sk-text-label-small-medium text-sko-text-default">{label}</Label>
      {children}
    </section>
  );
}

export interface SidebarDate {
  id: string;
  /** ISO date, for <time>. */
  iso: string;
  day: string;
  month: string;
  title: string;
  detail: string;
  /** Relative badge; computed by the product, not sent by the platform. */
  relative: string;
  /** Badge v2 Outline colour: Gray unless the date is close (Yellow on Course Detail). */
  relativeColor?: BadgeColor;
}

/**
 * The rows of `LMS / Course Detail / Sidebar card`, Type=Dates (Program 6443:18749, Course
 * Detail 6406:39282): a 44×48 date tile (bg/subtle, radius 8), the title, the date line and
 * the relative badge (Badge v2 Outline), split by 1px rules.
 */
export function SidebarDateList({ dates }: { dates: SidebarDate[] }) {
  return (
    <ul className="flex flex-col">
      {dates.map((date, index) => (
        <li
          key={date.id}
          className={cn(
            "flex items-center gap-3 py-3",
            index < dates.length - 1 && "border-b border-sko-border-subtle",
          )}
        >
          <span
            aria-hidden
            className="flex h-12 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-sko-bg-subtle"
          >
            <span className="sk-text-body-large-semibold text-sko-text-default">{date.day}</span>
            <span className="sk-text-body-small-semibold text-sko-text-subtle">{date.month}</span>
          </span>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
            <p className="sk-text-body-medium-semibold text-sko-text-default">{date.title}</p>
            <p className="sk-text-body-small-regular text-sko-text-subtle">
              <time dateTime={date.iso}>{date.detail}</time>
            </p>
            <Badge variant="outline" color={date.relativeColor ?? "gray"}>
              {date.relative}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
