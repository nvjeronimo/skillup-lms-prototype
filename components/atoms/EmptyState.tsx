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

/** Generic empty-state block (Notes empty, Downloads empty, etc.). */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-12 text-center",
        className,
      )}
    >
      <span className="mb-1 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sk-bg-brand-section text-sk-text-brand-secondary">
        <Icon icon={icon} size={24} />
      </span>
      <p className="sk-text-md-semibold text-sk-text-primary">{title}</p>
      {description ? (
        <p className="sk-text-sm-regular max-w-sm text-sk-text-secondary">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
