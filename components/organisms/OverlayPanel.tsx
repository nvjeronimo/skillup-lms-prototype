import * as React from "react";
import { X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { FilterChip } from "@/components/atoms/FilterChip";
import { cn } from "@/lib/utils";
import { useDialog } from "@/lib/useDialog";
import { useExitTransition } from "@/lib/useExitTransition";
import { useSheetDrag } from "@/lib/useSheetDrag";
import { MOTION_MS } from "@/lib/motion/tokens";
import { inertProps } from "@/lib/inert";
import styles from "./OverlayPanel.module.css";

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
 * (useDialog). Closing plays the slide back out before the panel leaves the DOM; focus
 * returns and the page wakes up at the start of that exit.
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

  const { mounted, state, onAnimationEnd } = useExitTransition(open, MOTION_MS.short4);
  // Swipe the panel back to the right to close it on a touch screen (Apple, 22 Oct 2026).
  const panelRef = React.useRef<HTMLElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const drag = useSheetDrag({ panelRef, backdropRef, axis: "x", dir: 1, onDismiss: onClose, enabled: open });

  if (!mounted) return null;
  const closed = state === "closed";

  return (
    <div
      ref={dialogRef}
      data-state={state}
      aria-hidden={closed || undefined}
      {...inertProps(closed)}
      className={cn(styles.root, closed && styles.closed)}
    >
      {/* Backdrop — SKO DS light dim + blur (token-bound via .sk-backdrop). */}
      <div ref={backdropRef} className={`sk-backdrop sk-animate-fade sk-backdrop-panel ${styles.backdrop}`} onClick={onClose} aria-hidden />

      <aside
        ref={panelRef}
        onPointerDown={drag.onPointerDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onAnimationEnd={onAnimationEnd}
        className={`sk-animate-slide-right ${styles.panel}`}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={`sk-text-title-medium-semibold ${styles.title}`}>
            {title}
          </h2>
          <div className={styles.headerActions}>
            {headerAction ? (
              <button
                type="button"
                onClick={headerAction.onClick}
                // A quiet text action (Nelson's ICP panel 7497:132529, 24 Oct 2026): body-medium Medium,
                // text/primary, no rule; underline on hover. Its 44 target comes from "larger targets".
                className={`sk-text-body-medium-medium ${styles.textAction} ${styles.colorTransition}`}
              >
                {headerAction.label}
              </button>
            ) : null}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className={`${styles.close} ${styles.colorTransition}`}
            >
              <Icon icon={X} size={20} />
            </button>
          </div>
        </header>

        {filters && filters.length ? (
          <div className={styles.filters}>
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

        <div className={`sk-scroll ${styles.scrollBody}`}>{children}</div>

        {footer ? (
          <footer className={styles.footer}>
            <a href={footer.href} className={`sk-text-body-medium-semibold ${styles.footerLink} ${styles.colorTransition}`}>
              {footer.label}
            </a>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}

/** Sticky section label inside a panel body (semantic heading, eyebrow style). */
/* Every panel's body follows Nelson's ICP panel (7497:132529, 24 Oct 2026): the scroll area is
   bg/subtle; PanelBody insets the content 16 from the sides; each group of rows is a PanelGroup (white
   rows, each closed by a border/subtle rule underneath, as in the ICP); a PanelSectionLabel sits 24 in from the inset. */
export function PanelSectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className={`sk-text-label-small-medium ${styles.sectionLabel}`}>{children}</h3>;
}

export function PanelBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(styles.body, className)}>{children}</div>;
}

export function PanelGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(styles.group, className)}>
      {children}
    </div>
  );
}
