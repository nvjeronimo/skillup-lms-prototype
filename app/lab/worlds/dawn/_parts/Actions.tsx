"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "quiet";

interface ActionProps {
  label: string;
  variant?: Variant;
  /** A real route. When absent the action is a lab stand-in that says so when pressed. */
  href?: string;
  describedBy?: string;
  className?: string;
}

/** The world's one kind of action. Teal when primary; only one primary per page. */
export function Action({ label, variant = "quiet", href, describedBy, className }: ActionProps) {
  const [pressed, setPressed] = React.useState(false);
  const cls = cn("dw-btn", variant === "primary" ? "dw-btn--primary" : "dw-btn--quiet", className);
  const body = (
    <>
      {label}
      {variant === "primary" ? <ArrowRight aria-hidden size={18} strokeWidth={2} /> : null}
    </>
  );
  if (href && href !== "#") {
    return (
      <Link href={href} className={cls} aria-describedby={describedBy}>
        {body}
      </Link>
    );
  }
  return (
    <span className="inline-flex flex-col items-start gap-1.5">
      <button type="button" className={cls} aria-describedby={describedBy} onClick={() => setPressed(true)}>
        {body}
      </button>
      <span role="status" className="dw-meta dw-fg-2 min-h-[1.4em]">
        {pressed ? "Lab demo — not wired" : ""}
      </span>
    </span>
  );
}
