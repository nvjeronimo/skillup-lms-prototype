import * as React from "react";
import { cn } from "@/lib/utils";

export interface LessonHeaderProps {
  label: string;
  className?: string;
}

/** Lesson label between a Module Header and its Topic Rows. Eyebrow style. */
export function LessonHeader({ label, className }: LessonHeaderProps) {
  return (
    <p className={cn("sk-text-2xs-medium px-3 py-1.5 text-sk-text-tertiary", className)}>
      {label}
    </p>
  );
}
