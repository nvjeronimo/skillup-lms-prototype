"use client";

import * as React from "react";
import { AlertCircle, Info, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface CourseAlertProps {
  /** DS `Color`: Brand (the course update) or Warning (passing grade, missed deadline). */
  tone: "brand" | "warning";
  /**
   * `stacked`: DS Breakpoint=Mobile on every width — the icon above the text (the course
   * update is drawn like this on all three breakpoints).
   * `responsive`: the icon above the text on mobile, beside it from tablet up.
   */
  layout?: "stacked" | "responsive";
  title: string;
  body: string;
  /** The DS `Actions` row, under the text. */
  action?: React.ReactNode;
  /** DS `X close button`: closes the alert for this visit. */
  dismissible?: boolean;
  /** What on this alert has no API yet (shown when the sample-data marks are on). */
  mock?: string;
  className?: string;
}

const TONE = {
  brand: {
    box: "border-sko-border-primary-muted bg-sko-bg-primary-soft",
    icon: Info,
    iconColor: "text-sko-icon-primary",
    // As bound on the instance: both lines on text/muted.
    title: "text-sko-text-muted",
  },
  warning: {
    box: "border-sko-border-warning-soft bg-sko-bg-warning-soft",
    icon: AlertCircle,
    iconColor: "text-sko-icon-warning",
    // Breakpoint=Mobile binds the title to text/muted, Breakpoint=Desktop to text/default.
    title: "text-sko-text-muted md:text-sko-text-default",
  },
} as const;

/**
 * DS `Alert`, Size=Floating (Course update 6406:39269, passing grade and missed deadline on
 * the Progress and Dates tabs): radius 12, padding 16, gap 16, a 1px stroke and
 * Elevation/level1. The `Featured icon outline` is a 20px icon inside two rings (28px at 30%
 * and 38px at 10%). Title body-medium/Semibold, text body-medium/Regular on text/muted, 4
 * apart; the actions 12 under the text; the 36px close button 8 from the top right corner.
 * Not atoms/InlineAlert, which is the `LMS / Inline Alert` of the player (top rule, no radius).
 */
export function CourseAlert({
  tone,
  layout = "responsive",
  title,
  body,
  action,
  dismissible = false,
  mock,
  className,
}: CourseAlertProps) {
  const [open, setOpen] = React.useState(true);
  if (!open) return null;
  const t = TONE[tone];

  return (
    <div
      role="note"
      data-mock={mock}
      className={cn(
        // The DS stroke is inside the alert and the CSS border is outside the padding: 15 + 1 = the DS 16.
        "relative flex flex-col gap-4 rounded-xl border p-[15px] shadow-sm",
        layout === "responsive" && "md:flex-row",
        t.box,
        className,
      )}
    >
      <span aria-hidden className={cn("relative flex size-5 shrink-0 items-center justify-center", t.iconColor)}>
        <span className="absolute size-7 rounded-full border-2 border-current opacity-30" />
        <span className="absolute size-[38px] rounded-full border-2 border-current opacity-10" />
        <Icon icon={t.icon} size={20} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
        <div className={cn("flex flex-col gap-1", dismissible && layout === "responsive" && "md:pr-8")}>
          <p className={cn("sk-text-body-medium-semibold", t.title)}>{title}</p>
          <p className="sk-text-body-medium-regular text-sko-text-muted">{body}</p>
        </div>
        {action}
      </div>
      {dismissible ? (
        <button
          type="button"
          aria-label={`Dismiss: ${title}`}
          onClick={() => setOpen(false)}
          className="absolute right-[7px] top-[7px] flex size-9 items-center justify-center rounded-lg text-sko-icon-muted hover:text-sko-icon-default max-md:right-[3px] max-md:top-[3px] max-md:size-11"
        >
          <Icon icon={X} size={20} />
        </button>
      ) : null}
    </div>
  );
}
