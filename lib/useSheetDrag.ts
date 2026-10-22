"use client";

import * as React from "react";
import { MOTION_MS } from "./motion/tokens";

/**
 * Drag to dismiss a sheet, drawer or panel on a touch screen (Apple, "Designing Fluid
 * Interfaces"; 22 Oct 2026). The surface follows the finger 1:1 from where it was grabbed,
 * resists past its open position (rubber band), and on release the finger's velocity decides:
 * the resting point is projected as a flick would carry it (Apple's decay projection) and the
 * surface leaves if that point is past half its size, else it settles back. Both finish from the
 * on-screen position, so there is no jump between dragging and animating.
 *
 * Touch and pen only: a mouse keeps the close button and Escape (no accidental drags while
 * selecting text). A press on a control (input, button, link) is left alone, and a drag that goes
 * mostly across the dismiss axis is left to the page (vertical scroll in a drawer).
 * Under reduced motion it still tracks the finger (direct manipulation is not decorative) but
 * leaves or settles without the finishing animation.
 */
export interface SheetDragOptions {
  /** The surface that moves. */
  panelRef: React.RefObject<HTMLElement>;
  /** Optional dim behind it: its opacity follows the drag. */
  backdropRef?: React.RefObject<HTMLElement>;
  /** Axis of the dismiss gesture: "y" for a bottom sheet, "x" for a side drawer or panel. */
  axis: "x" | "y";
  /** Direction that dismisses: 1 = down / right, -1 = up / left. */
  dir: 1 | -1;
  onDismiss: () => void;
  enabled?: boolean;
}

/** Movement before the gesture commits to a direction (hysteresis). */
const SLOP_PX = 10;
/** Apple's normal scroll deceleration. */
const DECELERATION = 0.998;
const NO_DRAG = "input, textarea, select, button, a, [role='slider'], [data-no-drag]";

/** Where a flick at `v` px/s comes to rest, from Apple's sample code. */
export function projectDistance(v: number, decelerationRate = DECELERATION): number {
  return ((v / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Past the open position the surface follows less and less (rubber band). */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/** The motion token, read from the page so the hook follows tokens/motion.css. */
function decelerate(): string {
  // token-lint-disable-next-line reads the token itself; "ease-out" only if the stylesheet is missing
  return getComputedStyle(document.documentElement).getPropertyValue("--motion-easing-standard-decelerate").trim() || "ease-out";
}

function reducedMotion(): boolean {
  return (
    document.documentElement.hasAttribute("data-reduce-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useSheetDrag({ panelRef, backdropRef, axis, dir, onDismiss, enabled = true }: SheetDragOptions) {
  const onDismissRef = React.useRef(onDismiss);
  React.useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const panel = panelRef.current;
      if (!enabled || !panel || e.pointerType === "mouse" || e.button !== 0) return;
      if ((e.target as Element).closest(NO_DRAG)) return;

      const handle = e.currentTarget;
      const pointerId = e.pointerId;
      const start = { x: e.clientX, y: e.clientY };
      const size = axis === "y" ? panel.offsetHeight : panel.offsetWidth;
      const backdrop = backdropRef?.current ?? null;
      let dragging = false;
      let offset = 0;
      const samples: { t: number; p: number }[] = [];

      const place = (value: number) => {
        const moved = value * dir;
        panel.style.transform = axis === "y" ? `translateY(${moved}px)` : `translateX(${moved}px)`;
        if (backdrop) backdrop.style.opacity = String(Math.max(0, 1 - Math.max(0, value) / size));
      };

      const move = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        const along = (axis === "y" ? ev.clientY - start.y : ev.clientX - start.x) * dir;
        const across = axis === "y" ? ev.clientX - start.x : ev.clientY - start.y;
        if (!dragging) {
          if (Math.abs(along) < SLOP_PX && Math.abs(across) < SLOP_PX) return;
          // Mostly across the axis: not ours (the drawer's list scrolls vertically).
          if (Math.abs(across) > Math.abs(along) || along < 0) return end(ev, false);
          dragging = true;
          try {
            handle.setPointerCapture(pointerId);
          } catch {
            /* the pointer is already gone: the window listeners still follow it */
          }
          panel.getAnimations().forEach((a) => a.cancel());
          // token-lint-disable-next-line the finger drives the surface: no transition while it is held
          panel.style.transition = "none";
          // token-lint-disable-next-line the finger drives the surface: no transition while it is held
          if (backdrop) backdrop.style.transition = "none";
        }
        ev.preventDefault();
        // Relative to where it was grabbed, so the surface does not jump to the finger.
        offset = along >= 0 ? along : rubberband(along, size);
        place(offset);
        samples.push({ t: ev.timeStamp, p: along });
        while (samples.length > 2 && ev.timeStamp - samples[0].t > 100) samples.shift();
      };

      const settle = (to: number, velocity: number, done: () => void) => {
        const from = offset;
        if (reducedMotion() || from === to) {
          offset = to;
          place(to);
          return done();
        }
        // The finger's speed carries into the finish: a fast flick ends fast.
        const remaining = Math.abs(to - from);
        const fromSpeed = velocity > 0 ? (remaining / velocity) * 1000 : MOTION_MS.medium2;
        const ms = Math.min(MOTION_MS.medium2, Math.max(MOTION_MS.short3, fromSpeed));
        const t = (v: number) => (axis === "y" ? `translateY(${v * dir}px)` : `translateX(${v * dir}px)`);
        const anim = panel.animate([{ transform: t(from) }, { transform: t(to) }], {
          duration: ms,
          easing: decelerate(),
          fill: "forwards",
        });
        if (backdrop) {
          backdrop.animate(
            [{ opacity: backdrop.style.opacity || "1" }, { opacity: to === 0 ? "1" : "0" }],
            { duration: ms, easing: decelerate(), fill: "forwards" },
          );
        }
        anim.onfinish = () => {
          offset = to;
          place(to);
          done();
        };
      };

      const end = (ev: PointerEvent, active = dragging) => {
        if (ev.pointerId !== pointerId) return;
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", cancel);
        try {
          if (handle.hasPointerCapture?.(pointerId)) handle.releasePointerCapture(pointerId);
        } catch {
          /* see above */
        }
        if (!active) return;
        const first = samples[0];
        const last = samples[samples.length - 1];
        const velocity = first && last && last.t > first.t ? ((last.p - first.p) / (last.t - first.t)) * 1000 : 0;
        const projected = offset + projectDistance(Math.max(0, velocity));
        if (ev.type !== "pointercancel" && projected > size / 2) {
          settle(size, velocity, () => {
            // It has already left: the closing state's own exit animation must not replay from 0.
            panel.style.animation = "none";
            onDismissRef.current();
          });
        } else {
          settle(0, Math.abs(velocity), () => {
            panel.getAnimations().forEach((a) => a.cancel());
            panel.style.transform = "";
            // token-lint-disable-next-line clears the inline override, back to the stylesheet
            panel.style.transition = "";
            if (backdrop) {
              backdrop.getAnimations().forEach((a) => a.cancel());
              backdrop.style.opacity = "";
              // token-lint-disable-next-line clears the inline override, back to the stylesheet
              backdrop.style.transition = "";
            }
          });
        }
      };
      const up = (ev: PointerEvent) => end(ev);
      const cancel = (ev: PointerEvent) => end(ev);

      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", cancel);
    },
    [panelRef, backdropRef, axis, dir, enabled],
  );

  return { onPointerDown };
}
