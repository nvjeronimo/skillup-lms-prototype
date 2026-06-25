import * as React from "react";
import { BookOpen, Calendar, MessageCircle, Plus, Stars, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/lib/types";

export interface NotificationItemProps {
  type: NotificationType;
  title: string;
  body?: string;
  timestamp: string;
  unread: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

// Concrete UUI icon mapping from the Final Screens (live = video-recorder).
const ICON_MAP: Record<NotificationType, LucideIcon> = {
  "live-now": Video,
  "live-soon": Video,
  "course-update": Plus,
  "assignment-due": Calendar,
  "discussion-reply": MessageCircle,
  "peer-review-received": Stars,
  "syllabus-change": BookOpen,
};

/** Single notification row: type icon avatar + content + (right) unread dot. */
export function NotificationItem({
  type,
  title,
  body,
  timestamp,
  unread,
  href,
  onClick,
  className,
}: NotificationItemProps) {
  const IconCmp = ICON_MAP[type];

  const inner = (
    <>
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sk-bg-brand-section text-sk-text-brand-secondary">
        <Icon icon={IconCmp} size={18} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="sk-text-sm-semibold block text-sk-text-primary">{title}</span>
        {body ? (
          <span className="sk-text-sm-regular mt-0.5 block text-sk-text-secondary">{body}</span>
        ) : null}
        <span className="sk-text-xs-regular mt-1 block text-sk-text-tertiary">{timestamp}</span>
      </span>

      {/* Unread dot — right side (matches Final Screens). */}
      <span className="flex w-2 shrink-0 justify-center pt-1.5">
        {unread ? (
          <span
            className="h-2 w-2 rounded-full bg-sk-fg-brand-primary"
            aria-label="Unread"
            role="img"
          />
        ) : null}
      </span>
    </>
  );

  const classes = cn(
    "flex w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-sk-bg-secondary",
    className,
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {inner}
    </button>
  );
}
