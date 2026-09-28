import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * DS `LMS / Empty State` (node 19975-537992): 1px border/subtle, radius 12,
 * padding 48/32, gap 16; 56px rounded-square pictograph on bg/primary-soft with a
 * 28px icon/primary glyph (stroke 1.5); title body-large/Medium, body
 * body-medium/Medium filling the width. Used for Notes empty, Downloads empty, etc.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-sko-border-subtle px-8 py-12 text-center",
        className,
      )}
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-sko-bg-primary-soft text-sko-icon-primary">
        <Icon icon={icon} size={28} strokeWidth={1.5} absoluteStrokeWidth />
      </span>
      <p className="sk-text-md-medium text-sko-text-default">{title}</p>
      {description ? (
        <p className="sk-text-sm-medium w-full text-sko-text-muted">{description}</p>
      ) : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
}
