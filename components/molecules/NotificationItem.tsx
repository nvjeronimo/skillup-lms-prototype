import * as React from "react";
import { BookOpen, Calendar, MessageCircle, Plus, Stars } from "lucide-react";
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

const ICON_MAP: Partial<Record<NotificationType, LucideIcon>> = {
  "course-update": Plus,
  "assignment-due": Calendar,
  "discussion-reply": MessageCircle,
  "peer-review-received": Stars,
  "syllabus-change": BookOpen,
};

/** Single notification row: unread dot + type icon avatar + content + timestamp. */
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
  const isLive = type === "live-now" || type === "live-soon";
  const IconCmp = ICON_MAP[type];

  const inner = (
    <>
      {/* Unread dot gutter */}
      <span className="flex w-2 shrink-0 justify-center pt-3.5">
        {unread ? (
          <span
            className="h-2 w-2 rounded-full bg-lms-fg-brand-primary"
            aria-label="Unread"
            role="img"
          />
        ) : null}
      </span>

      {/* Icon avatar */}
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lms-bg-brand-section text-lms-text-brand-secondary">
        {isLive ? (
          <span className="h-3.5 w-3.5 rounded-full bg-lms-text-error-primary" aria-hidden />
        ) : IconCmp ? (
          <Icon icon={IconCmp} size={18} />
        ) : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="lms-text-sm-semibold block text-lms-text-primary">{title}</span>
        {body ? (
          <span className="lms-text-sm-regular mt-0.5 block text-lms-text-secondary">{body}</span>
        ) : null}
        <span className="lms-text-xs-regular mt-1 block text-lms-text-tertiary">{timestamp}</span>
      </span>
    </>
  );

  const classes = cn(
    "flex w-full gap-2 px-2 py-3 text-left transition-colors hover:bg-lms-bg-secondary",
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
