import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { DifficultyBadge, type Difficulty } from "@/components/atoms/MetaBadges";
import { cn } from "@/lib/utils";

export interface CourseRowProps {
  title: string;
  difficulty: Difficulty;
  progressPct: number;
  initials: string;
  onClick?: () => void;
  className?: string;
}

/** Compact course row used in program detail / lists. */
export function CourseRow({
  title,
  difficulty,
  progressPct,
  initials,
  onClick,
  className,
}: CourseRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border border-lms-border-secondary p-3 text-left transition-colors hover:border-lms-border-primary",
        className,
      )}
    >
      <span className="lms-text-sm-semibold inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-lms-bg-brand-section text-lms-text-brand-secondary">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="lms-text-sm-semibold truncate text-lms-text-primary">{title}</p>
        <div className="mt-1 flex items-center gap-2">
          <DifficultyBadge value={difficulty} />
          <span className="lms-text-xs-regular text-lms-text-tertiary">{progressPct}% complete</span>
        </div>
      </div>
      <Icon icon={ChevronRight} size={18} className="text-lms-fg-quaternary" />
    </button>
  );
}
