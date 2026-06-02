"use client";

import * as React from "react";
import { Bell, Bookmark, ChevronRight, Menu, Sparkles, Sun, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/atoms/Avatar";
import { cn } from "@/lib/utils";

export type TopbarSize = "Desktop" | "Tablet" | "Mobile";

export interface CoursePlayerTopbarProps {
  size?: TopbarSize;
  theme?: "Light" | "Dark";
  brand?: string;
  breadcrumb?: string[];
  userName?: string;
  userAvatarUrl?: string;
  showAi?: boolean;
  showBookmark?: boolean;
  showNotifications?: boolean;
  showTheme?: boolean;
  onMenu?: () => void;
  onAi?: () => void;
  onBookmark?: () => void;
  onNotifications?: () => void;
  onTheme?: () => void;
  onClose?: () => void;
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-lms-text-secondary transition-colors hover:bg-lms-bg-secondary"
    >
      {children}
    </button>
  );
}

/** Top chrome of the course player. Breadcrumb shows on Desktop only. */
export function CoursePlayerTopbar({
  size = "Desktop",
  brand = "SkillUp LMS",
  breadcrumb = [],
  userName = "Olivia Rhye",
  userAvatarUrl,
  showAi = true,
  showBookmark = true,
  showNotifications = true,
  showTheme = true,
  onMenu,
  onAi,
  onBookmark,
  onNotifications,
  onTheme,
  onClose,
  className,
}: CoursePlayerTopbarProps) {
  const isMobile = size === "Mobile";
  const isDesktop = size === "Desktop";

  return (
    <header
      className={cn(
        "flex items-center gap-3 border-b border-lms-border-secondary bg-lms-bg-primary px-4",
        isMobile ? "h-14" : "h-[60px] md:px-6",
        className,
      )}
    >
      {isMobile ? (
        <UtilityButton label="Open course menu" onClick={onMenu}>
          <Icon icon={Menu} size={20} />
        </UtilityButton>
      ) : null}

      <div className={cn("flex items-center gap-2", isMobile && "flex-1 justify-center")}>
        <span className="lms-text-md-semibold font-display text-lms-text-brand-secondary">{brand}</span>
      </div>

      {isDesktop && breadcrumb.length ? (
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1">
          {breadcrumb.map((seg, i) => (
            <React.Fragment key={seg}>
              {i > 0 ? (
                <Icon icon={ChevronRight} size={14} className="text-lms-fg-quaternary" />
              ) : null}
              <span
                className={cn(
                  "lms-text-sm-medium truncate",
                  i === breadcrumb.length - 1 ? "text-lms-text-primary" : "text-lms-text-tertiary",
                )}
              >
                {seg}
              </span>
            </React.Fragment>
          ))}
        </nav>
      ) : null}

      <div className="flex flex-1 items-center justify-end gap-1">
        {!isMobile && showAi ? (
          <UtilityButton label="AI assistant" onClick={onAi}>
            <Icon icon={Sparkles} size={20} />
          </UtilityButton>
        ) : null}
        {showBookmark ? (
          <UtilityButton label="Saved" onClick={onBookmark}>
            <Icon icon={Bookmark} size={20} />
          </UtilityButton>
        ) : null}
        {!isMobile && showNotifications ? (
          <UtilityButton label="Notifications" onClick={onNotifications}>
            <Icon icon={Bell} size={20} />
          </UtilityButton>
        ) : null}
        {!isMobile && showTheme ? (
          <UtilityButton label="Toggle theme" onClick={onTheme}>
            <Icon icon={Sun} size={20} />
          </UtilityButton>
        ) : null}
        <button type="button" aria-label="Account" className="ml-1">
          <Avatar name={userName} src={userAvatarUrl} size="sm" />
        </button>
        <UtilityButton label="Exit player" onClick={onClose}>
          <Icon icon={X} size={20} />
        </UtilityButton>
      </div>
    </header>
  );
}
