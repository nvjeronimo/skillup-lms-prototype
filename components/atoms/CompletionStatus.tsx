import * as React from "react";
import { Check, Lock } from "lucide-react";
import { cn, iconStroke } from "@/lib/utils";
import type { CompletionState } from "@/lib/types";

export interface CompletionStatusProps {
  state: CompletionState;
  size?: number;
  /**
   * Done only: the topic was completed just now. The disc fades in and the check draws
   * itself, 100ms after the completed badge pops (the completion chain). Reduced motion: the
   * check is shown without the draw.
   */
  animate?: boolean;
  className?: string;
}

/**
 * 18×18 status circle (matches DS `LMS / Completion Status`):
 * Pending = 1.5px ring on bg/page · In Progress = half ring · Done = bg/success
 * circle + icon/on-success check · Locked = bg/muted circle + icon/muted lock.
 */
export function CompletionStatus({ state, size = 18, animate = false, className }: CompletionStatusProps) {
  const stroke = iconStroke(size);
  const base = "inline-flex items-center justify-center rounded-full shrink-0";
  const dims = { width: size, height: size };

  if (state === "Done") {
    const checkSize = Math.round(size * (14 / 18));
    const checkStroke = size >= 24 ? 2.5 : 2;
    return (
      <span
        role="img"
        aria-label="Completed"
        className={cn(
          base,
          "bg-sko-bg-success text-sko-icon-on-success",
          animate && "sk-animate-fade sk-enter-only",
          className,
        )}
        style={dims}
      >
        {animate ? (
          // The lucide check drawn as one path so its stroke can be animated: the same 24-unit
          // box, stroke and caps, but started at the short arm so it draws left to right.
          <svg
            aria-hidden
            width={checkSize}
            height={checkSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={checkStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path className="sk-draw-check" d="M4 12l5 5L20 6" pathLength={1} />
          </svg>
        ) : (
          <Check size={checkSize} strokeWidth={checkStroke} />
        )}
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
