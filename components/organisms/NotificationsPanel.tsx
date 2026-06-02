"use client";

import * as React from "react";
import { OverlayPanel, PanelSectionLabel } from "./OverlayPanel";
import { NotificationItem } from "@/components/molecules/NotificationItem";
import type { NotificationModel } from "@/lib/types";

export interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: NotificationModel[];
  /** Set of notification IDs marked read locally. */
  readIds?: Set<string>;
  onMarkAllRead?: () => void;
  onSelect?: (n: NotificationModel) => void;
}

const GROUP_LABEL: Record<NotificationModel["group"], string> = {
  today: "Today",
  yesterday: "Yesterday",
  "this-week": "Earlier this week",
  older: "Older",
};

const GROUP_ORDER: NotificationModel["group"][] = ["today", "yesterday", "this-week", "older"];

/** Notifications panel: grouped notification list inside the shared overlay chrome. */
export function NotificationsPanel({
  open,
  onClose,
  notifications,
  readIds = new Set(),
  onMarkAllRead,
  onSelect,
}: NotificationsPanelProps) {
  return (
    <OverlayPanel
      open={open}
      onClose={onClose}
      title="Notifications"
      headerAction={onMarkAllRead ? { label: "Mark all read", onClick: onMarkAllRead } : undefined}
      footer={{ label: "View all notifications", href: "#" }}
    >
      {GROUP_ORDER.map((group) => {
        const items = notifications.filter((n) => n.group === group);
        if (!items.length) return null;
        return (
          <section key={group} className="mb-2">
            <PanelSectionLabel>{GROUP_LABEL[group]}</PanelSectionLabel>
            <div className="divide-y divide-lms-border-secondary">
              {items.map((n) => (
                <NotificationItem
                  key={n.id}
                  type={n.type}
                  title={n.title}
                  body={n.body}
                  timestamp={n.timestamp}
                  unread={n.unread && !readIds.has(n.id)}
                  onClick={() => onSelect?.(n)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </OverlayPanel>
  );
}
