"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@/lib/useDisclosure";

export interface OverflowMenuItem {
  label: string;
  onClick?: () => void;
  destructive?: boolean;
}

export interface CardOverflowMenuProps {
  items?: OverflowMenuItem[];
  /** Render menu open by default (useful for Storybook). */
  defaultOpen?: boolean;
  /** What the actions apply to (e.g. the course title) — makes the trigger's
   *  accessible name unique when several cards sit on one page. */
  itemLabel?: string;
  className?: string;
}

const DEFAULT_ITEMS: OverflowMenuItem[] = [
  { label: "Rate" },
  { label: "Share" },
  { label: "Unenroll", destructive: true },
];

/**
 * ··· menu on a Course Card (Rate / Share / Unenroll). A disclosure, not an
 * ARIA menu: the trigger toggles a plain list of buttons, Tab moves through
 * them, Escape closes and returns focus to the trigger (useDisclosure).
 */
export function CardOverflowMenu({
  items = DEFAULT_ITEMS,
  defaultOpen = false,
  itemLabel,
  className,
}: CardOverflowMenuProps) {
  const { open, setOpen, containerRef, triggerProps, panelProps } = useDisclosure(defaultOpen);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        {...triggerProps}
        aria-label={itemLabel ? `More actions, ${itemLabel}` : "More actions"}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sko-text-subtle hover:bg-sko-bg-subtle"
      >
        <Icon icon={MoreHorizontal} size={20} />
      </button>
      {open ? (
        <ul
          {...panelProps}
          className="absolute right-0 z-10 mt-1 w-[180px] overflow-hidden rounded-lg border border-sko-border-subtle bg-sko-bg-page py-1 shadow-sk-card"
        >
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  "sk-text-sm-medium block w-full p-3 text-left hover:bg-sko-bg-subtle",
                  item.destructive ? "text-sko-text-error" : "text-sko-text-default",
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
