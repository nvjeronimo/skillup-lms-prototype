"use client";

import * as React from "react";
import { OverlayPanel, PanelSectionLabel } from "./OverlayPanel";
import { NotificationItem } from "@/components/molecules/NotificationItem";
import { notificationCategory } from "@/lib/data";
import { cn } from "@/lib/utils";
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

const TABS: { value: NotificationCategory; label: string }[] = [
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
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Reset to "All" whenever the panel re-opens.
  React.useEffect(() => {
    if (open) setTab("all");
  }, [open]);

  const visible = notifications.filter(
    (n) => tab === "all" || notificationCategory(n.type) === tab,
  );

  function onTabKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + dir + TABS.length) % TABS.length;
    setTab(TABS[nextIndex].value);
    tabRefs.current[nextIndex]?.focus();
  }

  const unreadCount = notifications.filter((n) => n.unread && !readIds.has(n.id)).length;

  return (
    <OverlayPanel
      open={open}
      onClose={onClose}
      title="Notifications"
      headerAction={onMarkAllRead ? { label: "Mark all read", onClick: onMarkAllRead } : undefined}
      footer={{ label: "View all notifications", href: "#" }}
    >
      <div
        role="tablist"
        aria-label="Notification categories"
        className="sticky top-0 z-20 -mx-2 mb-1 flex items-center gap-1 border-b border-lms-border-secondary bg-lms-bg-primary px-2"
      >
        {TABS.map((t, i) => {
          const active = t.value === tab;
          return (
            <button
              key={t.value}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(t.value)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={cn(
                "lms-text-sm-semibold -mb-px border-b-2 px-3 py-2.5 transition-colors",
                active
                  ? "border-lms-border-brand text-lms-text-brand-secondary"
                  : "border-transparent text-lms-text-secondary hover:text-lms-text-primary",
              )}
            >
              {t.label}
              {t.value === "all" && unreadCount > 0 ? (
                <span className="lms-text-xs-semibold ml-1 text-lms-text-tertiary">{unreadCount}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="lms-text-sm-regular px-2 py-8 text-center text-lms-text-tertiary">
          Nothing here yet.
        </p>
      ) : (
        GROUP_ORDER.map((group) => {
          const items = visible.filter((n) => n.group === group);
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
        })
      )}
    </OverlayPanel>
  );
}
