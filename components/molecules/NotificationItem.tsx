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

/**
 * Single notification row: type icon tile + content + (right) unread dot. Since 24 Oct 2026
 * (Nelson's ICP panel 7497:132529) each row is a white block on the panel's bg/subtle list,
 * 16/24 padding, its icon on a 36 square tile (Radius/control).
 */
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
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-sko-bg-primary-soft text-sko-icon-primary">
        <Icon icon={IconCmp} size={18} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="sk-text-body-medium-semibold block text-sko-text-default">{title}</span>
        {body ? (
          <span className="sk-text-body-medium-regular mt-0.5 block text-sko-text-muted">{body}</span>
        ) : null}
        <span className="sk-text-body-small-regular mt-1 block text-sko-text-subtle">{timestamp}</span>
      </span>

      {/* Unread dot — right side (matches Final Screens). */}
      <span className="flex w-2 shrink-0 justify-center pt-1.5">
        {unread ? (
          <span
            className="h-2 w-2 rounded-pill bg-sko-bg-primary"
            aria-label="Unread"
            role="img"
          />
        ) : null}
      </span>
    </>
  );

  const classes = cn(
    "flex w-full gap-3 bg-sko-bg-page px-6 py-4 text-left transition-colors hover:bg-sko-bg-faint",
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
