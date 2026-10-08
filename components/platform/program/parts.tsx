import * as React from "react";
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
  /** The eyebrow is an <h2> in the sidebar and a plain line inside a titled certificate. */
  labelAs?: "h2" | "p";
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
