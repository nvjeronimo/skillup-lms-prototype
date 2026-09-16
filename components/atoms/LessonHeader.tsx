import * as React from "react";
import { cn } from "@/lib/utils";

export interface LessonHeaderProps {
  label: string;
  className?: string;
}

/** DS `LMS / Lesson Header`: Caption/Medium in text-secondary, 16px padding all round (50px). */
export function LessonHeader({ label, className }: LessonHeaderProps) {
  return (
    <p className={cn("sk-text-xs-medium p-4 text-sk-text-secondary", className)}>
      {label}
    </p>
  );
}
