"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Bookmark, ChevronRight, List, MessagesSquare, Moon, Sparkles, Sun, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/atoms/Avatar";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { cn } from "@/lib/utils";

export type TopbarSize = "Desktop" | "Tablet" | "Mobile";

export interface CoursePlayerTopbarProps {
  size?: TopbarSize;
  theme?: "Light" | "Dark";
  breadcrumb?: string[];
  userName?: string;
  userAvatarUrl?: string;
  showAi?: boolean;
  showBookmark?: boolean;
  showNotifications?: boolean;
  showDiscussions?: boolean;
  showTheme?: boolean;
  /** Unread count — surfaced in the Notifications button aria-label + dot. */
  notificationsCount?: number;
  onMenu?: () => void;
  /** Mobile course-menu state: drives aria-expanded on the trigger. */
  menuExpanded?: boolean;
  /** Id of the course-menu drawer, for aria-controls on the trigger. */
  menuControls?: string;
  onAi?: () => void;
  onDiscussions?: () => void;
  onBookmark?: () => void;
  onNotifications?: () => void;
  onTheme?: () => void;
  onClose?: () => void;
  /** Replaces the default (inert) account button — e.g. the demo-settings menu. */
  accountMenu?: React.ReactNode;
  className?: string;
}

/**
 * DS `Buttons/Button utility`, Size=sm, on every topbar size: a 32px square,
 * padding 6 (Spacing/sm), radius 6 (Radius/fixed-sm), 20px icon in `icon/subtle`.
 * Tertiary is the bare button; Secondary adds a 1px `border/default` outline on
 * `bg/page` (the mobile course-menu trigger). `large` is DS `Button close X`
 * Size=lg: 44px, padding 8, radius 8. Hover (all three): `bg/faint`.
 *
 * The icon is `icon/subtle` at rest, not the DS `icon/faint`: faint on `bg/page`
 * is about 1.77:1, below WCAG 1.4.11's 3:1 (audit TB-02). DS rebind pending: the
 * Button utility and Button close X Default icon should bind `icon/subtle`.
 */
function UtilityButton({
  label,
  onClick,
  children,
  hierarchy = "tertiary",
  /** Close: DS `Button close X` Size=lg, a 44px square. */
  large = false,
  className,
  ...aria
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  hierarchy?: "tertiary" | "secondary";
  large?: boolean;
  className?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?: "dialog";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      {...aria}
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-sko-icon-subtle transition-colors hover:bg-sko-bg-faint",
        large ? "h-11 w-11 rounded-lg" : "h-8 w-8 rounded-md",
        hierarchy === "secondary" && "border border-sko-border-default bg-sko-bg-page",
        className,
      )}
    >
      {children}
    </button>
  );
}

/**
 * Course player top chrome (DS `LMS / Course Player Topbar`).
 *
 * Desktop (60px, padding 8/16/8/24) and Tablet (padding 8/16/8/20): two rows
 * 16px apart. Left row (32px apart on Desktop, 24 on Tablet): the 114×33 logo
 * and, on Desktop, the breadcrumb. Right row, 8px apart: AI · Notifications ·
 * Saved (32px Tertiary utility) · Theme · account button (32px square avatar
 * + name, the profile style from PR #9) · 44px close. Breadcrumb, AI and Theme
 * are optional (off by default) and used in Storybook; Discussions has no DS slot.
 *
 * Mobile (Size=Mobile, 375×56): 0/8/0/12 padding, space-between. Left, 6px
 * apart: the course-menu trigger (32px Secondary utility button, `list` icon)
 * and the logo at 33px. Right, 8px apart: Notifications · Saved (32px Tertiary)
 * · 24px round avatar · 44px close. Icons in `icon/subtle` (see UtilityButton).
 */
export function CoursePlayerTopbar({
  size = "Desktop",
  breadcrumb = [],
  userName = "Olivia Rhye",
  userAvatarUrl,
  showAi = false,
  showBookmark = true,
  showNotifications = true,
  showDiscussions = false,
  showTheme = false,
  theme = "Light",
  notificationsCount = 0,
  onMenu,
  menuExpanded = false,
  menuControls,
  onAi,
  onDiscussions,
  onBookmark,
  onNotifications,
  onTheme,
  onClose,
  accountMenu,
  className,
}: CoursePlayerTopbarProps) {
  const isMobile = size === "Mobile";
  const isDesktop = size === "Desktop";

  const notificationsLabel =
    notificationsCount > 0 ? `Notifications, ${notificationsCount} unread` : "Notifications";
  const bell = (
    <span className="relative">
      <Icon icon={Bell} size={20} />
      {notificationsCount > 0 ? (
        <span
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-sko-bg-primary"
          aria-hidden
        />
      ) : null}
    </span>
  );
  // DS `Button close X` Size=lg: x-close at 24px. The DS draws a 1.5 stroke; locked
  // decision 013 (icons >= 24px use 2px) wins, so iconStroke(24) gives 2.
  const closeIcon = <Icon icon={X} size={24} />;

  if (isMobile) {
    return (
      <header
        className={cn(
          "flex h-14 items-center justify-between gap-2 border-b border-sko-border-subtle bg-sko-bg-page pl-3 pr-2",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <UtilityButton
            label="Open course menu"
            onClick={onMenu}
            hierarchy="secondary"
            aria-haspopup="dialog"
            aria-expanded={menuExpanded}
            aria-controls={menuExpanded ? menuControls : undefined}
          >
            <Icon icon={List} size={20} />
          </UtilityButton>
          {/* 44px target on mobile; the mark itself stays 33px. */}
          <Link href="/" aria-label="SkillUp, My Learning" className="flex min-h-11 items-center">
            <SkillUpLogo className="h-[33px]" />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {showNotifications ? (
            <UtilityButton label={notificationsLabel} onClick={onNotifications}>
              {bell}
            </UtilityButton>
          ) : null}
          {showBookmark ? (
            <UtilityButton label="Saved items" onClick={onBookmark}>
              <Icon icon={Bookmark} size={20} />
            </UtilityButton>
          ) : null}
          {accountMenu ?? (
            <button type="button" aria-label="Account" className="flex items-center rounded-full">
              <Avatar name={userName} src={userAvatarUrl} size="xs" />
            </button>
          )}
          <UtilityButton label="Exit course player" onClick={onClose} large>
            {closeIcon}
          </UtilityButton>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        // DS padding 8/16/8/24 (Desktop) · 8/16/8/20 (Tablet); the 60px height with
        // items-center covers the 8px vertical padding.
        "flex h-[60px] items-center gap-4 border-b border-sko-border-subtle bg-sko-bg-page",
        isDesktop ? "pl-6 pr-4" : "pl-5 pr-4",
        className,
      )}
    >
      <div className={cn("flex min-w-0 flex-1 items-center", isDesktop ? "gap-8" : "gap-6")}>
        <Link href="/" aria-label="SkillUp, My Learning" className="flex shrink-0 items-center">
          <SkillUpLogo className="h-[33px]" />
        </Link>

        {isDesktop && breadcrumb.length ? (
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2">
            {breadcrumb.map((seg, i) => (
              <React.Fragment key={seg}>
                {i > 0 ? (
                  <Icon icon={ChevronRight} size={16} className="shrink-0 text-sko-icon-faint" />
                ) : null}
                <span
                  className={cn(
                    "sk-text-sm-semibold truncate",
                    i === breadcrumb.length - 1 ? "text-sko-text-primary" : "text-sko-text-subtle",
                  )}
                >
                  {seg}
                </span>
              </React.Fragment>
            ))}
          </nav>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {showAi ? (
          <UtilityButton label="AI Assistant" onClick={onAi}>
            <Icon icon={Sparkles} size={20} />
          </UtilityButton>
        ) : null}
        {showNotifications ? (
          <UtilityButton label={notificationsLabel} onClick={onNotifications}>
            {bell}
          </UtilityButton>
        ) : null}
        {showBookmark ? (
          <UtilityButton label="Saved items" onClick={onBookmark}>
            <Icon icon={Bookmark} size={20} />
          </UtilityButton>
        ) : null}
        {showDiscussions ? (
          <UtilityButton label="Discussions" onClick={onDiscussions}>
            <Icon icon={MessagesSquare} size={20} />
          </UtilityButton>
        ) : null}
        {showTheme ? (
          <UtilityButton
            label={theme === "Dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={onTheme}
          >
            <Icon icon={theme === "Dark" ? Sun : Moon} size={20} />
          </UtilityButton>
        ) : null}

        {accountMenu ?? (
          // Account button: 32px square avatar (PR #9 squares the profile avatar to
          // match the topbar icon buttons and CTAs; the DS `Avatar label group` draws a
          // 24px circle), 8px gap, name in body-medium/Semibold.
          <button type="button" aria-label="Account" className="flex items-center gap-2 rounded-md">
            <Avatar name={userName} src={userAvatarUrl} size="sm" shape="square" />
            <span className="sk-text-sm-semibold text-sko-text-default">{userName}</span>
          </button>
        )}

        <UtilityButton label="Exit course player" onClick={onClose} large>
          {closeIcon}
        </UtilityButton>
      </div>
    </header>
  );
}
