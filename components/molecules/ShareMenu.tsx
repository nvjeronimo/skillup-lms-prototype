"use client";

import * as React from "react";
import { Award, Facebook, Link2, Linkedin, Mail, Twitter } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type ShareChannel = "linkedin-profile" | "linkedin" | "twitter" | "facebook" | "copy" | "email";

export interface ShareMenuProps {
  /** Controls the open menu — when omitted, the trigger manages its own state. */
  open?: boolean;
  onSelect?: (channel: ShareChannel) => void;
  onClose?: () => void;
  className?: string;
}

const ITEMS: { channel: ShareChannel; label: string; icon: LucideIcon }[] = [
  // LinkedIn's "Add licence or certification" form, pre-filled (20 Oct 2026).
  { channel: "linkedin-profile", label: "Add to LinkedIn profile", icon: Award },
  { channel: "linkedin", label: "Share to LinkedIn", icon: Linkedin },
  { channel: "twitter", label: "Share to X", icon: Twitter },
  { channel: "facebook", label: "Share to Facebook", icon: Facebook },
  { channel: "copy", label: "Copy link", icon: Link2 },
  { channel: "email", label: "Email", icon: Mail },
];

/**
 * Dropdown of share channels (Certificate Share button). A disclosure panel of
 * plain buttons, not an ARIA menu; the owner wires Escape / outside click /
 * focus return through useDisclosure. `onClose` still fires on Escape for
 * standalone use (Storybook).
 */
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
      className={cn(
        "w-56 overflow-hidden rounded-lg border border-sko-border-subtle bg-sko-bg-page py-1 shadow-lg",
        className,
      )}
    >
      {ITEMS.map((item) => (
        <li key={item.channel}>
          <button
            type="button"
            onClick={() => onSelect?.(item.channel)}
            className="sk-text-body-medium-medium flex w-full items-center gap-2.5 px-4 py-3 text-left text-sko-text-default transition-colors hover:bg-sko-bg-subtle"
          >
            <Icon icon={item.icon} size={16} className="text-sko-text-subtle" aria-hidden />
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
