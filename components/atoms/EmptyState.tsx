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
      <span className="mb-1 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sko-bg-primary-soft text-sko-text-primary">
        <Icon icon={icon} size={24} />
      </span>
      <p className="sk-text-md-semibold text-sko-text-default">{title}</p>
      {description ? (
        <p className="sk-text-sm-regular max-w-sm text-sko-text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
