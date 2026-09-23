"use client";

import * as React from "react";
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
 * DS `Buttons/Button utility`, Size=sm. Tertiary is the bare 32px icon button;
 * Secondary adds the 1px `border-primary` outline (the mobile course-menu
 * trigger). Desktop keeps the prototype's 40px hit area.
 */
function UtilityButton({
  label,
  onClick,
  children,
  hierarchy = "tertiary",
  compact = false,
  /** Mobile close: DS `Button close X` Size=lg, a 44px square. */
  large = false,
  className,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  hierarchy?: "tertiary" | "secondary";
  compact?: boolean;
  large?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center transition-colors hover:bg-sko-bg-subtle",
        compact
          ? cn("text-sko-icon-faint", large ? "h-11 w-11 rounded-lg" : "h-8 w-8 rounded-md")
          : "h-10 w-10 rounded-lg text-sko-text-subtle",
        hierarchy === "secondary" && "border border-sko-border-default bg-sko-bg-page",
        className,
      )}
    >
      {children}
    </button>
  );
}

/**
 * Course player top chrome (DS `LMS / Course Player Topbar`). Desktop: SkillUp
 * logo (left), spacer, then Notifications · Saved · Avatar+name · Close (right).
 * Breadcrumb, AI and Theme are optional (off by default) and used in Storybook.
 *
 * Mobile (Size=Mobile, 375×56): 0/8/0/12 padding, space-between. Left, 6px
 * apart: the course-menu trigger (32px Secondary utility button, `list` icon)
 * and the logo at 33px. Right, 8px apart: Notifications · Saved (32px Tertiary)
 * · 24px round avatar · 44px close. Icons in `fg-quaternary`.
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

  if (isMobile) {
    return (
      <header
        className={cn(
          "flex h-14 items-center justify-between gap-2 border-b border-sko-border-subtle bg-sko-bg-page pl-3 pr-2",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <UtilityButton label="Open course menu" onClick={onMenu} hierarchy="secondary" compact>
            <Icon icon={List} size={20} />
          </UtilityButton>
          <a href="#" aria-label="SkillUp home" className="flex items-center">
            <SkillUpLogo className="h-[33px]" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          {showNotifications ? (
            <UtilityButton label={notificationsLabel} onClick={onNotifications} compact>
              {bell}
            </UtilityButton>
          ) : null}
          {showBookmark ? (
            <UtilityButton label="Saved items" onClick={onBookmark} compact>
              <Icon icon={Bookmark} size={20} />
            </UtilityButton>
          ) : null}
          {accountMenu ?? (
            <button type="button" aria-label="Account" className="flex items-center rounded-full">
              <Avatar name={userName} src={userAvatarUrl} size="xs" />
            </button>
          )}
          <UtilityButton label="Exit course player" onClick={onClose} compact large>
            <Icon icon={X} size={20} />
          </UtilityButton>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "flex h-[60px] items-center gap-3 border-b border-sko-border-subtle bg-sko-bg-page px-4 md:px-6",
        className,
      )}
    >
      <a href="#" aria-label="SkillUp home" className="flex items-center">
        <SkillUpLogo className="h-7" />
      </a>

      {isDesktop && breadcrumb.length ? (
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1">
          {breadcrumb.map((seg, i) => (
            <React.Fragment key={seg}>
              {i > 0 ? (
                <Icon icon={ChevronRight} size={14} className="text-sko-icon-faint" />
              ) : null}
              <span
                className={cn(
                  "sk-text-sm-medium truncate",
                  i === breadcrumb.length - 1 ? "text-sko-text-default" : "text-sko-text-subtle",
                )}
              >
                {seg}
              </span>
            </React.Fragment>
          ))}
        </nav>
      ) : null}

      <div className="flex flex-1 items-center justify-end gap-1">
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
        {showAi ? (
          <UtilityButton label="AI Assistant" onClick={onAi}>
            <Icon icon={Sparkles} size={20} />
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
          <button
            type="button"
            aria-label="Account"
            className="ml-1 flex items-center gap-2 rounded-lg p-1 hover:bg-sko-bg-subtle"
          >
            <Avatar name={userName} src={userAvatarUrl} size="sm" shape="square" />
            <span className="sk-text-sm-medium pr-1 text-sko-text-default">{userName}</span>
          </button>
        )}

        <UtilityButton label="Exit course player" onClick={onClose}>
          <Icon icon={X} size={20} />
        </UtilityButton>
      </div>
    </header>
  );
}
