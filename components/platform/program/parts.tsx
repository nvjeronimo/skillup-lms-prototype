import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * DS `LMS / Course Detail / Section intro` (5456:852): the section heading
 * (headline-small/Bold, text/default) and its lead (body-large/Regular, text/muted), gap 6.
 */
export function SectionIntro({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="sk-text-display-xs-bold text-sko-text-default">{title}</h2>
      {lead ? <p className="sk-text-md-regular text-sko-text-muted">{lead}</p> : null}
    </div>
  );
}

/**
 * DS `Progress bar` (6204:128904): an 8px square track on bg/strong with the fill on bg/info
 * (never bg/primary), and with Label=Right the value in body-medium/Medium text/muted, gap 12.
 */
export function ProgramProgressBar({
  value,
  label,
  showValue = false,
  className,
}: {
  /** 0–100. */
  value: number;
  /** Accessible name: what the bar measures. */
  label: string;
  showValue?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="relative h-2 min-w-0 flex-1 bg-sko-bg-strong"
      >
        <div className="absolute inset-y-0 left-0 bg-sko-bg-info" style={{ width: `${pct}%` }} />
      </div>
      {showValue ? (
        <span aria-hidden className="sk-text-sm-medium shrink-0 text-sko-text-muted">
          {pct}%
        </span>
      ) : null}
    </div>
  );
}

/* DS Button V2 Brand / Primary at md (44px, body-medium/Semibold) and lg (48px,
   body-large/Semibold): the same classes as atoms/Button. */
const CTA_SIZE = {
  md: "h-11 gap-1 px-3 sk-text-sm-semibold",
  lg: "h-12 gap-1.5 px-4 sk-text-md-semibold",
} as const;

/**
 * A navigation CTA with the Button V2 Brand / Primary look. atoms/Button renders a <button>
 * and a link must stay a link, so this mirrors its classes on a Next <Link>.
 */
export function ProgramCtaLink({
  href,
  size = "md",
  className,
  children,
  ...rest
}: {
  href: string;
  size?: keyof typeof CTA_SIZE;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={rest["aria-label"]}
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors duration-200",
        "bg-sko-bg-primary text-sko-text-on-primary hover:bg-sko-bg-primary-hover hover:text-sko-text-on-primary-hover",
        "[--btn-ring:var(--color-border-primary)] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-border-focus-gap),0_0_0_4px_var(--btn-ring)]",
        CTA_SIZE[size],
        className,
      )}
    >
      <span className="px-0.5">{children}</span>
    </Link>
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
  className,
  children,
}: {
  label: string;
  /** The eyebrow is an <h2> in the sidebar and a plain line inside a titled certificate. */
  labelAs?: "h2" | "p";
  /** Gap between the label and the content: 8 (Card shell) or 12 (Dates, Team, Certificate). */
  gap?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-[10px] border border-sko-border-subtle bg-sko-bg-page p-4",
        gap === "lg" ? "gap-3" : "gap-2",
        className,
      )}
    >
      <Label className="sk-text-2xs-medium text-sko-text-default">{label}</Label>
      {children}
    </section>
  );
}
