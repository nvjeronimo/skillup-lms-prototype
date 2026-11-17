import * as React from "react";
import { Badge, type BadgeColor } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";
import styles from "./parts.module.css";

/**
 * DS `LMS / Course Detail / Section intro` (5456:852): the section heading
 * (headline-small/Bold, text/default) and its lead (body-large/Regular, text/muted), gap 6.
 */
export function SectionIntro({ title, lead }: { title: string; lead?: string }) {
  // DS Section-Intro on the Course page: "What you'll *learn*", the last word in Bold Italic
  // (Figma 03 · Course Detail; Nelson, 28 Oct 2026). Other titles stay plain.
  const learn = /^(What you'll )(learn)$/.exec(title);
  return (
    <div className={styles.intro}>
      <h2 className={`sk-text-headline-small-bold ${styles.introTitle}`}>
        {learn ? (
          <>
            {learn[1]}
            <em className={styles.introEm}>{learn[2]}</em>
          </>
        ) : (
          title
        )}
      </h2>
      {lead ? <p className={`sk-text-body-large-regular ${styles.introLead}`}>{lead}</p> : null}
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
  invented,
  aside,
  className,
  children,
}: {
  label: string;
  /** Sits on the label's row, at the opposite end (the certificate's Earned badge, 31 Oct 2026). */
  aside?: React.ReactNode;
  /** What on this card has no API yet (shown when the sample-data marks are on). */
  mock?: string;
  /** Hidden in the Open edX scope, with why (`data-invented`, lib/edx-scope). */
  invented?: string;
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
      data-invented={invented}
      className={cn(
        // The DS stroke is inside the card and the CSS border is outside the padding: 15 + 1 = the DS 16.
        styles.card,
        gap === "lg" ? styles.gapLg : styles.gapMd,
        className,
      )}
    >
      {aside ? (
        <div className={styles.labelRow}>
          <Label className={`sk-text-label-small-medium ${styles.label}`}>{label}</Label>
          {aside}
        </div>
      ) : (
        <Label className={`sk-text-label-small-medium ${styles.label}`}>{label}</Label>
      )}
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
  /** Badge Outline colour: Gray unless the date is close (Yellow on Course Detail). */
  relativeColor?: BadgeColor;
}

/**
 * The rows of `LMS / Course Detail / Sidebar card`, Type=Dates (Program 6443:18749, Course
 * Detail 6406:39282): a 44×48 date tile (bg/subtle, radius 8), the title, the date line and
 * the relative badge (Badge Outline), split by 1px rules.
 */
export function SidebarDateList({ dates }: { dates: SidebarDate[] }) {
  return (
    <ul className={styles.dates}>
      {dates.map((date, index) => (
        <li
          key={date.id}
          className={cn(
            styles.date,
            index < dates.length - 1 && styles.dateRule,
          )}
        >
          <span
            aria-hidden
            className={styles.tile}
          >
            <span className={`sk-text-body-large-semibold ${styles.day}`}>{date.day}</span>
            <span className={`sk-text-body-small-semibold ${styles.month}`}>{date.month}</span>
          </span>
          <div className={styles.dateBody}>
            <p className={`sk-text-body-medium-semibold ${styles.dateTitle}`}>{date.title}</p>
            <p className={`sk-text-body-small-regular ${styles.dateDetail}`}>
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
