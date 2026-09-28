"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { FilterChip } from "@/components/atoms/FilterChip";
import { cn } from "@/lib/utils";
import { useDialog } from "@/lib/useDialog";

export interface OverlayPanelFilter {
  label: string;
  value: string;
  count: number;
  active?: boolean;
}

export interface OverlayPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  headerAction?: { label: string; onClick: () => void };
  filters?: OverlayPanelFilter[];
  onFilterChange?: (value: string) => void;
  footer?: { label: string; href: string };
  children: React.ReactNode;
}

/**
 * Shared right-overlay chrome: backdrop + slide-in panel + header + scroll body +
 * footer. Esc + backdrop close. Focus is trapped while open, the page behind is
 * inert, first focus = close X, and focus returns to the trigger on close
 * (useDialog).
 */
export function OverlayPanel({
  open,
  onClose,
  title,
  headerAction,
  filters,
  onFilterChange,
  footer,
  children,
}: OverlayPanelProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const titleId = React.useId();
  const dialogRef = useDialog(open, onClose, { initialFocusRef: closeRef });

  if (!open) return null;

  return (
    <div ref={dialogRef} className="fixed inset-0 z-50">
      {/* Backdrop — SKO DS light dim + blur (token-bound via .sk-backdrop). */}
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onClose} aria-hidden />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="sk-animate-slide-right absolute right-0 top-0 flex h-full w-full flex-col border-l border-sko-border-subtle bg-sko-bg-page md:w-[480px]"
      >
        <header className="flex items-center justify-between gap-2 border-b border-sko-border-subtle px-6 py-5">
          <h2 id={titleId} className="sk-text-lg-semibold text-sko-text-default">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {headerAction ? (
              <button
                type="button"
                onClick={headerAction.onClick}
                // DS Link Button_def Brand/Primary (text-only: px-1 = structure 2 + label 2).
                className="sk-text-sm-semibold inline-flex items-center border-b border-sko-icon-primary px-1 pb-[3px] pt-1 text-sko-text-primary transition-colors hover:bg-sko-bg-faint"
              >
                {headerAction.label}
              </button>
            ) : null}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sko-icon-subtle hover:bg-sko-bg-subtle"
            >
              <Icon icon={X} size={20} />
            </button>
          </div>
        </header>

        {filters && filters.length ? (
          <div className="flex items-center gap-2 border-b border-sko-border-subtle px-6 py-3">
            {filters.map((f) => (
              <FilterChip
                key={f.value}
                label={f.label}
                count={f.count}
                active={f.active}
                onClick={() => onFilterChange?.(f.value)}
              />
            ))}
          </div>
        ) : null}

        <div className="sk-scroll flex-1 overflow-y-auto">{children}</div>

        {footer ? (
          <footer className="border-t border-sko-border-subtle px-6 py-4 text-center">
            <a href={footer.href} className="sk-text-sm-semibold inline-flex items-center border-b border-sko-icon-primary px-1 pb-[3px] pt-1 text-sko-text-primary transition-colors hover:bg-sko-bg-faint">
              {footer.label}
            </a>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}

/** Sticky section label inside a panel body (semantic heading, eyebrow style). */
export function PanelSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="sk-text-2xs-medium bg-sko-bg-subtle px-4 py-2.5 text-sko-text-subtle">
      {children}
    </h3>
  );
}
