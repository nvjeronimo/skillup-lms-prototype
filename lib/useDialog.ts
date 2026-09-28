"use client";

import * as React from "react";

/** Everything a keyboard user can land on with Tab. */
export const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/** Focusable descendants of `root` that are actually rendered. */
export function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.getClientRects().length > 0 && !el.closest("[inert]"),
  );
}

export interface UseDialogOptions {
  /** Element to focus on open. Defaults to the first focusable in the dialog. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /**
   * Make everything outside the dialog inert while it is open, so Tab and the
   * screen-reader virtual cursor cannot reach the page behind. Default true.
   */
  inertOutside?: boolean;
  /** Close on Escape. Default true. */
  closeOnEscape?: boolean;
}

/**
 * Modal-dialog behaviour in one place (WAI-ARIA APG dialog pattern):
 * - remembers the element that had focus when the dialog opened (the trigger)
 *   and moves focus back to it when the dialog closes or unmounts;
 * - moves focus into the dialog on open;
 * - keeps Tab / Shift+Tab inside the dialog;
 * - Escape calls `onClose`;
 * - optionally sets `inert` on every element outside the dialog.
 *
 * Returns a ref for the dialog container (the element carrying role="dialog",
 * or any wrapper that contains all of its focusable content).
 */
export function useDialog<T extends HTMLElement = HTMLDivElement>(
  open: boolean,
  onClose: () => void,
  { initialFocusRef, inertOutside = true, closeOnEscape = true }: UseDialogOptions = {},
): React.RefObject<T> {
  const ref = React.useRef<T>(null);
  // Keep the latest onClose without re-running the effects on every render.
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  // Inert everything outside the dialog: walk from the dialog up to <body> and
  // mark every sibling along the way. Declared first so its cleanup (un-inert)
  // runs before the focus-return cleanup below — an inert trigger can't take focus.
  React.useEffect(() => {
    if (!open || !inertOutside) return;
    const root = ref.current;
    if (!root) return;
    const marked: HTMLElement[] = [];
    let node: HTMLElement | null = root;
    while (node && node !== document.body) {
      const parent: HTMLElement | null = node.parentElement;
      if (!parent) break;
      for (const sibling of Array.from(parent.children)) {
        if (sibling === node || !(sibling instanceof HTMLElement)) continue;
        if (sibling.hasAttribute("inert") || sibling.tagName === "SCRIPT") continue;
        // Leave live regions (the toast) alone so their messages are still announced.
        if (sibling.matches('[aria-live], [role="status"], [role="alert"]')) continue;
        sibling.setAttribute("inert", "");
        marked.push(sibling);
      }
      node = parent;
    }
    return () => marked.forEach((el) => el.removeAttribute("inert"));
  }, [open, inertOutside]);

  // Focus in on open; focus back to the trigger on close.
  React.useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => {
      const root = ref.current;
      if (!root) return;
      const target = initialFocusRef?.current ?? getFocusable(root)[0] ?? root;
      if (target === root && !root.hasAttribute("tabindex")) root.setAttribute("tabindex", "-1");
      target.focus();
    }, 0);
    return () => {
      window.clearTimeout(t);
      if (trigger && trigger.isConnected && typeof trigger.focus === "function") {
        trigger.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Escape + Tab trap.
  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      const root = ref.current;
      if (!root) return;
      if (e.key === "Escape" && closeOnEscape) {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = getFocusable(root);
      if (nodes.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active ? root.contains(active) : false;
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEscape]);

  return ref;
}

/**
 * For non-modal popups (menus, disclosures): when `open` flips to false, put
 * focus back on the trigger — but only if focus was inside the popup (or lost
 * to <body>), so a click elsewhere keeps its own focus.
 */
export function useReturnFocus(
  open: boolean,
  triggerRef: React.RefObject<HTMLElement | null>,
  popupRef: React.RefObject<HTMLElement | null>,
) {
  const wasOpen = React.useRef(open);
  React.useEffect(() => {
    if (wasOpen.current && !open) {
      const active = document.activeElement;
      const lost = !active || active === document.body;
      const inside = popupRef.current?.contains(active) ?? false;
      if (lost || inside) triggerRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open, triggerRef, popupRef]);
}
