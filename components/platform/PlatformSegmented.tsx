"use client";

import { cn } from "@/lib/utils";

/**
 * DS `Button group` v2.0 (11 Oct 2026), as the Q&A filter draws it: a bg/muted track, padding 4,
 * gap 2, radius 8; the pressed segment is a pill on bg/page with 1px border/subtle and
 * text/primary. 32 tall, 44 on mobile.
 */
export function PlatformSegmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  /** Names the group for assistive tech. */
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn("inline-flex max-w-full gap-0.5 overflow-x-auto rounded-lg bg-sko-bg-muted p-1", className)}>
      {options.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "sk-text-body-medium-semibold h-8 shrink-0 whitespace-nowrap rounded-md border px-4 transition-colors max-md:h-11",
            value === item.id
              ? "border-sko-border-subtle bg-sko-bg-page text-sko-text-primary"
              : "border-transparent text-sko-text-subtle hover:bg-sko-bg-subtle hover:text-sko-text-default",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
