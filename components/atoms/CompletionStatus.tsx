import * as React from "react";
import { Check, Lock } from "lucide-react";
import { cn, iconStroke } from "@/lib/utils";
import type { CompletionState } from "@/lib/types";

export interface CompletionStatusProps {
  state: CompletionState;
  size?: number;
  className?: string;
}

/**
 * 18×18 status circle (matches DS `LMS / Completion Status`):
 * Pending = 1.5px ring on bg/page · In Progress = half ring · Done = bg/success
 * circle + icon/on-success check · Locked = bg/muted circle + icon/muted lock.
 */
export function CompletionStatus({ state, size = 18, className }: CompletionStatusProps) {
  const stroke = iconStroke(size);
  const base = "inline-flex items-center justify-center rounded-full shrink-0";
  const dims = { width: size, height: size };

  if (state === "Done") {
    return (
      <span
        role="img"
        aria-label="Completed"
        className={cn(base, "bg-sko-bg-success text-sko-icon-on-success", className)}
        style={dims}
      >
        <Check size={Math.round(size * (14 / 18))} strokeWidth={size >= 24 ? 2.5 : 2} />
      </span>
    );
  }

  if (state === "Locked") {
    return (
      <span
        role="img"
        aria-label="Locked"
        className={cn(base, "bg-sko-bg-muted text-sko-icon-muted", className)}
        style={dims}
      >
        <Lock size={Math.round(size * (13 / 18))} strokeWidth={stroke} />
      </span>
    );
  }

  // Pending / In Progress — ring with optional half fill via conic gradient on the border.
  // Pending is a 1.5px (Stroke/icon) border/default ring on an opaque bg/page disc, so
  // a tinted row (TopicRow active/hover) does not show through it.
  return (
    <span
      role="img"
      aria-label={state}
      className={cn(
        base,
        state === "In Progress"
          ? "border-2 border-sko-border-info"
          : "border-[1.5px] border-sko-border-default bg-sko-bg-page",
        className,
      )}
      style={dims}
    >
      {state === "In Progress" ? (
        <span className="h-1/2 w-1/2 rounded-full bg-sko-bg-info" />
      ) : null}
    </span>
  );
}
