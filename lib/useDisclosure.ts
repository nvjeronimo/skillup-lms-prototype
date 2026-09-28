"use client";

import * as React from "react";
import { useReturnFocus } from "./useDialog";

/**
 * Disclosure popup (WAI-ARIA APG disclosure pattern) — a button that shows and
 * hides a panel of ordinary buttons/links. Not an ARIA menu: Tab moves through
 * the panel as usual, so no arrow-key contract is promised.
 *
 * - Escape closes and puts focus back on the trigger;
 * - a mouse press outside `containerRef` closes it (focus stays where clicked);
 * - closing from inside the panel (an item was chosen) returns focus to the
 *   trigger instead of dropping it on <body>.
 *
 * Spread `triggerProps` on the trigger button and `panelProps` on the panel;
 * put `containerRef` on the element that wraps both.
 */
export function useDisclosure(initialOpen = false) {
  const [open, setOpen] = React.useState(initialOpen);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement & HTMLUListElement>(null);
  const panelId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useReturnFocus(open, triggerRef, panelRef);

  const toggle = React.useCallback(() => setOpen((o) => !o), []);
  const close = React.useCallback(() => setOpen(false), []);

  return {
    open,
    setOpen,
    toggle,
    close,
    containerRef,
    triggerProps: {
      ref: triggerRef,
      "aria-expanded": open,
      "aria-controls": open ? panelId : undefined,
      onClick: toggle,
    },
    panelProps: { id: panelId, ref: panelRef },
  };
}
