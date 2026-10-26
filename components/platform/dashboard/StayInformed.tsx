"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, LifeBuoy, Megaphone, type LucideIcon } from "lucide-react";
import { PlatformTabs, platformPanelId, platformTabId } from "@/components/platform/PlatformTabs";
import { Icon } from "@/lib/icons";
import { notifications } from "@/lib/data";
import { openRequests } from "@/lib/platform/services";
import type { NotificationType } from "@/lib/types";

type InformedTab = "alerts" | "updates" | "support";

/** What needs the learner (Alerts), what changed (Updates), their help-desk requests (Support). */
const ALERT_TYPES: NotificationType[] = ["live-now", "live-soon", "assignment-due"];

interface Row {
  id: string;
  title: string;
  meta: string;
  href: string;
  icon: LucideIcon;
}

const ROWS: Record<InformedTab, Row[]> = {
  alerts: notifications
    .filter((n) => ALERT_TYPES.includes(n.type))
    .map((n) => ({ id: n.id, title: n.title, meta: n.timestamp, href: n.href, icon: AlertCircle })),
  updates: notifications
    .filter((n) => !ALERT_TYPES.includes(n.type))
    .map((n) => ({ id: n.id, title: n.title, meta: n.timestamp, href: n.href, icon: Megaphone })),
  support: openRequests.map((r) => ({
    id: r.id,
    title: `#${r.number} · ${r.subject}`,
    meta: `${r.status.label} · ${r.opened}`,
    href: "/platform/services",
    icon: LifeBuoy,
  })),
};

const TABS = [
  { id: "alerts", label: "Alerts" },
  { id: "updates", label: "Updates" },
  { id: "support", label: "Support" },
] as const;

/**
 * "Stay informed" (Nelson, 25 Oct 2026, after the DreamHost panel's home; Harbor and Fluent first,
 * every skin since 26 Oct 2026): a card beside
 * "Pick up" with three tabs, Alerts · Updates · Support, each a short list of one-line rows (icon,
 * title cut with an ellipsis, when) that open where they point. The rows are the bell's
 * notifications split by kind, and the open help-desk requests of Services; the bell keeps the
 * full panel.
 */
export function StayInformed({ className }: { className?: string }) {
  const [tab, setTab] = React.useState<InformedTab>("updates");
  const idBase = React.useId();
  const rows = ROWS[tab];
  return (
    // Arrives in the Dashboard cascade with Pick up beside it (motion-matrix §7.9), as every section does.
    <section data-arrive={3} aria-labelledby={`${idBase}-title`} className={className}>
      <div className="flex h-full flex-col rounded-card border border-sko-border-subtle bg-sko-bg-page p-2">
        <h2 id={`${idBase}-title`} className="sk-text-title-medium-semibold px-3 pt-3 text-sko-text-default">
          Stay informed
        </h2>
        <PlatformTabs
          tabs={TABS}
          value={tab}
          onChange={setTab}
          idBase={idBase}
          ariaLabel="Stay informed"
          size="sm"
          rule="own"
          panels="selected"
          className="px-3 pt-2"
        />
        <div role="tabpanel" id={platformPanelId(idBase, tab)} aria-labelledby={platformTabId(idBase, tab)}>
          {rows.length ? (
            <ul className="flex flex-col">
              {rows.map((r) => (
                <li key={r.id} className="border-b border-sko-border-subtle last:border-b-0">
                  <Link
                    href={r.href}
                    className="flex min-h-14 items-center gap-3 rounded-control px-3 py-2 transition-colors hover:bg-sko-bg-hover"
                  >
                    <Icon icon={r.icon} size={18} className="shrink-0 text-sko-icon-primary" aria-hidden />
                    <span className="sk-text-body-medium-medium min-w-0 flex-1 truncate text-sko-text-default">{r.title}</span>
                    <span className="sk-text-body-small-regular shrink-0 text-sko-text-subtle">{r.meta}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="sk-text-body-medium-regular px-3 py-6 text-sko-text-subtle">Nothing here right now.</p>
          )}
        </div>
      </div>
    </section>
  );
}
