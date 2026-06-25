"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface OverflowMenuItem {
  label: string;
  onClick?: () => void;
  destructive?: boolean;
}

export interface CardOverflowMenuProps {
  items?: OverflowMenuItem[];
  /** Render menu open by default (useful for Storybook). */
  defaultOpen?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: OverflowMenuItem[] = [
  { label: "Rate course" },
  { label: "Share" },
  { label: "Unenroll", destructive: true },
];

/** ··· menu on a Course Card (Rate / Share / Unenroll). */
export function CardOverflowMenu({
  items = DEFAULT_ITEMS,
  defaultOpen = false,
  className,
}: CardOverflowMenuProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More actions"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sk-text-tertiary hover:bg-sk-bg-secondary"
      >
        <Icon icon={MoreHorizontal} size={20} />
      </button>
      {open ? (
        <ul
          role="menu"
          className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-lg border border-sk-border-secondary bg-sk-bg-primary py-1 shadow-lg"
        >
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  "sk-text-sm-medium block w-full px-3 py-2 text-left hover:bg-sk-bg-secondary",
                  item.destructive ? "text-sk-text-error-primary" : "text-sk-text-primary",
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
