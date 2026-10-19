"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { Icon } from "@/lib/icons";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { Badge } from "@/components/atoms/Badge";
import { useLmsStore } from "@/lib/store";
import {
  AccessibilitySection,
  AppearanceSection,
  PROFILE_PANEL,
  ProfileFooter,
  ProfileHeader,
} from "@/components/molecules/ProfileSettings";
import { useDisclosure } from "@/lib/useDisclosure";
import { PLATFORM_SECTIONS, platformUser, type PlatformSection } from "@/lib/platform/user";
import { cn } from "@/lib/utils";

/** The compact menu rows: Current = bg/primary-soft + text/primary. */
function itemClass(current: boolean) {
  return cn(
    "flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors",
    current
      ? "sk-text-body-medium-semibold bg-sko-bg-primary-soft text-sko-text-primary"
      : "sk-text-body-medium-medium text-sko-text-subtle hover:bg-sko-bg-faint hover:text-sko-text-default",
  );
}

/**
 * The desktop bar: DS `LMS/Platform/Navigation/Topbar-Item` v2.0, an underline tab that fills the
 * height of the bar (body-large Semibold, padding 0/4). `Current=On` is text/primary with a 3px
 * bg/primary bar along the bottom, sitting on the rule of the top bar. These stay links in a
 * <nav> with `aria-current`, not an ARIA tablist: each one opens another page.
 */
function tabClass(current: boolean) {
  return cn(
    "sk-text-body-large-semibold relative flex items-center gap-2 px-1 transition-colors",
    current ? "text-sko-text-primary" : "text-sko-text-subtle hover:text-sko-text-default",
  );
}

function SectionLinks({
  current,
  look = "menu",
  onPick,
  className,
  itemClassName,
}: {
  current: PlatformSection;
  /** `tabs`: the desktop bar. `menu`: the rows of the compact menu. */
  look?: "tabs" | "menu";
  onPick?: () => void;
  className?: string;
  itemClassName?: string;
}) {
  const showToast = useLmsStore((s) => s.showToast);
  const tabs = look === "tabs";
  const itemLook = tabs ? tabClass : itemClass;
  return (
    <ul className={className}>
      {PLATFORM_SECTIONS.map((s) => {
        const isCurrent = s.id === current;
        const content = (
          <>
            {s.label}
            {typeof s.count === "number" ? (
              <Badge
                color={tabs && isCurrent ? "brand" : "gray"}
                variant="soft"
                size={tabs ? "md" : "sm"}
                aria-label={`${s.count} items`}
              >
                {s.count}
              </Badge>
            ) : null}
            {tabs && isCurrent ? (
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-[2px] bg-sko-bg-primary" />
            ) : null}
          </>
        );
        return (
          <li key={s.id} className={tabs ? "flex" : undefined}>
            {s.href ? (
              <Link
                href={s.href}
                aria-current={isCurrent ? "page" : undefined}
                onClick={onPick}
                className={cn(itemLook(isCurrent), itemClassName)}
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
                className={cn(itemLook(false), itemClassName)}
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

/** Profile panel: the standard profile menu (DS LMS / Profile Menu), as in the player minus its preview sections. */
function ProfilePanel({ panelProps, onDone }: { panelProps: ReturnType<typeof useDisclosure>["panelProps"]; onDone: () => void }) {
  return (
    <div {...panelProps} role="group" aria-label="Account settings" className={PROFILE_PANEL}>
      <ProfileHeader name={platformUser.name} role={platformUser.role} />
      <AppearanceSection />
      <AccessibilitySection />
      <ProfileFooter onDone={onDone} />
    </div>
  );
}

/** DS Avatar sm (32px circle, initials body-medium/Semibold text/subtle on bg/muted, 0.75px border/subtle). */
function Initials() {
  return (
    <span
      aria-hidden
      data-chrome-avatar=""
      className="sk-text-body-medium-semibold inline-flex size-8 shrink-0 items-center justify-center rounded-full border-[0.75px] border-sko-border-subtle bg-sko-bg-muted text-sko-text-subtle"
    >
      {platformUser.initials}
    </span>
  );
}

/**
 * DS `LMS / Platform / Topbar` (6374:3608), on every platform page while the LMS sidebar
 * is in development. Light: bg/page with a 1px border/subtle rule below.
 * - Desktop (≥1025): 72px with the rule, padding 16/24 — logo · the five sections · notifications · theme · learner.
 *   The sections are five DS `Topbar-Item` (v2.0, Nelson, 12 Oct 2026): underline tabs that fill
 *   the height of the bar, 24 apart (12 until 12 Oct), with no rule of their own. The page sets which one is current;
 *   in Figma that is `Current=On` on the item, there is no property for it on the Topbar.
 * - Compact (tablet and mobile): 64 tall, padding 8/16 — logo · notifications · theme · avatar · menu.
 *   The menu opens the sections; the DS has no open state drawn yet, so it is a plain
 *   disclosure list under the bar.
 * Calendar, Discussion and Services have no page in the prototype.
 *
 * The menu lists the sections in the order of the desktop bar (decided by Nelson on 10 Oct
 * 2026): both render `PLATFORM_SECTIONS` through `SectionLinks`, so the order cannot differ.
 * Do not give the menu a list of its own.
 */
export function PlatformTopbar({ current }: { current: PlatformSection }) {
  const showToast = useLmsStore((s) => s.showToast);
  const theme = useLmsStore((s) => s.theme);
  const toggleTheme = useLmsStore((s) => s.toggleTheme);
  const profile = useDisclosure();
  const profileCompact = useDisclosure();
  const menu = useDisclosure();
  // Maré: the bar's own controls take the dark-mode tokens so they read on the deep-teal bar.
  const skin = useLmsStore((st) => st.skin);
  const ink = skin === "mare" ? { "data-theme": "dark", "data-chrome-ink": "" } : {};

  const bell = (
    <button
      type="button"
      aria-label="Notifications, new"
      onClick={() => showToast("Notifications are not part of this prototype yet")}
      className="relative inline-flex size-11 items-center justify-center rounded-lg text-sko-icon-default transition-colors hover:bg-sko-bg-faint lg:size-8"
    >
      <Icon icon={Bell} size={20} />
      <span aria-hidden className="absolute right-[11px] top-[10px] size-2 rounded-full bg-sko-bg-info ring-2 ring-sko-bg-page lg:right-[5px] lg:top-1" />
    </button>
  );

  // DS Topbar v1.3 (Nelson, 17 Oct 2026): the light / dark switch is in the bar, not in the
  // profile menu: a Utility Button (sm, Tertiary) after the notifications, moon-01 in light, sun in dark.
  const themeButton = (
    <button
      type="button"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => toggleTheme()}
      className="inline-flex size-11 items-center justify-center rounded-lg text-sko-icon-default transition-colors hover:bg-sko-bg-faint lg:size-8"
    >
      <Icon icon={theme === "dark" ? Sun : Moon} size={20} />
    </button>
  );

  return (
    // Maré skin (proposal, 19 Oct 2026): the bar turns deep teal; its own controls read on it as
    // in dark mode (`ink`), the panels that open from it keep the page's theme.
    <header data-chrome="" className="sk-no-print relative z-30 border-b border-sko-border-subtle bg-sko-bg-page">
      {/* Desktop */}
      <div className="hidden h-[71px] items-center justify-between px-6 lg:flex">
        <Link href="/platform/dashboard" aria-label="SkillUp, Dashboard" {...ink} className="flex min-h-11 items-center">
          <SkillUpLogo className="h-[30px]" />
        </Link>
        <nav aria-label="Platform" {...ink} className="self-stretch">
          <SectionLinks current={current} look="tabs" className="flex h-full items-stretch gap-6" />
        </nav>
        <div className="flex items-center gap-3">
          <span {...ink} className="flex items-center gap-3">
            {bell}
            {themeButton}
          </span>
          <div ref={profile.containerRef} className="relative">
            <button
              type="button"
              {...ink}
              {...profile.triggerProps}
              aria-label={`${platformUser.name}, account`}
              className="flex items-center gap-2 rounded-lg p-1 text-left transition-colors hover:bg-sko-bg-faint"
            >
              <Initials />
              <span className="flex flex-col whitespace-nowrap">
                <span className="sk-text-body-small-semibold text-sko-text-default">{platformUser.name}</span>
                <span className="sk-text-label-small-regular text-sko-text-subtle">{platformUser.role}</span>
              </span>
              <Icon icon={ChevronDown} size={16} className="text-sko-icon-default" />
            </button>
            {profile.open ? <ProfilePanel panelProps={profile.panelProps} onDone={profile.close} /> : null}
          </div>
        </div>
      </div>

      {/* Compact */}
      {/* DS Compact (Topbar 1.3, Nelson 17 Oct 2026): 64 with the rule, padding 8 / 16; the controls are
          44px targets, centred. Notifications · Theme · learner · Menu. */}
      <div className="flex h-[63px] items-center justify-between px-4 lg:hidden">
        <Link href="/platform/dashboard" aria-label="SkillUp, Dashboard" {...ink} className="flex min-h-11 items-center">
          <SkillUpLogo className="h-[30px]" />
        </Link>
        <div className="flex items-center gap-1">
          <span {...ink} className="flex items-center gap-1">
            {bell}
            {themeButton}
          </span>
          <div ref={profileCompact.containerRef} className="relative">
            <button
              type="button"
              {...ink}
              {...profileCompact.triggerProps}
              aria-label={`${platformUser.name}, account`}
              className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-sko-bg-faint"
            >
              <Initials />
            </button>
            {profileCompact.open ? <ProfilePanel panelProps={profileCompact.panelProps} onDone={profileCompact.close} /> : null}
          </div>
          <div ref={menu.containerRef}>
            <button
              type="button"
              {...ink}
              {...menu.triggerProps}
              aria-label="Platform sections"
              className="inline-flex size-11 items-center justify-center rounded-lg text-sko-icon-default transition-colors hover:bg-sko-bg-faint"
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
