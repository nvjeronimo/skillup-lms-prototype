"use client";

import * as React from "react";
import { OverlayPanel, PanelBody, PanelGroup, PanelSectionLabel } from "./OverlayPanel";
import { NotificationItem } from "@/components/molecules/NotificationItem";
import { PanelTabs } from "@/components/molecules/PanelTabs";
import { notificationCategory } from "@/lib/data";
import type { NotificationCategory, NotificationModel } from "@/lib/types";
import { staggerStyle } from "@/lib/motion/stagger";

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
 * Layout as every panel (OverlayPanel: PanelBody, PanelSectionLabel, PanelGroup).
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

  // The rows in the order they are drawn (by group): the order they rise in.
  const rowOrder = GROUP_ORDER.flatMap((group) => visible.filter((n) => n.group === group).map((n) => n.id));

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

      {/* A new category cross-fades the list; the rows rise one after the other. */}
      <PanelBody key={tab} className="sk-animate-fade sk-enter-only">
        {visible.length === 0 ? (
          <p className="sk-text-body-medium-regular px-6 py-8 text-center text-sko-text-subtle">
            You are all caught up.
          </p>
        ) : (
          GROUP_ORDER.map((group) => {
            const items = visible.filter((n) => n.group === group);
            if (!items.length) return null;
            return (
              <section key={group}>
                <PanelSectionLabel>{GROUP_LABEL[group]}</PanelSectionLabel>
                <PanelGroup>
                  {items.map((n) => (
                    <div
                      key={n.id}
                      className="sk-animate-rise sk-rise-nudge sk-enter-only"
                      style={staggerStyle(rowOrder.indexOf(n.id), rowOrder.length)}
                    >
                      <NotificationItem
                        type={n.type}
                        title={n.title}
                        body={n.body}
                        timestamp={n.timestamp}
                        unread={n.unread && !readIds.has(n.id)}
                        onClick={() => onSelect?.(n)}
                      />
                    </div>
                  ))}
                </PanelGroup>
              </section>
            );
          })
        )}
      </PanelBody>
    </OverlayPanel>
  );
}
