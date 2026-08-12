"use client";

import * as React from "react";
import { OverlayPanel, PanelSectionLabel } from "./OverlayPanel";
import { NotificationItem } from "@/components/molecules/NotificationItem";
import { PanelTabs } from "@/components/molecules/PanelTabs";
import { notificationCategory } from "@/lib/data";
import type { NotificationCategory, NotificationModel } from "@/lib/types";

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

const TAB_DEFS: { value: NotificationCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "discussions", label: "Discussions" },
  { value: "grading", label: "Grading" },
  { value: "updates", label: "Updates" },
];

/**
 * Notifications panel with hybrid grouping: activity-category tabs
 * (All · Discussions · Grading · Updates) with date sections inside each tab.
 */
export function NotificationsPanel({
  open,
  onClose,
  notifications,
  readIds = new Set(),
  onMarkAllRead,
  onSelect,
}: NotificationsPanelProps) {
  const [tab, setTab] = React.useState<NotificationCategory>("all");

  // Reset to "All" whenever the panel re-opens.
  React.useEffect(() => {
    if (open) setTab("all");
  }, [open]);

  const visible = notifications.filter(
    (n) => tab === "all" || notificationCategory(n.type) === tab,
  );

  const tabs = TAB_DEFS.map((t) => ({
    ...t,
    count:
      t.value === "all"
        ? notifications.length
        : notifications.filter((n) => notificationCategory(n.type) === t.value).length,
  }));

  return (
    <OverlayPanel
      open={open}
      onClose={onClose}
      title="Notifications"
      headerAction={onMarkAllRead ? { label: "Mark all read", onClick: onMarkAllRead } : undefined}
      footer={{ label: "View all notifications", href: "#" }}
    >
      <PanelTabs
        tabs={tabs}
        active={tab}
        onChange={(v) => setTab(v as NotificationCategory)}
        ariaLabel="Notification categories"
      />

      {visible.length === 0 ? (
        <p className="sk-text-sm-regular px-4 py-8 text-center text-sk-text-tertiary">
          You are all caught up.
        </p>
      ) : (
        GROUP_ORDER.map((group) => {
          const items = visible.filter((n) => n.group === group);
          if (!items.length) return null;
          return (
            <section key={group} className="mb-2">
              <PanelSectionLabel>{GROUP_LABEL[group]}</PanelSectionLabel>
              <div className="divide-y divide-sk-border-secondary">
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
        })
      )}
    </OverlayPanel>
  );
}
