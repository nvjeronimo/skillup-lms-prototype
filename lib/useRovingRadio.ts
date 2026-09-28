"use client";

import * as React from "react";

/**
 * Roving tabindex for a `role="radiogroup"` of buttons (WAI-ARIA APG radio
 * group): the group is one Tab stop — the checked option, or the first when
 * none is checked — and the arrow keys move focus AND check, wrapping at the
 * ends; Home / End jump to the first / last option. Space and Enter still
 * activate the focused button through its own onClick.
 *
 * Spread `itemProps(i)` on each option.
 */
export function useRovingRadio(
  count: number,
  selectedIndex: number,
  onSelect: (index: number) => void,
  { disabled = false }: { disabled?: boolean } = {},
) {
  const refs = React.useRef<Array<HTMLElement | null>>([]);
  const tabStop = selectedIndex >= 0 && selectedIndex < count ? selectedIndex : 0;

  const move = (to: number) => {
    const i = (to + count) % count;
    onSelect(i);
    refs.current[i]?.focus();
  };

  const itemProps = (i: number) => ({
    ref: (el: HTMLElement | null) => {
      refs.current[i] = el;
    },
    tabIndex: i === tabStop ? 0 : -1,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (disabled) return;
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          move(i + 1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          move(i - 1);
          break;
        case "Home":
          e.preventDefault();
          move(0);
          break;
        case "End":
          e.preventDefault();
          move(count - 1);
          break;
      }
    },
  });

  return { itemProps };
}
