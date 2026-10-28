"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";
import { Icon, Menu02 } from "@/lib/icons";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { Badge } from "@/components/atoms/Badge";
import { useLmsStore } from "@/lib/store";
import {
  AccessibilitySection,
  AppearanceSection,
  PROFILE_PANEL,
  ProfileFooter,
  ProfileLinks,
  SignOutLink,
  SkillUpOnlineLink,
} from "@/components/molecules/ProfileSettings";
import { NotificationsPanel } from "@/components/organisms/NotificationsPanel";
import { notifications } from "@/lib/data";
import { track } from "@/lib/analytics";
import { useDisclosure } from "@/lib/useDisclosure";
import { PLATFORM_SECTIONS, type PlatformSection } from "@/lib/platform/user";
import { cn } from "@/lib/utils";
import { useHasChanged } from "@/lib/motion/useHasChanged";
import { useDemoMode } from "@/lib/demo";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { PreviewDeviceSection } from "@/components/molecules/DemoControlsMenu";
import { PersonasMenuRow } from "@/components/molecules/SyntheticPersonas";
import { useLearner } from "@/lib/persona-gate";
import { toggleHarborRail, useHarbor, useHarborRailExpanded } from "@/lib/platform/harbor";
import { HarborSearch } from "./harbor/HarborSearch";
import { SearchAssistantButton } from "./harbor/SearchAssistantButton";
import { ThemeSwitch } from "@/components/molecules/ThemeSwitch";
import { SidebarToggleGlyph } from "@/components/atoms/SidebarToggle";

/** The compact menu rows: Current = bg/primary-soft + text/primary. */
function itemClass(current: boolean) {
  return cn(
    "flex items-center gap-1.5 rounded-control px-3 py-2 transition-colors",
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
  /** The section tab to mark current; null on pages outside the five (Edit profile). */
  current: PlatformSection | null;
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
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-inner bg-sko-bg-primary"
              />
            ) : null}
          </>
        );
        return (
          <li key={s.id} className={tabs ? "flex" : undefined}>
            {s.href ? (
              <Link
                href={s.href}
                aria-current={isCurrent ? "page" : undefined}
                data-topbar-tab={tabs || undefined}
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

/**
 * Profile panel: the standard profile menu (DS LMS / Profile Menu), as in the player minus its
 * preview sections. In demo mode (?demo=1) it also holds the two demo settings that act on the
 * platform pages, in the player's order: Preview device, then Loading (motion-matrix §7.9). The
 * player-only ones (content shape, quiz mode, lab launch, completion, playback) stay in the player.
 */
function ProfilePanel({
  panelProps,
  onDone,
  showTheme = false,
}: {
  panelProps: ReturnType<typeof useDisclosure>["panelProps"];
  onDone: () => void;
  /** On a phone the light / dark switch leaves the bar and lives here (Nelson, 28 Oct 2026). */
  showTheme?: boolean;
}) {
  const demo = useDemoMode();
  return (
    <div {...panelProps} role="group" aria-label="Account settings" className={PROFILE_PANEL}>
      <ProfileLinks onDone={onDone} />
      <AppearanceSection showTheme={showTheme} />
      <AccessibilitySection />
      <SignOutLink onDone={onDone} />
      <SkillUpOnlineLink onDone={onDone} />
      {demo ? (
        <PreviewDeviceSection onDone={onDone} />
      ) : null}
      <PersonasMenuRow onDone={onDone} />
      <ProfileFooter onDone={onDone} />
    </div>
  );
}

/** DS Avatar sm (32px, a rounded square: Radius/control, Nelson 19 Oct 2026, not a circle; initials body-medium/Semibold text/subtle on bg/muted, 0.75px border/subtle). */
function Initials() {
  const platformUser = useLearner();
  return (
    <span
      aria-hidden
      className="sk-text-body-medium-semibold inline-flex size-8 shrink-0 items-center justify-center rounded-control border-[0.75px] border-sko-border-subtle bg-sko-bg-muted text-sko-text-subtle"
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
 * - Compact (tablet and mobile): 64 tall, padding 8/16 — menu · logo, then notifications · theme (tablet only; on a phone it is in the profile menu) · avatar
 *   (the menu on the left since 21 Oct 2026, as in the player bar).
 *   The menu opens the sections; the DS has no open state drawn yet, so it is a plain
 *   disclosure list under the bar.
 * Calendar, Discussion and Services have no page in the prototype.
 *
 * The menu lists the sections in the order of the desktop bar (decided by Nelson on 10 Oct
 * 2026): both render `PLATFORM_SECTIONS` through `SectionLinks`, so the order cannot differ.
 * Do not give the menu a list of its own.
 */
export function PlatformTopbar({ current }: { current: PlatformSection | null }) {
  const harbor = useHarbor();
  const railExpanded = useHarborRailExpanded();
  const theme = useLmsStore((s) => s.theme);
  // The learner, or the synthetic persona once hydrated (Nelson, 25 Oct 2026; lib/persona-gate).
  const platformUser = useLearner();
  const profile = useDisclosure();
  const profileCompact = useDisclosure();
  const menu = useDisclosure();
  // On a phone the sections are in the floating bar at the bottom (PlatformTabBar, Nelson
  // 22 Oct 2026): no menu button there; the tablet keeps it.
  const phone = useBreakpoint() === "mobile";
  const router = useRouter();
  const openPanel = useLmsStore((s) => s.openPanel);
  const openOverlayPanel = useLmsStore((s) => s.openOverlayPanel);
  const closeOverlayPanel = useLmsStore((s) => s.closeOverlayPanel);
  const notificationsRead = useLmsStore((s) => s.notificationsRead);
  const markAllNotificationsRead = useLmsStore((s) => s.markAllNotificationsRead);
  const unread = notifications.filter((n) => n.unread && !notificationsRead.has(n.id)).length;
  // The unread dot pops when it appears (a new notification), not when the bar first paints.
  const dotPop = useHasChanged(unread > 0) ? "sk-animate-badge-pop" : undefined;

  // The bell opens the same Notifications panel as the player (DS LMS / Notifications Panel):
  // hybrid tabs All · Discussions · Grading · Updates with date sections, Mark all read (Nelson, 19 Oct 2026).
  const bell = (
    <button
      type="button"
      aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
      aria-haspopup="dialog"
      onClick={() => openOverlayPanel("notifications")}
      className="group relative inline-flex size-11 items-center justify-center rounded-control text-sko-icon-default transition-colors hover:bg-sko-bg-hover lg:size-8"
    >
      <Icon icon={Bell} size={20} />
      {unread ? (
        <span
          aria-hidden
          className={cn(
            dotPop,
            "absolute right-[11px] top-[10px] size-2 rounded-pill bg-sko-bg-info ring-2 ring-sko-bg-page transition-colors group-hover:ring-sko-bg-muted lg:right-[5px] lg:top-1",
          )}
        />
      ) : null}
    </button>
  );

  // DS Topbar v1.3 (Nelson, 17 Oct 2026): the light / dark switch is in the bar, not in the
  // profile menu. Since 26 Oct 2026 a mini Button group with both icons (ThemeSwitch).
  const setTheme = useLmsStore((s) => s.setTheme);
  // One size on every bar: the compact bar uses the desktop switch too (Nelson, 28 Oct 2026, DS Topbar 1.14).
  const themeSwitch = <ThemeSwitch value={theme} onChange={setTheme} size="sm" />;

  return (
    <>
      <header data-chrome="" className="sk-no-print relative z-30 border-b border-sko-border-subtle bg-sko-bg-page">
        {/* Desktop. The logo and the actions keep the bar's edges; the sections and the search
            sit in a middle column of Container/content-max-width (1200) that starts where the page
            content starts, so they line up with it (Nelson, 27 Oct 2026). The logo column is
            (100% − 1200) / 2 − 24, never narrower than the logo (104); the middle column gives way
            on the right where the actions need the room (both edges line up from about 1900).
            Harbor keeps its panel layout. */}
        <div
          className={cn(
            "hidden h-[71px] items-center px-6",
            harbor
              ? "justify-between gap-6 lg:flex xl:gap-4 min-[1440px]:gap-6"
              : "grid-cols-[max(104px,calc((100%_-_var(--sk-container-content-max-width))/2_-_24px))_minmax(min-content,var(--sk-container-content-max-width))_minmax(max-content,1fr)] gap-x-6 lg:grid",
          )}
        >
          {harbor ? (
            // Harbor (Nelson, 25 Oct 2026, after the DreamHost panel): the menu button folds the
            // rail on the left, where the sections are; the middle of the bar is the search pill.
            <div className="flex flex-1 basis-0 items-center gap-2">
              <button
                type="button"
                onClick={toggleHarborRail}
                aria-label={railExpanded ? "Collapse the navigation" : "Expand the navigation"}
                aria-expanded={railExpanded}
                className="-ml-2.5 inline-flex size-11 items-center justify-center rounded-control text-sko-border-default transition-colors hover:bg-sko-bg-hover"
              >
                {/* The ICP sidebar's own panel glyph (Nelson, 26 Oct 2026): left pane filled when the rail is open. */}
                <SidebarToggleGlyph expanded={railExpanded} />
              </button>
              <Link href="/platform/dashboard" aria-label="SkillUp, Dashboard" className="flex min-h-11 items-center">
                <SkillUpLogo className="h-[30px]" />
              </Link>
            </div>
          ) : (
            <Link
              href="/platform/dashboard"
              aria-label="SkillUp, Dashboard"
              className="flex min-h-11 shrink-0 items-center justify-self-start"
            >
              <SkillUpLogo className="h-[30px]" />
            </Link>
          )}
          {harbor ? (
            <HarborSearch width={420} />
          ) : (
            <div className="flex min-w-0 items-center justify-between gap-6 self-stretch xl:gap-4 min-[1440px]:gap-6">
              <nav aria-label="Platform" className="self-stretch [&_a]:whitespace-nowrap">
                <SectionLinks
                  current={current}
                  look="tabs"
                  className="flex h-full items-stretch gap-3 min-[1440px]:gap-6"
                />
              </nav>
              {/* Every skin has the search + Assistant pill (Nelson, 26 Oct 2026): at the end of the
                  middle column here, in the middle of the bar in the panel layout. With the five
                  tabs it needs 1280: below that the bar keeps the floating launcher. The launcher
                  always stays in the player. */}
              {/* The pill's own width (240 at rest) must not set the column's minimum, or the column
                  outgrows the bar at 1280 and pushes the actions off screen (27 Oct 2026): it sits
                  in a box that contributes no width (contain: inline-size) and shrinks into it. */}
              <div className="hidden min-w-0 flex-1 justify-end [contain:inline-size] xl:flex">
                <HarborSearch width={340} />
              </div>
            </div>
          )}
          <div className={cn("flex items-center gap-3", harbor ? "flex-1 basis-0 justify-end" : "justify-self-end")}>
            <span className="flex items-center gap-3">
              {/* Where the pill does not fit (the tabs bar below 1280): its button and sheet. */}
              {harbor ? null : <SearchAssistantButton size="sm" className="xl:hidden" />}
              {bell}
              {themeSwitch}
            </span>
            <div ref={profile.containerRef} className="relative">
              <button
                type="button"
                {...profile.triggerProps}
                aria-label={`${platformUser.name}, account`}
                className="flex items-center gap-2 rounded-control p-1 text-left transition-colors hover:bg-sko-bg-hover"
              >
                <Initials />
                {/* The name and role give way to the search button below 1280 (Nelson, 26 Oct 2026). */}
                <span className="hidden flex-col whitespace-nowrap xl:flex">
                  <span className="sk-text-body-small-semibold text-sko-text-default">
                    {platformUser.name}
                  </span>
                  <span className="sk-text-label-small-regular text-sko-text-subtle">
                    {platformUser.role}
                  </span>
                </span>
                <Icon icon={ChevronDown} size={16} className="text-sko-icon-default" />
              </button>
              {profile.mounted ? (
                <ProfilePanel panelProps={profile.panelProps} onDone={profile.close} />
              ) : null}
            </div>
          </div>
        </div>

        {/* Compact */}
        {/* DS Compact (Topbar 1.8, Nelson 21 Oct 2026): 64 with the rule, padding 8 / 16; the controls are
          44px targets, centred. Menu · logo on the left (as the player bar), Notifications · Theme ·
          learner on the right. The menu's icon sits on the 16px edge, the logo 8 after it. */}
        <div className="flex h-[63px] items-center justify-between px-4 lg:hidden">
          <div className="flex items-center">
            <div ref={menu.containerRef} hidden={phone}>
              <button
                type="button"
                {...menu.triggerProps}
                aria-label="Platform sections"
                className="-ml-2.5 inline-flex size-11 items-center justify-center rounded-control text-sko-icon-default transition-colors hover:bg-sko-bg-hover"
              >
                <Icon icon={Menu02} size={24} />
              </button>
              {/* A full-width dropdown under the bar (not a drawer): the menu motion without the
                  horizontal scale (menu-y), settling from the top. */}
              {menu.mounted ? (
                <nav
                  {...menu.panelProps}
                  aria-label="Platform"
                  className="sk-animate-menu-y origin-top absolute inset-x-0 top-full border-b border-sko-border-subtle bg-sko-bg-page px-4 py-3 shadow-lg"
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
            <Link
              href="/platform/dashboard"
              aria-label="SkillUp, Dashboard"
              className={cn("flex min-h-11 items-center", !phone && "-ml-0.5")}
            >
              <SkillUpLogo className="h-[30px]" />
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1">
              <SearchAssistantButton size="sm" />
              {bell}
              {/* Too little room on a phone: the switch moves to the profile menu, as in the player (Nelson, 28 Oct 2026). */}
              {phone ? null : themeSwitch}
            </span>
            <div ref={profileCompact.containerRef} className="relative">
              <button
                type="button"
                {...profileCompact.triggerProps}
                aria-label={`${platformUser.name}, account`}
                className="inline-flex size-11 items-center justify-center rounded-control transition-colors hover:bg-sko-bg-hover"
              >
                <Initials />
              </button>
              {profileCompact.mounted ? (
                <ProfilePanel
                  panelProps={profileCompact.panelProps}
                  onDone={profileCompact.close}
                  showTheme={phone}
                />
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Outside the header: its z-30 stacking context would cap the panel. */}
      <NotificationsPanel
        open={openPanel === "notifications"}
        onClose={closeOverlayPanel}
        notifications={notifications}
        readIds={notificationsRead}
        onMarkAllRead={() => markAllNotificationsRead(notifications.map((n) => n.id))}
        onSelect={(n) => {
          closeOverlayPanel();
          track("notification_click", { notifId: n.id, type: n.type });
          router.push(n.href);
        }}
      />
    </>
  );
}
