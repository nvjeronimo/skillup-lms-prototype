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
 * 20×20 status circle (matches DS `LMS / Completion Status`):
 * Pending = empty ring · In Progress = half ring · Done = solid green circle +
 * white check · Locked = filled gray circle + gray lock.
 */
export function CompletionStatus({ state, size = 20, className }: CompletionStatusProps) {
  const stroke = iconStroke(size);
  const base = "inline-flex items-center justify-center rounded-full shrink-0";
  const dims = { width: size, height: size };

  if (state === "Done") {
    return (
      <span
        role="img"
        aria-label="Completed"
        className={cn(base, "bg-sk-bg-success-solid text-sk-fg-white", className)}
        style={dims}
      >
        <Check size={size * 0.62} strokeWidth={size >= 24 ? 2.5 : 2} />
      </span>
    );
  }

  if (state === "Locked") {
    return (
      <span
        role="img"
        aria-label="Locked"
        className={cn(base, "bg-sk-bg-tertiary text-sk-text-tertiary", className)}
        style={dims}
      >
        <Lock size={size * 0.5} strokeWidth={stroke} />
      </span>
    );
  }

  // Pending / In Progress — ring with optional half fill via conic gradient on the border.
  return (
    <span
      role="img"
      aria-label={state}
      className={cn(
        base,
        "border-2",
        state === "In Progress"
          ? "border-sk-fg-progress"
          : "border-sk-border-primary",
        className,
      )}
      style={dims}
    >
      {state === "In Progress" ? (
        <span className="h-1/2 w-1/2 rounded-full bg-sk-fg-progress" />
      ) : null}
    </span>
  );
}
