"use client";

import * as React from "react";
import { Bell, Bookmark, ChevronRight, Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/atoms/Avatar";
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
  showTheme?: boolean;
  /** Unread count — surfaced in the Notifications button aria-label + dot. */
  notificationsCount?: number;
  onMenu?: () => void;
  onAi?: () => void;
  onBookmark?: () => void;
  onNotifications?: () => void;
  onTheme?: () => void;
  onClose?: () => void;
  /** Replaces the default (inert) account button — e.g. the demo-settings menu. */
  accountMenu?: React.ReactNode;
  className?: string;
}

function UtilityButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-sk-text-tertiary transition-colors hover:bg-sk-bg-secondary"
    >
      {children}
    </button>
  );
}

/**
 * Course player top chrome. Matches the SKO Final Screen: SkillUp logo (left),
 * spacer, then Notifications · Saved · Avatar+name · Close (right). Breadcrumb,
 * AI and Theme are optional (off by default) and used in Storybook variants.
 */
export function CoursePlayerTopbar({
  size = "Desktop",
  breadcrumb = [],
  userName = "Olivia Rhye",
  userAvatarUrl,
  showAi = false,
  showBookmark = true,
  showNotifications = true,
  showTheme = false,
  theme = "Light",
  notificationsCount = 0,
  onMenu,
  onAi,
  onBookmark,
  onNotifications,
  onTheme,
  onClose,
  accountMenu,
  className,
}: CoursePlayerTopbarProps) {
  const isMobile = size === "Mobile";
  const isDesktop = size === "Desktop";

  return (
    <header
      className={cn(
        "flex items-center gap-3 border-b border-sk-border-secondary bg-sk-bg-primary px-4",
        isMobile ? "h-14" : "h-[60px] md:px-6",
        className,
      )}
    >
      {isMobile ? (
        <UtilityButton label="Open course menu" onClick={onMenu}>
          <Icon icon={Menu} size={20} />
        </UtilityButton>
      ) : null}

      <a
        href="#"
        aria-label="SkillUp home"
        className={cn("flex items-center", isMobile && "flex-1 justify-center")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/skillup-logo.svg" alt="SkillUp" className="h-7 w-auto" />
      </a>

      {isDesktop && breadcrumb.length ? (
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1">
          {breadcrumb.map((seg, i) => (
            <React.Fragment key={seg}>
              {i > 0 ? (
                <Icon icon={ChevronRight} size={14} className="text-sk-fg-quaternary" />
              ) : null}
              <span
                className={cn(
                  "sk-text-sm-medium truncate",
                  i === breadcrumb.length - 1 ? "text-sk-text-primary" : "text-sk-text-tertiary",
                )}
              >
                {seg}
              </span>
            </React.Fragment>
          ))}
        </nav>
      ) : null}

      <div className="flex flex-1 items-center justify-end gap-1">
        {!isMobile && showNotifications ? (
          <UtilityButton
            label={
              notificationsCount > 0 ? `Notifications, ${notificationsCount} unread` : "Notifications"
            }
            onClick={onNotifications}
          >
            <span className="relative">
              <Icon icon={Bell} size={20} />
              {notificationsCount > 0 ? (
                <span
                  className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-sk-fg-brand-primary"
                  aria-hidden
                />
              ) : null}
            </span>
          </UtilityButton>
        ) : null}
        {showBookmark ? (
          <UtilityButton label="Saved items" onClick={onBookmark}>
            <Icon icon={Bookmark} size={20} />
          </UtilityButton>
        ) : null}
        {!isMobile && showAi ? (
          <UtilityButton label="AI Assistant" onClick={onAi}>
            <Icon icon={Sparkles} size={20} />
          </UtilityButton>
        ) : null}
        {!isMobile && showTheme ? (
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
            className="ml-1 flex items-center gap-2 rounded-lg p-1 hover:bg-sk-bg-secondary"
          >
            <Avatar name={userName} src={userAvatarUrl} size="sm" />
            {!isMobile ? (
              <span className="sk-text-sm-medium pr-1 text-sk-text-primary">{userName}</span>
            ) : null}
          </button>
        )}

        <UtilityButton label="Exit course player" onClick={onClose}>
          <Icon icon={X} size={20} />
        </UtilityButton>
      </div>
    </header>
  );
}
