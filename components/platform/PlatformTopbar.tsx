"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { Icon } from "@/lib/icons";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { Badge } from "@/components/atoms/Badge";
import { useLmsStore, type Skin } from "@/lib/store";
import { useDisclosure } from "@/lib/useDisclosure";
import { PLATFORM_SECTIONS, platformUser, type PlatformSection } from "@/lib/platform/user";
import { cn } from "@/lib/utils";

const SKINS: { skin: Skin; label: string }[] = [
  { skin: "teal", label: "SKO" },
  { skin: "gold", label: "Gold" },
  { skin: "red", label: "Red" },
];

/** DS `LMS / Platform / Topbar item` (6373:3313): Current = bg/primary-soft + text/primary. */
function itemClass(current: boolean) {
  return cn(
    "flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors",
    current
      ? "sk-text-body-medium-semibold bg-sko-bg-primary-soft text-sko-text-primary"
      : "sk-text-body-medium-medium text-sko-text-subtle hover:bg-sko-bg-faint hover:text-sko-text-default",
  );
}

function SectionLinks({
  current,
  onPick,
  className,
  itemClassName,
}: {
  current: PlatformSection;
  onPick?: () => void;
  className?: string;
  itemClassName?: string;
}) {
  const showToast = useLmsStore((s) => s.showToast);
  return (
    <ul className={className}>
      {PLATFORM_SECTIONS.map((s) => {
        const isCurrent = s.id === current;
        const content = (
          <>
            {s.label}
            {typeof s.count === "number" ? (
              <Badge color="gray" variant="soft" size="sm" aria-label={`${s.count} items`}>
                {s.count}
              </Badge>
            ) : null}
          </>
        );
        return (
          <li key={s.id}>
            {s.href ? (
              <Link
                href={s.href}
                aria-current={isCurrent ? "page" : undefined}
                onClick={onPick}
                className={cn(itemClass(isCurrent), itemClassName)}
              >
                {content}
              </Link>
            ) : (
              // No page for this section in the prototype: say so instead of a dead link.
              <button
                type="button"
                onClick={() => {
                  onPick?.();
                  showToast(`${s.label} is not part of this prototype yet`);
                }}
                className={cn(itemClass(false), itemClassName)}
              >
                {content}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Profile panel: the learner, plus the theme and skin switches used to test the screens. */
function ProfilePanel({ panelProps }: { panelProps: ReturnType<typeof useDisclosure>["panelProps"] }) {
  const theme = useLmsStore((s) => s.theme);
  const toggleTheme = useLmsStore((s) => s.toggleTheme);
  const skin = useLmsStore((s) => s.skin);
  const setSkin = useLmsStore((s) => s.setSkin);
  return (
    <div
      {...panelProps}
      className="absolute right-0 top-[calc(100%+8px)] z-40 w-64 rounded-lg border border-sko-border-subtle bg-sko-bg-page p-3 shadow-lg"
    >
      <p className="sk-text-body-medium-semibold text-sko-text-default">{platformUser.name}</p>
      <p className="sk-text-label-small-regular text-sko-text-subtle">{platformUser.role}</p>
      <div className="mt-3 flex flex-col gap-2 border-t border-sko-border-subtle pt-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="sk-text-body-medium-medium flex min-h-11 items-center gap-2 rounded-md px-2 text-left text-sko-text-default hover:bg-sko-bg-subtle"
        >
          <Icon icon={theme === "dark" ? Sun : Moon} size={20} className="text-sko-icon-default" />
          {theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        </button>
        <div role="group" aria-label="Brand skin" className="flex gap-1">
          {SKINS.map((s) => (
            <button
              key={s.skin}
              type="button"
              aria-pressed={skin === s.skin}
              onClick={() => setSkin(s.skin)}
              className={cn(
                "sk-text-body-small-semibold inline-flex min-h-11 flex-1 items-center justify-center rounded-md transition-colors",
                skin === s.skin
                  ? "bg-sko-bg-primary text-sko-text-on-primary"
                  : "text-sko-text-subtle hover:bg-sko-bg-subtle hover:text-sko-text-default",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <Link
          href="/"
          className="sk-text-body-medium-medium flex min-h-11 items-center rounded-md px-2 text-sko-text-primary hover:bg-sko-bg-subtle"
        >
          Back to the prototype home
        </Link>
      </div>
    </div>
  );
}

/** DS Avatar sm (32px circle, initials body-medium/Semibold text/subtle on bg/muted, 0.75px border/subtle). */
function Initials() {
  return (
    <span
      aria-hidden
      className="sk-text-body-medium-semibold inline-flex size-8 shrink-0 items-center justify-center rounded-full border-[0.75px] border-sko-border-subtle bg-sko-bg-muted text-sko-text-subtle"
    >
      {platformUser.initials}
    </span>
  );
}

/**
 * DS `LMS / Platform / Topbar` (6374:3608), on every platform page while the LMS sidebar
 * is in development. Light: bg/page with a 1px border/subtle rule below.
 * - Desktop (≥1025): 72px with the rule, padding 16/24 — logo · the five sections · notifications · learner.
 * - Compact (tablet and mobile): padding 8/16 — logo · notifications · avatar · menu.
 *   The menu opens the sections; the DS has no open state drawn yet, so it is a plain
 *   disclosure list under the bar.
 * Calendar, Discussion and Services have no page in the prototype.
 */
export function PlatformTopbar({ current }: { current: PlatformSection }) {
  const showToast = useLmsStore((s) => s.showToast);
  const profile = useDisclosure();
  const profileCompact = useDisclosure();
  const menu = useDisclosure();

  const bell = (
    <button
      type="button"
      aria-label="Notifications, new"
      onClick={() => showToast("Notifications are not part of this prototype yet")}
      className="relative inline-flex size-11 items-center justify-center rounded-lg text-sko-icon-default hover:bg-sko-bg-faint lg:size-8"
    >
      <Icon icon={Bell} size={20} />
      <span aria-hidden className="absolute right-[11px] top-[10px] size-2 rounded-full bg-sko-bg-info ring-2 ring-sko-bg-page lg:right-[5px] lg:top-1" />
    </button>
  );

  return (
    <header className="sk-no-print relative z-30 border-b border-sko-border-subtle bg-sko-bg-page">
      {/* Desktop */}
      <div className="hidden h-[71px] items-center justify-between px-6 lg:flex">
        <Link href="/platform/dashboard" aria-label="SkillUp, Dashboard" className="flex min-h-11 items-center">
          <SkillUpLogo className="h-[30px]" />
        </Link>
        <nav aria-label="Platform">
          <SectionLinks current={current} className="flex items-start gap-1" />
        </nav>
        <div className="flex items-center gap-3">
          {bell}
          <div ref={profile.containerRef} className="relative">
            <button
              type="button"
              {...profile.triggerProps}
              aria-label={`${platformUser.name}, account`}
              className="flex items-center gap-2 rounded-lg p-1 text-left hover:bg-sko-bg-faint"
            >
              <Initials />
              <span className="flex flex-col whitespace-nowrap">
                <span className="sk-text-body-small-semibold text-sko-text-default">{platformUser.name}</span>
                <span className="sk-text-label-small-regular text-sko-text-subtle">{platformUser.role}</span>
              </span>
              <Icon icon={ChevronDown} size={16} className="text-sko-icon-default" />
            </button>
            {profile.open ? <ProfilePanel panelProps={profile.panelProps} /> : null}
          </div>
        </div>
      </div>

      {/* Compact */}
      {/* 49px as drawn (8 + 32 + 8 + rule): the controls are 44px targets, so the bar pads 2px. */}
      <div className="flex items-center justify-between px-4 py-0.5 lg:hidden">
        <Link href="/platform/dashboard" aria-label="SkillUp, Dashboard" className="flex min-h-11 items-center">
          <SkillUpLogo className="h-[30px]" />
        </Link>
        <div className="flex items-center gap-1">
          {bell}
          <div ref={profileCompact.containerRef} className="relative">
            <button
              type="button"
              {...profileCompact.triggerProps}
              aria-label={`${platformUser.name}, account`}
              className="inline-flex size-11 items-center justify-center rounded-full hover:bg-sko-bg-faint"
            >
              <Initials />
            </button>
            {profileCompact.open ? <ProfilePanel panelProps={profileCompact.panelProps} /> : null}
          </div>
          <div ref={menu.containerRef}>
            <button
              type="button"
              {...menu.triggerProps}
              aria-label="Platform sections"
              className="inline-flex size-11 items-center justify-center rounded-lg text-sko-icon-default hover:bg-sko-bg-faint"
            >
              <Icon icon={Menu} size={24} />
            </button>
            {menu.open ? (
              <nav
                {...menu.panelProps}
                aria-label="Platform"
                className="absolute inset-x-0 top-full border-b border-sko-border-subtle bg-sko-bg-page px-4 py-3 shadow-lg"
              >
                <SectionLinks
                  current={current}
                  onPick={menu.close}
                  className="flex flex-col gap-1"
                  itemClassName="min-h-11 w-full"
                />
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
