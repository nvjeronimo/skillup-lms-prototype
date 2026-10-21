"use client";

import * as React from "react";

/**
 * True once `value` has differed from what it was on the first render (and from then on).
 * For entrances that should play on a later switch but not on the page's own first paint:
 * a tab panel fades in when the learner changes tab, not on top of the page entrance.
 *
 * Reading `first.current` during render is SSR/hydration-safe: it is set once from the first
 * render's value and never written again, so server and client render the same result (false)
 * on that first pass; only a later change of `value` can flip it.
 */
export function useHasChanged<T>(value: T): boolean {
  const first = React.useRef(value);
  const [changed, setChanged] = React.useState(false);
  React.useEffect(() => {
    if (!changed && !Object.is(value, first.current)) setChanged(true);
  }, [value, changed]);
  return changed || !Object.is(value, first.current);
}
