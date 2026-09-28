import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModuleInfoProps {
  /** Module number eyebrow, e.g. "MODULE 01". */
  label: string;
  topicsCompleted: number;
  topicsTotal: number;
  /** Hide the "· x of y" progress part (module number only). */
  showTopicProgress?: boolean;
  /** Status = Module Completed: everything turns success and a 14px check trails the count. */
  isCompleted?: boolean;
  className?: string;
}

/**
 * DS `LMS / Module Info` (Status = Module In progress · Module Completed).
 * One horizontal row, 8px gap: module number (Overline/Medium, tertiary) ·
 * separator (Caption/Medium, disabled) · "x of y" (Overline/Medium) with a
 * 14px success check after the count once the module is complete.
 */
export function ModuleInfo({
  label,
  topicsCompleted,
  topicsTotal,
  showTopicProgress = true,
  isCompleted = false,
  className,
}: ModuleInfoProps) {
  const tone = isCompleted ? "text-sko-text-success" : "text-sko-text-subtle";
  return (
    // 18px row: pinned to the Overline height (label-small, 12/18 since the
    // no-text-below-12 decision) so the Caption separator dot centres inside it.
    <span className={cn("flex h-[18px] items-center gap-2", className)}>
      <span className={cn("sk-text-2xs-medium", tone)}>{label}</span>
      {showTopicProgress ? (
        <>
          <span
            className={cn(
              "sk-text-xs-medium",
              isCompleted ? "text-sko-text-success" : "text-sko-text-disabled",
            )}
            aria-hidden
          >
            ·
          </span>
          <span className="flex items-center gap-1">
            <span className={cn("sk-text-2xs-medium", tone)}>
              {topicsCompleted} of {topicsTotal}
            </span>
            {isCompleted ? (
              // DS completed-check: 1.5px `icon/success` stroke at 14px (absolute, not scaled).
              <Check size={14} strokeWidth={1.5} absoluteStrokeWidth className="text-sko-icon-success" aria-hidden />
            ) : null}
          </span>
        </>
      ) : null}
    </span>
  );
}
