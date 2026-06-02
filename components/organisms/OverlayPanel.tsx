"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { FilterChip } from "@/components/atoms/FilterChip";
import { cn } from "@/lib/utils";

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

const FOCUSABLE =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

/**
 * Shared right-overlay chrome: backdrop + slide-in panel + header + scroll body +
 * footer. Esc + backdrop close. Focus is trapped while open; first focus = close X.
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
  const panelRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const titleId = React.useId();

  // Focus the close button when opening.
  React.useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => closeRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Esc to close + Tab focus trap.
  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        ).filter((el) => el.offsetParent !== null);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop — teal-tinted via color-mix on the text-primary token. */}
      <div
        className="lms-animate-fade absolute inset-0"
        style={{ background: "color-mix(in srgb, var(--lms-text-primary) 50%, transparent)" }}
        onClick={onClose}
        aria-hidden
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="lms-animate-slide-right absolute right-0 top-0 flex h-full w-full flex-col border-l border-lms-border-secondary bg-lms-bg-primary md:w-[480px]"
      >
        <header className="flex items-center justify-between gap-2 border-b border-lms-border-secondary px-6 py-5">
          <h2 id={titleId} className="lms-text-lg-semibold text-lms-text-primary">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {headerAction ? (
              <button
                type="button"
                onClick={headerAction.onClick}
                className="lms-text-sm-medium text-lms-text-brand-secondary"
              >
                {headerAction.label}
              </button>
            ) : null}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-lms-text-tertiary hover:bg-lms-bg-secondary"
            >
              <Icon icon={X} size={20} />
            </button>
          </div>
        </header>

        {filters && filters.length ? (
          <div className="flex items-center gap-2 border-b border-lms-border-secondary px-6 py-3">
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

        <div className="lms-scroll flex-1 overflow-y-auto px-4 py-2">{children}</div>

        {footer ? (
          <footer className="border-t border-lms-border-secondary px-6 py-4 text-center">
            <a href={footer.href} className="lms-text-sm-medium text-lms-text-brand-secondary">
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
    <h3 className="lms-text-2xs-medium sticky top-0 z-10 bg-lms-bg-secondary px-2 py-1.5 text-lms-text-tertiary">
      {children}
    </h3>
  );
}
