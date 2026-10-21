"use client";

import * as React from "react";
import { useReturnFocus } from "./useDialog";
import { inertProps } from "./inert";
import { MOTION_MS } from "./motion/tokens";
import { useExitTransition } from "./useExitTransition";

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
 *
 * Motion (motion-matrix R8/R10): render the panel while `mounted` (not `open`) and give it
 * `.sk-animate-menu` (or `-menu-up` when it opens above its trigger) with an `origin-*`
 * pointing at the trigger. `panelProps` carries `data-state`, `onAnimationEnd`, and, while
 * the panel leaves, `inert` + `aria-hidden` (the CSS adds `pointer-events: none`), so a
 * closing panel is out of the tab order and never takes a click meant for what is under it.
 * Callers that still render on `open` keep working: they just close in one frame.
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

  // Kept mounted while the exit plays (short2, the menu's exit); reopening mid-exit is instant.
  const { mounted, state, onAnimationEnd } = useExitTransition(open, MOTION_MS.short2);
  const closing = mounted && !open;

  const toggle = React.useCallback(() => setOpen((o) => !o), []);
  const close = React.useCallback(() => setOpen(false), []);

  return {
    open,
    /** True while the panel is open or playing its exit: render the panel on this. */
    mounted,
    /** `"open"` | `"closed"`, also set as `data-state` through `panelProps`. */
    state,
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
    panelProps: {
      id: panelId,
      ref: panelRef,
      "data-state": state,
      onAnimationEnd,
      "aria-hidden": closing || undefined,
      ...inertProps(closing),
    },
  };
}
