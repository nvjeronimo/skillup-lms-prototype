"use client";

import * as React from "react";
import { Facebook, Link2, Linkedin, Mail, Twitter } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type ShareChannel = "linkedin" | "twitter" | "facebook" | "copy" | "email";

export interface ShareMenuProps {
  /** Controls the open menu — when omitted, the trigger manages its own state. */
  open?: boolean;
  onSelect?: (channel: ShareChannel) => void;
  onClose?: () => void;
  className?: string;
}

const ITEMS: { channel: ShareChannel; label: string; icon: LucideIcon }[] = [
  { channel: "linkedin", label: "Share to LinkedIn", icon: Linkedin },
  { channel: "twitter", label: "Share to X", icon: Twitter },
  { channel: "facebook", label: "Share to Facebook", icon: Facebook },
  { channel: "copy", label: "Copy link", icon: Link2 },
  { channel: "email", label: "Email", icon: Mail },
];

/** Dropdown of share channels (Certificate Share button). Esc + outside click close. */
export function ShareMenu({ onSelect, onClose, className }: ShareMenuProps) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <ul
      role="menu"
      className={cn(
        "w-48 overflow-hidden rounded-lg border border-sk-border-secondary bg-sk-bg-primary py-1 shadow-lg",
        className,
      )}
    >
      {ITEMS.map((item) => (
        <li key={item.channel} role="none">
          <button
            role="menuitem"
            type="button"
            onClick={() => onSelect?.(item.channel)}
            className="sk-text-sm-medium flex w-full items-center gap-2.5 px-4 py-3 text-left text-sk-text-primary hover:bg-sk-bg-secondary"
          >
            <Icon icon={item.icon} size={16} className="text-sk-text-tertiary" />
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
