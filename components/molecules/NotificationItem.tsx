import * as React from "react";
import { Megaphone, MessageCircle, Plus, Stars } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/lib/types";
import styles from "./NotificationItem.module.css";

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

// One icon per Open edX notification type (Nelson, 28 Oct 2026: only what the platform sends).
const ICON_MAP: Record<NotificationType, LucideIcon> = {
  "discussion-reply": MessageCircle,
  "instructor-post": Megaphone,
  "course-update": Plus,
  "ora-grade-received": Stars,
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
      <span className={styles.iconTile}>
        <Icon icon={IconCmp} size={18} />
      </span>

      <span className={styles.body}>
        <span className={`sk-text-body-medium-semibold ${styles.title}`}>{title}</span>
        {/* One context line under the title, as Figma Overlay Card 1 (3827:65480): where it
            happened and when, "Six Sigma · Module 03 · 25 min ago" (28 Oct 2026). */}
        <span className={`sk-text-body-small-regular ${styles.context}`}>
          {body ? `${body} · ${timestamp}` : timestamp}
        </span>
      </span>

      {/* Unread dot — right side (matches Final Screens). */}
      <span className={styles.dotSlot}>
        {unread ? (
          <span
            className={styles.dot}
            aria-label="Unread"
            role="img"
          />
        ) : null}
      </span>
    </>
  );

  const classes = cn(styles.item, className);

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
